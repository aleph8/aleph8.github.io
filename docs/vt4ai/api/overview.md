---
sidebar_position: 1
---

# REST API Overview

The VT4AI REST API provides HTTP endpoints for integrating VirusTotal intelligence into web applications, microservices, and any system that can make HTTP requests.

## Key Features

- **🌐 HTTP/JSON Interface**: Standard REST API with OpenAPI documentation
- **🔄 Async Operations**: High-performance async handling for concurrent requests
- **🎨 Multiple Formats**: JSON, Markdown, XML, and raw output formats
- **📊 Built-in Templates**: Pre-configured filtering for AI-optimized responses
- **🔒 API Key Authentication**: Secure access control
- **📖 Auto-Generated Docs**: Interactive Swagger/OpenAPI documentation

## Quick Start

### Install with API Dependencies

```bash
pip install "vt4ai[api]"
```

### Start the Server

```bash
# Set your VirusTotal API key
export VT4AI_API_KEY="your_virustotal_api_key"

# Start the server
python -m vt4ai.api.server

# Or use uvicorn directly
uvicorn vt4ai.api.server:app --host 0.0.0.0 --port 8000
```

### Access the API

- **Base URL**: `http://localhost:8000`
- **API Docs**: `http://localhost:8000/docs`
- **OpenAPI Spec**: `http://localhost:8000/openapi.json`

## API Endpoints

### File Analysis

#### Get File Report
```http
GET /api/v1/files/{file_hash}
```

**Parameters:**
- `file_hash` (path): MD5, SHA1, or SHA256 hash
- `format` (query): Output format (`json`, `markdown`, `xml`, `raw`)

**Example:**
```bash
curl "http://localhost:8000/api/v1/files/275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f?format=json" \
  -H "X-API-Key: your_virustotal_api_key"
```

#### Get File Relationships
```http
GET /api/v1/files/{file_hash}/relationships/{relationship}
```

**Parameters:**
- `file_hash` (path): File hash
- `relationship` (path): Relationship type
- `limit` (query): Number of results (1-100, default: 10)
- `cursor` (query): Pagination cursor

**Example:**
```bash
curl "http://localhost:8000/api/v1/files/abc123/relationships/contacted_domains?limit=20" \
  -H "X-API-Key: your_virustotal_api_key"
```

### URL Analysis

#### Get URL Report
```http
GET /api/v1/urls/analyze
```

**Parameters:**
- `url` (query): URL to analyze
- `format` (query): Output format

**Example:**
```bash
curl "http://localhost:8000/api/v1/urls/analyze?url=https://example.com&format=markdown" \
  -H "X-API-Key: your_virustotal_api_key"
```

### Domain Analysis

#### Get Domain Report
```http
GET /api/v1/domains/{domain}
```

**Parameters:**
- `domain` (path): Domain name
- `format` (query): Output format

**Example:**
```bash
curl "http://localhost:8000/api/v1/domains/example.com?format=json" \
  -H "X-API-Key: your_virustotal_api_key"
```

### IP Analysis

#### Get IP Report
```http
GET /api/v1/ips/{ip_address}
```

**Parameters:**
- `ip_address` (path): IPv4 or IPv6 address
- `format` (query): Output format

**Example:**
```bash
curl "http://localhost:8000/api/v1/ips/8.8.8.8?format=json" \
  -H "X-API-Key: your_virustotal_api_key"
```

### Metadata Endpoints

#### Get Available Templates
```http
GET /templates
```

Returns a summary of all available templates organized by object type.

#### Get Relationship Types
```http
GET /api/v1/files/relationships/types
```

Returns all available file relationship types with descriptions.

## Authentication

The API uses API key authentication via the `X-API-Key` header:

```http
X-API-Key: your_virustotal_api_key
```

### Environment Variable

Set your API key as an environment variable:
```bash
export VT4AI_API_KEY="your_key_here"
```

