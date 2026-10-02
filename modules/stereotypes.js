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
    image: "images/stereotype/american_stereotypes.png",

    lessons: [
        {
            id: "stereotypes-intro",
            type: "moduleIntro",
            title: "Stereotypes",
            moduleLabel: "Module 2",
            body: [
                "In this module, you will explore stereotypes, why people use them, how they can sometimes fill gaps in knowledge, and why they can also cause harm.",
                "The picture on this page is built entirely from stereotypes about Americans. How many can you spot? How well does it describe real people?"
            ],
            image: "images/stereotype/american_stereotypes.png",
            imageAlt: "A man in a cowboy hat and football jersey holds a giant burger and a large soda in front of an oversized pickup truck, surrounded by American flags. The image is built from stereotypes about Americans.",
            buttonText: "Begin Module 2"
        },

        {
            id: "stereotypes-definition",
            type: "contentImage",
            title: "What is Stereotyping?",
            moduleLabel: "Stereotypes",
            image: "images/stereotype/limited_view.png",
            imageAlt: "Illustration showing how stereotypes create a limited view of people",
            body: [
                "Stereotypes are simplified ideas about groups of people.",
                "People often use stereotypes because they do not know everything about every culture. In that sense, stereotypes can feel useful because they help fill a gap in knowledge.",
                "However, stereotypes are often incomplete, exaggerated, or wrong, and they can cause real harm. They lead us to treat a person as a category instead of an individual, and to notice only what confirms what we already expect.",
                "This is true of positive stereotypes too. Expecting someone to be hardworking, polite, or good at math because of their background still replaces the person with an assumption.",
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
                "Think about a stereotype you have heard about a group you belong to. It could be about your nationality, region, generation, profession, or another group."
            ],
            prompt: "What is a stereotype about a group you belong to? How well does it describe you?",
            storageKey: "stereotypesReflection",
            required: true,
            rationale: `When you think about stereotypes of your own culture, you may quickly recognize examples that do not accurately describe you or people you know. Stereotypes rely on incomplete and generalized information. Even when a stereotype appears to describe some members of a group, it cannot tell you what a particular individual will think, value, or do.

The important question is what you do with that knowledge. Do you hold onto the same incomplete picture, or update it as you receive new information? Also consider how stereotypes influence behavior. If you know that a generalization may not accurately describe the person in front of you, should you act as though it does?`,
            learningObjectives: ["LO2"],
            competencies: ["IC2"],
            placeholder: "Write your response here..."
        },

        {
            id: "stereotypes-recognize",
            type: "contentImage",
            title: "How Do You Recognize Stereotypes?",
            moduleLabel: "Stereotypes",
            image: "images/stereotype/group_variation.png",
            imageAlt: "Illustration showing variation among people within the same group",
            body: [
                "Stereotypes are usually broad statements applied to a whole group of people.",
                "They often sound like: “All ____ are ____.”",
                "They usually include a conclusion but little or no actual evidence.",
                "Try the questions below on this statement: “People from that country are always late.”"
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
                "Ask people about their own experience, not to speak for their whole culture",
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
            id: "stereotypes-assumption-check",
            type: "reflection",
            title: "Checking an Assumption",
            moduleLabel: "Stereotypes",
            body: [
                "Use what you practiced in the stereotype and observation activity to consider how you could check an assumption instead of accepting it as complete information."
            ],
            prompt: "Imagine you realize that one of your expectations about another culture is based on a stereotype or incomplete information. What could you do to check that assumption and develop a more accurate understanding?",
            storageKey: "stereotypesAssumptionCheckReflection",
            required: true,
            rationale: "Recognizing a stereotype is only the first step. What matters next is what you do about it. Planning how you would check an assumption makes it more likely that you will pause and look for more information when it happens in a real situation.",
            learningObjectives: ["LO2"],
            competencies: ["IC2", "IC3"],
            placeholder: "Write your response here..."
        },

        {
            id: "stereotypes-complete",
            type: "moduleComplete",
            title: "Great job!",
            moduleLabel: "Module Complete",
            moduleKey: "stereotypes",
            completedModuleTitle: "Module 2: Stereotypes",
            summary: [
                "Stereotypes can fill gaps in knowledge, but they are incomplete and can cause harm, even when they sound positive.",
                "Stereotypes often make broad claims without enough evidence.",
                "Individuals may not match cultural generalizations.",
                "A better response is to recognize, question, investigate, and update your understanding."
            ],
            nextModuleKey: "ambiguity"
        }
    ]
};
