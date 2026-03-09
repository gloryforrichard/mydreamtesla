#!/usr/bin/env python3
"""
MyDreamTesla Backlink Submission Script
自动向目标站点提交外链
"""

import sys

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("请安装依赖: pip3 install requests beautifulsoup4")
    sys.exit(1)

import argparse
import csv
import json
import os
import random
import re
import time
from datetime import datetime
from pathlib import Path
from urllib.parse import urljoin, urlparse

BASE_DIR = Path(__file__).parent.parent / "TeslaData"
TARGETS_FILE = BASE_DIR / "backlink-targets.json"
RESULTS_FILE = BASE_DIR / "backlink-results.csv"
CONTENT_DIR = BASE_DIR / "backlink-content"
MANUAL_FILE = BASE_DIR / "manual-actions.md"

TELEGRAPH_TOKEN = "250df5bd0e23098e6740c9e9e9925cd98867b92e746224df9a0262c40cc1"
TELEGRAPH_AUTHOR = "MyDreamTesla"
TELEGRAPH_AUTHOR_URL = "https://mydreamtesla.com"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    )
}

RESULTS_FIELDS = [
    "id", "name", "url", "category", "link_type",
    "submit_method", "status", "result_url", "timestamp", "notes",
]


def markdown_to_telegraph_nodes(md_text: str) -> list:
    """将 Markdown 文本转换为 Telegraph Node 格式"""
    nodes = []
    lines = md_text.strip().split("\n")
    current_paragraph = []

    def flush_paragraph():
        if current_paragraph:
            text = " ".join(current_paragraph)
            children = parse_inline(text)
            if children:
                nodes.append({"tag": "p", "children": children})
            current_paragraph.clear()

    def parse_inline(text: str) -> list:
        """解析行内 Markdown: **bold**, [text](url)"""
        result = []
        pattern = re.compile(
            r'\*\*(.+?)\*\*'        # **bold**
            r'|\[([^\]]+)\]\(([^)]+)\)'  # [text](url)
        )
        last_end = 0
        for m in pattern.finditer(text):
            if m.start() > last_end:
                result.append(text[last_end:m.start()])
            if m.group(1):  # bold
                result.append({"tag": "strong", "children": [m.group(1)]})
            elif m.group(2):  # link
                result.append({
                    "tag": "a",
                    "attrs": {"href": m.group(3)},
                    "children": [m.group(2)],
                })
            last_end = m.end()
        if last_end < len(text):
            result.append(text[last_end:])
        return result

    for line in lines:
        stripped = line.strip()

        if not stripped:
            flush_paragraph()
            continue

        if stripped.startswith("# "):
            flush_paragraph()
            nodes.append({"tag": "h3", "children": parse_inline(stripped[2:])})
        elif stripped.startswith("## "):
            flush_paragraph()
            nodes.append({"tag": "h4", "children": parse_inline(stripped[3:])})
        elif stripped.startswith("### "):
            flush_paragraph()
            nodes.append({"tag": "h4", "children": parse_inline(stripped[4:])})
        elif stripped.startswith("- ") or stripped.startswith("* "):
            flush_paragraph()
            # 简单处理：每个列表项作为带 bullet 的段落
            item_text = stripped[2:]
            children = parse_inline(item_text)
            nodes.append({"tag": "p", "children": ["• "] + children})
        else:
            current_paragraph.append(stripped)

    flush_paragraph()
    return nodes


