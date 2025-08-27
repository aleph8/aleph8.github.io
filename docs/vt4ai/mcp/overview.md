---
sidebar_position: 1
---

# MCP Integration for LLM Agents

The VT4AI MCP (Model Context Protocol) server enables seamless integration with LLM agents and AI assistants, providing them with VirusTotal intelligence through standardized tools.

## What is MCP?

The Model Context Protocol (MCP) is a standard that allows AI applications to securely connect to external data sources and tools. VT4AI's MCP server exposes VirusTotal capabilities as tools that LLM agents can use naturally in conversations.

## Key Benefits

- **🤖 Native LLM Integration**: Works directly with Claude, ChatGPT, and other AI assistants
- **⚡ Optimized for AI**: Responses are pre-filtered and formatted for token efficiency
- **🎯 Context-Aware**: Tools provide rich context and guidance to LLMs

## Available Tools

The VT4AI MCP server provides these tools for LLM agents:

### Core Analysis Tools

#### `vt_get_file_report`
Analyze files by hash with AI-optimized output.

```typescript
vt_get_file_report(
  file_hash: string,
  format?: "json" | "markdown" | "xml" | "raw",
  template_name?: string
)
```

#### `vt_get_url_report`
Analyze URLs for threats and reputation.

```typescript
vt_get_url_report(
  url: string,
  format?: "json" | "markdown" | "xml" | "raw",
  template_name?: string
)
```

#### `vt_get_domain_report`
Check domain reputation and security status.

```typescript
vt_get_domain_report(
  domain: string,
  format?: "json" | "markdown" | "xml" | "raw",
  template_name?: string
)
```

#### `vt_get_ip_report`
Investigate IP addresses for malicious activity.

```typescript
vt_get_ip_report(
  ip: string,
  format?: "json" | "markdown" | "xml" | "raw",
  template_name?: string
)
```

### Relationship Tools

#### `vt_get_file_relationships`
Explore connections between files and other objects.

```typescript
vt_get_file_relationships(
  file_hash: string,
  relationship: string,
  limit?: number,
  cursor?: string
)
```

### Information Tools

#### `vt_get_relationship_types`
List all available relationship types with descriptions.

#### `get_available_formats`
Show supported output formats and their use cases.

#### `get_available_templates`
Display available templates for filtering responses.

## Setup and Configuration

### Prerequisites

1. VirusTotal API key
2. VT4AI installed with MCP support:
   ```bash
   pip install "vt4ai[mcp]"
   ```

### Environment Setup

```bash
export VT4AI_API_KEY="your_virustotal_api_key"
```

### Starting the MCP Server

```bash
# Start the server (default stdio)
python -m vt4ai.mcp
```

### Configuration for AI Assistants

The exact configuration depends on your AI assistant or MCP client. Below are specific examples for different platforms:

#### Claude Desktop Configuration

For Claude Desktop, you need to configure the MCP server in the `claude_desktop_config.json` file:

**File Location:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

**Configuration Example:**
```json
{
  "mcpServers": {
    "vt4ai": {
      "command": "python",
      "args": ["-m", "vt4ai.mcp"],
      "env": {
        "VT4AI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Steps to Configure:**
1. Ensure VT4AI is installed with MCP support: `pip install "vt4ai[mcp]"`
2. Create or edit the `claude_desktop_config.json` file at the location above
3. Add the VT4AI MCP server configuration
4. Set your VirusTotal API key in the environment variables
5. Restart Claude Desktop to apply the changes
6. Verify the connection by checking the MCP status in Claude Desktop

#### General MCP Client Configuration

For other MCP clients, use this general format:

```json
{
  "mcpServers": {
    "vt4ai": {
      "command": "python",
      "args": ["-m", "vt4ai.mcp"],
      "env": {
        "VT4AI_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Troubleshooting Claude Desktop Integration

If you encounter issues connecting VT4AI MCP to Claude Desktop:

### Common Issues and Solutions

1. **Server Not Recognized**
   - Ensure the `claude_desktop_config.json` file is in the correct location
   - Verify JSON syntax is valid (use a JSON validator)
   - Use absolute paths for Python executable if needed: `"command": "/usr/bin/python3"`

2. **API Key Issues**
   - Verify your VirusTotal API key is correct
   - Ensure the environment variable is properly set in the configuration
   - Test the API key independently using VT4AI CLI

3. **Python Environment Issues**
   - If using virtual environments, specify the full path to the Python executable
   - Add `PYTHONPATH` to the environment if needed:
     ```json
     "env": {
       "VT4AI_API_KEY": "your_api_key_here",
       "PYTHONPATH": "/path/to/your/project"
     }
     ```

4. **Connection Verification**
   - Check MCP status in Claude Desktop settings
   - Look for error messages in Claude Desktop's developer tools
   - Test with a simple MCP server first to verify basic functionality

### Testing Your Setup

You can verify your VT4AI MCP integration by asking Claude Desktop to:
- Get available formats: "Show me the available output formats"
- Analyze a known safe file hash
- Check a domain reputation

## Next Steps

- [Try the CLI interface](/vt4ai/cli/overview)
- [Start the REST API server](/vt4ai/api/overview)
- [Learn about templates](/vt4ai/templates/overview)
- [Read troubleshooting guide](/vt4ai/troubleshooting)
