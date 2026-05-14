const EXTERNAL_SOURCE_KEYWORDS = [
  "arqueologia",
  "arqueologico",
  "arqueologica",
  "ciencia",
  "cientifico",
  "cientifica",
  "dinossauro",
  "dinossauros",
  "fossil",
  "fosseis",
  "historia antiga",
  "manuscrito",
  "manuscritos",
  "paleontologia",
  "egiptologia",
  "genetica",
  "geologia",
  "evolucao",
  "especie",
  "especies"
];

export function needsExternalSources(message: string) {
  const normalizedMessage = normalize(message);
  return EXTERNAL_SOURCE_KEYWORDS.some((keyword) => normalizedMessage.includes(normalize(keyword)));
}

export function buildSourcePolicyPrompt(shouldUseExternalSources: boolean) {
  if (!shouldUseExternalSources) {
    return `
## Politica de fontes
Use a base interna e as referencias biblicas. Nao use fontes externas para perguntas biblicas normais.
`.trim();
  }

  return `
## Politica de fontes externas
Esta pergunta exige fontes externas porque envolve termo moderno, ciencia, arqueologia, historia externa ou detalhe nao explicado diretamente pela base interna.

Obrigatorio:
- use busca web/fonte externa antes de responder;
- cite fontes externas em "Fontes recomendadas" com titulo e URL;
- mantenha a Biblia como autoridade teologica;
- use fontes externas apenas para contexto historico, linguistico, cientifico ou arqueologico;
- nao transforme inferencia externa em doutrina biblica;
- se a fonte externa e a interpretacao biblica tratarem de coisas diferentes, explique a diferenca.
`.trim();
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
