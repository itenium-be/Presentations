---
title: default-aside
summary: "Content + round image"
order: 4
tags: ["textSize", "image-position: top-right | middle-right", "::image::"]
live: { deck: showcase, slide: default-aside }
---

Content slide with a circular image (orange border, square-cropped). Text wraps around it.

```markdown
---
layout: default-aside
image-position: middle-right
textSize: sm
---

# Title

- Bullet that wraps around the image

::image::

![](./images/headshot.jpg)
```
