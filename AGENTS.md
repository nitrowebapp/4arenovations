<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project rules

- **Database:** o dono usa **Supabase**. O SQLite local (Prisma) é só para desenvolvimento; em produção o banco vai para Supabase (trocar o datasource do Prisma para `postgresql` com a connection string do Supabase). Auth e storage de mídia também devem migrar para Supabase quando publicar.
- **Idiomas:** este site é trilíngue (EN/PT/ES) com cookie + bandeiras. Em novos sites, sempre perguntar ao dono quais idiomas o site deve ter antes de construir.
- Identidade da marca: ver `docs/` (cartão de visita e logo oficiais) e `PLANO.md`.
