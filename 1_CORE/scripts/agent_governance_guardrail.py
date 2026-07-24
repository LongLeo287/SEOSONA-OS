from pathlib import Path
import re

class GovernanceBlockException(Exception):
    pass

DESTRUCTIVE_PATTERNS = [
    re.compile(r'\brm\s+-rf\b', re.IGNORECASE),
    re.compile(r'\bdel\s+/s\s+/q\b', re.IGNORECASE),
    re.compile(r'\bdrop\s+table\b', re.IGNORECASE),
    re.compile(r'\btruncate\s+table\b', re.IGNORECASE)
]

def check_destructive_command(cmd_string: str, override: bool = False):
    """
    Microsoft Agent Governance: Pre-Execution Guardrail.
    Throws GovernanceBlockException if a destructive pattern is detected unless overridden.
    """
    if override:
        return True
    
    for pattern in DESTRUCTIVE_PATTERNS:
        if pattern.search(cmd_string):
            raise GovernanceBlockException(
                f"[AGENT GOVERNANCE] Destructive command detected: '{pattern.pattern}'. "
                "Execution blocked. Explicit CEO override required."
            )
    return True

SANITIZATION_PATTERNS = [
    (re.compile(r'AKIA[0-9A-Z]{16}'), '[REDACTED_AWS_KEY]'),
    (re.compile(r'sk-[a-zA-Z0-9]{48}'), '[REDACTED_OPENAI_KEY]'),
    (re.compile(r'sk-ant-api03-[A-Za-z0-9\-_]{93}-AA'), '[REDACTED_ANTHROPIC_KEY]'),
    (re.compile(r'\b\d{3}-\d{2}-\d{4}\b'), '[REDACTED_SSN]'),  # PII SSN
    (re.compile(r'\b(?:\d[ -]*?){13,16}\b'), '[REDACTED_CREDIT_CARD]'), # PII Credit Card
]

def sanitize_output(content: str) -> str:
    """
    Microsoft Agent Governance: Output Sanitization.
    Redacts PII, Telemetry secrets, and keys before they hit long-term memory.
    """
    if not isinstance(content, str):
        return content
    
    sanitized = content
    for pattern, replacement in SANITIZATION_PATTERNS:
        sanitized = pattern.sub(replacement, sanitized)
    return sanitized
