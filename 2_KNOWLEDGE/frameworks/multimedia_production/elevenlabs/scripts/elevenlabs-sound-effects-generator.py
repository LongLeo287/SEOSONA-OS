#!/usr/bin/env python3
"""
ElevenLabs Sound Effects Generator

Generate sound effects from text descriptions.

Usage:
    python elevenlabs-sound-effects-generator.py "Thunder rumbling" -o thunder.mp3
    python elevenlabs-sound-effects-generator.py "Footsteps on gravel" -d 5 -o steps.mp3
    python elevenlabs-sound-effects-generator.py "Coffee shop ambience" --loop -o cafe.mp3

Environment:
    ELEVENLABS_API_KEY - Required API key

Notes:
    - Maximum duration: 30 seconds
    - Use --loop for seamless looping audio
    - Be descriptive for better results
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


def main():
    parser = argparse.ArgumentParser(description="Generate sound effects using ElevenLabs")
    parser.add_argument("prompt", help="Description of the sound effect")
    parser.add_argument("-o", "--output", default="sound_effect.mp3", help="Output file")
    parser.add_argument("-d", "--duration", type=float, help="Duration in seconds (max 30)")
    parser.add_argument("--loop", action="store_true", help="Generate looping audio")
    parser.add_argument("--influence", type=float, default=0.5,
                       help="Prompt influence (0-1, higher = stricter)")

    args = parser.parse_args()

    if args.duration and args.duration > 30:
        print("Error: Maximum duration is 30 seconds")
        sys.exit(1)

    api_key = load_env()
    if not api_key:
        print("Error: ELEVENLABS_API_KEY not found")
        sys.exit(1)

    try:
        from elevenlabs import ElevenLabs
    except ImportError:
        print("Error: elevenlabs package not installed. Run: pip install elevenlabs")
        sys.exit(1)

    client = ElevenLabs(api_key=api_key)

    print(f"Generating sound effect...")
    print(f"  Prompt: {args.prompt}")
    if args.duration:
        print(f"  Duration: {args.duration}s")
    if args.loop:
        print(f"  Looping: Yes")

    try:
        # Build kwargs
        kwargs = {"text": args.prompt}
        if args.duration:
            kwargs["duration_seconds"] = args.duration

        audio = client.sound_effects.generate(**kwargs)

        with open(args.output, "wb") as f:
            for chunk in audio:
                f.write(chunk)

        print(f"\nSound effect saved to: {args.output}")

    except Exception as e:
        print(f"Error generating sound effect: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
