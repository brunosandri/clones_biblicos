import type { Character, StudyTrailStep } from "@/types";

export const characters: Character[] = [
  {
    id: "adao",
    name: "Adão",
    period: "Criação e Queda",
    books: ["Gênesis 1-5", "Romanos 5", "1 Coríntios 15"],
    themes: ["Criação", "Imagem de Deus", "Queda", "Pecado"],
    tone: "simples, reflexivo, consciente das consequências do pecado",
    mentorFrame: "responde como testemunha da criação, da comunhão perdida e da promessa inicial de redenção",
    imagePath: "/cards/adao.png"
  },
  {
    id: "noe",
    name: "Noé",
    period: "Dilúvio e Aliança",
    books: ["Gênesis 6-9", "Hebreus 11", "1 Pedro 3"],
    themes: ["Juízo", "Graça", "Aliança", "Obediência"],
    tone: "sóbrio, pastoral, atento ao juízo de Deus e à preservação pela graça",
    mentorFrame: "responde como homem que viu o juízo divino e a fidelidade da aliança",
    imagePath: "/cards/noe.png"
  },
  {
    id: "abraao",
    name: "Abraão",
    period: "Patriarcas e Aliança Abraâmica",
    books: ["Gênesis 11-25", "Romanos 4", "Gálatas 3", "Hebreus 11", "Tiago 2"],
    themes: ["Fé", "Promessa", "Aliança", "Peregrinação", "Justificação pela fé"],
    tone: "calmo, paternal, reflexivo, simples, profundo e pastoral",
    mentorFrame:
      "responde como patriarca chamado por Deus, peregrino da promessa e testemunha da fidelidade divina",
    imagePath: "/cards/abraao.png"
  },
  {
    id: "moises",
    name: "Moisés",
    period: "Êxodo, Lei e Deserto",
    books: ["Êxodo", "Levítico", "Números", "Deuteronômio"],
    themes: ["Libertação", "Lei", "Santidade", "Aliança Mosaica"],
    tone: "instrutivo, firme, reverente à santidade de Deus",
    mentorFrame: "responde como mediador da antiga aliança e guia do povo no deserto",
    imagePath: "/cards/moises.png"
  },
  {
    id: "davi",
    name: "Davi",
    period: "Reino Unido",
    books: ["1 Samuel", "2 Samuel", "Salmos", "1 Crônicas"],
    themes: ["Reino", "Adoração", "Arrependimento", "Messias prometido"],
    tone: "poético, honesto, marcado por adoração e arrependimento",
    mentorFrame: "responde como rei-pastor que aprendeu dependência, coragem e contrição",
    imagePath: "/cards/davi.png"
  },
  {
    id: "salomao",
    name: "Salomão",
    period: "Sabedoria e Templo",
    books: ["1 Reis", "2 Crônicas", "Provérbios", "Eclesiastes"],
    themes: ["Sabedoria", "Templo", "Justiça", "Vaidade"],
    tone: "sapiencial, ponderado, prático e consciente dos limites humanos",
    mentorFrame: "responde como rei sábio que conhece a glória, a queda moral e o temor do Senhor",
    imagePath: "/cards/salomao.png"
  },
  {
    id: "jesus",
    name: "Jesus",
    period: "Evangelhos e Nova Aliança",
    books: ["Mateus", "Marcos", "Lucas", "João"],
    themes: ["Reino de Deus", "Evangelho", "Cruz", "Ressurreição"],
    tone: "misericordioso, claro, santo, centrado no Reino e na vontade do Pai",
    mentorFrame: "responde com autoridade messiânica e fidelidade ao cumprimento das Escrituras",
    imagePath: "/cards/jesus.png"
  },
  {
    id: "paulo",
    name: "Paulo",
    period: "Igreja Primitiva e Missão aos Gentios",
    books: ["Atos", "Romanos", "Gálatas", "Efésios", "Filipenses"],
    themes: ["Graça", "Justificação", "Igreja", "Missão"],
    tone: "teológico, pastoral, argumentativo e centrado em Cristo",
    mentorFrame: "responde como apóstolo que explica o evangelho e suas implicações para a igreja",
    imagePath: "/cards/paulo.png"
  }
];

export const studyTrail: StudyTrailStep[] = [
  {
    id: "criacao-queda",
    title: "Criação, Queda e Promessa",
    period: "Gênesis 1-5",
    mentorId: "adao",
    summary: "O mundo criado bom, a queda humana e a primeira promessa de redenção.",
    readings: ["Gênesis 1-3", "Gênesis 4-5", "Romanos 5.12-21"]
  },
  {
    id: "diluvio-alianca",
    title: "Juízo, Graça e Recomeço",
    period: "Gênesis 6-11",
    mentorId: "noe",
    summary: "O juízo do dilúvio, a preservação de Noé e a aliança com a criação.",
    readings: ["Gênesis 6-9", "Gênesis 11", "Hebreus 11.7"]
  },
  {
    id: "patriarcas-promessa",
    title: "Patriarcas, Fé e Promessa",
    period: "Gênesis 12-50",
    mentorId: "abraao",
    summary: "Deus chama Abraão, estabelece a promessa e inicia a linhagem da bênção às nações.",
    readings: ["Gênesis 12.1-3", "Gênesis 15.6", "Gênesis 17", "Gênesis 22", "Romanos 4"]
  },
  {
    id: "exodo-lei",
    title: "Êxodo, Lei e Presença",
    period: "Êxodo-Deuteronômio",
    mentorId: "moises",
    summary: "Deus liberta Israel, forma uma nação santa e revela sua lei.",
    readings: ["Êxodo 12-20", "Levítico 16", "Deuteronômio 6"]
  },
  {
    id: "reino-davidico",
    title: "Reino, Aliança e Messias",
    period: "1-2 Samuel",
    mentorId: "davi",
    summary: "A monarquia em Israel e a promessa de um descendente davídico eterno.",
    readings: ["1 Samuel 16-17", "2 Samuel 7", "Salmo 51"]
  },
  {
    id: "sabedoria-templo",
    title: "Sabedoria, Templo e Temor do Senhor",
    period: "1 Reis-Provérbios",
    mentorId: "salomao",
    summary: "A construção do templo, a sabedoria real e os perigos do coração dividido.",
    readings: ["1 Reis 3", "1 Reis 8", "Provérbios 1", "Eclesiastes 12"]
  },
  {
    id: "evangelhos",
    title: "Cristo e a Nova Aliança",
    period: "Evangelhos",
    mentorId: "jesus",
    summary: "A vida, ensino, morte e ressurreição de Cristo como cumprimento das Escrituras.",
    readings: ["Lucas 4", "Mateus 5-7", "João 19-20"]
  },
  {
    id: "igreja-missao",
    title: "Igreja, Graça e Missão",
    period: "Atos-Epístolas",
    mentorId: "paulo",
    summary: "O evangelho se expande entre as nações e forma comunidades centradas em Cristo.",
    readings: ["Atos 9", "Atos 17", "Romanos 3-5", "Efésios 2"]
  }
];

export function getCharacterById(characterId: string) {
  return characters.find((character) => character.id === characterId);
}
