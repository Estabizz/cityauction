import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadSource } from "./helpers/source-loader.mjs";

const { activateDialog } = loadSource("src/lib/dialog-focus.ts");

function dialogFixture(empty = false) {
  const events = new Map();
  const doc = {
    body: { style: { overflow: "auto" } },
    addEventListener: (name, callback) => events.set(name, callback),
    removeEventListener: (name) => events.delete(name),
  };
  const node = (visible = true) => ({ isConnected: true, tabIndex: 0, focus() { doc.activeElement = this; }, getClientRects: () => visible ? [{}] : [] });
  const trigger = node();
  const first = node();
  const last = node();
  const hidden = node(false);
  doc.activeElement = trigger;
  const panel = { ownerDocument: doc, querySelectorAll: () => empty ? [] : [hidden, first, last], contains: (element) => [panel, first, last, hidden].includes(element), focus() { doc.activeElement = this; } };
  let closed = 0;
  const cleanup = activateDialog(panel, () => { closed++; });
  function key(value, shiftKey = false) {
    let prevented = false;
    events.get("keydown")?.({ key: value, shiftKey, preventDefault() { prevented = true; }, stopPropagation() {} });
    return prevented;
  }
  return { doc, events, trigger, first, last, panel, cleanup, key, closed: () => closed };
}

test("opening a modal focuses the first visible control and locks background scrolling", () => {
  const state = dialogFixture();
  assert.equal(state.doc.activeElement, state.first);
  assert.equal(state.doc.body.style.overflow, "hidden");
  state.cleanup();
});

test("Tab and Shift+Tab keep keyboard focus inside the modal", () => {
  const state = dialogFixture();
  assert.equal(state.key("Tab", true), true);
  assert.equal(state.doc.activeElement, state.last);
  assert.equal(state.key("Tab"), true);
  assert.equal(state.doc.activeElement, state.first);
  state.doc.activeElement = state.trigger;
  assert.equal(state.key("Tab"), true);
  assert.equal(state.doc.activeElement, state.first);
  state.cleanup();
});

test("Escape closes the modal and cleanup restores focus and page scrolling", () => {
  const state = dialogFixture();
  assert.equal(state.key("Escape"), true);
  assert.equal(state.closed(), 1);
  state.cleanup();
  assert.equal(state.doc.activeElement, state.trigger);
  assert.equal(state.doc.body.style.overflow, "auto");
  assert.equal(state.events.size, 0);
});

test("an empty modal keeps focus on its own panel", () => {
  const state = dialogFixture(true);
  assert.equal(state.doc.activeElement, state.panel);
  assert.equal(state.key("Tab"), true);
  assert.equal(state.doc.activeElement, state.panel);
  state.cleanup();
});

test("field errors stay associated with the invalid field and preserve their full message", () => {
  const { Field, FormAlert } = loadSource("src/components/account/auth-ui.tsx");
  const message = "Please use the same registered email address when verifying your account.";
  const html = renderToStaticMarkup(React.createElement(Field, { id: "mobile-email", label: "Email", error: message }));
  assert.match(html, /aria-invalid="true"/);
  assert.match(html, /aria-describedby="mobile-email-error"/);
  assert.match(html, /id="mobile-email-error"/);
  assert.ok(html.includes(message));
  const alert = renderToStaticMarkup(React.createElement(FormAlert, null, message));
  assert.match(alert, /role="alert"/);
  assert.ok(alert.includes(message));
});
