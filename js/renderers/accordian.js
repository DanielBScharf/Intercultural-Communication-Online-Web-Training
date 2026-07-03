// ======================================
// Accordion Renderer
// js/renderers/accordion.js
// ======================================
//
// Purpose:
// This renderer creates a Bootstrap accordion lesson page.
//
// Used by lesson type:
// type: "accordion"
//
// Expected lesson fields:
// - title
// - moduleLabel
// - intro
// - items
//
// Each accordion item can include:
// - title
// - image
// - imageAlt
// - body
//
// What this file SHOULD do:
// - Display expandable sections.
// - Display optional images inside each section.
// - Display body text for each section.
//
// What this file should NOT do:
// - Store course content.
// - Control navigation.
// - Save learner responses.
//
// Connected files:
// - modules/*.js define accordion lessons.
// - renderer.js calls this renderer.
// - layout.js provides shared page helpers.
// ======================================

import {
    renderPageShell,
    renderParagraphs,
    renderImage
} from "./layout.js";

export function renderAccordion(lesson, context) {
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