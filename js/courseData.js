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
import { finalReflectionModule } from "../modules/finalReflection.js";

// Temporary placeholder modules.
// We will replace these one at a time as we build them.

const learningObjectives = {
    LO1: "Explain what culture is and how it influences perception.",
    LO2: "Identify stereotypes and assumptions.",
    LO3: "Demonstrate and build tolerance of ambiguity.",
    LO4: "Use DAEA to critically reflect on experiences.",
    LO5: "Create a plan of action based on a critical reflection."
};

export const courseData = {
    title: "Intercultural Communication Workshop",
    creator: "Daniel Scharf",
    year: "2026",

    learningObjectives,
    objectives: Object.values(learningObjectives),

    modules: [
        cultureModule,
        stereotypesModule,
        ambiguityModule,
        daeaModule,
        pragueModule,
        incidentsModule,
        finalReflectionModule
    ]
};
