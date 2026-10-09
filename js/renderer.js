// ======================================
// Main Lesson Renderer
// js/renderer.js
// ======================================
//
// Purpose:
// Converts lesson objects from modules/*.js into HTML.
// Also attaches shared events such as navigation and autosave.
//
// Main idea:
// - Content lives in modules/*.js
// - App state/navigation lives in app.js
// - Storage lives in storage.js
// - Activities live in activities.js
// ======================================

import {
    saveResponse,
    loadResponse,
    markModuleComplete
} from "./storage.js";

import {
    renderSortingActivityContent,
    initializeSortingActivity,
    renderImageRevealContent,
    initializeImageReveal,
    renderStoryActivityContent,
    initializeStoryActivity,
    renderGuidedActivityContent,
    initializeGuidedActivity
} from "./activities.js";

import {
    renderBranchingScenarioContent,
    initializeBranchingScenario,
    renderScenarioRecap,
    getScenarioQuestions
} from "./branchingScenario.js";

import {
    renderPerspectiveFlipContent,
    initializePerspectiveFlip
} from "./perspectiveFlip.js";

import {
    renderSignalTranscriptContent,
    initializeSignalTranscript
} from "./signalTranscript.js";

import {
    renderInquiryContent,
    initializeInquiry,
    getInquiryQuestions
} from "./inquiryActivity.js";

import { getModuleStepPosition } from "./moduleProgress.js";

import {
    getReflectionMetadata
} from "./metaData/reflectionsMetadata.js";

import { learningOutcomes } from "./metaData/learningOutcomes.js";
import { renderReflectionPurposeDisclosure } from "./renderers/reflection.js";
import {
    renderResponseValidation, initializeResponseValidation, validateRequiredFields,
    validateResponseField, clearResponseValidation, isRequiredReflection,
    getMissingRequiredResponses, getReflectionEntries, saveResponseDrafts
} from "./reflectionValidation.js";
import { updateNavigationOrder } from "./responsiveNavigation.js";

export function renderLesson(lesson, context) {
    const app = document.getElementById("app");

    if (!app) {
        console.error("App container not found.");
        return;
    }

    const renderer = lessonRenderers[lesson.type];

    if (!renderer) {
        app.innerHTML = renderUnknownLessonType(lesson);
        return;
    }

    app.innerHTML = renderer(lesson, context);

    // Activities with their own steps call this as the learner moves
    // through them, so the bar at the top counts every step in the module.
    context.updateModuleStep = stepInLesson => {
        const bar = document.querySelector(".module-position");
        const position = getPagePosition(context, stepInLesson);

        if (bar && position) bar.outerHTML = renderModulePosition(position);
    };

    attachSharedLessonEvents(lesson, context);
    initializeSortingActivity(lesson);
    initializeImageReveal(lesson);
    initializeStoryActivity(lesson, context);
    initializeGuidedActivity(lesson, context);
    initializeBranchingScenario(lesson, context);
    initializePerspectiveFlip(lesson, context);
    initializeSignalTranscript(lesson, context);
    initializeInquiry(lesson, context);
    updateNavigationOrder();
}

const lessonRenderers = {
    moduleIntro: renderModuleIntro,
    moduleComplete: renderModuleComplete,
    contentImage: renderContentImage,
    hiddenCulture: renderHiddenCulture,
    reflection: renderReflection,
    reflectionImage: renderReflection,
    reflectionSummary: renderReflectionSummary,
    twoColumn: renderTwoColumn,
    accordion: renderAccordion,
    sortingActivity: renderSortingActivity,
    imageReveal: renderImageReveal,
    storyActivity: renderStoryActivity,
    guidedActivity: renderGuidedActivity,
    branchingScenario: renderBranchingScenario,
    perspectiveFlip: renderPerspectiveFlip,
    signalTranscript: renderSignalTranscript,
    inquiry: renderInquiry,
    showcaseEnd: renderShowcaseEnd
};

// ---------- Shared Layout ----------

function renderPageShell(lesson, content, context) {
    return `
        <section class="course-screen">
            <div class="container py-5">
                <div class="lesson-card">

                    <p class="text-uppercase fw-bold text-primary mb-2">
                        ${lesson.moduleLabel || context.currentModule.title}
                    </p>

                    ${renderModulePosition(getPagePosition(context))}

                    <h2>${lesson.title}</h2>

                    ${content}

                </div>

                ${renderLessonNavigation(context)}
            </div>
        </section>
    `;
}

// The learner's place in the module, counting every step. Lessons that
// show no progress bar (module intro, completion, summary) stay without one.
function getPagePosition(context, stepInLesson = 0) {
    if (!context.modulePosition) return null;

    return getModuleStepPosition(context.currentModule, context.currentLesson, stepInLesson)
        || context.modulePosition;
}

