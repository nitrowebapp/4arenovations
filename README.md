# 4A Renovation & Floor LLC — Site + Calculadora de Orçamento

Site da 4A Renovation & Floor LLC (Orlando, FL — instalação de piso vinílico,
cerâmica e laminado, comercial e residencial) com calculadora de orçamento
instantâneo e painel administrativo.

**Contatos reais (do cartão de visita em `docs/`):** Adson · (407) 227-9908 ·
adson4arenovation@gmail.com · @4arenovationllc · www.4ARENOVATIONLLC.com

Pesquisa de mercado e plano completo: [PLANO.md](PLANO.md)

## Rodar localmente

```bash
npm install
# copie .env.example para .env e preencha as credenciais do Supabase
npm run db:push   # cria as tabelas no Postgres (Supabase)
npm run db:seed   # popula preços, depoimentos, galeria e usuário admin
npm run dev       # http://localhost:3000
```

## Supabase

- **Projeto:** `4arenovation` (ref `subtdyoszcvwumlbyrpe`, us-east-1) — projeto exclusivo deste cliente
- **Banco:** Postgres via Prisma (pooler na porta 6543 em runtime, 5432 para migrações)
- **Storage:** bucket público `gallery` recebe os uploads de fotos/vídeos do admin
- **RLS:** ativo em todas as tabelas, sem policies — a API pública do Supabase não expõe nada; todo acesso é server-side via Prisma
- Credenciais em `.env` (fora do git): senha do banco, `SUPABASE_SECRET_KEY` (uploads) e publishable key

## Acessos

| Área | URL | Credenciais |
|---|---|---|
| Site público | http://localhost:3000 | — |
| Calculadora | http://localhost:3000/estimate | — |
| Admin | http://localhost:3000/admin | admin@4arenovation.com / admin123 |

> Troque a senha do admin e o `AUTH_SECRET` (`.env`) antes de publicar.

## Estrutura

- `app/(site)/` — páginas públicas (home, serviços, galeria, depoimentos, contato, calculadora)
- `app/(site)/estimate/EstimateWizard.tsx` — wizard da calculadora (5 etapas)
- `app/actions/quote.ts` — criação do orçamento (preços recalculados no servidor)
- `app/admin/` — login + painel (orçamentos, galeria, depoimentos, tabela de preços)
- `prisma/schema.prisma` — banco (SQLite local; trocar `provider` para `postgresql` em produção)
- `public/uploads/` — mídias enviadas pelo admin

## Testes rápidos

```bash
npx tsx scripts/test-quote.ts   # cria um orçamento e valida o cálculo
npx tsx scripts/test-login.ts   # valida credenciais do admin
```

## Próximos passos (produção)

1. ~~Migrar banco para Supabase~~ ✅ feito
2. ~~Site trilíngue~~ ✅ EN/PT/ES com bandeiras
3. E-mails transacionais (Resend) na criação de orçamento
4. Deploy na Vercel + domínio (www.4arenovationllc.com)
5. SEO local: páginas por cidade + Google Business Profile
