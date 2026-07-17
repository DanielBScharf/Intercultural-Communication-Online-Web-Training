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
export const cultureModule = {
    key: "culture",
    title: "Understanding Culture",
    description: "This module provides a definition of culture and explains why culture is important.",
    image: "images/culture/culture-intro.png",

    lessons: [
        {
            id: "culture-intro",
            type: "moduleIntro",
            title: "Understanding Culture",
            moduleLabel: "Module 1",
            body: [
                "This module provides a definition of culture and explains why culture is important for understanding communication, behavior, and perspective."
            ],
            buttonText: "Begin Module 1"
        },

        {
            id: "culture-definition-reflection",
            type: "reflection",
            title: "What is Culture?",
            moduleLabel: "Understanding Culture",
            prompt: "Write your definition of culture below.",
            storageKey: "cultureDefinition",
            rationale: "This opening reflection surfaces learners' starting ideas about culture before the workshop introduces a shared definition.",
            learningObjectives: ["LO1"],
            placeholder: "Write your definition here..."
        },

        {
            id: "culture-definition-explanation",
            type: "contentImage",
            title: "What is Culture?",
            moduleLabel: "Understanding Culture",
            image: "images/culture/intercultural-image.png",
            imageAlt: "General intercultural communication image",
            body: [
                "Culture is the shared beliefs, ideas, customs, behaviors, arts, languages, patterns of thought, means of expression, identities, preferences, and other practices shared, learned, and practiced by a group of people."
            ],
            prompts: [
                "What is the same or different from your definition?",
                "Why are they different?",
                "Is defining culture easy?"
            ]
        },

        {
            id: "culture-shared",
            type: "contentImage",
            title: "Culture is Shared",
            moduleLabel: "Understanding Culture",
            image: "images/culture/subcultures.png",
            imageAlt: "Mosaic of different subcultures within one culture",
            body: [
                "Culture is shared among groups of people, but it is not always the same for everyone in a society.",
                "Think about the following questions:"
            ],
            prompts: [
                "Did your grandparents behave differently from you?",
                "Do elderly people and children in your area believe or act the same as you?",
                "Do people from the city behave the same as people from rural areas?",
                "Do you act the same regardless of where you are or the context you are in?"
            ]
        },

        {
            id: "culture-iceberg-intro",
            type: "contentImage",
            title: "Culture is Like an Iceberg",
            moduleLabel: "Understanding Culture",
            image: "images/iceberg/iceberg.png",
            imageAlt: "Culture iceberg graphic",
            body: [
                "Culture is often described like an iceberg.",
                "You can easily see what is above the surface, but there is a lot more hidden below that is harder to see.",
                "In essence, what is above the water is what you see; what is below the water is why."
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
            image: "images/iceberg/iceberg.png",
            imageAlt: "Culture iceberg graphic",
            prompt: "What are some visible and hidden aspects of your culture?",
            storageKey: "cultureIcebergReflection",
            rationale: "This reflection helps learners apply the culture iceberg model to their own visible and hidden cultural influences.",
            learningObjectives: ["LO1"],
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
            image: "images/culture/culture-lens.png",
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
                    image: "images/culture/german-beer.png",
                    imageAlt: "German beer culture image",
                    body: [
                        "When I moved to Germany, it was strange to me that colleagues and adult students might drink beer during lunch or bring beer to class for a birthday.",
                        "From one cultural perspective, this might feel unusual. From another, it may be normal social behavior."
                    ]
                },
                {
                    title: "Japanese Bathhouse",
                    image: "images/culture/japanese-bathhouse.png",
                    imageAlt: "Japanese bathhouse image",
                    body: [
                        "In Japan, it can be common to use shared bathing spaces, especially in certain hotels, inns, or public baths.",
                        "To someone from a culture where private showers are expected, this may feel uncomfortable at first. To others, it may feel relaxing, ordinary, and communal."
                    ]
                },
                {
                    title: "Natto",
                    image: "images/culture/natto.png",
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
            title: "Whose Perspective is Correct?",
            moduleLabel: "Understanding Culture",
            body: [
                "It is often a matter of perspective.",
                "Different cultures can interpret the same situation differently. Understanding perspective helps reduce misunderstanding."
            ],
            prompt: "What should you do when you encounter a cultural perspective you do not understand?",
            storageKey: "culturePerspectiveReflection",
            rationale: "This reflection connects culture as perspective with the habit of pausing before judging unfamiliar viewpoints.",
            learningObjectives: ["LO1", "LO3"],
            placeholder: "Write your thoughts here..."
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
