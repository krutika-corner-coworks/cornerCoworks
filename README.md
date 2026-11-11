# TechPark Coming Soon

A responsive, cinematic coming-soon landing page for a Tech Park / commercial real-estate development. Built with Next.js App Router, TypeScript, Tailwind CSS v4, Supabase PostgreSQL, Resend email and Meta WhatsApp Cloud API.

## Included

- Full-screen muted looping construction-video hero
- Responsive sections for project vision, highlights and location
- Enquiry form with validation and explicit consent tracking when provided
- Server-side IP capture and optional approximate IP-based location
- Supabase lead storage
- Email notification through Resend
- WhatsApp notification using an approved WhatsApp message template
- Honeypot field for basic bot filtering
- Environment-based project branding and credentials

## 1. Requirements

- Node.js 20.9 or later
- npm
- Supabase project
- Resend account and a verified sender domain
- Meta WhatsApp Business Cloud API setup

## 2. Install and run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

On Windows PowerShell, copy the environment template with:

```powershell
Copy-Item .env.example .env.local
```

Edit `.env.local` and add the credentials described below. The enquiry API will not accept a real lead until Supabase is configured.

## 3. Supabase database setup

1. Create a project at https://supabase.com.
2. Open **SQL Editor** in the Supabase dashboard.
3. Run the contents of `supabase/schema.sql`.
4. In **Project Settings > API**, copy the Project URL and `service_role` key.
5. Add them to `.env.local`:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Keep the service-role key private. Never prefix it with `NEXT_PUBLIC_`, commit it to Git, or put it in frontend code.

## 4. Email notification with Resend

1. Create an account at https://resend.com.
2. Verify a domain you control and configure its DNS records.
3. Create an API key.
4. Set:

```env
RESEND_API_KEY=re_...
NOTIFICATION_EMAIL=your-inbox@yourdomain.com
EMAIL_FROM=TechPark Website <leads@yourdomain.com>
```

The sender address must belong to a domain verified in Resend. For local testing, use a sender/domain permitted by your Resend account.

## 5. WhatsApp notification setup

The app sends a WhatsApp **template message** to the admin number. Business-initiated WhatsApp messages generally require an approved template.

1. Set up a Meta app and WhatsApp Business Platform / Cloud API.
2. Add or verify the business phone number.
3. Generate a suitable permanent access token with the required WhatsApp permissions.
4. In WhatsApp Manager, create and get approval for a template named `new_lead_notification` (or set your own name in `.env.local`).
5. Use language `en` and add exactly **8 body text variables** in this order:

```text
New TechPark enquiry

Name: {{1}}
Phone: {{2}}
Email: {{3}}
Interest: {{4}}
Message: {{5}}
IP address: {{6}}
Approx. location: {{7}}
Submitted at: {{8}}
```

6. Set these variables:

```env
WHATSAPP_ACCESS_TOKEN=YOUR_META_ACCESS_TOKEN
WHATSAPP_PHONE_NUMBER_ID=YOUR_PHONE_NUMBER_ID
WHATSAPP_ADMIN_NUMBER=91XXXXXXXXXX
WHATSAPP_TEMPLATE_NAME=new_lead_notification
WHATSAPP_TEMPLATE_LANGUAGE=en
```

Use the admin recipient number in international format with digits only (for example, country code + number, without `+`, spaces or dashes). Check Meta's current Cloud API requirements and template approval status before going live.

## 6. Construction background video

Add your licensed MP4 file at:

`public/videos/construction.mp4`

The hero already references this path. The video is autoplay, muted, looping and inline on mobile. If no video is present, the included SVG poster is used as a visual fallback. Use footage you own or are licensed to use.

## 7. Project branding and contact details

Edit `.env.local`:

```env
NEXT_PUBLIC_PROJECT_NAME=YOUR TECH PARK NAME
NEXT_PUBLIC_PROJECT_LOCATION=Bhopal, Madhya Pradesh
NEXT_PUBLIC_PROJECT_TAGLINE=Building the future. Creating possibilities.
NEXT_PUBLIC_CONTACT_PHONE=+91XXXXXXXXXX
NEXT_PUBLIC_CONTACT_EMAIL=info@example.com
```

The current design uses `TECHPARK` as a placeholder brand. Replace it with the client's actual project name and logo before launch.

## 8. Test the enquiry flow

1. Ensure Supabase, Resend and WhatsApp environment variables are configured.
2. Start the app with `npm run dev`.
3. Submit the form using a real test email and phone number.
4. Check the `enquiries` table in Supabase.
5. Check the notification inbox and WhatsApp admin device.
6. If a notification fails, inspect the terminal/server logs. The lead is saved before notifications are attempted.

The API response reports notification delivery status, but the user-facing form confirms successful lead storage. A failed notification does not delete the saved lead.

## 9. Deploy

Recommended: Vercel.

1. Push the project to a private Git repository.
2. Import it into Vercel.
3. Add all `.env.local` values in Vercel Project Settings > Environment Variables.
4. Deploy and connect the client's domain.
5. Add `https://your-domain.com` as `NEXT_PUBLIC_SITE_URL` if you add that variable to the environment.
6. Test the production form and notification integrations.

## 10. Production checklist

Before public launch:

- Replace all placeholder project copy, location and contact details.
- Add the approved construction video and project logo.
- Publish a privacy policy explaining lead collection, contact consent, IP logging and third-party processing.
- Confirm the client's legal basis and retention period for storing IP and enquiry data.
- Restrict database access and keep the Supabase service-role key server-only.
- Configure trusted proxy/IP handling for the hosting provider. Do not blindly trust arbitrary forwarded IP headers.
- IP-derived location is approximate and can be wrong (VPNs, mobile networks and ISP routing). It is not GPS location.
- Add a production rate limiter (for example Upstash Redis) and CAPTCHA/Turnstile before advertising the site.
- Configure monitoring, backups and a data-retention process.
- Test on mobile, slow networks and major browsers.

## Future additions

The current database structure is ready to extend with an authenticated admin dashboard, lead statuses, CSV export, project progress updates, a gallery, CRM integration and multiple project pages. Those features are not included in this initial coming-soon release.

## Admin dashboard setup

The admin dashboard is available at `/admin`. It uses Supabase Auth for sign-in and a server-only service-role client for reading/updating enquiry records. Only the email configured in `ADMIN_EMAIL` is authorised by the admin API.

1. In Supabase, open **Authentication → Users** and create/invite the administrator account. Use the same email address in `ADMIN_EMAIL`.
2. Add these values to `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
   ADMIN_EMAIL=admin@yourdomain.com
   ```

   The public anon/publishable key is intended for browser authentication. Never put the service-role key in a `NEXT_PUBLIC_` variable.
3. In Supabase **SQL Editor**, run the updated `supabase/schema.sql` script. If the enquiries table already exists, the migration adds the `status` column used by the dashboard.
4. Restart the development server (`Ctrl+C`, then `npm run dev`) and visit `http://localhost:3000/admin`.
5. Sign in with the administrator account created in Supabase Authentication.

The dashboard supports enquiry search, status filtering, status updates, lead details, CSV export and sign-out. The API verifies the Supabase access token and checks that its user email matches `ADMIN_EMAIL` before allowing access. For production, use a strong unique admin password, enable MFA in Supabase where possible, and restrict administrator account creation to trusted personnel.
