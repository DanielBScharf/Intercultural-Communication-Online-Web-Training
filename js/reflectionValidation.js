import { loadResponse, saveResponse } from "./storage.js";

export const RESPONSE_REQUIRED_MESSAGE = "Please enter a response before continuing, or choose Skip for Now.";

export function hasResponse(value) {
    return typeof value === "string" && value.trim().length > 0;
}

// Requirements belong to response definitions, never to textarea classes or titles.
export function getReflectionEntries(lesson) {
    let entries = [];
    if (lesson.type === "reflection" || lesson.type === "reflectionImage") {
        entries = lesson.prompts?.length ? lesson.prompts : [lesson];
    } else if (lesson.type === "guidedActivity") {
        entries = (lesson.slides || []).filter(slide => slide.slideType === "reflection");
    }
    return entries.filter(entry => entry.storageKey).map(entry => ({
        ...entry,
        lessonId: lesson.id,
        required: entry.required === true
    }));
}

export function getMissingRequiredResponses(module) {
    return (module?.lessons || []).flatMap(getReflectionEntries)
        .filter(entry => entry.required && !hasResponse(loadResponse(entry.storageKey)));
}

export function isRequiredReflection(courseData, storageKey) {
    return (courseData?.modules || []).some(module =>
        module.lessons.flatMap(getReflectionEntries)
            .some(entry => entry.storageKey === storageKey && entry.required));
}

export function renderResponseValidation(fieldID) {
    return `<p id="${fieldID}Validation" class="response-validation mt-2 mb-0" aria-live="polite" aria-atomic="true" hidden></p>`;
}

export function clearResponseValidation(field) {
    field.removeAttribute("aria-invalid");
    const message = document.getElementById(`${field.id}Validation`);
    if (message) {
        message.textContent = "";
        message.hidden = true;
    }
}

export function validateResponseField(field, messageText = RESPONSE_REQUIRED_MESSAGE) {
    if (hasResponse(field.value)) {
        clearResponseValidation(field);
        return true;
    }
    field.setAttribute("aria-invalid", "true");
    const message = document.getElementById(`${field.id}Validation`);
    if (message) {
        message.hidden = false;
        message.textContent = messageText;
    }
    return false;
}

export function initializeResponseValidation(root = document) {
    root.querySelectorAll('[data-required-response="true"]').forEach(field => {
        field.addEventListener("input", () => {
            if (hasResponse(field.value)) clearResponseValidation(field);
        });
    });
}

export function validateRequiredFields(root = document) {
    let firstInvalid = null;
    root.querySelectorAll('[data-required-response="true"]').forEach(field => {
        if (!validateResponseField(field)) firstInvalid ||= field;
        else {
            const storageKey = field.dataset.storageKey || field.dataset.guidedStorageKey;
            if (storageKey) saveResponse(storageKey, field.value);
        }
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
}

export function saveResponseDrafts(root = document) {
    root.querySelectorAll("[data-storage-key], [data-guided-storage-key]").forEach(field => {
        const key = field.dataset.storageKey || field.dataset.guidedStorageKey;
        if (key && typeof field.value === "string") saveResponse(key, field.value);
    });
}
