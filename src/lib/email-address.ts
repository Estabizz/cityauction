// Safe to import in client forms; transport settings stay server-side.
export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return domain ? `${local.slice(0, 2)}•••@${domain}` : "your email address";
}
