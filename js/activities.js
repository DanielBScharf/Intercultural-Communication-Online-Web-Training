// ======================================
// Activity Renderers and Logic
// js/activities.js
// ======================================
//
// Purpose:
// Contains reusable interactive learning activities.
// Current activity:
// - sortingActivity
// - guidedActivity
//
// Future activities can go here:
// - comicViewer
// - imageReveal
// - matchingActivity
// - criticalIncident
// ======================================

import {
    saveResponse,
    loadResponse
} from "./storage.js";

export function renderSortingActivityContent(lesson) {
    const shuffledItems = shuffleItems(lesson.items);

    lesson.currentItemOrder = shuffledItems;

    return `
        <p class="lead">${lesson.instructions}</p>

        <div class="alert alert-light">
            Select an item, then choose the category where it belongs.
        </div>

        <div class="row g-4 mt-3">

            <div class="col-lg-4">
                <h5>Items to Sort</h5>

                <div class="d-grid gap-2" id="sortingItems">
                    ${shuffledItems.map((item, index) => `
                        <button
                            class="btn btn-outline-primary culture-sort-item"
                            data-sort-index="${index}">
                            ${item.text}
                        </button>
                    `).join("")}
                </div>

                <div id="sortingChoicePanel" class="sorting-choice-panel d-none mt-4">
                    <h6 id="selectedSortingItem">Selected item</h6>

                    <div class="d-grid gap-2 mt-2">
                        ${lesson.categories.map(category => `
                            <button
                                class="btn btn-outline-secondary"
                                data-sort-choice="${category.key}">
                                ${category.title}
                            </button>
                        `).join("")}
                    </div>
                </div>
            </div>

            ${lesson.categories.map(category => `
                <div class="col-lg-4">
                    <div class="sort-column">
                        <h5>${category.title}</h5>

                        <p class="text-muted">
                            ${category.description}
                        </p>

                        <div
                            class="sorted-items"
                            data-category-items="${category.key}">
                        </div>
                    </div>
                </div>
            `).join("")}

        </div>

        <div id="sortingFeedback" class="mt-4"></div>
    `;
}

export function initializeSortingActivity(lesson) {
    if (lesson.type !== "sortingActivity") return;

    let selectedItem = null;
    let sortedCount = 0;

    const activityItems = lesson.currentItemOrder || lesson.items;

    const choicePanel = document.getElementById("sortingChoicePanel");
    const selectedItemLabel = document.getElementById("selectedSortingItem");
    const feedback = document.getElementById("sortingFeedback");

    document.querySelectorAll(".culture-sort-item").forEach(button => {
        button.addEventListener("click", () => {
            const itemIndex = Number(button.dataset.sortIndex);

            selectedItem = {
                index: itemIndex,
                data: activityItems[itemIndex],
                button
            };

            document.querySelectorAll(".culture-sort-item").forEach(itemButton => {
                itemButton.classList.remove("active-sort-item");
            });

            button.classList.add("active-sort-item");

            selectedItemLabel.textContent =
                `Where does "${selectedItem.data.text}" belong?`;

            choicePanel.classList.remove("d-none");

            feedback.innerHTML = "";
        });
    });

    document.querySelectorAll("[data-sort-choice]").forEach(choiceButton => {
        choiceButton.addEventListener("click", () => {
            if (!selectedItem) return;

            const userChoice = choiceButton.dataset.sortChoice;
            const correctAnswer = selectedItem.data.answer;

            if (userChoice === correctAnswer) {
                const targetColumn =
                    document.querySelector(`[data-category-items="${correctAnswer}"]`);

                if (targetColumn) {
                    const pill = document.createElement("div");
                    pill.className = "sorted-pill sorted-pill-enter";
                    pill.textContent = selectedItem.data.text;
                    targetColumn.appendChild(pill);
                }

                selectedItem.button.disabled = true;
                selectedItem.button.classList.remove(
                    "btn-outline-primary",
                    "active-sort-item"
                );
                selectedItem.button.classList.add("btn-success");

                sortedCount++;

                feedback.innerHTML = `
                    <div class="alert alert-success">
                        <strong>Correct.</strong>
                        "${selectedItem.data.text}" belongs in
                        ${getCategoryTitle(lesson, correctAnswer)}.
                    </div>
                `;

                selectedItem = null;
                choicePanel.classList.add("d-none");

                if (sortedCount === lesson.items.length) {
                    feedback.innerHTML = `
                        <div class="alert alert-success">
                            <strong>Excellent!</strong>
                            ${sortedCount} / ${lesson.items.length} correct.
                            <br>
                            You successfully identified examples of visible and hidden culture.
                        </div>
                    `;
                }
            } else {
                feedback.innerHTML = `
                    <div class="alert alert-warning">
                        <strong>Not quite.</strong>
                        Try again. The item is still selected.
                    </div>
                `;
            }
        });
    });
}