function renderModulePosition(position) {
    if (!position || !position.total) return "";

    const segments = Array.from({ length: position.total }, (_, index) => {
        const segmentPosition = index + 1;
        const state = segmentPosition < position.currentIndex
            ? "past"
            : segmentPosition === position.currentIndex
                ? "current"
                : "upcoming";

        return `<span class="module-position-segment is-${state}"></span>`;
    }).join("");

    return `
        <div
            class="module-position"
            role="group"
            aria-label="Section ${position.currentIndex} of ${position.total} in ${position.moduleName}">
            <div
                class="module-position-segments"
                style="--module-position-total: ${position.total}"
                aria-hidden="true">
                ${segments}
            </div>
            <span class="module-position-count" aria-hidden="true">
                ${position.currentIndex} of ${position.total}
            </span>
        </div>
    `;
}

function renderLessonNavigation(context) {
    const showNextButton = !["reflectionSummary", "showcaseEnd"].includes(context.currentLesson?.type);

    return `
        <div class="lesson-navigation" data-responsive-navigation>
            <button class="btn btn-outline-secondary secondary-navigation-button"
                data-action="previous"
                ${!context.previousLesson ? "disabled" : ""}>
                Previous
            </button>

            <button class="btn btn-outline-secondary secondary-navigation-button" data-action="menu">
                Return to Menu
            </button>

            ${getReflectionEntries(context.currentLesson || {}).some(entry => entry.required)
                || ["branchingScenario", "perspectiveFlip", "signalTranscript", "inquiry"].includes(context.currentLesson?.type) ? `
                <button class="btn btn-outline-secondary secondary-navigation-button" data-action="skip"
                    ${context.currentLesson?.type === "guidedActivity" ? "hidden" : ""}>Skip for Now</button>
            ` : ""}

            ${showNextButton ? `
                <button class="btn btn-primary"
                    data-action="next"
                    ${!context.nextLesson ? "disabled" : ""}>
                    Next
                </button>
            ` : ""}
        </div>
    `;
}

function renderParagraphs(body = []) {
    if (!body || !body.length) return "";
    return body.map(paragraph => `<p>${paragraph}</p>`).join("");
}

function renderPromptList(prompts = []) {
    if (!prompts || !prompts.length) return "";

    return `
        <div class="reflection-prompt mt-4">
            <h5>Think about it</h5>
            <ul>
                ${prompts.map(prompt => `<li>${prompt}</li>`).join("")}
            </ul>
        </div>
    `;
}

function renderTakeawayList(takeaways = []) {
    if (!takeaways || !takeaways.length) return "";

    return `
        <div class="module-summary mt-4">
            <h5>Key Takeaways</h5>
            <ul>
                ${takeaways.map(takeaway => `<li>${takeaway}</li>`).join("")}
            </ul>
        </div>
    `;
}

function renderExampleList(examples = [], className = "") {
    if (!examples.length) return "";

    const classAttribute = className ? ` class="${className}"` : "";

    return `
        <ul${classAttribute}>
            ${examples.map(example => `<li>${example}</li>`).join("")}
        </ul>
    `;
}

function renderImage(image, imageAlt = "", label = "Image Placeholder") {
    if (image) {
        return `
            <img
                src="${image}"
                alt="${imageAlt}"
                class="img-fluid rounded shadow-sm lesson-image"
                onerror="this.outerHTML='<div class=&quot;placeholder-image rounded shadow-sm&quot;>${label}</div>'">
        `;
    }

    return `
        <div class="placeholder-image rounded shadow-sm">
            ${label}
        </div>
    `;
}

// ---------- Renderers ----------

function renderModuleIntro(lesson, context) {
    const content = `
        <div class="row align-items-center g-5">
            <div class="col-lg-7">
                ${renderParagraphs(lesson.body)}

                <button class="btn btn-primary btn-lg mt-3" data-action="next">
                    ${lesson.buttonText || "Begin Module"}
                </button>
            </div>

            <div class="col-lg-5">
                ${renderImage(lesson.image, lesson.imageAlt, "Module Image")}
            </div>
        </div>
    `;

    return renderPageShell(lesson, content, context);
}

function renderModuleComplete(lesson, context) {
    const hasUnfinishedReflections = getMissingRequiredResponses(context.currentModule).length > 0;
    return `
        <section class="course-screen">
            <div class="container py-5">
                <div class="completion-card text-center">

                    <div class="completion-icon mb-3" ${hasUnfinishedReflections ? "hidden" : ""}>
                        <i class="bi bi-check-circle-fill"></i>
                    </div>

                    <p class="text-uppercase fw-bold text-success">
                        ${hasUnfinishedReflections ? context.currentModule.title : lesson.moduleLabel}
                    </p>

                    <h2>${hasUnfinishedReflections ? "Almost finished" : lesson.title}</h2>

                    <p class="lead" ${hasUnfinishedReflections ? "hidden" : ""}>
                        ${lesson.completionMessage || `You completed ${lesson.completedModuleTitle}.`}
                    </p>

                    <div class="module-summary mt-4 text-start">
                        <h5>Key ideas from this module</h5>
                        <ul>
                            ${lesson.summary.map(item => `<li>${item}</li>`).join("")}
                        </ul>
                    </div>

                    <div class="mt-4 completion-navigation" data-responsive-navigation>
                        <button class="btn btn-outline-secondary secondary-navigation-button me-2"
                            data-action="previous"
                            ${!context.previousLesson ? "disabled" : ""}>
                            Previous
                        </button>

                        <button class="btn btn-outline-secondary secondary-navigation-button me-2" data-action="menu">
                            Return to Menu
                        </button>

                        <button class="btn btn-primary" data-action="next">
                            ${lesson.buttonText || "Begin Next Module"}
                        </button>
                    </div>

                </div>
            </div>
        </section>
    `;
}

