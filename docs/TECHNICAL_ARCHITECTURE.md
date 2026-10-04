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
│   ├── branchingScenario.js
│   ├── perspectiveFlip.js
│   ├── moduleProgress.js
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

### Module progress bar

The bar at the top of each lesson shows the learner's progress through the whole module. It counts every step, not every lesson. A plain lesson is one step. An activity with steps of its own counts each of them: a `guidedActivity` counts its slides, a `branchingScenario` counts its decisions, its question step and its compare screen, and a `perspectiveFlip` counts its panels and its closing table. The module's intro and completion screens are not counted.

The counting lives in `js/moduleProgress.js`. An activity keeps the bar up to date by calling `context.updateModuleStep(step)` whenever it moves, where `step` is its own position starting at 0. Activities also show their own counter underneath, such as "Step 2 of 3", so the learner can see both how far they are in the activity and how far they are in the module.

A new activity type with its own steps needs two things: a line in `getLessonStepCount()` saying how many steps it has, and a call to `context.updateModuleStep()` when it moves.

### branchingScenario

`branchingScenario` is a reusable multiple-choice scenario. The learner reads a situation, makes one or more decisions, sees what each choice leads to, and then compares every path side by side.

All of its logic and layout live in `js/branchingScenario.js`. The story itself lives in the module file, so a new scenario is added by writing content, not code. The data format is documented at the top of `js/branchingScenario.js`.

Use `branchingScenario` when the learning goal is a choice and its consequence. Use `guidedActivity` when the goal is analysis or reflection.

Behavior:

- Each decision shows its options, then the outcome of the chosen option. The choice is locked until the learner restarts.
- By default every choice leads to the next decision in the list. An option can set `next` to another decision's id, or to `"end"`, to branch.
- The lesson's own Next and Previous buttons step through the scenario, so there is only one set of navigation.
- The final screen lists every option with its outcome and marks the learner's choices. "Try a different path" restarts.
- Choices are saved in the browser and restored on return.
- A scenario is optional. Skip for Now is offered until a choice is made, and a scenario never blocks module completion.
- Optional `audio` fields add voice-over to the scene and to outcomes. The written text is always shown and serves as the transcript.
- A scenario can include an open `question`. Placed on the scenario, it gets its own step after the last decision, with a recap of how every choice played out, before the compare screen. Placed on a single decision, it appears under that decision's outcome. Next asks for an answer and Skip for Now passes it. The answer is saved like other reflections and appears in the Reflection Summary, but it never blocks module completion.
- `showTagsAfterChoice: false` holds each option's tag back until the compare screen, for scenarios where the tags would give the answer away.
- Each option has an `outcome` (what happens) and an optional `explanation` (why). The explanation is shown only on the compare screen, so learners think before they are told.
- A later reflection can show the learner's choices by setting `scenarioRecap` to the scenario's lesson id.
- `validateScenario()` reports content mistakes, and `tests/branchingScenario.test.mjs` runs it on every scenario in the course.

### perspectiveFlip

`perspectiveFlip` shows the same moment from two points of view. The learner sees one person's view of a picture, guesses what the other person is thinking, then flips to the other view. A closing table sets the two views side by side.

All of its logic and layout live in `js/perspectiveFlip.js`. The content lives in the module file. The data format is documented at the top of `js/perspectiveFlip.js`.

Use `perspectiveFlip` when the learning goal is seeing a situation through someone else's eyes.

Behavior:

- Each panel shows a picture and the first view. The learner writes a short guess first. The options stay hidden until they have written something, so they think before they see the choices. Picking an option flips the panel to the second view and shows feedback on the guess. `writeFirst: false` shows the options straight away and makes the written guess optional.
- After the flip, the learner can switch between the two views.
- The second view can include a list of what was said with its meaning, for example translations.
- The lesson's own Next and Previous buttons step through the panels. Skip for Now flips a panel without a guess.
- An optional closing table compares the two views row by row and lists the learner's guesses.
- Guesses are saved in the browser and restored on return. They are not reflections: they do not appear in the Reflection Summary and never block module completion.
- `validatePerspectiveFlip()` reports content mistakes, and `tests/perspectiveFlip.test.mjs` runs it on every perspective flip in the course.

