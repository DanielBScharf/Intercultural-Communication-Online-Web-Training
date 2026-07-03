// ======================================
// Content + Image Renderer
// js/renderers/contentImage.js
// ======================================
//
// Purpose:
// This renderer creates a lesson page with text on one side
// and an image or image placeholder on the other.
//
// Used by lesson type:
// type: "contentImage"
//
// Expected lesson fields:
// - title
// - moduleLabel
// - body
// - prompts
// - note
// - image
// - imageAlt
//
// What this file SHOULD do:
// - Display lesson text.
// - Display optional prompt questions.
// - Display an optional note.
// - Display an image or placeholder.
//
// What this file should NOT do:
// - Store course content.
// - Control navigation.
// - Save learner responses.
//
// Connected files:
// - modules/*.js define contentImage lessons.
// - renderer.js calls this renderer.
// - layout.js provides reusable helper functions.
// ======================================

import {
    renderPageShell,
    renderParagraphs,
    renderPromptList,
    renderImage
} from "./layout.js";

export function renderContentImage(lesson, context) {
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