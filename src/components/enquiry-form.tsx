"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";
type FieldName = "firstName" | "lastName" | "phone" | "email";

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p className="field-error" id={id} role="alert">{message}</p> : null;
}

export function EnquiryForm() {
  const [status, setStatus] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

  function clearError(field: FieldName) {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const validationErrors: Partial<Record<FieldName, string>> = {};

    if (!firstName) validationErrors.firstName = "Enter your first name.";
    if (!lastName) validationErrors.lastName = "Enter your last name.";
    if (phone.length < 8 || phone.length > 20) validationErrors.phone = "Enter a phone number between 8 and 20 characters.";
    if (!email) validationErrors.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) validationErrors.email = "Enter a valid email address.";
    setErrors(validationErrors);
    setMessage("");
    if (Object.keys(validationErrors).length) {
      const firstInvalid = Object.keys(validationErrors)[0] as FieldName;
      form.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("loading");
    const payload = Object.fromEntries(formData.entries());
    payload.name = `${firstName} ${lastName}`;
    delete payload.firstName;
    delete payload.lastName;

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("The enquiry service is temporarily unavailable. Please try again or contact the website administrator.");
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We couldn't submit your enquiry. Please try again.");
      setStatus("success");
      setMessage("Thank you. Your interest has been registered. Our team will be in touch.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
      <label><span className="field-label">Your name <span className="required-asterisk">*</span></span><div className="name-fields"><div className="input-with-error"><input id="enquiry-name" name="firstName" placeholder="First name" autoComplete="given-name" required minLength={1} maxLength={50} aria-invalid={Boolean(errors.firstName)} aria-describedby={errors.firstName ? "first-name-error" : undefined} onChange={() => clearError("firstName")} /><FieldError id="first-name-error" message={errors.firstName} /></div><div className="input-with-error"><input name="lastName" placeholder="Last name" autoComplete="family-name" required minLength={1} maxLength={50} aria-invalid={Boolean(errors.lastName)} aria-describedby={errors.lastName ? "last-name-error" : undefined} onChange={() => clearError("lastName")} /><FieldError id="last-name-error" message={errors.lastName} /></div></div></label>
      <div className="form-row">
        <label><span className="field-label">Mobile number <span className="required-asterisk">*</span></span><input name="phone" type="tel" placeholder="+91 98765 43210" autoComplete="tel" required minLength={8} maxLength={20} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} onChange={() => clearError("phone")} /><FieldError id="phone-error" message={errors.phone} /></label>
        <label><span className="field-label">Your E-mail Address <span className="required-asterisk">*</span></span><input name="email" type="email" placeholder="you@company.com" autoComplete="email" required maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} onChange={() => clearError("email")} /><FieldError id="email-error" message={errors.email} /></label>
      </div>
      {/* <label><span className="field-label">I am interested in <span className="required-asterisk">*</span></span>
        <select name="interest" required defaultValue="" aria-invalid={Boolean(errors.interest)} aria-describedby={errors.interest ? "interest-error" : undefined} onChange={() => clearError("interest")}>
          <option value="" disabled>Select your interest</option>
          <option value="Subscription Plans">Subscription Plans</option>
          <option value="NewsLetter">NewsLetter</option>
          <option value="Office space">Office space</option>
        </select>
        <FieldError id="interest-error" message={errors.interest} />
      </label> */}
      {/* <label>Leave Your Message <small>(Optional)</small><textarea name="message" placeholder="Tell us a little about what you are looking for..." rows={4} maxLength={1500} /></label> */}
      {/* <div className="consent-field"><div className="consent-row"><input type="checkbox" id="consent" name="consent" value="yes" required aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "consent-error" : undefined} onChange={() => clearError("consent")} /><label htmlFor="consent">I agree to be contacted about this project and accept the privacy notice.</label></div><FieldError id="consent-error" message={errors.consent} /></div>
      <div className="honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div> */}
      <button className="button button-submit" type="submit" disabled={status === "loading"}>
        {status === "loading" ? <>Submitting <LoaderCircle className="spin" size={17} /></> : <>Know more about Corner CoWorks<ArrowRight size={17} /></>}
      </button>
      {message && <div className={`form-message ${status}`} role="status">{status === "success" && <CheckCircle2 size={18} />}{message}</div>}
      <p className="form-privacy">Your information is kept confidential and used only to respond to your enquiry.</p>
    </form>
  );
}
