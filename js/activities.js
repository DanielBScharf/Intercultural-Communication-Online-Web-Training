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
    return `
        <p class="lead">${lesson.instructions}</p>

        <div class="alert alert-light">
            Select an item, then choose the category where it belongs.
        </div>

        <div class="row g-4 mt-3">

            <div class="col-lg-4">
                <h5>Items to Sort</h5>

                <div class="d-grid gap-2" id="sortingItems">
                    ${lesson.items.map((item, index) => `
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
                            class="sort-placeholder"
                            data-category-items="${category.key}">
                            Items will appear here.
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

    const choicePanel = document.getElementById("sortingChoicePanel");
    const selectedItemLabel = document.getElementById("selectedSortingItem");
    const feedback = document.getElementById("sortingFeedback");

    document.querySelectorAll(".culture-sort-item").forEach(button => {
        button.addEventListener("click", () => {
            const itemIndex = Number(button.dataset.sortIndex);

            selectedItem = {
                index: itemIndex,
                data: lesson.items[itemIndex],
                button
            };

            selectedItemLabel.textContent = `Where does "${selectedItem.data.text}" belong?`;
            choicePanel.classList.remove("d-none");
        });
    });

    document.querySelectorAll("[data-sort-choice]").forEach(choiceButton => {
        choiceButton.addEventListener("click", () => {
            if (!selectedItem) return;

            const userChoice = choiceButton.dataset.sortChoice;
            const correctAnswer = selectedItem.data.answer;

            if (userChoice === correctAnswer) {
                const targetColumn = document.querySelector(`[data-category-items="${correctAnswer}"]`);

                if (targetColumn) {
                    if (targetColumn.classList.contains("sort-placeholder")) {
                        targetColumn.innerHTML = "";
                    }

                    const pill = document.createElement("div");
                    pill.className = "sorted-pill";
                    pill.textContent = selectedItem.data.text;
                    targetColumn.appendChild(pill);
                }

                selectedItem.button.disabled = true;
                selectedItem.button.classList.remove("btn-outline-primary");
                selectedItem.button.classList.add("btn-success");

                sortedCount++;

                feedback.innerHTML = `
                    <div class="alert alert-success">
                        Correct. "${selectedItem.data.text}" belongs in ${getCategoryTitle(lesson, correctAnswer)}.
                    </div>
                `;

                selectedItem = null;
                choicePanel.classList.add("d-none");

                if (sortedCount === lesson.items.length) {
                    feedback.innerHTML = `
                        <div class="alert alert-success">
                            Excellent! You sorted all of the items.
                        </div>
                    `;
                }
            } else {
                feedback.innerHTML = `
                    <div class="alert alert-warning">
                        Not quite. Try again.
                    </div>
                `;
            }
        });
    });
}

function getCategoryTitle(lesson, categoryKey) {
    const category = lesson.categories.find(category => category.key === categoryKey);
    return category ? category.title : categoryKey;
}