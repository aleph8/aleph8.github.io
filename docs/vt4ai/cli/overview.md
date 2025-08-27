---
sidebar_position: 1
---

# CLI Overview

The VT4AI command-line interface provides direct access to VirusTotal's API with AI-optimized output formatting. It's perfect for automation, scripting, and quick threat analysis.

## Basic Usage

```bash
python3 -m vt4ai.cli [TARGET] [OPTIONS]
```

## Target Types

VT4AI supports multiple target types for analysis:

### File Analysis

#### By Hash
```bash
# SHA256 hash (recommended)
python3 -m vt4ai.cli --hash 275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f

# MD5 hash
python3 -m vt4ai.cli --hash 44d88612fea8a8f36de82e1278abb02f

# SHA1 hash
python3 -m vt4ai.cli --hash 3395856ce81f2b7382dee72602f798b642f14140
```

#### By File Path
```bash
# Analyze local file
python3 -m vt4ai.cli --file /path/to/suspicious_file.exe

# Specify hash algorithm
python3 -m vt4ai.cli --file malware.pdf --algorithm md5
```

### Network Analysis

#### Domain Analysis
```bash
python3 -m vt4ai.cli --domain example.com
python3 -m vt4ai.cli --domain suspicious-domain.net
```

#### IP Address Analysis
```bash
# IPv4
python3 -m vt4ai.cli --ip 8.8.8.8

# IPv6
python3 -m vt4ai.cli --ip 2001:4860:4860::8888
```

#### URL Analysis
```bash
python3 -m vt4ai.cli --url "https://example.com/suspicious-path"
```

## Output Formats

Control how results are presented:

### JSON (Default)
```bash
python3 -m vt4ai.cli --hash abc123 --format json
```

### Markdown (Human-Readable)
```bash
python3 -m vt4ai.cli --domain example.com --format markdown
```

### XML
```bash
python3 -m vt4ai.cli --ip 8.8.8.8 --format xml
```

### Raw (Unfiltered VirusTotal Response)
```bash
python3 -m vt4ai.cli --file malware.exe --format raw
```

## Templates

Use templates to filter and optimize output for specific use cases:

```bash
# Use specific template
python3 -m vt4ai.cli --hash abc123 --template-name vt4ai_file_basics
```

## File Relationships

Explore connections between files and other objects:

```bash
# Get domains contacted by a file
python3 -m vt4ai.cli --hash abc123 --relationship contacted_domains

# Get similar files
python3 -m vt4ai.cli --file malware.exe --relationship similar_files --limit 20

# Get files dropped during execution
python3 -m vt4ai.cli --hash abc123 --relationship dropped_files
```

## Common Options

### API Key
```bash
# Via environment variable (recommended)
export VT4AI_API_KEY="your_key_here"
python3 -m vt4ai.cli --hash abc123

# Via command line
python3 -m vt4ai.cli --hash abc123 --api-key your_key_here
```

### Pagination for Relationships
```bash
# First page
python3 -m vt4ai.cli --hash abc123 --relationship contacted_domains --limit 10

# Next page with cursor
python3 -m vt4ai.cli --hash abc123 --relationship contacted_domains --limit 10 --cursor "next_page_token"
```

## Quick Examples

### Analyze Suspicious File
```bash
# Quick file analysis with readable output
python3 -m vt4ai.cli --file suspicious.exe --format markdown --verbose
```

### Domain Reputation Check
```bash
# Check domain with specific template
python3 -m vt4ai.cli --domain suspicious.com --template-name vt4ai_domain_basics
```

### Investigate File Relationships
```bash
# Find what domains a malware sample contacted
python3 -m vt4ai.cli --hash 275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f \
      --relationship contacted_domains \
      --limit 50 \
      --format markdown
```

## Next Steps

- [Learn about specific CLI commands](/vt4ai/cli/commands)
- [Set up the MCP server for AI agents](/vt4ai/mcp/overview)
- [Start the REST API server](/vt4ai/api/overview)
- [Learn about templates](/vt4ai/templates/overview)
- [Read troubleshooting guide](/vt4ai/troubleshooting)
