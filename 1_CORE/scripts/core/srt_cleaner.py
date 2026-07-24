import os
import re
import sys
from pathlib import Path

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parents[3]
SRT_DIR = Path(os.environ.get("SEOSONA_SRT_DIR", ROOT / "3_MEMORY" / "ingestion_zone" / "srt"))
OUTPUT_DIR = ROOT / "3_MEMORY" / "ingestion_zone"
OUTPUT_FILE = OUTPUT_DIR / "seosona_training_raw.md"

# Regex to match timestamp lines: "00:00:01,000 --> 00:00:04,000"
TIMESTAMP_PATTERN = re.compile(r'^\d{2}:\d{2}:\d{2},\d{3}\s*-->\s*\d{2}:\d{2}:\d{2},\d{3}')
# Regex to match standalone numeric index lines
INDEX_PATTERN = re.compile(r'^\d+$')

def clean_srt(filepath):
    cleaned_lines = []
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
        
    for line in lines:
        line = line.strip()
        if not line:
            continue
        # Skip timestamp lines
        if TIMESTAMP_PATTERN.match(line):
            continue
        # Skip numeric index lines
        if INDEX_PATTERN.match(line):
            continue
        # If it's actual text, keep it
        cleaned_lines.append(line)
        
    # Join sentences to make paragraphs instead of broken lines
    # Simple heuristic: join with space if it doesn't end with punctuation
    text = " ".join(cleaned_lines)
    return text

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    if not SRT_DIR.exists():
        print(f"Error: Directory {SRT_DIR} not found.")
        print("Set SEOSONA_SRT_DIR or place .srt files under 3_MEMORY/ingestion_zone/srt.")
        return

    srt_files = sorted(path for path in SRT_DIR.iterdir() if path.suffix.lower() == '.srt')
    if not srt_files:
        print(f"No .srt files found in {SRT_DIR}")
        return
        
    print(f"Found {len(srt_files)} SRT files. Beginning extraction...")
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as out_f:
        out_f.write("# SEOSONA RAW TRAINING TRANSCRIPTS\n\n")
        
        for filepath in srt_files:
            text = clean_srt(filepath)
            
            # Write a header for the module
            topic_name = filepath.stem
            out_f.write(f"\n## MODULE: {topic_name}\n\n")
            out_f.write(text + "\n\n")
            out_f.write("---\n")
            
            print(f"Processed: {filepath.name}")
            
    print(f"\nSuccess! All transcripts cleaned and aggregated into: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
