---
order: 5
sidebar_label: "Agents & Handoffs"
title: "Custom Agents"
---

EXODUS agents use simple TOML configuration files with **modular system prompts** stored in separate Markdown files.

## Agent Structure

```
exodus/agents/
├── single/          # Agent TOML configs
│   ├── triage_agent.toml
│   └── recon_agent.toml
└── prompts/         # Markdown prompt files
    ├── common.md
    └── recon_agent.md
```

## Basic Configuration

```toml
[agent]
name = "recon_agent"
description = "Expert in reconnaissance and enumeration"
system_prompt = ["common.md", "recon_agent.md"]  # Load multiple prompt files
tools = ["core_bash"]
handoffs = ["triage_agent", "web_exploit_agent"]

[agent.llm]
model = "gemini/gemini-2.5-pro"
temperature = 0.5
```

### System Prompt Options

**Option 1: Modular Prompts (Recommended)**
```toml
system_prompt = ["common.md", "recon_agent.md"]  # Loads from exodus/agents/prompts/
```

**Option 2: Single File**
```toml
system_prompt = ["recon_agent.md"]
```

**Option 3: Inline Text**
```toml
system_prompt = "You are a pentesting expert. Analyze targets."
```

### Agent Configuration Options

- **name**: Unique agent identifier
- **description**: Brief description for handoffs
- **system_prompt**: String or array of `.md` files from `prompts/`
- **tools**: List of tool names (e.g., `["core_bash"]`)
- **handoffs**: Other agents to transfer control to
- **max_iterations**: Override global iteration limit (optional)

### Per-Agent LLM Settings

```toml
[agent.llm]
model = "gemini/gemini-2.5-pro"    # Override default model
temperature = 0.7                   # Randomness (0-2)
max_tokens = 100000                 # Max response length
max_context_tokens = 700000         # Max tokens on context
```

## Agent Handoffs

EXODUS supports **dynamic agent delegation** where agents can transfer control to other specialized agents during execution:

```toml
[agent]
name = "triage_agent"
description = "Routes requests to specialized agents"
system_prompt = "Analyze the user's request and delegate to the appropriate expert."
tools = []
handoffs = ["security_expert", "code_analyst", "recon_specialist"]

[agent.llm]
temperature = 0.3
```

**How it works:**
1. Agent analyzes the task and determines if another agent is better suited
2. Calls `transfer_to_{agent_name}` with a reason for the handoff
3. Target agent receives context and continues execution
4. Shared memory preserves conversation history across handoffs
5. Global `max_iterations` prevents infinite loops across all agents

## Context Management

EXODUS includes a context strategy to handle long-running missions without exceeding LLM token limits or losing critical information.

When an agent's conversation history approaches the `max_context_tokens` limit, EXODUS automatically:

1.  **Detects the threshold**: Triggers when current tokens reach 90% of the limit.
2.  **Self-Summarization**: Uses the agent's LLM to analyze the oldest 60% of the conversation.
3.  **Keypoint Extraction**: Generates a technical summary that preserves entities, tool results, and pending tasks.
4.  **Memory Update**: Replaces the old messages with a single summary message, freeing up context for new interactions.

### Configuration

You can enable and tune this behavior in your `settings.toml` or per-agent configuration:

```toml
[llm]
# Global default (optional)
default_max_context_tokens = 700000

# Per-agent override in agent TOML
[agent.llm]
max_context_tokens = 500000
```
