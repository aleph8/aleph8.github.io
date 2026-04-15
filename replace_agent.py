with open('AGENT.md', 'r') as f:
    content = f.read()

content = content.replace("text-[#667eea]", "text-accent")
content = content.replace("border-[#667eea]", "border-accent")
content = content.replace("color:#667eea", "var(--color-accent)")

with open('AGENT.md', 'w') as f:
    f.write(content)
