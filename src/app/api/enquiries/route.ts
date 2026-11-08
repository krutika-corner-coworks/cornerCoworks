import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export const runtime = "nodejs";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(8).max(20),
  email: z.email().max(254),
  interest: z.enum([
    "Office space",
    "Flexible Plans",
    "NewsLetter"
  ]),
  message: z.string().trim().max(1500).optional().default(""),
  consent: z.literal("yes"),
  website: z.string().optional().default(""),
});

function getClientIp(request: NextRequest) {
  // x-forwarded-for is set by many hosting proxies. Configure your trusted proxy
  // correctly in production; do not accept arbitrary client-supplied IP headers.
  const forwarded = request.headers.get("x-forwarded-for");
  const candidate = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
  return candidate.replace(/^::ffff:/, "").slice(0, 64) || null;
}

async function getApproximateLocation(ip: string | null) {
  if (!ip || process.env.ENABLE_IP_GEOLOCATION === "false") return null;
  if (["127.0.0.1", "::1", "localhost"].includes(ip)) return "Local development environment";
  try {
    const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      signal: AbortSignal.timeout(3500),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (data.error) return null;
    return [data.city, data.region, data.country_name].filter(Boolean).join(", ") || null;
  } catch {
    return null;
  }
}

async function sendEmail(lead: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFICATION_EMAIL;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !to || !from) throw new Error("Email integration is not configured.");

  const details = [
    ["Name", lead.name], ["Phone", lead.phone], ["Email", lead.email],
    ["Interest", lead.interest], ["Message", lead.message || "—"],
    ["IP address", lead.ip_address || "Unavailable"],
    ["Approximate location", lead.ip_location || "Unavailable"],
    ["Submitted at", lead.created_at],
  ];
  const html = `<div style="font-family:Arial,sans-serif;color:#17202a;max-width:640px"><h2>New Corner CoWorks enquiry</h2><p>A visitor has submitted an enquiry through the website.</p><table cellpadding="9" cellspacing="0" style="border-collapse:collapse;width:100%">${details.map(([key, value]) => `<tr><td style="border:1px solid #ddd;font-weight:bold;width:190px">${key}</td><td style="border:1px solid #ddd">${escapeHtml(String(value ?? ""))}</td></tr>`).join("")}</table></div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from, to: [to], subject: `New Corner CoWorks enquiry — ${lead.name}`,
      reply_to: String(lead.email), html,
    }),
  });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}.`);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[char] || char);
}

async function sendWhatsAppTemplate(lead: Record<string, unknown>) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const adminNumber = process.env.WHATSAPP_ADMIN_NUMBER;
  const template = process.env.WHATSAPP_TEMPLATE_NAME;
  const language = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en";
  if (!token || !phoneId || !adminNumber || !template) throw new Error("WhatsApp integration is not configured.");

  const parameters = [
    lead.name, lead.phone, lead.email, lead.interest, lead.message || "—",
    lead.ip_address || "Unavailable", lead.ip_location || "Unavailable", lead.created_at,
  ].map((value) => ({ type: "text", text: String(value ?? "—").slice(0, 900) }));

  const response = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: adminNumber,
      type: "template",
      template: {
        name: template,
        language: { code: language },
        components: [{ type: "body", parameters }],
      },
    }),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`WhatsApp provider returned ${response.status}: ${errorBody.slice(0, 300)}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = enquirySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please check the form details and try again." }, { status: 400 });
    }

    // Quietly accept bot submissions that fill the hidden honeypot field.
    if (parsed.data.website) return NextResponse.json({ ok: true });

    const ip = getClientIp(request);
    const ipLocation = await getApproximateLocation(ip);
    const createdAt = new Date().toISOString();

    const lead = {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      interest: parsed.data.interest,
      message: parsed.data.message,
      ip_address: ip,
      ip_location: ipLocation,
      created_at: createdAt,
      consent: true,
    };

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "The enquiry service is not configured yet. Please contact the website administrator." }, { status: 503 });
    }

    let supabaseHost: string;
    try {
      supabaseHost = new URL(supabaseUrl).hostname;
    } catch {
      return NextResponse.json({ error: "The Supabase project URL is invalid. Check the server configuration." }, { status: 503 });
    }
    if (supabaseHost === "supabase.com" || supabaseHost === "app.supabase.com") {
      return NextResponse.json({ error: "Set SUPABASE_URL to the Project URL from Supabase Project Settings > API, not the dashboard URL." }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { error: dbError } = await supabase.from("enquiries").insert(lead);
    if (dbError) {
      console.error("Supabase insert failed:", dbError.message);
      if (dbError.message.toLowerCase().includes("invalid api key")) {
        return NextResponse.json({ error: "Supabase rejected the API key. Set SUPABASE_SERVICE_ROLE_KEY to a server-side key from the same project as SUPABASE_URL." }, { status: 503 });
      }
      if (dbError.message.toLowerCase().includes("fetch failed")) {
        return NextResponse.json({ error: "The enquiry service cannot reach Supabase. Check the Project URL and network connection." }, { status: 503 });
      }
      return NextResponse.json({ error: "We couldn't save your enquiry right now. Please try again shortly." }, { status: 500 });
    }

    // Save first. Notification failures do not discard a lead already stored in the DB.
    const [emailResult, whatsappResult] = await Promise.allSettled([
      sendEmail(lead),
      sendWhatsAppTemplate(lead),
    ]);
    if (emailResult.status === "rejected") console.error("Email notification failed:", emailResult.reason);
    if (whatsappResult.status === "rejected") console.error("WhatsApp notification failed:", whatsappResult.reason);

    return NextResponse.json({
      ok: true,
      notifications: {
        email: emailResult.status === "fulfilled" ? "sent" : "failed",
        whatsapp: whatsappResult.status === "fulfilled" ? "sent" : "failed",
      },
    });
  } catch (error) {
    console.error("Enquiry API error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