export function renderImageRevealContent(lesson) {
    return `
        <p class="lead">${lesson.instructions}</p>

        <div class="row g-4 align-items-start mt-3">

            <div class="col-lg-5">
                <img
                    id="imageRevealImage"
                    src="${lesson.partialImage}"
                    alt="${lesson.partialImageAlt}"
                    class="img-fluid rounded shadow-sm lesson-image">
            </div>

            <div class="col-lg-7">

                <div id="imageRevealSteps">

                    ${lesson.steps.map((step, index) => `
                        <div
                            class="image-reveal-step ${index === 0 ? "" : "d-none"}"
                            data-reveal-step="${index}">

                            <h5>${step.title}</h5>

                            <p>${step.prompt}</p>

                            <textarea
                                class="form-control reflection-box image-reveal-response"
                                rows="5"
                                data-storage-key="${step.storageKey}"
                                placeholder="${step.placeholder || "Write your response here..."}"></textarea>

                            <div class="save-status mt-2" id="${step.storageKey}Status">
                                Your response will be saved in this browser.
                            </div>

                            <div class="mt-3">
                                <button
                                    class="btn btn-primary"
                                    data-image-reveal-next>
                                    ${index === lesson.steps.length - 1 ? "Compare Responses" : "Next Step"}
                                </button>
                            </div>

                        </div>
                    `).join("")}

                    <div id="imageRevealExamples" class="d-none">

                        <h5>Compare Your Responses</h5>

                        <p>
                            Your responses may be similar, different, or the same.
                            The goal is to separate description, analysis, and evaluation.
                        </p>

                        <div class="accordion mt-3" id="imageRevealExamplesAccordion">

                            ${lesson.steps.map((step, index) => `
                                <div class="accordion-item">

                                    <h2 class="accordion-header">

                                        <button
                                            class="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#imageRevealExample-${index}">
                                            ${step.title} Example
                                        </button>

                                    </h2>

                                    <div
                                        id="imageRevealExample-${index}"
                                        class="accordion-collapse collapse"
                                        data-bs-parent="#imageRevealExamplesAccordion">

                                        <div class="accordion-body">

                                            <ul>
                                                ${step.example.map(item => `<li>${item}</li>`).join("")}
                                            </ul>

                                        </div>

                                    </div>

                                </div>
                            `).join("")}

                        </div>

                        <button
                            class="btn btn-primary mt-4"
                            id="revealFullImageButton">
                            Reveal the Whole Picture
                        </button>

                    </div>

                    <div id="imageRevealFinal" class="d-none">

                        <h5>The Whole Picture</h5>

                        ${lesson.revealText.map(paragraph => `<p>${paragraph}</p>`).join("")}

                    </div>

                </div>

            </div>

        </div>
    `;
}

