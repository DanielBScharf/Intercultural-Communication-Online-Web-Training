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

export const daeaExamples = {
    describe: {
        title: "Describe",
        description:
            "Describe only what you can directly observe. Avoid explaining what is happening or assigning meaning to what you see.",
        examples: [
            "The woman has one hand near her face.",
            "Her other hand is extended outward.",
            "Two men are standing in the background.",
            "There is smoke or haze in the background.",
            "There is orange light behind the people.",
            "Buildings and lights are visible in the distance.",
            "The ground appears wet."
        ]
    },

    analyze: {
        title: "Analyze",
        description:
            "Consider possible explanations for what you observed. These are interpretations, so more than one explanation may be possible.",
        examples: [
            "The woman may be crying.",
            "The smoke and orange light may be coming from a fire.",
            "Late fall or early spring.",
            "Nighttime or evening.",
            "The people may be near a waterfront or public gathering."
        ]
    },

    evaluate: {
        title: "Evaluate",
        description:
            "Notice your emotional reactions and judgments about the situation. These reactions may influence how you interpret what you see.",
        examples: [
            "The situation looks frightening.",
            "I feel concerned for the woman.",
            "The men in the background are ignoring her.",
            "The scene looks dangerous.",
            "Violence or crime?",
            "I would be worried that someone might be hurt.",
            "I feel uncertain about what is happening."
        ]
    }
};

