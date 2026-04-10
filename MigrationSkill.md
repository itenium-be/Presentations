# PowerPoint to Slidev Migration

Step-by-step guide for converting `.pptx` presentations to Slidev `slides.md`.

## Prerequisites

```bash
sudo apt install libreoffice-impress poppler-utils
```

## Gitignore

Ensure the repo's `.gitignore` includes the migration working directory and the
LibreOffice lock file (created when the PPTX is open):

```gitignore
presentation/migration/
.~lock.*.pptx#
```

The `presentation/migration/` entry covers both the extraction artefacts (PDF, HTML,
PNGs, JPGs) **and** `PPTX_REFERENCE.md`, which is generated there in Step 7.

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

For talks that only have a generic placeholder cover image (e.g. the old building photo),
generate a custom one with Midjourney. Follow this style guide:

- **Palette:** Warm orange, amber, gold tones against dark backgrounds. Must complement
  the theme's orange (`#E78200`) cover layout.
- **Style:** Abstract, geometric, stylized digital illustration. Clean and modern. Not
  photographic.
- **Format:** Portrait ~2:3 ratio (~400×600px final). Save as `cover-art.jpg` (or `.png`).
- **Suffix:** `--ar 2:3 --v 6.1 --no text words letters`

Approved examples for reference:

| Talk | Prompt |
|------|--------|
| MicroServices | A murmuration of small luminous geometric birds forming a larger shape in the sky, each bird autonomous yet part of the whole, warm orange and gold against a deep twilight sky, abstract digital painting, ethereal and dynamic |
| UnitTesting/TDD | Abstract illustration of a shield protecting a crystalline code structure, green checkmarks floating around it, warm orange and amber palette with dark background, stylized geometric digital art, clean and modern |
| NTier-Hex-Onion | A stylized cross-section of concentric architectural rings, the innermost core glowing gold, surrounded by hexagonal lattice layers, each layer a different muted earth tone, abstract geometric style, clean lines, dark background with warm orange accents, digital illustration, minimal, elegant |

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

### ElevatorPitch.md

Every talk repo needs an `ElevatorPitch.md` in the **git root** (NOT inside `presentation/`).
The showcase index site at `itenium-be.github.io/Presentations/` reads it to render the
talk's card description. A migration of an existing PPTX must create this file if it
doesn't exist yet — `bun run scaffold` would have created it, but a migrated talk
typically pre-dates the scaffold.

Required structure:

```markdown
# Talk Title

## Abstract

A brief description (2-3 sentences). Displayed as the card description on the index site.

## Target Audience

Who should attend this talk?

## Key Takeaways

- Takeaway 1
- Takeaway 2

## Session Format

45-60 minutes
```

When migrating, draft the Abstract from the cover slide + agenda items, the Target
Audience from the talk's track/type, and the Key Takeaways from the section dividers.
Ask the user to review before committing — these fields are user-facing on the showcase
site and benefit from a human pass.

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

**Powerpoint Source slide**: The last slide should be the dedicated `source` layout
linking to the repo. Get the org/repo from `git remote -v` and pass it via frontmatter:

```markdown
---
layout: source
source: itenium-be/REPO_NAME
---
```

The layout renders the title, QR code, and clickable github link from the single
`source:` field. Don't reach for the old inline `<QRCode>` HTML — that pattern is
deprecated.

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

> **CRITICAL**: `notesSlideN.xml` is **NOT** linked to `slideN.xml` by filename.
> The mapping lives in `ppt/slides/_rels/slideN.xml.rels`. Iterating notes by filename
> gives wrong results — slide 7 might have its notes in `notesSlide12.xml`. Always
> resolve via the `.rels` file. Extract the rels too:

```bash
unzip -o MyPresentation.pptx -d /tmp/pptx-extract
# (full extraction; we need slides/, slides/_rels/, notesSlides/, _rels/, presentation.xml)
```

Resolve slide order from `presentation.xml` (the `sldIdLst` order is the presentation
order, which may differ from filename order), then for each slide find its notes via
the rels file:

