# 4ARenovation — Plano do Site (Piso Vinílico na Flórida)

> Pesquisa de mercado e plano de produto — Junho/2026

---

## 1. Pesquisa de Mercado

### Panorama
- **LVP (Luxury Vinyl Plank) é o piso mais popular da década** na Flórida: 100% à prova d'água, resistente a riscos, ideal para o clima úmido (~75% de umidade em Tampa/Orlando).
- Tendências 2026: réguas mais largas, texturas de madeira natural, tons neutros quentes.
- Tecnologias dominantes: **SPC** (núcleo rígido de pedra-plástico, mais vendido) e **WPC** (núcleo de madeira-plástico, mais confortável).

### Preços praticados no mercado (FL)
| Item | Faixa |
|---|---|
| LVP entrada (12–15 mil wear layer) | $2–3 /sq ft (material) |
| LVP intermediário (20 mil, SPC) | $3–5 /sq ft (material) |
| LVP premium (28+ mil) | $5–7 /sq ft (material) |
| Mão de obra + preparo de contrapiso | $1.50–3 /sq ft |
| **Total instalado (médio do mercado)** | **$6–12 /sq ft** |
| Projeto típico de 500 sq ft | $1.750 – $5.000 |

### Concorrentes analisados
| Empresa | Região | Calculadora online? | Destaques |
|---|---|---|---|
| Peach Flooring | Tampa | ❌ (só formulário) | Conteúdo técnico forte, garantia de 5 anos, financiamento |
| Surface Rocket | Estadual (FL) | ❌ (agendamento) | Processo em 5 etapas, FAQ, áreas de cobertura |
| Dolphin Carpet & Tile | Sul da FL/Miami | ❌ | Medição gratuita em casa |
| 50Floor | Orlando | ❌ (visita em casa) | "Instalação em 1 dia", estimativa gratuita em domicílio |
| Footprints Floors | Orlando/Tampa | ❌ | Franquia nacional, foco em licenciamento |
| Cavalieri Flooring | Orlando/Tampa | ❌ | Posicionamento de preço baixo |

### 🎯 Oportunidade (gap do mercado)
1. **Nenhum concorrente tem calculadora de orçamento instantâneo online** — todos exigem ligação ou visita. Uma calculadora self-service que gera estimativa na hora e captura o lead é o principal diferencial.
2. Poucos têm site bilíngue — **inglês + português** atinge a grande comunidade brasileira na Flórida (Orlando, Boca Raton, Pompano, Miami).
3. Padrões do setor a igualar: galeria de obras, depoimentos, garantia de mão de obra, áreas de atendimento, financiamento, formulário com SMS opt-in.

---

## 2. Identidade Visual / Logo

> Atualizado conforme o material real em `docs/` (cartão de visita + logo oficial).

- **Nome real:** 4A Renovation & Floor LLC (Orlando, FL)
- **Logo oficial:** "4A" metálico/prateado com contorno azul royal e figura de instalador agachado no topo; texto "RENOVATION & FLOOR LLC". Arquivo em `public/brand/logo-dark.jpg` (fundo escuro).
- **Paleta (extraída do logo):**
  - Azul profundo `#1D2563` / azul royal `#3555E8` (marca)
  - Prata `#C8CCD4` (o "4A" metálico)
  - Grafite escuro `#191C24` (fundos)
- **Contatos:** Adson · (407) 227-9908 · adson4arenovation@gmail.com · @4arenovationllc · www.4ARENOVATIONLLC.com
- **Serviços do cartão:** instalação de piso comercial e residencial — vinílico, cerâmica (tile) e laminado — e reforma geral. Free estimate.

---

## 3. Estrutura do Site (público)

```
Home
├── Serviços
│   ├── Piso Vinílico (LVP/SPC/WPC)
│   ├── Piso Laminado
│   └── Remoção e preparo de contrapiso
├── Orçamento Instantâneo  ⭐ (calculadora)
├── Galeria (fotos e vídeos de obras)
├── Depoimentos
├── Áreas de Atendimento (cidades da FL)
├── Sobre / Contato
└── [EN | PT] seletor de idioma
```

**Home:** hero com foto de obra + CTA "Get Your Instant Estimate", prova social (nota Google, nº de projetos), tipos de piso, processo em 4 etapas, depoimentos em destaque, galeria resumida, FAQ, rodapé com licença/área de cobertura.

---

## 4. Calculadora de Orçamento ⭐ (núcleo do produto)

Fluxo em etapas (wizard):

1. **Escolha do tipo de piso** — cards com foto, descrição e faixa de preço:
   - LVP Essencial ($X/sq ft instalado)
   - LVP SPC Intermediário
   - LVP Premium 28mil
   - Laminado (opcional)
