// ======================================
// Signal Transcript
// js/signalTranscript.js
// ======================================
//
// Purpose:
// A reusable activity. The learner reads a short conversation and
// marks the lines they think carried a message that was not said
// outright. A review then goes through the conversation line by line:
// what the learner marked, what they missed, how each line could be
// heard, and how it was meant.
//
// This file holds the logic and layout only. The conversation itself
// belongs in a module file (modules/*.js).
//
// How to use it in a module:
//
// {
//     id: "my-transcript",
//     type: "signalTranscript",
//     title: "...",
//     moduleLabel: "...",
//     instructions: "...",              // optional
//
//     scene: { body: ["...", "..."] },  // optional, shown above the conversation
//
//     prompt: "Which lines were telling you something?",
//     signalName: "signals",            // optional, used in "You found 2 of 4 signals"
//
//     speakers: {                       // who is talking
//         you:  { name: "You", self: true },
//         lead: { name: "Ms. Chen" }
//     },
//
//     lines: [
//         {
//             id: "difficult",
//             speaker: "lead",
//             text: "That may be difficult.",
//             cue: "She pauses.",       // optional stage direction, shown before the text
//             signal: true,             // true if this line carried a message
//                                       // (lines by a self: true speaker cannot be marked)
//             heard: "...",             // how it could be heard (signals)
//             meant: "...",             // how it was meant (signals)
//             note: "...",              // optional comment, for any line
//             audio: "audio/line.mp3"   // optional voice-over
//         }
//     ],
//
//     review: {
//         title: "...",
//         body: ["..."],                // shown above the line-by-line review
//         heardLabel: "How you might hear it",   // optional
//         meantLabel: "How it was meant",        // optional
//         note: "...",                  // optional caution, shown after the lines
//         takeaways: ["..."]            // optional
//     }
// }
//
// The activity has two steps: marking, then the review. The lesson's
// own Next and Previous buttons move between them.
// ======================================

import { saveItem, loadItem } from "./storage.js";

export const SIGNAL_SELECTION_REQUIRED_MESSAGE =
    "Mark at least one line before continuing.";

// ======================================
// Logic (no page access, so it can be tested on its own)
// ======================================

export function getTranscriptLines(lesson) {
    return lesson?.lines || [];
}

export function getSignalLines(lesson) {
    return getTranscriptLines(lesson).filter(line => line.signal);
}

export function getSpeaker(lesson, speakerId) {
    return lesson?.speakers?.[speakerId] || { name: speakerId || "" };
}

// The learner's own lines (speakers with self: true) are shown but
// cannot be marked.
export function isMarkableLine(lesson, line) {
    return Boolean(line) && !getSpeaker(lesson, line.speaker).self;
}

// Marking and review.
export function getTranscriptStepCount() {
    return 2;
}

export function createTranscriptState() {
    return { step: 0, selected: [] };
}

export function toggleTranscriptLine(lesson, state, lineId) {
    if (state.step !== 0) return state;
    if (!isMarkableLine(lesson, getTranscriptLines(lesson).find(line => line.id === lineId))) return state;

    const selected = state.selected.includes(lineId)
        ? state.selected.filter(id => id !== lineId)
        : [...state.selected, lineId];

    return { ...state, selected };
}

export function advanceTranscript(lesson, state) {
    if (state.step >= 1) return { state, moved: false };
    if (!state.selected.length) return { state, moved: false, needsSelection: true };

    return { state: { ...state, step: 1 }, moved: true };
}

export function retreatTranscript(state) {
    if (state.step <= 0) return { state, moved: false };

    return { state: { ...state, step: 0 }, moved: true };
}

// Saved progress may be missing, damaged, or left over from an older
// version of the conversation.
export function restoreTranscriptState(lesson, saved) {
    if (!saved || typeof saved !== "object") return createTranscriptState();

    const ids = new Set(getTranscriptLines(lesson)
        .filter(line => isMarkableLine(lesson, line))
        .map(line => line.id));
    const selected = Array.isArray(saved.selected)
        ? [...new Set(saved.selected.filter(id => ids.has(id)))]
        : [];
    const step = saved.step === 1 && selected.length ? 1 : 0;

    return { step, selected };
}

// One entry per line for the review.
// status: "found" (a signal the learner marked), "missed" (a signal
// they did not mark), "extra" (marked, but not a signal), "plain".
export function getTranscriptResults(lesson, state) {
    return getTranscriptLines(lesson).map(line => {
        const marked = state.selected.includes(line.id);
        let status = "plain";

        if (line.signal) status = marked ? "found" : "missed";
        else if (marked) status = "extra";

        return { line, marked, status };
    });
}

export function getTranscriptScore(lesson, state) {
    const results = getTranscriptResults(lesson, state);

    return {
        found: results.filter(result => result.status === "found").length,
        total: getSignalLines(lesson).length,
        extra: results.filter(result => result.status === "extra").length
    };
}