export function initializeImageReveal(lesson) {
    if (lesson.type !== "imageReveal") return;

    let currentStep = 0;

    const image = document.getElementById("imageRevealImage");
    const steps = document.querySelectorAll(".image-reveal-step");
    const examples = document.getElementById("imageRevealExamples");
    const final = document.getElementById("imageRevealFinal");
    const revealButton = document.getElementById("revealFullImageButton");

    document.querySelectorAll(".image-reveal-response").forEach(textarea => {
        const storageKey = textarea.dataset.storageKey;
        const savedValue = localStorage.getItem(`interculturalWorkshop_response_${storageKey}`);

        if (savedValue) {
            textarea.value = JSON.parse(savedValue);
        }

        textarea.addEventListener("input", () => {
            localStorage.setItem(
                `interculturalWorkshop_response_${storageKey}`,
                JSON.stringify(textarea.value)
            );

            const status = document.getElementById(`${storageKey}Status`);

            if (status) {
                status.textContent = "✓ Saved";

                setTimeout(() => {
                    status.textContent = "Your response will be saved in this browser.";
                }, 1500);
            }
        });
    });

    document.querySelectorAll("[data-image-reveal-next]").forEach(button => {
        button.addEventListener("click", () => {
            steps[currentStep].classList.add("d-none");

            currentStep++;

            if (currentStep < steps.length) {
                steps[currentStep].classList.remove("d-none");
            } else {
                examples.classList.remove("d-none");
            }
        });
    });

    if (revealButton) {
        revealButton.addEventListener("click", () => {
            image.src = lesson.fullImage;
            image.alt = lesson.fullImageAlt;

            examples.classList.add("d-none");
            final.classList.remove("d-none");
        });
    }
}

function shuffleItems(items) {
    return [...items].sort(() => Math.random() - 0.5);
}

function getCategoryTitle(lesson, categoryKey) {
    const category = lesson.categories.find(category => category.key === categoryKey);
    return category ? category.title : categoryKey;
}

// ======================================
// Story Activity
// ======================================
//
// Purpose:
// Renders guided scenario-based activities.
// A story activity can include story text, comic panels,
// decision questions, reflection prompts, reveals, and summaries.
// ======================================

export function renderStoryActivityContent(lesson) {
    return `
        <div class="story-activity" data-story-id="${lesson.id}">

            <p class="lead">
                ${lesson.instructions || ""}
            </p>

            <div id="storyPageContainer"></div>

            <div class="story-navigation mt-4 d-flex justify-content-between gap-3">

                <button class="btn btn-outline-secondary" id="storyPrevious">
                    Previous
                </button>

                <div class="story-progress small text-muted align-self-center" id="storyProgress">
                    Page 1 of ${lesson.pages.length}
                </div>

                <button class="btn btn-primary" id="storyNext">
                    Next
                </button>

            </div>

        </div>
    `;
}

export function initializeStoryActivity(lesson) {
    if (lesson.type !== "storyActivity") return;

    let currentPageIndex = 0;

    const container = document.getElementById("storyPageContainer");
    const previousButton = document.getElementById("storyPrevious");
    const nextButton = document.getElementById("storyNext");
    const progress = document.getElementById("storyProgress");

    function renderCurrentStoryPage() {
        const page = lesson.pages[currentPageIndex];

        container.innerHTML = renderStoryPage(page, lesson);

        progress.textContent =
            `Page ${currentPageIndex + 1} of ${lesson.pages.length}`;

        previousButton.disabled = currentPageIndex === 0;

        nextButton.textContent =
            currentPageIndex === lesson.pages.length - 1
                ? "Finish Activity"
                : "Next";

        attachStoryPageEvents(page);
    }

    previousButton.addEventListener("click", () => {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            renderCurrentStoryPage();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPageIndex < lesson.pages.length - 1) {
            currentPageIndex++;
            renderCurrentStoryPage();
        }
    });

    renderCurrentStoryPage();
}

function renderStoryPage(page, lesson) {
    switch (page.pageType) {
        case "story":
            return renderStoryPageStory(page);

        case "comic":
            return renderStoryPageComic(page);

        case "reflection":
            return renderStoryPageReflection(page);

        case "decision":
            return renderStoryPageDecision(page);

        case "reveal":
            return renderStoryPageReveal(page);

        case "summary":
            return renderStoryPageSummary(page);

        default:
            return `
                <div class="alert alert-warning">
                    Unknown story page type: ${page.pageType}
                </div>
            `;
    }
}

