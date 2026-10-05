// ======================================
// App Controller
// js/app.js
// ======================================

import { courseData } from "./courseData.js";
import { renderLesson } from "./renderer.js";
import { getMissingRequiredResponses, validateRequiredFields, saveResponseDrafts, isExploreModeOn, setExploreMode } from "./reflectionValidation.js";
import { getReflectionMetadata } from "./metaData/reflectionsMetadata.js";
import {
    saveItem,
    loadItem,
    saveCurrentLesson,
    loadCurrentLesson,
    saveCompletedModules,
    loadCompletedModules,
    resetAllProgress
} from "./storage.js";

const REFLECTION_SUMMARY_ID = "reflection-summary";
const REFLECTION_SUMMARY_INTRODUCED_KEY = "reflectionSummaryIntroduced";
const RESUME_LESSON_KEY = "resumeLesson";
const SESSION_ACTIVE_KEY = "interculturalWorkshop_sessionActive";
const SHOWCASE_HASH = "#showcase";
const REPOSITORY_URL = "https://github.com/DanielBScharf/Intercultural-Communication-Online-Web-Training";

// -------------------------------
// App State
// -------------------------------

const appState = {
    currentLessonId: loadCurrentLesson(),
    activeModuleKey: loadItem("activeModuleKey", null),
    startedModuleKeys: loadItem("startedModuleKeys", []),
    completedModules: loadCompletedModules(),
    reflectionSummaryIntroduced: loadItem(REFLECTION_SUMMARY_INTRODUCED_KEY, false)
};

let shouldAnimateReflectionSummaryUnlock = false;

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

// The showcase is a separate route. Its screens are indexed so they can
// be opened, but they are not part of the module sequence, the module
// count, or module completion.
const showcaseSequence = [];

(courseData.showcase?.lessons || []).forEach((lesson, lessonIndexInModule) => {
    const indexedLesson = {
        ...lesson,
        moduleKey: courseData.showcase.key,
        moduleTitle: courseData.showcase.title,
        moduleIndex: -1,
        lessonIndexInModule,
        isShowcase: true
    };

    lessonIndex[lesson.id] = indexedLesson;
    showcaseSequence.push(indexedLesson);
});

// -------------------------------
// App Initialization
// -------------------------------

function initApp() {
    renderSidebar();

    if (isWorkshopComplete() && !appState.reflectionSummaryIntroduced) {
        introduceReflectionSummary({ animate: true });
    }

    // Progress saved before the resume point existed still counts.
    if (lessonIndex[appState.currentLessonId] && !loadItem(RESUME_LESSON_KEY, null)) {
        saveItem(RESUME_LESSON_KEY, appState.currentLessonId);
    }

    const isReload = isReloadInSameTab();

    // A link ending in #showcase opens the showcase directly. A reload
    // partway through the showcase stays where the learner was.
    const isInShowcase = Boolean(lessonIndex[appState.currentLessonId]?.isShowcase);

    if (window.location.hash === SHOWCASE_HASH && showcaseSequence.length && !(isReload && isInShowcase)) {
        goToShowcase();
        return;
    }

    // A new visit opens on the home page, which offers to resume.
    // Reloading the page in the same tab stays on the current lesson.
    if (!isReload) {
        renderHome();
        return;
    }

    // Reflection Summary is a post-workshop page, not part of the lesson index.
    if (
        appState.currentLessonId === REFLECTION_SUMMARY_ID &&
        isReflectionSummaryAvailable()
    ) {
        goToReflectionSummary();
    } else if (appState.currentLessonId && lessonIndex[appState.currentLessonId]) {
        goToLesson(appState.currentLessonId);
    } else {
        renderHome();
    }
}

// sessionStorage lasts only as long as the browser tab, so it tells a
// reload apart from a new visit. If it is unavailable, keep the learner
// on their lesson.
function isReloadInSameTab() {
    try {
        const wasActive = sessionStorage.getItem(SESSION_ACTIVE_KEY) === "true";
        sessionStorage.setItem(SESSION_ACTIVE_KEY, "true");
        return wasActive;
    } catch (error) {
        return true;
    }
}

// The lesson the learner was last on, kept even after they return to the menu.
function getResumeLesson() {
    return lessonIndex[loadItem(RESUME_LESSON_KEY, null)] || null;
}

