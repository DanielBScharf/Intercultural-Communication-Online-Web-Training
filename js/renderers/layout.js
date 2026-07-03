// ======================================
// Shared Renderer Layout Helpers
// js/renderers/layout.js
// ======================================
//
// Purpose:
// This file contains reusable HTML helper functions used by many renderers.
//
// What this file SHOULD do:
// - Build shared page structure.
// - Build lesson navigation.
// - Build repeated UI patterns like paragraphs, prompt lists, and images.
//
// What this file should NOT do:
// - Store course content.
// - Control app navigation.
// - Save learner responses.
// - Contain lesson-specific logic.
//
// How to edit:
// If you want every lesson page to have a different wrapper, heading style,
// or navigation layout, edit renderPageShell() or renderLessonNavigation() here.
//
// Connected files:
// - renderers/*.js import these helpers.
// - renderer.js calls the individual lesson renderers.
// ======================================

export function renderPageShell(lesson, content, context) {
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

export function renderLessonNavigation(context) {
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

export function renderParagraphs(body = []) {
    if (!body || !body.length) return "";

    return body.map(paragraph => `<p>${paragraph}</p>`).join("");
}

export function renderPromptList(prompts = []) {
    if (!prompts || !prompts.length) return "";

    return `
        <div class="reflection-prompt mt-4">

            <h5>
                Think about it
            </h5>

            <ul>
                ${prompts.map(prompt => `<li>${prompt}</li>`).join("")}
            </ul>

        </div>
    `;
}

export function renderImage(image, imageAlt = "", label = "Image Placeholder") {
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