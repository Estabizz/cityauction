import type { ReactNode } from "react";
import { EmptyState, PageHeader, Panel } from "./ui";

// Frame for the marketplace pages (auctions, properties, KYC, participants).
// Those features are not open to the public yet, so the pages read straight
// from the database and say plainly when there is nothing there.
export function MarketplacePage({
  title,
  description,
  count,
  children,
}: {
  title: string;
  description: string;
  count: number | null;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Marketplace · not live yet" title={title} description={description} />
      <Panel title={count === null ? undefined : `${count.toLocaleString("en-IN")} in the database`}>{children}</Panel>
    </div>
  );
}

export function MarketplaceEmpty({ title, children }: { title: string; children: ReactNode }) {
  return <EmptyState title={title}>{children}</EmptyState>;
}

export function DatabaseError() {
  return (
    <EmptyState title="Could not read the database">
      The database did not answer. Reload in a minute; if it keeps happening, check the Hostinger MySQL database.
    </EmptyState>
  );
}

// Runs the query and turns a database failure into `null` so the page can
// show an honest message instead of crashing.
export async function safeQuery<T>(query: () => Promise<T>): Promise<T | null> {
  try {
    return await query();
  } catch (error) {
    console.error("[admin] marketplace query failed", error);
    return null;
  }
}
