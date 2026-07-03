// ======================================
// Storage Helpers
// js/storage.js
// ======================================

const STORAGE_PREFIX = "interculturalWorkshop_";

function makeKey(key) {
    return `${STORAGE_PREFIX}${key}`;
}

export function saveItem(key, value) {
    localStorage.setItem(makeKey(key), JSON.stringify(value));
}

export function loadItem(key, fallback = null) {
    const saved = localStorage.getItem(makeKey(key));

    if (!saved) {
        return fallback;
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        console.warn(`Could not parse saved item: ${key}`, error);
        return fallback;
    }
}

export function removeItem(key) {
    localStorage.removeItem(makeKey(key));
}

export function saveResponse(storageKey, value) {
    saveItem(`response_${storageKey}`, value);
}

export function loadResponse(storageKey) {
    return loadItem(`response_${storageKey}`, "");
}

export function saveCurrentLesson(lessonId) {
    saveItem("currentLesson", lessonId);
}

export function loadCurrentLesson() {
    return loadItem("currentLesson", null);
}

export function saveCompletedModules(completedModules) {
    saveItem("completedModules", completedModules);
}

export function loadCompletedModules() {
    return loadItem("completedModules", {});
}

export function markModuleComplete(moduleKey) {
    const completedModules = loadCompletedModules();

    completedModules[moduleKey] = true;

    saveCompletedModules(completedModules);

    return completedModules;
}

export function resetAllProgress() {
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
            localStorage.removeItem(key);
        }
    });
}