function renderStoryPageStory(page) {
    return `
        <div class="story-page-card">

            <h3>${page.title}</h3>

            ${renderStoryImage(page.image, page.imageAlt)}

            ${renderStoryParagraphs(page.body)}

        </div>
    `;
}

function renderStoryPageComic(page) {
    return `
        <div class="story-page-card">

            <h3>${page.title}</h3>

            ${page.intro ? `<p>${page.intro}</p>` : ""}

            <div class="row g-4 mt-2">

                ${page.panels.map(panel => `
                    <div class="col-md-6">
                        <img
                            src="${panel.image}"
                            alt="${panel.alt || ""}"
                            class="img-fluid rounded shadow-sm story-comic-panel"
                            onerror="this.outerHTML='<div class=&quot;placeholder-image rounded shadow-sm&quot;>${panel.label || "Comic Panel"}</div>'">
                    </div>
                `).join("")}

            </div>

        </div>
    `;
}

function renderStoryPageReflection(page) {
    const savedValue = loadStoryResponse(page.storageKey);

    return `
        <div class="story-page-card">

            <h3>${page.title}</h3>

            ${renderStoryParagraphs(page.body)}

            <label for="${page.storageKey}" class="form-label fw-semibold mt-3">
                ${page.prompt}
            </label>

            <textarea
                id="${page.storageKey}"
                class="form-control reflection-box story-response"
                rows="6"
                data-story-storage-key="${page.storageKey}"
                placeholder="${page.placeholder || "Write your response here..."}">${savedValue}</textarea>

            <div class="save-status mt-2" id="${page.storageKey}Status">
                Your response will be saved in this browser.
            </div>

        </div>
    `;
}

function renderStoryPageDecision(page) {
    const savedValue = loadStoryResponse(page.storageKey);

    return `
        <div class="story-page-card">

            <h3>${page.title}</h3>

            ${renderStoryParagraphs(page.body)}

            <p class="fw-semibold mt-3">
                ${page.question}
            </p>

            <div class="d-grid gap-2">

                ${page.choices.map(choice => `
                    <button
                        class="btn ${savedValue === choice ? "btn-primary" : "btn-outline-primary"} story-choice"
                        data-story-choice="${choice}"
                        data-story-storage-key="${page.storageKey}">
                        ${choice}
                    </button>
                `).join("")}

            </div>

            <div class="save-status mt-2" id="${page.storageKey}Status">
                ${savedValue ? "✓ Saved" : "Choose a response."}
            </div>

        </div>
    `;
}

function renderStoryPageReveal(page) {
    return `
        <div class="story-page-card story-reveal">

            <h3>${page.title}</h3>

            ${renderStoryImage(page.image, page.imageAlt)}

            ${renderStoryParagraphs(page.body)}

        </div>
    `;
}

function renderStoryPageSummary(page) {
    return `
        <div class="story-page-card">

            <h3>${page.title}</h3>

            ${renderStoryParagraphs(page.body)}

            <div class="module-summary mt-4">

                <h5>Key Takeaways</h5>

                <ul>
                    ${page.points.map(point => `<li>${point}</li>`).join("")}
                </ul>

            </div>

        </div>
    `;
}

function attachStoryPageEvents(page) {
    document.querySelectorAll(".story-response").forEach(textarea => {
        textarea.addEventListener("input", () => {
            const storageKey = textarea.dataset.storyStorageKey;

            saveStoryResponse(storageKey, textarea.value);

            const status = document.getElementById(`${storageKey}Status`);

            if (status) {
                status.textContent = "✓ Saved";

                setTimeout(() => {
                    status.textContent = "Your response will be saved in this browser.";
                }, 1500);
            }
        });
    });

    document.querySelectorAll(".story-choice").forEach(button => {
        button.addEventListener("click", () => {
            const storageKey = button.dataset.storyStorageKey;
            const choice = button.dataset.storyChoice;

            saveStoryResponse(storageKey, choice);

            document.querySelectorAll(".story-choice").forEach(choiceButton => {
                choiceButton.classList.remove("btn-primary");
                choiceButton.classList.add("btn-outline-primary");
            });

            button.classList.remove("btn-outline-primary");
            button.classList.add("btn-primary");

            const status = document.getElementById(`${storageKey}Status`);

            if (status) {
                status.textContent = "✓ Saved";
            }
        });
    });
}

