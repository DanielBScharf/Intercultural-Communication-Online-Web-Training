# Intercultural Communication Workshop

An interactive, web-based learning experience designed to help learners build intercultural communication skills through reflection, scenario-based practice, and critical incidents.

Created by **Daniel Scharf**.

## Project Overview

This project began as a PowerPoint-based intercultural communication workshop and is being redesigned as a responsive web-based learning module. The course introduces learners to culture, cultural perspectives, stereotypes, tolerance of ambiguity, critical reflection, and the DAEA reflection model.

The project is also designed as a portfolio piece demonstrating instructional design, learning experience design, and front-end development skills.

## Learning Goals

By the end of the course, learners will be able to:

* Explain what culture is and how it influences perception.
* Identify stereotypes and assumptions.
* Demonstrate and build tolerance of ambiguity.
* Use DAEA to critically reflect on experiences.
* Create a plan of action based on critical reflection.

## Course Modules

1. Understanding Culture
2. Stereotypes
3. Tolerance of Ambiguity
4. Critical Reflection / DAEA
5. Prague Example Practice
6. Critical Incidents
7. Final Reflection

## Key Features

* Modular JavaScript-based course structure
* Reusable lesson templates
* Dynamic lesson rendering
* Local browser storage for learner responses
* Progress tracking
* Interactive reflection prompts
* Accordion-based content sections
* Sorting activity for visible and hidden culture
* Scenario-based learning using a Prague comic case study
* Critical incident practice activities

## Project Structure

```text
intercultural-workshop/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── courseData.js
│   ├── renderer.js
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
    ├── hero/
    ├── culture/
    ├── iceberg/
    ├── daea/
    └── comic/
```

## Architecture

The site uses a modular structure:

* `index.html` provides the application shell.
* `courseData.js` imports and organizes course modules.
* `modules/*.js` files contain instructional content.
* `renderer.js` converts lesson objects into HTML.
* `storage.js` handles localStorage and saved learner responses.
* `app.js` controls navigation, application state, and sidebar rendering.

This structure keeps course content separate from presentation logic, making it easier to revise lessons or add future modules. Thinking of possibly making each module it's own JS file for easier editing and updating.

## Technologies Used

* HTML5
* CSS3
* Bootstrap 5
* Bootstrap Icons
* JavaScript ES Modules
* localStorage
* GitHub Pages

## Current Status

This project is in active development.

Completed or in progress:

* Project architecture
* Modular course data structure
* Module 1 content structure
* Dynamic rendering system
* Local storage helpers
* Basic navigation system

Planned improvements:

* Full Module 1 polish
* Implementation of all modules
* Improved sidebar navigation
* Interactive iceberg sorting activity
* DAEA image reveal activity
* Prague comic activity
* Critical incident templates
* Reflection summary page
* Downloadable learner response summary
* Optional email response feature

## How to Run Locally

Because this project uses JavaScript ES modules, it should be run through a local development server.

Recommended method:

1. Open the project folder in VS Code.
2. Install the Live Server extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

The project should open at a local address such as:

```text
http://127.0.0.1:5500/
```

Opening `index.html` directly with a `file:///` path may cause browser security errors.

## Portfolio Purpose

This project demonstrates:

* Instructional design
* Learning experience design
* Scenario-based learning
* Reflection-based learning
* Web-based course design
* Front-end development
* Modular content architecture
* Basic learner progress persistence

## Project Documentation

This project was intentionally documented to demonstrate the instructional design process behind the final product.

- 📘 Design Decisions
- 🏗 Technical Architecture
- ♿ Accessibility Considerations

## License

This project is currently for portfolio and educational purposes.
