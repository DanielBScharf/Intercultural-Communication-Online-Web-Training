// ======================================
// Branching Scenario
// js/branchingScenario.js
// ======================================
//
// Purpose:
// A reusable multiple-choice scenario. The learner reads a situation,
// makes one or more decisions, sees what each choice leads to, and then
// compares every path side by side.
//
// This file contains ONLY the scenario logic and layout.
// The story itself lives in modules/*.js, so any module can add a
// scenario without changing this file.
//
// How to use it in a module:
//
// {
//     id: "my-scenario",                 // unique lesson id
//     type: "branchingScenario",
//     title: "The New Colleague",
//     moduleLabel: "Stereotypes",
//     instructions: "Optional line shown above the scenario.",
//
//     scene: {                           // shown with the first decision
//         body: ["Paragraph one.", "Paragraph two."],
//         image: "images/...",           // optional
//         imageAlt: "...",               // optional
//         audio: "audio/scene.mp3"       // optional voice-over
//     },
//
//     decisions: [
//         {
//             id: "conclusion",          // unique within the scenario
//             body: ["Optional text shown before the question."],
//             prompt: "What do you conclude?",
//             options: [
//                 {
//                     id: "observation", // unique within the decision
//                     label: "The choice the learner reads.",
//                     tag: "Observation",        // optional, shown after choosing
//                     outcome: ["What happens."],
//                     explanation: ["Why."],     // optional, shown only on the compare screen
//                     recommended: true,         // optional, marked on the compare screen
//                     audio: "audio/x.mp3",      // optional voice-over for the outcome
//                     next: "some-decision-id"   // optional, see "Branching" below
//                 }
//             ],
//
//             question: {                // optional, see "Open questions" below
//                 prompt: "Why do you think it went that way?",
//                 storageKey: "myScenarioWhy",
//                 placeholder: "One explanation: ..."
//             }
//         }
//     ],
//
//     question: {                        // optional, see "Open questions" below
//         prompt: "Why do you think it went that way?",
//         storageKey: "myScenarioWhy",
//         placeholder: "One explanation: ..."
//     },
//
//     showTagsAfterChoice: false,        // optional, see "Open questions" below
//
//     debrief: {                         // optional, shown on the compare screen
//         title: "What the scenario shows",
//         body: ["..."],
//         takeaways: ["...", "..."]
//     }
// }
//
// Branching:
// By default each decision leads to the next one in the list, whatever
// the learner chooses (the paths branch, then come back together).
// To send a choice somewhere else, give that option a "next" value:
// the id of another decision, or "end" to finish the scenario there.
//
// Open questions:
// A scenario can ask the learner to write something before the compare
// screen, for example why they think things went the way they did.
// There are two places to put a "question":
//   - On the scenario itself. It gets its own step after the last
//     decision, with a recap of how every choice played out.
//   - On a single decision. It appears under that decision's outcome,
//     before the scenario moves on.
// Keep the reason out of "outcome" and put it in "explanation", so the
// learner thinks first and compares their answer with the reasons on
// the compare screen. If the tags would give the answer away, set
// showTagsAfterChoice: false and they will wait for the compare screen.
// Next asks for an answer and Skip for Now lets the learner pass. The
// answer is saved like any other reflection and appears in the
// Reflection Summary. It never blocks module completion.
//
// To show the learner's choices on a later reflection screen, add
// scenarioRecap: "my-scenario" to that reflection lesson.
// ======================================

import { saveItem, loadItem, saveResponse, loadResponse } from "./storage.js";
import {
    hasResponse,
    renderResponseValidation,
    validateResponseField,
    clearResponseValidation
} from "./reflectionValidation.js";

export const SCENARIO_CHOICE_REQUIRED_MESSAGE =
    "Choose a response to continue, or choose Skip for Now.";

const END = "end";

// ======================================
// Scenario logic
// ======================================
//
// These functions do not touch the page. They only work out where the
// learner is in the scenario, so they can be tested on their own.

export function getScenarioDecisions(lesson) {
    return lesson?.decisions || [];
}

export function getScenarioDecision(lesson, decisionId) {
    return getScenarioDecisions(lesson).find(decision => decision.id === decisionId) || null;
}

export function getScenarioOption(decision, optionId) {
    return (decision?.options || []).find(option => option.id === optionId) || null;
}

export function createScenarioState() {
    return { path: [], view: 0 };
}

