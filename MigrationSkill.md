# PowerPoint to Slidev Migration

Step-by-step guide for converting `.pptx` presentations to Slidev `slides.md`.

## Prerequisites

```bash
sudo apt install libreoffice-impress poppler-utils
```

## Execution order

Steps 1 and 6 (PDF conversion + speaker notes extraction) can run **in parallel** since
they use different source data. Step 2 depends on Step 1. Steps 3-5 are sequential.

## Step 1: PPTX to PDF

```bash
mkdir -p presentation/migration
soffice --headless --convert-to pdf --outdir presentation/migration MyPresentation.pptx
```

The `--headless` flag runs LibreOffice without a GUI.
Ignore the `failed to launch javaldx` warning -- it's harmless.

## Step 2: PDF to HTML

```bash
pdftohtml -s -noframes -nomerge -fmt png \
  presentation/migration/MyPresentation.pdf \
  presentation/migration/MyPresentation.html
```

Flags:
- `-s` -- single HTML document (all pages in one file)
- `-noframes` -- no HTML frameset wrapper
- `-nomerge` -- keep paragraphs separate (better for parsing)
- `-fmt png` -- extract embedded images as PNG

### Output

- `MyPresentation.html` -- single HTML file with all slides
- `MyPresentation001.png` ... `MyPresentationNNN.png` -- full-page slide renders (background images)
- `MyPresentation-{page}_{seq}.jpg` -- extracted sub-images (logos, memes, diagrams, photos)

## Step 3: Parse the HTML

**Important**: The HTML file is typically too large to read directly (~30K+ tokens for
a 60-slide deck). Always use the Python parser script below rather than reading the
HTML manually.

Use this script to extract all slide text with positions and CSS classes:

```python
import re
from html import unescape

html_path = "presentation/migration/MyPresentation.html"
with open(html_path) as f:
    html = f.read()

pages = re.split(r'<!-- Page (\d+) -->', html)

for i in range(1, len(pages), 2):
    page_num = pages[i]
    content = pages[i+1]
    texts = re.findall(
        r'<p style="position:absolute;top:(\d+)px;left:(\d+)px;[^"]*"[^>]*class="([^"]*)"[^>]*>(.*?)</p>',
        content
    )
    print(f"\n{'='*60}")
    print(f"SLIDE {page_num}")
    print(f"{'='*60}")
    if not texts:
        print("[NO TEXT - IMAGE ONLY SLIDE]")
        continue
    for top, left, css_class, text_html in sorted(texts, key=lambda x: (int(x[0]), int(x[1]))):
        text = re.sub(r'<[^>]+>', '', text_html)
        text = unescape(text).replace('\xa0', ' ').strip()
        if text:
            print(f"  [{top:>4},{left:>4}] ({css_class:>6}) {text}")
```

Then only visually inspect (`Read` the `.png`) slides that are `[NO TEXT - IMAGE ONLY SLIDE]`
or where the text content is ambiguous.

The HTML structure per slide:

```html
<!-- Page N -->
<div id="pageN-div" style="position:relative;width:2160px;height:1215px;">
  <img src="MyPresentation00N.png" alt="background image"/>
  <p style="position:absolute;..." class="ftXY">Text content</p>
  ...
</div>
```

- Each `<!-- Page N -->` comment marks a slide boundary
- The `<img>` is a full render of the slide (useful for visual reference)
- `<p>` tags contain the text content, positioned absolutely
- Font classes (`.ftXY`) encode font-size, font-family, and color
- Large font sizes = titles, medium = bullet content, small = subtitles

### Identifying slide types

| Clue | Slide Type |
|------|-----------|
| Page 1, large title text | Cover slide |
| Bullet list with `•` | Menu/Agenda |
| Only a title + image in background | Section divider |
| Title + bulleted content | Default content slide |
| Code-colored text (blue, green, orange classes) | Code slide |
| Two columns of content | Comparison slide |
| Large centered text, no bullets | Quote slide |

## Step 4: Extract images

The sub-images (`MyPresentation-{page}_{seq}.jpg`) are the useful ones:
- Memes, diagrams, book covers, photos
- Avoid the small repeated ones (~14KB, ~1.8KB) -- these are typically theme logos/icons

