# CONTRIBUTING.md

# Contributing Guide – Frontend Library System

## Tech Stack
- React + Vite
- Tailwind CSS v4
- JavaScript (ES6+)

---

## Folder Rules

src/
- components/   UI dùng chung, KHÔNG gọi API
- pages/        Page level, chỉ compose
- features/     Logic nghiệp vụ
- services/     API, axios
- hooks/        Custom hooks
- styles/       Tailwind v4 theme (design system)

---

## Styling Rules (BẮT BUỘC)

❌ Không hardcode màu  
❌ Không dùng bg-[#xxxxxx]

✅ Chỉ dùng design token
```jsx
<div className="bg-[--color-primary]" />
<button className="btn-primary" />

Theme nằm duy nhất tại: src/styles/tailwind.css

## Before Push Checklist
- App chạy được (npm run dev)
- Không lỗi console
- Không commit node_modules, dist
- Commit message đúng chuẩn

## Pull Request Checklist
- Code chạy được
- Đúng cấu trúc thư mục
- Không hardcode màu
- Commit message đúng chuẩn

