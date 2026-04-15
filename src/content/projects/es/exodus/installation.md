---
order: 2
title: "Instalación"
---

## Instalación en una línea (Recomendada)

Para instalar EXODUS en Linux o macOS, simplemente ejecuta el siguiente comando en tu terminal:

```bash
bash <(curl -sSL https://raw.githubusercontent.com/exodialabsxyz/exodus/main/exodus/install/bootstrap.sh)
```

Este script detectará automáticamente tu sistema operativo, instalará las dependencias y configurará todo por ti.

## Requisitos previos

- Python 3.11 o superior
- Docker (opcional, para el modo de ejecución aislado)
- Una clave de API para el proveedor de LLM elegido (Google Gemini, OpenAI, etc.)

## Instalación manual

```bash
# Clonar el repositorio
git clone https://github.com/exodialabsxyz/exodus.git
cd exodus

# Instalar EXODUS
pip install -e .
```

## Configuración inicial

1. **Copia la configuración de ejemplo:**
   ```bash
   cp settings.toml.example settings.toml
   ```

2. **Configura tu proveedor de LLM:**
   Edita `settings.toml` y añade tu clave de API:
   ```toml
   [llm]
   default_model = "gemini/gemini-2.5-flash"
   default_provider = "litellm"
   default_max_context_tokens = 700000
   custom_api_base = ""  # Opcional: para modelos locales o endpoints personalizados
   
   [llm.default_provider_config]
   api_key = "tu-api-key-aqui"
   ```

3. **Configura el modo de ejecución:**
   ```toml
   [agent]
   default_agent = "triage_agent"
   max_iterations = 100
   execution_mode = "local"  # o "docker"
   
   [agent.execution.docker]
   default_image = "parrotsec/security:7.0"
   default_image_name = "exodus_container"
   ```

4. **Establece el nivel de registro (logging):**
   ```toml
   [logging]
   level = "INFO"  # DEBUG, INFO, WARNING, ERROR
   format = "[exodus] %(asctime)s - %(name)s - %(levelname)s - %(message)s"
   ```