function renderStoryParagraphs(body = []) {
    if (!body || !body.length) return "";

    return body.map(paragraph => `<p>${paragraph}</p>`).join("");
}

function renderStoryImage(image, imageAlt = "") {
    if (!image) return "";

    return `
        <img
            src="${image}"
            alt="${imageAlt}"
            class="img-fluid rounded shadow-sm lesson-image mb-4"
            onerror="this.outerHTML='<div class=&quot;placeholder-image rounded shadow-sm mb-4&quot;>Scenario Image</div>'">
    `;
}

function saveStoryResponse(storageKey, value) {
    localStorage.setItem(
        `interculturalWorkshop_response_${storageKey}`,
        JSON.stringify(value)
    );
}

function loadStoryResponse(storageKey) {
    const saved = localStorage.getItem(
        `interculturalWorkshop_response_${storageKey}`
    );

    if (!saved) return "";

    try {
        return JSON.parse(saved);
    } catch {
        return "";
    }
}

// ======================================
// Guided Activity
// ======================================
//
// Purpose:
// Renders reusable slide-based activities.
// A guided activity can include story text, comic panels,
// reflection prompts, decisions, reveals, and summaries.
// ======================================

export function renderGuidedActivityContent(lesson) {
    const slideCount = getGuidedSlides(lesson).length;

    return `
        <div class="guided-activity" data-guided-id="${lesson.id}">

            <p class="lead">
                ${lesson.instructions || ""}
            </p>

            <div id="guidedSlideContainer"></div>

            <div class="story-navigation mt-4 d-flex justify-content-between gap-3">

                <button class="btn btn-outline-secondary" id="guidedPrevious">
                    Previous
                </button>

                <div
                    class="story-progress small text-muted align-self-center"
                    id="guidedProgress"
                    aria-live="polite">
                    ${slideCount ? `Slide 1 of ${slideCount}` : "No slides"}
                </div>

                <button class="btn btn-primary" id="guidedNext">
                    Next
                </button>

            </div>

        </div>
    `;
}

export function initializeGuidedActivity(lesson) {
    if (lesson.type !== "guidedActivity") return;

    let currentSlideIndex = 0;

    const slides = getGuidedSlides(lesson);
    const container = document.getElementById("guidedSlideContainer");
    const previousButton = document.getElementById("guidedPrevious");
    const nextButton = document.getElementById("guidedNext");
    const progress = document.getElementById("guidedProgress");

    // Render one slide at a time so each guided activity can define
    // its own sequence without changing the shared component.
    function renderCurrentGuidedSlide() {
        if (!slides.length) {
            container.innerHTML = renderGuidedSlide(null, lesson, currentSlideIndex);
            previousButton.disabled = true;
            nextButton.disabled = true;
            progress.textContent = "No slides";
            return;
        }

        const slide = slides[currentSlideIndex];

        container.innerHTML = renderGuidedSlide(slide, lesson, currentSlideIndex);

        progress.textContent =
            `Slide ${currentSlideIndex + 1} of ${slides.length}`;

        previousButton.disabled = currentSlideIndex === 0;
        nextButton.disabled = currentSlideIndex === slides.length - 1;

        attachGuidedSlideEvents(slide);
    }

    previousButton.addEventListener("click", () => {
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            renderCurrentGuidedSlide();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            renderCurrentGuidedSlide();
        }
    });

    renderCurrentGuidedSlide();
}

// Route each slide to the matching renderer. Slide order is controlled
// entirely by module content.
function renderGuidedSlide(slide, lesson, index) {
    if (!slide) {
        return `
            <div class="alert alert-warning">
                This guided activity does not include any slides yet.
            </div>
        `;
    }

    switch (slide.slideType) {
        case "story":
            return renderGuidedSlideStory(slide, lesson, index);

        case "comic":
            return renderGuidedSlideComic(slide, lesson, index);

        case "reflection":
            return renderGuidedSlideReflection(slide, lesson, index);

        case "decision":
            return renderGuidedSlideDecision(slide, lesson, index);

        case "reveal":
            return renderGuidedSlideReveal(slide, lesson, index);

        case "summary":
            return renderGuidedSlideSummary(slide);

        default:
            return `
                <div class="alert alert-warning">
                    Unknown guided slide type: ${slide.slideType}
                </div>
            `;
    }
}

