// ======================================
// Course Data
// js/courseData.js
// ======================================

import { cultureModule } from "../modules/culture.js";
import { stereotypesModule } from "../modules/stereotypes.js";
import { ambiguityModule } from "../modules/ambiguity.js";
import { daeaModule } from "../modules/daea.js";
import { pragueModule } from "../modules/prague.js";
import { incidentsModule } from "../modules/incidents.js";

// Temporary placeholder modules.
// We will replace these one at a time as we build them.

const reflectionModule = {
    key: "reflection",
    title: "Final Reflection",
    description: "Review your responses and reflect on your learning.",
    lessons: [
        {
            id: "reflection-intro",
            type: "moduleIntro",
            title: "Final Reflection",
            moduleLabel: "Module 7",
            body: [
                "This final module gives you an opportunity to think back on what you learned in this program."
            ],
            buttonText: "Begin Final Reflection"
        }
    ]
};

export const courseData = {
    title: "Intercultural Communication Workshop",
    creator: "Daniel Scharf",
    year: "2026",

    objectives: [
        "Explain what culture is and how it influences perception.",
        "Identify stereotypes and assumptions.",
        "Demonstrate and build tolerance of ambiguity.",
        "Use DAEA to critically reflect on experiences.",
        "Create a plan of action based on a critical reflection."
    ],

    modules: [
        cultureModule,
        stereotypesModule,
        ambiguityModule,
        daeaModule,
        pragueModule,
        incidentsModule,
        reflectionModule
    ]
};
