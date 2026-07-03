// ======================================
// Activity Renderers and Logic
// js/activities.js
// ======================================
//
// Purpose:
// Contains reusable interactive learning activities.
// Current activity:
// - sortingActivity
//
// Future activities can go here:
// - comicViewer
// - imageReveal
// - matchingActivity
// - criticalIncident
// ======================================

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