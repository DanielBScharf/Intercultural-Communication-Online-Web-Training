// ======================================
// App Controller
// js/app.js
// ======================================

import { courseData } from "./courseData.js";
import { renderLesson } from "./renderer.js";
import {
    saveCurrentLesson,
    loadCurrentLesson,
    loadCompletedModules,
    resetAllProgress
} from "./storage.js";

// -------------------------------
// App State
// -------------------------------

const appState = {
    currentLessonId: loadCurrentLesson(),
    completedModules: loadCompletedModules()
};

// -------------------------------
// Course Indexes
// -------------------------------

const lessonIndex = {};
const lessonSequence = [];

courseData.modules.forEach((module, moduleIndex) => {
    module.lessons.forEach((lesson, lessonIndexInModule) => {
        const indexedLesson = {
            ...lesson,
            moduleKey: module.key,
            moduleTitle: module.title,
            moduleIndex,
            lessonIndexInModule
        };

        lessonIndex[lesson.id] = indexedLesson;
        lessonSequence.push(indexedLesson);
    });
});

// -------------------------------
// App Initialization
// -------------------------------

function initApp() {
    renderSidebar();

    if (appState.currentLessonId && lessonIndex[appState.currentLessonId]) {
        goToLesson(appState.currentLessonId);
    } else {
        renderHome();
    }
}

// -------------------------------
// Home / Menu
// -------------------------------

function renderHome() {
    appState.currentLessonId = null;
    saveCurrentLesson(null);

    const app = document.getElementById("app");

    app.innerHTML = `
        <section class="hero-section">
            <div class="container">

                <div class="row align-items-center g-5">

                    <div class="col-lg-7">

                        <h1 class="display-4 fw-bold">
                            ${courseData.title}
                        </h1>

                        <p class="lead mt-4">
                            Build practical intercultural communication skills through guided reflection,
                            critical incidents, and real-world scenarios.
                        </p>

                        <p>
                            Created by <strong>${courseData.creator}</strong> • ${courseData.year}
                        </p>

                        <button class="btn btn-primary btn-lg mt-3" id="startCourse">
                            Begin First Module
                        </button>

                    </div>

                    <div class="col-lg-5">
                        <div class="placeholder-image rounded shadow-sm">
                            Hero Image
                        </div>
                    </div>

                </div>

            </div>
        </section>

        <section class="container my-5">

            <div class="accordion" id="learningObjectives">

                <div class="accordion-item">

                    <h2 class="accordion-header">

                        <button
                            class="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseObjectives">
                            Goals and Objectives
                        </button>

                    </h2>

                    <div id="collapseObjectives" class="accordion-collapse collapse">

                        <div class="accordion-body">

                            <ul>
                                ${courseData.objectives.map(objective => `
                                    <li>${objective}</li>
                                `).join("")}
                            </ul>

                        </div>

                    </div>

                </div>

            </div>

        </section>

        <section class="container mb-5">

            <h2 class="mb-4">
                Course Modules
            </h2>

            <div class="row g-4">

                ${courseData.modules.map(module => `
                    <div class="col-md-6 col-lg-4">

                        <div class="card module-card h-100">

                            <div class="card-body d-flex flex-column">

                                <h4>
                                    ${module.title}
                                </h4>

                                <p>
                                    ${module.description}
                                </p>

                                <button
                                    class="btn btn-outline-primary mt-auto"
                                    data-module-start="${module.key}">
                                    ${getModuleButtonText(module.key)}
                                </button>

                            </div>

                        </div>

                    </div>
                `).join("")}

            </div>

        </section>
    `;

    document.getElementById("startCourse").addEventListener("click", () => {
        goToModule(courseData.modules[0].key);
    });

    document.querySelectorAll("[data-module-start]").forEach(button => {
        button.addEventListener("click", () => {
            goToModule(button.dataset.moduleStart);
        });
    });

    updateSidebar();
}

// -------------------------------
// Sidebar
// -------------------------------