### Image classification strategy

List all sub-images sorted by file size. Images with **identical file sizes** are almost
certainly the same theme element repeated across slides (logos, decorative corners).
Filter these out first:

```bash
ls -la presentation/migration/*.jpg | awk '{print $5}' | sort | uniq -c | sort -rn | head -20
```

Sizes appearing 5+ times are theme elements. Only visually inspect images that are:
- Larger than ~30KB
- Have a unique or rare file size (appears 1-3 times)

### Cover art

One extracted image will be the venue/building photo used in the theme's `cover` and
`break` layouts. This is typically from slide 1 or 2. Copy it as `cover-art.jpg`.

Copy meaningful images to `presentation/images/` with descriptive names:

```bash
cp presentation/migration/MyPresentation-3_7.jpg presentation/images/meme-descriptive-name.jpg
```

The full-page background renders (`MyPresentation00N.png`) are useful as reference
but should NOT be used in slides.md -- they contain the old PowerPoint theme chrome.

### Image-to-slide mapping

**Every PPTX slide with a non-theme image must have a corresponding image in slides.md.**
After extracting images, build a mapping table:

```python
import os, re

migration_dir = "presentation/migration"
html_path = f"{migration_dir}/MyPresentation.html"

with open(html_path) as f:
    html = f.read()

# Get page boundaries
pages = [(m.group(1), m.start()) for m in re.finditer(r'<!-- Page (\d+) -->', html)]

# Theme element sizes (bytes) -- these repeat across slides, skip them
theme_sizes = set()
size_counts = {}
for f in os.listdir(migration_dir):
    if f.endswith('.jpg'):
        sz = os.path.getsize(f"{migration_dir}/{f}")
        size_counts[sz] = size_counts.get(sz, 0) + 1
for sz, count in size_counts.items():
    if count >= 5:
        theme_sizes.add(sz)

# Map images to pages
for f in sorted(os.listdir(migration_dir)):
    if not f.endswith('.jpg'):
        continue
    m = re.match(r'.*-(\d+)_(\d+)\.jpg', f)
    if not m:
        continue
    page = int(m.group(1))
    sz = os.path.getsize(f"{migration_dir}/{f}")
    if sz in theme_sizes:
        continue
    print(f"Page {page:3d}: {f} ({sz:,} bytes)")
```

Use this table to verify that every image is copied and referenced in slides.md.
After writing slides.md, re-run the slide index script (see below) and cross-check that
each slide with a PPTX image has the correct `::image::` or `image` frontmatter.

## Step 4b: Extract hidden slides from PPTX

Hidden slides are NOT exported to PDF. Extract them directly from the PPTX XML:

```python
import xml.etree.ElementTree as ET
import os

ns = {'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
      'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}

# First extract the PPTX
os.system('mkdir -p /tmp/pptx-slides && unzip -o MyPresentation.pptx "ppt/slides/*.xml" -d /tmp/pptx-slides -x "*/rels/*"')

slide_files = sorted(
    [f for f in os.listdir('/tmp/pptx-slides/ppt/slides') if f.startswith('slide') and f.endswith('.xml')],
    key=lambda f: int(f.replace('slide','').replace('.xml',''))
)

for sf in slide_files:
    tree = ET.parse(f'/tmp/pptx-slides/ppt/slides/{sf}')
    root = tree.getroot()
    if root.get('show') == '0':
        texts = [t.text.strip() for t in tree.findall('.//a:t', ns) if t.text and t.text.strip()]
        title = ' '.join(texts[:8]) if texts else '(no text)'
        num = sf.replace('slide','').replace('.xml','')
        print(f'Hidden slide {num}: {title}')
```

Hidden slides should be added to slides.md with `disabled: true` in frontmatter.
Place them at their original position in the slide order:

```markdown
---
layout: default
disabled: true
---

# Hidden Slide Title

Content here
```

## Step 5: Write slides.md

### Frontmatter

Add session metadata to the YAML frontmatter of `slides.md`:

```yaml
---
theme: ./theme
title: 2022-08-25-UnitTesting
transition: fade
session-time: 70min
track: Architecture
type: Theoretical
---
```

