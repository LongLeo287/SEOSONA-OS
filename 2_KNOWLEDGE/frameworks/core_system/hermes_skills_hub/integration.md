# Hermes Agent Skills Hub: The Plugin Ecosystem

## 1. Architectural Role
The SEOSONA System operates under the overarching ecosystem of **Hermes Agent** (by Nous Research). A critical component of this ecosystem is the **Skills Hub** (https://hermes-agent.nousresearch.com/docs/skills/). 

## 2. Core Philosophy
- **Do not reinvent the wheel:** The Skills Hub contains over 88,000+ ready-to-use skills across multiple registries. Before writing custom code to integrate with standard platforms (e.g., Slack, Google Drive, Salesforce, GitHub), the system MUST evaluate if an existing Hermes Skill can be installed.
- **Dynamic Extensibility:** Skills function as plug-and-play modules that give the core agent real-world actions. This maps directly to the "Democratizing AI" concept where AI acts through workflow plugins rather than pure conversational chat.
- **Integration with AWS AgentCore:** While AWS AgentCore handles the infrastructure scaling and routing, the Hermes Skills act as the specific "weapons" or "tools" assigned to each specialized worker agent.

## 3. SEOSONA System Implication
When requested to build a new automation or capability:
1. **Search Phase:** Consider if the capability exists in the Hermes Skills Hub.
2. **Install Phase:** If an open-source skill exists, prefer installing and configuring it over writing from scratch.
3. **Custom Phase:** Only write custom logic for highly proprietary business rules (like SEOSONA's specific marketing funnels) that cannot be handled by a generic skill.

