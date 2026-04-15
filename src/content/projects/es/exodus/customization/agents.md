---
order: 5
sidebar_label: "Agentes y Delegaciones"
title: "Agentes Personalizados"
---

Los agentes de EXODUS utilizan archivos de configuración TOML simples con **prompts de sistema modulares** almacenados en archivos Markdown separados.

## Estructura del Agente

```
exodus/agents/
├── single/          # Configuraciones TOML del Agente
│   ├── triage_agent.toml
│   └── recon_agent.toml
└── prompts/         # Archivos Markdown de prompt
    ├── common.md
    └── recon_agent.md
```

## Configuración Básica

```toml
[agent]
name = "recon_agent"
description = "Expert in reconnaissance and enumeration"
system_prompt = ["common.md", "recon_agent.md"]  # Cargar múltiples archivos prompt
tools = ["core_bash"]
handoffs = ["triage_agent", "web_exploit_agent"]

[agent.llm]
model = "gemini/gemini-2.5-pro"
temperature = 0.5
```

### Opciones de System Prompt

**Opción 1: Prompts Modulares (Recomendado)**
```toml
system_prompt = ["common.md", "recon_agent.md"]  # Carga desde exodus/agents/prompts/
```

**Opción 2: Archivo Único**
```toml
system_prompt = ["recon_agent.md"]
```

**Opción 3: Texto en Línea**
```toml
system_prompt = "You are a pentesting expert. Analyze targets."
```

### Opciones de Configuración del Agente

- **name**: Identificador único del agente
- **description**: Breve descripción para transferencias
- **system_prompt**: Cadena o array de archivos `.md` de `prompts/`
- **tools**: Lista de nombres de herramientas (ej., `["core_bash"]`)
- **handoffs**: Otros agentes a los que transferir el control
- **max_iterations**: Sobrescribir límite de iteraciones global (opcional)

### Configuración LLM Por Agente

```toml
[agent.llm]
model = "gemini/gemini-2.5-pro"    # Sobrescribir modelo por defecto
temperature = 0.7                   # Aleatoriedad (0-2)
max_tokens = 100000                 # Longitud máxima de respuesta
max_context_tokens = 700000         # Tokens máximos en el contexto
```

## Delegaciones de Agente (Handoffs)

EXODUS soporta **delegación dinámica de agentes** donde los agentes pueden transferir el control a otros agentes especializados durante la ejecución:

```toml
[agent]
name = "triage_agent"
description = "Enruta peticiones a agentes especializados"
system_prompt = "Analiza la petición del usuario y delega al experto apropiado."
tools = []
handoffs = ["security_expert", "code_analyst", "recon_specialist"]

[agent.llm]
temperature = 0.3
```

**Cómo funciona:**
1. El agente analiza la tarea y determina si otro agente está más capacitado
2. Llama a `transfer_to_{agent_name}` con una razón para la delegación
3. El agente destino recibe el contexto y continúa la ejecución
4. La memoria compartida preserva el historial de conversación a través de delegaciones
5. El `max_iterations` global previene bucles infinitos en todos los agentes

## Gestión del Contexto

EXODUS incluye una estrategia de contexto para manejar misiones de larga duración sin exceder los límites de tokens del LLM ni perder información crítica.

Cuando el historial de conversación de un agente se acerca al límite de `max_context_tokens`, EXODUS automáticamente:

1.  **Detecta el umbral**: Se activa cuando los tokens actuales alcanzan el 90% del límite.
2.  **Auto-Resumen**: Usa el LLM del agente para analizar el 60% más antiguo de la conversación.
3.  **Extracción de Puntos Clave**: Genera un resumen técnico que preserva entidades, resultados de herramientas y tareas pendientes.
4.  **Actualización de Memoria**: Reemplaza los mensajes antiguos con un único mensaje de resumen, liberando contexto para nuevas interacciones.

### Configuración

Puedes habilitar y ajustar este comportamiento en tu `settings.toml` o configuración por agente:

```toml
[llm]
# Defecto global (opcional)
default_max_context_tokens = 700000

# Sobrescritura por agente en el TOML del agente
[agent.llm]
max_context_tokens = 500000
```