// Problems in the module data, reported in the console while authoring.
export function validateSignalTranscript(lesson) {
    const problems = [];
    const lines = getTranscriptLines(lesson);
    const ids = new Set();

    if (!lines.length) problems.push("has no lines.");
    if (lines.length && !getSignalLines(lesson).length) problems.push("has no line marked signal: true.");

    lines.forEach((line, index) => {
        const name = line.id || `line ${index + 1}`;

        if (!line.id) problems.push(`line ${index + 1} has no id.`);
        if (line.id && ids.has(line.id)) problems.push(`line id "${line.id}" is used more than once.`);
        if (line.id) ids.add(line.id);
        if (!line.text) problems.push(`"${name}" has no text.`);
        if (!lesson.speakers?.[line.speaker]) problems.push(`"${name}" uses a speaker that is not listed in speakers.`);
        if (line.signal && lesson.speakers?.[line.speaker]?.self) problems.push(`"${name}" is a signal but belongs to the learner, so it cannot be marked.`);
        if (line.signal && (!line.heard || !line.meant)) problems.push(`"${name}" is a signal and needs both heard and meant.`);
    });

    return problems;
}

// ======================================
// Saved progress
// ======================================

// A copy of an activity (for example in the showcase) shares progress
// with the original through its stateId.
function getTranscriptStorageKey(lesson) {
    return `transcript_${lesson.stateId || lesson.id}`;
}

export function loadTranscriptState(lesson) {
    return restoreTranscriptState(lesson, loadItem(getTranscriptStorageKey(lesson), null));
}

function saveTranscriptState(lesson, state) {
    saveItem(getTranscriptStorageKey(lesson), state);
}

// ======================================
// Layout
// ======================================

export function renderSignalTranscriptContent(lesson) {
    return `
        <div class="signal-transcript" data-transcript-id="${lesson.id}">

            ${lesson.instructions ? `<p class="lead">${lesson.instructions}</p>` : ""}

            <p class="scenario-progress" id="transcriptProgress" aria-live="polite"></p>

            <div id="transcriptStage"></div>

        </div>
    `;
}

function renderParagraphs(body = []) {
    return (body || []).map(paragraph => `<p>${paragraph}</p>`).join("");
}

function renderAudio(line) {
    return line.audio
        ? `<audio class="scenario-audio" controls preload="none" src="${line.audio}"></audio>`
        : "";
}

function renderLineText(lesson, line) {
    const speaker = getSpeaker(lesson, line.speaker);

    return `
        <span class="transcript-speaker">${speaker.name}</span>
        <span class="transcript-text">
            ${line.cue ? `<span class="transcript-cue">${line.cue}</span> ` : ""}${line.text}
        </span>
    `;
}

function renderMarkView(lesson, state) {
    const lines = getTranscriptLines(lesson).map(line => {
        const speaker = getSpeaker(lesson, line.speaker);
        const marked = state.selected.includes(line.id);

        if (!isMarkableLine(lesson, line)) {
            return `
                <li class="transcript-line is-self">
                    <div class="transcript-line-plain">${renderLineText(lesson, line)}</div>
                    ${renderAudio(line)}
                </li>
            `;
        }

        return `
            <li class="transcript-line ${speaker.self ? "is-self" : ""}">
                <button type="button" class="transcript-line-button"
                    data-transcript-line="${line.id}" aria-pressed="${marked}">
                    ${renderLineText(lesson, line)}
                    <span class="transcript-mark" aria-hidden="true">${marked ? "Marked" : "Mark"}</span>
                </button>
                ${renderAudio(line)}
            </li>
        `;
    }).join("");

    return `
        <div class="scenario-card">

            ${lesson.scene?.body ? `<div class="scenario-scene">${renderParagraphs(lesson.scene.body)}</div>` : ""}

            <h3 class="scenario-prompt" id="transcriptPrompt" tabindex="-1">${lesson.prompt || "Which lines were telling you something?"}</h3>

            <p class="transcript-hint">Select a line to mark it. Select it again to remove the mark. Your own lines cannot be marked.</p>

            <ol class="transcript-lines">${lines}</ol>

            <p class="transcript-count" id="transcriptCount" aria-live="polite"></p>

            <p class="text-danger" id="transcriptValidation" role="alert" hidden></p>

        </div>
    `;
}

const STATUS_LABELS = {
    found: "You marked this",
    missed: "You did not mark this",
    extra: "You marked this",
    plain: ""
};

function renderReviewLine(lesson, result, labels) {
    const { line, status } = result;
    const speaker = getSpeaker(lesson, line.speaker);
    const statusLabel = STATUS_LABELS[status];

    return `
        <li class="transcript-review-line is-${status} ${speaker.self ? "is-self" : ""}">

            <p class="transcript-review-said">${renderLineText(lesson, line)}</p>

            ${statusLabel ? `<p class="transcript-status">${statusLabel}${line.signal ? "" : ". It was not one of the signals"}</p>` : ""}

            ${line.signal ? `
                <dl class="transcript-meanings">
                    <div>
                        <dt>${labels.heard}</dt>
                        <dd>${line.heard}</dd>
                    </div>
                    <div>
                        <dt>${labels.meant}</dt>
                        <dd>${line.meant}</dd>
                    </div>
                </dl>
            ` : ""}

            ${line.note ? `<p class="transcript-line-note">${line.note}</p>` : ""}

        </li>
    `;
}

