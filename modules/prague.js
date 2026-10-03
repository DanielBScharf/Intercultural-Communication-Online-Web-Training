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
// type: "perspectiveFlip" shows one moment from two points of view.
// Its format is documented at the top of js/perspectiveFlip.js.
// type: "guidedActivity" creates a reusable slide-based activity.
// ======================================

const clerkGuessPrompt = "What might the clerk be thinking?";
const clerkGuessPlaceholder = "In a few words...";

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
                "This module gives you a chance to apply DAEA to a real intercultural experience.",
                "You will see one moment from two sides: first as the student lived it, then as the clerk may have seen it. Then you will apply the same steps to an experience of your own."
            ],
            image: "images/comic/prague-panel-1.png",
            imageAlt: "Student arriving at Prague's main railway station",
            buttonText: "Begin Module 5"
        },

        {
            id: "prague-arrival",
            type: "contentImage",
            title: "Arrival in Prague",
            moduleLabel: "Prague Example Practice",
            image: "images/comic/prague-panel-1.png",
            imageAlt: "An American student standing in Prague's main train station, holding a passport, a rail pass brochure, and Czech koruna",
            body: [
                "You are studying abroad at a one-month course (not a language course) in Prague with a small group of classmates. (Note, this incident occurred before live AI translation services were widely available.)",
                "In your first week, the instructors suggest that you buy a monthly rail pass to get around the city more cheaply and more easily.",
                "The only instructions you received were to bring the train brochure, the amount that the pass costs, and your passport. You were told that you can do it without speaking Czech: just point, and they will understand."
            ]
        },

        {
            id: "prague-perspectives",
            type: "perspectiveFlip",
            title: "Two Sides of the Counter",
            moduleLabel: "Prague Example Practice",
            instructions: "Look at each panel as the student saw it. Guess what the clerk is thinking, then flip to her side.",
            note: "The clerk's view is the most likely explanation, not a known fact. In real life, the author never found out what she was saying.",
            learningObjectives: ["LO3", "LO4"],
            competencies: ["IC1", "IC3", "IC4"],

            views: {
                first: "The student",
                second: "The clerk"
            },

            panels: [
                {
                    id: "asks",
                    image: "images/comic/prague-panel-2.png",
                    imageAlt: "Panel 2: He asks the woman at the ticket counter '(Sorry I don't understand Czech, do you speak English)' in Czech. He also says 'I'm trying to buy a monthly train pass'. The woman at the counter says 'no' (in Czech)",
                    first: {
                        thought: "She said no. No to what? I'm confused, and I'm starting to worry.",
                        feeling: "Confused, a little worried"
                    },
                    guess: {
                        prompt: clerkGuessPrompt,
                        placeholder: clerkGuessPlaceholder,
                        options: [
                            {
                                id: "foreigner",
                                label: "She doesn't want to deal with a foreigner.",
                                feedback: "That reads her “no” as being about him. Nothing in the panel shows that. All you can see is a raised hand and one word."
                            },
                            {
                                id: "no-english",
                                label: "She's saying she doesn't speak English.",
                                feedback: "Likely part of it. He had just asked whether she spoke English, and “no” is a direct answer to that question."
                            },
                            {
                                id: "wrong-window",
                                label: "She's saying this window can't help him.",
                                feedback: "Likely part of it. If this window did not sell monthly passes, “no” may have been the only way she had to say so."
                            }
                        ]
                    },
                    second: {
                        thought: "I don't speak English, and I don't think this is the window he needs. How do I tell him that?",
                        feeling: "Unsure how to explain"
                    }
                },
                {
                    id: "shouts",
                    image: "images/comic/prague-panel-3.png",
                    imageAlt: "Panel 3: The woman at the ticket counter is shouting at the American student in Czech: 'Ne! Tam! Tamhle! Přes chodbu! Ne tady!' She is pointing with her arms in different directions and has an angry look on her face. The student is thinking 'I have no idea what she is saying. Why is she angry and yelling at me?'",
                    first: {
                        thought: "I have no idea what she is saying. Why is she angry and yelling at me?",
                        feeling: "Alarmed, embarrassed"
                    },
                    guess: {
                        prompt: clerkGuessPrompt,
                        placeholder: clerkGuessPlaceholder,
                        options: [
                            {
                                id: "angry",
                                label: "She's angry that he doesn't speak Czech.",
                                feedback: "A raised voice often means anger, but not always. People also get louder when they are not being understood."
                            },
                            {
                                id: "go-away",
                                label: "She's telling him to go away.",
                                feedback: "Close in one sense. She does seem to be sending him somewhere else. The question is whether that is a dismissal or a direction."
                            },
                            {
                                id: "not-getting-it",
                                label: "She's trying to tell him something, and he isn't getting it.",
                                feedback: "This fits what can be seen: repeated words, a raised voice, and pointing in one direction."
                            }
                        ]
                    },
                    second: {
                        said: [
                            { original: "Ne!", meaning: "No!", lang: "cs" },
                            { original: "Tam!", meaning: "There!", lang: "cs" },
                            { original: "Tamhle!", meaning: "Over there!", lang: "cs" },
                            { original: "Přes chodbu!", meaning: "Across the hall!", lang: "cs" },
                            { original: "Ne tady!", meaning: "Not here!", lang: "cs" }
                        ],
                        thought: "He's at the wrong window. He doesn't understand me, so I'll say it louder and point.",
                        feeling: "Frustrated that she can't make him understand"
                    }
                },
                {
                    id: "leaves",
                    image: "images/comic/prague-panel-4.png",
                    imageAlt: "Panel 4: The student is walking away from the ticket counter with a depressed look on his face he is thinking 'Did I do something wrong? Was she angry because I'm foreign?'. The woman continues to shout at him in Czech in the background, 'Ne! Tam! Přes chodbu! Tamhle! Ne tady!', waving her arms and pointing in different directions.",
                    first: {
                        thought: "Did I do something wrong? Was she angry because I'm foreign?",
                        feeling: "Ashamed, unwelcome"
                    },
                    guess: {
                        prompt: clerkGuessPrompt,
                        placeholder: clerkGuessPlaceholder,
                        options: [
                            {
                                id: "glad",
                                label: "She's glad he's gone.",
                                feedback: "Possible, but look at what she is doing. She is still calling out and still pointing after he has turned away."
                            },
                            {
                                id: "still-angry",
                                label: "She's still angry with him.",
                                feedback: "It could look that way from where he stands. But someone who is only angry usually stops once the other person leaves."
                            },
                            {
                                id: "still-helping",
                                label: "She's still trying to send him to the right place.",
                                feedback: "This fits what can be seen. She keeps pointing the same way even though he is no longer looking."
                            }
                        ]
                    },
                    second: {
                        said: [
                            { original: "Ne tady!", meaning: "Not here!", lang: "cs" },
                            { original: "Přes chodbu!", meaning: "Across the hall!", lang: "cs" }
                        ],
                        thought: "He's leaving, and he still doesn't know where to go.",
                        feeling: "Worried he will not find it"
                    }
                }
            ],

            summary: {
                title: "Same moment, two views",
                intro: [
                    "Here are the first three steps of DAEA for the same moment, once for each person."
                ],
                rows: [
                    {
                        label: "Describe",
                        detail: "what happened",
                        first: "She raised her voice and pointed across the hall. He left without a pass.",
                        second: "She raised her voice and pointed across the hall. He left without a pass."
                    },
                    {
                        label: "Analyze",
                        detail: "what it meant",
                        first: "She is angry with me, maybe because I'm foreign.",
                        second: "He is at the wrong window and does not understand where to go."
                    },
                    {
                        label: "Evaluate",
                        detail: "how it felt",
                        first: "Embarrassed, unwelcome, and afraid to go back.",
                        second: "Frustrated that she could not make him understand."
                    }
                ],
                note: "The Describe row is the same for both of them. They agree on what happened. They differ on what it meant and how it felt."
            }
        },

        {
            id: "prague-guided-activity",
            type: "guidedActivity",
            title: "What Happened Next",
            moduleLabel: "Prague Example Practice",
            instructions: "See how the comic ends, then how the real story ended.",
            slides: [
                {
                    slideType: "comic",
                    title: "More Context Appears",
                    intro: "Now look at what happens next.",
                    panels: [
                        {
                            image: "images/comic/prague-panel-5.png",
                            alt: "Panel 5: The student is sitting in a cafe with two friends. There is narration text in the top right corner it says 'Afterward, I asked people what happened.' The student has a depressed look and is thinking to himself 'Maybe I misunderstood what she was saying?'",
                            label: "Panel 5"
                        },
                        {
                            image: "images/comic/prague-panel-6.png",
                            alt: "Panel 6: They are still in the cafe. The narration text says 'They explained what really happened'. The man on the student's right says 'You were at the wrong kiosk. She was trying to help you'. The woman at his left is saying 'She thought you were looking for the main hall. She didn't understand your question.'",
                            label: "Panel 6"
                        },
                        {
                            image: "images/comic/prague-panel-7.png",
                            alt: "Panel 7: At the train station again, the student is at a different kiosk. The narration text says 'I found the correct kiosk'. The student says 'A monthly pass please.' The woman at the kiosk says, in English, 'Hello how can I help you', 'Certainly just a moment', and 'Here you go.' The student is thinking 'That was so easy! And she speaks English with a British accent.'",
                            label: "Panel 7"
                        },
                        {
                            image: "images/comic/prague-panel-8.png",
                            alt: "Panel 8: The student is sitting in a train. The narration text says 'On the Prague metro, I thought about the experience.' The student is looking at Prague castle thinking 'The situation wasn't about attitude. It was a misunderstanding caused by language, location, and missing information. Reflection helped me see the full picture.'",
                            label: "Panel 8"
                        }
                    ]
                },
                {
                    slideType: "reveal",
                    title: "The Real Ending",
                    body: [
                        "This comic is based on something that happened to the author of this training. The real ending was less tidy.",
                        "The author never found out what the clerk was saying. He was probably at the wrong kiosk, but nobody explained it afterward. He bought his pass at a different station, because he was too afraid to go back to the same one.",
                        "This happened before he had studied any of what this workshop teaches. He walked away sure that she was angry with him. Looking back, the explanation in the comic is the most likely one: she was trying to help, and neither of them had the words.",
                        "Often you will not get the answer either. That is why it matters to hold a first interpretation loosely."
                    ],
                    image: "images/comic/prague-panel-8.png",
                    imageAlt: "The student sitting on the Prague metro, looking out at Prague Castle and thinking about what happened"
                },
                {
                    slideType: "reflection",
                    title: "DAEA Reflection",
                    body: [
                        "In the comic, the student was certain the clerk was angry with him. From her side of the counter, it probably looked very different.",
                        "Now apply the same steps to an experience of your own."
                    ],
                    prompt: "Think of a time someone seemed angry or rude to you and you never found out why. Describe what happened in a sentence or two. What might their view have been? What would you do differently now?",
                    storageKey: "pragueDaeaReflection",
                    required: true,
                    reflectionTitle: "Reconsidering the Situation",
                    rationale: `The Prague incident shows how emotional reactions can influence judgment when important information is missing. Looking back at the experience through DAEA makes it possible to separate what actually happened from the interpretations and emotions that developed in the moment.

Considering different perspectives and asking what information was missing can lead to a different understanding of the same experience. The goal is not to ignore an emotional reaction, but to recognize it as one part of the experience rather than treating it as evidence of what another person's behavior means.`,
                    learningObjectives: ["LO4", "LO5"],
                    competencies: ["IC4", "IC5"],
                    placeholder: "What happened: ...\nTheir possible view: ...\nWhat I would do now: ..."
                },
                {
                    slideType: "summary",
                    title: "Key Takeaways",
                    body: [
                        "Two people can agree on what happened and still disagree about what it meant.",
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
                "The same moment can look very different from the other side.",
                "DAEA helps separate observation, interpretation, evaluation, and future action.",
                "Curiosity and clarification can prevent intercultural misunderstandings."
            ],
            nextModuleKey: "incidents"
        }
    ]
};