export const daeaModule = {
    key: "daea",
    title: "Critical Reflection / DAEA",
    description: "Practice Describe, Analyze, Evaluate, and Apply.",
    image: "images/daea/critical_reflection.png",

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
            image: "images/daea/critical_reflection.png",
            imageAlt: "A learner using critical reflection to examine an experience",
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
            required: true,
            showPurposeDisclosure: false,
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
            image: "images/daea/reflection.jpg",
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
                    image: "images/daea/describe.png",
                    imageAlt: "Describe step of the DAEA framework",
                    body: [
                        "Describe the events clinically without emotion, judgment, or interpretation.",
                        "What happened? What did you see? What did people say?",
                        "If you are unsure and need to guess, that belongs in Analyze, not Describe."
                    ]
                },
                {
                    title: "Analyze",
                    image: "images/daea/analyze.png",
                    imageAlt: "Analyze step of the DAEA framework",
                    body: [
                        "Analyze possible meanings or explanations.",
                        "If there was anything you were not sure enough about to include in the description, put it here.",
                        "This is where interpretation begins."
                    ]
                },
                {
                    title: "Evaluate",
                    image: "images/daea/evaluate.png",
                    imageAlt: "Evaluate step of the DAEA framework",
                    body: [
                        "Evaluate your feelings, reactions, and judgments.",
                        "How did you feel? What did you think? What seemed good, bad, confusing, uncomfortable, or surprising?",
                        "This is where you name your emotional and evaluative response."
                    ]
                },
                {
                    title: "Apply",
                    image: "images/daea/apply.png",
                    imageAlt: "Apply step of the DAEA framework",
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
            image: "images/daea/separate.png",
            imageAlt: "Visual showing why the DAEA steps should remain separate",
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
            image: "images/daea/cropped.png",
            imageAlt: "A woman wearing a coat and scarf stands near a railing with one hand near her mouth and the other extended; several people, city buildings, bright orange light, and haze are visible behind her.",
            body: [
                "Look at the image. Describe what you see.",
                "Do not include emotion, judgment, or interpretation. If you are unsure what something is, that may belong in Analyze."
            ],
            prompt: "Describe what you see. Full sentences are not required.",
            storageKey: "daeaDescribeResponse",
            required: true,
            rationale: "Before interpreting a situation, take time to identify what you can actually observe. Try to separate what you clearly see or hear from assumptions about what those observations mean. Your interpretations and judgments can come later. This is especially important in situations that make you anxious, uncomfortable, or emotional, because those reactions can make assumptions feel like facts.",
            learningObjectives: ["LO4"],
            competencies: ["IC4"],
            placeholder: "Example: woman, tears near face, second woman holding..."
        },

        {
            id: "daea-describe-example",
            type: "twoColumn",
            title: `${daeaExamples.describe.title} Sample Responses`,
            moduleLabel: "Critical Reflection / DAEA",
            leftTitle: "Your Task",
            leftItems: [
                "Focus only on what is visible.",
                "Avoid emotion.",
                "Avoid judgment.",
                "Avoid guessing."
            ],
            rightTitle: "Sample Responses",
            rightDescription: daeaExamples.describe.description,
            rightItems: daeaExamples.describe.examples,
            note: "Your answer may be different. The key is whether you separated description from interpretation."
        },

        {
            id: "daea-analyze-practice",
            type: "reflectionImage",
            title: "Practice: Analyze",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/cropped.png",
            imageAlt: "A woman wearing a coat and scarf stands near a railing with one hand near her mouth and the other extended; several people, city buildings, bright orange light, and haze are visible behind her.",
            body: [
                "Now analyze what you see.",
                "This is where interpretation begins. What might be happening? What are possible explanations?"
            ],
            prompt: "Analyze what you see. What are some possible interpretations?",
            storageKey: "daeaAnalyzeResponse",
            required: true,
            rationale: "Now you can begin interpreting what you observed. What might be happening? Who might the people be? What are some possible explanations for their behavior? Try to consider more than one interpretation when the available information allows it. Your goal is not necessarily to find the correct explanation yet, but to recognize what the available evidence could mean.",
            learningObjectives: ["LO3", "LO4"],
            competencies: ["IC3", "IC4"],
            placeholder: "Write your analysis here..."
        },

        {
            id: "daea-analyze-example",
            type: "twoColumn",
            title: `${daeaExamples.analyze.title} Sample Responses`,
            moduleLabel: "Critical Reflection / DAEA",
            leftTitle: "Your Task",
            leftItems: [
                "Interpret possible meanings.",
                "Include uncertainty.",
                "Think of multiple explanations.",
                "Do not jump to one conclusion too quickly."
            ],
            rightTitle: "Sample Responses",
            rightDescription: daeaExamples.analyze.description,
            rightItems: daeaExamples.analyze.examples,
            note: "Analysis is not certainty. It is where you explore possible meanings."
        },

        {
            id: "daea-evaluate-practice",
            type: "reflectionImage",
            title: "Practice: Evaluate",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/cropped.png",
            imageAlt: "A woman wearing a coat and scarf stands near a railing with one hand near her mouth and the other extended; several people, city buildings, bright orange light, and haze are visible behind her.",
            body: [
                "Now evaluate your reaction.",
                "How do you feel? What emotions, judgments, or concerns does the image bring up?"
            ],
            prompt: "Evaluate your reaction to the image.",
            storageKey: "daeaEvaluateResponse",
            required: true,
            rationale: "Now pay attention to your emotional reactions and judgments. How does the situation make you feel? What seems good, bad, threatening, strange, appropriate, or inappropriate to you? Separating these reactions from your observations and interpretations can help you recognize when emotion or prior expectations are influencing how you understand a situation.",
            learningObjectives: ["LO4"],
            competencies: ["IC4"],
            placeholder: "Write your evaluation here..."
        },

        {
            id: "daea-evaluate-example",
            type: "twoColumn",
            title: `${daeaExamples.evaluate.title} Sample Responses`,
            moduleLabel: "Critical Reflection / DAEA",
            leftTitle: "Your Task",
            leftItems: [
                "Name feelings.",
                "Name judgments.",
                "Notice emotional reactions.",
                "Separate your reaction from what you actually know."
            ],
            rightTitle: "Sample Responses",
            rightDescription: daeaExamples.evaluate.description,
            rightItems: daeaExamples.evaluate.examples,
            note: "Evaluation is important, but it should not control the entire reflection."
        },

        {
            id: "daea-compare",
            type: "accordion",
            title: "Compare Your Reactions",
            moduleLabel: "Critical Reflection / DAEA",
            intro: "Compare your responses with the example responses. Your answers may be similar, different, or the same—and that's expected. Different people notice, analyze, and evaluate the same situation in different ways based on their experiences, perspectives, and cultural backgrounds. Like we said in the culture lesson, culture is the lens through which we see the world. Your reactions may be different from mine. The goal is not to find the 'correct' answer, but to become more aware of how we interpret what we see.",
            items: [
                {
                    title: daeaExamples.describe.title,
                    description: daeaExamples.describe.description,
                    storageKey: "daeaDescribeResponse",
                    exampleResponse: daeaExamples.describe.examples
                },
                {
                    title: daeaExamples.analyze.title,
                    description: daeaExamples.analyze.description,
                    storageKey: "daeaAnalyzeResponse",
                    exampleResponse: daeaExamples.analyze.examples
                },
                {
                    title: daeaExamples.evaluate.title,
                    description: daeaExamples.evaluate.description,
                    storageKey: "daeaEvaluateResponse",
                    exampleResponse: daeaExamples.evaluate.examples
                }
            ]
        },

        {
            id: "daea-whole-picture",
            type: "contentImage",
            title: "The Whole Picture",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/full.png",
            imageAlt: "A man kneels in front of a woman and holds an open ring box during a waterfront marriage proposal, while fireworks light the sky beyond the city skyline and onlookers stand nearby.",
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
            image: "images/daea/apply.png",
            imageAlt: "Apply step of the DAEA framework",
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
            required: true,
            rationale: `When you first analyzed the photo, you had only limited information about what was happening. You may have formed assumptions that changed when you saw the larger image. By separating your observations, interpretations, and emotional evaluations, you can begin to identify what information is still missing and which parts of your understanding are assumptions rather than facts.

This is also practice in tolerance of ambiguity. You did not initially know what was happening, but you could still examine the situation without immediately committing to one explanation. When more information became available, you could update your interpretation. In an intercultural experience, the full context may also be very different from your first assumptions.`,
            learningObjectives: ["LO4", "LO5"],
            competencies: ["IC4", "IC5"],
            placeholder: "Write your response here..."
        },

        {
            id: "daea-real-life-transition",
            type: "contentImage",
            title: "From Images to Real Life",
            moduleLabel: "Critical Reflection / DAEA",
            image: "images/daea/using_apply.png",
            imageAlt: "A person using reflection to decide what to do next",
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
            image: "images/daea/critical_reflection.png",
            imageAlt: "A learner critically reflecting on an intercultural experience",
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