```python
import xml.etree.ElementTree as ET
import os

ns = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
}
RID = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'

base = '/tmp/pptx-extract/ppt'

# 1) Get slide order from presentation.xml
pres = ET.parse(f'{base}/presentation.xml').getroot()
pres_rels = ET.parse(f'{base}/_rels/presentation.xml.rels').getroot()
rid_to_target = {r.get('Id'): r.get('Target') for r in pres_rels}
slide_order = []
for sldId in pres.findall('.//p:sldIdLst/p:sldId', ns):
    target = rid_to_target[sldId.get(RID)]
    slide_order.append(os.path.basename(target))  # e.g. 'slide1.xml'

# 2) For each slide, find notes via slideN.xml.rels
#    Preserve **bold**/*italic* formatting from <a:rPr b="1"/> / i="1".
#    Each <a:p> is a paragraph (separate line); each <a:r> is a run with optional rPr.
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
import re

def _wrap(text, bold, italic):
    if not text.strip():
        return text
    m = re.match(r'^(\s*)(.*?)(\s*)$', text, re.DOTALL)
    lead, core, trail = m.group(1), m.group(2), m.group(3)
    if bold and italic: core = f'***{core}***'
    elif bold:          core = f'**{core}**'
    elif italic:        core = f'*{core}*'
    return lead + core + trail

def _format_paragraph(p_elem):
    runs = []
    for r in p_elem.findall(f'{A}r'):
        t = r.find(f'{A}t')
        if t is None or t.text is None:
            continue
        rpr = r.find(f'{A}rPr')
        bold = rpr is not None and rpr.get('b') == '1'
        italic = rpr is not None and rpr.get('i') == '1'
        runs.append((t.text, bold, italic))
    # CRITICAL: merge adjacent runs with the same formatting before wrapping,
    # otherwise PowerPoint's word-by-word runs become "**word1** **word2**".
    merged = []
    for text, b, i in runs:
        if merged and merged[-1][1] == b and merged[-1][2] == i:
            merged[-1] = (merged[-1][0] + text, b, i)
        else:
            merged.append((text, b, i))
    return ''.join(_wrap(t, b, i) for t, b, i in merged).rstrip()

def get_notes(slide_xml):
    rels_path = f'{base}/slides/_rels/{slide_xml}.rels'
    if not os.path.exists(rels_path):
        return []
    rels = ET.parse(rels_path).getroot()
    for rel in rels:
        if 'notesSlide' in rel.get('Type', ''):
            notes_file = os.path.basename(rel.get('Target'))
            ntree = ET.parse(f'{base}/notesSlides/{notes_file}')
            for sp in ntree.findall('.//p:sp', ns):
                ph = sp.find('.//p:ph', ns)
                if ph is not None and ph.get('idx') == '1':
                    paras = []
                    for p in sp.findall('.//a:p', ns):
                        line = _format_paragraph(p)
                        if line:
                            paras.append(line)
                    return paras
    return []

# 3) Also use the slide XML's `show="0"` attribute to detect HIDDEN slides
def is_hidden(slide_xml):
    return ET.parse(f'{base}/slides/{slide_xml}').getroot().get('show') == '0'

for pos, sf in enumerate(slide_order, 1):
    notes = get_notes(sf)
    h = ' [HIDDEN]' if is_hidden(sf) else ''
    if notes:
        print(f'=== SLIDE {pos}{h} ({sf}) ===')
        print('\n'.join(notes))
        print()
```

The `pos` (1-based index into `slide_order`) is the **presentation slide number** the
user sees. Use this number, not the slide XML filename suffix.

### Notes formatting in slides.md

Speaker notes render as **markdown** in Slidev's presenter mode, so preserve PPTX
formatting as markdown:

- Bold runs (`<a:rPr b="1"/>`) → `**text**`
- Italic runs (`i="1"`) → `*text*`
- Each `<a:p>` paragraph → its own line, joined with **blank lines** so markdown
  treats them as separate paragraphs

When writing the notes into the slide's `<!-- ... -->` comment, join the paragraph
list with `'\n\n'.join(paras)` (not `'\n'`). Single newlines inside markdown collapse
into one paragraph.

Add the extracted notes as HTML comments at the end of each slide in `slides.md`:

```markdown
# Slide Title

- Content here

<!-- Speaker notes go here. Only visible in presenter mode. -->
```

## Step 7: Generate PPTX reference file

After completing the migration, generate `presentation/migration/PPTX_REFERENCE.md` — a per-slide
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

## Step 8: Reconciling notes & `disabled:` after slides.md drifts

**The problem**: slidev slide numbers do NOT match PPTX slide numbers, because the
migration adds section dividers, reorders hidden slides, adds a QR/PowerPoint Source
slide, etc. Any approach that maps notes by **slide index** will silently produce an
off-by-one (or off-by-N) cascade. The user notices weeks later when notes don't match
the slide content.

