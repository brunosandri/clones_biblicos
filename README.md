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
```

## Documentos internos

Os arquivos Markdown em `knowledge/` são carregados pela API e inseridos no prompt. Neste MVP todos os documentos são enviados juntos; a evolução natural é substituir isso por RAG com embeddings e PostgreSQL/pgvector.
