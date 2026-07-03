// ======================================
// Main Lesson Renderer
// js/renderer.js
// ======================================
//
// Purpose:
// This file is the central rendering coordinator.
// It receives a lesson object from app.js and decides which
// specialized renderer should display it.
//
// What this file SHOULD do:
// - Import lesson-type renderers.
// - Match lesson.type to the correct renderer.
// - Insert the rendered HTML into <main id="app">.
// - Attach shared lesson events after rendering.
//
// What this file should NOT do:
// - Store course content.
// - Control navigation state.
// - Save or load localStorage directly, except through imported helpers.
// - Contain large blocks of lesson-specific HTML.
//
// How to edit:
// If you create a new lesson type, import its renderer here and add it
// to the lessonRenderers object.
//
// Connected files:
// - app.js sends lessons here.
// - modules/*.js define lesson content and lesson types.
// - renderers/*.js contain the HTML templates for each lesson type.
// - storage.js saves learner responses and progress.
// ======================================

import { saveResponse, markModuleComplete } from "./storage.js";
import { renderContentImage } from "./renderers/contentImage.js";
import { renderReflection } from "./renderers/reflection.js";
import { renderTwoColumn } from "./renderers/twoColumn.js";
import { renderAccordion } from "./renderers/accordion.js";
import { renderSortingActivity } from "./renderers/sortingActivity.js";
import {
    renderModuleIntro,
    renderModuleComplete
} from "./renderers/transitions.js";

const lessonRenderers = {
    moduleIntro: renderModuleIntro,
    contentImage: renderContentImage,
    reflection: renderReflection,
    reflectionImage: renderReflection,
    twoColumn: renderTwoColumn,
    accordion: renderAccordion,
    sortingActivity: renderSortingActivity,
    moduleComplete: renderModuleComplete
};

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
}

function renderUnknownLessonType(lesson) {
    return `
        <section class="course-screen">
            <div class="container py-5">
                <div class="lesson-card">
                    <h2>Unknown Lesson Type</h2>
                    <p>
                        The lesson type
                        <strong>${lesson.type}</strong>
                        does not have a renderer yet.
                    </p>
                </div>
            </div>
        </section>
    `;
}

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