// ======================================
// Module 4: Critical Reflection / DAEA
// modules/daea.js
// ======================================
//
// Purpose:
// This file contains ONLY the instructional content for Module 4.
// It does not control layout, navigation, storage, or styling.
//
// This module introduces critical reflection and the DAEA framework:
// Describe, Analyze, Evaluate, Apply.
//
// Future improvement:
// The DAEA practice activity should become a custom imageReveal activity
// where learners respond to a partial image, compare examples,
// then reveal the full image.
// ======================================

export const daeaModule = {
    key: "daea",
    title: "Critical Reflection / DAEA",
    description: "Practice Describe, Analyze, Evaluate, and Apply.",
    image: "images/daea/reflection.png",

    lessons: [
        {
            id: "daea-intro",
            type: "moduleIntro",
            title: "Critical Reflection and DAEA",
            moduleLabel: "Module 4",
            body: [
                "This module introduces critical reflection and the DAEA framework.",
                "DAEA stands for Describe, Analyze, Evaluate, and Apply. It is a tool for slowing down your reactions, examining what happened, and creating a plan for future action."
            ],
            buttonText: "Begin Module 4"
        },

        {
            id: "reflection-initial",
            type: "reflection",
            title: "What is Reflection?",
            moduleLabel: "Critical Reflection / DAEA",
            body: [
                "Before looking at a formal definition, take a moment to think about what reflection means to you."
            ],
            prompt: "What does reflection mean to you?",
            storageKey: "reflectionDefinition",
            rationale: "This reflection captures learners' initial understanding of reflection before the DAEA framework is introduced.",
            learningObjectives: ["LO4"],
            competencies: ["IC4"],
            placeholder: "Write your response here..."
        },

        {
            id: "reflection-definition",
            type: "contentImage",
            title: "What is Reflection?",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/reflection.png",
            imageAlt: "A mountain reflected in a lake",
            body: [
                "Reflection is how you learn from previous actions, mistakes, achievements, and experiences.",
                "Everyone reflects from time to time. The most successful learners reflect with a goal in mind.",
                "Critical reflection is reflection with the intent of understanding what happened and creating a plan for future action."
            ],
            note: "In this course, reflection is not just thinking about the past. It is thinking about the past in order to act more effectively in the future."
        },

        {
            id: "daea-overview",
            type: "accordion",
            title: "The DAEA Framework",
            moduleLabel: "Critical Reflection / DAEA",
            intro: "Click each part of DAEA to understand what it means.",
            items: [
                {
                    title: "Describe",
                    body: [
                        "Describe the events clinically without emotion, judgment, or interpretation.",
                        "What happened? What did you see? What did people say?",
                        "If you are unsure and need to guess, that belongs in Analyze, not Describe."
                    ]
                },
                {
                    title: "Analyze",
                    body: [
                        "Analyze possible meanings or explanations.",
                        "If there was anything you were not sure enough about to include in the description, put it here.",
                        "This is where interpretation begins."
                    ]
                },
                {
                    title: "Evaluate",
                    body: [
                        "Evaluate your feelings, reactions, and judgments.",
                        "How did you feel? What did you think? What seemed good, bad, confusing, uncomfortable, or surprising?",
                        "This is where you name your emotional and evaluative response."
                    ]
                },
                {
                    title: "Apply",
                    body: [
                        "Apply what you learned to future action.",
                        "What can you do next? What information do you need? What would you do differently in a similar situation?",
                        "Reflection becomes useful when it informs future action."
                    ]
                }
            ]
        },

        {
            id: "daea-boundaries",
            type: "contentImage",
            title: "Keep the Sections Separate",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/daea-framework.png",
            imageAlt: "DAEA framework visual",
            body: [
                "When using DAEA, be careful not to mix the sections.",
                "Many people jump quickly from Describe to Evaluate. They see something, immediately decide what it means, and then react emotionally.",
                "DAEA helps slow that process down."
            ],
            prompts: [
                "What is the difference between something you saw and something you interpreted?",
                "Why might separating observation from judgment be useful?"
            ]
        },

        {
            id: "daea-describe-practice",
            type: "reflectionImage",
            title: "Practice: Describe",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/partial-image.png",
            imageAlt: "Partial image for DAEA practice",
            body: [
                "Look at the image. Describe what you see.",
                "Do not include emotion, judgment, or interpretation. If you are unsure what something is, that may belong in Analyze."
            ],
            prompt: "Describe what you see. Full sentences are not required.",
            storageKey: "daeaDescribeResponse",
            rationale: "This reflection gives learners practice separating observation from interpretation.",
            learningObjectives: ["LO4"],
            competencies: ["IC4"],
            placeholder: "Example: woman, hands near face, dark sky..."
        },

        {
            id: "daea-describe-example",
            type: "twoColumn",
            title: "Describe: Example Response",
            moduleLabel: "Critical Reflection / DAEA",
            leftTitle: "Your Task",
            leftItems: [
                "Focus only on what is visible.",
                "Avoid emotion.",
                "Avoid judgment.",
                "Avoid guessing."
            ],
            rightTitle: "Example Description",
            rightItems: [
                "Woman",
                "Holding hands in front of face",
                "Silhouettes of people behind her",
                "Dark sky",
                "Clouds or smoke",
                "Lights on",
                "City in background",
                "Grey sweatshirt"
            ],
            note: "Your answer may be different. The key is whether you separated description from interpretation."
        },

        {
            id: "daea-analyze-practice",
            type: "reflectionImage",
            title: "Practice: Analyze",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/partial-image.png",
            imageAlt: "Partial image for DAEA practice",
            body: [
                "Now analyze what you see.",
                "This is where interpretation begins. What might be happening? What are possible explanations?"
            ],
            prompt: "Analyze what you see. What are some possible interpretations?",
            storageKey: "daeaAnalyzeResponse",
            rationale: "This reflection helps learners generate possible explanations without treating their first interpretation as certain.",
            learningObjectives: ["LO3", "LO4"],
            competencies: ["IC3", "IC4"],
            placeholder: "Write your analysis here..."
        },

        {
            id: "daea-analyze-example",
            type: "twoColumn",
            title: "Analyze: Example Response",
            moduleLabel: "Critical Reflection / DAEA",
            leftTitle: "Your Task",
            leftItems: [
                "Interpret possible meanings.",
                "Include uncertainty.",
                "Think of multiple explanations.",
                "Do not jump to one conclusion too quickly."
            ],
            rightTitle: "Example Analysis",
            rightItems: [
                "Night",
                "Smoke",
                "Woman may be crying",
                "Hair looks messy",
                "Fall or winter",
                "Waterfront"
            ],
            note: "Analysis is not certainty. It is where you explore possible meanings."
        },

        {
            id: "daea-evaluate-practice",
            type: "reflectionImage",
            title: "Practice: Evaluate",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/partial-image.png",
            imageAlt: "Partial image for DAEA practice",
            body: [
                "Now evaluate your reaction.",
                "How do you feel? What emotions, judgments, or concerns does the image bring up?"
            ],
            prompt: "Evaluate your reaction to the image.",
            storageKey: "daeaEvaluateResponse",
            rationale: "This reflection asks learners to notice feelings and judgments so those reactions do not control the whole interpretation.",
            learningObjectives: ["LO4"],
            competencies: ["IC4"],
            placeholder: "Write your evaluation here..."
        },

        {
            id: "daea-evaluate-example",
            type: "twoColumn",
            title: "Evaluate: Example Response",
            moduleLabel: "Critical Reflection / DAEA",
            leftTitle: "Your Task",
            leftItems: [
                "Name feelings.",
                "Name judgments.",
                "Notice emotional reactions.",
                "Separate your reaction from what you actually know."
            ],
            rightTitle: "Example Evaluation",
            rightItems: [
                "Sad",
                "Scared",
                "Surprised",
                "Crime",
                "Criminals",
                "Fires",
                "Violence"
            ],
            note: "Evaluation is important, but it should not control the entire reflection."
        },

        {
            id: "daea-compare",
            type: "accordion",
            title: "Compare Your Reactions",
            moduleLabel: "Critical Reflection / DAEA",
            intro: "Compare your responses with the example responses. Your answers may be similar, different, or the same—and that's expected. Different people notice, analyze, and evaluate the same situation in different ways based on their experiences, perspectives, and cultural backgrounds. Like we said in the culture lesson, culture is the lens through which we see the world, your reactions may be different from mine. The goal is not to find the 'correct' answer, but to become more aware of how we interpret what we see.",
            items: [
                {
                    title: "Describe",
                    storageKey: "daeaDescribeResponse",
                    exampleResponse: [
                        "Woman",
                        "Holding hands in front of face",
                        "Silhouettes of people behind her",
                        "Dark sky",
                        "Clouds or smoke",
                        "Lights on",
                        "City in background",
                        "Grey sweatshirt"
                    ]
                },
                {
                    title: "Analyze",
                    storageKey: "daeaAnalyzeResponse",
                    exampleResponse: [
                        "Night",
                        "Smoke",
                        "Woman may be crying",
                        "Hair looks messy",
                        "Fall or winter",
                        "Waterfront"
                    ]
                },
                {
                    title: "Evaluate",
                    storageKey: "daeaEvaluateResponse",
                    exampleResponse: [
                        "Sad",
                        "Scared",
                        "Surprised",
                        "Crime",
                        "Criminals",
                        "Fires",
                        "Violence"
                    ]
                }
            ]
        },

        {
            id: "daea-whole-picture",
            type: "contentImage",
            title: "The Whole Picture",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/full-image.png",
            imageAlt: "Full image reveal for DAEA practice",
            body: [
                "DAE is useful because you do not always have the whole picture.",
                "What first looked scary or concerning may actually be a happy moment.",
                "More context can completely change your interpretation."
            ],
            note: "This is why it is important to pause, gather more information, and separate description, analysis, and evaluation."
        },

        {
            id: "daea-apply-intro",
            type: "contentImage",
            title: "The Next Step: Apply",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/daea-framework.png",
            imageAlt: "DAEA framework visual",
            body: [
                "After using Describe, Analyze, and Evaluate, you can now make a plan.",
                "Ask yourself what went wrong, what went right, what information you still need, and what you can do next time.",
                "Reflection is only useful if it informs future action."
            ],
            prompts: [
                "What should you ask a cultural informant about?",
                "What can you do next time to improve the outcome?",
                "What information would help you understand the situation better?"
            ]
        },

        {
            id: "daea-apply-reflection",
            type: "reflection",
            title: "Apply",
            moduleLabel: "Critical Reflection / DAEA",
            body: [
                "Now apply what you learned from the image activity."
            ],
            prompt: "What can you learn from your first reaction to the photo? What was different after seeing the larger photo? What can you do about that?",
            storageKey: "daeaApplyResponse",
            rationale: "This reflection turns the DAEA process into a plan for future action after new context changes the learner's interpretation.",
            learningObjectives: ["LO4", "LO5"],
            competencies: ["IC4", "IC5"],
            placeholder: "Write your response here..."
        },

        {
            id: "daea-real-life-transition",
            type: "contentImage",
            title: "From Images to Real Life",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/real-life-reflection.png",
            imageAlt: "Person reflecting on a real-life situation",
            body: [
                "This example was only with an image. Real life is more complex.",
                "In an unfamiliar real-life situation, you may feel confused, uncomfortable, embarrassed, or flustered.",
                "The same process can help: step back, describe what happened, analyze possible meanings, evaluate your reaction, and apply what you learned."
            ],
            note: "The next module gives you a chance to apply this process to a real intercultural experience."
        },

        {
            id: "daea-when-use",
            type: "contentImage",
            title: "When Should You Use Critical Reflection?",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/reflection.png",
            imageAlt: "Reflection visual",
            body: [
                "Think back to the previous lessons on cultural perspectives, stereotypes, and tolerance of ambiguity.",
                "When you encounter a cultural perspective you do not understand, use critical reflection.",
                "When you notice a stereotype, use critical reflection.",
                "When you are in a situation outside your control and do not understand what is happening, use critical reflection.",
                "Critical reflection is a powerful tool with many applications."
            ]
        },

        {
            id: "daea-complete",
            type: "moduleComplete",
            title: "Great job!",
            moduleLabel: "Module Complete",
            moduleKey: "daea",
            completedModuleTitle: "Module 4: Critical Reflection / DAEA",
            summary: [
                "Critical reflection helps turn experience into learning.",
                "DAEA stands for Describe, Analyze, Evaluate, and Apply.",
                "Separating observation, interpretation, and evaluation helps reduce misunderstanding.",
                "Reflection becomes useful when it leads to future action."
            ],
            nextModuleKey: "prague"
        }
    ]
};
