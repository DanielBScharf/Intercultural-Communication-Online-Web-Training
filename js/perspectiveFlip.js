// ======================================
// Perspective Flip
// js/perspectiveFlip.js
// ======================================
//
// Purpose:
// A reusable activity that shows the same moment from two points of
// view. The learner sees one person's view of a picture, guesses what
// the other person is thinking, then flips to the other view. A closing
// table sets the two views side by side.
//
// This file contains ONLY the activity logic and layout.
// The content lives in modules/*.js, so any module can add a
// perspective flip without changing this file.
//
// How to use it in a module:
//
// {
//     id: "my-perspectives",             // unique lesson id
//     type: "perspectiveFlip",
//     title: "Two Sides of the Counter",
//     moduleLabel: "Prague Example Practice",
//     instructions: "Optional line shown above the activity.",
//     note: "Optional note, for example that one view is an estimate.",
//     writeFirst: false,                 // optional, see the note at the end
//
//     views: {                           // names for the two sides
//         first: "The student",
//         second: "The clerk"
//     },
//
//     panels: [
//         {
//             id: "counter",             // unique within the activity
//             image: "images/...",
//             imageAlt: "...",
//
//             first: {                   // shown before the flip
//                 thought: "Why is she angry with me?",
//                 feeling: "Alarmed"     // optional
//             },
//
//             guess: {
//                 prompt: "What might she be thinking?",
//                 placeholder: "In a few words...",       // for the written guess
//                 options: [
//                     {
//                         id: "angry",   // unique within the panel
//                         label: "She is angry with him.",
//                         feedback: "Shown after the flip."   // optional
//                     }
//                 ]
//             },
//
//             second: {                  // shown after the flip
//                 said: [                // optional, for example translations
//                     { original: "Ne tady!", meaning: "Not here!" }
//                 ],
//                 thought: "He is at the wrong window.",
//                 feeling: "Frustrated"  // optional
//             }
//         }
//     ],
//
//     summary: {                         // optional closing table
//         title: "Same moment, two views",
//         intro: ["Optional paragraphs."],
//         rows: [
//             { label: "Describe", detail: "what happened", first: "...", second: "..." }
//         ],
//         note: "Optional closing line."
//     }
// }
//
// The learner first writes a short guess. The options stay hidden until
// they have written something, so they think before they see the
// choices. Then they pick the closest option, which flips the panel.
// Set writeFirst: false to show the options straight away and make the
// written guess optional. Skip for Now flips a panel without a guess.
// Guesses are saved in the browser. They are quick guesses, not
// reflections, so they do not appear in the Reflection Summary and
// never block module completion.
// ======================================

import { saveItem, loadItem } from "./storage.js";

export const PERSPECTIVE_GUESS_REQUIRED_MESSAGE =
    "Choose the closest guess to continue, or choose Skip for Now.";

export const PERSPECTIVE_WRITING_REQUIRED_MESSAGE =
    "Write a short guess to see the choices, or choose Skip for Now.";

// Whether the options wait until the learner has written a guess.
export function writesFirst(lesson) {
    return lesson?.writeFirst !== false;
}

// ======================================
// Activity logic
// ======================================
//
// These functions do not touch the page, so they can be tested on
// their own.

export function getPerspectivePanels(lesson) {
    return lesson?.panels || [];
}

export function getPerspectivePanel(lesson, panelId) {
    return getPerspectivePanels(lesson).find(panel => panel.id === panelId) || null;
}

export function getGuessOption(panel, optionId) {
    return (panel?.guess?.options || []).find(option => option.id === optionId) || null;
}

function hasSummary(lesson) {
    return Boolean(lesson?.summary?.rows?.length);
}

// The last step a learner can reach: the closing table if there is one,
// otherwise the final panel.
export function getLastPerspectiveStep(lesson) {
    const panelCount = getPerspectivePanels(lesson).length;

    return hasSummary(lesson) ? panelCount : Math.max(panelCount - 1, 0);
}

// How many steps the activity adds to the module's progress bar.
export function getPerspectiveStepCount(lesson) {
    return getLastPerspectiveStep(lesson) + 1;
}

export function createPerspectiveState() {
    return { step: 0, answers: {} };
}

// What the learner should see for the current step.
export function getPerspectiveView(lesson, state) {
    const panels = getPerspectivePanels(lesson);

    if (state.step < panels.length) {
        const panel = panels[state.step];
        const answer = state.answers[panel.id] || null;

        return { kind: "panel", panelId: panel.id, flipped: Boolean(answer), answer };
    }

    return { kind: "summary" };
}

