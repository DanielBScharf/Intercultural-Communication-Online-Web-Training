// ======================================
// Module 5: Prague Example Practice
// modules/prague.js
// ======================================
//
// Purpose:
// This file contains ONLY the instructional content for Module 5.
// It does not control layout, navigation, storage, or styling.
//
// Important:
// The "type" field tells renderer.js what layout/activity to use.
// type: "guidedActivity" creates a reusable slide-based activity.
// ======================================

export const pragueModule = {
    key: "prague",
    title: "Prague Example Practice",
    description: "Apply DAEA to a real intercultural experience.",
    image: "images/comic/prague-panel-1.png",

    lessons: [
        {
            id: "prague-intro",
            type: "moduleIntro",
            title: "Prague Example Practice",
            moduleLabel: "Module 5",
            body: [
                "This module gives you a chance to apply DAEA to a realistic intercultural scenario.",
                "You will move through the story one slide at a time, pause to reflect, make a decision, and then compare your reaction with more context."
            ],
            buttonText: "Begin Module 5"
        },

        {
            id: "prague-guided-activity",
            type: "guidedActivity",
            title: "A Misunderstanding in Prague",
            moduleLabel: "Prague Example Practice",
            instructions: "Work through the scenario. Pause before judging, and notice how your interpretation changes as new information appears.",
            slides: [
                {
                    slideType: "story",
                    title: "Arrival in Prague",
                    body: [
                        "You are studying abroad at a one month course (not a language course) in Prague with a small group of classmates. (Note, this incident occurred before live AI translation services were widely available.)",
                        "On your first week, the instructors suggest you to buy a montly rail pass to get around the city cheaper and more easily.",
                        "The only instructions you recieved were to bring the train brochure, the amount that the pass costs, and your passport. You were told that you can do it without speaking Czech just point and they will understand."
                    ],
                    image: "images/comic/prague-panel-1.png",
                    imageAlt: "Student arriving near a tram stop in Prague"
                },
                {
                    slideType: "comic",
                    title: "What You Notice First",
                    intro: "Look at the first part of the scenario.",
                    panels: [
                        {
                            image: "images/comic/prague-panel-1.png",
                            alt: "Panel 1: student arrives near tram stop",
                            label: "Panel 1"
                        },
                        {
                            image: "images/comic/prague-panel-2.png",
                            alt: "Panel 2: classmates waiting quietly",
                            label: "Panel 2"
                        },
                        {
                            image: "images/comic/prague-panel-3.png",
                            alt: "Panel 3: local host looking at phone",
                            label: "Panel 3"
                        },
                        {
                            image: "images/comic/prague-panel-4.png",
                            alt: "Panel 4: student feeling ignored",
                            label: "Panel 4"
                        }
                    ]
                },
                {
                    slideType: "reflection",
                    title: "Pause and Describe",
                    body: [
                        "Before deciding what the situation means, describe only what you can observe.",
                        "Try to avoid emotion, judgment, or explanation for now."
                    ],
                    prompt: "What do you notice in the first four panels?",
                    storageKey: "pragueInitialDescription",
                    rationale: "This reflection asks learners to slow down and describe the situation before interpreting the interaction.",
                    learningObjectives: ["LO3", "LO4"],
                    placeholder: "Describe what you can see or hear without interpreting it yet..."
                },
                {
                    slideType: "decision",
                    title: "What Would You Do?",
                    body: [
                        "You feel awkward because the local host has not greeted you yet.",
                        "You are not sure whether the silence is normal, rude, or simply a sign that everyone is busy."
                    ],
                    question: "What is your best next step?",
                    storageKey: "pragueDecision",
                    choices: [
                        {
                            label: "Wait and observe a little longer",
                            value: "wait-and-observe"
                        },
                        {
                            label: "Assume the host is being rude",
                            value: "assume-rude"
                        },
                        {
                            label: "Politely ask a clarifying question",
                            value: "ask-question"
                        },
                        {
                            label: "Leave and rejoin the group later",
                            value: "leave"
                        }
                    ]
                },
                {
                    slideType: "comic",
                    title: "More Context Appears",
                    intro: "Now look at what happens next.",
                    panels: [
                        {
                            image: "images/comic/prague-panel-5.png",
                            alt: "Panel 5: tram arrival announcement",
                            label: "Panel 5"
                        },
                        {
                            image: "images/comic/prague-panel-6.png",
                            alt: "Panel 6: host checking route information",
                            label: "Panel 6"
                        },
                        {
                            image: "images/comic/prague-panel-7.png",
                            alt: "Panel 7: host greeting the group",
                            label: "Panel 7"
                        },
                        {
                            image: "images/comic/prague-panel-8.png",
                            alt: "Panel 8: group entering the community center",
                            label: "Panel 8"
                        }
                    ]
                },
                {
                    slideType: "reveal",
                    title: "The Whole Situation",
                    body: [
                        "The woman wasn't angry with you she was actually trying to help you but neither of you understood the same language.",
                        "Like many people do when speaking with someone who doesn't undersand your language she didn't realize that raising her voice wouldn't help you understand.",
                        "Your first interpretation made sense from your perspective, but emotion could have been clowding your judgement hindering your understanding."
                    ],
                    image: "images/comic/prague-panel-8.png",
                    imageAlt: "The group continuing together after the misunderstanding is clarified"
                },
                {
                    slideType: "reflection",
                    title: "DAEA Reflection",
                    body: [
                        "Use DAEA to think through the scenario.",
                        "Separate what happened from what you thought it meant, how you felt, and what you would do next."
                    ],
                    prompt: "Describe, Analyze, Evaluate, and Apply: What happened, what might explain it, how did you react, and what could you do next time?",
                    storageKey: "pragueDaeaReflection",
                    rationale: "This reflection applies DAEA to a realistic intercultural misunderstanding and asks learners to plan a better future response.",
                    learningObjectives: ["LO4", "LO5"],
                    placeholder: "Describe: ...\nAnalyze: ...\nEvaluate: ...\nApply: ..."
                },
                {
                    slideType: "summary",
                    title: "Key Takeaways",
                    body: [
                        "Intercultural misunderstandings often begin with incomplete information.",
                        "DAEA helps you slow down before your first interpretation becomes your final conclusion."
                    ],
                    points: [
                        "Describe what you actually observed.",
                        "Analyze possible explanations before choosing one.",
                        "Evaluate your emotional reaction without letting it take over.",
                        "Apply what you learned by asking better questions next time."
                    ]
                }
            ]
        },

        {
            id: "prague-complete",
            type: "moduleComplete",
            title: "Great job!",
            moduleLabel: "Module Complete",
            moduleKey: "prague",
            completedModuleTitle: "Module 5: Prague Example Practice",
            summary: [
                "First impressions can be incomplete.",
                "More context can change the meaning of a situation.",
                "DAEA helps separate observation, interpretation, evaluation, and future action.",
                "Curiosity and clarification can prevent intercultural misunderstandings."
            ],
            nextModuleKey: "incidents"
        }
    ]
};
