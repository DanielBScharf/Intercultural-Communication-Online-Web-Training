// ======================================
// Inquiry Activity
// js/inquiryActivity.js
// ======================================
//
// Purpose:
// A reusable activity about finding things out before acting. The
// learner meets an unclear situation, writes their own explanations,
// then chooses a limited number of things to ask or observe. Each
// choice shows what it reveals. A review then shows every option, how
// much each one could tell them, and what was really going on.
//
// This file holds the logic and layout only. The situation itself
// belongs in a module file (modules/*.js).
//
// How to use it in a module:
//
// {
//     id: "my-inquiry",
//     type: "inquiry",
//     title: "...",
//     moduleLabel: "...",
//     instructions: "...",                 // optional
//
//     scene: { body: ["...", "..."] },
//
//     question: {                          // written before the choices appear
//         prompt: "...",
//         storageKey: "myExplanations",    // saved like any other reflection
//         reflectionTitle: "...",
//         rationale: "...",
//         placeholder: "..."
//     },
//
//     picks: 3,                            // how many options the learner may choose
//     prompt: "Choose three things to do.",
//
//     options: [
//         {
//             id: "ask-host",
//             label: "Ask your host who everyone is.",
//             result: ["What the learner finds out."],
//             value: "high",               // "high", "some" or "low": how much it tells them
//             why: "Why it was or was not useful.",
//             audio: "audio/ask-host.mp3"  // optional voice-over for the result
//         }
//     ],
//
//     debrief: {
//         title: "...",
//         body: ["..."],
//         leftTitle: "...",  leftItems: ["..."],     // optional pair of lists
//         rightTitle: "...", rightItems: ["..."],
//         note: "...",                               // optional
//         takeaways: ["..."]                         // optional
//     }
// }
//
// The activity has three steps: the question, the choices, and the
// review. The lesson's own Next and Previous buttons move between them.
// ======================================

import { saveItem, loadItem, saveResponse, loadResponse } from "./storage.js";

export const INQUIRY_WRITING_REQUIRED_MESSAGE =
    "Write your explanations before continuing, or choose Skip for Now.";

const VALUE_LABELS = {
    high: "Tells you a lot",
    some: "Tells you something",
    low: "Tells you little"
};

// ======================================
// Logic (no page access, so it can be tested on its own)
// ======================================

export function getInquiryOptions(lesson) {
    return lesson?.options || [];
}

export function getInquiryOption(lesson, optionId) {
    return getInquiryOptions(lesson).find(option => option.id === optionId) || null;
}

// How many options the learner may choose. Never more than there are.
export function getPickLimit(lesson) {
    const total = getInquiryOptions(lesson).length;
    const wanted = Number(lesson?.picks) || total;

    return Math.max(1, Math.min(wanted, total));
}

export function getInquiryStepCount() {
    return 3;
}

export function createInquiryState() {
    return { step: 0, picks: [] };
}

export function getPicksLeft(lesson, state) {
    return Math.max(getPickLimit(lesson) - state.picks.length, 0);
}

// A pick cannot be taken back: the learner has already seen the result.
export function pickInquiryOption(lesson, state, optionId) {
    if (state.step !== 1) return state;
    if (!getInquiryOption(lesson, optionId)) return state;
    if (state.picks.includes(optionId)) return state;
    if (getPicksLeft(lesson, state) === 0) return state;

    return { ...state, picks: [...state.picks, optionId] };
}

// hasAnswer: whether the learner has written something for the question.
// force: move on anyway (Skip for Now).
export function advanceInquiry(lesson, state, { hasAnswer = false, force = false } = {}) {
    if (state.step === 0) {
        if (lesson?.question && !hasAnswer && !force) return { state, moved: false, needsWriting: true };

        return { state: { ...state, step: 1 }, moved: true };
    }

    if (state.step === 1) {
        if (getPicksLeft(lesson, state) > 0) return { state, moved: false, needsPicks: true };

        return { state: { ...state, step: 2 }, moved: true };
    }

    return { state, moved: false };
}

export function retreatInquiry(state) {
    if (state.step <= 0) return { state, moved: false };

    return { state: { ...state, step: state.step - 1 }, moved: true };
}

