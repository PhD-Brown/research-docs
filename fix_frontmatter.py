#!/usr/bin/env python3
"""
Fix YAML frontmatter special characters in all generated docs.
Run from the ROOT of the research-docs repository.

    python fix_frontmatter.py

Wraps title and description values in double quotes to prevent
YAML parsing errors caused by: colons, ampersands, ξ, Λ, etc.
"""

import re
from pathlib import Path

BASE = Path("website")
FIXED = 0
SKIPPED = 0


def fix_file(path: Path) -> None:
    global FIXED, SKIPPED

    text = path.read_text(encoding="utf-8")

    # Only touch the frontmatter block (between first two ---)
    # Find frontmatter boundaries
    if not text.startswith("---"):
        SKIPPED += 1
        return

    end = text.find("\n---", 3)
    if end == -1:
        SKIPPED += 1
        return

    frontmatter = text[3:end]
    body = text[end:]

    # Fix `title:` and `description:` values that:
    # - are not already quoted
    # - contain special YAML characters: : & # * ? | > < = ! % @ ` ξ Λ
    def quote_value(match):
        key    = match.group(1)   # e.g. "title: " or "description: "
        value  = match.group(2)   # the raw value
        # Already quoted → leave alone
        if value.startswith('"') or value.startswith("'"):
            return match.group(0)
        # Check if value needs quoting
        needs_quote = any(c in value for c in ':&#*?|><!=@`ξΛΞ')
        if needs_quote:
            # Escape any existing double quotes in the value
            escaped = value.replace('"', '\\"')
            return f'{key}"{escaped}"'
        return match.group(0)

    fixed_fm = re.sub(
        r'^((?:title|description):\s*)(.+)$',
        quote_value,
        frontmatter,
        flags=re.MULTILINE
    )

    if fixed_fm == frontmatter:
        SKIPPED += 1
        return

    new_text = "---" + fixed_fm + body
    path.write_text(new_text, encoding="utf-8")
    print(f"  [fixed] {path.relative_to(BASE)}")
    FIXED += 1


def main():
    print(f"\nScanning docs in {BASE.resolve()}...\n")

    for folder in ["docs", "docs-astrovision", "docs-xi"]:
        p = BASE / folder
        if not p.exists():
            print(f"  [skip] {folder}/ not found")
            continue
        for md in p.rglob("*.md"):
            fix_file(md)
        for mdx in p.rglob("*.mdx"):
            fix_file(mdx)

    print(f"\n✅  Done — {FIXED} files fixed, {SKIPPED} already clean.\n")


if __name__ == "__main__":
    main()
