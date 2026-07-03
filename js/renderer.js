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
    initializeImageReveal
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
}

const lessonRenderers = {
    moduleIntro: renderModuleIntro,
    moduleComplete: renderModuleComplete,
    contentImage: renderContentImage,
    reflection: renderReflection,
    reflectionImage: renderReflection,
    twoColumn: renderTwoColumn,
    accordion: renderAccordion,
    sortingActivity: renderSortingActivity,
    imageReveal: renderImageReveal
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
                        You completed ${lesson.completedModuleTitle}.
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
                            Begin Next Module
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
            </div>

            <div class="col-lg-5">
                ${renderImage(lesson.image, lesson.imageAlt, lesson.title)}
            </div>
        </div>
    `;

    return renderPageShell(lesson, content, context);
}

function renderReflection(lesson, context) {
    const savedValue = loadResponse(lesson.storageKey);

    const reflectionMarkup = `
        <div class="reflection-prompt mt-4">
            <label for="${lesson.storageKey}" class="form-label fw-semibold">
                ${lesson.prompt}
            </label>

            <textarea
                id="${lesson.storageKey}"
                class="form-control reflection-box"
                rows="6"
                data-storage-key="${lesson.storageKey}"
                placeholder="${lesson.placeholder || "Write your response here..."}">${savedValue}</textarea>

            <div class="save-status mt-2" id="${lesson.storageKey}Status">
                Your response will be saved in this browser.
            </div>
        </div>
    `;

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
                            <div class="row g-4 align-items-center">
                                <div class="col-md-4">
                                    ${renderImage(item.image, item.imageAlt, item.title)}
                                </div>

                                <div class="col-md-8">
                                    ${renderParagraphs(item.body)}
                                </div>
                            </div>
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

// ---------- Events ----------

function attachSharedLessonEvents(lesson, context) {
    document.querySelectorAll("[data-action='next']").forEach(button => {
        button.addEventListener("click", () => {
            if (lesson.type === "moduleComplete" && lesson.moduleKey) {
                markModuleComplete(lesson.moduleKey);
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