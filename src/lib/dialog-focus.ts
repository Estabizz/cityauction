// Manage keyboard focus and page scrolling for a modal rendered above the navbar.
export function activateDialog(panel: HTMLElement, close: () => void) {
  const doc = panel.ownerDocument;
  const previousFocus = doc.activeElement as HTMLElement | null;
  const previousOverflow = doc.body.style.overflow;
  doc.body.style.overflow = "hidden";
  const focusable = () => Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    .filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
  const focusFirst = () => (focusable()[0] || panel).focus();
  focusFirst();
  function onKey(event: KeyboardEvent) {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); return; }
    if (event.key !== "Tab") return;
    const items = focusable();
    const first = items[0];
    const last = items[items.length - 1];
    const outside = !panel.contains(doc.activeElement);
    if (!first) { event.preventDefault(); panel.focus(); }
    else if (event.shiftKey && (doc.activeElement === first || outside || doc.activeElement === panel)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (doc.activeElement === last || outside || doc.activeElement === panel)) { event.preventDefault(); first.focus(); }
  }
  doc.addEventListener("keydown", onKey, true);
  return () => {
    doc.removeEventListener("keydown", onKey, true);
    doc.body.style.overflow = previousOverflow;
    if (previousFocus?.isConnected) previousFocus.focus();
  };
}
