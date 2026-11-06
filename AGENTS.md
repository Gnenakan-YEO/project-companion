<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Business contact info lives only in `src/lib/site.ts` and the product catalogue (with prices) only in `src/lib/products.ts`; why: one place to update placeholder data.
- Order totals are always recomputed server-side from the catalogue (`src/lib/pricing.ts`); why: never trust browser prices.
- Orders and contact requests are inserted via `createServerFn` in `src/lib/orders.functions.ts` with a publishable client; tables allow anon INSERT only (no reads); why: visitors can submit but never read others' data.
- Cart state is client-only (React context + localStorage, read in useEffect); why: avoids hydration mismatches.
- Manager area `/gerant` lives under `_authenticated`; access requires the `admin` row in `user_roles`, checked server-side via `has_role` in `src/lib/admin.functions.ts`; why: roles never come from client data. There is no public signup page — manager accounts are created from the Users panel.
