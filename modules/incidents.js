// ======================================
// Module 6: Critical Incidents
// modules/incidents.js
// ======================================
//
// Purpose:
// This file contains ONLY the instructional content for Module 6.
// It does not control layout, navigation, storage, or styling.
//
// Important:
// The "type" field tells renderer.js what layout/activity to use.
// type: "guidedActivity" creates a reusable slide-based activity.
// type: "branchingScenario" creates a multiple-choice scenario.
// Its format is documented at the top of js/branchingScenario.js.
// type: "signalTranscript" creates a mark-the-lines conversation activity.
// Its format is documented at the top of js/signalTranscript.js.
// ======================================

const criticalIncidentReflectionRationale = `Think back to the cultural iceberg. There may be deeper values, expectations, assumptions, or communication norms influencing this situation that are not immediately visible. You may not yet have enough information to understand why someone behaved the way they did.

Then consider tolerance of ambiguity. How can you respond when you do not have all of the information? Instead of immediately filling in the gaps yourself, consider what you could observe, ask, or investigate. Seeking information and remaining open to more than one explanation can help you navigate unfamiliar intercultural situations without assuming that your first interpretation is the only possible one.`;

export const incidentsModule = {
    key: "incidents",
    title: "Critical Incidents",
    description: "Practice intercultural reflection with realistic scenarios.",
    image: "images/menu/incidents.jpg",

    lessons: [
        {
            id: "incidents-intro",
            type: "moduleIntro",
            title: "Critical Incidents",
            moduleLabel: "Module 6",
            body: [
                "This module gives you practice with critical incidents: short intercultural situations where people may interpret the same moment in different ways.",
                "You will use culture as perspective, stereotypes, tolerance of ambiguity, and DAEA reflection to slow down before judging what happened."
            ],
            image: "images/daea/critical_reflection.png",
            imageAlt: "A learner critically examining an intercultural situation",
            buttonText: "Begin Module 6"
        },

        {
            id: "critical-incidents-explained",
            type: "contentImage",
            title: "What Are Critical Incidents?",
            moduleLabel: "Critical Incidents",
            image: "images/tolerance/navigating_uncertainty.jpg",
            imageAlt: "A person navigating an unfamiliar and uncertain situation",
            body: [
                "A critical incident is a moment when something feels confusing, uncomfortable, surprising, or difficult because expectations are not shared.",
                "The incident is not always dramatic. It may be a short conversation, a social expectation, a silence, a refusal, or a decision-making process that feels unfamiliar.",
                "Critical incidents are useful for learning because they reveal less visible cultural expectations. They also remind us that a first interpretation may be incomplete.",
                "In each scenario, describe what happened, analyze possible explanations, evaluate your reaction, and apply what you learned to future action."
            ],
            note: "As you work, try to avoid stereotypes. Treat each scenario as a chance to explore ambiguity before making a judgment."
        },

        {
            id: "incident-drinking-expectation",
            type: "branchingScenario",
            title: "A Work Dinner",
            moduleLabel: "Critical Incidents",
            instructions: "Read the situation and choose what you would do. After you see how your choices play out, you will be asked to explain what happened before you find out more.",
            learningObjectives: ["LO3"],
            competencies: ["IC2", "IC3"],

            // The tags hint at which choices worked, so they wait for the compare screen.
            showTagsAfterChoice: false,

            scene: {
                body: [
                    "You are visiting a partner organization in another country. After a long day of meetings, your hosts invite the group to dinner.",
                    "Every time your glass is empty, the colleague beside you fills it again. It is a work night, and everyone is due in the office in the morning. You have had enough."
                ]
            },

            decisions: [
                {
                    id: "moment",
                    prompt: "What do you do about the refills?",
                    options: [
                        {
                            id: "go-along",
                            label: "Keep drinking. You don't want to offend anyone.",
                            tag: "Going along",
                            outcome: [
                                "Your glass is refilled four more times over the next hour. You have now had far more than you wanted, and the refills show no sign of stopping."
                            ],
                            explanation: [
                                "You guessed that stopping would offend, and treated the guess as a fact. Each empty glass was also read as a request for more."
                            ]
                        },
                        {
                            id: "withdraw",
                            label: "Stop drinking and sit out the toasts.",
                            tag: "Withdrawing",
                            outcome: [
                                "The refills stop. Your colleague seems disappointed and talks to you less."
                            ],
                            explanation: [
                                "You kept your limit, but sitting out the toasts looked like stepping away from the group. You still did not know what the refills meant."
                            ]
                        },
                        {
                            id: "find-out",
                            label: "Hold off for a moment and watch what others at the table are doing.",
                            tag: "Finding out",
                            recommended: true,
                            outcome: [
                                "You notice that several people have full glasses they have barely touched. Whenever someone proposes a toast, everyone raises a glass, whatever is in it."
                            ],
                            explanation: [
                                "Watching cost you a minute and gave you evidence to work from, before you had to decide anything."
                            ]
                        }
                    ]
                },
                {
                    id: "toast",
                    body: [
                        "A little later, your host stands to toast the new partnership and turns toward you."
                    ],
                    prompt: "How do you respond to the toast?",
                    options: [
                        {
                            id: "finish",
                            label: "Finish your glass so you can join the toast properly.",
                            tag: "Giving up your limit",
                            outcome: [
                                "Your host is delighted and refills your glass at once. You are back where you started."
                            ],
                            explanation: [
                                "Understanding a custom does not mean you have to ignore your own needs. Here you could have taken part without drinking more."
                            ]
                        },
                        {
                            id: "own-norm",
                            label: "Explain that where you come from, people don't drink like this on a work night.",
                            tag: "Treating your own norm as the standard",
                            outcome: [
                                "People nod politely. Your host apologizes, and the table goes quiet for a while."
                            ],
                            explanation: [
                                "You protected your limit by making their custom the problem. A difference between two norms became a judgment of one of them."
                            ]
                        },
                        {
                            id: "join",
                            label: "Raise your glass with everyone, take a small sip or toast with tea, and thank your host for the evening.",
                            tag: "Joining in and keeping your limit",
                            recommended: true,
                            outcome: [
                                "Your host beams and the evening carries on. Nobody checks how much you drank."
                            ],
                            explanation: [
                                "Taking part was the point. You did that without giving up your limit or making anyone wrong."
                            ]
                        }
                    ]
                }
            ],

            question: {
                prompt: "Why do you think the evening went the way it did? Try to give at least two possible explanations.",
                storageKey: "incidentDrinkingInitialReflection",
                reflectionTitle: "Possible Explanations",
                rationale: "Explaining a situation before you are told the answer shows you how many readings are possible, and how much you would still need to find out.",
                learningObjectives: ["LO3"],
                competencies: ["IC2", "IC3"],
                placeholder: "One explanation: ...\nAnother explanation: ..."
            },

            debrief: {
                title: "Another perspective",
                body: [
                    "On the way out, Priya, a colleague from your own office who has worked with this team for two years, explains the custom. Here, an empty glass is an invitation to pour. If you have had enough, you leave it full. What matters most is joining the toasts.",
                    "Shared drinking is a common form of team building in many workplaces, including in China, South Korea, and Japan. Customs still differ between companies, and between people.",
                    "Your own limit matters too. Cultural understanding does not require you to ignore your health, religion, recovery, or values. The same approach works if you do not drink at all.",
                    "The tension in this incident comes from different expectations about hospitality, taking part, and how directly a refusal is stated."
                ],
                takeaways: [
                    "When you don't know what a behavior means, find out before you act on a guess.",
                    "Going along and withdrawing both leave the question unanswered.",
                    "You can respect a custom and keep your own limit.",
                    "Describing your own norm as the correct one turns a difference into a judgment."
                ]
            }
        },
        {
            id: "incident-drinking-reflection",
            type: "reflection",
            title: "After the Dinner",
            moduleLabel: "Critical Incidents",
            body: [
                "The scenario took you through the first steps of DAEA. You saw what happened and analyzed possible explanations. Now finish with Evaluate and Apply."
            ],
            scenarioRecap: "incident-drinking-expectation",
            prompt: "Look at the choices you made. Evaluate your own reaction to the pressure to keep drinking. What would you say or do at a similar dinner in the future?",
            storageKey: "incidentDrinkingDaeaReflection",
            required: true,
            reflectionTitle: "Reconsidering the Situation",
            rationale: criticalIncidentReflectionRationale,
            learningObjectives: ["LO4", "LO5"],
            competencies: ["IC4", "IC5"],
            placeholder: "Evaluate: ...\nApply: ..."
        },
        {
            id: "incident-negotiation-indirect",
            type: "twoColumn",
            title: "Saying No Without Saying No",
            moduleLabel: "Critical Incidents",
            body: [
                "Before the next incident, think about how you turn people down. Most of us do not always say “no” outright. We soften it, and we expect the other person to understand.",
                "You probably use phrases like the ones below, and know what they usually mean."
            ],
            leftTitle: "What is said",
            leftItems: [
                "“Let's get coffee sometime.”",
                "“I'll think about it.”",
                "“That's an interesting idea.”",
                "“I'd love to, but this month is really busy.”"
            ],
            rightTitle: "What it can mean",
            rightItems: [
                "I am being friendly. I am not making a plan.",
                "Probably not.",
                "I am not convinced.",
                "No."
            ],
            note: "How much of a message is put into words, and how much is left for the listener to work out, differs between people, workplaces, and cultures. So does the cost of refusing someone in front of others. Keep both in mind in the next meeting."
        },

        {
            id: "incident-negotiation-misunderstanding",
            type: "signalTranscript",
            title: "Where Was the No?",
            moduleLabel: "Critical Incidents",
            instructions: "Read the end of a business meeting, then mark the lines where you think the answer was being given without being said outright.",
            learningObjectives: ["LO3", "LO4"],
            competencies: ["IC2", "IC3"],

            scene: {
                body: [
                    "Your team is meeting a partner organization in another country to discuss a new agreement. Ms. Chen, their director, leads the meeting. Six people from her team are in the room.",
                    "You have just finished presenting your proposal. You left the meeting believing the negotiation was still open. Several days later, you learn that her team believed they had already said no.",
                    "This is how the meeting ended."
                ]
            },

            prompt: "Her team believed they had already said no. Which lines do you think carried that message?",
            signalName: "signals",

            speakers: {
                you: { name: "You", self: true },
                chen: { name: "Ms. Chen" }
            },

            lines: [
                {
                    id: "ask",
                    speaker: "you",
                    text: "“So that is our proposal: a three-year agreement, starting in January. Can we agree on that today?”",
                    note: "This was your own line, but it shaped the rest of the meeting. A yes-or-no question, asked in front of her whole team, left Ms. Chen with no comfortable way to refuse."
                },
                {
                    id: "thanks",
                    speaker: "chen",
                    text: "“Thank you. It is clear how much work your team has put into this.”",
                    note: "A courtesy. On its own, it tells you nothing about the decision either way."
                },
                {
                    id: "difficult",
                    speaker: "chen",
                    text: "“A three-year term… that may be difficult.”",
                    signal: true,
                    heard: "There is an obstacle, and we can work on it. The negotiation is still open.",
                    meant: "No. For Ms. Chen, this was already a clear refusal, said in a way that let nobody in the room lose face."
                },
                {
                    id: "price",
                    speaker: "you",
                    text: "“Difficult in what way? We could look again at the price.”",
                    note: "You treated “difficult” as a problem to solve, and guessed that the problem was the price. The guess was never checked."
                },
                {
                    id: "study",
                    speaker: "chen",
                    cue: "She pauses.",
                    text: "“We will need to study it carefully.”",
                    signal: true,
                    heard: "They are going to review the proposal and come back with an answer.",
                    meant: "The subject is closed for today. No date, no next step, and no person responsible were offered."
                },
                {
                    id: "flight",
                    speaker: "chen",
                    text: "“But you must be tired. How was your flight?”",
                    signal: true,
                    heard: "Friendly small talk at the end of a long meeting.",
                    meant: "A change of subject, to move everyone away from an uncomfortable moment and protect the relationship."
                },
                {
                    id: "contract",
                    speaker: "you",
                    text: "“It was fine, thank you. Shall I send the contract next week, then?”",
                    note: "You asked about the next step as if the first step had been agreed."
                },
                {
                    id: "useful",
                    speaker: "chen",
                    text: "“Please send us whatever you think is useful.”",
                    signal: true,
                    heard: "Yes, send the contract.",
                    meant: "A polite reply that commits to nothing. Notice what is missing: at no point in the meeting did anyone say yes."
                }
            ],

            review: {
                title: "What was said, and what was meant",
                body: [
                    "A few days later, Wei, your contact on Ms. Chen's team, tells you that they thought the answer had been clear. Here is the conversation again, with what he explained."
                ],
                heardLabel: "How you heard it",
                meantLabel: "How it was meant",
                note: "None of these phrases always means no. Sometimes “that may be difficult” only means that something is difficult. No single line gave you the answer. What you had was several signals in a row and no clear yes, and that is the moment to check your reading.",
                takeaways: [
                    "“They said it may be difficult” is what happened. “We are still negotiating” was your interpretation.",
                    "A refusal can be given through what is left unsaid: no yes, no date, no next step.",
                    "How you ask shapes what you can be told. A yes-or-no question in front of a group makes a direct no harder.",
                    "Neither side was being evasive or careless. Each was being clear by its own standard."
                ]
            }
        },

        {
            id: "incident-negotiation-followup",
            type: "branchingScenario",
            title: "The Follow-Up",
            moduleLabel: "Critical Incidents",
            instructions: "Go back to the evening after the meeting, before Wei has explained anything. Choose what you would do.",
            learningObjectives: ["LO3"],
            competencies: ["IC3", "IC5"],
            showTagsAfterChoice: false,

            scene: {
                body: [
                    "It is the evening after the meeting. Reading back through your notes, you notice that nobody on Ms. Chen's team actually said yes.",
                    "You are no longer sure what was decided. Your manager is expecting an update tomorrow."
                ]
            },

            decisions: [
                {
                    id: "followup",
                    prompt: "What do you do next?",
                    options: [
                        {
                            id: "contract",
                            label: "Send the contract with a signing date, as you offered in the meeting.",
                            tag: "Acting on your first reading",
                            outcome: [
                                "Nothing comes back. Ten days later, Wei tells you quietly that the team was surprised to receive a contract for something they had already declined.",
                                "Ms. Chen now has to refuse a second time, and more plainly. The relationship is cooler than it was."
                            ],
                            explanation: [
                                "You treated one interpretation as a fact and acted on it. The contract answered a question that nobody on their side thought was open."
                            ]
                        },
                        {
                            id: "confirm",
                            label: "Email Ms. Chen: “To confirm, do we have an agreement? A yes or no would help us plan.”",
                            tag: "Asking for the answer in your own style",
                            outcome: [
                                "Two days later, her assistant replies: “We are still considering the proposal internally.”",
                                "You know no more than before, and Ms. Chen has been asked to say no in writing."
                            ],
                            explanation: [
                                "Checking was the right instinct. The form of the question was the problem: it asked again for the one thing that had been hard to say, so it produced another indirect answer."
                            ]
                        },
                        {
                            id: "ask",
                            label: "Call Wei: “I had the sense the three-year term is a problem. What would make this easier on your side?”",
                            tag: "Checking your reading",
                            recommended: true,
                            outcome: [
                                "Wei sounds relieved. A three-year commitment needs approval from head office, and Ms. Chen cannot ask for that this year. A one-year pilot would be within her authority.",
                                "You tell your manager what you have learned and send a revised, shorter proposal. Ms. Chen replies the same week."
                            ],
                            explanation: [
                                "You said what you had noticed, offered it as a guess, and asked an open question in private. That gave Wei room to tell you what the obstacle was. It was not the price."
                            ]
                        }
                    ]
                }
            ],

            debrief: {
                title: "Another perspective",
                body: [
                    "What you met in this meeting has names. Communication is more direct when most of the message is in the words, and more indirect when much of it is left to tone, timing, and what goes unsaid. You may also see these called low-context and high-context communication. “Face” is a person's standing and dignity in front of others.",
                    "In some workplaces, a direct “no” is felt to be rude, especially in front of other people, because it can cause the other person to lose face. An indirect refusal is not a way of avoiding the decision. For Ms. Chen, it was the clearest polite form available.",
                    "There was also something you could not see from your side of the table. Ms. Chen did not have the authority to agree to three years, and she was not going to explain her organization's approval process in a meeting. Your offer on price answered a question nobody had asked.",
                    "This is one team in one organization. How directly people refuse differs between companies and between individuals, so the useful habit is to check, and not to predict."
                ],
                takeaways: [
                    "When you have no clear yes, treat your reading as a guess and test it.",
                    "Ask open questions, in private, that can be answered without anyone having to refuse.",
                    "Ask about the decision process as well as the decision: who needs to approve, and by when.",
                    "A trusted contact can often tell you what a formal meeting cannot."
                ]
            }
        },

        {
            id: "incident-negotiation-reflection",
            type: "reflection",
            title: "After the Meeting",
            moduleLabel: "Critical Incidents",
            body: [
                "You have separated what was said from what it was taken to mean, and tried a way of checking. Now apply that to your own work."
            ],
            scenarioRecap: "incident-negotiation-followup",
            prompt: "Think of a meeting or conversation in which you were not sure whether you had been given a yes. What was actually said? What did you take it to mean? Write one question you could ask next time to check.",
            storageKey: "incidentNegotiationDaeaReflection",
            required: true,
            reflectionTitle: "Reconsidering the Situation",
            rationale: criticalIncidentReflectionRationale,
            learningObjectives: ["LO4", "LO5"],
            competencies: ["IC4", "IC5"],
            placeholder: "What was said: ...\nWhat I took it to mean: ...\nA question I could ask: ..."
        },

        {
            id: "incident-guest-host-communication",
            type: "guidedActivity",
            title: "Guest/Host Communication Incident",
            moduleLabel: "Critical Incidents",
            instructions: "Explore how politeness expectations can create confusion even when everyone has good intentions.",
            slides: [
                {
                    slideType: "story",
                    title: "A confusing party",
                    body: [
                        "You are traveling abroad and become friends with a local colleague. Several weeks later, they invite you to a family wedding.",
                        "You attend expecting a small gathering of close family and friends. Instead, hundreds of people are present. Many guests seem to know only one member of the family, and some appear to have simply arrived after hearing about the event.",
                        "You are unsure whether you are truly welcome or whether you are intruding. Everyone else seems completely comfortable."
                    ]
                },
                {
                    slideType: "reflection",
                    title: "First Reflection",
                    body: [
                        "Many different cultures see \"family\" events and parties, such as weddings, differently. While you may think of it as a family event, they may see it as a community celebration."
                    ],
                    prompt: "Describe what happened. What assumptions might you be making about the party and the invitation?",
                    storageKey: "incidentGuestHostInitialReflection",
                    required: true,
                    reflectionTitle: "First Impressions",
                    showPurposeDisclosure: false,
                    rationale: "This reflection helps learners examine assumptions about family, community, and invitations.",
                    learningObjectives: ["LO1", "LO2"],
                    competencies: ["IC1", "IC2"],
                    placeholder: "Describe: ...\nAssumptions: ..."
                },
                {
                    slideType: "reveal",
                    title: "Additional Perspective",
                    body: [
                        "In some cultures \"family\" is defined differently and is expanded beyond the \"nuclear family\" to include extended family, neighbors, church members, members of the same community, and even historical affiliations. Someone could say \"it's just family\" but mean 300+ people.",
                        "There are also sometimes social obligations of hospitality. People in some cultures may feel obligated to invite the entire community to events like this.",
                        "In many cultures around the world, weddings are community celebrations instead of private family events. They are meant to build social bonds and cohesion, as well as to introduce the new \"family\" into the larger community family."
                    ]
                },
                {
                    slideType: "reflection",
                    title: "DAEA Reflection",
                    body: [
                        "Use DAEA to examine the guest and host perspectives without turning either person into a stereotype.",
                        "Focus on what each person may regard as family and what a wedding is supposed to represent."
                    ],
                    prompt: "Analyze your and their definitions of family. Evaluate your reaction to the confusion. What could you do in the future if you are invited to a wedding in a foreign country?",
                    storageKey: "incidentGuestHostDaeaReflection",
                    required: true,
                    reflectionTitle: "Reconsidering the Situation",
                    rationale: criticalIncidentReflectionRationale,
                    learningObjectives: ["LO1", "LO4", "LO5"],
                    competencies: ["IC1", "IC4", "IC5"],
                    placeholder: "Analyze: ...\nEvaluate: ...\nApply: ..."
                },
                {
                    slideType: "summary",
                    title: "Takeaways",
                    body: [
                        "This incident shows less visible cultural differences in the definition of family and community.",
                        "A \"family wedding\" may be a huge celebration with the entire community present."
                    ],
                    points: [
                        "Culture influences what people define as family.",
                        "Different views of family and community can cause confusion between different cultures. In the same way, they might be confused or sad about a small wedding with only immediate family and friends.",
                        "Situations like this are an excellent way to practice tolerance of ambiguity.",
                        "DAEA supports future action by helping you plan what to do in similar situations in the future."
                    ]
                }
            ]
        },

        {
            id: "incidents-complete",
            type: "moduleComplete",
            title: "Great job!",
            moduleLabel: "Module Complete",
            moduleKey: "incidents",
            completedModuleTitle: "Module 6: Critical Incidents",
            summary: [
                "First interpretations may be incomplete.",
                "Cultural expectations can differ even when people have good intentions.",
                "Ambiguity should be explored before judgment.",
                "DAEA can guide future action in realistic intercultural situations."
            ],
            nextModuleKey: "reflection"
        }
    ]
};