// Records the learner's guess for the current panel and flips it.
// A guess that is already made stays as it is until the learner restarts.
export function guessPerspective(lesson, state, optionId, text = "") {
    const view = getPerspectiveView(lesson, state);

    if (view.kind !== "panel" || view.flipped) return state;
    if (!getGuessOption(getPerspectivePanel(lesson, view.panelId), optionId)) return state;

    return {
        step: state.step,
        answers: { ...state.answers, [view.panelId]: { optionId, text: String(text || "").trim() } }
    };
}

// Flips the current panel without a guess (Skip for Now).
export function revealPerspective(lesson, state, text = "") {
    const view = getPerspectiveView(lesson, state);

    if (view.kind !== "panel" || view.flipped) return state;

    return {
        step: state.step,
        answers: { ...state.answers, [view.panelId]: { optionId: null, text: String(text || "").trim() } }
    };
}

// Moves forward one step. "moved" is false when there is nowhere to go:
// either a guess is still needed, or the learner is on the last step
// and the lesson itself should move on.
export function advancePerspective(lesson, state) {
    const view = getPerspectiveView(lesson, state);

    if (view.kind === "panel" && !view.flipped) {
        return { state, moved: false, needsGuess: true, finished: false };
    }

    if (state.step >= getLastPerspectiveStep(lesson)) {
        return { state, moved: false, needsGuess: false, finished: true };
    }

    return {
        state: { ...state, step: state.step + 1 },
        moved: true,
        needsGuess: false,
        finished: false
    };
}

export function retreatPerspective(state) {
    if (state.step <= 0) return { state, moved: false };

    return { state: { ...state, step: state.step - 1 }, moved: true };
}

// Saved progress can go out of date when the content is edited.
// Keep only what still matches, and never skip past an unflipped panel.
export function restorePerspectiveState(lesson, saved) {
    const state = createPerspectiveState();

    if (!saved || typeof saved !== "object") return state;

    const panels = getPerspectivePanels(lesson);
    let reachable = 0;

    for (const panel of panels) {
        const answer = saved.answers?.[panel.id];

        if (!answer || typeof answer !== "object") break;

        const optionId = getGuessOption(panel, answer.optionId) ? answer.optionId : null;

        state.answers[panel.id] = { optionId, text: String(answer.text || "") };
        reachable++;
    }

    const lastReachable = Math.min(reachable, getLastPerspectiveStep(lesson));
    const savedStep = Number.isInteger(saved.step) ? saved.step : lastReachable;

    state.step = Math.min(Math.max(savedStep, 0), lastReachable);

    return state;
}

// The learner's guesses, in panel order, for the closing table.
export function getPerspectiveGuesses(lesson, state) {
    return getPerspectivePanels(lesson)
        .filter(panel => state.answers[panel.id])
        .map(panel => {
            const answer = state.answers[panel.id];

            return { panel, option: getGuessOption(panel, answer.optionId), text: answer.text };
        });
}

// Lists content mistakes so they are caught while writing, not by a
// learner. Returns an empty list when the content is sound.
export function validatePerspectiveFlip(lesson) {
    const problems = [];
    const panels = getPerspectivePanels(lesson);
    const panelIds = panels.map(panel => panel.id);

    if (!panels.length) problems.push("The activity has no panels.");
    if (!lesson?.views?.first || !lesson?.views?.second) problems.push("The activity needs a name for each of its two views.");

    panels.forEach((panel, index) => {
        const name = panel.id || `panel ${index + 1}`;

        if (!panel.id) problems.push(`Panel ${index + 1} has no id.`);
        if (panelIds.indexOf(panel.id) !== index) problems.push(`Panel id "${panel.id}" is used more than once.`);
        if (!panel.image) problems.push(`Panel "${name}" has no image.`);
        if (!panel.imageAlt) problems.push(`Panel "${name}" has no image description.`);
        if (!panel.first?.thought) problems.push(`Panel "${name}" has no thought for the first view.`);
        if (!panel.second?.thought) problems.push(`Panel "${name}" has no thought for the second view.`);
        if (!panel.guess?.prompt) problems.push(`Panel "${name}" has no guess prompt.`);

        const options = panel.guess?.options || [];
        const optionIds = options.map(option => option.id);

        if (options.length < 2) problems.push(`Panel "${name}" needs at least two guess options.`);

        options.forEach((option, optionIndex) => {
            if (!option.id) problems.push(`A guess option in "${name}" has no id.`);
            if (optionIds.indexOf(option.id) !== optionIndex) problems.push(`Guess option id "${option.id}" is used more than once in "${name}".`);
            if (!option.label) problems.push(`A guess option in "${name}" has no label.`);
        });
    });

    (lesson?.summary?.rows || []).forEach((row, index) => {
        if (!row.label || !row.first || !row.second) problems.push(`Summary row ${index + 1} needs a label and both views.`);
    });

    return problems;
}

