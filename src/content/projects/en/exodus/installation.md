---
order: 2
title: "Installation"
---

## One-Line Installation (Recommended)

To install EXODUS on Linux or macOS, simply run the following command in your terminal:

```bash
bash <(curl -sSL https://raw.githubusercontent.com/exodialabsxyz/exodus/main/exodus/install/bootstrap.sh)
```

This script will automatically detect your OS, install dependencies, and set up everything for you.

## Prerequisites

- Python 3.11 or higher
- Docker (optional, for isolated execution mode)
- An API key for your chosen LLM provider (Google Gemini, OpenAI, etc.)

## Manual Installation

```bash
# Clone the repository
git clone https://github.com/exodialabsxyz/exodus.git
cd exodus

# Install EXODUS
pip install -e .
```

## Initial Configuration

1. **Copy the example configuration:**
   ```bash
   cp settings.toml.example settings.toml
   ```

2. **Configure your LLM provider:**
   Edit `settings.toml` and add your API key:
   ```toml
   [llm]
   default_model = "gemini/gemini-2.5-flash"
   default_provider = "litellm"
   default_max_context_tokens = 700000
   custom_api_base = ""  # Optional: for local models or custom endpoints
   
   [llm.default_provider_config]
   api_key = "your-api-key-here"
   ```

3. **Configure execution mode:**
   ```toml
   [agent]
   default_agent = "triage_agent"
   max_iterations = 100
   execution_mode = "local"  # or "docker"
   
   [agent.execution.docker]
   default_image = "parrotsec/security:7.0"
   default_image_name = "exodus_container"
   ```

4. **Set logging level:**
   ```toml
   [logging]
   level = "INFO"  # DEBUG, INFO, WARNING, ERROR
   format = "[exodus] %(asctime)s - %(name)s - %(levelname)s - %(message)s"
   ```