class BacklinkSubmitter:
    def __init__(self, dry_run: bool = False, delay: int = 10):
        self.dry_run = dry_run
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.results: list[dict] = []
        self.stats = {
            "auto_success": 0,
            "auto_pending": 0,
            "auto_failed": 0,
            "manual": 0,
            "skipped": 0,
        }

    def load_targets(self) -> list[dict]:
        if not TARGETS_FILE.exists():
            print(f"错误: 目标文件不存在 — {TARGETS_FILE}")
            sys.exit(1)
        with open(TARGETS_FILE, encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, list) else data.get("targets", [])

    def _random_delay(self):
        """随机化延迟 (delay ± 30%)"""
        jitter = self.delay * 0.3
        wait = self.delay + random.uniform(-jitter, jitter)
        time.sleep(max(1, wait))

    def _record(self, target: dict, status: str, result_url: str = "", notes: str = ""):
        self.results.append({
            "id": target.get("id", ""),
            "name": target.get("name", ""),
            "url": target.get("url", ""),
            "category": target.get("category", ""),
            "link_type": target.get("link_type", ""),
            "submit_method": target.get("submit_method", ""),
            "status": status,
            "result_url": result_url,
            "timestamp": datetime.now().isoformat(),
            "notes": notes,
        })

    # ─── WordPress Comment ─────────────────────────────────────────

    def submit_comment(self, target: dict) -> tuple[str, str]:
        """
        自动提交 WordPress 博客评论。
        返回 (status, notes)
        """
        url = target["url"]
        author = target.get("author_name", "Tesla Enthusiast")
        email = target.get("author_email", "contact@mydreamtesla.com")
        author_url = target.get("author_url", "https://mydreamtesla.com")
        comment = target.get("comment_content", "")

        if not comment:
            return "failed", "缺少 comment_content"

        if self.dry_run:
            print(f"    [DRY-RUN] 将评论到: {url}")
            print(f"    Author: {author}")
            print(f"    Comment: {comment[:80]}...")
            return "skipped", "dry-run 模式"

        try:
            # Step 1: GET 文章页面，提取 comment_post_ID 和 hidden fields
            resp = self.session.get(url, timeout=30, allow_redirects=True)
            resp.raise_for_status()

            soup = BeautifulSoup(resp.text, "html.parser")

            # 找 comment form
            comment_form = (
                soup.find("form", {"id": "commentform"})
                or soup.find("form", action=re.compile(r"wp-comments-post\.php"))
                or soup.find("form", class_=re.compile(r"comment"))
            )

            if not comment_form:
                return "failed", "找不到评论表单"

            # 提取 action URL
            action = comment_form.get("action", "")
            if not action:
                action = urljoin(url, "/wp-comments-post.php")
            elif not action.startswith("http"):
                action = urljoin(url, action)

            # 提取 comment_post_ID
            post_id_input = comment_form.find("input", {"name": "comment_post_ID"})
            comment_post_id = post_id_input["value"] if post_id_input else ""

            if not comment_post_id:
                # 尝试从 URL 提取
                match = re.search(r'\?p=(\d+)', url)
                if match:
                    comment_post_id = match.group(1)
                else:
                    return "failed", "找不到 comment_post_ID"

            # 收集所有 hidden fields
            form_data = {}
            for hidden in comment_form.find_all("input", {"type": "hidden"}):
                name = hidden.get("name")
                if name:
                    form_data[name] = hidden.get("value", "")

            # 组装表单数据
            form_data.update({
                "author": author,
                "email": email,
                "url": author_url,
                "comment": comment,
                "comment_post_ID": comment_post_id,
                "submit": "Post Comment",
            })

            # Step 2: POST 评论
            resp = self.session.post(
                action,
                data=form_data,
                timeout=30,
                allow_redirects=False,
            )

            # 判断结果
            if resp.status_code in (301, 302):
                location = resp.headers.get("Location", "")
                if "moderation" in location or "#comment" in location:
                    return "pending_moderation", f"重定向到: {location}"
                return "success", f"重定向到: {location}"

            # 检查响应内容
            body = resp.text.lower()
            if "awaiting moderation" in body or "待审核" in body:
                return "pending_moderation", "评论待审核"
            if "duplicate comment" in body:
                return "failed", "重复评论"
            if "comment too quickly" in body or "too fast" in body:
                return "failed", "评论过于频繁"
            if resp.status_code == 200:
                # 200 可能是成功（某些主题不重定向）
                return "pending_moderation", f"HTTP 200 — 可能成功"

            return "failed", f"HTTP {resp.status_code}"

        except requests.Timeout:
            return "failed", "请求超时 (30s)"
        except requests.ConnectionError as e:
            return "failed", f"连接失败: {e}"
        except Exception as e:
            return "failed", f"异常: {e}"

    # ─── Telegraph ─────────────────────────────────────────────────

    def submit_telegraph(self, target: dict) -> tuple[str, str]:
        """
        通过 Telegra.ph API 发布文章。
        返回 (status, notes)
        """
        # 跳过已完成的
        if target.get("notes") == "已完成":
            return "skipped", "已完成，跳过"

        content_file = target.get("content_file", "")
        title = target.get("name", "")

        if not content_file:
            return "failed", "缺少 content_file 配置"

        content_path = CONTENT_DIR / content_file
        if not content_path.exists():
            return "failed", f"内容文件不存在: {content_file}"

        md_text = content_path.read_text(encoding="utf-8")

        # 从 frontmatter 提取标题（如果有）
        fm_match = re.match(r'^---\s*\n(.*?)\n---\s*\n', md_text, re.DOTALL)
        if fm_match:
            for line in fm_match.group(1).split("\n"):
                if line.strip().startswith("title:"):
                    title = line.split(":", 1)[1].strip().strip('"\'')
                    break
            md_text = md_text[fm_match.end():]
        nodes = markdown_to_telegraph_nodes(md_text)

        if not nodes:
            return "failed", "Markdown 转换后无内容"

        if self.dry_run:
            print(f"    [DRY-RUN] 将发布到 Telegra.ph: {title}")
            print(f"    内容文件: {content_file}")
            print(f"    节点数: {len(nodes)}")
            return "skipped", "dry-run 模式"

        try:
            resp = requests.post(
                "https://api.telegra.ph/createPage",
                json={
                    "access_token": TELEGRAPH_TOKEN,
                    "title": title,
                    "author_name": TELEGRAPH_AUTHOR,
                    "author_url": TELEGRAPH_AUTHOR_URL,
                    "content": nodes,
                    "return_content": False,
                },
                timeout=30,
            )
            data = resp.json()

            if data.get("ok"):
                page_url = data["result"].get("url", "")
                return "success", page_url
            else:
                error = data.get("error", "未知错误")
                return "failed", f"API 错误: {error}"

        except requests.Timeout:
            return "failed", "请求超时 (30s)"
        except Exception as e:
            return "failed", f"异常: {e}"

    # ─── Manual Checklist ──────────────────────────────────────────

    def generate_manual_checklist(self, targets: list[dict]):
        """生成手动操作清单到 Markdown 文件"""
        manual_targets = [t for t in targets if t.get("submit_method") == "manual"]
        if not manual_targets:
            return

        # 按 category 分组
        by_category: dict[str, list[dict]] = {}
        for t in manual_targets:
            cat = t.get("category", "其他")
            by_category.setdefault(cat, []).append(t)

        lines = [
            "# 外链手动操作清单",
            "",
            f"> 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            f"> 共 {len(manual_targets)} 个目标需要手动操作",
            "",
        ]

        for category, items in sorted(by_category.items()):
            lines.append(f"## {category}")
            lines.append("")
            for t in items:
                lines.append(f"### {t.get('id', '?')}. {t.get('name', '')}")
                lines.append("")
                lines.append(f"- **URL**: {t.get('url', '')}")
                lines.append(f"- **类型**: {t.get('link_type', '')}")

                # 输出预填文案
                if t.get("author_name"):
                    lines.append(f"- **Author**: {t['author_name']}")
                if t.get("author_url"):
                    lines.append(f"- **Website**: {t['author_url']}")
                if t.get("comment_content"):
                    content = t["comment_content"]
                    if len(content) > 100:
                        lines.append(f"- **文案**:")
                        lines.append(f"  ```")
                        lines.append(f"  {content}")
                        lines.append(f"  ```")
                    else:
                        lines.append(f"- **文案**: {content}")

                content_file = t.get("content_file", "")
                if content_file:
                    lines.append(f"- **内容文件**: `TeslaData/backlink-content/{content_file}`")

                instructions = t.get("instructions", "")
                if instructions:
                    lines.append(f"- **操作步骤**: {instructions}")

                lines.append(f"- [ ] 已完成")
                lines.append("")

        MANUAL_FILE.write_text("\n".join(lines), encoding="utf-8")
        print(f"\n手动操作清单已保存: {MANUAL_FILE}")

    # ─── Results ───────────────────────────────────────────────────

    def save_results(self):
        """保存结果到 CSV"""
        if not self.results:
            return

        file_exists = RESULTS_FILE.exists()
        with open(RESULTS_FILE, "a", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=RESULTS_FIELDS)
            if not file_exists:
                writer.writeheader()
            writer.writerows(self.results)

        print(f"结果已保存: {RESULTS_FILE}")

    # ─── Run ───────────────────────────────────────────────────────

    def run(self, targets: list[dict], submit_type: str = "all",
            start: int = 0, limit: int | None = None):
        """执行提交"""
        # 筛选目标
        filtered = []
        for t in targets:
            method = t.get("submit_method", "")
            if submit_type == "all" or method == submit_type:
                filtered.append(t)

        # 截取范围
        filtered = filtered[start:]
        if limit is not None:
            filtered = filtered[:limit]

        if not filtered:
            print("没有匹配的目标。")
            return

        total = len(filtered)
        print(f"\n{'=' * 50}")
        print(f"开始提交 — 共 {total} 个目标")
        if self.dry_run:
            print("** DRY-RUN 模式 — 不会实际提交 **")
        print(f"{'=' * 50}\n")

        # 收集手动操作目标
        manual_targets = [t for t in filtered if t.get("submit_method") == "manual"]

        for i, target in enumerate(filtered):
            idx = i + 1
            name = target.get("name", "未知")
            method = target.get("submit_method", "")

            if method == "auto_comment":
                print(f"[{idx}/{total}] 🔗 {name} — 博客评论", end=" — ")
                status, notes = self.submit_comment(target)
            elif method == "auto_telegraph":
                print(f"[{idx}/{total}] 📝 {name} — Telegraph 发布", end=" — ")
                status, notes = self.submit_telegraph(target)
            elif method == "manual":
                print(f"[{idx}/{total}] 📋 {name} — 手动操作 — 已添加到清单")
                status = "manual_required"
                notes = "见 manual-actions.md"
                self.stats["manual"] += 1
                self._record(target, status, notes=notes)
                continue
            else:
                print(f"[{idx}/{total}] ⚠️  {name} — 未知方法: {method} — 跳过")
                status = "skipped"
                notes = f"未知 submit_method: {method}"
                self.stats["skipped"] += 1
                self._record(target, status, notes=notes)
                continue

            # 输出结果
            result_url = ""
            if status == "success":
                if notes.startswith("http"):
                    result_url = notes
                    print(f"✅ 成功: {notes}")
                else:
                    print(f"✅ 成功 ({notes})")
                self.stats["auto_success"] += 1
            elif status == "pending_moderation":
                print(f"⏳ 待审核 ({notes})")
                self.stats["auto_pending"] += 1
            elif status == "skipped":
                print(f"⏭️  跳过 ({notes})")
                self.stats["skipped"] += 1
            else:
                print(f"❌ 失败: {notes}")
                self.stats["auto_failed"] += 1

            self._record(target, status, result_url=result_url, notes=notes)

            # 延迟（最后一个不延迟）
            if i < total - 1 and method.startswith("auto") and not self.dry_run:
                self._random_delay()

        # 生成手动操作清单
        if manual_targets:
            self.generate_manual_checklist(manual_targets)

        # 保存结果
        self.save_results()

        # 汇总
        auto_total = (
            self.stats["auto_success"]
            + self.stats["auto_pending"]
            + self.stats["auto_failed"]
        )
        print(f"\n{'=' * 50}")
        print("提交结果汇总")
        print(f"{'=' * 50}")
        if auto_total > 0:
            print(f"自动提交: {auto_total} 个")
            print(f"  ✅ 成功: {self.stats['auto_success']}")
            print(f"  ⏳ 待审核: {self.stats['auto_pending']}")
            print(f"  ❌ 失败: {self.stats['auto_failed']}")
        if self.stats["manual"] > 0:
            print(f"手动操作: {self.stats['manual']} 个 → 见 {MANUAL_FILE}")
        if self.stats["skipped"] > 0:
            print(f"已跳过: {self.stats['skipped']} 个")
        print(f"结果已保存: {RESULTS_FILE}")


def main():
    parser = argparse.ArgumentParser(
        description="MyDreamTesla 外链自动提交脚本"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="只显示将要执行的操作，不实际提交",
    )
    parser.add_argument(
        "--type",
        dest="submit_type",
        default="all",
        choices=["auto_comment", "auto_telegraph", "manual", "all"],
        help="只提交指定类型 (默认: all)",
    )
    parser.add_argument(
        "--start",
        type=int,
        default=0,
        help="从第 N 个目标开始 (0-indexed, 默认: 0)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="最多提交 N 个",
    )
    parser.add_argument(
        "--delay",
        type=int,
        default=10,
        help="每次提交间隔秒数 (默认: 10)",
    )

    args = parser.parse_args()

    submitter = BacklinkSubmitter(
        dry_run=args.dry_run,
        delay=args.delay,
    )

    targets = submitter.load_targets()
    print(f"已加载 {len(targets)} 个目标")

    submitter.run(
        targets,
        submit_type=args.submit_type,
        start=args.start,
        limit=args.limit,
    )


if __name__ == "__main__":
    main()
