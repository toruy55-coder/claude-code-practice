#!/usr/bin/env python3
"""
Claude Code Practice - Hello World with Style
"""

from datetime import datetime
import platform
import sys


def print_banner():
    """カッコいいバナーを表示"""
    banner = """
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Welcome to Claude Code Practice! 🚀             ║
║                                                       ║
║   Building amazing projects with AI assistance       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    """
    print(banner)


def print_system_info():
    """システム情報を表示"""
    print("📊 System Information:")
    print(f"  ├─ OS: {platform.system()} {platform.release()}")
    print(f"  ├─ Python: {sys.version.split()[0]}")
    print(f"  └─ Architecture: {platform.machine()}")
    print()


def print_datetime_info():
    """詳細な日時情報を表示"""
    now = datetime.now()

    print("🕐 Date & Time Information:")
    print(f"  ├─ Date: {now.strftime('%Y年%m月%d日 (%A)')}")
    print(f"  ├─ Time: {now.strftime('%H:%M:%S')}")
    print(f"  ├─ Week: {now.strftime('%U')}週目")
    print(f"  └─ Unix Timestamp: {int(now.timestamp())}")
    print()


def print_project_info():
    """プロジェクト情報を表示"""
    print("📁 Project Information:")
    print("  ├─ Name: Claude Code Practice")
    print("  ├─ Branch: claude/improve-branch-naming-01Bj2CthHw3aB9JU8Nk9wACE")
    print("  ├─ Purpose: Learning and experimenting with Claude Code")
    print("  └─ Status: ✨ Active Development")
    print()


def main():
    """メイン関数"""
    print_banner()
    print_system_info()
    print_datetime_info()
    print_project_info()

    print("💡 Tip: Run 'python src/hello.py' to see this message again!")
    print("🌟 Happy coding with Claude!")


if __name__ == "__main__":
    main()