function renderGuidedSlideStory(slide, lesson, index) {
    return `
        <div class="story-page-card">

            <h3>${slide.title}</h3>

            ${renderGuidedImage(
                slide.image,
                slide.imageAlt,
                slide.longDescription,
                `${lesson.id}-slide-${index}`,
                "Scenario Image"
            )}

            ${renderStoryParagraphs(slide.body)}

        </div>
    `;
}

function renderGuidedSlideComic(slide, lesson, index) {
    const panels = slide.panels || [];

    return `
        <div class="story-page-card">

            <h3>${slide.title}</h3>

            ${slide.intro ? `<p>${slide.intro}</p>` : ""}

            <div class="row g-4 mt-2">

                ${panels.map((panel, panelIndex) => `
                    <div class="col-md-6">
                        ${renderGuidedImage(
                            panel.image,
                            panel.alt,
                            panel.longDescription,
                            `${lesson.id}-slide-${index}-panel-${panelIndex}`,
                            panel.label || "Comic Panel",
                            "story-comic-panel"
                        )}
                    </div>
                `).join("")}

            </div>

        </div>
    `;
}

function renderGuidedSlideReflection(slide, lesson, index) {
    const storageKey = getGuidedStorageKey(slide, lesson, index);
    const savedValue = loadGuidedResponse(storageKey);

    return `
        <div class="story-page-card">

            <h3>${slide.title}</h3>

            ${renderStoryParagraphs(slide.body)}

            <label for="${storageKey}" class="form-label fw-semibold mt-3">
                ${slide.prompt}
            </label>

            <textarea
                id="${storageKey}"
                class="form-control reflection-box guided-response"
                rows="6"
                data-guided-storage-key="${storageKey}"
                placeholder="${slide.placeholder || "Write your response here..."}">${savedValue}</textarea>

            <div class="save-status mt-2" id="${storageKey}Status">
                Your response will be saved in this browser.
            </div>

        </div>
    `;
}

function renderGuidedSlideDecision(slide, lesson, index) {
    const storageKey = getGuidedStorageKey(slide, lesson, index);
    const savedValue = loadGuidedResponse(storageKey);
    const choices = slide.choices || [];

    return `
        <div class="story-page-card">

            <h3>${slide.title}</h3>

            ${renderStoryParagraphs(slide.body)}

            <p class="fw-semibold mt-3">
                ${slide.question}
            </p>

            <div class="d-grid gap-2">

                ${choices.map((choice, choiceIndex) => {
                    const choiceValue = getGuidedChoiceValue(choice);
                    const choiceLabel = getGuidedChoiceLabel(choice);

                    return `
                        <button
                            class="btn ${savedValue === choiceValue ? "btn-primary" : "btn-outline-primary"} guided-choice"
                            type="button"
                            aria-pressed="${savedValue === choiceValue ? "true" : "false"}"
                            data-guided-choice-index="${choiceIndex}"
                            data-guided-storage-key="${storageKey}">
                            ${choiceLabel}
                        </button>
                    `;
                }).join("")}

            </div>

            <div class="save-status mt-2" id="${storageKey}Status">
                ${savedValue ? "Saved" : "Choose a response."}
            </div>

        </div>
    `;
}

function renderGuidedSlideReveal(slide, lesson, index) {
    return `
        <div class="story-page-card story-reveal">

            <h3>${slide.title}</h3>

            ${renderGuidedImage(
                slide.image,
                slide.imageAlt,
                slide.longDescription,
                `${lesson.id}-slide-${index}`,
                "Scenario Image"
            )}

            ${renderStoryParagraphs(slide.body)}

        </div>
    `;
}

