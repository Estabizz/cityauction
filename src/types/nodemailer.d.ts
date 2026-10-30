// Narrow declaration of the SMTP API used here. The runtime dependency is
// Nodemailer; no application code depends on untyped transport internals.
declare module "nodemailer" {
  interface SmtpOptions {
    host: string;
    port: number;
    secure: boolean;
    requireTLS: boolean;
    auth: { user: string; pass: string };
    connectionTimeout: number;
    greetingTimeout: number;
    socketTimeout: number;
    disableFileAccess: boolean;
    disableUrlAccess: boolean;
  }
  interface MailMessage {
    from: { name: string; address: string };
    to: string;
    subject: string;
    text: string;
  }
  interface Transport {
    sendMail(message: MailMessage): Promise<{ accepted: unknown[]; rejected: unknown[] }>;
    close(): void;
  }
  const nodemailer: { createTransport(options: SmtpOptions): Transport };
  export default nodemailer;
}
