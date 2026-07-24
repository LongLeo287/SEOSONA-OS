import os
import re
from pathlib import Path

def repair_skills_router():
    root_dir = Path(__file__).resolve().parent.parent.parent.parent
    knowledge_dir = root_dir / "2_KNOWLEDGE"
    router_file = knowledge_dir / "SKILLS_ROUTER.md"
    
    if not router_file.exists():
        print(f"File {router_file} not found.")
        return
        
    with open(router_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    new_lines = []
    removed_count = 0
    route_pattern = re.compile(r"^- .* -> `(.+?)`$")
    
    for line in lines:
        match = route_pattern.match(line.strip())
        if match:
            rel_path = match.group(1).strip('/')
            abs_path = knowledge_dir / rel_path
            
            if not abs_path.exists():
                removed_count += 1
                continue # Skip adding this line to new_lines
                
        new_lines.append(line)
        
    with open(router_file, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
        
    print(f"Router repair complete. Removed {removed_count} broken links from SKILLS_ROUTER.md.")

if __name__ == "__main__":
    repair_skills_router()
