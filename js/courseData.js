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
import { showcaseRoute } from "../modules/showcase.js";

// Temporary placeholder modules.
// We will replace these one at a time as we build them.

const learningObjectives = {
    LO1: "Distinguish visible from less visible elements of culture and explain how a less visible element can cause a misunderstanding.",
    LO2: "Given a situation, recognize when a conclusion rests on a stereotype and replace it with a tentative, individual-level observation.",
    LO3: "Given an unclear situation, generate at least two plausible explanations, identify what you would need to find out, and choose a response that doesn't depend on a single interpretation.",
    LO4: "In a written account of an intercultural incident, distinguish what happened from your interpretation of it and from your emotional reaction to it.",
    LO5: "Based on your reflection, write a specific next step for a future intercultural situation."
};

const competencies = {
    IC1: "Recognizing culture as a lens that shapes interpretation and communication.",
    IC2: "Questioning stereotypes, assumptions, and first interpretations.",
    IC3: "Remaining open and curious when situations are unfamiliar or unclear.",
    IC4: "Using critical reflection to separate observation, interpretation, judgment, and action.",
    IC5: "Planning thoughtful future action in intercultural situations.",
    IC6: "Reflecting on conceptual change.",
    IC7: "Recognizing culture as a framework for interpreting the world.",
    IC8: "Self-reflection and metacognition."
};

export const courseData = {
    title: "Intercultural Communication Workshop",
    creator: "Daniel Scharf",
    year: "2026",
    heroImage: "images/tolerance/intercultural_connection.png",
    heroImageAlt: "People connecting through intercultural communication",

    learningObjectives,
    competencies,
    objectives: Object.values(learningObjectives),

    reflectionSummary: {
        id: "reflection-summary",
        type: "reflectionSummary",
        title: "Reflection Summary",
        moduleLabel: "Post-Workshop Review",
        introduction: "This page brings together the reflections you completed throughout the workshop. Use it to review how your thinking developed, revisit the strategies you practiced, and consider how you might apply them in future intercultural experiences. If your perspectives have changed since you completed some of the previous modules, you can also update and change your responses to reflect those changes.",
        competencySummaryTitle: "Competencies You Practiced Throughout This Workshop",
        competencySummaryText: "These reflections demonstrate opportunities to practice the habits associated with intercultural competence. Continued growth occurs through real-world experiences followed by thoughtful reflection."
    },

    // A short route for reviewers. It reuses screens from the modules
    // and is not counted as a module.
    showcase: showcaseRoute,

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
