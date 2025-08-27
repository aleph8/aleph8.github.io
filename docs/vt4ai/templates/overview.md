---
sidebar_position: 1
---

# Templates System

VT4AI's template system is designed to filter and optimize VirusTotal responses for AI applications. It reduces noise, focuses on relevant data, and significantly improves token efficiency for LLM interactions.

## Why Templates Matter

VirusTotal responses can be massive - often containing hundreds of fields and thousands of lines of JSON. For AI applications, this creates several problems:

- **Token Waste**: LLMs process unnecessary data, increasing costs
- **Context Dilution**: Important information gets lost in noise
- **Performance Impact**: Large responses slow down processing
- **Confusion**: Too much data can confuse AI reasoning

Templates solve these issues by intelligently filtering responses to show only what matters for your specific use case.

## How Templates Work

### Basic Concept

Templates define what data to **exclude** from VirusTotal responses using field patterns:

```json
{
  "name": "vt4ai_file_basics",
  "object": "file",
  "description": "Essential file information for AI analysis",
  "exclude_fields": [
    "downloadable",
    "links",
    "creation_date",
    "last_analysis_results.*.engine_version"
  ]
}
```

### Pattern Matching

Templates support sophisticated pattern matching:

- **Direct fields**: `"md5"` removes the md5 field
- **Nested fields**: `"stats.malicious"` removes nested data
- **Wildcards**: `"engines.*.version"` removes version from all engines
- **Deep nesting**: `"results.*.details.*.timestamp"` for complex structures

## Template Structure

### Required Fields

Every template must include:

```json
{
  "name": "unique_template_name",
  "object": "file|domain|ip|url",
  "description": "Human-readable description",
  "exclude_fields": ["array", "of", "field.patterns"]
}
```

### Field Patterns

#### Simple Field Exclusion
```json
"exclude_fields": [
  "md5",
  "sha1",
  "downloadable"
]
```

#### Nested Field Exclusion
```json
"exclude_fields": [
  "last_analysis_results.category",
  "stats.harmless",
  "submission_names"
]
```

#### Wildcard Patterns
```json
"exclude_fields": [
  "last_analysis_results.*.engine_name",
  "last_analysis_results.*.engine_version",
  "*.timestamp"
]
```

## Creating Custom Templates

### Step 1: Identify Your Use Case

Consider what your AI application needs:
- **Threat Detection**: Focus on security verdicts and malware names
- **Reputation Analysis**: Emphasize scores and categorization
- **Research**: Keep technical details but remove noise
- **Quick Assessment**: Minimal essential data only

### Step 2: Analyze Raw Responses

Get a raw VirusTotal response to understand the data structure:

```bash
vt4ai --hash abc123 --format raw > raw_response.json
```

### Step 3: Create Your Template

Create a JSON file in the templates directory:

```json
{
  "name": "my_custom_template",
  "object": "file",
  "description": "Custom template for my specific use case",
  "exclude_fields": [
    "links",
    "submission_names",
    "last_analysis_results.*.engine_update",
    "last_analysis_results.*.method"
  ]
}
```

### Step 4: Test Your Template

```bash
python3 -m vt4ai.cli --hash abc123 --template-name my_custom_template --format json
```

## Template Development Best Practices

+ Begin by removing obvious noise
+ Test with real data and refine
+ Include clear descriptions
+ Validate that your templates work well with LLMs

## Next Steps

- [Try the CLI interface](/vt4ai/cli/overview)
- [Set up the MCP server for AI agents](/vt4ai/mcp/overview)
- [Start the REST API server](/vt4ai/api/overview)
- [Read troubleshooting guide](/vt4ai/troubleshooting)
