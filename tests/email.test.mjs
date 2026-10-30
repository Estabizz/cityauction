import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSource } from "./helpers/source-loader.mjs";

function setup({ port = "465", accepted = true, failure = false, configured = true } = {}) {
  const settings = configured ? { SMTP_HOST: "smtp.company.test", SMTP_PORT: port, SMTP_USER: "company@example.test", SMTP_PASSWORD: "test-only-password", MAIL_FROM: "company@example.test" } : {};
  const calls = { options: null, message: null, closed: false };
  const mail = loadSource("src/lib/email.ts", { nodemailer: {
    createTransport(options) {
      calls.options = options;
      return {
        async sendMail(message) {
          calls.message = message;
          if (failure) throw new Error("Provider error with sensitive data");
          return { accepted: accepted ? [message.to] : [], rejected: accepted ? [] : [message.to] };
        },
        close() { calls.closed = true; },
      };
    },
  } }, { process: { env: settings } });
  return { mail, calls };
}

for (const port of ["465", "587"]) {
  test(`SMTP email uses authenticated encrypted transport on ${port}`, async () => {
    const { mail, calls } = setup({ port });
    await mail.sendOtpEmail("buyer@example.test", "123456");
    assert.equal(calls.options.secure, port === "465");
    assert.equal(calls.options.requireTLS, port === "587");
    assert.equal(calls.options.disableFileAccess, true);
    assert.equal(calls.options.disableUrlAccess, true);
    assert.equal(calls.message.to, "buyer@example.test");
    assert.equal(calls.message.from.address, "company@example.test");
    assert.match(calls.message.text, /123456/);
    assert.match(calls.message.text, /10 minutes/);
    assert.equal(calls.closed, true);
  });
}

test("missing email credentials fail without opening a transport", async () => {
  const { mail, calls } = setup({ configured: false });
  assert.equal(mail.emailConfigured(), false);
  await assert.rejects(mail.sendOtpEmail("buyer@example.test", "123456"));
  assert.equal(calls.options, null);
});

test("plaintext SMTP ports are rejected", async () => {
  const { mail, calls } = setup({ port: "25" });
  await assert.rejects(mail.sendOtpEmail("buyer@example.test", "123456"));
  assert.equal(calls.options, null);
});

for (const options of [{ accepted: false }, { failure: true }]) {
  test(`SMTP rejection/failure returns a generic delivery error: ${JSON.stringify(options)}`, async () => {
    const { mail, calls } = setup(options);
    await assert.rejects(mail.sendOtpEmail("buyer@example.test", "123456"), (e) => e.message === "Email delivery failed. Please try again shortly.");
    assert.equal(calls.closed, true);
  });
}