**The rule**: Match slidev slides to PPTX slides by **content overlap**, not by index.

### Symptoms that you have this bug

- Speaker notes "feel related but wrong" (e.g., the next slide's notes are showing)
- `disabled: true` is on the wrong slide
- A specific slide has the right notes but everything after it is shifted

### How to reconcile

1. **Re-extract PPTX data using the rels-based script in Step 6** (filename mapping is wrong).

2. **Parse `slides.md` into slide blocks**, capturing each slide's frontmatter and body.
   Splitter: `re.split(r'(?m)^---\s*$', content)`. A block is "frontmatter" if its first
   non-empty line matches `^[a-zA-Z_][a-zA-Z0-9_-]*\s*:` (key: value).

3. **Skip slides that have no PPTX equivalent** when matching:
   - `layout: section` (added during migration as chapter dividers)
   - `layout: end`, `layout: socials`, `layout: source` (the dedicated `source`
     layout — final QR-code slide added at the end of every talk)

4. **Match each remaining slidev slide to a PPTX slide** using a normalized word-set
   overlap of the slide text, with a position bias to break ties when titles repeat
   (e.g. many slides titled "Interprocess Communication"):

   ```python
   def normalize(text):
       text = text.lower().replace('…','').replace('\u2019',"'")
       text = re.sub(r'[^a-z0-9]+', ' ', text)
       return set(w for w in text.split() if len(w) > 2)

   # For each slidev slide (in order), search ALL unused PPTX slides:
   #   cscore = |bag ∩ pbag| / min(|bag|, |pbag|)
   #   score  = cscore - 0.03 * abs(pptx_idx - expected_next_pos)
   # Pick best, mark used, advance expected_next_pos.
   #
   # Special case: if BOTH bags are empty (image-only meme slide vs PPTX slide
   # with no text), give cscore = 0.95 — position bias will pick the right one.
   # If only one is empty, give cscore = 0.3 (let position bias decide).
   ```

   The `0.03 * dist` penalty is small enough that strong content matches still win
   across reorderings (e.g. the Chapters slide moved to before the book slide), but
   large enough to disambiguate the dozen near-identical "Async Messaging" slides.

5. **Apply two fixes per matched pair**:
   - **Speaker notes**: strip ALL existing `<!-- ... -->` from the slide body and
     append the PPTX notes as a fresh comment block. (Don't try to preserve old
     notes — if reconciliation is needed, the existing ones are wrong by definition.)
   - **`disabled: true`**: ensure the slidev slide has it iff the matched PPTX slide
     has `show="0"`.

6. **Verify** with 3-4 ground-truth pairs the user gives you ("slide X with title Y
   should have note Z"). If any fail, the matching is still off — do NOT write changes.

### Whitespace preservation — DO NOT use split/join

**The trap**: `re.split(r'(?m)^---\s*$', content)` followed by `'---'.join(parts)`
strips the entire `---` line on split, so on rejoin the blank lines that surrounded
it (both the blank line before the separator and any blank lines after frontmatter
closing) collapse. This produces a 200-line whitespace-only diff on top of the
actual fix and the user gets annoyed.

**The fix**: Edit slides.md by **line ranges**, not by string split.

```python
lines = content.split('\n')
sep_lines = [i for i, l in enumerate(lines) if l.strip() == '---']

# Walk separators to identify slide bodies as (slidev_idx, start_line, end_line)
# Then for each body, find the existing trailing <!-- ... --> comment by scanning
# backwards for a line ending in '-->' and the matching '<!--' opener.
# Replace the comment in place using lines[body_start:body_end] = new_body_lines.
# Process slides in REVERSE order so earlier line numbers stay valid.
```

Key rules when editing in place:
- Strip blank lines immediately before the old comment, but **preserve blank lines
  after** (the trailing whitespace before the next `---` separator).
- When inserting a new comment, prepend exactly one blank line as separator from
  the slide body.
- Never touch frontmatter blocks (`---` ... key: value ... `---`) — they should stay
  exactly as-is.
- After the rewrite, run `git diff --stat HEAD slides.md`. If it shows changes to
  many slides where you only edited a few, your line-range logic is wrong.

### Why content matching beats index matching

- The user reorders, hides, and inserts slides during finetuning.
- Section dividers and the QR slide have no PPTX counterpart, so any index-based
  mapping must hard-code their positions — and breaks the moment the user adds
  another section.
- Content overlap is self-correcting: if slide titles change, you'll see the score
  drop and can flag it instead of silently writing wrong notes.
