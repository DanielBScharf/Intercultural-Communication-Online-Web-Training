// ======================================
// Two-Column Renderer
// js/renderers/twoColumn.js
// ======================================
//
// Purpose:
// This renderer creates a two-column comparison page.
//
// Used by lesson type:
// type: "twoColumn"
//
// Expected lesson fields:
// - title
// - moduleLabel
// - leftTitle
// - leftItems
// - rightTitle
// - rightItems
// - note
//
// What this file SHOULD do:
// - Display two related lists side by side.
// - Display an optional note underneath.
//
// What this file should NOT do:
// - Store course content.
// - Control navigation.
// - Save learner responses.
//
// Connected files:
// - modules/*.js define twoColumn lessons.
// - renderer.js calls this renderer.
// - layout.js provides the shared page shell.
// ======================================

import { renderPageShell } from "./layout.js";

export function renderTwoColumn(lesson, context) {
    const content = `
        <div class="row g-4 mt-3">

            <div class="col-md-6">

                <div class="info-column">

                    <h5>
                        ${lesson.leftTitle}
                    </h5>

                    <ul>
                        ${lesson.leftItems.map(item => `<li>${item}</li>`).join("")}
                    </ul>

                </div>

            </div>

            <div class="col-md-6">

                <div class="info-column">

                    <h5>
                        ${lesson.rightTitle}
                    </h5>

                    <ul>
                        ${lesson.rightItems.map(item => `<li>${item}</li>`).join("")}
                    </ul>

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