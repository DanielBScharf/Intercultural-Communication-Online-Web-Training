// ======================================
// Module 1: Understanding Culture
// modules/culture.js
// ======================================
// ======================================
// Module 1: Understanding Culture
// ======================================
//
// Purpose:
// This file contains ONLY the content for Module 1.
// It does not control navigation, styling, rendering, or saving.
//
// How to edit:
// Add, remove, or revise lesson objects inside the lessons array.
//
// Important:
// The "type" field tells renderer.js what layout/activity to use.
// Example:
// type: "reflection" creates a reflection textbox.
// type: "contentImage" creates a content page with an image.
// type: "sortingActivity" creates a sorting/classification activity.
//
// Connected files:
// - js/courseData.js imports this module.
// - js/renderer.js decides how each lesson type appears.
// - js/storage.js saves learner responses.
// ======================================

const cultureDefinitionReflectionRationale = `As you gain more information, your definition of culture may expand or change. Feel free to add to or revise the definition you wrote earlier. With more experience and reflection, your definition may change again. That is a sign that you are continuing to think about culture and what it means rather than treating your first understanding as permanent.

You will have another opportunity to revisit your definition at the end of the workshop.`;

export const cultureModule = {
    key: "culture",
    title: "Understanding Culture",
    description: "This module provides a definition of culture and explains why culture is important.",
    image: "images/culture/understanding-culture.png",

    lessons: [
        {
            id: "culture-intro",
            type: "moduleIntro",
            title: "Understanding Culture",
            moduleLabel: "Module 1",
            body: [
                "This module provides a definition of culture and explains why culture is important for understanding communication, behavior, and perspective."
            ],
            image: "images/culture/understanding-culture.png",
            imageAlt: "People exploring how culture shapes communication and perspective",
            buttonText: "Begin Module 1"
        },

        {
            id: "culture-definition-reflection",
            type: "reflection",
            title: "What is Culture?",
            moduleLabel: "Understanding Culture",
            prompt: "When you start to think about it defining culture can be complecated. To get you to start thinking about culture write your definition of culture below.",
            storageKey: "cultureDefinition",
            rationale: "Here you get a chance to define culture yourself, before the module begins. Later you will be given several chances to update your definition with new ideas from this series.",
            learningObjectives: ["LO1"],
            competencies: ["IC1"],
            placeholder: "Write your definition here..."
        },

        {
            id: "culture-definition-explanation",
            type: "contentImage",
            title: "What is Culture?",
            moduleLabel: "Understanding Culture",
            image: "images/culture/what-is-culture.png",
            imageAlt: "Illustration introducing the meaning of culture",
            body: [
                "A basic definition of culture is the shared beliefs, ideas, customs, behaviors, arts, languages, patterns of thought, means of expression, identities, preferences, and other practices shared, learned, and practiced by a group of people. This acts as an informal and shared agreement among that group. This also does not overwrite individuals who may rebel or ignore parts of their own culture."
            ],
            prompts: [
                "What is the same or different from your definition?",
                "Why are they different?",
                "Why can defining culture be difficult?"
            ]
        },

        {
            id: "culture-shared",
            type: "contentImage",
            title: "Culture is Shared",
            moduleLabel: "Understanding Culture",
            image: "images/culture/culture-is-shared.png",
            imageAlt: "People sharing cultural knowledge and practices",
            body: [
                "Culture is shared among groups of people, but it is not always the same for everyone in a society. There can be sub-cultures, micro-cultures, and area cultures. Certain interests and groups can have their own culture. Businesses can have their own cultue, while individual offices in a larger corporation can have their own culture.",
                "Think about the following questions:"
            ],
            prompts: [
                "Did your grandparents behave differently from you?",
                "Do elderly people and children in your area believe or act the same as you?",
                "Do people from the city behave the same as people from rural areas?",
                "Do you act the same regardless of where you are or the context you are in? (Can culture be context specific?)"
            ]
        },

        {
            id: "culture-iceberg-intro",
            type: "contentImage",
            title: "Culture is Like an Iceberg",
            moduleLabel: "Understanding Culture",
            image: "images/culture/cultural-iceberg.png",
            imageAlt: "Culture iceberg graphic",
            body: [
                "Culture is often described like an iceberg.",
                "You can easily see what is above the surface, but there is a lot more hidden below that is harder to see.",
                "In essence, the 'what' of your culture is above the water is what you see; what is below the water is the 'why' you do or believe it."
            ]
        },

        {
            id: "culture-iceberg-details",
            type: "twoColumn",
            title: "Visible and Hidden Culture",
            moduleLabel: "Understanding Culture",
            leftTitle: "Visible Culture",
            leftItems: [
                "Food",
                "Flags",
                "Festivals",
                "Language",
                "Clothing",
                "Music"
            ],
            rightTitle: "Hidden Culture",
            rightItems: [
                "Religious beliefs",
                "Family roles",
                "Relationship with time",
                "Friendship expectations",
                "Communication styles",
                "Ideas about politeness"
            ],
            note: "Most intercultural misunderstandings happen because of hidden culture, not visible culture."
        },

        {
            id: "culture-iceberg-reflection",
            type: "reflectionImage",
            title: "Your Culture Iceberg",
            moduleLabel: "Understanding Culture",
            image: "images/culture/cultural-iceberg.png",
            imageAlt: "Culture iceberg graphic",
            prompt: "What are some visible and hidden aspects of your culture?",
            storageKey: "cultureIcebergReflection",
            rationale: `It can be difficult, but important, to identify both the visible and hidden aspects of your own culture. We do not always examine our own cultural assumptions closely, especially the hidden ones. At the same time, cultural practices that differ from our own can quickly seem surprising, confusing, or unusual. Examining the hidden aspects of your own culture can help you recognize that many of your own behaviors and expectations also have cultural explanations.

If this is difficult, start with the visible “what” of your culture. Then ask “why?” Looking underneath visible practices can help you identify some of the values, beliefs, assumptions, and expectations that influence them.`,
            learningObjectives: ["LO1"],
            competencies: ["IC1"],
            placeholder: "Write your ideas here..."
        },

        {
            id: "culture-iceberg-sort",
            type: "sortingActivity",
            title: "Iceberg Sorting Activity",
            moduleLabel: "Understanding Culture",
            instructions: "Classify each item as visible culture or hidden culture.",
            categories: [
                {
                    key: "visible",
                    title: "Visible Culture",
                    description: "Things people can usually see, hear, taste, or observe quickly."
                },
                {
                    key: "hidden",
                    title: "Hidden Culture",
                    description: "Values, expectations, assumptions, or beliefs that may not be obvious."
                }
            ],
            items: [
                { text: "Food", answer: "visible" },
                { text: "Flags", answer: "visible" },
                { text: "Festivals", answer: "visible" },
                { text: "Language", answer: "visible" },
                { text: "Family Roles", answer: "hidden" },
                { text: "Relationship with Time", answer: "hidden" },
                { text: "Ideas About Politeness", answer: "hidden" },
                { text: "Attitudes Toward Authority", answer: "hidden" },
                { text: "Communication Style", answer: "hidden" },
                { text: "Friendship Expectations", answer: "hidden" }
            ]
        },

        {
            id: "culture-lens",
            type: "contentImage",
            title: "Culture is a Lens",
            moduleLabel: "Understanding Culture",
            image: "images/culture/cultural-lens.png",
            imageAlt: "Two people viewing the same cultural event differently",
            body: [
                "Culture is one of the lenses through which we see the world.",
                "It can influence what we notice, what we value, what feels normal, and what feels unfamiliar.",
                "Two people can experience the same event and interpret it very differently."
            ],
            note: "That does not always mean one person is right and the other is wrong. They may simply be looking through different cultural lenses."
        },

        {
            id: "culture-examples",
            type: "accordion",
            title: "Examples of Seeing the World Differently",
            moduleLabel: "Understanding Culture",
            intro: "Click each example to think about how culture can shape interpretation.",
            items: [
                {
                    title: "German Beer Culture",
                    image: "images/culture/german_beer.png",
                    imageAlt: "German beer culture image",
                    body: [
                        "When I moved to Germany, it was strange to me that colleagues and adult students might drink beer during lunch or bring beer to class for a birthday.",
                        "From one cultural perspective, this might feel unusual. From another, it may be normal social behavior."
                    ]
                },
                {
                    title: "Japanese Bathhouse",
                    image: "images/culture/japanese_bath.png",
                    imageAlt: "Japanese bathhouse image",
                    body: [
                        "In Japan, it can be common to use shared bathing spaces, especially in certain hotels, inns, or public baths.",
                        "To someone from a culture where private showers are expected, this may feel uncomfortable at first. To others, it may feel relaxing, ordinary, and communal."
                    ]
                },
                {
                    title: "Natto",
                    image: "images/culture/natto.jpg",
                    imageAlt: "Natto image",
                    body: [
                        "Natto is a common Japanese breakfast food made from fermented soybeans.",
                        "Many Japanese people enjoy it, while many Americans may react strongly to its texture, smell, or appearance. Both reactions are shaped by cultural expectations about food."
                    ]
                }
            ]
        },

        {
            id: "culture-perspective",
            type: "reflection",
            title: "Whose Perspective Is Correct?",
            moduleLabel: "Understanding Culture",
            body: [
                "It is often a matter of perspective.",
                "Different cultures can interpret the same situation differently. Understanding perspective helps reduce misunderstanding."
            ],
            prompt: "What should you do when you encounter a cultural perspective you do not understand?",
            storageKey: "culturePerspectiveReflection",
            rationale: `There may not be one simple answer. Aspects of your culture may seem confusing or strange to someone from another culture, just as aspects of another culture may initially seem confusing or strange to you. Your perspective makes sense within the cultural experiences that helped shape it, but someone else's perspective may make sense within theirs.

When you encounter a very different cultural perspective, take a moment before judging it. Consider how some of your own cultural practices might appear to someone unfamiliar with them. You do not have to agree with every perspective, but trying to understand the context behind it can help you respond more thoughtfully.`,
            learningObjectives: ["LO1", "LO3"],
            competencies: ["IC1", "IC3"],
            placeholder: "Write your thoughts here..."
        },

        {
            id: "culture-definition-revisited",
            type: "reflection",
            title: "Revisiting Your Definition of Culture",
            moduleLabel: "Understanding Culture",
            body: [
                "At the beginning of this module, you wrote your own definition of culture. Throughout this module, you explored visible and invisible aspects of culture, examined culture as the lens through which we interpret the world, and considered how people may view the same situation differently. Before moving on, take a few minutes to reflect on how your understanding has changed."
            ],
            reviewResponse: {
                title: "Your Original Definition",
                storageKey: "cultureDefinition",
                emptyMessage: "No original definition has been saved."
            },
            rationale: cultureDefinitionReflectionRationale,
            learningObjectives: ["LO1", "LO4"],
            competencies: ["IC6", "IC7", "IC8"],
            prompts: [
                {
                    label: "Reflection",
                    prompt: "How has your understanding of culture changed after completing this module? Was there anything about culture that you had not previously considered? Explain how your thinking has changed.",
                    storageKey: "cultureReflectionGrowth",
                    reflectionTitle: "How My Understanding Changed",
                    rationale: cultureDefinitionReflectionRationale,
                    learningObjectives: ["LO1", "LO4"],
                    competencies: ["IC6", "IC7", "IC8"],
                    placeholder: "Write your reflection here..."
                },
                {
                    label: "Your Current Definition of Culture",
                    prompt: "Using what you have learned in this module, would you like to update your definition of culture?.",
                    storageKey: "currentCultureDefinition",
                    reflectionTitle: "My Revised Definition",
                    rationale: cultureDefinitionReflectionRationale,
                    learningObjectives: ["LO1", "LO4"],
                    competencies: ["IC6", "IC7", "IC8"],
                    placeholder: "Write your current definition here..."
                }
            ],
            comparison: {
                title: "Compare Your Definitions",
                items: [
                    {
                        title: "Your Original Definition",
                        storageKey: "cultureDefinition",
                        emptyMessage: "No original definition has been saved."
                    },
                    {
                        title: "Your Current Definition",
                        storageKey: "currentCultureDefinition",
                        emptyMessage: "No current definition has been saved."
                    }
                ]
            }
        },

        {
            id: "culture-complete",
            type: "moduleComplete",
            title: "Great job!",
            moduleLabel: "Module Complete",
            moduleKey: "culture",
            completedModuleTitle: "Understanding Culture",
            summary: [
                "Culture includes visible and hidden elements.",
                "Culture changes across generations, contexts, and groups.",
                "Culture shapes how people interpret the world.",
                "Different perspectives can exist at the same time."
            ],
            nextModuleKey: "stereotypes"
        }
    ]
};
