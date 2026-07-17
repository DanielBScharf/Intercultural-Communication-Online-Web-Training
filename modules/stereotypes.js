// ======================================
// Module 2: Stereotypes
// modules/stereotypes.js
// ======================================
//
// Purpose:
// This file contains ONLY the instructional content for Module 2.
// It does not control layout, navigation, storage, or styling.
//
// How to edit:
// Add, remove, or revise lesson objects inside the lessons array.
//
// Important:
// The "type" field tells renderer.js what layout/activity to use.
// ======================================

export const stereotypesModule = {
    key: "stereotypes",
    title: "Stereotypes",
    description: "Explore stereotypes, why people use them, and how to respond to them.",
    image: "images/culture/intercultural-image.png",

    lessons: [
        {
            id: "stereotypes-intro",
            type: "moduleIntro",
            title: "Stereotypes",
            moduleLabel: "Module 2",
            body: [
                "In this module, you will explore stereotypes, why people use them, how they can sometimes fill gaps in knowledge, and why they can also be dangerous."
            ],
            buttonText: "Begin Module 2"
        },

        {
            id: "stereotypes-definition",
            type: "contentImage",
            title: "What is Stereotyping?",
            moduleLabel: "Stereotypes",
            image: "images/culture/intercultural-image.png",
            imageAlt: "People from different cultures interacting",
            body: [
                "Stereotypes are simplified ideas about groups of people.",
                "People often use stereotypes because they do not know everything about every culture. In that sense, stereotypes can feel useful because they help fill a gap in knowledge.",
                "However, stereotypes are also dangerous because they are often incomplete, exaggerated, or wrong.",
                "Even if something is common in one culture, individuals from that culture may not follow it."
            ],
            note: "Stereotypes should never be treated as final knowledge. They must be updated when you get more information."
        },

        {
            id: "stereotypes-reflection",
            type: "reflection",
            title: "Recognizing Stereotypes",
            moduleLabel: "Stereotypes",
            body: [
                "Think about stereotypes you have heard before. These may be stereotypes about your own culture or stereotypes about other cultures."
            ],
            prompt: "What are some stereotypes of your culture? What are some common stereotypes of other cultures? Are they true?",
            storageKey: "stereotypesReflection",
            rationale: "This reflection asks learners to notice stereotypes and question whether broad claims are supported by evidence.",
            learningObjectives: ["LO2"],
            placeholder: "Write your response here..."
        },

        {
            id: "stereotypes-recognize",
            type: "contentImage",
            title: "How Do You Recognize Stereotypes?",
            moduleLabel: "Stereotypes",
            image: "images/culture/stereotypes.png",
            imageAlt: "Image representing stereotypes or assumptions",
            body: [
                "Stereotypes are usually broad statements applied to a whole group of people.",
                "They often sound like: “All ____ are ____.”",
                "They usually include a conclusion but little or no actual evidence."
            ],
            prompts: [
                "Is this statement based on evidence?",
                "Does it describe individuals or an entire group?",
                "What information might be missing?"
            ]
        },

        {
            id: "stereotypes-process",
            type: "twoColumn",
            title: "How to Deal with Stereotypes",
            moduleLabel: "Stereotypes",
            leftTitle: "What to Notice",
            leftItems: [
                "A broad claim about a group",
                "A conclusion without evidence",
                "A statement that ignores individual differences",
                "A reaction based on limited information"
            ],
            rightTitle: "What to Do",
            rightItems: [
                "Recognize it as a stereotype",
                "Think about the evidence",
                "Find more information",
                "Politely ask someone from that culture",
                "Update your understanding"
            ],
            note: "With practice, stereotypes become easier to recognize and address."
        },

        {
            id: "stereotypes-sort",
            type: "sortingActivity",
            title: "Stereotype or Observation?",
            moduleLabel: "Stereotypes",
            instructions: "Sort each statement as either a stereotype or an observation.",
            categories: [
                {
                    key: "stereotype",
                    title: "Stereotype",
                    description: "A broad claim or assumption about a group."
                },
                {
                    key: "observation",
                    title: "Observation",
                    description: "A specific detail based on something directly noticed."
                }
            ],
            items: [
                {
                    text: "All people from that country are quiet.",
                    answer: "stereotype"
                },
                {
                    text: "The person I met spoke quietly during the meeting.",
                    answer: "observation"
                },
                {
                    text: "Everyone from that culture hates direct feedback.",
                    answer: "stereotype"
                },
                {
                    text: "My colleague avoided giving a direct answer in that conversation.",
                    answer: "observation"
                },
                {
                    text: "People from cities are always rude.",
                    answer: "stereotype"
                },
                {
                    text: "The people I spoke with in that city seemed busy and direct.",
                    answer: "observation"
                }
            ]
        },

        {
            id: "stereotypes-complete",
            type: "moduleComplete",
            title: "Great job!",
            moduleLabel: "Module Complete",
            moduleKey: "stereotypes",
            completedModuleTitle: "Module 2: Stereotypes",
            summary: [
                "Stereotypes can fill gaps in knowledge, but they are incomplete.",
                "Stereotypes often make broad claims without enough evidence.",
                "Individuals may not match cultural generalizations.",
                "A better response is to recognize, question, investigate, and update your understanding."
            ],
            nextModuleKey: "ambiguity"
        }
    ]
};
