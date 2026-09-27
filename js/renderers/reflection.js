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

export function renderReflectionPurposeDisclosure(reflection, competencyDefinitions = {}) {
    if (reflection?.showPurposeDisclosure === false) return "";
    if (!reflection?.rationale && !reflection?.competencies?.length) return "";

    const competencies = (reflection.competencies || [])
        .map(competencyID => competencyDefinitions[competencyID])
        .filter(Boolean);

    if (!reflection.rationale && !competencies.length) return "";

    return `
        <details class="reflection-purpose mt-3">
            <summary>Why does this reflection matter?</summary>

            <div class="reflection-purpose-content">
                ${reflection.rationale ? `
                    <section class="reflection-summary-block">
                        <h3>Why This Reflection Matters</h3>
                        ${renderRationaleParagraphs(reflection.rationale)}
                    </section>
                ` : ""}

                ${competencies.length ? `
                    <section class="reflection-summary-block">
                        <h3>Competencies Practiced</h3>
                        <ul>
                            ${competencies.map(competency => `<li>${competency}</li>`).join("")}
                        </ul>
                    </section>
                ` : ""}
            </div>
        </details>
    `;
}

function renderRationaleParagraphs(rationale) {
    if (!rationale) return "";

    const paragraphs = Array.isArray(rationale)
        ? rationale
        : rationale.split(/\n\s*\n/);

    return paragraphs
        .map(paragraph => `<p>${paragraph.trim()}</p>`)
        .join("");
}

export function renderReflection(lesson, context) {
    const savedValue = loadResponse(lesson.storageKey);
    const purposeMarkup = renderReflectionPurposeDisclosure(
        lesson,
        context.courseData?.competencies || {}
    );

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

        ${purposeMarkup}
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