// ======================================
// Saved progress
// ======================================

function getPerspectiveStorageKey(lesson) {
    return `perspective_${lesson.id}`;
}

export function loadPerspectiveState(lesson) {
    return restorePerspectiveState(lesson, loadItem(getPerspectiveStorageKey(lesson), null));
}

function savePerspectiveState(lesson, state) {
    saveItem(getPerspectiveStorageKey(lesson), state);
}

// ======================================
// Layout
// ======================================

export function renderPerspectiveFlipContent(lesson) {
    return `
        <div class="perspective-flip" data-perspective-id="${lesson.id}">

            ${lesson.instructions ? `<p class="lead">${lesson.instructions}</p>` : ""}

            ${lesson.note ? `<p class="perspective-note">${lesson.note}</p>` : ""}

            <p class="scenario-progress" id="perspectiveProgress" aria-live="polite"></p>

            <div id="perspectiveStage"></div>

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

function renderSaid(said = []) {
    if (!said?.length) return "";

    return `
        <dl class="perspective-said">
            ${said.map(line => `
                <div>
                    <dt lang="${line.lang || ""}">${line.original}</dt>
                    <dd>${line.meaning}</dd>
                </div>
            `).join("")}
        </dl>
    `;
}

function renderViewCard(viewName, side, isSecond) {
    return `
        <div class="perspective-view ${isSecond ? "is-second" : "is-first"}" id="perspectiveView" tabindex="-1">
            <p class="perspective-view-name">${viewName}</p>
            ${isSecond ? renderSaid(side.said) : ""}
            <p class="perspective-thought">“${side.thought}”</p>
            ${side.feeling ? `<p class="perspective-feeling"><span>Feeling:</span> ${side.feeling}</p>` : ""}
        </div>
    `;
}

function renderGuessForm(lesson, panel) {
    const guess = panel.guess;
    const waitsForWriting = writesFirst(lesson);

    return `
        <div class="perspective-guess">

            <label class="form-label fw-semibold" for="perspectiveGuessText">${guess.prompt}</label>

            <input
                type="text"
                id="perspectiveGuessText"
                class="form-control reflection-box perspective-guess-text"
                maxlength="200"
                autocomplete="off"
                placeholder="${guess.placeholder || "In a few words..."}">

            ${waitsForWriting ? `
                <button class="btn btn-primary" type="button" id="perspectiveShowOptions" disabled>
                    See the choices
                </button>
            ` : ""}

            <div id="perspectiveOptions" ${waitsForWriting ? "hidden" : ""}>

                <p class="perspective-guess-step" id="perspectiveOptionsLabel" tabindex="-1">
                    ${waitsForWriting ? "Now" : "Then"} choose the closest guess to see the other view.
                </p>

                <div class="scenario-options" role="group" aria-labelledby="perspectiveOptionsLabel">
                    ${guess.options.map(option => `
                        <button
                            class="btn btn-outline-primary scenario-option"
                            type="button"
                            data-perspective-option="${option.id}">
                            ${option.label}
                        </button>
                    `).join("")}
                </div>

            </div>

            <p class="response-validation mt-3 mb-0" id="perspectiveValidation" aria-live="polite" aria-atomic="true" hidden></p>

        </div>
    `;
}

function renderGuessResult(panel, answer) {
    const option = getGuessOption(panel, answer.optionId);

    if (!option && !answer.text) return "";

    return `
        <div class="perspective-result">
            ${answer.text ? `<p><span class="perspective-result-label">You wrote:</span> ${escapeText(answer.text)}</p>` : ""}
            ${option ? `<p><span class="perspective-result-label">Your guess:</span> ${option.label}</p>` : ""}
            ${option?.feedback ? `<p class="mb-0">${option.feedback}</p>` : ""}
        </div>
    `;
}

// After the flip, the learner can switch between the two views.
function renderViewToggle(lesson, showing) {
    return `
        <div class="perspective-toggle" role="group" aria-label="Whose view to show">
            ${["first", "second"].map(side => `
                <button
                    class="btn btn-outline-primary perspective-toggle-button"
                    type="button"
                    data-perspective-show="${side}"
                    aria-pressed="${showing === side ? "true" : "false"}">
                    ${lesson.views?.[side] || side}
                </button>
            `).join("")}
        </div>
    `;
}

function renderPanelView(lesson, view, showing) {
    const panel = getPerspectivePanel(lesson, view.panelId);
    const side = showing === "second" ? panel.second : panel.first;

    return `
        <div class="scenario-card perspective-card">

            <img
                src="${panel.image}"
                alt="${escapeText(panel.imageAlt || "")}"
                class="img-fluid rounded shadow-sm perspective-image">

            ${view.flipped ? renderViewToggle(lesson, showing) : ""}

            ${renderViewCard(lesson.views?.[showing] || "", side, showing === "second")}

            ${view.flipped ? renderGuessResult(panel, view.answer) : renderGuessForm(lesson, panel)}

        </div>
    `;
}

function renderSummaryView(lesson, state) {
    const summary = lesson.summary;
    const guesses = getPerspectiveGuesses(lesson, state).filter(guess => guess.option || guess.text);

    return `
        <div class="scenario-card perspective-card">

            <h3 class="scenario-prompt" id="perspectivePrompt" tabindex="-1">${summary.title || "Two views"}</h3>

            ${renderParagraphs(summary.intro)}

            <table class="perspective-table">
                <thead>
                    <tr>
                        <td></td>
                        <th scope="col">${lesson.views?.first || ""}</th>
                        <th scope="col">${lesson.views?.second || ""}</th>
                    </tr>
                </thead>
                <tbody>
                    ${summary.rows.map(row => `
                        <tr>
                            <th scope="row">
                                ${row.label}
                                ${row.detail ? `<span class="perspective-table-detail">${row.detail}</span>` : ""}
                            </th>
                            <td data-label="${lesson.views?.first || ""}">${row.first}</td>
                            <td data-label="${lesson.views?.second || ""}">${row.second}</td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>

            ${summary.note ? `<p class="perspective-summary-note">${summary.note}</p>` : ""}

            ${guesses.length ? `
                <div class="perspective-guesses">
                    <p class="perspective-guesses-title">Your guesses about ${(lesson.views?.second || "the other person").toLowerCase()}</p>
                    <ol>
                        ${guesses.map(guess => `
                            <li>
                                ${guess.text ? `<span class="perspective-guess-own">${escapeText(guess.text)}</span>` : ""}
                                ${guess.option ? `<span class="perspective-guess-choice">${guess.option.label}</span>` : ""}
                            </li>
                        `).join("")}
                    </ol>
                </div>
            ` : ""}

            <button class="btn btn-outline-secondary secondary-navigation-button mt-4" type="button" id="perspectiveRestart">
                Start again
            </button>

        </div>
    `;
}

function getProgressText(lesson, state, view) {
    if (view.kind === "summary") return "Compare";

    // "Step", not "Panel": comic art often carries its own panel numbers.
    return `Step ${state.step + 1} of ${getPerspectivePanels(lesson).length}`;
}

// ======================================
// Behavior
// ======================================

export function initializePerspectiveFlip(lesson, context = {}) {
    if (lesson.type !== "perspectiveFlip") return;

    const stage = document.getElementById("perspectiveStage");
    const progress = document.getElementById("perspectiveProgress");

    if (!stage) return;

    validatePerspectiveFlip(lesson).forEach(problem =>
        console.warn(`Perspective flip "${lesson.id}": ${problem}`)
    );

    let state = loadPerspectiveState(lesson);

    // Which side is on screen for the current panel. Not saved: a
    // flipped panel always reopens on the second view.
    let showing = "first";

    function getGuessText() {
        return document.getElementById("perspectiveGuessText")?.value || "";
    }

    function focusElement(id) {
        const element = document.getElementById(id);

        if (element) element.focus();
    }

    function setState(nextState) {
        state = nextState;
        savePerspectiveState(lesson, state);
    }

    function showMessage(text) {
        const message = document.getElementById("perspectiveValidation");

        if (!message) return;

        message.hidden = !text;
        message.textContent = text;
    }

    function areOptionsHidden() {
        return Boolean(document.getElementById("perspectiveOptions")?.hidden);
    }

    // The choices appear once the learner has written a guess and
    // pressed the button, or Enter.
    function attachWriteFirstEvents() {
        const input = document.getElementById("perspectiveGuessText");
        const showButton = document.getElementById("perspectiveShowOptions");
        const options = document.getElementById("perspectiveOptions");

        if (!input || !showButton || !options) return;

        function showOptions() {
            if (!input.value.trim()) return;

            options.hidden = false;
            showButton.hidden = true;
            showMessage("");
            focusElement("perspectiveOptionsLabel");
        }

        input.addEventListener("input", () => {
            showButton.disabled = !input.value.trim();

            if (input.value.trim()) showMessage("");
        });

        input.addEventListener("keydown", event => {
            if (event.key !== "Enter") return;

            event.preventDefault();
            showOptions();
        });

        showButton.addEventListener("click", showOptions);
    }

    function renderCurrentView(focusTargetId = null) {
        const view = getPerspectiveView(lesson, state);

        if (view.kind === "panel" && !view.flipped) showing = "first";

        stage.innerHTML = view.kind === "summary"
            ? renderSummaryView(lesson, state)
            : renderPanelView(lesson, view, showing);

        if (progress) progress.textContent = getProgressText(lesson, state, view);

        // Keep the module's progress bar in step with the activity.
        context.updateModuleStep?.(state.step);

        // Skip for Now is offered while a guess is still needed.
        const canSkip = view.kind === "panel" && !view.flipped;

        document.querySelectorAll("[data-action='skip']").forEach(button => {
            button.hidden = !canSkip;
        });

        attachWriteFirstEvents();

        stage.querySelectorAll("[data-perspective-option]").forEach(button => {
            button.addEventListener("click", () => {
                const updated = guessPerspective(lesson, state, button.dataset.perspectiveOption, getGuessText());

                if (updated === state) return;

                setState(updated);
                showing = "second";
                renderCurrentView("perspectiveView");
            });
        });

        stage.querySelectorAll("[data-perspective-show]").forEach(button => {
            button.addEventListener("click", () => {
                showing = button.dataset.perspectiveShow;
                renderCurrentView("perspectiveView");
            });
        });

        const restartButton = document.getElementById("perspectiveRestart");

        if (restartButton) {
            restartButton.addEventListener("click", () => {
                setState(createPerspectiveState());
                renderCurrentView("perspectiveView");
            });
        }

        if (focusTargetId) focusElement(focusTargetId);
    }

    function goToStep(nextState) {
        setState(nextState);

        const view = getPerspectiveView(lesson, state);

        showing = view.kind === "panel" && view.flipped ? "second" : "first";
        renderCurrentView(view.kind === "summary" ? "perspectivePrompt" : "perspectiveView");
        stage.scrollIntoView({ block: "start" });
    }

    // The lesson's own Next, Previous and Skip for Now buttons drive the
    // activity, so there is only one set of navigation on the screen.
    // Each returns true when the activity handled the click.
    context.advancePerspectiveFlip = () => {
        const result = advancePerspective(lesson, state);

        if (result.needsGuess) {
            if (areOptionsHidden()) {
                showMessage(PERSPECTIVE_WRITING_REQUIRED_MESSAGE);
                focusElement("perspectiveGuessText");

                return true;
            }

            showMessage(PERSPECTIVE_GUESS_REQUIRED_MESSAGE);

            const firstOption = stage.querySelector("[data-perspective-option]");

            if (firstOption) firstOption.focus();

            return true;
        }

        if (!result.moved) return false;

        goToStep(result.state);

        return true;
    };

    context.retreatPerspectiveFlip = () => {
        const result = retreatPerspective(state);

        if (!result.moved) return false;

        goToStep(result.state);

        return true;
    };

    // Skip for Now flips the panel without a guess and stays in the activity.
    context.skipPerspectiveFlip = () => {
        const updated = revealPerspective(lesson, state, getGuessText());

        if (updated === state) return false;

        setState(updated);
        showing = "second";
        renderCurrentView("perspectiveView");

        return true;
    };

    const openingView = getPerspectiveView(lesson, state);

    showing = openingView.kind === "panel" && openingView.flipped ? "second" : "first";
    renderCurrentView();
}
