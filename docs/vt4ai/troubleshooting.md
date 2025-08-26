---
sidebar_position: 8
---

# Troubleshooting

This guide helps you resolve common issues when using VT4AI across its different interfaces (CLI, MCP, and REST API).

## Common Issues

### API Key Problems

#### Missing API Key
```
Error: A VirusTotal API key is required.
```

**Solutions:**
1. Set environment variable:
   ```bash
   export VT4AI_API_KEY="your_virustotal_api_key"
   ```

2. Use command line parameter:
   ```bash
   python3 -m vt4ai.cli --api-key your_key --hash 275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f
   ```

3. Verify your key is valid at [VirusTotal](https://www.virustotal.com/gui/my-apikey)

#### Invalid API Key
```
Error: Invalid API key or insufficient permissions
```

**Solutions:**
- Check that your API key is copied correctly (no extra spaces)
- Verify your VirusTotal account is active
- Ensure you have permission for the requested operation

### Installation Issues

#### Import Errors
```
ImportError: No module named 'vt4ai'
```

**Solutions:**
1. Install VT4AI:
   ```bash
   pip install vt4ai
   ```

2. Check Python environment:
   ```bash
   python3 -c "import vt4ai; print('VT4AI installed successfully')"
   ```

3. For development installation:
   ```bash
   cd vt4ai
   pip install -e .
   ```

#### Missing Dependencies
```
ImportError: No module named 'fastapi' / 'mcp'
```

**Solutions:**
Install with optional dependencies:
```bash
# For API server
pip install "vt4ai[api]"

# For MCP server
pip install "vt4ai[mcp]"

# For everything
pip install "vt4ai[api,mcp]"
```

### CLI Issues

#### Command Not Found
```
bash: vt4ai: command not found
```

**Solution:**
Use the module format:
```bash
python3 -m vt4ai.cli --help
```

#### File Not Found
```
Error processing file: Could not find file: /path/to/file
```

**Solutions:**
- Check file path is correct
- Verify file exists and is readable
- Use absolute paths to avoid confusion

#### Invalid Hash Format
```
Error: Invalid hash format
```

**Solutions:**
- Ensure hash is MD5 (32 chars), SHA1 (40 chars), or SHA256 (64 chars)
- Remove any extra characters or spaces
- Use only hexadecimal characters (0-9, a-f)

### MCP Server Issues

#### Server Won't Start
```
Error starting MCP server
```

**Solutions:**
1. Check API key is set:
   ```bash
   echo $VT4AI_API_KEY
   ```

2. Verify MCP dependencies:
   ```bash
   pip install "vt4ai[mcp]"
   ```

3. Check Python version (requires 3.11+):
   ```bash
   python3 --version
   ```

#### Tools Not Available
```
MCP tools not found
```

**Solutions:**
- Restart your AI assistant/MCP client
- Check MCP server configuration
- Verify VT4AI MCP server is running

### REST API Issues

#### Server Start Errors
```
Error starting API server
```

**Solutions:**
1. Install API dependencies:
   ```bash
   pip install "vt4ai[api]"
   ```

2. Check port availability:
   ```bash
   lsof -i :8000
   ```

3. Use different port:
   ```bash
   uvicorn vt4ai.api.server:app --port 8001
   ```

#### 401 Unauthorized
```
{"detail": "Invalid API key"}
```

**Solutions:**
- Include API key in header:
  ```bash
  curl -H "X-API-Key: your_key" "http://localhost:8000/api/v1/files/hash"
  ```
- Set environment variable for server
- Verify key has necessary permissions

### Rate Limiting

#### Rate Limit Exceeded
```
Error: Rate limit exceeded
```

**Solutions:**
- Wait before making next request
- Check your VirusTotal API tier limits
- Implement exponential backoff in your code
- Consider upgrading to premium API

#### Too Many Requests
```
HTTP 429: Too Many Requests
```

**Solutions:**
- Reduce request frequency
- Use templates to minimize data transfer
- Check API tier quotas
- Implement proper delay between requests

### Template Issues

#### Template Not Found
```
Warning: Template 'template_name' not found
```

**Solutions:**
- Check template name spelling
- Verify template exists in templates directory
- Use built-in templates: `vt4ai_file_basics`, `vt4ai_domain_basics`

#### Fields Not Filtered
```
Template seems to have no effect
```

**Solutions:**
- Compare with raw format to see differences
- Check template syntax in JSON file
- Verify field paths match VirusTotal response structure

## FAQ

### Q: Can I use VT4AI without an API key?
A: No, VirusTotal requires an API key for all requests. You can get a free key from [VirusTotal](https://www.virustotal.com/).

### Q: Why are my responses different from the web interface?
A: VT4AI uses templates to filter responses for AI optimization. Use `--format raw` to see unfiltered data.

### Q: How do I know which template to use?
A: Start with the basic templates (`vt4ai_file_basics`, etc.) and create custom ones if needed.

### Q: Can I use multiple API keys?
A: Currently, VT4AI uses one API key per session. For high-volume usage, consider VirusTotal's enterprise options.

### Q: Is VT4AI compatible with all Python versions?
A: VT4AI requires Python 3.11 or higher due to modern async features and dependencies.
