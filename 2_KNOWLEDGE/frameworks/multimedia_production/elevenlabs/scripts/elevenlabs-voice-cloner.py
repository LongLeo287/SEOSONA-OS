#!/usr/bin/env python3
"""
ElevenLabs Voice Cloner

Clone voices from audio samples using Instant Voice Cloning.

Usage:
    python elevenlabs-voice-cloner.py "My Voice" sample1.mp3 sample2.mp3
    python elevenlabs-voice-cloner.py "Narrator" recording.wav -d "Voice for audiobooks"

Environment:
    ELEVENLABS_API_KEY - Required API key

Notes:
    - Instant Voice Cloning requires 1-2 minutes of clear audio
    - Don't exceed 3 minutes total - can reduce quality
    - Audio should have no background noise, reverb, or artifacts
"""

import argparse
import os
import sys
from pathlib import Path


def load_env():
    """Load API key from environment or .env files."""
    if os.environ.get("ELEVENLABS_API_KEY"):
        return os.environ["ELEVENLABS_API_KEY"]

    env_paths = [
        Path.cwd() / ".claude" / ".env",
        Path.cwd() / ".claude" / "skills" / ".env",
        Path.cwd() / ".env",
        Path(__file__).parent / ".env",
        Path(__file__).parent.parent / ".env",
        Path.home() / ".claude" / "skills" / ".env",
        Path.home() / ".claude" / ".env",
    ]

    for env_path in env_paths:
        if env_path.exists():
            with open(env_path) as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("ELEVENLABS_API_KEY="):
                        return line.split("=", 1)[1].strip().strip('"\'')

    return None


def validate_audio_files(files: list) -> list:
    """Validate audio files exist and have supported formats."""
    supported = {".mp3", ".wav", ".m4a", ".ogg", ".flac", ".webm"}
    validated = []

    for f in files:
        path = Path(f)
        if not path.exists():
            print(f"Error: File not found: {f}")
            sys.exit(1)
        if path.suffix.lower() not in supported:
            print(f"Warning: {f} may not be supported. Supported: {supported}")
        validated.append(str(path))

    return validated


def main():
    parser = argparse.ArgumentParser(description="Clone a voice using ElevenLabs")
    parser.add_argument("name", help="Name for the cloned voice")
    parser.add_argument("files", nargs="+", help="Audio sample files (1-2 min total)")
    parser.add_argument("-d", "--description", default="", help="Voice description")
    parser.add_argument("--labels", help="Labels as JSON (e.g., '{\"accent\": \"american\"}')")

    args = parser.parse_args()

    api_key = load_env()
    if not api_key:
        print("Error: ELEVENLABS_API_KEY not found")
        sys.exit(1)

    try:
        from elevenlabs import ElevenLabs
    except ImportError:
        print("Error: elevenlabs package not installed. Run: pip install elevenlabs")
        sys.exit(1)

    files = validate_audio_files(args.files)

    print(f"Cloning voice: {args.name}")
    print(f"Using {len(files)} audio file(s):")
    for f in files:
        print(f"  - {f}")

    client = ElevenLabs(api_key=api_key)

    # Parse labels if provided
    labels = None
    if args.labels:
        import json
        try:
            labels = json.loads(args.labels)
        except json.JSONDecodeError:
            print("Error: Invalid JSON for labels")
            sys.exit(1)

    try:
        voice = client.voices.add(
            name=args.name,
            files=files,
            description=args.description,
            labels=labels,
        )

        print(f"\nVoice cloned successfully!")
        print(f"  Name: {voice.name}")
        print(f"  Voice ID: {voice.voice_id}")
        print(f"\nUse this voice ID in TTS requests.")

    except Exception as e:
        print(f"Error cloning voice: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
