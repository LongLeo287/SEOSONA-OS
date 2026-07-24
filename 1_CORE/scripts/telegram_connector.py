from pathlib import Path
import os
import asyncio
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes

# Import Hermes Brain
from hermes_brain import HermesBrain

# PREREQUISITE: replace this token with the one issued by @BotFather on Telegram.
TELEGRAM_BOT_TOKEN = os.getenv("SEOSONA_TELEGRAM_TOKEN", "YOUR_BOT_TOKEN_HERE")

# Authorization allowlist: comma-separated numeric Telegram user IDs permitted to
# drive the command router. Empty/unset => deny everyone (fail closed).
def _load_allowed_ids():
    raw = os.getenv("SEOSONA_TELEGRAM_ALLOWED_IDS", "")
    ids = set()
    for part in raw.split(","):
        part = part.strip()
        if part.isdigit():
            ids.add(int(part))
    return ids

ALLOWED_TELEGRAM_IDS = _load_allowed_ids()

def _is_authorized(update: Update) -> bool:
    user = update.effective_user
    return bool(user) and user.id in ALLOWED_TELEGRAM_IDS

# Khởi tạo Não bộ
brain = HermesBrain()

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not _is_authorized(update):
        await update.message.reply_text("⛔ Unauthorized. This command center is private.")
        return
    welcome_msg = (
        "🧠 **SEOSONA OS - Remote Command Center** 🧠\n\n"
        "Chào mừng sếp! Hệ thống Hermes Agent đã sẵn sàng nhận lệnh.\n"
        "Hãy gõ lệnh tự nhiên (Ví dụ: 'Kiểm tra trạng thái hệ thống' hoặc 'Quét repo mới')."
    )
    await update.message.reply_text(welcome_msg, parse_mode='Markdown')

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not _is_authorized(update):
        await update.message.reply_text("⛔ Unauthorized. This command center is private.")
        return

    user_command = update.message.text

    # Báo cho người dùng biết Bot đang suy nghĩ
    await update.message.reply_text("🔄 Đang xử lý lệnh của sếp...")
    
    # Đẩy lệnh vào HermesBrain để xử lý
    response = brain.process_command(user_command)
    
    # Trả kết quả về cho người dùng
    await update.message.reply_text(response, parse_mode='Markdown')

def main():
    if TELEGRAM_BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        print("[!] ERROR: Vui lòng thay TELEGRAM_BOT_TOKEN bằng Token thực tế từ @BotFather.")
        return

    if not ALLOWED_TELEGRAM_IDS:
        print("[!] REFUSING TO START: SEOSONA_TELEGRAM_ALLOWED_IDS is empty.")
        print("    Set it to a comma-separated list of authorized numeric Telegram user IDs.")
        print("    Without an allowlist anyone could drive the command router (fail-closed).")
        return

    print("🚀 Khởi động SEOSONA Telegram Connector...")
    app = ApplicationBuilder().token(TELEGRAM_BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("✅ Telegram Bot đang chạy ngầm và lắng nghe lệnh...")
    app.run_polling()

if __name__ == '__main__':
    main()
