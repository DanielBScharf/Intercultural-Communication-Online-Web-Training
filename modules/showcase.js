// ======================================
// 10-Minute Showcase
// modules/showcase.js
// ======================================
//
// Purpose:
// A short route through the workshop for reviewers. It is not a module.
// It reuses screens from the modules, so a change to a screen in its
// module file shows up here too.
//
// How to edit:
// - To change which screens are included or their order, edit the
//   "lessons" list at the bottom of this file.
// - fromModule(module, "lesson-id") copies a screen from a module.
//   The optional third value changes fields for the showcase only.
// - The welcome and closing screens are written here.
//
// Each copied screen gets its own id ("showcase-" plus the original id)
// and keeps the original id as "stateId", so activity progress is
// shared between the showcase and the full workshop.
// ======================================

import { cultureModule } from "./culture.js";
import { stereotypesModule } from "./stereotypes.js";
import { daeaModule } from "./daea.js";
import { pragueModule } from "./prague.js";
import { incidentsModule } from "./incidents.js";

export const SHOWCASE_ID_PREFIX = "showcase-";

function fromModule(module, lessonId, changes = {}) {
    const lesson = module.lessons.find(moduleLesson => moduleLesson.id === lessonId);

    if (!lesson) {
        console.warn(`Showcase: lesson "${lessonId}" was not found in "${module.key}".`);
        return null;
    }

    return {
        ...lesson,
        ...changes,
        id: `${SHOWCASE_ID_PREFIX}${lesson.id}`,
        stateId: lesson.id,
        sourceLessonId: lesson.id,
        sourceModuleKey: module.key
    };
}

const welcome = {
    id: "showcase-welcome",
    type: "moduleIntro",
    title: "10-Minute Showcase",
    moduleLabel: "Showcase",
    body: [
        "This is a short tour of the Intercultural Communication Workshop: ten screens chosen to show how the workshop teaches and how its activities work.",
        "You will sort examples of visible and less visible culture, make choices in two branching scenarios, see one moment from two points of view, and finish with a short reflection. Anything that asks you to write can be skipped.",
        "The full workshop has seven modules. You can open it from the menu at any time."
    ],
    image: "images/tolerance/intercultural_connection.png",
    imageAlt: "People connecting through intercultural communication",
    buttonText: "Start the Showcase"
};

const closing = {
    id: "showcase-closing",
    type: "showcaseEnd",
    title: "What's in the Full Workshop",
    moduleLabel: "Showcase",
    body: [
        "You have seen ten screens from a seven-module workshop. The full version adds the reflections, practice, and content that connect them."
    ],
    sections: [
        {
            title: "In the full workshop",
            items: [
                "Seven modules, from understanding culture to a final reflection",
                "The complete Prague story and two more critical incidents",
                "Step-by-step DAEA practice with sample responses",
                "A Reflection Summary that gathers everything the learner wrote"
            ]
        },
        {
            title: "What a client build can add",
            items: [
                "Voice-over on the scenarios, with the text kept on screen as a transcript",
                "Completion and score tracking in a learning management system",
                "Your branding, and examples and scenarios written for your learners"
            ]
        }
    ],
    menuButtonText: "Explore the Full Workshop",
    links: [
        {
            label: "View Project Documentation",
            href: "https://github.com/DanielBScharf/Intercultural-Communication-Online-Web-Training/blob/main/docs/DESIGN_DECISIONS.md"
        }
    ]
};

export const showcaseRoute = {
    key: "showcase",
    title: "10-Minute Showcase",
    description: "A short tour of the workshop's key ideas and activities.",

    lessons: [
        welcome,

        fromModule(cultureModule, "culture-iceberg-intro"),
        fromModule(cultureModule, "culture-iceberg-sort"),
        fromModule(cultureModule, "culture-hidden-matters"),

        fromModule(stereotypesModule, "stereotypes-scenario"),

        fromModule(daeaModule, "daea-overview"),

        fromModule(pragueModule, "prague-perspectives", {
            instructions: "A student is trying to buy a monthly rail pass in Prague. He speaks no Czech. Look at each panel as he saw it, guess what the clerk is thinking, then flip to her side."
        }),

        fromModule(incidentsModule, "incident-drinking-expectation"),

        // The reflection is optional here so a reviewer is never stopped.
        fromModule(incidentsModule, "incident-drinking-reflection", {
            required: false
        }),

        closing
    ].filter(Boolean)
};
