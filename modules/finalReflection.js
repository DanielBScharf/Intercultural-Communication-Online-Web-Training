// ======================================
// Module 7: Final Reflection
// modules/finalReflection.js
// ======================================
//
// Purpose:
// This file contains ONLY the instructional content for Module 7.
// It does not control layout, navigation, storage, or styling.
//
// Important:
// The "type" field tells renderer.js what layout to use.
// ======================================

export const finalReflectionModule = {
    key: "final-reflection",
    title: "Final Reflection",
    description: "Reflect on the workshop and identify how you will apply what you have learned.",

    lessons: [
        {
            id: "final-reflection-intro",
            type: "moduleIntro",
            title: "Final Reflection",
            moduleLabel: "Module 7",
            body: [
                "This final module gives you time to reflect on what you learned and how you will continue practicing intercultural competence."
            ],
            buttonText: "Begin Final Reflection"
        },

        {
            id: "final-reflection-questions",
            type: "reflection",
            title: "Workshop Reflection",
            moduleLabel: "Final Reflection",
            body: [
                "Please take a few minutes to reflect on the questions below. As you respond, remember that explaining why is just as important as explaining what."
            ],
            prompts: [
                {
                    prompt: "Which concept or strategy from this workshop do you think will be most useful to you? Why did you choose it, and in what kinds of situations might you use it?",
                    storageKey: "finalReflectionUsefulConcept",
                    rationale: "This reflection asks learners to identify the course idea they expect to transfer into future intercultural situations.",
                    learningObjectives: ["LO5"],
                    placeholder: "Write your reflection here..."
                },
                {
                    prompt: "What is one thing you will do differently the next time you encounter a situation you do not fully understand? Explain how this response might affect the way you interpret or navigate the situation.",
                    storageKey: "finalReflectionDifferentResponse",
                    rationale: "This reflection connects tolerance of ambiguity with a concrete plan for responding to unfamiliar situations.",
                    learningObjectives: ["LO3", "LO5"],
                    placeholder: "Write your reflection here..."
                },
                {
                    prompt: "Was there anything in this workshop that you questioned or disagreed with? What was it, and why did you respond that way?",
                    storageKey: "finalReflectionDisagreement",
                    rationale: "This reflection invites learners to critically examine course ideas rather than accepting them without analysis.",
                    learningObjectives: ["LO4"],
                    placeholder: "Write your reflection here..."
                },
                {
                    prompt: "What is one specific idea or strategy from this workshop that you plan to apply in the future? Describe when, where, or how you will put it into practice.",
                    storageKey: "finalReflectionActionPlan",
                    rationale: "This reflection turns workshop learning into an action plan for future intercultural communication.",
                    learningObjectives: ["LO5"],
                    placeholder: "Write your reflection here..."
                },
                {
                    prompt: "What question about culture, communication, or intercultural experiences are you leaving this workshop with that you would like to explore further?",
                    storageKey: "finalReflectionFurtherQuestion",
                    rationale: "This reflection emphasizes intercultural competence as continued curiosity and lifelong learning.",
                    learningObjectives: ["LO1", "LO5"],
                    placeholder: "Write your reflection here..."
                }
            ]
        },

        {
            id: "final-reflection-summary",
            type: "contentImage",
            title: "Continue the Practice",
            moduleLabel: "Final Reflection",
            body: [
                "Intercultural competence does not mean knowing everything about every culture. It means recognizing that your own perspective is only one way of understanding the world. It also means remaining curious, delaying judgment, and continuing to reflect when you encounter something unfamiliar."
            ],
            takeaways: [
                "Culture influences how people interpret situations and communicate with others.",
                "Stereotypes can limit understanding when they replace curiosity and observation.",
                "Tolerance of ambiguity helps you remain open when a situation is unfamiliar or unclear.",
                "Critical reflection helps separate observation, interpretation, judgment, and future action.",
                "Intercultural competence develops through continued practice."
            ]
        },

        {
            id: "reflection-journey-summary",
            type: "reflectionSummary",
            title: "Your Reflection Journey",
            moduleLabel: "Final Reflection",
            introduction: "Throughout this workshop, you have reflected on your experiences, assumptions, reactions, and plans for future action. Review your responses below and notice how your thinking developed. Each reflection also explains why it was included and which learning objective it supports."
        },

        {
            id: "final-reflection-complete",
            type: "moduleComplete",
            title: "Workshop Complete",
            moduleLabel: "Module Complete",
            moduleKey: "final-reflection",
            completedModuleTitle: "Intercultural Communication Workshop",
            completionMessage: "You have completed the Intercultural Communication Workshop. The goal is not to leave with every answer. The goal is to leave better prepared to pause, observe, ask thoughtful questions, and remain curious when your first interpretation may be incomplete. Intercultural competence is a lifelong process of learning, reflection, and growth.",
            summary: [
                "First interpretations may be incomplete.",
                "Cultural expectations can differ.",
                "Curiosity, reflection, and thoughtful questions support continued intercultural learning."
            ],
            buttonText: "Finish Workshop"
        }
    ]
};