function renderReviewView(lesson, state) {
    const review = lesson.review || {};
    const score = getTranscriptScore(lesson, state);
    const signalName = lesson.signalName || "signals";
    const labels = {
        heard: review.heardLabel || "How you might hear it",
        meant: review.meantLabel || "How it was meant"
    };

    return `
        <div class="scenario-card">

            <h3 class="scenario-prompt" id="transcriptPrompt" tabindex="-1">${review.title || "What was said, and what was meant"}</h3>

            ${renderParagraphs(review.body)}

            <p class="transcript-score">
                You marked ${score.found} of the ${score.total} ${signalName}.
            </p>

            <ol class="transcript-review">
                ${getTranscriptResults(lesson, state).map(result => renderReviewLine(lesson, result, labels)).join("")}
            </ol>

            ${review.note ? `<p class="perspective-note">${review.note}</p>` : ""}

            ${review.takeaways?.length ? `
                <div class="scenario-debrief">
                    <h4 class="h6">Takeaways</h4>
                    <ul>${review.takeaways.map(point => `<li>${point}</li>`).join("")}</ul>
                </div>
            ` : ""}

            <button type="button" class="btn btn-outline-secondary btn-sm" id="transcriptRestart">
                Mark the conversation again
            </button>

        </div>
    `;
}

// ======================================
// Behavior
// ======================================

export function initializeSignalTranscript(lesson, context = {}) {
    if (lesson.type !== "signalTranscript") return;

    const stage = document.getElementById("transcriptStage");
    const progress = document.getElementById("transcriptProgress");

    if (!stage) return;

    validateSignalTranscript(lesson).forEach(problem =>
        console.warn(`Signal transcript "${lesson.id}": ${problem}`)
    );

    let state = loadTranscriptState(lesson);

    function setState(nextState) {
        state = nextState;
        saveTranscriptState(lesson, state);
    }

    function showMessage(text) {
        const message = document.getElementById("transcriptValidation");

        if (!message) return;

        message.hidden = !text;
        message.textContent = text;
    }

    function updateCount() {
        const count = document.getElementById("transcriptCount");

        if (!count) return;

        const total = state.selected.length;

        count.textContent = total === 1 ? "1 line marked." : `${total} lines marked.`;
    }

    function renderCurrentView(focusPrompt = false) {
        stage.innerHTML = state.step === 0
            ? renderMarkView(lesson, state)
            : renderReviewView(lesson, state);

        if (progress) progress.textContent = state.step === 0 ? "Step 1 of 2" : "Step 2 of 2";

        // Keep the module's progress bar in step with the activity.
        context.updateModuleStep?.(state.step);

        // Skip for Now is offered while the learner is still marking.
        document.querySelectorAll("[data-action='skip']").forEach(button => {
            button.hidden = state.step !== 0;
        });

        updateCount();

        stage.querySelectorAll("[data-transcript-line]").forEach(button => {
            button.addEventListener("click", () => {
                setState(toggleTranscriptLine(lesson, state, button.dataset.transcriptLine));

                const marked = state.selected.includes(button.dataset.transcriptLine);

                button.setAttribute("aria-pressed", String(marked));
                button.querySelector(".transcript-mark").textContent = marked ? "Marked" : "Mark";

                updateCount();

                if (state.selected.length) showMessage("");
            });
        });

        const restartButton = document.getElementById("transcriptRestart");

        if (restartButton) {
            restartButton.addEventListener("click", () => {
                setState(createTranscriptState());
                renderCurrentView(true);
                stage.scrollIntoView({ block: "start" });
            });
        }

        if (focusPrompt) document.getElementById("transcriptPrompt")?.focus();
    }

    // The lesson's own Next, Previous and Skip for Now buttons drive the
    // activity. Each returns true when the activity handled the click.
    context.advanceSignalTranscript = () => {
        const result = advanceTranscript(lesson, state);

        if (result.needsSelection) {
            showMessage(SIGNAL_SELECTION_REQUIRED_MESSAGE);
            stage.querySelector("[data-transcript-line]")?.focus();

            return true;
        }

        if (!result.moved) return false;

        setState(result.state);
        renderCurrentView(true);
        stage.scrollIntoView({ block: "start" });

        return true;
    };

    context.retreatSignalTranscript = () => {
        const result = retreatTranscript(state);

        if (!result.moved) return false;

        setState(result.state);
        renderCurrentView(true);
        stage.scrollIntoView({ block: "start" });

        return true;
    };

    // Skipping leaves the activity and moves on with the lesson.
    context.skipSignalTranscript = () => false;

    renderCurrentView(false);
}
