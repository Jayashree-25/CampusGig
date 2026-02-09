#!/usr/bin/env python3
"""
================================================================================
                            USAGE DOCUMENTATION
================================================================================

SYNOPSIS
    python dump.py [OPTIONS]

DESCRIPTION
    Dump repository code to a single file optimized for LLM context.
    Respects .gitignore by default, supports selective folder inclusion,
    and provides multiple output formats.

OPTIONS
    -o, --output FILENAME
        Output file name
        Default: codebase_context.txt
        Example: -o fastdrive_stuff.txt

    -f, --folders FOLDER [FOLDER ...]
        Include only specific folders in the dump
        If omitted, includes all files
        Example: --folders backend frontend src

    --full-tree
        Show complete repository tree even when using --folders
        Without this flag, tree shows only filtered folders
        Example: --full-tree

    --force FILE [FILE ...]
        Force-include specific files even if gitignored
        Useful for .env, config files, build outputs
        Example: --force .env config/secrets.json

    --format {xml,markdown,plain}
        Output format for LLM optimization
        - xml: Structured tags, best for Claude/Gemini (default)
        - markdown: Code blocks with syntax highlighting
        - plain: Simple text format
        Default: xml
        Example: --format markdown

EXAMPLES
    # Basic: Dump entire repository in XML format
    python dump.py

    # Specific folders with full tree visible
    python dump.py --full-tree --folders fastdrive templates video_maker -o output.txt

    # Include gitignored files
    python dump.py --folders backend --force .env .env.local

    # Markdown format for general LLMs
    python dump.py --format markdown -o context.md

    # Complete example with all options
    python dump.py --full-tree \
                   --folders fastdrive templates video_maker \
                   --force .env \
                   -o fastdrive_stuff.txt \
                   --format xml

COMMON USE CASES
    # Frontend code only
    python dump.py --folders src/components src/pages -o frontend.txt

    # Backend with environment files
    python dump.py --folders backend api --force .env .env.prod

    # Everything except node_modules (auto-excluded via .gitignore)
    python dump.py --full-tree

    # Specific config files even if ignored
    python dump.py --folders config --force config/.env.production

FORMAT COMPARISON
    XML Format (--format xml):
        - Best for: Claude, Gemini
        - Structure: <file><path>...</path><content>...</content></file>
        - Benefits: Clear metadata, easier parsing, 15-20% token savings
        - Use when: Feeding to Anthropic Claude or Google Gemini

    Markdown Format (--format markdown):
        - Best for: All LLMs, human readability
        - Structure: ## Files with ```language code blocks
        - Benefits: Syntax highlighting, readable
        - Use when: General purpose, multiple LLMs, documentation

    Plain Format (--format plain):
        - Best for: Simple contexts, quick dumps
        - Structure: --- FILE: path --- followed by content
        - Benefits: Minimal overhead, simple
        - Use when: Small codebases, simple prompts

OUTPUT STRUCTURE
    XML format includes:
    - <metadata>: Project name, file count, filtered folders
    - <directory_structure>: Full or filtered tree
    - <source_files>: Each file with path, language, line count, content

    All formats:
    - Respect .gitignore (unless --force used)
    - Skip binary files automatically
    - Include line counts and language detection
    - Sort files alphabetically

TIPS
    1. Use --full-tree when you want LLM to see project structure
       but only process specific folders
    
    2. XML format is best for Claude - it understands tags natively
    
    3. For large codebases, filter to relevant folders to save tokens
    
    4. Use --force for config files you need but keep gitignored
    
    5. File extension doesn't matter - use .txt, .xml, .md as you prefer

NOTES
    - Binary files are auto-detected and skipped
    - Output file is auto-excluded from dump
    - Git repo detection is automatic
    - Falls back to manual .gitignore parsing if git unavailable

================================================================================
"""


import os
import sys
import shutil
import subprocess
import pathlib
import argparse
from typing import List, Set, Dict
from collections import defaultdict


