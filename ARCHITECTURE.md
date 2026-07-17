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

### reflectionSummary

`reflectionSummary` gathers written learner reflections from across the course and presents them in course order.

It is intended for end-of-course review, metacognition, and personal action planning.

Use `reflectionSummary` for a reusable review page that connects:

- the original reflection prompt,
- why the reflection was included,
- the competency or competencies the learner practiced,
- and the learner's saved response.

Requirements:

- Derive prompts and saved-response identifiers from course lesson data whenever possible.
- Discover written responses from reflection lessons, guided activity reflection slides, and image reveal steps.
- Group responses by module.
- Display unanswered prompts without treating them as errors.
- Never expose internal storage keys or implementation identifiers.
- Render learner responses as plain text rather than HTML.
- Reflect the most recently saved response.
- Allow learners to return to the relevant lesson to revise a response when navigation data is available.
- Support an accessible, print-friendly layout.
- Do not require every reflection to be completed before the learner may finish the course.
- Display a saved-response count near the top of the page.
- Aggregate practiced competencies once at the bottom of the page.
- Present competencies as practice opportunities, never as scores or mastery claims.

Rendering order:

1. Page title and introduction from the lesson object.
2. Responses saved count.
3. Print Reflection Summary button.
4. Reflections grouped by module.
5. Reflection Prompt, Why this Reflection Matters, Competencies Practiced, Learner Response, and review/revise control for each reflection.
6. Competencies practiced across the workshop, listed once.

Print support:

- Browser print is used.
- Sidebar, progress controls, lesson navigation, and print/revision controls are hidden in print layout.
- The printable page keeps reflection content, competency metadata, and learner responses visible.

Accessibility:

- Use semantic headings for the page, modules, and individual reflection entries.
- Buttons must be keyboard accessible.
- Learner responses must be inserted as plain text.
- Competency IDs and storage keys must not be displayed.
- Missing competency IDs should not break rendering.
- Empty responses should display a clear message.

Navigation:

- When available, each reflection entry should include a "Review or revise this response" button.
- The button should use the existing lesson navigation flow to return to the lesson that collected the response.

### Learning-objective alignment

Each saved reflection may include a `learningObjectives` array containing stable objective IDs.

Learning-objective definitions and learner-facing wording must be centralized in course data. Renderers should resolve IDs to their displayed wording rather than duplicating objective text.

The reflection summary should:

- display the connected objective or objectives beneath each prompt,
- display learner-facing objective wording rather than internal IDs,
- include objective alignment even when a reflection is unanswered,
- summarize how many prompts address each objective,
- treat these counts as alignment information rather than grades or completion measures,
- and handle missing or invalid objective IDs without breaking the page.

Objective alignment must be intentionally authored in course data. It should not be inferred automatically from prompt text.

### Competency metadata

Each saved reflection may include a `competencies` array containing stable competency IDs.

Competency definitions and learner-facing wording must be centralized in course data. Renderers should resolve IDs to displayed wording rather than duplicating competency text.

The reflection summary should:

- display the competency or competencies practiced beneath each prompt,
- display learner-facing competency wording rather than internal IDs,
- include competency metadata even when a reflection is unanswered,
- aggregate each practiced competency once at the bottom of the page,
- frame competencies as learning opportunities rather than evidence of mastery,
- and handle missing or invalid competency IDs without breaking the page.

Competency metadata must be intentionally authored in module data. It should not be inferred automatically from prompt text.

### Rationale metadata

Each saved reflection should include a concise `rationale` field explaining why the reflection matters instructionally.

The reflection summary displays this rationale under the label "Why this Reflection Matters." Rationale text belongs in module data, not in renderer logic.