- `session-time`: duration of the presentation
- `track`: which track it belongs to (e.g. Architecture, Frontend, Backend)
- `type`: Theoretical, Hands-on, Workshop, etc.

### Layout mapping

| PowerPoint slide | Slidev layout |
|-----------------|---------------|
| Title slide | `cover` |
| Table of contents | `agenda` (items in frontmatter, pick `size` by item count — see sizing guide) |
| Section divider (photo bg + title) | `section` |
| Bullet content, NO image in PPTX | `default` with `<v-clicks>` |
| Bullet content + image in PPTX | `default-aside` with `::image::` slot (circled top-right) |
| Image left + content right | `two-col-image-text` with `::image::` + `::content::` slots |
| Two-column with pros/cons | `comparison` with `.cols`/`.col` (preserve emojis!) |
| Content left + informational image right | `two-col-image-text` (retired `two-col-text-image`; always use image-left layout now) |
| 1-2 bold statements, no bullets | `statement` (no author needed). Supports `::image::` for circled corner image |
| Full-screen meme/image (no bullet content) | `quote-image` with `::image::` slot (green bg, image centered) |
| Large quote/meme | `quote` |
| Break slide | `break` with `<Timer>` |
| Social links | `socials` |
| Thank you | `end` |

### Layout decision tree

Use this to pick the right layout for each slide:

1. Does the slide have **only an image** (no bullets, maybe just a title)?
   → `quote-image` (centered image, green bg)
2. Does the slide have **1-2 short statements** (no bullets)?
   → `statement` (+ `::image::` if PPTX had an image)
3. Does the slide have **bullet content + a decorative image** in the PPTX?
   → `default-aside` (circled image top-right, bullet content left)
4. Does the slide have **bullet content + an informational diagram/chart**?
   → `two-col-image-text` (image left, text right)
5. Does the slide have **bullet content, no image** in the PPTX?
   → `default`

**Critical rule**: If the PPTX slide had an image, the Slidev slide MUST have that
image. Use the image-to-slide mapping table to verify. Never use `default` layout
for a slide that had an image in the PPTX — use `default-aside` instead.

**Powerpoint Source slide**: The last content slide should have a QR code linking to
the repo. Get the URL from `git remote -v` and update accordingly:

```markdown
---
layout: default
---

# Powerpoint Source

<div class="flex flex-col items-center justify-center h-full -mt-16">
  <div class="w-64 h-64">
    <QRCode url="https://github.com/itenium-be/REPO_NAME" color="#343434" />
  </div>
  <a href="https://github.com/itenium-be/REPO_NAME" class="mt-4 text-lg">github.com/itenium-be/REPO_NAME</a>
</div>
```

### Auto-detection rules

These patterns from the PPTX HTML can be detected automatically:

1. **Circular corner images** (`default-aside`): Slides with the "orange lines top-left"
   template have a circular decorative image. Detect by checking the background image
   for the orange-lines pattern OR by finding 3+ extracted sub-images per slide where
   the largest (>100KB) is the circle photo. Use `default-aside` layout with `::image::`.
   - Default position is `top-right`. If the image center-Y is >40% of slide height,
     use `image-position: middle-right`.

2. **Emojis**: The PPTX XML `<a:t>` tags preserve emoji characters (🧐, ⚠️, etc.).
   These are lost in the PDF→HTML pipeline because pdftohtml renders them as images.
   Extract emoji text directly from `ppt/slides/slideN.xml` instead.

3. **Quote slides** (`statement`): Slides with only 1-2 `<p>` tags of large font
   (>100px) and no bullet markers (`•`) are statement/quote slides. Use `statement`.

4. **Comparison slides** (`comparison`): Slides with two distinct columns of content
   (detected by two groups of `<p>` tags with very different x-offsets). Preserve
   emoji prefixes (🧐/⚠️) as-is in the markdown.

5. **Image-only slides** (`two-col-image-text` without `::content::`): Slides where the
   only text is a title and the rest is a large image/meme. The `two-col-image-text` layout
   auto-centers when no `::content::` slot is provided. Prefer `image` frontmatter
   over `::image::` slot for large images — the frontmatter renders a direct `<img>`
   tag that the layout CSS can properly constrain. Slot-based images get wrapped in
   `<p>` tags by Slidev's markdown renderer which breaks `max-height` containment.

