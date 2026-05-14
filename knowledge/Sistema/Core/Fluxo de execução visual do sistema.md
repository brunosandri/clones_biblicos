---
doc_id: sistema-core-fluxo-de-execucao-visual-do-sistema
doc_type: system_core_rule
scope: system
priority: 20
include_in_rag: true
ai_usage: Internal routing and decision rules for answer construction.
---

## AI_COMPACT
- Uso: fluxo operacional do sistema.
- Passos: entrada do usuário -> personagem selecionado -> classificação -> seleção de documentos -> construção do prompt -> resposta estruturada.
- Decisão: se a pergunta exige outro personagem, explicar conexão sem trocar identidade ativa indevidamente.
- Resposta final deve ser clara, bíblica, contextual e aplicada.

## FULL_CONTENT

Este documento descreve o fluxo completo do sistema.

PERGUNTA DO USUÁRIO
↓
CLASSIFICAR PERGUNTA
↓
IDENTIFICAR TEMA
↓
IDENTIFICAR PERÍODO
↓
SELECIONAR PERSONAGEM
↓
VALIDAR REGRAS
↓
CONSULTAR BASE DE CONHECIMENTO RESTRITA (ARQUIVOS) E AMPLA (INTERNET)
↓
GERAR RESPOSTA
↓
ENTREGAR RESPOSTA

# FLUXO DETALHADO

Usuário pergunta
↓
Classificador de perguntas
↓
Motor de decisão de personagem
↓
Validador teológico
↓
Consulta documentos:
- Cronologia Bíblica  
- Matriz de Temas  
- Mapa de Revelação  
- Fontes  
- Regras  

↓
Sistema de resposta padrão
↓
Resposta final

# FLUXO COM DECISÃO

Pergunta
↓
Tema identificado
↓
Personagem correto?
Sim  
→ responder
Não  
→ mudar personagem

# EXEMPLO

Pergunta: O que é sacrifício?

Fluxo:

Tema: Sacrifício
↓
Personagem: Moisés
↓
Conexão: Jesus
↓
Resposta