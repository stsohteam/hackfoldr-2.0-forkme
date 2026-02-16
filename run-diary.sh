#!/usr/bin/env bash
set -euo pipefail

# 一鍵執行：將逐字稿轉成日記
# 用法：
#   ./run-diary.sh [input.txt] [output.md] [YYYY-MM-DD]

INPUT_FILE="${1:-transcript.txt}"
DATE_ARG="${3:-$(date +%F)}"
OUTPUT_FILE="${2:-diary-${DATE_ARG}.md}"

if [ ! -f "$INPUT_FILE" ]; then
  cat <<MSG
找不到逐字稿檔案：$INPUT_FILE

請先準備文字檔，或指定路徑：
  ./run-diary.sh your-transcript.txt
MSG
  exit 1
fi

node tools/transcript_to_diary.js "$INPUT_FILE" "$OUTPUT_FILE" "$DATE_ARG"

echo "完成：$OUTPUT_FILE"
