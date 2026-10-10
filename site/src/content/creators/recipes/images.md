---
title: Images
summary: Sizes, formats and compression per layout slot.
order: 13
tags: ["cover-art", "pngquant"]
---

Vite bundles images as-is; right-size them before committing.

| Use                        | Aspect    | Resolution         | File size   | Notes                                              |
|----------------------------|-----------|--------------------|-------------|----------------------------------------------------|
| `cover` slot + site card   | **2:3**   | **1024×1536**      | **<300 KB** | Card crops to 240×200: keep the subject centered   |
| `break` slot               | 2:3       | 1024×1536          | <300 KB     | Usually the cover image                            |
| `default-aside` circle     | **1:1**   | **600×600**        | **<150 KB** | Center the subject                                 |
| `agenda` photo             | portrait  | 800×1200           | <250 KB     |                                                    |
| `section` background       | landscape | 1920×1080          | <400 KB     | 45% black overlay: avoid busy detail               |
| `two-col-image-text`       | flexible  | ≥1200 long edge    | <250 KB     | Letterboxed                                        |

PNG for screenshots/illustrations, JPG (q85) for photos, WebP for either, SVG for logos and diagrams. No GIF, no HEIC.

```bash
pngquant --quality=70-85 --strip --output cover.min.png cover.png
magick photo.jpg -quality 85 -strip photo.jpg
magick cover.png -resize 1024x1536 -quality 85 cover.webp
magick portrait.jpg -resize 600x600^ -gravity center -extent 600x600 aside.jpg
```
