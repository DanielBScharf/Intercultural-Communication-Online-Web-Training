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
                    rationale: "This reflection helps learners identify assumptions before deciding what the drinking expectation means.",
                    learningObjectives: ["LO2", "LO3"],
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
                    rationale: "This reflection uses DAEA to balance cultural curiosity, personal boundaries, and future communication choices.",
                    learningObjectives: ["LO4", "LO5"],
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
                    title: "Vague Communication",
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
                    rationale: "This reflection asks learners to identify assumptions about communication and decision-making before judging the interaction.",
                    learningObjectives: ["LO2", "LO3"],
                    placeholder: "Describe: ...\nAssumptions: ..."
                },
                {
                    slideType: "reveal",
                    title: "Additional Perspective",
                    body: [
                        "The other team may be working within a culture that worries that directly saying 'no' can be seen as rude and will cause the other person to lose face.",
                        "Their indirect communication may not mean they are avoiding the decision. In their eyes they gave you the most direct way to say no that they could.",
                        "The misunderstanding can also build over reluctance to share information. In many cultures, the spread of information, including in decision making is very top down. If upper managment says something is not possible they may not share their reasoning, or allow further negotiation."
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
                    rationale: "This reflection applies DAEA to indirect communication and turns frustration into clarifying questions.",
                    learningObjectives: ["LO4", "LO5"],
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
                        "Many different cultures see \"family\" events and parties, such as weddings, differently. While you may think of it as a family event they may see it as a comunity celebration"
                    ],
                    prompt: "Describe what happened. What assumptions might you be making about the party and the invitation?",
                    storageKey: "incidentGuestHostInitialReflection",
                    rationale: "This reflection helps learners examine assumptions about family, community, and invitations.",
                    learningObjectives: ["LO1", "LO2"],
                    placeholder: "Describe: ...\nAssumptions: ..."
                },
                {
                    slideType: "reveal",
                    title: "Additional Perspective",
                    body: [
                        "In some cultures \"family\" is defined differently and is expanded beyond the \"nuclear family\" to include extanded family, neighbors, church members, members of the same community, and even historical affiliations. Someone could say \"it's just family\" but mean 300+ people",
                        "There are also sometimes social obligations of hospitality. People in some cultures may feel obligated to invite the entire community to events like this.",
                        "In many cultures around the world weddings are community celebrations instead of private family events. They are meant to build social bonds and cohesion. As well as to introduce the new \"family\" into the larger community family."
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
                    rationale: "This reflection uses DAEA to compare cultural perspectives and plan how to respond to unfamiliar social expectations.",
                    learningObjectives: ["LO1", "LO4", "LO5"],
                    placeholder: "Analyze: ...\nEvaluate: ...\nApply: ..."
                },
                {
                    slideType: "summary",
                    title: "Takeaways",
                    body: [
                        "This incident shows how hidden cultural differences in definition of family and community.",
                        "A \"family wedding\" may be a huge celebration with the entire community present."
                    ],
                    points: [
                        "Culture influences what people define as family.",
                        "Different views of family and community can confusing between different cultures. They may be confused sad about a small wedding with only immedate family and friends.",
                        "Situations like this are an excelent way to practice tolerance of ambiguity",
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