def parse_args():
    parser = argparse.ArgumentParser(
        description="Dump repository code optimized for LLM context"
    )
    parser.add_argument(
        "-o", "--output",
        default="codebase_context.txt",
        help="Output file name"
    )
    parser.add_argument(
        "-f", "--folders",
        nargs="*",
        help="Specific folders to include"
    )
    parser.add_argument(
        "--full-tree",
        action="store_true",
        help="Show full project tree"
    )
    parser.add_argument(
        "--force",
        nargs="*",
        help="Force-include specific files even if gitignored"
    )
    parser.add_argument(
        "--format",
        choices=["xml", "markdown", "plain"],
        default="xml",
        help="Output format (default: xml, best for Claude/Gemini)"
    )
    return parser.parse_args()


def get_language(path: pathlib.Path) -> str:
    """Detect language from file extension"""
    ext_map = {
        ".py": "python", ".js": "javascript", ".ts": "typescript",
        ".jsx": "jsx", ".tsx": "tsx", ".java": "java",
        ".cpp": "cpp", ".c": "c", ".h": "c", ".hpp": "cpp",
        ".go": "go", ".rs": "rust", ".rb": "ruby",
        ".php": "php", ".swift": "swift", ".kt": "kotlin",
        ".scala": "scala", ".sh": "bash", ".bash": "bash",
        ".sql": "sql", ".html": "html", ".css": "css",
        ".json": "json", ".xml": "xml", ".yaml": "yaml", ".yml": "yaml",
        ".md": "markdown", ".txt": "text", ".env": "env",
        ".dockerfile": "dockerfile", ".gitignore": "gitignore"
    }
    
    ext = path.suffix.lower()
    if ext in ext_map:
        return ext_map[ext]
    
    # Check filename patterns
    name = path.name.lower()
    if name == "dockerfile":
        return "dockerfile"
    if name == "makefile":
        return "makefile"
    
    return "text"


def count_lines(path: pathlib.Path) -> int:
    """Count lines in file"""
    try:
        return len(path.read_text(encoding="utf-8", errors="ignore").splitlines())
    except Exception:
        return 0


def in_git_repo(root: pathlib.Path) -> bool:
    return (root / ".git").exists()


def get_files_via_git(root: pathlib.Path) -> List[pathlib.Path]:
    cmd = ["git", "ls-files", "-z", "-co", "--exclude-standard"]
    out = subprocess.check_output(cmd, cwd=root)
    items = [p for p in out.decode("utf-8", "replace").split("\0") if p]
    return [root / p for p in items]


def get_files_via_lib(root: pathlib.Path) -> List[pathlib.Path]:
    gi = root / ".gitignore"
    if gi.exists():
        try:
            from gitignore_parser import parse_gitignore
            matches = parse_gitignore(str(gi))
            paths = []
            for dirpath, dirnames, filenames in os.walk(root):
                if os.path.basename(dirpath) == ".git":
                    dirnames[:] = []
                    continue
                for name in filenames:
                    fp = pathlib.Path(dirpath) / name
                    if matches(str(fp)):
                        continue
                    paths.append(fp)
            return [p for p in paths if p.is_file()]
        except Exception:
            pass

        try:
            from pathspec import PathSpec
            patterns = gi.read_text(encoding="utf-8", errors="ignore").splitlines()
            spec = PathSpec.from_lines("gitwildmatch", patterns)
            paths = []
            for dirpath, dirnames, filenames in os.walk(root):
                if os.path.basename(dirpath) == ".git":
                    dirnames[:] = []
                    continue
                for name in filenames:
                    rel = os.path.relpath(os.path.join(dirpath, name), start=root)
                    if spec.match_file(rel):
                        continue
                    paths.append(root / rel)
            return [p for p in paths if p.is_file()]
        except Exception:
            pass

    skip_dirs = {".git", ".hg", ".svn", "node_modules", ".venv", "venv", "__pycache__"}
    paths = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in skip_dirs]
        for name in filenames:
            paths.append(pathlib.Path(dirpath) / name)
    return [p for p in paths if p.is_file()]


