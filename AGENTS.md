<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project rules

- **Database:** migrado para **Supabase** — projeto `4arenovation` (ref `subtdyoszcvwumlbyrpe`, us-east-1), exclusivo deste cliente. Postgres via Prisma (pooler 6543 runtime / 5432 migrações), uploads no bucket público `gallery` do Storage, RLS ativo sem policies (acesso só server-side). Credenciais no `.env` local (fora do git).
- **Supabase:** cada cliente tem seu **próprio projeto Supabase**. Não perguntar antes de autenticar/criar — seguir direto.
- **Idiomas:** este site é trilíngue (EN/PT/ES) com cookie + bandeiras. Em novos sites, sempre perguntar ao dono quais idiomas o site deve ter antes de construir.
- Identidade da marca: ver `docs/` (cartão de visita e logo oficiais) e `PLANO.md`.