// Saved progress may be missing, damaged, or left over from an older
// version of the activity.
export function restoreInquiryState(lesson, saved) {
    if (!saved || typeof saved !== "object") return createInquiryState();

    const ids = new Set(getInquiryOptions(lesson).map(option => option.id));
    const picks = Array.isArray(saved.picks)
        ? [...new Set(saved.picks.filter(id => ids.has(id)))].slice(0, getPickLimit(lesson))
        : [];
    let step = [0, 1, 2].includes(saved.step) ? saved.step : 0;

    if (step === 2 && picks.length < getPickLimit(lesson)) step = 1;

    return { step, picks };
}

// The written question, in the shape the Reflection Summary uses for
// other written responses.
export function getInquiryQuestions(lesson) {
    const question = lesson?.question;

    if (!question?.storageKey) return [];

    return [{
        prompt: question.prompt,
        storageKey: question.storageKey,
        reflectionTitle: question.reflectionTitle,
        rationale: question.rationale,
        competencies: question.competencies || lesson.competencies || [],
        learningObjectives: question.learningObjectives || lesson.learningObjectives || []
    }];
}

// Problems in the module data, reported in the console while authoring.
export function validateInquiry(lesson) {
    const problems = [];
    const options = getInquiryOptions(lesson);
    const ids = new Set();

    if (options.length < 2) problems.push("needs at least two options.");
    if (lesson?.picks && lesson.picks >= options.length) problems.push("picks should be fewer than the number of options, so the learner has to choose.");
    if (lesson?.question && !lesson.question.storageKey) problems.push("the question has no storageKey.");

    options.forEach((option, index) => {
        const name = option.id || `option ${index + 1}`;

        if (!option.id) problems.push(`option ${index + 1} has no id.`);
        if (option.id && ids.has(option.id)) problems.push(`option id "${option.id}" is used more than once.`);
        if (option.id) ids.add(option.id);
        if (!option.label) problems.push(`"${name}" has no label.`);
        if (!option.result?.length) problems.push(`"${name}" has no result.`);
        if (!VALUE_LABELS[option.value]) problems.push(`"${name}" needs a value of "high", "some" or "low".`);
    });

    return problems;
}

// ======================================
// Saved progress
// ======================================

// A copy of an activity (for example in the showcase) shares progress
// with the original through its stateId.
function getInquiryStorageKey(lesson) {
    return `inquiry_${lesson.stateId || lesson.id}`;
}

export function loadInquiryState(lesson) {
    return restoreInquiryState(lesson, loadItem(getInquiryStorageKey(lesson), null));
}

function saveInquiryState(lesson, state) {
    saveItem(getInquiryStorageKey(lesson), state);
}

// ======================================
// Layout
// ======================================

export function renderInquiryContent(lesson) {
    return `
        <div class="inquiry-activity" data-inquiry-id="${lesson.id}">

            ${lesson.instructions ? `<p class="lead">${lesson.instructions}</p>` : ""}

            <p class="scenario-progress" id="inquiryProgress" aria-live="polite"></p>

            <div id="inquiryStage"></div>

        </div>
    `;
}

function renderParagraphs(body = []) {
    return (body || []).map(paragraph => `<p>${paragraph}</p>`).join("");
}

