# Clones da Bíblia

MVP de estudo bíblico cronológico com personagens bíblicos como mentores temporais.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- API routes do Next.js
- OpenAI API
- Base inicial em Markdown dentro de `knowledge/`

## Como rodar

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Depois edite `.env.local` e configure:

```bash
OPENAI_API_KEY=sua_chave
OPENAI_MODEL=gpt-4o-mini
OPENAI_WEB_MODEL=gpt-4o-mini
AUTH_SECRET=um_segredo_longo_para_assinar_sessoes
AUTH_EMAIL=cliente@exemplo.com
AUTH_NAME=Cliente
RESEND_API_KEY=sua_chave_resend
MAGIC_LINK_FROM="Clones da Bíblia <acesso@seudominio.com>"
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
KIWIFY_WEBHOOK_SECRET=um_segredo_para_validar_webhook
NEXT_PUBLIC_MONTHLY_CHECKOUT_URL=https://pay.kiwify.com.br/HjxToAF
NEXT_PUBLIC_ANNUAL_CHECKOUT_URL=https://pay.kiwify.com.br/zimm1D9
```

Para múltiplos usuários, use `AUTH_USERS` como JSON:

```bash
AUTH_USERS=[{"email":"cliente1@exemplo.com","name":"Cliente 1"},{"email":"cliente2@exemplo.com","name":"Cliente 2"}]
```

O login usa link mágico por e-mail. Em produção, configure `RESEND_API_KEY` e `MAGIC_LINK_FROM`.
Sem essas variáveis, o link será exibido no log do servidor para desenvolvimento local.

## Integração Kiwify

Configure um PostgreSQL no Railway e defina `DATABASE_URL`. Depois, na Kiwify, cadastre o webhook:

```bash
URL: https://seu-dominio.com/api/kiwify/webhook
Token: mesmo valor de KIWIFY_WEBHOOK_SECRET
```

Eventos recomendados:

- Compra aprovada
- Assinatura renovada
- Reembolso
- Chargeback
- Compra recusada
- Assinatura cancelada
- Assinatura atrasada

Compras e renovações ativam o e-mail do comprador. Reembolso, chargeback, recusa, cancelamento ou atraso desativam o acesso.

## Rotas

- `/` - página inicial
- `/personagens` - seleção dos personagens
- `/chat` - chat com mentor bíblico
- `/trilha` - trilha cronológica de estudo
- `/api/chat` - rota de integração com OpenAI

## Deploy na Railway

O projeto está configurado com `output: "standalone"` para rodar na Railway.

Use:

- Build command: `npm run build`
- Start command: `npm start`

Variáveis obrigatórias:

```bash
OPENAI_API_KEY=sua_chave
OPENAI_MODEL=gpt-4o-mini
OPENAI_WEB_MODEL=gpt-4o-mini
AUTH_SECRET=um_segredo_longo_para_assinar_sessoes
AUTH_EMAIL=cliente@exemplo.com
AUTH_NAME=Cliente
RESEND_API_KEY=sua_chave_resend
MAGIC_LINK_FROM="Clones da Bíblia <acesso@seudominio.com>"
DATABASE_URL=postgresql://usuario:senha@host:5432/banco
KIWIFY_WEBHOOK_SECRET=um_segredo_para_validar_webhook
NEXT_PUBLIC_MONTHLY_CHECKOUT_URL=https://pay.kiwify.com.br/HjxToAF
NEXT_PUBLIC_ANNUAL_CHECKOUT_URL=https://pay.kiwify.com.br/zimm1D9
```

## Documentos internos

Os arquivos Markdown em `knowledge/` são carregados pela API e filtrados antes de entrar no prompt. Perguntas bíblicas normais usam a base interna; perguntas com termos científicos, arqueológicos ou históricos externos ativam busca web pela OpenAI e exigem fontes externas citáveis.
