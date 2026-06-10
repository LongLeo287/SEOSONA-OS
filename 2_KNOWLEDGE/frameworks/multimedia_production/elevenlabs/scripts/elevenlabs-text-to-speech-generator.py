#!/usr/bin/env python3
"""
ElevenLabs Text-to-Speech Generator

Generate speech from text using ElevenLabs API.

Usage:
    python elevenlabs-text-to-speech-generator.py "Hello world" -o output.mp3
    python elevenlabs-text-to-speech-generator.py "Hello" -v Rachel -m eleven_flash_v2_5
    python elevenlabs-text-to-speech-generator.py -f input.txt -o narration.mp3

Environment:
    ELEVENLABS_API_KEY - Required API key
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


def get_voice_id(client, voice_name: str) -> str:
    """Get voice ID from voice name."""
    voices = client.voices.get_all()
    for voice in voices.voices:
        if voice.name.lower() == voice_name.lower():
            return voice.voice_id

    # Common default voices
    defaults = {
        "rachel": "21m00Tcm4TlvDq8ikWAM",
        "drew": "29vD33N1CtxCmqQRPOHJ",
        "clyde": "2EiwWnXFnvU5JabPnv8n",
        "paul": "5Q0t7uMcjvnagumLfvZi",
        "domi": "AZnzlk1XvdvUeBnXmlld",
        "dave": "CYw3kZ02Hs0563khs1Fj",
        "fin": "D38z5RcWu1voky8WS1ja",
        "sarah": "EXAVITQu4vr4xnSDxMaL",
        "antoni": "ErXwobaYiN019PkySvjV",
        "thomas": "GBv7mTt0atIp3Br8iCZE",
        "charlie": "IKne3meq5aSn9XLyUdCD",
        "george": "JBFqnCBsd6RMkjVDRZzb",
        "emily": "LcfcDJNUP1GQjkzn1xUU",
        "elli": "MF3mGyEYCl7XYWbV9V6O",
        "callum": "N2lVS1w4EtoT3dr4eOWO",
        "patrick": "ODq5zmih8GrVes37Dizd",
        "harry": "SOYHLrjzK2X1ezoPC6cr",
        "liam": "TX3LPaxmHKxFdv7VOQHJ",
        "dorothy": "ThT5KcBeYPX3keUQqHPh",
        "josh": "TxGEqnHWrfWFTfGW9XjX",
        "arnold": "VR6AewLTigWG4xSOukaG",
        "charlotte": "XB0fDUnXU5powFXDhCwa",
        "alice": "Xb7hH8MSUJpSbSDYk0k2",
        "matilda": "XrExE9yKIg1WjnnlVkGX",
        "james": "ZQe5CZNOzWyzPSCn5a3c",
        "joseph": "Zlb1dXrM653N07WRdFW3",
        "jessica": "cgSgspJ2msm6clMCkdW9",
        "michael": "flq6f7yk4E4fJM5XTYuZ",
        "ethan": "g5CIjZEefAph4nQFvHAz",
        "chris": "iP95p4xoKVk53GoZ742B",
        "brian": "nPczCjzI2devNBz1zQrb",
        "daniel": "onwK4e9ZLuTAKqWW03F9",
        "lily": "pFZP5JQG7iQjIQuC4Bku",
        "bill": "pqHfZKP75CvOlQylNhV4",
        "grace": "oWAxZDx7w5VEj9dCyTzz",
        "adam": "pNInz6obpgDQGcFmaJgB",
        "nicole": "piTKgcLEGmPE4e6mEKli",
        "serena": "pMsXgVXv3BLzUgSXRplE",
    }

    if voice_name.lower() in defaults:
        return defaults[voice_name.lower()]

    raise ValueError(f"Voice '{voice_name}' not found. Use --list-voices to see available voices.")


def main():
    parser = argparse.ArgumentParser(description="Generate speech from text using ElevenLabs")
    parser.add_argument("text", nargs="?", help="Text to convert to speech")
    parser.add_argument("-f", "--file", help="Read text from file instead")
    parser.add_argument("-o", "--output", default="output.mp3", help="Output file path")
    parser.add_argument("-v", "--voice", default="Rachel", help="Voice name (default: Rachel)")
    parser.add_argument("-m", "--model", default="eleven_multilingual_v2",
                       help="Model ID (default: eleven_multilingual_v2)")
    parser.add_argument("--stability", type=float, default=0.5, help="Stability (0-1)")
    parser.add_argument("--similarity", type=float, default=0.75, help="Similarity boost (0-1)")
    parser.add_argument("--speed", type=float, default=1.0, help="Speed (0.7-1.2)")
    parser.add_argument("--list-voices", action="store_true", help="List available voices")
    parser.add_argument("--stream", action="store_true", help="Use streaming endpoint")

    args = parser.parse_args()

    api_key = load_env()
    if not api_key:
        print("Error: ELEVENLABS_API_KEY not found in environment or .env files")
        sys.exit(1)

    try:
        from elevenlabs import ElevenLabs
    except ImportError:
        print("Error: elevenlabs package not installed. Run: pip install elevenlabs")
        sys.exit(1)

    client = ElevenLabs(api_key=api_key)

    if args.list_voices:
        voices = client.voices.get_all()
        print("Available voices:")
        for voice in voices.voices:
            print(f"  {voice.name} ({voice.voice_id})")
        return

    if args.file:
        with open(args.file) as f:
            text = f.read()
    elif args.text:
        text = args.text
    else:
        print("Error: Provide text as argument or use -f/--file")
        sys.exit(1)

    voice_id = get_voice_id(client, args.voice)

    print(f"Generating speech...")
    print(f"  Voice: {args.voice} ({voice_id})")
    print(f"  Model: {args.model}")
    print(f"  Text length: {len(text)} characters")

    voice_settings = {
        "stability": args.stability,
        "similarity_boost": args.similarity,
        "speed": args.speed,
    }

    if args.stream:
        audio = client.text_to_speech.convert_as_stream(
            voice_id=voice_id,
            text=text,
            model_id=args.model,
            voice_settings=voice_settings,
        )
    else:
        audio = client.text_to_speech.convert(
            voice_id=voice_id,
            text=text,
            model_id=args.model,
            voice_settings=voice_settings,
        )

    with open(args.output, "wb") as f:
        for chunk in audio:
            f.write(chunk)

    print(f"Audio saved to: {args.output}")


if __name__ == "__main__":
    main()