def filter_by_folders(files: List[pathlib.Path], root: pathlib.Path, 
                      folders: List[str]) -> List[pathlib.Path]:
    if not folders:
        return files
    
    folder_paths = {pathlib.Path(f).as_posix() for f in folders}
    filtered = []
    
    for file in files:
        rel = file.relative_to(root).as_posix()
        for folder in folder_paths:
            if rel.startswith(folder + "/") or rel.split("/")[0] == folder:
                filtered.append(file)
                break
    
    return filtered


def add_forced_files(files: List[pathlib.Path], root: pathlib.Path,
                     forced: List[str]) -> List[pathlib.Path]:
    if not forced:
        return files
    
    existing_rels = {f.relative_to(root).as_posix() for f in files}
    all_files = list(files)
    
    for forced_path in forced:
        fp = root / forced_path
        if fp.exists() and fp.is_file():
            rel = fp.relative_to(root).as_posix()
            if rel not in existing_rels:
                all_files.append(fp)
    
    return all_files


def is_binary_file(path: pathlib.Path, blocksize: int = 1024) -> bool:
    try:
        with open(path, "rb") as f:
            chunk = f.read(blocksize)
            return b"\x00" in chunk
    except Exception:
        return True


def build_tree(paths: List[pathlib.Path], root: pathlib.Path) -> str:
    rels = sorted([p.relative_to(root).as_posix() for p in paths])
    dirs = defaultdict(set)
    files_in_dir = defaultdict(list)

    for rel in rels:
        parts = rel.split("/")
        for i in range(len(parts) - 1):
            parent = "/".join(parts[: i + 1])
            child = parts[i + 1]
            if i + 1 < len(parts) - 1:
                dirs[parent].add(child)
        dkey = "/".join(parts[:-1])
        files_in_dir[dkey].append(parts[-1])

    dirs[""] |= set([p.split("/")[0] for p in rels if "/" in p])
    files_in_dir[""] += [p for p in rels if "/" not in p]

    lines = [root.name + "/"]

    def render(dir_key: str, prefix: str = ""):
        entries = sorted([("DIR", n) for n in sorted(dirs.get(dir_key, []))] +
                         [("FILE", n) for n in sorted(files_in_dir.get(dir_key, []))])
        for idx, (kind, name) in enumerate(entries):
            last = idx == len(entries) - 1
            connector = "└── " if last else "├── "
            lines.append(prefix + connector + name)
            if kind == "DIR":
                next_key = name if dir_key == "" else f"{dir_key}/{name}"
                extension = "    " if last else "│   "
                render(next_key, prefix + extension)

    render("")
    return "\n".join(lines)


def write_xml_format(out, root: pathlib.Path, tree_files: List[pathlib.Path],
                     content_files: List[pathlib.Path], args):
    """XML format - optimized for Claude"""
    out.write("<codebase>\n\n")
    
    # Metadata section
    out.write("<metadata>\n")
    out.write(f"  <project_root>{root.name}</project_root>\n")
    out.write(f"  <total_files>{len(content_files)}</total_files>\n")
    if args.folders:
        out.write(f"  <filtered_folders>{', '.join(args.folders)}</filtered_folders>\n")
    out.write("</metadata>\n\n")
    
    # Tree structure
    out.write("<directory_structure>\n")
    out.write(build_tree(tree_files, root))
    out.write("\n</directory_structure>\n\n")
    
    # Group files by directory
    out.write("<source_files>\n\n")
    
    for path in sorted(content_files, key=lambda p: p.as_posix()):
        rel = path.relative_to(root).as_posix()
        lang = get_language(path)
        lines = count_lines(path)
        
        out.write(f"<file>\n")
        out.write(f"  <path>{rel}</path>\n")
        out.write(f"  <language>{lang}</language>\n")
        out.write(f"  <lines>{lines}</lines>\n")
        out.write(f"  <content>\n")
        
        if is_binary_file(path):
            out.write("[binary file]\n")
        else:
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                text = path.read_text(encoding="utf-8", errors="replace")
            out.write(text)
            if not text.endswith("\n"):
                out.write("\n")
        
        out.write("  </content>\n")
        out.write("</file>\n\n")
    
    out.write("</source_files>\n\n")
    out.write("</codebase>\n")


