# Project Architecture

## Project Goal

This project is a modular, web-based instructional course for intercultural communication.

The goal is to keep course content separate from rendering logic so modules can be edited, added, or reused without rewriting large HTML files.

---

## Core Rule

Course content lives in `modules/*.js`.

Application behavior lives in `js/*.js`.

Do not put large amounts of course content directly into `index.html`, `renderer.js`, or `activities.js`.

---

## Folder Structure

```text
intercultural-workshop/
├── index.html
├── README.md
├── ARCHITECTURE.md
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── courseData.js
│   ├── renderer.js
│   ├── activities.js
│   └── storage.js
├── modules/
│   ├── culture.js
│   ├── stereotypes.js
│   ├── ambiguity.js
│   ├── daea.js
│   ├── prague.js
│   ├── incidents.js
│   └── reflection.js
└── images/
    ├── comic/
    ├── culture/
    ├── daea/
    ├── hero/
    └── iceberg/

    ## Accessibility Principles

Accessibility is considered during component design rather than added afterward.

Guidelines:

- Every image should have meaningful `alt` text.
- Complex visuals should include an optional detailed visual description.
- Comic panels should include both concise alt text and fuller panel descriptions.
- Diagrams such as the Culture Iceberg should include a text explanation.
- Activities should be keyboard accessible.
- Do not rely on color alone to communicate meaning.
- Form fields should have clear labels.
- Animations should remain subtle and not interfere with learning.

### guidedActivity

`guidedActivity` is a flexible scenario/case-study activity.

It should support any sequence of slides. Decision slides are optional.

Supported slide types:

- `story` — scenario text with optional image
- `comic` — one or more comic/image panels
- `reflection` — saved written response
- `decision` — optional multiple-choice response
- `reveal` — additional context or new information
- `summary` — debrief and takeaways

Use `guidedActivity` for:
- narrative scenarios, such as the Prague example
- critical incidents
- reflective case studies

Do not force decisions when the learning goal is analysis or reflection.