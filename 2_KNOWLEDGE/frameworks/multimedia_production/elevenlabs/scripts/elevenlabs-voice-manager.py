#!/usr/bin/env python3
"""
ElevenLabs Voice Manager

List, get details, and manage voices.

Usage:
    python elevenlabs-voice-manager.py list
    python elevenlabs-voice-manager.py get <voice_id>
    python elevenlabs-voice-manager.py delete <voice_id>

Environment:
    ELEVENLABS_API_KEY - Required API key
"""

import argparse
import json
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


def list_voices(client, show_json: bool = False):
    """List all available voices."""
    voices = client.voices.get_all()

    if show_json:
        data = [
            {
                "voice_id": v.voice_id,
                "name": v.name,
                "category": getattr(v, "category", "unknown"),
                "labels": getattr(v, "labels", {}),
            }
            for v in voices.voices
        ]
        print(json.dumps(data, indent=2))
        return

    print(f"Found {len(voices.voices)} voices:\n")

    # Group by category
    categories = {}
    for voice in voices.voices:
        cat = getattr(voice, "category", "other")
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(voice)

    for category, voice_list in sorted(categories.items()):
        print(f"[{category.upper()}]")
        for voice in sorted(voice_list, key=lambda v: v.name):
            labels = getattr(voice, "labels", {})
            label_str = ", ".join(f"{k}: {v}" for k, v in labels.items()) if labels else ""
            print(f"  {voice.name:20} {voice.voice_id}")
            if label_str:
                print(f"    {label_str}")
        print()


def get_voice(client, voice_id: str, show_json: bool = False):
    """Get details for a specific voice."""
    try:
        voice = client.voices.get(voice_id=voice_id)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

    if show_json:
        data = {
            "voice_id": voice.voice_id,
            "name": voice.name,
            "category": getattr(voice, "category", "unknown"),
            "labels": getattr(voice, "labels", {}),
            "description": getattr(voice, "description", ""),
            "settings": {
                "stability": getattr(voice.settings, "stability", None) if voice.settings else None,
                "similarity_boost": getattr(voice.settings, "similarity_boost", None) if voice.settings else None,
            } if voice.settings else None,
        }
        print(json.dumps(data, indent=2))
        return

    print(f"Voice: {voice.name}")
    print(f"ID: {voice.voice_id}")
    print(f"Category: {getattr(voice, 'category', 'unknown')}")

    if hasattr(voice, "labels") and voice.labels:
        print(f"Labels: {voice.labels}")

    if hasattr(voice, "description") and voice.description:
        print(f"Description: {voice.description}")

    if voice.settings:
        print(f"Settings:")
        print(f"  Stability: {getattr(voice.settings, 'stability', 'N/A')}")
        print(f"  Similarity: {getattr(voice.settings, 'similarity_boost', 'N/A')}")


def delete_voice(client, voice_id: str, force: bool = False):
    """Delete a voice."""
    if not force:
        try:
            voice = client.voices.get(voice_id=voice_id)
            print(f"About to delete voice: {voice.name} ({voice_id})")
        except Exception:
            pass

        confirm = input("Are you sure? (yes/no): ")
        if confirm.lower() != "yes":
            print("Cancelled.")
            return

    try:
        client.voices.delete(voice_id=voice_id)
        print(f"Voice {voice_id} deleted successfully.")
    except Exception as e:
        print(f"Error deleting voice: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Manage ElevenLabs voices")
    parser.add_argument("--json", action="store_true", help="Output as JSON")

    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # list command
    subparsers.add_parser("list", help="List all voices")

    # get command
    get_parser = subparsers.add_parser("get", help="Get voice details")
    get_parser.add_argument("voice_id", help="Voice ID")

    # delete command
    delete_parser = subparsers.add_parser("delete", help="Delete a voice")
    delete_parser.add_argument("voice_id", help="Voice ID to delete")
    delete_parser.add_argument("--force", "-f", action="store_true", help="Skip confirmation")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
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

    if args.command == "list":
        list_voices(client, args.json)
    elif args.command == "get":
        get_voice(client, args.voice_id, args.json)
    elif args.command == "delete":
        delete_voice(client, args.voice_id, getattr(args, "force", False))


if __name__ == "__main__":
    main()
