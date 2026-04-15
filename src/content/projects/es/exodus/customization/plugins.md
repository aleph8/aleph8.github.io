---
order: 4
sidebar_label: "Plugins"
title: "Plugins Personalizados"
---

Crea herramientas potentes para tus agentes con solo un simple decorador. EXODUS genera automáticamente el esquema compatible con OpenAI.

```python
from exodus.core.decorators import tool

@tool(
    name="port_scanner",
    type="cli",
    description="Scans ports on a target host using nmap"
)
def port_scanner(target: str, ports: str = "1-1000") -> str:
    """Escanea los puertos especificados en el objetivo."""
    return f"nmap -p {ports} {target}"

# Registra tu clase de plugin
class SecurityPlugin:
    @staticmethod
    def get_tools():
        return {
            port_scanner.tool_name: port_scanner,
        }
```

Para hacer que tu plugin sea descubrible, regístralo en tu `pyproject.toml`:

```toml
[project.entry-points."exodus.plugins.tools"]
security = "your_package.plugins:SecurityPlugin"
```

EXODUS descubrirá y cargará automáticamente todos los plugins del grupo de puntos de entrada `exodus.plugins.tools` al inicio.

## Sistema de Plugins

- **Herramientas de Python**: Ejecutan código directamente en tu entorno
- **Herramientas de CLI**: Devuelven comandos de shell ejecutados en contenedores aislados
- **Auto-validación**: Modelos Pydantic generados automáticamente a partir de pistas de tipo
- **Auto-descubrimiento**: Plugins cargados a través de puntos de entrada de Python (`exodus.plugins.tools`)
- **Distribuible**: Comparte tus plugins como paquetes PyPI
