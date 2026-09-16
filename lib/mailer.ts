import nodemailer from "nodemailer";

// A single place that sends mail, so switching providers later is an .env
// change instead of a code edit.
//
// EMAIL_PROVIDER="gmail"   -> Gmail SMTP. Free, no domain needed, and it can
//                             send to ANY recipient. Use this now.
// EMAIL_PROVIDER="resend"  -> Resend. Only switch to this once you own a
//                             domain and have verified it at resend.com/domains.

type SendArgs = {
  to: string;
  subject: string;
  html: string;
};

type SendResult = {
  ok: boolean;
  error?: string;
};

const PROVIDER = (process.env.EMAIL_PROVIDER || "gmail").toLowerCase();

async function sendWithGmail({ to, subject, html }: SendArgs): Promise<SendResult> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return {
      ok: false,
      error: "GMAIL_USER or GMAIL_APP_PASSWORD is not set in the environment.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user,
      // This must be a 16-character Google App Password, NOT your normal
      // Gmail password. Google rejects normal passwords over SMTP now.
      pass: pass.replace(/\s+/g, ""),
    },
  });

  try {
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "MetaPulse"}" <${user}>`,
      to,
      subject,
      html,
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown SMTP error";

    // The single most common failure — worth naming explicitly so you don't
    // lose an hour to it.
    if (/535|Username and Password not accepted|Invalid login/i.test(message)) {
      return {
        ok: false,
        error:
          "Gmail rejected the login. Make sure 2-Step Verification is ON for that Google account and that GMAIL_APP_PASSWORD is a 16-character App Password (not your normal Gmail password).",
      };
    }

    return { ok: false, error: message };
  }
}

async function sendWithResend({ to, subject, html }: SendArgs): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "RESEND_API_KEY is not set in the environment." };
  }

  // Imported lazily so you don't need the `resend` package installed at all
  // while you're on the Gmail provider.
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const from = process.env.RESEND_FROM || "MetaPulse <onboarding@resend.dev>";

  const { error } = await resend.emails.send({ from, to, subject, html });

  if (error) {
    if (/only send testing emails|verify a domain/i.test(error.message || "")) {
      return {
        ok: false,
        error:
          "Resend is still using its test sender, so it can only deliver to your own Resend account email. Verify a domain at resend.com/domains and set RESEND_FROM to an address on it — or set EMAIL_PROVIDER=gmail.",
      };
    }
    return { ok: false, error: error.message };
  }

  return { ok: true };
}

export async function sendMail(args: SendArgs): Promise<SendResult> {
  if (PROVIDER === "resend") return sendWithResend(args);
  return sendWithGmail(args);
}

export function passwordResetTemplate(resetUrl: string) {
  return `
  <div style="background-color:#030712;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <div style="max-width:480px;margin:0 auto;background-color:#0a0f1d;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:40px;">
      <h1 style="color:#a3e635;font-size:22px;margin:0 0 8px;">MetaPulse</h1>
      <h2 style="color:#ffffff;font-size:18px;margin:0 0 16px;">Password Reset Request</h2>
      <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0 0 24px;">
        You requested to reset your password. Click the button below to set a new one. This link is valid for 1 hour.
      </p>
      <a href="${resetUrl}" style="display:inline-block;background-color:#a3e635;color:#0f172a;padding:12px 28px;font-weight:600;font-size:14px;border-radius:10px;text-decoration:none;">
        Reset Password
      </a>
      <p style="color:#64748b;font-size:12px;line-height:1.6;margin:28px 0 0;">
        If the button doesn't work, copy this link into your browser:<br>
        <span style="color:#94a3b8;word-break:break-all;">${resetUrl}</span>
      </p>
      <p style="color:#64748b;font-size:12px;margin:20px 0 0;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  </div>`;
}
