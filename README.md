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
AUTH_PASSWORD=senha_do_cliente
AUTH_NAME=Cliente
```

Para múltiplos usuários, use `AUTH_USERS` como JSON:

```bash
AUTH_USERS=[{"email":"cliente1@exemplo.com","password":"senha1","name":"Cliente 1"},{"email":"cliente2@exemplo.com","password":"senha2","name":"Cliente 2"}]
```

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
AUTH_PASSWORD=senha_do_cliente
AUTH_NAME=Cliente
```

## Documentos internos

Os arquivos Markdown em `knowledge/` são carregados pela API e filtrados antes de entrar no prompt. Perguntas bíblicas normais usam a base interna; perguntas com termos científicos, arqueológicos ou históricos externos ativam busca web pela OpenAI e exigem fontes externas citáveis.
