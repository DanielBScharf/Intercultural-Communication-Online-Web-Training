// ======================================
// Module 3: Tolerance of Ambiguity
// modules/ambiguity.js
// ======================================
//
// Purpose:
// This file contains ONLY the instructional content for Module 3.
// It does not control layout, navigation, storage, or styling.
//
// How to edit:
// Add, remove, or revise lesson objects inside the lessons array.
//
// Important:
// The "type" field tells renderer.js what layout/activity to use.
// ======================================

export const ambiguityModule = {
    key: "ambiguity",
    title: "Tolerance of Ambiguity",
    description: "Build comfort with unfamiliar, unclear, and unpredictable situations.",
    image: "images/culture/intercultural-image.png",

    lessons: [
        {
            id: "ambiguity-intro",
            type: "moduleIntro",
            title: "Tolerance of Ambiguity",
            moduleLabel: "Module 3",
            body: [
                "This module introduces the concept of tolerance of ambiguity, why it matters, and how it can help you respond more effectively in unfamiliar intercultural situations."
            ],
            buttonText: "Begin Module 3"
        },

        {
            id: "ambiguity-definition",
            type: "contentImage",
            title: "How to Work Best with People of Other Cultures",
            moduleLabel: "Tolerance of Ambiguity",
            image: "images/culture/ambiguity.png",
            imageAlt: "Person navigating an unfamiliar situation",
            body: [
                "A key intercultural skill is tolerance of ambiguity.",
                "Tolerance of ambiguity is the ability to remain calm, curious, and open when you are in a situation you do not fully understand or when you do not yet have all the information."
            ],
            note: "This does not mean ignoring discomfort. It means noticing your reaction and staying open long enough to learn."
        },

        {
            id: "ambiguity-usefulness",
            type: "contentImage",
            title: "Where is This Skill Useful?",
            moduleLabel: "Tolerance of Ambiguity",
            image: "images/culture/ambiguity.png",
            imageAlt: "Person outside of their comfort zone",
            body: [
                "Tolerance of ambiguity is useful almost everywhere.",
                "It is especially useful when working with people from other cultures, traveling, studying abroad, starting a new job, joining a new group, or entering any situation where expectations are unclear.",
                "The good news is that tolerance of ambiguity is a skill. It can be practiced and developed."
            ]
        },

        {
            id: "ambiguity-build",
            type: "accordion",
            title: "How to Build Tolerance of Ambiguity",
            moduleLabel: "Tolerance of Ambiguity",
            intro: "Click each section to explore practical ways to build this skill.",
            items: [
                {
                    title: "Change Your Mindset",
                    body: [
                        "View confusing and ambiguous situations as opportunities to learn.",
                        "Try to get into a learning mindset instead of immediately making a judgment.",
                        "Wait for more information before deciding what something means."
                    ]
                },
                {
                    title: "Practice",
                    body: [
                        "Try new things. Pick up a new hobby, try a new recipe, join a new group, or watch a new sport.",
                        "Intentionally place yourself in situations where you do not have full control.",
                        "Small experiences with uncertainty can help build your comfort with larger ambiguous situations."
                    ]
                },
                {
                    title: "Embrace the Unknown",
                    body: [
                        "Understand that you cannot always be in control.",
                        "Enter new situations with an open mind and fewer fixed expectations.",
                        "Notice your first emotional reaction before deciding what the situation means."
                    ]
                },
                {
                    title: "Be Curious",
                    body: [
                        "Think of the situation as an opportunity to gain experience and learn something new.",
                        "The more you approach unfamiliar situations with curiosity instead of fear, the more you can learn from them."
                    ]
                }
            ]
        },

        {
            id: "ambiguity-uncomfortable",
            type: "reflection",
            title: "Uncomfortable is Not Always Bad",
            moduleLabel: "Tolerance of Ambiguity",
            body: [
                "Many new experiences are uncomfortable at first, but that does not mean they are negative.",
                "Our first reaction to something outside our comfort zone may be fear, worry, or resistance. That reaction is normal, but it can also get in the way of learning.",
                "Think about your first time doing something new, such as presenting in front of people, driving, going on a first date, living away from family, or entering a new workplace."
            ],
            prompt: "In one of those situations, were you comfortable? How did you feel? Was it necessarily a bad experience?",
            storageKey: "ambiguityUncomfortableReflection",
            rationale: "This reflection helps learners distinguish discomfort from danger and connect that distinction to tolerance of ambiguity.",
            learningObjectives: ["LO3"],
            placeholder: "Write your response here..."
        },

        {
            id: "ambiguity-model",
            type: "twoColumn",
            title: "Tolerance of Ambiguity Model",
            moduleLabel: "Tolerance of Ambiguity",
            leftTitle: "Step",
            leftItems: [
                "STOP",
                "OBSERVE",
                "LEARN"
            ],
            rightTitle: "What it Means",
            rightItems: [
                "Ask: Am I safe? If yes, continue. If not, find safety.",
                "Wait and see. Gauge the environment and gather more information.",
                "Reflect on what you can learn. Look for the why and how, not only the what."
            ],
            note: "This model helps you slow down before jumping to conclusions."
        },

        {
            id: "ambiguity-practice",
            type: "contentImage",
            title: "How to Practice Tolerance of Ambiguity",
            moduleLabel: "Tolerance of Ambiguity",
            image: "images/culture/ambiguity.png",
            imageAlt: "Person reflecting in an unfamiliar situation",
            body: [
                "Tolerance of ambiguity helps us avoid making immediate judgments when we encounter the unknown.",
                "It helps us learn from unfamiliar situations instead of reacting only from our first emotional response.",
                "However, examining our reactions does not always happen naturally. It needs to be intentional.",
                "Luckily, there is a tool that can help us get past judgment and emotion so we can examine our reactions more carefully: critical reflection."
            ]
        },

        {
            id: "ambiguity-complete",
            type: "moduleComplete",
            title: "Great job!",
            moduleLabel: "Module Complete",
            moduleKey: "ambiguity",
            completedModuleTitle: "Module 3: Tolerance of Ambiguity",
            summary: [
                "Tolerance of ambiguity helps you remain calm and curious in unclear situations.",
                "Discomfort does not always mean something is bad.",
                "The STOP, OBSERVE, LEARN model helps slow down immediate judgments.",
                "Critical reflection is a useful tool for learning from ambiguous situations."
            ],
            nextModuleKey: "daea"
        }
    ]
};
