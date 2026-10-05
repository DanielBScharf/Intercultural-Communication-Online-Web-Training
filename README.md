# Intercultural Communication Workshop

An interactive, self-paced workshop that builds intercultural communication skills through branching scenarios, perspective-taking activities, and guided reflection.

Designed, written, and built by **Daniel Scharf** as an instructional design portfolio project.

**[Open the workshop](https://danielbscharf.github.io/Intercultural-Communication-Online-Web-Training/)** · **[Take the 10-minute showcase](https://danielbscharf.github.io/Intercultural-Communication-Online-Web-Training/#showcase)**

## For reviewers

- The **10-minute showcase** is a short route through the main ideas and each type of activity.
- **Explore freely** is on by default, so you can open any module in any order without completing the reflections. Switch it off on the menu screen to take the workshop as a learner would.
- The **[design decisions](docs/DESIGN_DECISIONS.md)** document explains the instructional reasoning behind the workshop.

## Learning objectives

By the end of the workshop, learners will be able to:

1. Distinguish visible from less visible elements of culture and explain how a less visible element can cause a misunderstanding.
2. Given a situation, recognize when a conclusion rests on a stereotype and replace it with a tentative, individual-level observation.
3. Given an unclear situation, generate at least two plausible explanations, identify what they would need to find out, and choose a response that doesn't depend on a single interpretation.
4. In a written account of an intercultural incident, distinguish what happened from their interpretation of it and from their emotional reaction to it.
5. Based on their reflection, write a specific next step for a future intercultural situation.

## Modules

1. Understanding Culture
2. Stereotypes
3. Tolerance of Ambiguity
4. Critical Reflection / DAEA (Describe, Analyze, Evaluate, Apply)
5. Prague Example Practice
6. Critical Incidents
7. Final Reflection

A Reflection Summary gathers everything the learner wrote and shows how each reflection connects to the objectives.

## Activity types

| Activity | What the learner does | Example |
| --- | --- | --- |
| Sorting | Sorts items into visible and less visible culture | Iceberg Sorting Activity |
| Branching scenario | Makes decisions, sees each play out, then compares every path | The New Colleague, A Work Dinner |
| Perspective flip | Reads one side of an encounter, writes a guess, then sees the other side | Prague: Two Sides of the Counter |
| Signal transcript | Marks the lines of a conversation that carried an unspoken message | Where Was the No? |
| Guided activity | Works through a story in steps, with reflection | What Happened Next |
| Reflection | Writes a response that is saved in the browser | Throughout |

## How it is built

The workshop is a single page written in plain HTML, CSS, and JavaScript modules, with Bootstrap 5 for layout. It has no build step and no server. Learner responses and progress are saved in the browser's local storage.

Content is kept separate from behavior:

- `modules/` holds the instructional content, one file per module.
- `js/` holds the behavior. Each activity type is its own reusable file, so a new scenario can be written as content without changing code.
- `tests/` holds automated tests for the activity logic and the navigation rules.

```text
intercultural-workshop/
├── index.html
├── css/styles.css
├── js/
│   ├── app.js                 navigation, menu screen, sidebar
│   ├── renderer.js            turns lesson data into screens
│   ├── activities.js          sorting, guided activity, image reveal
│   ├── branchingScenario.js   branching scenarios
│   ├── perspectiveFlip.js     two-sided perspective activity
│   ├── signalTranscript.js    marked conversation activity
│   ├── moduleProgress.js      progress bar
│   ├── reflectionValidation.js
│   ├── courseData.js
│   └── storage.js
├── modules/                   content for each module, plus the showcase route
├── tests/
├── docs/
└── images/
```

## Documentation

- [Design Decisions](docs/DESIGN_DECISIONS.md): instructional philosophy, learning outcomes, and the reasoning behind each module
- [Technical Architecture](docs/TECHNICAL_ARCHITECTURE.md): how the code is organized and how each activity type works
- [Required Response Audit](docs/REQUIRED_RESPONSE_AUDIT.md): which reflections are required

## Run it locally

The project uses JavaScript modules, so it needs a local web server. Opening `index.html` directly from the file system will not work.

1. Open the folder in VS Code.
2. Install the Live Server extension.
3. Right-click `index.html` and choose **Open with Live Server**.

To run the tests (needs a recent version of Node.js):

```text
node --test tests/*.mjs
```

## Status and roadmap

All seven modules are complete and can be taken from start to finish. Planned next:

- Voice-over for the branching scenarios
- A cultural dimensions self-check
- Rebuilding the remaining critical incident as a practice activity
- Testing with learners and revising from their feedback
- Continued accessibility testing

## AI collaboration

The workshop was developed with AI assistance for code. The curriculum, instructional decisions, and final design choices are mine. The design decisions document describes how that collaboration worked.

## Contact

Daniel Scharf · [id.scharfd@gmail.com](mailto:id.scharfd@gmail.com) · [LinkedIn](https://www.linkedin.com/in/scharf-daniel-/) · [daniel-scharf.com](https://daniel-scharf.com)

This project is shared for portfolio and educational purposes.