// -------------------------------
// Home / Menu
// -------------------------------

// Ways to reach the author, from courseData.contact. Empty values are left out.
function renderContactLinks() {
    const contact = courseData.contact || {};
    const links = [
        contact.email ? `<a href="mailto:${contact.email}">${contact.email}</a>` : "",
        contact.linkedin ? `<a href="${contact.linkedin}">LinkedIn</a>` : "",
        contact.website ? `<a href="${contact.website}">${contact.website.replace(/^https?:\/\//, "")}</a>` : ""
    ].filter(Boolean);

    return links.join(" • ");
}

function renderHome() {
    const currentModule = getCurrentModule();
    if (!appState.activeModuleKey && currentModule) setActiveModule(currentModule);
    appState.currentLessonId = null;
    saveCurrentLesson(null);

    const resumeLesson = getResumeLesson();
    const hasShowcase = showcaseSequence.length > 0;
    const resumeInShowcase = Boolean(resumeLesson?.isShowcase);
    const resumeInWorkshop = Boolean(resumeLesson) && !resumeInShowcase;
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

                        <div class="home-actions mt-4">
                            ${hasShowcase ? `
                                <button class="btn btn-primary btn-lg" id="startShowcase">
                                    ${resumeInShowcase ? "Resume the Showcase" : "Take the 10-Minute Showcase"}
                                </button>
                            ` : ""}

                            ${resumeInWorkshop ? `
                                <button class="btn ${hasShowcase ? "btn-outline-secondary secondary-navigation-button" : "btn-primary"} btn-lg" id="resumeCourse">
                                    Resume Workshop
                                </button>
                            ` : `
                                <button class="btn ${hasShowcase ? "btn-outline-secondary secondary-navigation-button" : "btn-primary"} btn-lg" id="startCourse">
                                    ${hasShowcase ? "Begin the Full Workshop" : "Begin Workshop"}
                                </button>
                            `}
                        </div>

                        ${hasShowcase ? `
                            <p class="home-resume-note mt-3 mb-0">
                                The showcase is a short tour of the key ideas and activities.
                            </p>
                        ` : ""}

                        ${resumeInWorkshop ? `
                            <p class="home-resume-note mt-2 mb-0">
                                You left off in <strong>${resumeLesson.moduleTitle}</strong>.
                                <button class="btn btn-link home-restart-link" id="startCourse">Start the workshop from the beginning</button>
                            </p>
                        ` : ""}

                        ${resumeInShowcase ? `
                            <p class="home-resume-note mt-2 mb-0">
                                You left off partway through the showcase.
                                <button class="btn btn-link home-restart-link" id="restartShowcase">Start the showcase again</button>
                            </p>
                        ` : ""}

                    </div>

                    <div class="col-lg-5">
                        <img
                            src="${courseData.heroImage}"
                            alt="${courseData.heroImageAlt}"
                            class="img-fluid rounded shadow-sm hero-image">
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

                            <p>By the end of this workshop, you will be able to:</p>

                            <ol>
                                ${courseData.objectives.map(objective => `
                                    <li>${objective}</li>
                                `).join("")}
                            </ol>

                        </div>

                    </div>

                </div>

            </div>

        </section>

        <section class="container mb-5">

            <h2 class="mb-3">
                Course Modules
            </h2>

            <div class="form-check form-switch explore-mode mb-4">
                <input class="form-check-input" type="checkbox" role="switch" id="exploreMode"
                    aria-describedby="exploreModeHelp" ${isExploreModeOn() ? "checked" : ""}>
                <label class="form-check-label" for="exploreMode">Explore freely</label>
                <p class="explore-mode-help" id="exploreModeHelp">
                    On for reviewers: open any section in any order without completing the required reflections.
                    Turn this off to take the workshop as a learner would.
                </p>
            </div>

            <div class="row g-4">

                ${courseData.modules.map(module => `
                    <div class="col-md-6 col-lg-4">

                        <div class="card module-card h-100">

                            ${module.image ? `
                                <img
                                    src="${module.image}"
                                    alt=""
                                    class="card-img-top module-card-image">
                            ` : ""}

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

        <section class="container project-development-section my-5" aria-labelledby="aboutProjectTitle">
            <div class="project-development-content">
                <div class="project-documentation">
                    <h2 class="h4 mb-2" id="aboutProjectTitle">
                        About This Project
                    </h2>

                    <p>
                        This workshop was designed, written, and built by ${courseData.creator} as an instructional design project. The project documentation covers the design decisions, learning architecture, development process, and technical implementation.
                    </p>

                    <a
                        class="project-documentation-link"
                        href="${REPOSITORY_URL}/blob/main/docs/DESIGN_DECISIONS.md">
                        View Project Documentation <span aria-hidden="true">→</span>
                    </a>
                    ${renderContactLinks() ? `<p class="project-contact mt-3 mb-0">Get in touch: ${renderContactLinks()}</p>` : ""}
                </div>

                <div class="project-status-callout mt-4">
                    <h3 class="h5 mb-2">
                        Version 1 and Roadmap
                    </h3>

                    <p class="mb-0">
                        All seven modules are complete and can be taken from start to finish. The workshop continues to be refined, and the additions planned next are listed below.
                    </p>
                </div>

                <details class="project-roadmap mt-3">
                    <summary>Planned Additions</summary>

                    <div class="project-roadmap-content">
                        <ul class="project-roadmap-list">
                            <li>
                                <strong>REFLECTION RESULTS BY EMAIL</strong>
                                <span>Allow learners to send themselves a copy of their workshop reflections and takeaways after completing the workshop.</span>
                            </li>
                            <li>
                                <strong>EXPANDED ACCESSIBILITY</strong>
                                <span>Continue accessibility testing and refinement, including keyboard navigation, screen-reader support, alternative text and descriptions, responsive behavior, and reduced-motion support.</span>
                            </li>
                            <li>
                                <strong>LOCALIZATION</strong>
                                <span>Explore additional language support, beginning with Spanish localization.</span>
                            </li>
                            <li>
                                <strong>ADDITIONAL SCENARIOS AND ACTIVITIES</strong>
                                <span>Expand the collection of intercultural critical incidents and opportunities to practice applying workshop strategies.</span>
                            </li>
                            <li>
                                <strong>VOICED SCENARIOS</strong>
                                <span>Add voice-over to the branching scenarios, with the text kept on screen as a transcript.</span>
                            </li>
                            <li>
                                <strong>CULTURAL DIMENSIONS SELF-CHECK</strong>
                                <span>Add a short activity where learners place themselves on scales such as direct to indirect communication, then see how someone at the other end might read their behavior.</span>
                            </li>
                            <li>
                                <strong>LEARNER RESOURCES</strong>
                                <span>Develop downloadable or printable resources that learners can use after completing the workshop.</span>
                            </li>
                            <li>
                                <strong>ONGOING EVALUATION</strong>
                                <span>Conduct learner testing and use feedback to refine content, interactions, and instructional sequencing.</span>
                            </li>
                        </ul>
                    </div>
                </details>
            </div>
        </section>

        <footer class="site-footer">
            <div class="container">
                <p class="mb-2">
                    Designed and built by ${courseData.creator} • ${courseData.year} •
                    <a href="${REPOSITORY_URL}">View the source on GitHub</a>
                </p>
                ${renderContactLinks() ? `<p class="mb-0">Contact: ${renderContactLinks()}</p>` : ""}
            </div>
        </footer>
    `;

    document.getElementById("startCourse").addEventListener("click", () => {
        goToModule(courseData.modules[0].key);
    });

    document.getElementById("resumeCourse")?.addEventListener("click", () => {
        goToLesson(resumeLesson.id);
    });

    document.getElementById("startShowcase")?.addEventListener("click", () => {
        if (resumeInShowcase) goToLesson(resumeLesson.id);
        else goToShowcase();
    });

    document.getElementById("restartShowcase")?.addEventListener("click", goToShowcase);

    document.getElementById("exploreMode")?.addEventListener("change", event => {
        setExploreMode(event.target.checked);
        updateSidebar();
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
        <button
            id="sidebarToggle"
            class="sidebar-toggle"
            aria-label="Toggle course navigation"
            aria-controls="courseSidebar"
            aria-expanded="false">
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

                ${showcaseSequence.length ? `
                    <button class="sidebar-link" data-showcase-link>
                        <span class="status-dot"></span>
                        ${courseData.showcase.title}
                    </button>
                ` : ""}

                ${courseData.modules.map(module => `
                    <button class="sidebar-link"
                        data-sidebar-module="${module.key}">
                        <span class="status-dot"></span>
                        ${module.title}
                    </button>
                `).join("")}

                <button
                    class="sidebar-link reflection-summary-link"
                    data-reflection-summary-link
                    hidden>
                    <span class="status-dot"></span>
                    Reflection Summary
                </button>

            </nav>

            <button id="resetProgress"
                class="btn btn-sm btn-outline-danger mt-4 w-100">
                Reset Progress
            </button>

        </div>
    `;

    const sidebarBackdrop = ensureSidebarBackdrop();
    const sidebarToggle = document.getElementById("sidebarToggle");

    sidebarToggle.addEventListener("click", event => {
        event.stopPropagation();
        toggleSidebar();
    });

    sidebar.addEventListener("click", event => {
        event.stopPropagation();
    });

    sidebarBackdrop.addEventListener("click", () => {
        closeSidebar();
    });

    document.querySelector("[data-menu-link]").addEventListener("click", () => {
        renderHome();
        closeSidebarAfterOverlayNavigation();
    });

    document.querySelector("[data-showcase-link]")?.addEventListener("click", () => {
        goToShowcase();
        closeSidebarAfterOverlayNavigation();
    });

    document.querySelectorAll("[data-sidebar-module]").forEach(button => {
        button.addEventListener("click", () => {
            goToModule(button.dataset.sidebarModule);
            closeSidebarAfterOverlayNavigation();
        });
    });

    document.querySelector("[data-reflection-summary-link]").addEventListener("click", () => {
        goToReflectionSummary();
        closeSidebarAfterOverlayNavigation();
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

    document.addEventListener("click", event => {
        if (!isSidebarOpen() || sidebar.contains(event.target)) return;
        closeSidebar();
    });

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape" || !isSidebarOpen()) return;

        closeSidebar({ returnFocus: true });
    });
}

function ensureSidebarBackdrop() {
    let sidebarBackdrop = document.getElementById("sidebarBackdrop");

    if (sidebarBackdrop) {
        return sidebarBackdrop;
    }

    sidebarBackdrop = document.createElement("div");
    sidebarBackdrop.id = "sidebarBackdrop";
    sidebarBackdrop.className = "sidebar-backdrop";
    sidebarBackdrop.setAttribute("aria-hidden", "true");
    sidebarBackdrop.hidden = true;

    document.body.appendChild(sidebarBackdrop);

    return sidebarBackdrop;
}

// Keep menu state, backdrop visibility, and toggle accessibility in sync.
function toggleSidebar() {
    if (isSidebarOpen()) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    const sidebar = document.getElementById("courseSidebar");

    sidebar.classList.remove("sidebar-hidden");
    updateSidebarControls(true);
}

function closeSidebar(options = {}) {
    const sidebar = document.getElementById("courseSidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");

    sidebar.classList.add("sidebar-hidden");
    updateSidebarControls(false);

    if (options.returnFocus && sidebarToggle) {
        sidebarToggle.focus();
    }
}

// When the sidebar overlays lesson content, navigation should reveal the lesson.
function closeSidebarAfterOverlayNavigation() {
    if (isSidebarOpen() && isSidebarOverlayLayout()) {
        closeSidebar();
    }
}

function isSidebarOpen() {
    const sidebar = document.getElementById("courseSidebar");
    return sidebar && !sidebar.classList.contains("sidebar-hidden");
}

function isSidebarOverlayLayout() {
    const sidebar = document.getElementById("courseSidebar");
    return sidebar && getComputedStyle(sidebar).position === "fixed";
}

function updateSidebarControls(isOpen) {
    const sidebarToggle = document.getElementById("sidebarToggle");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");

    if (sidebarToggle) {
        sidebarToggle.setAttribute("aria-expanded", String(isOpen));
    }

    if (sidebarBackdrop) {
        sidebarBackdrop.hidden = !isOpen;
    }
}

function updateSidebar() {
    const isReflectionSummaryCurrent = appState.currentLessonId === REFLECTION_SUMMARY_ID;

    const currentLesson = appState.currentLessonId
        ? lessonIndex[appState.currentLessonId]
        : null;

    const currentModule = currentLesson
        ? courseData.modules[currentLesson.moduleIndex]
        : null;

    document.querySelectorAll(".sidebar-link").forEach(link => {
        link.classList.remove("active", "completed");
    });

    if (currentLesson?.isShowcase) {
        document.querySelector("[data-showcase-link]")?.classList.add("active");
    }

    if (!currentLesson && !isReflectionSummaryCurrent) {
        const menuLink = document.querySelector("[data-menu-link]");
        if (menuLink) menuLink.classList.add("active");
    }

    courseData.modules.forEach(module => {
        const moduleButton = document.querySelector(`[data-sidebar-module="${module.key}"]`);

        if (!moduleButton) return;

        if (module.key === currentModule?.key) {
            moduleButton.classList.add("active");
        }

        if (isModuleComplete(module)) {
            moduleButton.classList.add("completed");
        }
    });

    updateReflectionSummarySidebarLink(isReflectionSummaryCurrent);
    updateProgressText(currentLesson, currentModule, isReflectionSummaryCurrent);
}

function updateReflectionSummarySidebarLink(isCurrent) {
    const summaryLink = document.querySelector("[data-reflection-summary-link]");

    if (!summaryLink) return;

    // Keep the review destination hidden until the existing module progress is complete.
    const isAvailable = isReflectionSummaryAvailable();
    summaryLink.hidden = !isAvailable;

    if (!isAvailable) return;

    if (isCurrent) {
        summaryLink.classList.add("active");
    }

    if (!shouldAnimateReflectionSummaryUnlock) return;

    shouldAnimateReflectionSummaryUnlock = false;

    // The reveal is decorative, so reduced-motion users get the same unlock without motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    summaryLink.classList.add("summary-unlock-animation");

    summaryLink.addEventListener("animationend", () => {
        summaryLink.classList.remove("summary-unlock-animation");
    }, { once: true });
}

function updateProgressText(currentLesson, currentModule, isReflectionSummaryCurrent = false) {
    const currentModuleTitle = document.getElementById("currentModuleTitle");
    const lessonCounter = document.getElementById("lessonCounter");
    const moduleCounter = document.getElementById("moduleCounter");

    if (isReflectionSummaryCurrent) {
        currentModuleTitle.textContent = "Reflection Summary";
        lessonCounter.textContent = "Post-workshop review";
    } else if (currentLesson?.isShowcase) {
        currentModuleTitle.textContent = courseData.showcase.title;
        lessonCounter.textContent =
            `Screen ${currentLesson.lessonIndexInModule + 1} of ${showcaseSequence.length}: ${currentLesson.title}`;
    } else if (!currentLesson || !currentModule) {
        currentModuleTitle.textContent = "Course Menu";
        lessonCounter.textContent = "Select a module to begin";
    } else {
        currentModuleTitle.textContent = currentModule.title;

        lessonCounter.textContent =
            `Lesson ${currentLesson.lessonIndexInModule + 1} of ${currentModule.lessons.length}: ${currentLesson.title}`;
    }

    const completedCount = courseData.modules.filter(module =>
        isModuleComplete(module)
    ).length;

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

function goToShowcase() {
    if (showcaseSequence.length) goToLesson(showcaseSequence[0].id);
}

// Showcase screens sit outside the modules, so they skip the checks
// that keep a learner from moving on with unfinished reflections.
function goToShowcaseLesson(lesson) {
    saveResponseDrafts();

    appState.currentLessonId = lesson.id;
    saveCurrentLesson(lesson.id);
    saveItem(RESUME_LESSON_KEY, lesson.id);

    renderLesson(lesson, buildLessonContext(lesson));
    updateSidebar();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function goToLesson(lessonId, initialReflectionStorageKey = null) {
    if (lessonId === REFLECTION_SUMMARY_ID) {
        goToReflectionSummary();
        return;
    }

    const lesson = lessonIndex[lessonId];

    if (!lesson) {
        console.warn(`Lesson not found: ${lessonId}`);
        return;
    }

    if (lesson.isShowcase) {
        goToShowcaseLesson(lesson);
        return;
    }

    saveResponseDrafts();
    const targetModule = courseData.modules[lesson.moduleIndex];
    const currentModule = getCurrentModule();
    const activeModule = courseData.modules.find(module => module.key === appState.activeModuleKey);
    const movingBackward = currentModule && courseData.modules.indexOf(targetModule) < courseData.modules.indexOf(currentModule);
    const candidates = courseData.modules.filter(module =>
        appState.startedModuleKeys.includes(module.key) || module === currentModule || module === activeModule);
    const blockingModule = targetModule.key === currentModule?.key || movingBackward ? null : candidates.find(module =>
        module.key !== targetModule.key &&
        courseData.modules.indexOf(targetModule) > courseData.modules.indexOf(module) &&
        getMissingRequiredResponses(module).length);
    if (blockingModule) {
        setActiveModule(blockingModule);
        showIncompleteReflections(blockingModule);
        return;
    }
    if (!activeModule || !getMissingRequiredResponses(activeModule).length) setActiveModule(targetModule);
    rememberStartedModule(targetModule);

    appState.currentLessonId = lessonId;
    saveCurrentLesson(lessonId);
    saveItem(RESUME_LESSON_KEY, lessonId);

    const context = buildLessonContext(lesson);
    context.initialReflectionStorageKey = initialReflectionStorageKey;

    renderLesson(lesson, context);
    if (lesson.type === "moduleComplete" && getMissingRequiredResponses(targetModule).length) {
        showIncompleteReflections(targetModule, false);
    }
    updateSidebar();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    if (initialReflectionStorageKey) {
        validateRequiredFields();
        document.getElementById(initialReflectionStorageKey)?.focus();
    }
}

function goToReflectionSummary() {
    if (!isReflectionSummaryAvailable()) {
        console.warn("Reflection Summary is available after the workshop is complete.");
        return;
    }

    const lesson = courseData.reflectionSummary;

    appState.currentLessonId = REFLECTION_SUMMARY_ID;
    saveCurrentLesson(REFLECTION_SUMMARY_ID);

    renderLesson(lesson, buildReflectionSummaryContext(lesson));
    updateSidebar();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function buildLessonContext(lesson) {
    // A showcase screen moves through the showcase, not the modules.
    const sequence = lesson.isShowcase ? showcaseSequence : lessonSequence;
    const sequenceIndex = sequence.findIndex(item => item.id === lesson.id);
    const currentModule = lesson.isShowcase
        ? courseData.showcase
        : courseData.modules[lesson.moduleIndex];

    const previousLesson = sequenceIndex > 0
        ? sequence[sequenceIndex - 1]
        : null;

    const nextLesson = sequenceIndex < sequence.length - 1
        ? sequence[sequenceIndex + 1]
        : null;

    const modulePosition = getModulePosition(lesson, currentModule);

    return {
        currentLesson: lesson,
        currentModule,
        courseData,
        previousLesson,
        nextLesson,
        modulePosition,
        goToLesson,
        goToMenu: renderHome,
        completeModule,
        onResponsesChanged
    };
}

function getModulePosition(lesson, module) {
    if (!module || lesson.type === "moduleIntro" || lesson.type === "moduleComplete") {
        return null;
    }

    const instructionalLessons = module.lessons.filter(moduleLesson =>
        moduleLesson.type !== "moduleIntro" && moduleLesson.type !== "moduleComplete"
    );
    const instructionalIndex = instructionalLessons.findIndex(moduleLesson =>
        moduleLesson.id === lesson.id
    );

    if (instructionalIndex < 0) return null;

    return {
        currentIndex: instructionalIndex + 1,
        total: instructionalLessons.length,
        moduleName: module.title
    };
}

function completeModule(moduleKey) {
    const module = courseData.modules.find(item => item.key === moduleKey);
    if (!module) return false;
    saveResponseDrafts();
    if (getMissingRequiredResponses(module).length) {
        showIncompleteReflections(module);
        return false;
    }
    const wasWorkshopComplete = isWorkshopComplete();

    appState.completedModules[moduleKey] = true;
    saveCompletedModules(appState.completedModules);

    const isNowWorkshopComplete = isWorkshopComplete();

    if (isNowWorkshopComplete && !wasWorkshopComplete) {
        introduceReflectionSummary({ animate: true });
    }

    updateSidebar();

    if (isNowWorkshopComplete && isFinalInstructionalModule(moduleKey)) {
        goToReflectionSummary();
    }
    return true;
}

// -------------------------------
// Helpers
// -------------------------------

function buildReflectionSummaryContext(lesson) {
    return {
        currentLesson: lesson,
        currentModule: {
            title: lesson.moduleLabel || lesson.title
        },
        courseData,
        previousLesson: lessonSequence[lessonSequence.length - 1] || null,
        nextLesson: null,
        goToLesson,
        goToMenu: renderHome,
        completeModule
    };
}

function introduceReflectionSummary(options = {}) {
    if (appState.reflectionSummaryIntroduced) return;

    appState.reflectionSummaryIntroduced = true;
    saveItem(REFLECTION_SUMMARY_INTRODUCED_KEY, true);

    shouldAnimateReflectionSummaryUnlock = Boolean(options.animate);
}

function isReflectionSummaryAvailable() {
    return isExploreModeOn() || isWorkshopComplete();
}

function isWorkshopComplete() {
    return courseData.modules.every(isModuleComplete);
}

// Retain saved completion flags, but only count modules whose current responses satisfy requirements.
function isModuleComplete(module) {
    return Boolean(module && appState.completedModules[module.key]) &&
        getMissingRequiredResponses(module).length === 0;
}

function onResponsesChanged() {
    if (isWorkshopComplete()) introduceReflectionSummary({ animate: true });
    updateSidebar();
    const panel = document.getElementById("incompleteReflections");
    if (panel) {
        const module = courseData.modules.find(module => module.key === panel.dataset.moduleKey);
        showIncompleteReflections(module, false);
    }
}

function getCurrentModule() {
    const lesson = lessonIndex[appState.currentLessonId];
    return lesson ? courseData.modules[lesson.moduleIndex] : null;
}

function setActiveModule(module) {
    appState.activeModuleKey = module.key;
    saveItem("activeModuleKey", module.key);
    rememberStartedModule(module);
}

function rememberStartedModule(module) {
    if (appState.startedModuleKeys.includes(module.key)) return;
    appState.startedModuleKeys.push(module.key);
    saveItem("startedModuleKeys", appState.startedModuleKeys);
}

function showIncompleteReflections(module, moveFocus = true) {
    const missing = getMissingRequiredResponses(module);
    let panel = document.getElementById("incompleteReflections");
    if (!missing.length) {
        panel?.remove();
        return;
    }
    if (!panel) {
        panel = document.createElement("section");
        panel.id = "incompleteReflections";
        panel.className = "alert alert-warning mt-4 text-start";
        panel.setAttribute("aria-labelledby", "incompleteReflectionsHeading");
        const host = document.querySelector("#app .lesson-card, #app .completion-card, #app .hero-section .container") || document.getElementById("app");
        host.appendChild(panel);
    }
    panel.dataset.moduleKey = module.key;
    panel.innerHTML = `<h3 id="incompleteReflectionsHeading" class="h5" tabindex="-1">Almost finished. Complete the reflections you skipped before finishing this module.</h3><div class="d-grid gap-2" data-incomplete-links></div>`;
    const links = panel.querySelector("[data-incomplete-links]");
    missing.forEach(entry => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-outline-secondary secondary-navigation-button text-start";
        button.textContent = entry.reflectionTitle || entry.label || getReflectionMetadata(entry.storageKey)?.title || entry.title || entry.prompt;
        button.addEventListener("click", () => goToLesson(entry.lessonId, entry.storageKey));
        links.appendChild(button);
    });
    if (moveFocus) panel.querySelector("h3").focus();
}

function isFinalInstructionalModule(moduleKey) {
    const finalModule = courseData.modules[courseData.modules.length - 1];
    return finalModule && moduleKey === finalModule.key;
}

function getModuleButtonText(moduleKey) {
    if (isModuleComplete(courseData.modules.find(module => module.key === moduleKey))) {
        return "Review Module";
    }

    return "Begin Module";
}

// -------------------------------
// Start App
// -------------------------------

initApp();