// The decision that follows a choice, or null when the scenario ends.
export function getNextDecisionId(lesson, decisionId, optionId) {
    const decisions = getScenarioDecisions(lesson);
    const decision = getScenarioDecision(lesson, decisionId);
    const option = getScenarioOption(decision, optionId);

    if (!decision || !option) return null;

    if (option.next) {
        if (option.next === END) return null;
        return getScenarioDecision(lesson, option.next) ? option.next : null;
    }

    const following = decisions[decisions.indexOf(decision) + 1];

    return following ? following.id : null;
}

// The decision waiting for an answer, or null when every decision on
// the learner's path has been answered.
export function getPendingDecisionId(lesson, state) {
    const decisions = getScenarioDecisions(lesson);

    if (!decisions.length) return null;
    if (!state.path.length) return decisions[0].id;

    const last = state.path[state.path.length - 1];

    return getNextDecisionId(lesson, last.decisionId, last.optionId);
}

export function isScenarioComplete(lesson, state) {
    return state.path.length > 0 && getPendingDecisionId(lesson, state) === null;
}

// What the learner should see for the current view:
// an answered decision, the decision waiting for an answer, or the
// compare screen.
export function getScenarioView(lesson, state) {
    if (state.view < state.path.length) {
        const step = state.path[state.view];

        return { kind: "decision", decisionId: step.decisionId, chosenOptionId: step.optionId };
    }

    const pendingDecisionId = getPendingDecisionId(lesson, state);

    if (pendingDecisionId) {
        return { kind: "decision", decisionId: pendingDecisionId, chosenOptionId: null };
    }

    // With every decision made, a scenario-level question comes first.
    if (getScenarioQuestion(lesson) && state.view === state.path.length) {
        return { kind: "question" };
    }

    return { kind: "review" };
}

// How many steps the scenario adds to the module's progress bar: one
// for each decision, one for a scenario-level question, and one for
// the compare screen.
export function getScenarioStepCount(lesson) {
    return getScenarioDecisions(lesson).length + (getScenarioQuestion(lesson) ? 1 : 0) + 1;
}

// The last view a learner can be on for the choices made so far.
export function getLastScenarioView(lesson, state) {
    const hasQuestionStep = isScenarioComplete(lesson, state) && getScenarioQuestion(lesson);

    return state.path.length + (hasQuestionStep ? 1 : 0);
}

// Records a choice for the decision that is waiting for an answer.
// Choices that are already made stay as they are until the learner
// restarts the scenario.
export function chooseScenarioOption(lesson, state, optionId) {
    const pendingDecisionId = getPendingDecisionId(lesson, state);

    if (!pendingDecisionId || state.view !== state.path.length) return state;

    const decision = getScenarioDecision(lesson, pendingDecisionId);

    if (!getScenarioOption(decision, optionId)) return state;

    return {
        path: [...state.path, { decisionId: pendingDecisionId, optionId }],
        view: state.view
    };
}

// Moves forward one view. "moved" is false when there is nowhere to go:
// either a choice is still needed, or the learner is on the compare
// screen and the lesson itself should move on.
export function advanceScenario(lesson, state) {
    const view = getScenarioView(lesson, state);

    if (view.kind === "review") {
        return { state, moved: false, needsChoice: false, finished: true };
    }

    if (view.kind === "decision" && !view.chosenOptionId) {
        return { state, moved: false, needsChoice: true, finished: false };
    }

    return {
        state: { ...state, view: state.view + 1 },
        moved: true,
        needsChoice: false,
        finished: false
    };
}

export function retreatScenario(state) {
    if (state.view <= 0) return { state, moved: false };

    return { state: { ...state, view: state.view - 1 }, moved: true };
}

// Saved choices can go out of date when a scenario is edited.
// Keep only the part of the saved path that still matches the content.
export function restoreScenarioState(lesson, saved) {
    const state = createScenarioState();

    if (!saved || !Array.isArray(saved.path)) return state;

    for (const step of saved.path) {
        const expectedDecisionId = getPendingDecisionId(lesson, state);
        const decision = getScenarioDecision(lesson, step?.decisionId);

        if (!expectedDecisionId || step.decisionId !== expectedDecisionId) break;
        if (!getScenarioOption(decision, step.optionId)) break;

        state.path.push({ decisionId: step.decisionId, optionId: step.optionId });
    }

    const lastView = getLastScenarioView(lesson, state);
    const savedView = Number.isInteger(saved.view) ? saved.view : lastView;

    state.view = Math.min(Math.max(savedView, 0), lastView);

    return state;
}