function renderContentImage(lesson, context) {
    const content = `
        <div class="row align-items-center g-5">
            <div class="col-lg-7">
                ${renderParagraphs(lesson.body)}

                ${lesson.note ? `
                    <div class="alert alert-light mt-4">
                        ${lesson.note}
                    </div>
                ` : ""}

                ${renderPromptList(lesson.prompts)}
                ${renderTakeawayList(lesson.takeaways)}
            </div>

            <div class="col-lg-5">
                ${renderImage(lesson.image, lesson.imageAlt, lesson.title)}
            </div>
        </div>
    `;

    return renderPageShell(lesson, content, context);
}

function renderHiddenCulture(lesson, context) {
    const content = `
        ${renderParagraphs(lesson.body)}

        <section class="info-column mt-4" aria-labelledby="hidden-culture-example">
            <h3 id="hidden-culture-example" class="h5">${lesson.exampleTitle}</h3>
            ${renderParagraphs(lesson.example)}
        </section>

        <section class="mt-4" aria-label="Observable behavior and possible less visible cultural influences">
            <div class="info-column info-column-visible">
                <h3 class="h5">${lesson.visibleTitle}</h3>
                <p class="mb-0">“${lesson.observation}”</p>
            </div>
            <div class="text-center my-2" aria-hidden="true">↓</div>
            <div class="info-column info-column-hidden">
                <h3 class="h5">${lesson.hiddenTitle}</h3>
                ${renderExampleList(lesson.influences, "mb-0")}
            </div>
        </section>

        <p class="mt-4">${lesson.qualification}</p>

        <section class="alert alert-warning mt-4" aria-labelledby="hidden-culture-takeaway">
            <h3 id="hidden-culture-takeaway" class="h5">${lesson.takeawayTitle}</h3>
            <p class="mb-0">${lesson.takeaway}</p>
        </section>
    `;

    return renderPageShell(lesson, content, context);
}

function renderReflection(lesson, context) {
    const reflectionPrompts = getReflectionPrompts(lesson);
    const reflectionMarkup = reflectionPrompts
        .map(prompt => renderReflectionBox(prompt, lesson, context))
        .join("");
    const reviewMarkup = renderReflectionReview(lesson, context)
        + renderLessonScenarioRecap(lesson, context);
    const comparisonMarkup = renderReflectionComparison(lesson);

    let content = "";

    if (lesson.image) {
        content = `
            <div class="row align-items-center g-5">
                <div class="col-lg-5">
                    ${renderImage(lesson.image, lesson.imageAlt, lesson.title)}
                </div>

                <div class="col-lg-7">
                    ${renderParagraphs(lesson.body)}
                    ${reviewMarkup}
                    ${reflectionMarkup}
                    ${comparisonMarkup}
                </div>
            </div>
        `;
    } else {
        content = `
            ${renderParagraphs(lesson.body)}
            ${reviewMarkup}
            ${reflectionMarkup}
            ${comparisonMarkup}
        `;
    }

    return renderPageShell(lesson, content, context);
}

// A reflection can show the choices the learner made in an earlier scenario.
function renderLessonScenarioRecap(lesson, context) {
    if (!lesson.scenarioRecap) return "";

    const scenarioLesson = (context.courseData?.modules || [])
        .flatMap(module => module.lessons)
        .find(moduleLesson => moduleLesson.id === lesson.scenarioRecap);

    return renderScenarioRecap(scenarioLesson);
}

function getReflectionPrompts(lesson) {
    if (lesson.prompts && lesson.prompts.length) {
        return lesson.prompts;
    }

    return [
        {
            prompt: lesson.prompt,
            storageKey: lesson.storageKey,
            placeholder: lesson.placeholder,
            required: lesson.required
        }
    ];
}

function renderReflectionBox(prompt, lesson, context) {
    const savedValue = loadResponse(prompt.storageKey);
    const label = prompt.label || prompt.prompt;
    const promptID = `${prompt.storageKey}Prompt`;
    const hasPromptMetadata = Boolean(
        prompt.rationale || prompt.competencies?.length
    );
    const purposeSource = hasPromptMetadata ? prompt : lesson;
    const purposeMarkup = lesson.showPurposeDisclosure === false
        ? ""
        : renderReflectionPurposeDisclosure(
            purposeSource,
            context.courseData?.competencies || {}
        );

    return `
        <div class="reflection-prompt mt-4">
            <label for="${prompt.storageKey}" class="form-label fw-semibold">
                ${label}
            </label>

            ${prompt.label ? `
                <p id="${promptID}">
                    ${prompt.prompt}
                </p>
            ` : ""}

            <textarea
                id="${prompt.storageKey}"
                class="form-control reflection-box"
                rows="6"
                aria-describedby="${prompt.label ? `${promptID} ` : ""}${prompt.storageKey}Validation"
                data-required-response="${prompt.required === true}"
                aria-required="${prompt.required === true}"
                data-storage-key="${prompt.storageKey}"
                placeholder="${prompt.placeholder || "Write your response here..."}">${savedValue}</textarea>

            ${renderResponseValidation(prompt.storageKey)}
            <div class="save-status mt-2" id="${prompt.storageKey}Status">
                Your response will be saved in this browser.
            </div>
        </div>

        ${purposeMarkup}
    `;
}