6. **Size frontmatter**: Add `size: sm` or `size: xs` when content is dense:
   - `agenda`: ≤5 items → `lg`, 6 items → `md` (default), 7-8 items → `sm`, 9+ items → `xs`
   - `default`/`default-aside`: 6+ bullet points → `size: sm`

## Slide Index

Generate a slide index to map Slidev slide numbers to titles. Use this when the user
references slides by number. Run from the presentation directory:

```python
import re

with open('slides.md') as f:
    content = f.read()

# Split on slide boundaries: --- possibly followed by frontmatter ---
parts = re.split(r'\n---\n', content)
# First part is global frontmatter, skip it
slides = []
i = 1
while i < len(parts):
    part = parts[i].strip()
    lines = part.split('\n')
    has_layout = any(re.match(r'^[a-z].*:', l) for l in lines[:10])
    if has_layout and i + 1 < len(parts):
        slides.append(part + '\n---\n' + parts[i+1])
        i += 2
    else:
        slides.append(part)
        i += 1

for idx, slide in enumerate(slides, 1):
    lines = slide.strip().split('\n')
    title = ''
    subtitle = ''
    layout = ''
    for line in lines:
        if line.startswith('layout:'):
            layout = line.split(':',1)[1].strip()
        if line.startswith('# ') and not title:
            title = line.strip()[2:]
        elif line.startswith('## ') and not subtitle:
            subtitle = line.strip()[3:]
    display = title if title else '(untitled)'
    if subtitle:
        display += ' — ' + subtitle
    if layout:
        display = f'[{layout}] {display}'
    print(f'{idx:3d}. {display}')
```

**Always run this at the start of a finetuning session** so that slide numbers
from the user match exactly what Slidev displays in the browser.

## Layout renames

| Old name | New name |
|----------|----------|
| `default-image` | `default-aside` |
| `image-content` | `two-col-image-text` |
| `content-image` | `two-col-text-image` → **deleted** (use `two-col-image-text` instead) |
| `quote-alt` | `statement` |

## Title Decorations

Add code-inspired decorations (`h1`/`h2` frontmatter) to roughly **40%** of content slides.
Pick a random mix of types, colors, and positions per slide. Vary them — don't repeat
the same decoration on consecutive slides.

**Which layouts get decorations:**

| Layout | Decorate? | Notes |
|--------|-----------|-------|
| `default` | ~50% | Good candidate, especially slides with bullet content |
| `default-aside` | ~60% | Most common decorated layout |
| `comparison` | ~50% | Decorate h1; h2 optional |
| `two-col-image-text` | ~40% | Only when slide has text content (not image-only) |
| `section` | never | Section dividers stay clean |
| `statement` | never | No h1/h2 to decorate |
| `quote` | never | Special styling, don't decorate |
| `quote-image` | never | Special styling, don't decorate |
| `agenda` | never | Structured layout, don't decorate |
| `cover` | optional | At most the h1 |
| `end` / `socials` / `break` | never | No content titles |

**h2 decorations:** Only add to ~30% of slides that already have an h1 decoration.
Never add h2 decoration without h1 decoration on the same slide.

**Available types and rules:**

| Type | Position | Colors |
|------|----------|--------|
| `dot` | end only | primary, muted, white |
| `slashes` | end only | primary, muted, white |
| `brackets` | all, or word range (e.g. `2` or `2-3`) | primary, muted, white |
| `braces` | all, or word range | primary, muted, white |
| `hash` | start only | primary, muted, white |
| `semicolon` | start or end | muted only |

**Colors:** `primary` = `#f1b06c` (orange), `muted` = `#6ebca5` (teal), `white` = `#ffffff`

**Example frontmatter:**
```yaml
h1:
  type: braces
  color: primary
  position: 2
h2:
  type: dot
  color: muted
  position: end
```

## Gotchas

- **Line breaks in HTML**: pdftohtml splits long lines into multiple `<p>` tags.
  Reassemble them by checking if the next `<p>` has a similar x-offset (continuation)
  or is indented further (sub-bullet).
