// ======================================
// Reflection Renderer
// js/renderers/reflection.js
// ======================================
//
// Purpose:
// This renderer creates reflection pages.
// It supports both text-only reflections and reflections with an image.
//
// Used by lesson types:
// type: "reflection"
// type: "reflectionImage"
//
// Expected lesson fields:
// - title
// - moduleLabel
// - body
// - prompt
// - storageKey
// - placeholder
// - image
// - imageAlt
//
// What this file SHOULD do:
// - Display optional body text.
// - Display an optional image.
// - Display a reflection prompt.
// - Load any previously saved response.
//
// What this file should NOT do:
// - Save the response directly.
// - Control navigation.
// - Store course content.
//
// Connected files:
// - modules/*.js define reflection and reflectionImage lessons.
// - renderer.js attaches the autosave event.
// - storage.js loads and saves learner responses.
// - layout.js provides the page shell.
// ======================================

import { loadResponse } from "../storage.js";

import {
    renderPageShell,
    renderParagraphs,
    renderImage
} from "./layout.js";

export function renderReflection(lesson, context) {
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