// ======================================
// Renderer
// js/renderer.js
// ======================================

import { saveResponse, loadResponse, markModuleComplete } from "./storage.js";

// --------------------------------------
// Main render function
// --------------------------------------

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

    attachLessonEvents(lesson, context);
}

// --------------------------------------
// Lesson type renderers
// --------------------------------------

const lessonRenderers = {
    moduleIntro: renderModuleIntro,
    contentImage: renderContentImage,
    reflection: renderReflection,
    reflectionImage: renderReflectionImage,
    twoColumn: renderTwoColumn,
    accordion: renderAccordion,
    sortingActivity: renderSortingActivity,
    moduleComplete: renderModuleComplete
};

// --------------------------------------
// Shared layout pieces
// --------------------------------------

function renderPageShell(lesson, content, context) {
    return `
        <section class="course-screen">
            <div class="container py-5">

                <div class="lesson-card">

                    <p class="text-uppercase fw-bold text-primary mb-2">
                        ${lesson.moduleLabel || context.currentModule.title}
                    </p>

                    <h2>
                        ${lesson.title}
                    </h2>

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

            <button class="btn btn-outline-secondary"
                data-action="menu">
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
    return body.map(paragraph => `<p>${paragraph}</p>`).join("");
}

function renderPromptList(prompts = []) {
    if (!prompts.length) return "";

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

// --------------------------------------
// Module Intro
// --------------------------------------

function renderModuleIntro(lesson, context) {
    const content = `
        <div class="row align-items-center g-5">

            <div class="col-lg-7">

                ${renderParagraphs(lesson.body)}

                <button class="btn btn-primary btn-lg mt-3"
                    data-action="next">
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

// --------------------------------------
// Content + Image
// --------------------------------------

function renderContentImage(lesson, context) {
    const content = `
        <div class="row align-items-center g-5">

            <div class="col-lg-7">

                ${renderParagraphs(lesson.body)}

                ${lesson.note ? `<div class="alert alert-light mt-4">${lesson.note}</div>` : ""}

                ${renderPromptList(lesson.prompts)}

            </div>

            <div class="col-lg-5">
                ${renderImage(lesson.image, lesson.imageAlt, lesson.title)}
            </div>

        </div>
    `;

    return renderPageShell(lesson, content, context);
}

// --------------------------------------
// Reflection
// --------------------------------------

function renderReflection(lesson, context) {
    const savedValue = loadResponse(lesson.storageKey);

    const content = `
        ${renderParagraphs(lesson.body)}

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

    return renderPageShell(lesson, content, context);
}

// --------------------------------------
// Reflection + Image
// --------------------------------------

function renderReflectionImage(lesson, context) {
    const savedValue = loadResponse(lesson.storageKey);

    const content = `
        <div class="row align-items-center g-5">

            <div class="col-lg-5">
                ${renderImage(lesson.image, lesson.imageAlt, lesson.title)}
            </div>

            <div class="col-lg-7">

                <div class="reflection-prompt">

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

            </div>

        </div>
    `;

    return renderPageShell(lesson, content, context);
}

// --------------------------------------
// Two Column
// --------------------------------------

function renderTwoColumn(lesson, context) {
    const content = `
        <div class="row g-4 mt-3">

            <div class="col-md-6">

                <div class="info-column">

                    <h5>${lesson.leftTitle}</h5>

                    <ul>
                        ${lesson.leftItems.map(item => `<li>${item}</li>`).join("")}
                    </ul>

                </div>

            </div>

            <div class="col-md-6">

                <div class="info-column">

                    <h5>${lesson.rightTitle}</h5>

                    <ul>
                        ${lesson.rightItems.map(item => `<li>${item}</li>`).join("")}
                    </ul>

                </div>

            </div>

        </div>

        ${lesson.note ? `<div class="alert alert-warning mt-4">${lesson.note}</div>` : ""}
    `;

    return renderPageShell(lesson, content, context);
}

// --------------------------------------
// Accordion
// --------------------------------------

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

// --------------------------------------
// Sorting Activity
// --------------------------------------

function renderSortingActivity(lesson, context) {
    const content = `
        <p class="lead">${lesson.instructions}</p>

        <div class="alert alert-light">
            Click an item, then choose whether it belongs to visible culture or hidden culture.
        </div>

        <div class="row g-4 mt-3">

            <div class="col-lg-4">

                <h5>Cultural Items</h5>

                <div class="d-grid gap-2" id="sortingItems">

                    ${lesson.items.map((item, index) => `
                        <button
                            class="btn btn-outline-primary culture-sort-item"
                            data-sort-index="${index}">
                            ${item.text}
                        </button>
                    `).join("")}

                </div>

            </div>

            ${lesson.categories.map(category => `
                <div class="col-lg-4">

                    <div class="sort-column" data-sort-category="${category.key}">

                        <h5>${category.title}</h5>

                        <p class="text-muted">
                            ${category.description}
                        </p>

                        <div class="sort-placeholder">
                            Items will appear here.
                        </div>

                    </div>

                </div>
            `).join("")}

        </div>

        <div id="sortingFeedback" class="mt-4"></div>
    `;

    return renderPageShell(lesson, content, context);
}

// --------------------------------------
// Module Complete
// --------------------------------------

function renderModuleComplete(lesson, context) {
    const summaryItems = lesson.summary.map(item => `<li>${item}</li>`).join("");

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

                    <h2>
                        ${lesson.title}
                    </h2>

                    <p class="lead">
                        You completed ${lesson.completedModuleTitle}.
                    </p>

                    <div class="module-summary mt-4 text-start">

                        <h5>
                            Key ideas from this module
                        </h5>

                        <ul>
                            ${summaryItems}
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

// --------------------------------------
// Unknown Lesson Type
// --------------------------------------

function renderUnknownLessonType(lesson) {
    return `
        <section class="course-screen">
            <div class="container py-5">
                <div class="lesson-card">
                    <h2>Unknown Lesson Type</h2>
                    <p>The lesson type <strong>${lesson.type}</strong> does not have a renderer yet.</p>
                </div>
            </div>
        </section>
    `;
}

// --------------------------------------
// Event binding after render
// --------------------------------------

function attachLessonEvents(lesson, context) {
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

    initializeSortingActivity(lesson);
}

// --------------------------------------
// Sorting Activity Logic
// --------------------------------------

function initializeSortingActivity(lesson) {
    if (lesson.type !== "sortingActivity") return;

    const feedback = document.getElementById("sortingFeedback");

    document.querySelectorAll(".culture-sort-item").forEach(button => {
        button.addEventListener("click", () => {
            const itemIndex = Number(button.dataset.sortIndex);
            const item = lesson.items[itemIndex];

            const userChoice = prompt(
                `Where does "${item.text}" belong?\nType "visible" or "hidden".`
            );

            if (!userChoice) return;

            const normalizedChoice = userChoice.toLowerCase().trim();

            if (normalizedChoice === item.answer) {
                button.classList.remove("btn-outline-primary");
                button.classList.add("btn-success");
                button.disabled = true;

                if (feedback) {
                    feedback.innerHTML = `
                        <div class="alert alert-success">
                            Correct! ${item.text} is usually part of ${item.answer} culture.
                        </div>
                    `;
                }
            } else {
                if (feedback) {
                    feedback.innerHTML = `
                        <div class="alert alert-warning">
                            Not quite. Try thinking about whether this is easy to observe quickly
                            or whether it is usually hidden below the surface.
                        </div>
                    `;
                }
            }
        });
    });
}