- **Embedded images vs text**: Some slides have all content baked into the background
  image with no text `<p>` tags. View the `.png` background to understand the content.
- **Font colors as semantic hints**: Colored text (green `#6a9955`, blue `#569cd6`)
  typically indicates code syntax highlighting in the original.
- **`&#160;`**: Non-breaking spaces are used liberally -- strip them when converting.
- **Emojis are lost in PDF export**: Extract them from the PPTX slide XML directly
  (see auto-detection rule #2). Do not rely on the HTML output for emoji content.
- **Speaker notes**: PowerPoint speaker notes are NOT preserved in the PDF export.
  Extract them directly from the PPTX (see Step 6).
- **Size prefix**: The `size` frontmatter value should be `sm`, `xs`, etc. — NOT
  `size-sm`. The layout template adds the `size-` prefix automatically.

## Step 6: Extract speaker notes from PPTX

A `.pptx` file is a ZIP containing XML. Speaker notes live in `ppt/notesSlides/notesSlideN.xml`.

```bash
mkdir -p /tmp/pptx-notes
unzip -o MyPresentation.pptx "ppt/notesSlides/notesSlide*.xml" -d /tmp/pptx-notes -x "*/rels/*"
```

Extract the text content with Python:

```python
import xml.etree.ElementTree as ET

ns = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
}

for i in range(1, 41):  # adjust range to slide count
    path = f'/tmp/pptx-notes/ppt/notesSlides/notesSlide{i}.xml'
    try:
        tree = ET.parse(path)
    except FileNotFoundError:
        continue

    for sp in tree.findall('.//p:sp', ns):
        ph = sp.find('.//p:ph', ns)
        if ph is not None and ph.get('idx') == '1':
            lines = []
            for p in sp.findall('.//a:p', ns):
                parts = [t.text or '' for t in p.findall('.//a:t', ns)]
                line = ''.join(parts).strip()
                if line:
                    lines.append(line)
            if lines:
                print(f'=== SLIDE {i} ===')
                print('\n'.join(lines))
                print()
```

Add the extracted notes as HTML comments at the end of each slide in `slides.md`:

```markdown
# Slide Title

- Content here

<!-- Speaker notes go here. Only visible in presenter mode. -->
```

## Step 7: Generate PPTX reference file

After completing the migration, generate `presentation/PPTX_REFERENCE.md` — a per-slide
snapshot of the original PPTX content. This serves as the source of truth for verifying
the migration and debugging missing content without re-extracting the PPTX.

Combine data from Steps 3 (HTML text), 4 (images), and 6 (speaker notes) into a single
file. For each PPTX slide, extract:

- **Text**: all text content from the slide XML
- **Images**: PPTX media filenames → imported filenames (or `NOT IMPORTED` if missing)
- **Notes**: speaker notes from `notesSlideN.xml`
- **Slidev slide**: corresponding slide number in `slides.md`

### Format

```markdown
## PPTX Slide 1 → Slidev Slide 1
**Layout template:** Title slide

**Text:**
- UnitTesting
- TDD

**Images:**
| PPTX media | Imported as | Type |
|------------|-------------|------|
| image1.jpeg | cover-art.jpg | cover photo |
| image2.png | (template decoration) | skip |

**Notes:**
Quote from "Working Effectively with Legacy Code": ...
```

### Generation script

Run from the project root (where the `.pptx` lives). Requires the PPTX and
the completed `slides.md`. Combine the extraction scripts from Steps 3, 4, and 6:

1. Extract slide text from each `ppt/slides/slideN.xml`
2. Map images via `ppt/slides/_rels/slideN.xml.rels` — filter out template
   decorations (SVGs, small PNGs <10KB) to focus on content images
3. For each content image, check if a matching file exists in `presentation/images/`
   (compare by visual inspection or file hash) and record the mapping
4. Extract speaker notes from `ppt/notesSlides/notesSlideN.xml`
5. Match PPTX slide numbers to Slidev slide numbers using the Slide Index script

### When to use it

- **After migration**: verify no images or text were lost
- **During finetuning**: when a user says "this slide is missing something", check
  the reference file before re-extracting the PPTX
- **Debugging**: compare the reference entry against the current `slides.md` slide
  to spot discrepancies
