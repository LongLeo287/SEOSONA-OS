# KI: TranHuuDat2004/anime.tv

## Overview
Repository with 1035 files across 39 directories. Primary language: JavaScript (22 files).

## Tech Stack (from code)
- JavaScript (22 files)
- **Total:** 1035 files, 39 directories
- **File types:** .gif: 748, .jpg: 80, .json: 72, .png: 50, .js: 22, .html: 20, .css: 17, .webp: 15

## File Structure
```
  .gitattributes
  LICENSE
  README.md
  about.html
  anime-detail.html
  faq.html
  feedback.md
  game.html
  gemini.md
  gif-collection.html
  gif-detail.html
  image-detail.html
  image-gallery.html
  implementation_plan.md
  index.html
  manga-detail.html
  manga.html
  privacy-policy.html
  ranking.html
  reading-manga.html
  search.html
  template.html
  terms-of-service.html
  version-github.html
  version.html
  AnhXepHinh/
    Mahiru/
      anh-1.png
      anh-2.png
      anh-3.png
      anh-4.png
      anh-5.png
      anh-6.png
      anh-7.png
      anh-8.png
      anh-9.png
      anh_goc.png
    honkai_star_rail/
      Honkai_Star_Rail.png
      anh-1.jpg
      anh-2.jpg
      anh-3.jpg
      anh-4.jpg
      anh-5.jpg
      anh-6.jpg
      anh-7.jpg
      anh-8.jpg
      anh-9.jpg
    paimon/
      Genshin_Impact.jpg
      anh-1.jpg
      anh-2.jpg
      anh-3.jpg
      anh-4.jpg
      anh-5.jpg
      anh-6.jpg
      anh-7.jpg
      anh-8.jpg
      anh-9.jpg
    zenless_zone_zero/
      anh-1.jpg
      anh-2.jpg
      anh-3.jpg
      anh-4.jpg
      anh-5.jpg
      anh-6.jpg
      anh-7.jpg
      anh-8.jpg
      anh-9.jpg
      zenless-zone-zero.jpg
  api/
    anilist-ensure.js
  archived/
    watch-video.html
    watching-video.js
  css/
    about-style.css
    anime-detail-style.css
    game-style.css
    gif-detail-custom.css
    gif.css
    image-detail-style.css
    image-gallery-style.css
    manga-detail-style.css
    manga-style.css
    ranking-style.css
    reading-manga-style.css
    search-style.css
    static-page-style.css
    style.css
    version-portfolio-style.css
    version-style.css
    watch-video-style.css
  data/
    anime-list.json
    anime/
      a-misanthrope-teaches-a-class-for-demi-humans.json
      a-silent-voice.json
      aharen-san-wa-hakarenai-season-2.json
      aharen-san-wa-hakarenai.json
      aiura.json
      alice-in-wonderland.json
      amagami-ss-plus.json
      amagami-ss.json
      angel-beats-specials.json
   
```

## Key Source Excerpts
### api\anilist-ensure.js
```javascript
// Vercel Serverless Function
// - Tìm anime trên AniList (GraphQL)
// - Kiểm tra/ cập nhật file data/anime/<id>.json trong GitHub repo
// - Tạo PR nếu cần (để tránh ghi thẳng vào main)
//
// Cần env vars trên Vercel:
// - GITHUB_TOKEN: token cá nhân có quyền tạo PR/commit (classic fine-grained)
// - GITHUB_OWNER: ví dụ TranHuuDat2004
// - GITHUB_REPO: ví dụ anime.tv
// - GITHUB_DEFAULT_BRANCH (optional): mặc định "main"
//
// Endpoint:
// - POST /api/anilist-ensure
// body: { query: string, slug?: string }

const ANILIST_GRAPHQL_URL = 'https://graphql.anilist.co';
const DEFAULT_BRANCH = process.env.GITHUB_DEFAULT_BRANCH || 'main';

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function setCors(res) {
  // Có thể chặt hơn sau, nhưng để dễ tích hợp từ Pages/host khác dùng tạm thời allow all.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function slugify(input) {
  if (!input) return '';
  return input
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // đổi ký tự lạ thành -
    .replace(/(^-|-$)+/g, ''); // trim -
}

function mapFormatToType(format) {
  if (!format) return 'Series';
  if (f
```

## Agent Configuration
### GEMINI.md
# Tóm tắt cuộc trò chuyện với Gemini CLI

**Ngày:** 28 tháng 10 năm 2025

## 1. Tình trạng ban đầu của dự án

Dự án của bạn là một trang web tĩnh (HTML, CSS, JavaScript) với mục đích ban đầu là tổng hợp thông tin và streaming video anime/manga. Dữ liệu anime được lưu trữ dưới dạng hardcode trong tệp `js/data.js`.

## 2. Các vấn đề được xác định

Qua quá trình phân tích, chúng tôi đã xác định một số vấn đề chính:

*   **Trùng lặp code HTML:** Các tệp HTML có nhiều phần code lặp lại (ví dụ: header, footer), gây khó khăn trong việc bảo trì.
*   **Dữ liệu hardcode trong `data.js`:**
    *   Khó cập nhật và bảo trì khi dữ liệu lớn.
    *   Hiệu năng không tối ưu (người dùng phải tải toàn bộ dữ liệu).
    *   Không có khả năng mở rộng.
*   **Vấn đề streaming video:**
    *   **Google Drive:** Không phù hợp để streaming video động do các hạn chế về chống hotlinking.
    *   **Vimeo/YouTube:** Gặp vấn đề bản quyền và hạn chế nhúng video từ một số kênh.

## 3. Giải pháp đề xuất và Quyết định của người dùng

Chúng tôi đã đề xuất chuyển đổi trang web thành một nền tảng tổng hợp thông tin anime, tập trung vào việc cung cấp dữ liệu chi tiết và liên kết đến các nguồn chính thức, thay vì streaming video trực tiếp. Bạn đã đồng ý với hướng đi này để tránh các vấn đề bản quyền và tập trung vào việc xây dựng một trang thông tin chất lượng.

## 4. Các hành động đã thực hiện

Để chuyển đổi dự án theo hướng mới, chúng tôi đã thực hiện các thay đổi sau:

*   **Chuyển đổi dữ liệu từ `data.js` sang J

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-ux-ui` · **Function:** `motion` · **Fit:** 44/100 · **Auto-apply:** True
- **Evidence:** `anime.js`, `animation`
- **All scores:** {'seosona-os': 20, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 44, 'seosona-flow': 0}
