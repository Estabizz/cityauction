import { PROPERTY_ACTIONS } from "@/lib/property-actions";

type Snapshot = { ids: Set<string>; signedIn: boolean | null; pending: Set<string>; message: string | null };
export const SERVER_SAVED_PROPERTIES: Snapshot = { ids: new Set(), signedIn: null, pending: new Set(), message: null };
let snapshot: Snapshot = SERVER_SAVED_PROPERTIES;
let loaded = false;
let loading: Promise<boolean> | null = null;
let revision = 0;
const listeners = new Set<() => void>();
const changes = new Map<string, Promise<SaveResult>>();
type SaveResult = { ok: true; saved: boolean; message: string } | { ok: false; status: number; error: string };

export function savedPropertiesSnapshot() { return snapshot; }
export function subscribeSavedProperties(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function emit(patch: Partial<Snapshot>) { snapshot = { ...snapshot, ...patch }; listeners.forEach((listener) => listener()); }

export function loadSavedProperties(refresh = false): Promise<boolean> {
  if (loading) return loading;
  if (loaded && !refresh) return Promise.resolve(true);
  const startedAt = revision;
  loading = (async () => {
    try {
      const response = await fetch("/api/favourites?ids=1", { cache: "no-store", signal: AbortSignal.timeout(10_000) });
      if (response.status === 401) {
        loaded = true; emit({ ids: new Set(), signedIn: false }); return true;
      }
      const data = await response.json();
      if (!response.ok || data?.success !== true || !Array.isArray(data.data) || !data.data.every((id: unknown) => typeof id === "string")) return false;
      // A slow refresh must not undo a save that completed while it was loading.
      if (startedAt === revision && changes.size === 0) emit({ ids: new Set(data.data), signedIn: true });
      loaded = true;
      return true;
    } catch { return false; }
  })().finally(() => { loading = null; });
  return loading;
}

export function setPropertySaved(auctionId: string, saved: boolean): Promise<SaveResult> {
  const pending = changes.get(auctionId);
  if (pending) return pending;
  const operation = (async (): Promise<SaveResult> => {
    revision++;
    emit({ pending: new Set([...snapshot.pending, auctionId]) });
    try {
      const response = await fetch(saved ? "/api/favourites" : `/api/favourites?auctionId=${encodeURIComponent(auctionId)}`, {
        method: saved ? "POST" : "DELETE", cache: "no-store", signal: AbortSignal.timeout(10_000),
        ...(saved ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify({ auctionId }) } : {}),
      });
      if (response.status === 401) {
        loaded = true; emit({ ids: new Set(), signedIn: false });
        return { ok: false, status: 401, error: "Please sign in to save this property." };
      }
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.success !== true || data.saved !== saved) return { ok: false, status: response.status, error: data?.error || "Couldn't update this property. Please try again." };
      const ids = new Set(snapshot.ids);
      if (saved) ids.add(auctionId); else ids.delete(auctionId);
      const message = saved ? PROPERTY_ACTIONS.savedMessage : PROPERTY_ACTIONS.removedMessage;
      emit({ ids, signedIn: true, message });
      return { ok: true, saved, message };
    } catch { return { ok: false, status: 0, error: "Couldn't reach the server. Please try again." }; }
    finally {
      revision++;
      const pendingIds = new Set(snapshot.pending); pendingIds.delete(auctionId);
      emit({ pending: pendingIds });
    }
  })().finally(() => { changes.delete(auctionId); });
  changes.set(auctionId, operation);
  return operation;
}