function renderSidebar() {
    const sidebar = document.getElementById("courseSidebar");

    sidebar.innerHTML = `
        <button id="sidebarToggle" class="sidebar-toggle" aria-label="Toggle course navigation">
            <i class="bi bi-list"></i>
        </button>

        <div class="sidebar-content">

            <h5 class="sidebar-title">
                Course Progress
            </h5>

            <div class="sidebar-progress-text mb-4">

                <p class="small text-muted mb-1">
                    Current Module
                </p>

                <h6 id="currentModuleTitle">
                    Course Menu
                </h6>

                <p id="lessonCounter" class="small mb-3">
                    Select a module to begin
                </p>

                <hr>

                <p class="small text-muted mb-1">
                    Overall Progress
                </p>

                <p id="moduleCounter" class="small fw-semibold">
                    0 of ${courseData.modules.length} modules complete
                </p>

            </div>

            <nav class="sidebar-nav">

                <button class="sidebar-link" data-menu-link>
                    <span class="status-dot"></span>
                    Menu
                </button>

                ${courseData.modules.map(module => `
                    <button class="sidebar-link"
                        data-sidebar-module="${module.key}">
                        <span class="status-dot"></span>
                        ${module.title}
                    </button>
                `).join("")}

            </nav>

            <button id="resetProgress"
                class="btn btn-sm btn-outline-danger mt-4 w-100">
                Reset Progress
            </button>

        </div>
    `;

    const sidebarToggle = document.getElementById("sidebarToggle");

    sidebarToggle.addEventListener("click", () => {
        sidebar.classList.toggle("sidebar-hidden");
    });

    document.querySelector("[data-menu-link]").addEventListener("click", () => {
        renderHome();
    });

    document.querySelectorAll("[data-sidebar-module]").forEach(button => {
        button.addEventListener("click", () => {
            goToModule(button.dataset.sidebarModule);
        });
    });

    document.getElementById("resetProgress").addEventListener("click", () => {
        const confirmReset = confirm(
            "Are you sure you want to reset all saved progress and responses?"
        );

        if (confirmReset) {
            resetAllProgress();
            location.reload();
        }
    });
}

function updateSidebar() {
    const currentLesson = appState.currentLessonId
        ? lessonIndex[appState.currentLessonId]
        : null;

    const currentModule = currentLesson
        ? courseData.modules[currentLesson.moduleIndex]
        : null;

    document.querySelectorAll(".sidebar-link").forEach(link => {
        link.classList.remove("active", "completed");
    });

    if (!currentLesson) {
        const menuLink = document.querySelector("[data-menu-link]");
        if (menuLink) menuLink.classList.add("active");
    }

    courseData.modules.forEach(module => {
        const moduleButton = document.querySelector(`[data-sidebar-module="${module.key}"]`);

        if (!moduleButton) return;

        if (module.key === currentModule?.key) {
            moduleButton.classList.add("active");
        }

        if (appState.completedModules[module.key]) {
            moduleButton.classList.add("completed");
        }
    });

    updateProgressText(currentLesson, currentModule);
}

function updateProgressText(currentLesson, currentModule) {
    const currentModuleTitle = document.getElementById("currentModuleTitle");
    const lessonCounter = document.getElementById("lessonCounter");
    const moduleCounter = document.getElementById("moduleCounter");

    if (!currentLesson || !currentModule) {
        currentModuleTitle.textContent = "Course Menu";
        lessonCounter.textContent = "Select a module to begin";
    } else {
        currentModuleTitle.textContent = currentModule.title;

        lessonCounter.textContent =
            `Lesson ${currentLesson.lessonIndexInModule + 1} of ${currentModule.lessons.length}: ${currentLesson.title}`;
    }

    const completedCount = Object.keys(appState.completedModules).length;

    moduleCounter.textContent =
        `${completedCount} of ${courseData.modules.length} modules complete`;
}

// -------------------------------
// Navigation
// -------------------------------

function goToModule(moduleKey) {
    const module = courseData.modules.find(module => module.key === moduleKey);

    if (!module) {
        console.warn(`Module not found: ${moduleKey}`);
        return;
    }

    goToLesson(module.lessons[0].id);
}

function goToLesson(lessonId) {
    const lesson = lessonIndex[lessonId];

    if (!lesson) {
        console.warn(`Lesson not found: ${lessonId}`);
        return;
    }

    appState.currentLessonId = lessonId;
    saveCurrentLesson(lessonId);

    const context = buildLessonContext(lesson);

    renderLesson(lesson, context);
    updateSidebar();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function buildLessonContext(lesson) {
    const sequenceIndex = lessonSequence.findIndex(item => item.id === lesson.id);

    const previousLesson = sequenceIndex > 0
        ? lessonSequence[sequenceIndex - 1]
        : null;

    const nextLesson = sequenceIndex < lessonSequence.length - 1
        ? lessonSequence[sequenceIndex + 1]
        : null;

    return {
        currentLesson: lesson,
        currentModule: courseData.modules[lesson.moduleIndex],
        previousLesson,
        nextLesson,
        goToLesson,
        goToMenu: renderHome,
        completeModule
    };
}

function completeModule(moduleKey) {
    appState.completedModules[moduleKey] = true;

    localStorage.setItem(
        "interculturalWorkshop_completedModules",
        JSON.stringify(appState.completedModules)
    );

    updateSidebar();
}

// -------------------------------
// Helpers
// -------------------------------

function getModuleButtonText(moduleKey) {
    if (appState.completedModules[moduleKey]) {
        return "Review Module";
    }

    return "Begin Module";
}

// -------------------------------
// Start App
// -------------------------------

initApp();