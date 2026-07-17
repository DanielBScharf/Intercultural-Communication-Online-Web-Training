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

    attachSharedLessonEvents(lesson, context);
    initializeSortingActivity(lesson);
    initializeImageReveal(lesson);
    initializeStoryActivity(lesson);
    initializeGuidedActivity(lesson);
}

const lessonRenderers = {
    moduleIntro: renderModuleIntro,
    moduleComplete: renderModuleComplete,
    contentImage: renderContentImage,
    reflection: renderReflection,
    reflectionImage: renderReflection,
    reflectionSummary: renderReflectionSummary,
    twoColumn: renderTwoColumn,
    accordion: renderAccordion,
    sortingActivity: renderSortingActivity,
    imageReveal: renderImageReveal,
    storyActivity: renderStoryActivity,
    guidedActivity: renderGuidedActivity
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

                    <h2>${lesson.title}</h2>

                    ${content}

                </div>

                ${renderLessonNavigation(context)}
            </div>
        </section>
    `;
}

function renderLessonNavigation(context) {
    return `
        <div class="lesson-navigation">
            <button class="btn btn-outline-secondary"
                data-action="previous"
                ${!context.previousLesson ? "disabled" : ""}>
                Previous
            </button>

            <button class="btn btn-outline-secondary" data-action="menu">
                Return to Menu
            </button>

            <button class="btn btn-primary"
                data-action="next"
                ${!context.nextLesson ? "disabled" : ""}>
                Next
            </button>
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
    return `
        <section class="course-screen">
            <div class="container py-5">
                <div class="completion-card text-center">

                    <div class="completion-icon mb-3">
                        <i class="bi bi-check-circle-fill"></i>
                    </div>

                    <p class="text-uppercase fw-bold text-success">
                        ${lesson.moduleLabel}
                    </p>

                    <h2>${lesson.title}</h2>

                    <p class="lead">
                        ${lesson.completionMessage || `You completed ${lesson.completedModuleTitle}.`}
                    </p>

                    <div class="module-summary mt-4 text-start">
                        <h5>Key ideas from this module</h5>
                        <ul>
                            ${lesson.summary.map(item => `<li>${item}</li>`).join("")}
                        </ul>
                    </div>

                    <div class="mt-4">
                        <button class="btn btn-outline-secondary me-2" data-action="menu">
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

function renderReflection(lesson, context) {
    const reflectionPrompts = getReflectionPrompts(lesson);
    const reflectionMarkup = reflectionPrompts
        .map(prompt => renderReflectionBox(prompt))
        .join("");

    let content = "";

    if (lesson.image) {
        content = `
            <div class="row align-items-center g-5">
                <div class="col-lg-5">
                    ${renderImage(lesson.image, lesson.imageAlt, lesson.title)}
                </div>

                <div class="col-lg-7">
                    ${renderParagraphs(lesson.body)}
                    ${reflectionMarkup}
                </div>
            </div>
        `;
    } else {
        content = `
            ${renderParagraphs(lesson.body)}
            ${reflectionMarkup}
        `;
    }

    return renderPageShell(lesson, content, context);
}

function getReflectionPrompts(lesson) {
    if (lesson.prompts && lesson.prompts.length) {
        return lesson.prompts;
    }

    return [
        {
            prompt: lesson.prompt,
            storageKey: lesson.storageKey,
            placeholder: lesson.placeholder
        }
    ];
}

function renderReflectionBox(prompt) {
    const savedValue = loadResponse(prompt.storageKey);

    return `
        <div class="reflection-prompt mt-4">
            <label for="${prompt.storageKey}" class="form-label fw-semibold">
                ${prompt.prompt}
            </label>

            <textarea
                id="${prompt.storageKey}"
                class="form-control reflection-box"
                rows="6"
                data-storage-key="${prompt.storageKey}"
                placeholder="${prompt.placeholder || "Write your response here..."}">${savedValue}</textarea>

            <div class="save-status mt-2" id="${prompt.storageKey}Status">
                Your response will be saved in this browser.
            </div>
        </div>
    `;
}

function renderTwoColumn(lesson, context) {
    const content = `
        <div class="row g-4 mt-3">
            <div class="col-md-6">
                <div class="info-column">
                    <h5>${lesson.leftTitle}</h5>
                    <ul>${lesson.leftItems.map(item => `<li>${item}</li>`).join("")}</ul>
                </div>
            </div>

            <div class="col-md-6">
                <div class="info-column">
                    <h5>${lesson.rightTitle}</h5>
                    <ul>${lesson.rightItems.map(item => `<li>${item}</li>`).join("")}</ul>
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

function renderReflectionSummary(lesson, context) {
    const reflections = collectReflectionSummaryItems(context.courseData);
    const learningObjectives = context.courseData.learningObjectives || {};
    const objectiveCounts = countReflectionObjectives(
        reflections,
        learningObjectives
    );
    const savedCount = reflections.filter(reflection =>
        loadResponse(reflection.storageKey).trim()
    ).length;

    const content = `
        <p class="lead">
            ${lesson.introduction}
        </p>

        <div class="module-summary mt-4">
            <h3>How Your Reflections Supported the Learning Objectives</h3>

            <ul>
                ${Object.entries(learningObjectives).map(([objectiveID, objectiveText]) => `
                    <li>
                        <strong>${objectiveText}</strong>
                        &mdash; addressed in ${objectiveCounts[objectiveID] || 0} reflection(s)
                    </li>
                `).join("")}
            </ul>
        </div>

        <div class="alert alert-light mt-4">
            <strong>Responses saved:</strong>
            <span id="reflectionSummarySavedCount">${savedCount}</span> of ${reflections.length}
        </div>

        <button class="btn btn-outline-secondary mt-2 print-control" data-print-reflection-summary>
            Print Reflection Summary
        </button>

        <div class="reflection-summary mt-4">
            ${renderReflectionSummaryGroups(reflections, learningObjectives)}
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
                    <ul class="mb-0">
                        ${item.exampleResponse.map(example => `<li>${example}</li>`).join("")}
                    </ul>
                </div>
            </div>
        </section>
    `;
}

function renderReflectionSummaryGroups(reflections, learningObjectives) {
    const moduleGroups = groupReflectionsByModule(reflections);

    return moduleGroups.map(group => `
        <section class="reflection-summary-module">
            <h3>${group.moduleTitle}</h3>

            ${group.items.map(reflection => renderReflectionSummaryItem(
                reflection,
                learningObjectives
            )).join("")}
        </section>
    `).join("");
}

function renderReflectionSummaryItem(reflection, learningObjectives) {
    const objectiveTexts = resolveLearningObjectives(
        reflection.learningObjectives,
        learningObjectives
    );

    return `
        <article class="reflection-summary-item">
            <h4>${reflection.lessonTitle}</h4>

            <div class="reflection-summary-block">
                <h5>Prompt</h5>
                <p>${reflection.prompt}</p>
            </div>

            <div class="reflection-summary-block">
                <h5>Why this matters</h5>
                <p>${reflection.rationale || "This reflection supports your review of the workshop."}</p>
            </div>

            <div class="reflection-summary-block">
                <h5>
                    Connected learning objective${objectiveTexts.length === 1 ? "" : "s"}:
                </h5>
                ${objectiveTexts.length ? `
                    <ul>
                        ${objectiveTexts.map(objective => `<li>${objective}</li>`).join("")}
                    </ul>
                ` : `
                    <p>Learning objective alignment is not available for this reflection.</p>
                `}
            </div>

            <div class="reflection-summary-block">
                <h5>Learner response</h5>
                <div
                    class="reflection-summary-response"
                    data-reflection-summary-response="${reflection.storageKey}">
                </div>
            </div>

            <button
                class="btn btn-outline-primary btn-sm print-control"
                data-review-reflection="${reflection.lessonId}">
                Review or revise this response
            </button>
        </article>
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

                reflections.push({
                    ...reflection,
                    lessonId: lesson.id,
                    lessonTitle: lesson.title,
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
                rationale: prompt.rationale || lesson.rationale,
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
                rationale: slide.rationale,
                learningObjectives: slide.learningObjectives || []
            }));
    }

    if (lesson.type === "imageReveal") {
        return (lesson.steps || [])
            .filter(step => step.storageKey)
            .map(step => ({
                prompt: step.prompt,
                storageKey: step.storageKey,
                rationale: step.rationale,
                learningObjectives: step.learningObjectives || []
            }));
    }

    return [];
}

function groupReflectionsByModule(reflections) {
    const groups = [];

    reflections.forEach(reflection => {
        let group = groups.find(item => item.moduleKey === reflection.moduleKey);

        if (!group) {
            group = {
                moduleKey: reflection.moduleKey,
                moduleTitle: reflection.moduleTitle,
                items: []
            };
            groups.push(group);
        }

        group.items.push(reflection);
    });

    return groups;
}

function countReflectionObjectives(reflections, learningObjectives = {}) {
    const counts = {};

    Object.keys(learningObjectives).forEach(objectiveID => {
        counts[objectiveID] = 0;
    });

    reflections.forEach(reflection => {
        (reflection.learningObjectives || []).forEach(objectiveID => {
            if (Object.prototype.hasOwnProperty.call(counts, objectiveID)) {
                counts[objectiveID]++;
            }
        });
    });

    return counts;
}

function resolveLearningObjectives(objectiveIDs = [], learningObjectives = {}) {
    return objectiveIDs
        .map(objectiveID => learningObjectives[objectiveID])
        .filter(Boolean);
}

// ---------- Events ----------

function attachSharedLessonEvents(lesson, context) {
    document.querySelectorAll("[data-action='next']").forEach(button => {
        button.addEventListener("click", () => {
            if (lesson.type === "moduleComplete" && lesson.moduleKey) {
                if (context.completeModule) {
                    context.completeModule(lesson.moduleKey);
                } else {
                    markModuleComplete(lesson.moduleKey);
                }
            }

            if (context.nextLesson) {
                context.goToLesson(context.nextLesson.id);
            }
        });
    });

    document.querySelectorAll("[data-action='previous']").forEach(button => {
        button.addEventListener("click", () => {
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
        });
    });

    document.querySelectorAll("[data-review-reflection]").forEach(button => {
        button.addEventListener("click", () => {
            context.goToLesson(button.dataset.reviewReflection);
        });
    });

    document.querySelectorAll("[data-print-reflection-summary]").forEach(button => {
        button.addEventListener("click", () => {
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