### reflectionSummary

`reflectionSummary` gathers written learner reflections from across the course and presents them in course order.

It is intended for end-of-course review, metacognition, and personal action planning.

`reflectionSummary` is a post-workshop review destination, not an instructional module lesson. It lives in course-level data, remains hidden until all instructional modules are complete, and does not count toward module completion or progress.

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
- Allow learners to revise saved responses in place without creating new storage keys.
- Keep a separate "Return to Activity" action when navigation data is available.
- Support an accessible, print-friendly layout.
- Do not require every reflection to be completed before the learner may finish the course.
- Display a saved-response count near the top of the page.
- Aggregate practiced competencies once at the bottom of the page.
- Present competencies as practice opportunities, never as scores or mastery claims.
- Reveal the navigation item only after all instructional modules are complete.
- Do not include the summary page in the instructional lesson sequence or module count.

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

- Each reflection entry should include an "Edit Response" control for inline revision.
- Inline edits should commit only when the learner selects "Save Changes"; typing in the summary should not autosave.
- Each reflection entry should include a separate "Return to Activity" button when the original lesson can be reopened.
- The "Return to Activity" button should use the existing lesson navigation flow to return to the lesson that collected the response.
- After the final instructional module is completed, the app may route learners to the Reflection Summary automatically.
- The Reflection Summary navigation item should remain available after completion and should be keyboard accessible.
- A first-time reveal animation may be used for the navigation item, but it must respect `prefers-reduced-motion` and must not be required for understanding.

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

### Showcase route

The showcase is a short route (about ten minutes) through the workshop for reviewers. It is defined in `modules/showcase.js` and exposed as `courseData.showcase`.

- The route does not duplicate content. `fromModule(module, id, changes)` copies a lesson from its module, gives it the id `showcase-<id>`, and records `sourceLessonId` and `stateId`.
- Activity engines store their state under `lesson.stateId || lesson.id`, so progress in a showcase activity and in the same activity in the full workshop is shared.
- Showcase lessons are indexed separately from the modules (`isShowcase: true`). They are not subject to the module guard, and reflections in the route are optional.
- The top bar counts steps across the whole route, in the same way as a module.
- The route ends with a `showcaseEnd` lesson, rendered by `renderShowcaseEnd` in `js/renderer.js`.
- The route can be opened from the landing page, from the sidebar, or directly with the `#showcase` link.
- To change what the showcase contains, edit the list in `modules/showcase.js`. Edits to a lesson in its own module appear in the showcase automatically.

### Signal transcript

`js/signalTranscript.js` is a reusable activity (lesson type `signalTranscript`). The learner reads a short conversation, marks the lines they think carried an unspoken message, and then sees a line-by-line review of what they marked, what they missed, how each line could be heard, and how it was meant.

- The conversation (speakers, lines, which lines are signals, and the review text) belongs in module data. The format is documented at the top of the file.
- The activity has two steps, marking and review. The lesson's Next and Previous buttons move between them, and the top bar counts both.
- At least one line must be marked before the review. Skip for Now is offered while marking.
- Marks are saved under `transcript_<stateId or id>`.
- Each line can carry an optional `audio` file for voice-over.
- It is used in the negotiation incident ("Where Was the No?"), which is followed by a one-decision branching scenario and one reflection.

### Explore mode

The menu screen has an "Explore freely" switch for reviewers. It is on by default, because this is a portfolio project. A learner can switch it off to get the normal requirements.

- The setting is saved as `exploreMode` and read through `isExploreModeOn()` in `js/reflectionValidation.js`.
- While it is on, `getMissingRequiredResponses()` returns nothing and `validateRequiredFields()` always passes, so every place that enforces required reflections (the module guard, the Next button, module completion) lets the reviewer through. The Reflection Summary is also open.
- Anything typed is still saved. Switching it off restores the normal requirements, based on the responses actually saved.
- Steps inside activities (choosing an option, marking a line) still ask for an answer, and still offer Skip for Now.