// A plain summary of the learner's choices, for recap and review.
export function getScenarioChoices(lesson, state) {
    return state.path.map(step => {
        const decision = getScenarioDecision(lesson, step.decisionId);
        const option = getScenarioOption(decision, step.optionId);

        return { decision, option };
    }).filter(choice => choice.decision && choice.option);
}

// The open question attached to a decision, if it has one.
export function getDecisionQuestion(decision) {
    return decision?.question?.storageKey ? decision.question : null;
}

// The open question asked once, after the last decision, if there is one.
export function getScenarioQuestion(lesson) {
    return lesson?.question?.storageKey ? lesson.question : null;
}

// Every open question in a scenario, in the shape the Reflection
// Summary uses for other written responses.
export function getScenarioQuestions(lesson) {
    return [...getScenarioDecisions(lesson).map(getDecisionQuestion), getScenarioQuestion(lesson)]
        .filter(Boolean)
        .map(question => ({
            prompt: question.prompt,
            storageKey: question.storageKey,
            reflectionTitle: question.reflectionTitle,
            rationale: question.rationale,
            competencies: question.competencies || lesson.competencies || [],
            learningObjectives: question.learningObjectives || lesson.learningObjectives || []
        }));
}

// Lists content mistakes so they are caught while writing a scenario,
// not by a learner. Returns an empty list when the scenario is sound.
export function validateScenario(lesson) {
    const problems = [];
    const decisions = getScenarioDecisions(lesson);
    const decisionIds = decisions.map(decision => decision.id);

    if (!decisions.length) problems.push("The scenario has no decisions.");

    if (lesson?.question) {
        if (!lesson.question.prompt) problems.push("The scenario question has no prompt.");
        if (!lesson.question.storageKey) problems.push("The scenario question has no storageKey.");
    }

    decisions.forEach((decision, index) => {
        const name = decision.id || `decision ${index + 1}`;

        if (!decision.id) problems.push(`Decision ${index + 1} has no id.`);
        if (decisionIds.indexOf(decision.id) !== index) problems.push(`Decision id "${decision.id}" is used more than once.`);
        if (!decision.prompt) problems.push(`Decision "${name}" has no prompt.`);
        if (!decision.options || decision.options.length < 2) problems.push(`Decision "${name}" needs at least two options.`);

        if (decision.question) {
            if (!decision.question.prompt) problems.push(`The question in "${name}" has no prompt.`);
            if (!decision.question.storageKey) problems.push(`The question in "${name}" has no storageKey.`);
        }

        const optionIds = (decision.options || []).map(option => option.id);

        (decision.options || []).forEach((option, optionIndex) => {
            const optionName = option.id || `option ${optionIndex + 1}`;

            if (!option.id) problems.push(`An option in "${name}" has no id.`);
            if (optionIds.indexOf(option.id) !== optionIndex) problems.push(`Option id "${option.id}" is used more than once in "${name}".`);
            if (!option.label) problems.push(`Option "${optionName}" in "${name}" has no label.`);
            if (!option.outcome || !option.outcome.length) problems.push(`Option "${optionName}" in "${name}" has no outcome.`);
            if (option.next && option.next !== END && !decisionIds.includes(option.next)) {
                problems.push(`Option "${optionName}" in "${name}" points to "${option.next}", which is not a decision.`);
            }
        });
    });

    return problems;
}

// ======================================
// Saved progress
// ======================================

function getScenarioStorageKey(lesson) {
    return `scenario_${lesson.id}`;
}

export function loadScenarioState(lesson) {
    return restoreScenarioState(lesson, loadItem(getScenarioStorageKey(lesson), null));
}

function saveScenarioState(lesson, state) {
    saveItem(getScenarioStorageKey(lesson), state);
}

// ======================================
// Layout
// ======================================

export function renderBranchingScenarioContent(lesson) {
    return `
        <div class="branching-scenario" data-scenario-id="${lesson.id}">

            ${lesson.instructions ? `<p class="lead">${lesson.instructions}</p>` : ""}

            <p class="scenario-progress" id="scenarioProgress" aria-live="polite"></p>

            <div id="scenarioStage"></div>

        </div>
    `;
}

function renderParagraphs(body = []) {
    return (body || []).map(paragraph => `<p>${paragraph}</p>`).join("");
}