def write_markdown_format(out, root: pathlib.Path, tree_files: List[pathlib.Path],
                          content_files: List[pathlib.Path], args):
    """Markdown format - good for general LLMs"""
    out.write("# Codebase Context\n\n")
    
    # Metadata
    out.write("## Metadata\n\n")
    out.write(f"- **Project**: {root.name}\n")
    out.write(f"- **Total Files**: {len(content_files)}\n")
    if args.folders:
        out.write(f"- **Filtered Folders**: {', '.join(args.folders)}\n")
    out.write("\n")
    
    # Tree
    out.write("## Directory Structure\n\n")
    out.write("```\n")
    out.write(build_tree(tree_files, root))
    out.write("\n```\n\n")
    
    # Files
    out.write("## Source Files\n\n")
    
    for path in sorted(content_files, key=lambda p: p.as_posix()):
        rel = path.relative_to(root).as_posix()
        lang = get_language(path)
        lines = count_lines(path)
        
        out.write(f"### {rel}\n\n")
        out.write(f"**Language**: {lang} | **Lines**: {lines}\n\n")
        
        if is_binary_file(path):
            out.write("```\n[binary file]\n```\n\n")
        else:
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                text = path.read_text(encoding="utf-8", errors="replace")
            out.write(f"```{lang}\n")
            out.write(text)
            if not text.endswith("\n"):
                out.write("\n")
            out.write("```\n\n")


def write_plain_format(out, root: pathlib.Path, tree_files: List[pathlib.Path],
                       content_files: List[pathlib.Path], args):
    """Plain text format - original style"""
    out.write("PROJECT TREE\n")
    out.write("============\n")
    out.write(build_tree(tree_files, root))
    out.write("\n\n")
    
    out.write("FILES AND CONTENTS\n")
    out.write("==================\n\n")
    
    for path in sorted(content_files, key=lambda p: p.as_posix()):
        rel = path.relative_to(root).as_posix()
        out.write(f"--- FILE: {rel} ---\n")
        
        if is_binary_file(path):
            out.write("[binary file skipped]\n\n")
            continue
            
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            text = path.read_text(encoding="utf-8", errors="replace")
        out.write(text)
        if not text.endswith("\n"):
            out.write("\n")
        out.write("\n")


def main():
    args = parse_args()
    root = pathlib.Path.cwd()
    out_path = root / args.output

    # Gather files
    if shutil.which("git") and in_git_repo(root):
        try:
            all_files = get_files_via_git(root)
        except Exception:
            all_files = get_files_via_lib(root)
    else:
        all_files = get_files_via_lib(root)

    all_files = [p for p in all_files if p.resolve() != out_path.resolve()]
    all_files = [p for p in all_files if p.is_file()]

    content_files = filter_by_folders(all_files, root, args.folders or [])
    content_files = add_forced_files(content_files, root, args.force or [])
    tree_files = all_files if args.full_tree else content_files

    # Write output
    with open(out_path, "w", encoding="utf-8") as out:
        if args.format == "xml":
            write_xml_format(out, root, tree_files, content_files, args)
        elif args.format == "markdown":
            write_markdown_format(out, root, tree_files, content_files, args)
        else:
            write_plain_format(out, root, tree_files, content_files, args)

    print(f"✓ Wrote {out_path}")
    print(f"  Format: {args.format}")
    print(f"  Files: {len(content_files)}")
    total_lines = sum(count_lines(f) for f in content_files if not is_binary_file(f))
    print(f"  Lines: ~{total_lines:,}")


if __name__ == "__main__":
    main()
