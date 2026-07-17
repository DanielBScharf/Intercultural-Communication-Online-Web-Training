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
                        "Whenever you finish your drink one of your colleagues fills your glass whenever it is empty. It is a work night and you all have to be in the office in the morning. You eventually begin leaving your glass half full because you don't want to drink any more.",
                        "Your colleague seems disappointed and becomes less engaged for the rest of the evening."
                    ]
                },
                {
                    slideType: "reflection",
                    title: "First Reflection",
                    body: [
                        "Begin with what is observable, then notice the assumptions that may appear quickly.",
                        "There is no single correct answer. The goal is to slow down your interpretation."
                    ],
                    prompt: "Describe what happened. What assumptions might the visitor make about the hosts, and what assumptions might the hosts make about the visitor?",
                    storageKey: "incidentDrinkingInitialReflection",
                    placeholder: "Describe: ...\nAssumptions: ..."
                },
                {
                    slideType: "reveal",
                    title: "Additional Perspective",
                    body: [
                        "This sort of drinking is a farily common form of 'teambuilding' in many parts of the world. It's very common in China, South Korea, and Japan.",
                        "At the same time, the visitor's boundary still matters. Cultural understanding does not require ignoring personal needs, health, religion, recovery, or values.",
                        "The tension in this incident comes from different expectations about hospitality, participation, and how directly a refusal should be stated."
                    ]
                },
                {
                    slideType: "reflection",
                    title: "DAEA Reflection",
                    body: [
                        "Use DAEA to separate what happened from possible explanations, your reaction, and your future plan."
                    ],
                    prompt: "Analyze possible cultural perspectives. Evaluate your own reaction to the pressure or refusal. What might you do next time to communicate clearly while showing respect? Or do you just participate and hope you don't regret it in the morning?",
                    storageKey: "incidentDrinkingDaeaReflection",
                    placeholder: "Analyze: ...\nEvaluate: ...\nApply: ..."
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
                        "Your team is meeting with a partner organization to discuss a new business agreement.",
                        "You explain your proposal and ask if the other side agrees. The response is: 'That may be difficult'. You leave the meeting thinking negotiations are still ongoing",
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
                    placeholder: "Describe: ...\nAssumptions: ..."
                },
                {
                    slideType: "reveal",
                    title: "Additional Perspective",
                    body: [
                        "The other team may be working within a culture that worries that directly saying 'no' will cause the other person to save face.",
                        "Their indirect pace may not mean they are avoiding the decision. It may mean they are gathering support so the decision can succeed later.",
                        "The misunderstanding grows when one side defines progress as a quick decision while the other defines progress as relationship-building and alignment."
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
                    title: "A Polite Refusal",
                    body: [
                        "You are invited to someone's home for dinner. The host offers you more food several times.",
                        "You are still hungry, but in your experience it is polite to say \"no\" at first so you do not seem demanding.",
                        "The host accepts your first \"no\" literally and stops offering. Later, the host seems confused that you did not eat much, and you feel disappointed."
                    ]
                },
                {
                    slideType: "reflection",
                    title: "First Reflection",
                    body: [
                        "Both people may be trying to be polite. The confusion comes from different expectations about offers, refusals, and directness."
                    ],
                    prompt: "Describe what happened. What assumptions might the guest make about polite refusal, and what assumptions might the host make about accepting an answer?",
                    storageKey: "incidentGuestHostInitialReflection",
                    placeholder: "Describe: ...\nAssumptions: ..."
                },
                {
                    slideType: "reveal",
                    title: "Additional Perspective",
                    body: [
                        "In some contexts, an offer may be repeated even after a polite refusal. In others, accepting the first answer may be seen as respectful and attentive.",
                        "Neither pattern is automatically better. The misunderstanding happens because each person reads politeness through a different cultural perspective.",
                        "A small clarification can repair the moment without blame, especially when people assume good intentions."
                    ]
                },
                {
                    slideType: "reflection",
                    title: "DAEA Reflection",
                    body: [
                        "Use DAEA to examine the guest and host perspectives without turning either person into a stereotype.",
                        "Focus on what each person may have meant, felt, and needed."
                    ],
                    prompt: "Analyze both politeness expectations. Evaluate your reaction to the confusion. What could a guest or host do next time to make the meaning clearer?",
                    storageKey: "incidentGuestHostDaeaReflection",
                    placeholder: "Analyze: ...\nEvaluate: ...\nApply: ..."
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