// Voice-over is optional. The written text is always shown, so it
// doubles as the transcript.
function renderAudio(audio, label) {
    if (!audio) return "";

    return `
        <audio class="scenario-audio" controls preload="none" src="${audio}" aria-label="${label}"></audio>
    `;
}

function renderScene(scene) {
    if (!scene) return "";

    const image = scene.image ? `
        <img
            src="${scene.image}"
            alt="${scene.imageAlt || ""}"
            class="img-fluid rounded shadow-sm scenario-scene-image">
    ` : "";

    return `
        <div class="scenario-scene">
            ${image}
            ${renderParagraphs(scene.body)}
            ${renderAudio(scene.audio, "Listen to the situation")}
        </div>
    `;
}

function showsTagsAfterChoice(lesson) {
    return lesson.showTagsAfterChoice !== false;
}

function renderOutcome(option, lesson) {
    return `
        <div class="scenario-outcome" id="scenarioOutcome" tabindex="-1">
            <p class="scenario-outcome-choice">
                <span class="scenario-outcome-label">You chose:</span>
                ${option.label}
            </p>
            ${option.tag && showsTagsAfterChoice(lesson) ? `<p class="scenario-tag">${option.tag}</p>` : ""}
            ${renderParagraphs(option.outcome)}
            ${renderAudio(option.audio, "Listen to what happens")}
        </div>
    `;
}

