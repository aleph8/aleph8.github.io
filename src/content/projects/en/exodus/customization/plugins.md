---
order: 4
sidebar_label: "Plugins"
title: "Custom Plugins"
---

Create powerful tools for your agents with just a simple decorator. EXODUS automatically generates the OpenAI-compatible schema.

```python
from exodus.core.decorators import tool

@tool(
    name="port_scanner",
    type="cli",
    description="Scans ports on a target host using nmap"
)
def port_scanner(target: str, ports: str = "1-1000") -> str:
    """Scans the specified ports on the target."""
    return f"nmap -p {ports} {target}"

# Register your plugin class
class SecurityPlugin:
    @staticmethod
    def get_tools():
        return {
            port_scanner.tool_name: port_scanner,
        }
```

To make your plugin discoverable, register it in your `pyproject.toml`:

```toml
[project.entry-points."exodus.plugins.tools"]
security = "your_package.plugins:SecurityPlugin"
```

EXODUS will automatically discover and load all plugins from the `exodus.plugins.tools` entry point group at startup.

## Plugin System

- **Python tools**: Execute code directly in your environment
- **CLI tools**: Return shell commands executed in isolated containers
- **Auto-validation**: Pydantic models generated automatically from type hints
- **Auto-discovery**: Plugins loaded via Python entry points (`exodus.plugins.tools`)
- **Distributable**: Share your plugins as PyPI packages