function renderGuidedSlideSummary(slide) {
    return `
        <div class="story-page-card">

            <h3>${slide.title}</h3>

            ${renderStoryParagraphs(slide.body)}

            ${slide.points && slide.points.length ? `
                <div class="module-summary mt-4">

                    <h5>Key Takeaways</h5>

                    <ul>
                        ${slide.points.map(point => `<li>${point}</li>`).join("")}
                    </ul>

                </div>
            ` : ""}

        </div>
    `;
}

function attachGuidedSlideEvents(slide) {
    // Optional image descriptions are available to keyboard and screen reader users.
    document.querySelectorAll("[data-guided-description-toggle]").forEach(button => {
        button.addEventListener("click", () => {
            const description = document.getElementById(
                button.dataset.guidedDescriptionToggle
            );

            if (!description) return;

            const isExpanded = button.getAttribute("aria-expanded") === "true";

            description.classList.toggle("d-none", isExpanded);
            button.setAttribute("aria-expanded", String(!isExpanded));
            button.textContent = isExpanded
                ? "View image description"
                : "Hide image description";
        });
    });

    // Reflection responses are restored on render and saved as the learner types.
    document.querySelectorAll(".guided-response").forEach(textarea => {
        textarea.addEventListener("input", () => {
            const storageKey = textarea.dataset.guidedStorageKey;

            saveGuidedResponse(storageKey, textarea.value);

            const status = document.getElementById(`${storageKey}Status`);

            if (status) {
                status.textContent = "Saved";

                setTimeout(() => {
                    status.textContent = "Your response will be saved in this browser.";
                }, 1500);
            }
        });
    });

    // Decision slides are optional; when present, selected choices persist.
    document.querySelectorAll(".guided-choice").forEach(button => {
        button.addEventListener("click", () => {
            const storageKey = button.dataset.guidedStorageKey;
            const choiceIndex = Number(button.dataset.guidedChoiceIndex);
            const choice = getGuidedChoiceValue(slide.choices[choiceIndex]);

            saveGuidedResponse(storageKey, choice);

            document.querySelectorAll(".guided-choice").forEach(choiceButton => {
                choiceButton.classList.remove("btn-primary");
                choiceButton.classList.add("btn-outline-primary");
                choiceButton.setAttribute("aria-pressed", "false");
            });

            button.classList.remove("btn-outline-primary");
            button.classList.add("btn-primary");
            button.setAttribute("aria-pressed", "true");

            const status = document.getElementById(`${storageKey}Status`);

            if (status) {
                status.textContent = "Saved";
            }
        });
    });
}

function getGuidedSlides(lesson) {
    return lesson.slides || [];
}

function getGuidedStorageKey(slide, lesson, index) {
    return slide.storageKey || `${lesson.id}-slide-${index}`;
}

function renderGuidedImage(
    image,
    imageAlt = "",
    longDescription = "",
    descriptionID,
    label = "Image Placeholder",
    imageClass = "lesson-image mb-4"
) {
    if (!image) return "";

    const descriptionMarkup = longDescription ? `
        <button
            class="btn btn-outline-secondary btn-sm mb-3"
            type="button"
            aria-expanded="false"
            aria-controls="${descriptionID}-description"
            data-guided-description-toggle="${descriptionID}-description">
            View image description
        </button>

        <div
            class="alert alert-light d-none"
            id="${descriptionID}-description">
            ${longDescription}
        </div>
    ` : "";

    return `
        <img
            src="${image}"
            alt="${imageAlt}"
            class="img-fluid rounded shadow-sm ${imageClass}"
            onerror="this.outerHTML='<div class=&quot;placeholder-image rounded shadow-sm mb-4&quot;>${label}</div>'">

        ${descriptionMarkup}
    `;
}

function getGuidedChoiceValue(choice) {
    return typeof choice === "string" ? choice : choice.value || choice.label;
}

function getGuidedChoiceLabel(choice) {
    return typeof choice === "string" ? choice : choice.label || choice.value;
}

function saveGuidedResponse(storageKey, value) {
    saveResponse(storageKey, value);
}

function loadGuidedResponse(storageKey) {
    return loadResponse(storageKey);
}
