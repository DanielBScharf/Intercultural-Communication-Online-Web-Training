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
// ======================================

const criticalIncidentReflectionRationale = `Think back to the cultural iceberg. There may be deeper values, expectations, assumptions, or communication norms influencing this situation that are not immediately visible. You may not yet have enough information to understand why someone behaved the way they did.

Then consider tolerance of ambiguity. How can you respond when you do not have all of the information? Instead of immediately filling in the gaps yourself, consider what you could observe, ask, or investigate. Seeking information and remaining open to more than one explanation can help you navigate unfamiliar intercultural situations without assuming that your first interpretation is the only possible one.`;

export const incidentsModule = {
    key: "incidents",
    title: "Critical Incidents",
    description: "Practice intercultural reflection with realistic scenarios.",
    image: "images/daea/critical_reflection.png",

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
            id: "incident-negotiation-misunderstanding",
            type: "guidedActivity",
            title: "Negotiation Misunderstanding Incident",
            moduleLabel: "Critical Incidents",
            instructions: "Consider how decision-making expectations can shape the way people interpret the same business discussion.",
            slides: [
                {
                    slideType: "story",
                    title: "Vague Communication",
                    body: [
                        "Your team is meeting with a partner organization to discuss a new business agreement.",
                        "You explain your proposal and ask if the other side agrees. The response is: 'That may be difficult.' You leave the meeting thinking negotiations are still ongoing.",
                        "Several days later you learn they believed they had already rejected the proposal."
                    ]
                },
                {
                    slideType: "reflection",
                    title: "First Reflection",
                    body: [
                        "Before labeling the discussion as inefficient, evasive, or unserious, pause and separate evidence from interpretation."
                    ],
                    prompt: "Describe what happened in the meeting. What assumptions might each side be making about progress, directness, authority, or trust?",
                    storageKey: "incidentNegotiationInitialReflection",
                    required: true,
                    reflectionTitle: "First Impressions",
                    showPurposeDisclosure: false,
                    rationale: "This reflection asks learners to identify assumptions about communication and decision-making before judging the interaction.",
                    learningObjectives: ["LO2", "LO3"],
                    competencies: ["IC2", "IC3"],
                    placeholder: "Describe: ...\nAssumptions: ..."
                },
                {
                    slideType: "reveal",
                    title: "Additional Perspective",
                    body: [
                        "The other team may be working within a culture that worries that directly saying 'no' can be seen as rude and will cause the other person to lose face.",
                        "Their indirect communication may not mean they are avoiding the decision. In their eyes they gave you the most direct way to say no that they could.",
                        "The misunderstanding can also build over reluctance to share information. In many cultures, the spread of information, including in decision making, is very top-down. If upper management says something is not possible, they may not share their reasoning or allow further negotiation."
                    ]
                },
                {
                    slideType: "reflection",
                    title: "DAEA Reflection",
                    body: [
                        "Use the additional perspective to examine your reaction without turning either side into a stereotype.",
                        "Think about what information would help reduce ambiguity."
                    ],
                    prompt: "Analyze possible cultural or organizational perspectives. Evaluate the frustration in this scenario. What could someone ask or do next time to understand the decision process more clearly?",
                    storageKey: "incidentNegotiationDaeaReflection",
                    required: true,
                    reflectionTitle: "Reconsidering the Situation",
                    rationale: criticalIncidentReflectionRationale,
                    learningObjectives: ["LO4", "LO5"],
                    competencies: ["IC4", "IC5"],
                    placeholder: "Analyze: ...\nEvaluate: ...\nApply: ..."
                },
                {
                    slideType: "summary",
                    title: "Takeaways",
                    body: [
                        "This incident connects to stereotypes because one side could quickly label the other as slow, evasive, or unserious.",
                        "A tolerance-of-ambiguity approach asks you to investigate decision-making expectations before judging."
                    ],
                    points: [
                        "Different cultures and organizations may define progress differently.",
                        "Indirect communication can serve relationship-building or consensus-building purposes.",
                        "Clear questions can reduce ambiguity without disrespecting the other side.",
                        "DAEA helps turn frustration into a plan for better communication."
                    ]
                }
            ]
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
                        "Different views of family and community can cause confusion between different cultures. They may be confused sad about a small wedding with only immediate family and friends.",
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
