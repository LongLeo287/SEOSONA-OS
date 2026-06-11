import os
import sys
import json
import argparse
from typing import Dict, Any

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.append(os.path.join(os.path.dirname(__file__), "validators"))
try:
    from fix_loop import run_with_fix_loop
except ImportError:
    def run_with_fix_loop(label, fn, **kwargs): return fn(**kwargs)

class TechnicalSEOAutoFixer:
    """
    Transforms SEO Audit errors into ready-to-deploy code fixes.
    Instead of just saying 'missing schema', it generates the actual JSON-LD script.
    """
    def __init__(self, domain: str):
        self.domain = domain
        
    def generate_schema_fix(self, url: str, entity_type: str, metadata: dict) -> str:
        """Generates a JSON-LD snippet."""
        schema = {
            "@context": "https://schema.org",
            "@type": entity_type,
            "url": url,
            "publisher": {
                "@type": "Organization",
                "name": self.domain
            }
        }
        schema.update(metadata)
        
        return f"<script type=\"application/ld+json\">\n{json.dumps(schema, indent=2)}\n</script>"

    def generate_redirect_rule(self, old_url: str, new_url: str, server_type: str = "nginx") -> str:
        """Generates 301 redirect rules."""
        old_path = old_url.replace(f"https://{self.domain}", "").replace(f"http://{self.domain}", "")
        new_path = new_url.replace(f"https://{self.domain}", "").replace(f"http://{self.domain}", "")
        
        if server_type == "nginx":
            return f"rewrite ^{old_path}/?$ {new_path} permanent;"
        elif server_type == "apache":
            return f"Redirect 301 {old_path} {new_path}"
        return f"// Unsupported server type: {server_type}"

    def fix_issue(self, url: str, issue_type: str, params: dict) -> Dict[str, Any]:
        result_code = ""
        if issue_type == "missing_schema":
            result_code = self.generate_schema_fix(url, params.get("type", "WebPage"), params.get("metadata", {}))
        elif issue_type == "broken_redirect":
            result_code = self.generate_redirect_rule(url, params.get("target_url"), params.get("server", "nginx"))
        else:
            return {"success": False, "error": f"Unknown issue type: {issue_type}"}
            
        return {
            "success": True,
            "url": url,
            "issue_type": issue_type,
            "code_snippet": result_code
        }

def run(domain: str, url: str, issue_type: str, params: str) -> Dict[str, Any]:
    """
    Main entry point for the Tool Registry.
    params should be a JSON string.
    """
    def _execute():
        fixer = TechnicalSEOAutoFixer(domain)
        p_dict = json.loads(params) if isinstance(params, str) else params
        return fixer.fix_issue(url, issue_type, p_dict)
        
    return run_with_fix_loop("technical_seo_autofixer", _execute)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--domain", required=True)
    parser.add_argument("--url", required=True)
    parser.add_argument("--issue", required=True, choices=["missing_schema", "broken_redirect"])
    parser.add_argument("--params", required=True, help="JSON string of parameters")
    
    args = parser.parse_args()
    res = run(args.domain, args.url, args.issue, args.params)
    print(json.dumps(getattr(res, 'data', res), indent=2))
