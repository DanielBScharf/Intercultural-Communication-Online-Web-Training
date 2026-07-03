// ======================================
// Transition Screen Renderers
// js/renderers/transitions.js
// ======================================
//
// Purpose:
// This file renders module transition screens:
// - module introduction pages
// - module completion pages
//
// Used by lesson types:
// type: "moduleIntro"
// type: "moduleComplete"
//
// What this file SHOULD do:
// - Display module opening screens.
// - Display module completion screens.
// - Provide clear transition points between modules.
//
// What this file should NOT do:
// - Store course content.
// - Control navigation logic.
// - Save learner responses.
//
// Connected files:
// - modules/*.js define moduleIntro and moduleComplete lessons.
// - renderer.js calls these renderers.
// - layout.js provides reusable page helpers.
// ======================================

import {
    renderPageShell,
    renderParagraphs,
    renderImage
} from "./layout.js";

export function renderModuleIntro(lesson, context) {
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

export function renderModuleComplete(lesson, context) {
    const summaryItems = lesson.summary
        .map(item => `<li>${item}</li>`)
        .join("");

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

                        <button class="btn btn-outline-secondary me-2"
                            data-action="menu">
                            Return to Menu
                        </button>

                        <button class="btn btn-primary"
                            data-action="next">
                            Begin Next Module
                        </button>

                    </div>

                </div>

            </div>

        </section>
    `;
}