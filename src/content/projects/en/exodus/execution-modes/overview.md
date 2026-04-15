---
order: 3
sidebar_label: "Execution Modes"
title: "Execution Engines"
---

EXODUS provides two distinct execution engines designed for different operational scenarios:

## Interactive Mode (Human-in-the-Loop)

The **default engine** for manual operation where a human operator (pentester, security analyst) maintains control and directs agent actions in real-time.

```bash
# Start interactive chat session
exodus-cli chat --agent triage_agent
```

**Use Cases:**
- **Manual pentesting**: Operator analyzes results and decides next steps
- **Exploratory reconnaissance**: Human expertise guides the investigation
- **Training and learning**: Understand how agents work step-by-step
- **Compliance requirements**: Maintain human oversight for sensitive operations

**Characteristics:**
- Human operator controls the flow
- Agent responds to each user message
- Full visibility into agent reasoning
- Manual approval before critical actions
- Interactive feedback and course correction

**Example workflow:**
```
You: "Scan this target for open ports"
Agent: [Executes nmap scan, shows results]
You: "Now enumerate the HTTP service on port 80"
Agent: [Performs HTTP enumeration]
You: "Looks vulnerable, try directory bruteforce"
Agent: [Executes gobuster]
```

## Automated Mode (Autonomous Execution)

The **automated engine** (`exodus-cli auto`) enables fully autonomous operation with advanced planning, reflection, and self-correction capabilities. Designed for tasks that require minimal human intervention.

```bash
# Execute autonomous mission
exodus-cli auto "Perform complete reconnaissance on exodialabs.xyz" \
  --agent recon_agent \
  --session scan_20250107 \
  --verbose
```

**Use Cases:**
- **Automated scanning**: Schedule unattended reconnaissance of infrastructure
- **CI/CD security testing**: Integrate into pipelines for continuous assessment
- **Bug bounty automation**: Autonomous discovery of vulnerabilities
- **Large-scale operations**: Deploy agent swarms for distributed tasks
- **Repetitive workflows**: Automate routine security assessments

### Advanced Features

#### 1. Dynamic Planning
The agent generates a structured task plan based on the objective:
```
Objective: "Scan target and find vulnerabilities"
Plan:
  ├─ task_1: Port scan and service discovery
  ├─ task_2: HTTP/SMB enumeration (depends on task_1)
  ├─ task_3: Vulnerability identification
  ├─ task_4: Exploit validation
  └─ task_5: Report generation
```

#### 2. Strategic Reflection
Periodic self-evaluation to ensure progress:
- **Iteration-based**: Reviews progress every N steps (default: 25)
- **Task-based**: Evaluates after N completed tasks (default: 3)
- **Actions**: `CONTINUE`, `REPLAN`, `ESCALATE`, or `COMPLETE`

#### 3. Dynamic Replanning
Agent can regenerate the plan mid-execution if:
- Strategy isn't working (repeated failures)
- Environment changed (new services discovered)
- Task becomes irrelevant (objective already achieved)

#### 4. Checkpoint & Resume
Execution state is automatically saved:
```bash
# Start mission
exodus-cli auto "Long-running task" --session my_mission

# Interrupt with Ctrl+C or timeout
^C Interrupted by user

# Resume from checkpoint
exodus-cli auto --resume --session my_mission
```

#### 5. Escalation to Human
Agent can request assistance when stuck:
```
Reflection: ESCALATE
  Reasoning: "Credentials required to proceed. Manual intervention needed."

Agent requests human assistance
```

## Secure Execution Modes

EXODUS provides multiple execution drivers for running tools safely:

**Docker Mode** (Recommended for isolated execution):
```toml
[agent]
execution_mode = "docker"

[agent.execution.docker]
default_image = "debian:latest"
default_image_name = "exodus_container"
```

- Isolated environment using any Docker image (Debian, Ubuntu, Kali, ParrotSec, Alpine, etc.)
- Automatic container lifecycle management
- Safe execution of commands without affecting host system
- Perfect for security tools or untrusted code execution

**Local Mode**:
```toml
[agent]
execution_mode = "local"
```

- Direct execution in your environment
- Faster for trusted tools
- Use for development and testing

## Exodus Security Executor Container

EXODUS provides a specialized Docker container that runs an `exodus-server` daemon for executing Python-based tools in an isolated ParrotSec environment. Agents can communicate with this server via Unix sockets to execute EXODUS tools remotely.

```bash
# Build the image
docker build -t exodus-security-executor -f docker/exodus_security_executor/Dockerfile .

# Run the container
docker run -d --name exodus-executor exodus-security-executor
```