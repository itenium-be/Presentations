# PowerPoint to Slidev Migration

Step-by-step guide for converting `.pptx` presentations to Slidev `slides.md`.

## Prerequisites

```bash
sudo apt install libreoffice-impress poppler-utils
```

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

Copy meaningful images to `presentation/images/` with descriptive names:

```bash
cp presentation/migration/MyPresentation-3_7.jpg presentation/images/meme-descriptive-name.jpg
```

The full-page background renders (`MyPresentation00N.png`) are useful as reference
but should NOT be used in slides.md -- they contain the old PowerPoint theme chrome.

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
| Table of contents | `agenda` (items in frontmatter) |
| Section divider (photo bg + title) | `section` |
| Bullet content | `default` with `<v-clicks>` |
| Two-column | `comparison` with `.cols`/`.col` |
| Content + image | `content-image` with `::image::` slot |
| Large quote/meme | `quote` |
| Break slide | `break` with `<Timer>` |
| Social links | `socials` |
| Thank you | `end` |

## Gotchas

- **Line breaks in HTML**: pdftohtml splits long lines into multiple `<p>` tags.
  Reassemble them by checking if the next `<p>` has a similar x-offset (continuation)
  or is indented further (sub-bullet).
- **Embedded images vs text**: Some slides have all content baked into the background
  image with no text `<p>` tags. View the `.png` background to understand the content.
- **Font colors as semantic hints**: Colored text (green `#6a9955`, blue `#569cd6`)
  typically indicates code syntax highlighting in the original.
- **`&#160;`**: Non-breaking spaces are used liberally -- strip them when converting.
- **Speaker notes**: PowerPoint speaker notes are NOT preserved in the PDF export.
  Extract them directly from the PPTX (see Step 6).

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