function renderReflectionReview(lesson) {
    if (!lesson.reviewResponse) return "";

    return `
        <section class="reflection-review mt-4">
            <h3>${lesson.reviewResponse.title}</h3>
            <div
                class="reflection-summary-response"
                data-saved-response-display="${lesson.reviewResponse.storageKey}"
                data-empty-message="${lesson.reviewResponse.emptyMessage || "No response has been saved."}">
            </div>
        </section>
    `;
}

function renderReflectionComparison(lesson) {
    if (!lesson.comparison) return "";

    return `
        <section class="reflection-comparison mt-4">
            <h3>${lesson.comparison.title || "Compare Your Thinking"}</h3>

            <div class="comparison-grid">
                ${(lesson.comparison.items || []).map(item => `
                    <div class="comparison-card">
                        <h4 class="h6">${item.title}</h4>
                        <div
                            class="comparison-response"
                            data-saved-response-display="${item.storageKey}"
                            data-empty-message="${item.emptyMessage || "No response has been saved."}">
                        </div>
                    </div>
                `).join("")}
            </div>
        </section>
    `;
}

function renderTwoColumn(lesson, context) {
    const isCultureSurfaceComparison = lesson.id === "culture-iceberg-details";
    const content = `
        ${(lesson.body || []).map(paragraph => `<p>${paragraph}</p>`).join("")}

        <div class="row g-4 mt-3">
            <div class="col-md-6">
                <div class="info-column${isCultureSurfaceComparison ? " info-column-visible" : ""}">
                    <h5>${lesson.leftTitle}</h5>
                    <ul>${lesson.leftItems.map(item => `<li>${item}</li>`).join("")}</ul>
                </div>
            </div>

            <div class="col-md-6">
                <div class="info-column${isCultureSurfaceComparison ? " info-column-hidden" : ""}">
                    <h5>${lesson.rightTitle}</h5>
                    ${lesson.rightDescription ? `<p>${lesson.rightDescription}</p>` : ""}
                    ${renderExampleList(lesson.rightItems)}
                </div>
            </div>
        </div>

        ${lesson.note ? `
            <div class="alert alert-warning mt-4">
                ${lesson.note}
            </div>
        ` : ""}
    `;

    return renderPageShell(lesson, content, context);
}

