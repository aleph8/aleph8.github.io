---
sidebar_position: 2
---

# CLI Commands Reference

## Command Structure

```bash
python3 -m vt4ai.cli [TARGET] [OPTIONS]
```

## Target Arguments (Mutually Exclusive)

Only one target type can be specified per command:

### `--hash, -H`
Analyze a file by its hash value.

```bash
python3 -m vt4ai.cli --hash <HASH_VALUE>
python3 -m vt4ai.cli -H <HASH_VALUE>
```

**Supported hash types:**
- MD5 (32 characters)
- SHA1 (40 characters)
- SHA256 (64 characters)

**Examples:**
```bash
python3 -m vt4ai.cli --hash 275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f
python3 -m vt4ai.cli -H 275a021bbfb6489e54d471899f7db9d1663fc695ec2fe2a2c4538aabf651fd0f
```

### `--file, -f`
Analyze a file by calculating its hash locally.

```bash
python3 -m vt4ai.cli --file <FILE_PATH>
python3 -m vt4ai.cli -f <FILE_PATH>
```

**Examples:**
```bash
python3 -m vt4ai.cli --file /path/to/suspicious.exe
python3 -m vt4ai.cli -f ./malware_sample.pdf
```

### `--domain, -d`
Analyze a domain name.

```bash
python3 -m vt4ai.cli --domain <DOMAIN_NAME>
python3 -m vt4ai.cli -d <DOMAIN_NAME>
```

**Examples:**
```bash
python3 -m vt4ai.cli --domain example.com
python3 -m vt4ai.cli -d suspicious-site.net
```

### `--ip, -i`
Analyze an IP address (IPv4 or IPv6).

```bash
python3 -m vt4ai.cli --ip <IP_ADDRESS>
python3 -m vt4ai.cli -i <IP_ADDRESS>
```

**Examples:**
```bash
python3 -m vt4ai.cli --ip 8.8.8.8
python3 -m vt4ai.cli -i 2001:4860:4860::8888
```

## File-Specific Options

These options only work with `--file` or `--hash` targets:

### `--algorithm, -a`
Specify the hash algorithm for file analysis.

```bash
python3 -m vt4ai.cli --file sample.exe --algorithm <ALGORITHM>
```

**Choices:** `md5`, `sha1`, `sha256` (default: `sha256`)

**Examples:**
```bash
python3 -m vt4ai.cli --file malware.exe --algorithm md5
python3 -m vt4ai.cli -f sample.pdf -a sha1
```

### `--relationship, -r`
Get objects related to a file.

```bash
python3 -m vt4ai.cli --hash <HASH> --relationship <RELATIONSHIP_TYPE>
```

**Available relationships:**
- `behaviours` - Observed behaviors during analysis
- `contacted_domains` - Domains contacted during execution
- `contacted_ips` - IP addresses contacted
- `contacted_urls` - URLs contacted
- `dropped_files` - Files created/dropped
- `similar_files` - Similar files
- And many more...

**Examples:**
```bash
python3 -m vt4ai.cli --hash abc123 --relationship contacted_domains
python3 -m vt4ai.cli -H def456 -r similar_files
```

### `--limit, -l`
Limit the number of results for relationship queries.

```bash
python3 -m vt4ai.cli --hash <HASH> --relationship <TYPE> --limit <NUMBER>
```

**Range:** 1-100 (default: 10)

**Examples:**
```bash
python3 -m vt4ai.cli --hash abc123 --relationship contacted_domains --limit 50
python3 -m vt4ai.cli -H def456 -r similar_files -l 5
```

### `--cursor, -c`
Pagination cursor for relationship queries.

```bash
vt4ai --hash <HASH> --relationship <TYPE> --cursor <CURSOR_TOKEN>
```

**Examples:**
```bash
vt4ai --hash abc123 --relationship contacted_domains --cursor "eyJjb250aW51YXRpb25fdG9rZW4iOi4uLn0"
```

## General Options

### `--format, -fmt`
Specify output format.

```bash
vt4ai --hash abc123 --format <FORMAT>
```

**Choices:**
- `json` (default) - Structured JSON, AI-optimized
- `markdown` - Human-readable Markdown
- `xml` - XML format
- `raw` - Unfiltered VirusTotal response

**Examples:**
```bash
vt4ai --domain example.com --format markdown
vt4ai -H abc123 -fmt xml
```

### `--template-name, -t`
Apply a specific template for filtering.

```bash
vt4ai --hash abc123 --template-name <TEMPLATE_NAME>
```

**Available templates:**
- `vt4ai_file_basics` - Essential file information
- `vt4ai_domain_basics` - Core domain data
- `vt4ai_ip_basics` - Key IP information
- `vt4ai_url_basics` - Important URL data

**Examples:**
```bash
vt4ai --file malware.exe --template-name vt4ai_file_basics
vt4ai -d suspicious.com -t vt4ai_domain_basics
```

### `--api-key, -k`
Provide VirusTotal API key directly.

```bash
vt4ai --hash abc123 --api-key <YOUR_API_KEY>
```

**Examples:**
```bash
vt4ai --hash abc123 --api-key "your_virustotal_api_key_here"
vt4ai -H def456 -k "your_key"
```

### `--verbose, -v`
Enable verbose output for debugging.

```bash
vt4ai --hash abc123 --verbose
vt4ai -H def456 -v
```