### Per-Request Authentication

Pass the key in each request header:
```bash
curl -H "X-API-Key: your_key" "http://localhost:8000/api/v1/files/abc123"
```

## Response Formats

### JSON Response (Default)
```json
{
  "data": {
    "file_type": "executable",
    "malicious_count": 45,
    "reputation": "malicious"
  },
  "format": "json"
}
```

### Markdown Response
```json
{
  "data": "# File Report: abc123\n\n## Analysis Results\n...",
  "format": "markdown"
}
```

### Error Response
```json
{
  "detail": "Error retrieving file report: Invalid hash format"
}
```

## Status Codes

- **200**: Success
- **400**: Bad Request (invalid parameters)
- **401**: Unauthorized (missing/invalid API key)
- **404**: Not Found (resource not found in VirusTotal)
- **429**: Rate Limit Exceeded
- **500**: Internal Server Error

## Rate Limiting

The API respects VirusTotal's rate limits:

- **Public API**: 4 requests/minute
- **Premium API**: Higher limits based on subscription
- **Enterprise API**: Highest limits

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 4
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1640995200
```

## Configuration

### Server Configuration

```bash
# Custom host and port
uvicorn vt4ai.api.server:app --host 127.0.0.1 --port 3000

# Production deployment
uvicorn vt4ai.api.server:app --host 0.0.0.0 --port 8000 --workers 4
```

### Environment Variables

```bash
# Required
VT4AI_API_KEY="your_virustotal_api_key"

# Optional
VT4AI_DEFAULT_FORMAT="json"
VT4AI_MAX_WORKERS=4
VT4AI_LOG_LEVEL="INFO"
```

## Integration Examples

### Python with requests
```python
import requests

def analyze_file(file_hash, api_key):
    url = f"http://localhost:8000/api/v1/files/{file_hash}"
    headers = {"X-API-Key": api_key}
    params = {"format": "json"}

    response = requests.get(url, headers=headers, params=params)
    return response.json()
```

### JavaScript/Node.js
```javascript
async function analyzeFile(fileHash, apiKey) {
  const response = await fetch(
    `http://localhost:8000/api/v1/files/${fileHash}?format=json`,
    {
      headers: {
        'X-API-Key': apiKey
      }
    }
  );
  return await response.json();
}
```

### cURL Scripts
```bash
#!/bin/bash
API_KEY="your_key_here"
BASE_URL="http://localhost:8000/api/v1"

# Analyze file
curl -H "X-API-Key: $API_KEY" \
     "$BASE_URL/files/$1?format=markdown" \
     | jq -r '.data'
```

## Performance Tips

### Concurrent Requests
The API handles concurrent requests efficiently:

```python
import asyncio
import aiohttp

async def analyze_multiple_files(file_hashes, api_key):
    async with aiohttp.ClientSession() as session:
        tasks = []
        for hash_value in file_hashes:
            url = f"http://localhost:8000/api/v1/files/{hash_value}"
            headers = {"X-API-Key": api_key}
            tasks.append(session.get(url, headers=headers))

        responses = await asyncio.gather(*tasks)
        return [await r.json() for r in responses]
```

### Template Usage
Use templates to optimize response size:
```bash
# Optimized: only essential data
curl "http://localhost:8000/api/v1/files/abc123"

# Full data: larger response
curl "http://localhost:8000/api/v1/files/abc123?format=raw"
```

## Deployment

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "vt4ai.api.server:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Production Considerations

1. **Reverse Proxy**: Use nginx or similar for production
2. **SSL/TLS**: Enable HTTPS for security
3. **Monitoring**: Set up health checks and logging
4. **Scaling**: Use multiple workers for high traffic

## Next Steps

- [Understand templates](../templates/overview)
- [Learn CLI commands](../cli/overview)
- [Explore MCP integration](../mcp/overview)
- [Read troubleshooting guide](../troubleshooting)