function renderAccordion(lesson, context) {
    const accordionID = `${lesson.id}-accordion`;

    const content = `
        ${lesson.intro ? `<p class="lead">${lesson.intro}</p>` : ""}

        <div class="accordion mt-4" id="${accordionID}">
            ${lesson.items.map((item, index) => `
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#${lesson.id}-item-${index}">
                            ${item.title}
                        </button>
                    </h2>

                    <div
                        id="${lesson.id}-item-${index}"
                        class="accordion-collapse collapse"
                        data-bs-parent="#${accordionID}">

                        <div class="accordion-body">
                            ${renderAccordionItemBody(item, lesson, index)}
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `;

    return renderPageShell(lesson, content, context);
}

function renderSortingActivity(lesson, context) {
    return renderPageShell(
        lesson,
        renderSortingActivityContent(lesson),
        context
    );
}

function renderStoryActivity(lesson, context) {
    return renderPageShell(
        lesson,
        renderStoryActivityContent(lesson),
        context
    );
}

function renderGuidedActivity(lesson, context) {
    return renderPageShell(
        lesson,
        renderGuidedActivityContent(lesson),
        context
    );
}

function renderBranchingScenario(lesson, context) {
    return renderPageShell(
        lesson,
        renderBranchingScenarioContent(lesson),
        context
    );
}

function renderPerspectiveFlip(lesson, context) {
    return renderPageShell(
        lesson,
        renderPerspectiveFlipContent(lesson),
        context
    );
}

function renderInquiry(lesson, context) {
    return renderPageShell(
        lesson,
        renderInquiryContent(lesson),
        context
    );
}

function renderSignalTranscript(lesson, context) {
    return renderPageShell(
        lesson,
        renderSignalTranscriptContent(lesson),
        context
    );
}

// The last screen of the showcase: what else the workshop contains,
// with a way into the full workshop.
function renderShowcaseEnd(lesson, context) {
    const sections = (lesson.sections || []).map(section => `
        <div class="col-md-6">
            <div class="info-column">
                <h3 class="h5">${section.title}</h3>
                <ul class="mb-0">
                    ${(section.items || []).map(item => `<li>${item}</li>`).join("")}
                </ul>
            </div>
        </div>
    `).join("");

    const links = (lesson.links || []).map(link => `
        <a class="project-documentation-link" href="${link.href}">
            ${link.label} <span aria-hidden="true">→</span>
        </a>
    `).join("");

    const content = `
        ${renderParagraphs(lesson.body)}

        <div class="row g-4 mt-1">
            ${sections}
        </div>

        <div class="showcase-end-actions">
            <button class="btn btn-primary btn-lg" type="button" data-action="menu">
                ${lesson.menuButtonText || "Explore the Full Workshop"}
            </button>
            ${links}
        </div>
    `;

    return renderPageShell(lesson, content, context);
}

function renderReflectionSummary(lesson, context) {
    const reflections = collectReflectionSummaryItems(context.courseData);
    const savedCount = reflections.filter(reflection =>
        loadResponse(reflection.storageKey).trim()
    ).length;

    const content = `
        <p class="lead">
            ${lesson.introduction}
        </p>

        <div class="alert alert-light mt-4">
            <strong>Responses saved:</strong>
            <span id="reflectionSummarySavedCount">${savedCount}</span> of ${reflections.length}
        </div>

        <button class="btn btn-outline-secondary mt-2 print-control" data-print-reflection-summary>
            Print Reflection Summary
        </button>

        <div class="reflection-summary mt-4">
            ${renderReflectionSummaryGroups(reflections)}
        </div>
    `;

    return renderPageShell(lesson, content, context);
}

function renderAccordionItemBody(item, lesson, index) {
    if (item.storageKey && item.exampleResponse) {
        return renderComparisonAccordionItem(item, lesson, index);
    }

    return `
        <div class="row g-4 align-items-center">
            <div class="col-md-4">
                ${renderImage(item.image, item.imageAlt, item.title)}
            </div>

            <div class="col-md-8">
                ${renderParagraphs(item.body)}
            </div>
        </div>
    `;
}

function renderComparisonAccordionItem(item, lesson, index) {
    const responseID = `${lesson.id}-comparison-${index}`;

    return `
        <section aria-labelledby="${responseID}-heading">
            <h3 class="h5 mb-3" id="${responseID}-heading">
                ${item.title} Comparison
            </h3>

            ${item.description ? `<p>${item.description}</p>` : ""}

            <div class="comparison-grid">
                <div class="comparison-card comparison-card-learner">
                    <h4 class="h6">Your Response</h4>
                    <div
                        class="comparison-response"
                        data-comparison-response="${item.storageKey}">
                    </div>
                </div>

                <div class="comparison-card comparison-card-example">
                    <h4 class="h6">Example Response</h4>
                    ${renderExampleList(item.exampleResponse, "mb-0")}
                </div>
            </div>
        </section>
    `;
}

function renderReflectionSummaryGroups(reflections) {
    const moduleGroups = groupReflectionsByModule(reflections);

    return moduleGroups.map(group => `
        <section
            class="reflection-summary-module"
            aria-labelledby="reflection-summary-${group.moduleKey}">
            <h3 id="reflection-summary-${group.moduleKey}">
                ${group.moduleTitle}
            </h3>

            <div class="reflection-summary-module-content">
                ${group.items.map(renderReflectionSummaryDisclosure).join("")}
            </div>
        </section>
    `).join("");
}

function renderReflectionSummaryDisclosure(reflection) {
    const promptID = `reflection-summary-prompt-${reflection.storageKey}`;
    const editorID = `reflection-summary-editor-${reflection.storageKey}`;

    return `
        <details
            class="reflection-summary-reflection"
            data-reflection-id="${reflection.reflectionId}"
            data-reflection-lesson="${reflection.lessonId}"
            data-reflection-storage-key="${reflection.storageKey}">
            <summary>${reflection.reflectionTitle || "Reflection"}</summary>

            <article class="reflection-summary-item">
                <div class="reflection-summary-block">
                    <h4>Reflection Prompt</h4>
                    <p id="${promptID}">${reflection.prompt}</p>
                </div>

                <div class="reflection-summary-block">
                    <h4>Your Response</h4>
                    ${renderReflectionSummaryResponse(reflection)}
                </div>

                <div class="reflection-summary-block">
                    <h4>What You Practiced</h4>
                    <p>${reflection.whatYouPracticed}</p>
                </div>

                <div class="reflection-summary-block">
                    <h4>How This Builds Your Skills</h4>
                    <p>${reflection.howThisBuildsYourSkills}</p>
                </div>

                ${renderLearningOutcomesDisclosure(reflection.learningOutcomes)}

                <div class="reflection-summary-actions print-control">
                    <button
                        class="btn btn-outline-primary btn-sm"
                        data-edit-reflection="${reflection.storageKey}"
                        aria-controls="${editorID}">
                        Edit Response
                    </button>

                    <button
                        class="btn btn-outline-secondary btn-sm"
                        data-review-reflection="${reflection.lessonId}">
                        Return to Activity
                    </button>
                </div>

                <div
                    id="${editorID}"
                    class="reflection-summary-editor print-control"
                    data-reflection-editor="${reflection.storageKey}"
                    hidden>
                    <label
                        class="form-label fw-semibold"
                        for="${editorID}-field">
                        Edit your response
                    </label>

                    <textarea
                        id="${editorID}-field"
                        class="form-control reflection-summary-edit-field"
                        rows="6"
                        data-reflection-edit-field="${reflection.storageKey}"
                        aria-describedby="${promptID} ${editorID}-fieldValidation"
                        data-required-response="${reflection.required === true}"
                        aria-required="${reflection.required === true}"></textarea>

                    ${renderResponseValidation(`${editorID}-field`)}

                    <div class="reflection-summary-edit-actions">
                        <button
                            class="btn btn-primary btn-sm"
                            data-save-reflection-edit="${reflection.storageKey}">
                            Save Changes
                        </button>

                        <button
                            class="btn btn-outline-secondary btn-sm"
                            data-cancel-reflection-edit="${reflection.storageKey}">
                            Cancel
                        </button>
                    </div>
                </div>
            </article>
        </details>
    `;
}

function renderReflectionSummaryResponse(reflection) {
    if (!reflection.comparisonReflectionId) {
        return `
            <div
                class="reflection-summary-response"
                data-reflection-summary-response="${reflection.storageKey}">
            </div>
        `;
    }

    return `
        <div class="reflection-definition-comparison">
            <div class="reflection-definition-card">
                <h6>Original Definition</h6>
                <div
                    class="reflection-summary-response"
                    data-reflection-summary-response="${reflection.comparisonReflectionId}">
                </div>
            </div>

            <div class="reflection-definition-card">
                <h6>Revised Definition</h6>
                <div
                    class="reflection-summary-response"
                    data-reflection-summary-response="${reflection.storageKey}">
                </div>
            </div>
        </div>
    `;
}

function renderLearningOutcomesDisclosure(learningOutcomeIDs = []) {
    const supportedOutcomes = learningOutcomeIDs
        .map(learningOutcomeID => learningOutcomes[learningOutcomeID])
        .filter(Boolean);

    if (!supportedOutcomes.length) return "";

    return `
        <details class="reflection-learning-outcomes mt-3">
            <summary>Learning Outcomes Supported</summary>
            <ul>
                ${supportedOutcomes.map(outcome => `<li>${outcome.title}</li>`).join("")}
            </ul>
        </details>
    `;
}

function renderCompetencySummary(lesson, practicedCompetencyIDs, competencies) {
    const practicedCompetencies = practicedCompetencyIDs
        .map(competencyID => competencies[competencyID])
        .filter(Boolean);

    if (!practicedCompetencies.length) return "";

    return `
        <section class="module-summary mt-4">
            <h3>${lesson.competencySummaryTitle}</h3>

            <p>${lesson.competencySummaryText}</p>

            <ul>
                ${practicedCompetencies.map(competency => `<li>${competency}</li>`).join("")}
            </ul>
        </section>
    `;
}

function collectReflectionSummaryItems(courseData) {
    if (!courseData || !courseData.modules) return [];

    const seenStorageKeys = new Set();
    const reflections = [];

    courseData.modules.forEach(module => {
        module.lessons.forEach(lesson => {
            getLessonReflectionItems(lesson).forEach(reflection => {
                if (!reflection.storageKey || seenStorageKeys.has(reflection.storageKey)) {
                    return;
                }

                seenStorageKeys.add(reflection.storageKey);

                const metadata = getReflectionMetadata(reflection.storageKey);

                reflections.push({
                    ...reflection,
                    ...metadata,
                    required: isRequiredReflection(courseData, reflection.storageKey),
                    storageKey: reflection.storageKey,
                    lessonId: metadata.lessonId || lesson.id,
                    moduleKey: module.key,
                    moduleTitle: module.title
                });
            });
        });
    });

    return reflections;
}

function getLessonReflectionItems(lesson) {
    if (lesson.type === "reflection" || lesson.type === "reflectionImage") {
        return getReflectionPrompts(lesson)
            .filter(prompt => prompt.storageKey)
            .map(prompt => ({
                prompt: prompt.prompt,
                storageKey: prompt.storageKey,
                reflectionTitle: prompt.reflectionTitle,
                rationale: prompt.rationale || lesson.rationale,
                competencies:
                    prompt.competencies || lesson.competencies || [],
                learningObjectives:
                    prompt.learningObjectives || lesson.learningObjectives || []
            }));
    }

    if (lesson.type === "guidedActivity") {
        return (lesson.slides || [])
            .filter(slide => slide.slideType === "reflection" && slide.storageKey)
            .map(slide => ({
                prompt: slide.prompt,
                storageKey: slide.storageKey,
                reflectionTitle: slide.reflectionTitle || slide.title,
                rationale: slide.rationale,
                competencies: slide.competencies || [],
                learningObjectives: slide.learningObjectives || []
            }));
    }

    if (lesson.type === "branchingScenario") {
        return getScenarioQuestions(lesson);
    }

    if (lesson.type === "inquiry") {
        return getInquiryQuestions(lesson);
    }

    if (lesson.type === "imageReveal") {
        return (lesson.steps || [])
            .filter(step => step.storageKey)
            .map(step => ({
                prompt: step.prompt,
                storageKey: step.storageKey,
                reflectionTitle: step.reflectionTitle || step.title,
                rationale: step.rationale,
                competencies: step.competencies || [],
                learningObjectives: step.learningObjectives || []
            }));
    }

    return [];
}

const reflectionOverviewModuleTitles = {
    culture: "Culture / Cultural Iceberg",
    stereotypes: "Stereotypes and Assumptions",
    ambiguity: "Tolerance of Ambiguity",
    daea: "Critical Reflection and DAEA",
    prague: "A Misunderstanding in Prague",
    incidents: "Additional Critical Incidents",
    "final-reflection": "Final Reflection"
};

function groupReflectionsByModule(reflections) {
    const groups = [];

    reflections.forEach(reflection => {
        let group = groups.find(item => item.moduleKey === reflection.moduleKey);

        if (!group) {
            group = {
                moduleKey: reflection.moduleKey,
                moduleTitle:
                    reflectionOverviewModuleTitles[reflection.moduleKey] ||
                    reflection.moduleTitle,
                items: []
            };
            groups.push(group);
        }

        group.items.push(reflection);
    });

    return groups;
}

function collectPracticedCompetencies(reflections) {
    const practicedCompetencies = [];

    reflections.forEach(reflection => {
        (reflection.competencies || []).forEach(competencyID => {
            if (!practicedCompetencies.includes(competencyID)) {
                practicedCompetencies.push(competencyID);
            }
        });
    });

    return practicedCompetencies;
}

// ---------- Events ----------

function attachSharedLessonEvents(lesson, context) {
    initializeResponseValidation();
    document.querySelectorAll("[data-action='next']").forEach(button => {
        button.addEventListener("click", () => {
            if (lesson.type === "guidedActivity") {
                context.advanceGuidedActivity?.(false);
                return;
            }
            // A scenario moves through its own steps before the lesson moves on.
            if (lesson.type === "branchingScenario" && context.advanceBranchingScenario?.()) return;
            if (lesson.type === "perspectiveFlip" && context.advancePerspectiveFlip?.()) return;
            if (lesson.type === "signalTranscript" && context.advanceSignalTranscript?.()) return;
            if (lesson.type === "inquiry" && context.advanceInquiry?.()) return;
            if (!validateRequiredFields()) return;
            if (lesson.type === "moduleComplete" && lesson.moduleKey) {
                if (context.completeModule) {
                    if (!context.completeModule(lesson.moduleKey)) return;
                } else {
                    const missing = getMissingRequiredResponses(context.currentModule)[0];
                    if (missing) {
                        context.goToLesson(missing.lessonId, missing.storageKey);
                        return;
                    }
                    markModuleComplete(lesson.moduleKey);
                }
            }

            if (context.nextLesson) {
                context.goToLesson(context.nextLesson.id);
            }
        });
    });

    document.querySelectorAll("[data-action='skip']").forEach(button => {
        button.addEventListener("click", () => {
            saveResponseDrafts();
            if (lesson.type === "branchingScenario" && context.skipBranchingScenario?.()) return;
            if (lesson.type === "perspectiveFlip" && context.skipPerspectiveFlip?.()) return;
            if (lesson.type === "inquiry" && context.skipInquiry?.()) return;
            if (lesson.type === "guidedActivity") context.advanceGuidedActivity?.(true);
            else if (context.nextLesson) context.goToLesson(context.nextLesson.id);
        });
    });

    document.querySelectorAll("[data-action='previous']").forEach(button => {
        button.addEventListener("click", () => {
            if (lesson.type === "branchingScenario" && context.retreatBranchingScenario?.()) return;
            if (lesson.type === "perspectiveFlip" && context.retreatPerspectiveFlip?.()) return;
            if (lesson.type === "signalTranscript" && context.retreatSignalTranscript?.()) return;
            if (lesson.type === "inquiry" && context.retreatInquiry?.()) return;
            if (context.previousLesson) {
                context.goToLesson(context.previousLesson.id);
            }
        });
    });

    document.querySelectorAll("[data-action='menu']").forEach(button => {
        button.addEventListener("click", () => {
            context.goToMenu();
        });
    });

    document.querySelectorAll(".reflection-box").forEach(textarea => {
        textarea.addEventListener("input", () => {
            const storageKey = textarea.dataset.storageKey;

            saveResponse(storageKey, textarea.value);

            const status = document.getElementById(`${storageKey}Status`);

            if (status) {
                status.textContent = "✓ Saved";

                setTimeout(() => {
                    status.textContent = "Your response will be saved in this browser.";
                }, 1500);
            }

            updateSavedResponseDisplays(storageKey);
            context.onResponsesChanged?.();
        });
    });

    document.querySelectorAll("[data-review-reflection]").forEach(button => {
        button.addEventListener("click", () => {
            context.goToLesson(button.dataset.reviewReflection);
        });
    });

    document.querySelectorAll("[data-edit-reflection]").forEach(button => {
        button.addEventListener("click", () => {
            openReflectionSummaryEditor(button.dataset.editReflection);
        });
    });

    document.querySelectorAll("[data-save-reflection-edit]").forEach(button => {
        button.addEventListener("click", () => {
            saveReflectionSummaryEdit(button.dataset.saveReflectionEdit);
        });
    });

    document.querySelectorAll("[data-cancel-reflection-edit]").forEach(button => {
        button.addEventListener("click", () => {
            closeReflectionSummaryEditor(button.dataset.cancelReflectionEdit);
        });
    });

    document.querySelectorAll(".reflection-summary details > summary").forEach(summary => {
        summary.addEventListener("keydown", event => {
            if (event.key !== "Enter" && event.key !== " ") return;

            event.preventDefault();
            summary.parentElement.open = !summary.parentElement.open;
        });
    });

    document.querySelectorAll("[data-print-reflection-summary]").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".reflection-summary details").forEach(disclosure => {
                disclosure.open = true;
            });

            window.print();
        });
    });

    document.querySelectorAll("[data-reflection-summary-response]").forEach(response => {
        const savedResponse = loadResponse(response.dataset.reflectionSummaryResponse);

        response.textContent = savedResponse.trim()
            ? savedResponse
            : "No response has been saved for this question.";
    });

    document.querySelectorAll("[data-comparison-response]").forEach(response => {
        const savedResponse = loadResponse(response.dataset.comparisonResponse);

        response.textContent = savedResponse.trim()
            ? savedResponse
            : "No response has been saved yet.";
    });

    updateSavedResponseDisplays();
}

function openReflectionSummaryEditor(storageKey) {
    const editor = document.querySelector(`[data-reflection-editor="${storageKey}"]`);
    const editButton = document.querySelector(`[data-edit-reflection="${storageKey}"]`);
    const textarea = document.querySelector(`[data-reflection-edit-field="${storageKey}"]`);

    if (!editor || !textarea) return;

    textarea.value = loadResponse(storageKey);
    clearResponseValidation(textarea);
    editor.hidden = false;

    if (editButton) {
        editButton.hidden = true;
    }

    textarea.focus();
}

function saveReflectionSummaryEdit(storageKey) {
    const textarea = document.querySelector(`[data-reflection-edit-field="${storageKey}"]`);

    if (!textarea) return;

    if (textarea.dataset.requiredResponse === "true" && !validateResponseField(textarea, "Please enter a response before continuing.")) {
        textarea.focus();
        return;
    }
    saveResponse(storageKey, textarea.value);
    updateReflectionSummaryResponseDisplays(storageKey);
    updateReflectionSummarySavedCount();
    closeReflectionSummaryEditor(storageKey);
}

function closeReflectionSummaryEditor(storageKey) {
    const editor = document.querySelector(`[data-reflection-editor="${storageKey}"]`);
    const editButton = document.querySelector(`[data-edit-reflection="${storageKey}"]`);
    const textarea = document.querySelector(`[data-reflection-edit-field="${storageKey}"]`);

    if (textarea) {
        textarea.value = loadResponse(storageKey);
        clearResponseValidation(textarea);
    }

    if (editor) {
        editor.hidden = true;
    }

    if (editButton) {
        editButton.hidden = false;
        editButton.focus();
    }
}

function updateReflectionSummaryResponseDisplays(targetStorageKey = null) {
    document.querySelectorAll("[data-reflection-summary-response]").forEach(response => {
        const storageKey = response.dataset.reflectionSummaryResponse;

        if (targetStorageKey && storageKey !== targetStorageKey) return;

        const savedResponse = loadResponse(storageKey);

        response.textContent = savedResponse.trim()
            ? savedResponse
            : "No response has been saved for this question.";
    });
}

function updateReflectionSummarySavedCount() {
    const savedCount = document.getElementById("reflectionSummarySavedCount");

    if (!savedCount) return;

    const storageKeys = Array.from(document.querySelectorAll("[data-reflection-storage-key]"))
        .map(reflection => reflection.dataset.reflectionStorageKey);

    savedCount.textContent = storageKeys.filter(storageKey =>
        loadResponse(storageKey).trim()
    ).length;
}

function updateSavedResponseDisplays(targetStorageKey = null) {
    document.querySelectorAll("[data-saved-response-display]").forEach(display => {
        const storageKey = display.dataset.savedResponseDisplay;

        if (targetStorageKey && storageKey !== targetStorageKey) return;

        const savedResponse = loadResponse(storageKey);

        display.textContent = savedResponse.trim()
            ? savedResponse
            : display.dataset.emptyMessage;
    });
}

function renderUnknownLessonType(lesson) {
    return `
        <section class="course-screen">
            <div class="container py-5">
                <div class="lesson-card">
                    <h2>Unknown Lesson Type</h2>
                    <p>
                        The lesson type <strong>${lesson.type}</strong>
                        does not have a renderer yet.
                    </p>
                </div>
            </div>
        </section>
    `;
}

function renderImageReveal(lesson, context) {
    return renderPageShell(
        lesson,
        renderImageRevealContent(lesson),
        context
    );
}
