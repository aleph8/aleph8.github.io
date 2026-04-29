---
title: "Agent-to-Computer (A2C): A Protocol for Connecting Remote Agents"
description: "Introduction to A2C as a protocol for connecting remote agents to local devices"
pubDate: 2026-04-30
author: aleph
tags: ["ai"]
image: "../../../assets/blog/agent-to-computer.jpg"
---

_(Repo: [aleph8/a2c-spec](https://github.com/aleph8/a2c-spec))_

I've been thinking about an idea for a while... *"What would it be like to give a remote cloud agent access to local devices?"*. For instance, for an expert cybersecurity agent like [OmniaSec](https://omniasec.ai) to audit my device... I could create a small program to run on my computer, but how do I get it to communicate with [OmniaSec](https://omniasec.ai) and leverage its full potential? That's where Agent-to-Computer was born.

A2C (Agent-to-Computer) is an open protocol that enables a remote AI agent (the **Brain**) to delegate tool execution to a local machine (the **Body**), receive the results, and continue reasoning - all over a persistent, bidirectional communication channel.

### Key Concepts: The Brain and the Body

To understand A2C, you have to separate the roles:
*   **Brain**: The AI agent residing in the cloud or on a server. It decides which tools to call and reasons about the results.
*   **Body**: The client running on your local machine. It actually executes the tools (shell commands, scripts, etc.) and sends the "observation" back to the Brain.

### What Problems Does A2C Solve?

While solutions like [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) exist, A2C addresses a set of needs or "gaps" that current protocols don't fully cover:

1.  **Inverted Directionality**: While MCP allows a local host to access tools on remote servers, A2C allows a **cloud-hosted expert Brain** to access the user's local resources to run commands, scripts, or OS-level operations.
2.  **Connectivity without Open Ports**: A2C uses an **outbound connection initiated by the Body**. This means your local machine connects to the remote agent (or a relay), eliminating the need to open ports on your router or configure complex firewalls.
3.  **Consent and Security Model**: Unlike other protocols where access is often all-or-nothing or requires tedious configuration, A2C defines a trust model based on explicit consent. The "Body" sends a `PENDING` message to the "Brain" while waiting for the user to approve an action, and only then is it executed. The user maintains full control, with the option to enable `yolo_mode` only if they fully trust the source.
4.  **Efficiency and Persistence**: By using bidirectional channels (like gRPC or WebSockets), A2C reduces latency and token consumption. The protocol uses sequence numbers (`seq`) to ensure messages arrive in order and nothing is lost during communication.
5.  **Hybrid Tool Execution**: It allows for a balance where some tools run on the Body (locally), while others can reside and run on the Brain's side (server). This is ideal for heavy workloads, proprietary tools that cannot be distributed, or controlled access to sensitive information without the raw data needing to travel to the local device.

### What Possibilities Does This Open Up?

The exciting part isn't just connecting your PC. Since the client is so lightweight, the possibilities are endless:

*   **Device Networks**: You could connect an entire fleet of devices to a single centralized agent. Imagine an agent coordinating tasks across multiple servers, mobile devices, or sensors.
*   **IoT and Robotics**: Devices with limited resources (like a Raspberry Pi, a robot, or an Android phone) could have a minimal "Body" providing a direct connection to a powerful "Brain" in the cloud.
*   **Full Client-Side Security**: The key is that the user (the Body) decides what the agent can do. We are working on making actions and types fully configurable, so the agent always operates within safe boundaries defined by you.

### Real-World Use Cases

You might be thinking: *"But Claude Code or Codex already do this"*. And you're right, but there's a fundamental difference: **Claude Code is a local tool that calls an AI. A2C is a protocol that allows ANY remote AI to connect to your machine.**

*   **Fully Agnostic**: Claude Code is tied to Anthropic. A2C allows any "Brain" (whether it's a custom GPT, a specialized cybersecurity agent, or your own model on a server) to talk to any "Body" (your PC, a server, a robot).
*   **Connection Inversion**: Instead of you opening an app to "call" the AI, the Body maintains a connection with the Brain. This allows the agent to be proactive or work autonomously on long tasks without you needing to keep a blocked terminal open.
*   **Granular and Controlled Security**: Security management isn't "all or nothing." It's based on three pillars:
    *   **Client-Side Filtering**: The Body only declares the tools it wants to expose during the `HANDSHAKE`. If the Brain asks for something not on the list, it's automatically rejected.
    *   **Interactive Consent**: Every time the Brain requests a sensitive action, the Body sends a `PENDING` message and asks you (via notification or TUI) for permission.
    *   **Per-Device Policies**: Thanks to the `device_id`, the server can apply specific rules. For example, you can configure your home PC to auto-accept `git` commands (`yolo_mode`), while your production server requires manual approval for everything.

To make it more concrete, imagine these everyday situations:

*   **Smart Organization**: "Hey, check my Downloads folder, categorize the files by content (not just extension), and move them to the right folders."
*   **Real Dev Assistant**: A cloud-based expert agent can run your local tests, see console errors in real-time, and propose a fix directly in your editor.
*   **Proactive Maintenance**: "Find out why my disk is almost full and suggest which large or temporary files I can safely delete."
*   **Home Network Audit**: The agent can scan your local network from your PC and warn you if there are any unknown or vulnerable devices connected to your WiFi.
*   **Privacy by Design**: You can ask it to analyze a very sensitive local document. The agent will send the "code" to analyze it locally and only receive the final result (the summary or specific data you need), without the full document ever leaving your machine.

### Next Steps

There is still a long way to go, but the short-term goals are clear:
*   **Stabilize v1.0**: Refine the current specification with community feedback and finalize the message schema.
*   **Specialized Bodies**: Develop minimal clients (minimal bodies) for Android and IoT environments (Raspberry Pi), allowing any device to become an extension of the agent.