// Learner text is shown as plain text, never as HTML.
function escapeText(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function renderQuestion(question) {
    if (!question) return "";

    const key = question.storageKey;

    return `
        <div class="reflection-prompt scenario-question">
            <label class="form-label fw-semibold" for="${key}">
                ${question.prompt}
            </label>

            <textarea
                id="${key}"
                class="form-control reflection-box"
                rows="4"
                aria-describedby="${key}Validation"
                data-scenario-question="true"
                data-storage-key="${key}"
                placeholder="${question.placeholder || "Write your response here..."}">${escapeText(loadResponse(key))}</textarea>

            ${renderResponseValidation(key)}
            <div class="save-status mt-2" id="${key}Status">
                Your response will be saved in this browser.
            </div>
        </div>
    `;
}

function renderDecisionView(lesson, state, view) {
    const decision = getScenarioDecision(lesson, view.decisionId);
    const chosen = getScenarioOption(decision, view.chosenOptionId);
    const isFirstDecision = state.view === 0;

    return `
        <div class="scenario-card">

            ${isFirstDecision ? renderScene(lesson.scene) : ""}

            ${renderParagraphs(decision.body)}

            <h3 class="scenario-prompt" id="scenarioPrompt" tabindex="-1">${decision.prompt}</h3>

            <div class="scenario-options" role="group" aria-labelledby="scenarioPrompt">
                ${decision.options.map(option => `
                    <button
                        class="btn btn-outline-primary scenario-option"
                        type="button"
                        data-scenario-option="${option.id}"
                        aria-pressed="${chosen?.id === option.id ? "true" : "false"}"
                        ${chosen ? "disabled" : ""}>
                        ${option.label}
                    </button>
                `).join("")}
            </div>

            <p class="response-validation mt-3 mb-0" id="scenarioValidation" aria-live="polite" aria-atomic="true" hidden></p>

            <div id="scenarioOutcomeRegion">
                ${chosen ? renderOutcome(chosen, lesson) + renderQuestion(getDecisionQuestion(decision)) : ""}
            </div>

        </div>
    `;
}

function renderReviewOption(option, isChosen) {
    return `
        <li class="scenario-review-option${isChosen ? " is-chosen" : ""}">
            ${isChosen ? `<p class="scenario-review-marker">Your choice</p>` : ""}
            <p class="scenario-review-label">${option.label}</p>
            ${option.tag ? `<p class="scenario-tag">${option.tag}</p>` : ""}
            ${renderParagraphs(option.outcome)}
            ${option.explanation?.length ? `
                <div class="scenario-review-why">
                    <p class="scenario-review-why-label">Why</p>
                    ${renderParagraphs(option.explanation)}
                </div>
            ` : ""}
            ${option.recommended ? `<p class="scenario-review-recommended">Most effective response here</p>` : ""}
        </li>
    `;
}

// The step after the last decision: how each choice played out, then
// the open question, before anything is revealed on the compare screen.
function renderQuestionView(lesson, state) {
    const choices = getScenarioChoices(lesson, state);

    return `
        <div class="scenario-card">

            <h3 class="scenario-prompt" id="scenarioPrompt" tabindex="-1">How your choices played out</h3>

            <ol class="scenario-played-out">
                ${choices.map(({ decision, option }) => `
                    <li>
                        <p class="scenario-played-out-prompt">${decision.prompt}</p>
                        <p class="scenario-outcome-choice">
                            <span class="scenario-outcome-label">You chose:</span>
                            ${option.label}
                        </p>
                        ${renderParagraphs(option.outcome)}
                    </li>
                `).join("")}
            </ol>

            ${renderQuestion(getScenarioQuestion(lesson))}

        </div>
    `;
}

// The learner's own answer to a decision's open question, shown beside
// the reasons so they can compare the two.
function renderReviewAnswer(question) {
    if (!question) return "";

    const answer = loadResponse(question.storageKey);

    if (!hasResponse(answer)) return "";

    return `
        <div class="scenario-review-answer">
            <p class="scenario-review-answer-label">Your answer to: ${question.prompt}</p>
            <p class="scenario-review-answer-text">${escapeText(answer)}</p>
        </div>
    `;
}

function renderDebrief(debrief) {
    if (!debrief) return "";

    const takeaways = debrief.takeaways?.length ? `
        <ul class="mb-0">
            ${debrief.takeaways.map(takeaway => `<li>${takeaway}</li>`).join("")}
        </ul>
    ` : "";

    return `
        <div class="scenario-debrief">
            ${debrief.title ? `<h3 class="h5">${debrief.title}</h3>` : ""}
            ${renderParagraphs(debrief.body)}
            ${takeaways}
        </div>
    `;
}

function renderReviewView(lesson, state) {
    const choices = getScenarioChoices(lesson, state);

    return `
        <div class="scenario-card">

            <h3 class="scenario-prompt" id="scenarioPrompt" tabindex="-1">Compare the paths</h3>

            <p>
                Here is every choice you could have made and where it leads.
                Your own choices are marked.
            </p>

            ${renderReviewAnswer(getScenarioQuestion(lesson))}

            ${choices.map(({ decision, option }) => `
                <section class="scenario-review-decision">
                    <h4 class="h6 scenario-review-prompt">${decision.prompt}</h4>
                    <ul class="scenario-review-grid">
                        ${decision.options.map(reviewOption =>
                            renderReviewOption(reviewOption, reviewOption.id === option.id)
                        ).join("")}
                    </ul>
                    ${renderReviewAnswer(getDecisionQuestion(decision))}
                </section>
            `).join("")}

            ${renderDebrief(lesson.debrief)}

            <button class="btn btn-outline-secondary secondary-navigation-button mt-4" type="button" id="scenarioRestart">
                Try a different path
            </button>

        </div>
    `;
}

function getProgressText(lesson, state, view) {
    if (view.kind === "review") return "Review";
    if (view.kind === "question") return "Before you compare";

    const usesCustomBranching = getScenarioDecisions(lesson).some(decision =>
        (decision.options || []).some(option => option.next)
    );
    const position = state.view + 1;

    return usesCustomBranching
        ? `Decision ${position}`
        : `Decision ${position} of ${getScenarioDecisions(lesson).length}`;
}

// ======================================
// Behavior
// ======================================

export function initializeBranchingScenario(lesson, context = {}) {
    if (lesson.type !== "branchingScenario") return;

    const stage = document.getElementById("scenarioStage");
    const progress = document.getElementById("scenarioProgress");

    if (!stage) return;

    validateScenario(lesson).forEach(problem =>
        console.warn(`Scenario "${lesson.id}": ${problem}`)
    );

    let state = loadScenarioState(lesson);

    function focusElement(id) {
        const element = document.getElementById(id);

        if (element) element.focus();
    }

    function getQuestionField() {
        return stage.querySelector("[data-scenario-question]");
    }

    // Skip for Now is offered while something is still unanswered:
    // a choice, or the open question that follows it.
    function updateSkipButton() {
        const view = getScenarioView(lesson, state);
        const questionField = getQuestionField();
        const needsChoice = view.kind === "decision" && !view.chosenOptionId;
        const needsAnswer = Boolean(questionField) && !hasResponse(questionField.value);

        document.querySelectorAll("[data-action='skip']").forEach(button => {
            button.hidden = !(needsChoice || needsAnswer);
        });
    }

    function moveTo(nextState) {
        state = nextState;
        saveScenarioState(lesson, state);
        renderCurrentView("scenarioPrompt");
    }

    function renderCurrentView(focusTargetId = null) {
        const view = getScenarioView(lesson, state);

        stage.innerHTML = view.kind === "review"
            ? renderReviewView(lesson, state)
            : view.kind === "question"
                ? renderQuestionView(lesson, state)
                : renderDecisionView(lesson, state, view);

        if (progress) progress.textContent = getProgressText(lesson, state, view);

        // Keep the module's progress bar in step with the scenario.
        context.updateModuleStep?.(state.view);

        updateSkipButton();

        const questionField = getQuestionField();

        if (questionField) {
            questionField.addEventListener("input", () => {
                saveResponse(questionField.dataset.storageKey, questionField.value);

                if (hasResponse(questionField.value)) clearResponseValidation(questionField);

                const status = document.getElementById(`${questionField.dataset.storageKey}Status`);

                if (status) status.textContent = "✓ Saved";

                updateSkipButton();
                context.onResponsesChanged?.();
            });
        }

        stage.querySelectorAll("[data-scenario-option]").forEach(button => {
            button.addEventListener("click", () => {
                const updated = chooseScenarioOption(lesson, state, button.dataset.scenarioOption);

                if (updated === state) return;

                state = updated;
                saveScenarioState(lesson, state);
                renderCurrentView("scenarioOutcome");
            });
        });

        const restartButton = document.getElementById("scenarioRestart");

        if (restartButton) {
            restartButton.addEventListener("click", () => {
                state = createScenarioState();
                saveScenarioState(lesson, state);
                renderCurrentView("scenarioPrompt");
            });
        }

        if (focusTargetId) focusElement(focusTargetId);
    }

    // The lesson's own Next and Previous buttons move through the
    // scenario, so there is only one set of navigation on the screen.
    // Each returns true when the scenario handled the click.
    context.advanceBranchingScenario = () => {
        const result = advanceScenario(lesson, state);

        if (result.needsChoice) {
            const message = document.getElementById("scenarioValidation");

            if (message) {
                message.hidden = false;
                message.textContent = SCENARIO_CHOICE_REQUIRED_MESSAGE;
            }

            const firstOption = stage.querySelector("[data-scenario-option]");

            if (firstOption) firstOption.focus();

            return true;
        }

        if (!result.moved) return false;

        // An open question asks for an answer before the scenario moves on.
        const questionField = getQuestionField();

        if (questionField) {
            if (!validateResponseField(questionField)) {
                questionField.focus();
                return true;
            }

            saveResponse(questionField.dataset.storageKey, questionField.value);
        }

        moveTo(result.state);

        return true;
    };

    // Skip for Now passes an unanswered open question and stays in the
    // scenario. With no choice made yet, it returns false so the lesson
    // itself is skipped.
    context.skipBranchingScenario = () => {
        const questionField = getQuestionField();
        const result = advanceScenario(lesson, state);

        if (!questionField || !result.moved) return false;

        saveResponse(questionField.dataset.storageKey, questionField.value);
        moveTo(result.state);

        return true;
    };

    context.retreatBranchingScenario = () => {
        const result = retreatScenario(state);

        if (!result.moved) return false;

        moveTo(result.state);

        return true;
    };

    renderCurrentView();
}

// ======================================
// Recap on a later screen
// ======================================
//
// Shows the learner's saved choices, for example above a reflection
// that asks them to think about what they chose.

export function renderScenarioRecap(scenarioLesson) {
    if (!scenarioLesson || scenarioLesson.type !== "branchingScenario") return "";

    const choices = getScenarioChoices(scenarioLesson, loadScenarioState(scenarioLesson));

    if (!choices.length) {
        return `
            <div class="scenario-recap">
                <p class="mb-0">You have not made any choices in “${scenarioLesson.title}” yet.</p>
            </div>
        `;
    }

    return `
        <div class="scenario-recap">
            <p class="scenario-recap-title">Your choices in “${scenarioLesson.title}”</p>
            <dl class="mb-0">
                ${choices.map(({ decision, option }) => `
                    <dt>${decision.prompt}</dt>
                    <dd>${option.label}${option.tag ? ` <span class="scenario-tag">${option.tag}</span>` : ""}</dd>
                `).join("")}
            </dl>
        </div>
    `;
}