2. **Adicionar ambientes** — o cliente vai somando espaços:
   - Nome do ambiente (Sala, Cozinha, Quarto 1…)
   - Largura × comprimento (ft) → área calculada automaticamente
   - Botão "+ Adicionar ambiente" (lista dinâmica, subtotal por ambiente)
3. **Extras (checkboxes):** remoção de piso existente, nivelamento de contrapiso, rodapé (linear ft), mudança de móveis.
4. **Resumo do orçamento** — tabela ambiente por ambiente + 10% de margem de recorte + total estimado (faixa min–max).
5. **Captura do lead:** nome, e-mail, telefone, ZIP code, melhor horário de contato, consentimento SMS → **grava tudo no banco** e envia e-mail de confirmação (cliente + admin).
6. Tela final: número do orçamento + "Entraremos em contato em até 24h" + botão WhatsApp.

Preços por sq ft ficam em tabela no banco, **editáveis pelo admin** (sem deploy).

---

## 5. Área Administrativa (login)

- **Autenticação:** login com e-mail/senha (admin only).
- **Dashboard:** orçamentos recentes, total do mês, leads por status.
- **Orçamentos:** lista com filtros (status: novo → contatado → visita agendada → fechado → perdido), detalhe completo (ambientes, medidas, valores, contato), notas internas, exportar CSV.
- **Galeria:** upload de fotos e vídeos (com título, cidade, tipo de piso), ordenação, publicar/despublicar.
- **Depoimentos:** cadastrar/aprovar depoimentos (nome, cidade, nota, texto, foto opcional).
- **Tabela de preços:** editar tipos de piso, faixas de preço e extras da calculadora.

---

## 6. Banco de Dados (esquema)

```
flooring_types   (id, name, description, price_min, price_max, image_url, active)
extras           (id, name, price_per_unit, unit [sqft|linear_ft|flat], active)
quotes           (id, quote_number, customer_name, email, phone, zip, language,
                  flooring_type_id, total_sqft, estimate_min, estimate_max,
                  status, notes, created_at)
quote_rooms      (id, quote_id, room_name, width_ft, length_ft, area_sqft)
quote_extras     (id, quote_id, extra_id, quantity, subtotal)
gallery_items    (id, type [photo|video], url, title, city, flooring_type_id,
                  sort_order, published, created_at)
testimonials     (id, customer_name, city, rating, text, photo_url, approved, created_at)
admin_users      (via provedor de auth)
```

---

## 7. Stack Técnica (proposta)

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | SEO forte (essencial p/ busca local), SSR, deploy fácil |
| UI | Tailwind CSS + shadcn/ui | Visual profissional rápido |
| Banco + Auth | **Supabase** (Postgres + Auth + Storage) | Banco, login admin e upload de mídia em um só serviço, plano grátis generoso |
| Hospedagem | Vercel | Deploy contínuo, domínio, SSL |
| E-mail | Resend | Confirmação de orçamento (cliente + notificação admin) |
| i18n | next-intl | EN/PT |
| Imagens/vídeos | Supabase Storage (ou Vercel Blob) | Upload pelo admin |

---

## 8. SEO Local (essencial neste mercado)

- Páginas por cidade: `/vinyl-flooring-orlando-fl`, `/vinyl-flooring-tampa-fl`, etc.
- Schema.org `LocalBusiness` + `Service`, Google Business Profile.
- Blog inicial: "LVP vs Laminate in Florida", "Cost to install vinyl plank in Orlando (2026)".

---

## 9. Fases de Execução

| Fase | Entrega | Escopo |
|---|---|---|
| **1 — Fundação** | Projeto + identidade | Setup Next.js/Supabase, logo SVG, design system, layout base bilíngue |
| **2 — Site público** | Páginas institucionais | Home, serviços, galeria, depoimentos, contato, áreas de atendimento |
| **3 — Calculadora** ⭐ | Orçamento instantâneo | Wizard completo, gravação no banco, e-mails |
| **4 — Admin** | Painel de gestão | Login, CRUD de orçamentos/galeria/depoimentos/preços |
| **5 — Lançamento** | Produção | SEO local, domínio, Google Business, analytics |

---

## Fontes da pesquisa

- https://peachflooring.com/luxury-vinyl-plank-flooring-tampa-fl/
- https://surfacerocket.com/luxury-vinyl-plank
- https://www.dolphincarpet.com/luxury-vinyl-flooring/
- https://50floor.com/locations/orlando/luxury-vinyl/
- https://footprintsfloors.com/orlando/services/flooring-installation/vinyl
- https://www.capitolcarpetandtile.com/our-blog/articles/the-best-luxury-vinyl-plank-lvp-brands-for-2026
