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
            id: "stereotypes-scenario",
            type: "branchingScenario",
            title: "The New Colleague",
            moduleLabel: "Stereotypes",
            instructions: "Read the situation, then choose what you would think and do. Pick the answer closest to your honest first reaction.",
            learningObjectives: ["LO2"],
            competencies: ["IC2", "IC3"],

            scene: {
                body: [
                    "A new colleague, Ana, is joining your project team from one of your company's offices abroad.",
                    "Before the first meeting, a coworker leans over and says, “People from there are never on time. Plan around it.”",
                    "The meeting starts at 9:00. Ana arrives at 9:10."
                ]
            },

            decisions: [
                {
                    id: "conclusion",
                    prompt: "What do you conclude?",
                    options: [
                        {
                            id: "stereotype",
                            label: "“He was right. They really are always late.”",
                            tag: "Stereotype",
                            outcome: [
                                "One late arrival has become proof of a claim about a whole country.",
                                "This is how stereotypes get stronger. Once you expect something, you notice what fits and overlook what doesn't. If Ana is on time for the next five meetings, will you notice?"
                            ]
                        },
                        {
                            id: "judgment",
                            label: "“Ana is unreliable.”",
                            tag: "Judgment about a person",
                            outcome: [
                                "You have not blamed a whole group, but you have still gone further than the facts.",
                                "“Unreliable” is a conclusion about Ana's character, based on ten minutes of one morning. You do not yet know why she was late."
                            ]
                        },
                        {
                            id: "observation",
                            label: "“Ana was ten minutes late today. I don't know why.”",
                            tag: "Observation",
                            recommended: true,
                            outcome: [
                                "This is an observation. It describes one person, on one occasion, and it stops at what you actually saw.",
                                "It also leaves a question open, and an open question is something you can go and answer."
                            ]
                        }
                    ]
                },
                {
                    id: "action",
                    body: [
                        "Over the next two weeks, Ana arrives a few minutes late to the same Monday meeting twice more."
                    ],
                    prompt: "What do you do?",
                    options: [
                        {
                            id: "workaround",
                            label: "Tell Ana the meeting starts at 8:45, so that she arrives by 9:00.",
                            tag: "Acting on the assumption",
                            outcome: [
                                "Ana arrives at 8:45 and waits alone for fifteen minutes. Later she sees the real time on the shared calendar.",
                                "She realizes you expected her to be late, and she can guess why. She says nothing, but she is more guarded with you afterward.",
                                "You solved a problem you had not understood, and it cost you her trust."
                            ]
                        },
                        {
                            id: "avoid",
                            label: "Say nothing, but stop giving her tasks with tight deadlines.",
                            tag: "Avoiding the question",
                            outcome: [
                                "Ana notices that the urgent, interesting work is going to other people. Nobody tells her why.",
                                "She keeps arriving late to the Monday meeting, because the cause has not changed. You never find out what it is.",
                                "The assumption was never tested, so it quietly became a decision about what she is trusted with."
                            ]
                        },
                        {
                            id: "ask",
                            label: "Mention it to her privately and ask whether the meeting time works for her.",
                            tag: "Checking the assumption",
                            recommended: true,
                            outcome: [
                                "Ana looks relieved. Her team's weekly call with another office ends at 9:00, and it nearly always runs over. She had not wanted to ask for a change in her first month.",
                                "You move the meeting to 9:15. She is on time from then on.",
                                "One question replaced a guess with a fact."
                            ]
                        }
                    ]
                }
            ],

            debrief: {
                title: "What the scenario shows",
                body: [
                    "Your coworker's comment did not describe Ana. It described what he expected, and it shaped what you were ready to see.",
                    "An observation is not the same as having no opinion. “Ana was late today, and I don't know why” is accurate, and it points to the next step: find out."
                ],
                takeaways: [
                    "A stereotype turns one event into proof about a group.",
                    "A judgment turns one event into a claim about a person's character.",
                    "An observation stays with what you saw and leaves room for more information.",
                    "Acting on an untested assumption can do harm, even with good intentions."
                ]
            }
        },

        {
            id: "stereotypes-assumption-check",
            type: "reflection",
            title: "Checking an Assumption",
            moduleLabel: "Stereotypes",
            body: [
                "In the scenario, one late arrival could become a stereotype, a judgment, or an observation. Now apply the same idea to your own experience."
            ],
            scenarioRecap: "stereotypes-scenario",
            prompt: "Think of a time you drew a quick conclusion about someone that turned out to be incomplete. What had you assumed? How could you have described what you saw as an observation instead?",
            storageKey: "stereotypesAssumptionCheckReflection",
            required: true,
            rationale: "Recognizing a stereotype in a story is easier than catching one of your own conclusions. Looking back at a real example, and restating it as what you actually saw, makes it more likely that you will pause and look for more information the next time.",
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
                "A better response is to describe what you actually observed, check your assumption, and update your understanding."
            ],
            nextModuleKey: "ambiguity"
        }
    ]
};
