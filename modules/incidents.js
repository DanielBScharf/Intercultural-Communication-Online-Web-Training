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
// ======================================

export const incidentsModule = {
    key: "incidents",
    title: "Critical Incidents",
    description: "Practice intercultural reflection with realistic scenarios.",

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
            buttonText: "Begin Module 6"
        },

        {
            id: "critical-incidents-explained",
            type: "contentImage",
            title: "What Are Critical Incidents?",
            moduleLabel: "Critical Incidents",
            body: [
                "A critical incident is a moment when something feels confusing, uncomfortable, surprising, or difficult because expectations are not shared.",
                "The incident is not always dramatic. It may be a short conversation, a social expectation, a silence, a refusal, or a decision-making process that feels unfamiliar.",
                "Critical incidents are useful for learning because they reveal hidden cultural expectations. They also remind us that a first interpretation may be incomplete.",
                "In each scenario, describe what happened, analyze possible explanations, evaluate your reaction, and apply what you learned to future action."
            ],
            note: "As you work, try to avoid stereotypes. Treat each scenario as a chance to explore ambiguity before making a judgment."
        },

        {
            id: "incident-drinking-expectation",
            type: "guidedActivity",
            title: "Drinking Expectation Incident",
            moduleLabel: "Critical Incidents",
            instructions: "Read the incident one slide at a time. Notice your first interpretation, then use DAEA to examine it more carefully.",
            slides: [
                {
                    slideType: "story",
                    title: "A Work Dinner",
                    body: [
                        "You are visiting a partner organization in another country. After a long day of meetings, your hosts invite the group to dinner.",
                        "During the meal, several people raise glasses and encourage you to join each toast. You do not drink alcohol, but people keep smiling, refilling glasses, and saying, \"Come on, just one.\"",
                        "You feel pressure building. You are unsure whether refusing again would seem rude or ungrateful."
                    ]
                },
                {
                    slideType: "reflection",
                    title: "Describe Before Judging",
                    body: [
                        "Start with observable details. Avoid deciding yet whether anyone is being rude, disrespectful, friendly, or pushy."
                    ],
                    prompt: "What happened in this incident? Describe only what you know from the scenario.",
                    storageKey: "incidentDrinkingDescribe",
                    placeholder: "Describe the observable details..."
                },
                {
                    slideType: "decision",
                    title: "Choose a Response",
                    body: [
                        "You want to respect the relationship, but you also want to keep your own boundary."
                    ],
                    question: "What would be the most thoughtful next step?",
                    storageKey: "incidentDrinkingDecision",
                    choices: [
                        {
                            label: "Clearly and politely state that you do not drink, then offer another way to join the toast.",
                            value: "clear-boundary-alternative"
                        },
                        {
                            label: "Drink anyway so nobody feels uncomfortable.",
                            value: "drink-anyway"
                        },
                        {
                            label: "Assume the hosts do not respect personal boundaries.",
                            value: "assume-disrespect"
                        },
                        {
                            label: "Stop participating in the dinner conversation.",
                            value: "withdraw"
                        }
                    ]
                },
                {
                    slideType: "reveal",
                    title: "More Context",
                    body: [
                        "In this setting, repeated offers may be intended as warmth, inclusion, or celebration rather than coercion.",
                        "At the same time, your boundary still matters. Cultural understanding does not require ignoring your own needs or values.",
                        "A useful response might combine respect and clarity: \"Thank you. I do not drink alcohol, but I would be happy to toast with water.\""
                    ]
                },
                {
                    slideType: "reflection",
                    title: "DAEA Reflection",
                    body: [
                        "Use DAEA to separate what happened from possible explanations, your reaction, and your future plan."
                    ],
                    prompt: "How would you describe, analyze, evaluate, and apply what you learned from this incident?",
                    storageKey: "incidentDrinkingDaea",
                    placeholder: "Describe: ...\nAnalyze: ...\nEvaluate: ...\nApply: ..."
                },
                {
                    slideType: "summary",
                    title: "Takeaways",
                    body: [
                        "This incident connects to culture as perspective because the same repeated offer can be interpreted in different ways.",
                        "It also connects to tolerance of ambiguity because you may need to stay calm while you gather more information."
                    ],
                    points: [
                        "First interpretations may be incomplete.",
                        "Avoid stereotyping the hosts as rude or the visitor as ungrateful.",
                        "Respectful communication can include both cultural curiosity and personal boundaries.",
                        "DAEA can help you plan language for future situations."
                    ]
                }
            ]
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
                    title: "A Slow Discussion",
                    body: [
                        "Your team is meeting with a partner organization to discuss a new project. You expect the meeting to end with a clear decision and a list of next steps.",
                        "Instead, the conversation moves slowly. The other team asks many background questions, discusses relationships between departments, and says they will need to speak with several colleagues.",
                        "Your team starts to feel frustrated. Some people think the other side is avoiding a decision."
                    ]
                },
                {
                    slideType: "reflection",
                    title: "Notice the Evidence",
                    body: [
                        "Before labeling the discussion as inefficient or evasive, identify what actually happened."
                    ],
                    prompt: "What details from the scenario support your first interpretation? What details are still unclear?",
                    storageKey: "incidentNegotiationEvidence",
                    placeholder: "Evidence I have: ...\nInformation I still need: ..."
                },
                {
                    slideType: "decision",
                    title: "Choose a Response",
                    body: [
                        "You want progress, but you also do not want to damage trust by pushing too hard too soon."
                    ],
                    question: "What should your team do next?",
                    storageKey: "incidentNegotiationDecision",
                    choices: [
                        {
                            label: "Ask about their decision process and timeline before assuming avoidance.",
                            value: "ask-process-timeline"
                        },
                        {
                            label: "Tell them the meeting is unproductive unless they decide immediately.",
                            value: "demand-decision"
                        },
                        {
                            label: "Conclude that the partner organization is not serious.",
                            value: "conclude-not-serious"
                        },
                        {
                            label: "End the relationship and look for a faster partner.",
                            value: "end-relationship"
                        }
                    ]
                },
                {
                    slideType: "reveal",
                    title: "More Context",
                    body: [
                        "The other team may be working within a decision-making culture that values trust, internal consultation, and consensus before commitment.",
                        "Their indirect pace may not mean they are avoiding the decision. It may mean they are gathering support so the decision can succeed later.",
                        "A helpful question might be: \"Can you help us understand who needs to be involved and what timeline would be realistic?\""
                    ]
                },
                {
                    slideType: "reflection",
                    title: "DAEA Reflection",
                    body: [
                        "Think about how expectations for speed, directness, and authority shaped the misunderstanding."
                    ],
                    prompt: "Use DAEA to reflect on the negotiation incident. What did each side possibly see, assume, feel, and need next?",
                    storageKey: "incidentNegotiationDaea",
                    placeholder: "Describe: ...\nAnalyze: ...\nEvaluate: ...\nApply: ..."
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
                    title: "A Polite Refusal",
                    body: [
                        "You are invited to someone's home for dinner. The host offers you more food several times.",
                        "You are still hungry, but in your experience it is polite to say \"no\" at first so you do not seem demanding.",
                        "The host accepts your first \"no\" literally and stops offering. Later, the host seems confused that you did not eat much, and you feel disappointed."
                    ]
                },
                {
                    slideType: "reflection",
                    title: "Separate Intent from Impact",
                    body: [
                        "Both people may be trying to be polite. The problem is that their politeness scripts may be different."
                    ],
                    prompt: "What did the guest intend? What did the host likely hear or understand?",
                    storageKey: "incidentGuestHostIntent",
                    placeholder: "Guest intention: ...\nHost interpretation: ..."
                },
                {
                    slideType: "decision",
                    title: "Choose a Response",
                    body: [
                        "Imagine you are the guest and realize the host took your refusal literally."
                    ],
                    question: "What could you say or do next?",
                    storageKey: "incidentGuestHostDecision",
                    choices: [
                        {
                            label: "Clarify kindly: \"Actually, if it is not too much trouble, I would enjoy a little more.\"",
                            value: "clarify-kindly"
                        },
                        {
                            label: "Stay hungry because changing your answer would be embarrassing.",
                            value: "stay-hungry"
                        },
                        {
                            label: "Assume the host is not generous.",
                            value: "assume-not-generous"
                        },
                        {
                            label: "Complain later that the host did not offer enough.",
                            value: "complain-later"
                        }
                    ]
                },
                {
                    slideType: "reveal",
                    title: "More Context",
                    body: [
                        "In some contexts, an offer may be repeated even after a polite refusal. In others, accepting the first answer may be seen as respectful and attentive.",
                        "Neither pattern is automatically better. The misunderstanding happens because each person reads politeness through a different cultural perspective.",
                        "A small clarification can repair the moment without blame."
                    ]
                },
                {
                    slideType: "reflection",
                    title: "DAEA Reflection",
                    body: [
                        "Use DAEA to examine the guest and host perspectives without turning either person into a stereotype."
                    ],
                    prompt: "Describe the incident, analyze both politeness expectations, evaluate the feelings involved, and apply a future communication strategy.",
                    storageKey: "incidentGuestHostDaea",
                    placeholder: "Describe: ...\nAnalyze: ...\nEvaluate: ...\nApply: ..."
                },
                {
                    slideType: "summary",
                    title: "Takeaways",
                    body: [
                        "This incident shows how hidden cultural expectations can shape ordinary communication.",
                        "A polite answer in one context may be confusing in another."
                    ],
                    points: [
                        "Culture influences what people mean by polite communication.",
                        "Good intentions do not always prevent misunderstanding.",
                        "Ambiguity can be explored through gentle clarification.",
                        "DAEA supports future action by helping you plan what to say next time."
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
