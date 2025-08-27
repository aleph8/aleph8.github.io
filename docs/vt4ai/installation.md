---
sidebar_position: 2
---

# Installation

## Prerequisites

- Python 3.11 or higher
- A valid VirusTotal API key ([Get one here](https://www.virustotal.com/gui/my-apikey))

## Install VT4AI

### Using pip (Recommended)

```bash
pip install vt4ai
```

### From Source

```bash
git clone https://github.com/aleph8/vt4ai.git
cd vt4ai
pip install -e .
```

## Optional Dependencies

VT4AI supports different installation profiles depending on your use case:

### For REST API Server
```bash
pip install "vt4ai[api]"
```

This installs additional dependencies:
- `fastapi>=0.116.1`
- `uvicorn>=0.35.0`

### For MCP Server (LLM Agents)
```bash
pip install "vt4ai[mcp]"
```

This installs:
- `mcp==1.13.0`

### Complete Installation
```bash
pip install "vt4ai[api,mcp]"
```

## Configuration

### API Key Setup

VT4AI requires a VirusTotal API key. You can provide it in several ways:

#### Environment Variable (Recommended)
```bash
export VT4AI_API_KEY="your_virustotal_api_key_here"
```

#### Command Line Parameter
```bash
python3 -m vt4ai.cli --api-key your_api_key --hash file_hash_here
```

### Verify Installation

Test your installation with a simple command:

```bash
python3 -m vt4ai.cli --help
```

You should see the VT4AI command-line help message.

## Getting Your VirusTotal API Key

1. Visit [VirusTotal](https://www.virustotal.com/)
2. Create an account or log in
3. Navigate to your [API key page](https://www.virustotal.com/gui/my-apikey)
4. Copy your API key

### API Key Tiers

VT4AI works with all VirusTotal API tiers:

- **Public API**: Basic functionality, rate-limited
- **Premium API**: Higher rate limits, additional features
- **Enterprise API**: Full feature access, including advanced relationships

Some features (like certain file relationships) require premium or enterprise access.

## Troubleshooting

If you encounter issues:

1. Check the [troubleshooting guide](./troubleshooting)
2. Review your API key permissions
3. Open an issue on [GitHub](https://github.com/aleph8/vt4ai/issues)

## Next Steps

Now that VT4AI is installed, you can:

- [Try the CLI interface](/vt4ai/cli/overview)
- [Set up the MCP server for AI agents](/vt4ai/mcp/overview)
- [Start the REST API server](/vt4ai/api/overview)
- [Learn about templates](/vt4ai/templates/overview)
