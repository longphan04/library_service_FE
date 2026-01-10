# COMMIT_CONVENTION.md

# Conventional Commits – Frontend Library System

## Commit Format

<type>: <short description>
---

## Allowed Types

- feat:     thêm chức năng mới
- fix:      sửa bug
- refactor: tái cấu trúc code (không đổi hành vi)
- style:    CSS, layout, format (không ảnh hưởng logic)
- docs:     tài liệu (README, CONTRIBUTING…)
- chore:    config, tooling, setup

---

## Valid Examples

- feat: add homepage layout
- feat: implement book detail page
- fix: fix navbar overflow on mobile
- style: apply theme colors to buttons
- refactor: restructure book feature
- docs: add contributing guide
- chore: update vite config

---

## Invalid Examples
- update
- fix bug
- done
- abc

---

## Rules

- 1 commit = 1 mục đích
- Commit message viết bằng tiếng Anh hoặc tiếng Việt
- Không gộp nhiều thay đổi không liên quan vào 1 commit
- Không commit code lỗi, code chưa chạy được