// Learner text is shown as plain text, never as HTML.
function escapeText(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function renderScene(lesson) {
    return lesson.scene?.body
        ? `<div class="scenario-scene">${renderParagraphs(lesson.scene.body)}</div>`
        : "";
}

function renderQuestionView(lesson) {
    const question = lesson.question || {};

    return `
        <div class="scenario-card">

            ${renderScene(lesson)}

            <label class="scenario-prompt d-block" for="inquiryAnswer" id="inquiryPrompt" tabindex="-1">${question.prompt || ""}</label>

            <textarea class="form-control" id="inquiryAnswer" rows="5"
                data-storage-key="${question.storageKey || ""}"
                aria-describedby="inquiryValidation"
                placeholder="${question.placeholder || "Write your response here..."}">${escapeText(loadResponse(question.storageKey))}</textarea>

            <p class="text-danger mt-2" id="inquiryValidation" role="alert" hidden></p>

        </div>
    `;
}

function renderResult(option) {
    return `
        <div class="inquiry-result">
            ${renderParagraphs(option.result)}
            ${option.audio ? `<audio class="scenario-audio" controls preload="none" src="${option.audio}"></audio>` : ""}
        </div>
    `;
}

function renderPickView(lesson, state) {
    const left = getPicksLeft(lesson, state);

    const options = getInquiryOptions(lesson).map(option => {
        const picked = state.picks.includes(option.id);

        return `
            <li class="inquiry-option ${picked ? "is-picked" : ""}">
                <button type="button" class="btn btn-outline-primary scenario-option w-100"
                    data-inquiry-option="${option.id}" aria-pressed="${picked}"
                    ${picked || left === 0 ? "disabled" : ""}>
                    ${option.label}
                </button>
                ${picked ? renderResult(option) : ""}
            </li>
        `;
    }).join("");

    return `
        <div class="scenario-card">

            ${renderScene(lesson)}

            <h3 class="scenario-prompt" id="inquiryPrompt" tabindex="-1">${lesson.prompt || `Choose ${getPickLimit(lesson)}.`}</h3>

            <p class="inquiry-count" id="inquiryCount" aria-live="polite">
                ${left === 0 ? "You have used all your choices. Select Next to see what the others would have told you." : `Choices left: ${left} of ${getPickLimit(lesson)}`}
            </p>

            <ul class="inquiry-options">${options}</ul>

            <p class="text-danger" id="inquiryValidation" role="alert" hidden></p>

        </div>
    `;
}

function renderReviewOption(option, picked) {
    return `
        <li class="scenario-review-option ${picked ? "is-chosen" : ""}">
            ${picked ? `<p class="scenario-review-marker">You chose this</p>` : ""}
            <p class="scenario-review-label">${option.label}</p>
            <p class="inquiry-value is-${option.value}">${VALUE_LABELS[option.value] || ""}</p>
            ${renderParagraphs(option.result)}
            ${option.why ? `<p class="inquiry-why">${option.why}</p>` : ""}
        </li>
    `;
}

function renderDebrief(debrief = {}) {
    const hasColumns = debrief.leftItems?.length && debrief.rightItems?.length;

    return `
        <div class="scenario-debrief">

            <h4 class="h5">${debrief.title || "What was going on"}</h4>

            ${renderParagraphs(debrief.body)}

            ${hasColumns ? `
                <div class="row g-3 my-2">
                    <div class="col-md-6">
                        <div class="inquiry-column">
                            <h5 class="h6">${debrief.leftTitle || ""}</h5>
                            <ul>${debrief.leftItems.map(item => `<li>${item}</li>`).join("")}</ul>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="inquiry-column">
                            <h5 class="h6">${debrief.rightTitle || ""}</h5>
                            <ul>${debrief.rightItems.map(item => `<li>${item}</li>`).join("")}</ul>
                        </div>
                    </div>
                </div>
            ` : ""}

            ${debrief.note ? `<p>${debrief.note}</p>` : ""}

            ${debrief.takeaways?.length ? `
                <ul>${debrief.takeaways.map(point => `<li>${point}</li>`).join("")}</ul>
            ` : ""}

        </div>
    `;
}

function renderReviewView(lesson, state) {
    const answer = lesson.question?.storageKey ? loadResponse(lesson.question.storageKey) : "";
    const found = state.picks
        .map(id => getInquiryOption(lesson, id))
        .filter(option => option?.value === "high").length;

    return `
        <div class="scenario-card">

            <h3 class="scenario-prompt" id="inquiryPrompt" tabindex="-1">What each choice would have told you</h3>

            <p>
                ${found} of your ${state.picks.length} choices were among the most informative.
                Here is every option, including the ones you did not choose.
            </p>

            <ul class="inquiry-review">
                ${getInquiryOptions(lesson).map(option => renderReviewOption(option, state.picks.includes(option.id))).join("")}
            </ul>

            ${answer.trim() ? `
                <div class="scenario-review-answer">
                    <p class="scenario-review-answer-label">Your explanations</p>
                    <p class="scenario-review-answer-text">${escapeText(answer)}</p>
                </div>
            ` : ""}

            ${renderDebrief(lesson.debrief)}

            <button type="button" class="btn btn-outline-secondary btn-sm mt-3" id="inquiryRestart">
                Choose again
            </button>

        </div>
    `;
}

const PROGRESS_LABELS = ["Step 1 of 3", "Step 2 of 3", "Review"];

// ======================================
// Behavior
// ======================================

export function initializeInquiry(lesson, context = {}) {
    if (lesson.type !== "inquiry") return;

    const stage = document.getElementById("inquiryStage");
    const progress = document.getElementById("inquiryProgress");

    if (!stage) return;

    validateInquiry(lesson).forEach(problem =>
        console.warn(`Inquiry "${lesson.id}": ${problem}`)
    );

    let state = loadInquiryState(lesson);

    function setState(nextState) {
        state = nextState;
        saveInquiryState(lesson, state);
    }

    function showMessage(text) {
        const message = document.getElementById("inquiryValidation");

        if (!message) return;

        message.hidden = !text;
        message.textContent = text;
    }

    function saveAnswer() {
        const field = document.getElementById("inquiryAnswer");

        if (field?.dataset.storageKey) saveResponse(field.dataset.storageKey, field.value);

        return field ? field.value.trim().length > 0 : false;
    }

    function renderCurrentView(focusId = null) {
        const views = [renderQuestionView, renderPickView, renderReviewView];

        stage.innerHTML = views[state.step](lesson, state);

        if (progress) progress.textContent = PROGRESS_LABELS[state.step];

        // Keep the module's progress bar in step with the activity.
        context.updateModuleStep?.(state.step);

        // Skip for Now is offered until the review.
        document.querySelectorAll("[data-action='skip']").forEach(button => {
            button.hidden = state.step === 2;
        });

        const answerField = document.getElementById("inquiryAnswer");

        if (answerField) {
            answerField.addEventListener("input", () => {
                saveResponse(answerField.dataset.storageKey, answerField.value);

                if (answerField.value.trim()) showMessage("");
            });
        }

        stage.querySelectorAll("[data-inquiry-option]").forEach(button => {
            button.addEventListener("click", () => {
                const updated = pickInquiryOption(lesson, state, button.dataset.inquiryOption);

                if (updated === state) return;

                setState(updated);
                renderCurrentView("inquiryCount");
            });
        });

        const restartButton = document.getElementById("inquiryRestart");

        if (restartButton) {
            restartButton.addEventListener("click", () => {
                setState({ step: 1, picks: [] });
                renderCurrentView("inquiryPrompt");
                stage.scrollIntoView({ block: "start" });
            });
        }

        if (focusId) {
            const target = document.getElementById(focusId);

            if (target) {
                target.setAttribute("tabindex", "-1");
                target.focus();
            }
        }
    }

    function move(result) {
        setState(result.state);
        renderCurrentView("inquiryPrompt");
        stage.scrollIntoView({ block: "start" });
    }

    // The lesson's own Next, Previous and Skip for Now buttons drive the
    // activity. Each returns true when the activity handled the click.
    context.advanceInquiry = () => {
        const hasAnswer = state.step === 0 ? saveAnswer() : false;
        const result = advanceInquiry(lesson, state, { hasAnswer });

        if (result.needsWriting) {
            showMessage(INQUIRY_WRITING_REQUIRED_MESSAGE);
            document.getElementById("inquiryAnswer")?.focus();

            return true;
        }

        if (result.needsPicks) {
            const left = getPicksLeft(lesson, state);

            showMessage(left === 1 ? "Choose 1 more before continuing." : `Choose ${left} more before continuing.`);
            stage.querySelector("[data-inquiry-option]:not([disabled])")?.focus();

            return true;
        }

        if (!result.moved) return false;

        move(result);

        return true;
    };

    context.retreatInquiry = () => {
        if (state.step === 0) saveAnswer();

        const result = retreatInquiry(state);

        if (!result.moved) return false;

        move(result);

        return true;
    };

    // Skipping the question moves on to the choices. Skipping the
    // choices leaves the activity.
    context.skipInquiry = () => {
        if (state.step !== 0) return false;

        saveAnswer();
        move(advanceInquiry(lesson, state, { force: true }));

        return true;
    };

    renderCurrentView();
}
