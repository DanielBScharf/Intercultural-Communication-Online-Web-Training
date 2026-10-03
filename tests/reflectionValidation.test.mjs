import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import * as storage from "../js/storage.js";
import { courseData } from "../js/courseData.js";
import {
    hasResponse, getReflectionEntries, getMissingRequiredResponses,
    isRequiredReflection, validateRequiredFields, initializeResponseValidation,
    validateResponseField, RESPONSE_REQUIRED_MESSAGE
} from "../js/reflectionValidation.js";

const saved = new Map();
globalThis.localStorage = {
    getItem: key => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value)
};

test("only non-whitespace text satisfies a response", () => {
    for (const value of ["", " ", "     ", "\n", "\n\n", "\t", " \t\n", null]) {
        assert.equal(hasResponse(value), false);
    }
    for (const value of ["a", "Not sure.", " I would ask for more information.\n"]) {
        assert.equal(hasResponse(value), true);
    }
});

test("semantic configuration includes every active reflection and excludes decision inputs", () => {
    const entries = courseData.modules.flatMap(module => module.lessons.flatMap(getReflectionEntries));
    assert.equal(entries.length, 26);
    assert.equal(entries.filter(entry => entry.required).length, 24);
    assert.equal(new Set(entries.map(entry => entry.storageKey)).size, entries.length);
    for (const entry of entries) assert.equal(typeof entry.required, "boolean");
    assert.equal(isRequiredReflection(courseData, "cultureHiddenMisunderstandingReflection"), true);
    assert.equal(isRequiredReflection(courseData, "pragueDecision"), false);
    assert.equal(isRequiredReflection(courseData, "currentCultureDefinition"), false);
    assert.equal(isRequiredReflection(courseData, "finalReflectionDisagreement"), false);
});

test("completion reads actual saved responses, retaining existing data", () => {
    saved.clear();
    const module = courseData.modules.find(module => module.key === "culture");
    const required = module.lessons.flatMap(getReflectionEntries).filter(entry => entry.required);
    for (const entry of required) saved.set(`interculturalWorkshop_response_${entry.storageKey}`, JSON.stringify("existing answer"));
    saved.set("interculturalWorkshop_completedModules", JSON.stringify({culture: true}));
    const snapshot = [...saved];
    assert.equal(getMissingRequiredResponses(module).length, 0);
    assert.deepEqual([...saved], snapshot);
    saved.set("interculturalWorkshop_response_cultureHiddenMisunderstandingReflection", JSON.stringify(" \n\t"));
    assert.deepEqual(getMissingRequiredResponses(module).map(entry => entry.storageKey), ["cultureHiddenMisunderstandingReflection"]);
    assert.equal(saved.get("interculturalWorkshop_completedModules"), JSON.stringify({culture: true}));
});

test("invalid fields announce an associated message, focus first failure, and clear only when valid", () => {
    saved.clear();
    const messages = new Map();
    function field(id, value) {
        const attrs = new Map();
        const listeners = {};
        messages.set(`${id}Validation`, {hidden: true, textContent: ""});
        return {id, value, dataset: {storageKey: id}, attrs, listeners, focused: false,
            setAttribute: (key, value) => attrs.set(key, value),
            removeAttribute: key => attrs.delete(key),
            addEventListener: (event, listener) => {listeners[event] = listener;},
            focus() {this.focused = true;}};
    }
    const fields = [field("first", "\n"), field("second", "\t"), field("third", " a ")];
    const root = {querySelectorAll: () => fields};
    globalThis.document = {getElementById: id => messages.get(id)};
    initializeResponseValidation(root);
    assert.equal(validateRequiredFields(root), false);
    assert.equal(fields[0].focused, true);
    assert.equal(fields[1].focused, false);
    assert.equal(fields[0].attrs.get("aria-invalid"), "true");
    assert.equal(messages.get("firstValidation").textContent, RESPONSE_REQUIRED_MESSAGE);
    assert.equal(saved.get("interculturalWorkshop_response_third"), JSON.stringify(" a "));
    fields[0].value = "a";
    fields[0].listeners.input();
    assert.equal(fields[0].attrs.has("aria-invalid"), false);
    assert.equal(messages.get("firstValidation").hidden, true);
    fields[1].value = "b";
    assert.equal(validateRequiredFields(root), true);
    fields[0].value = "";
    assert.equal(validateResponseField(fields[0]), false);
});

test("controller blocks completion and old flags cannot unlock Summary without actual responses", () => {
    saved.clear();
    storage.saveCompletedModules(Object.fromEntries(courseData.modules.map(module => [module.key, true])));
    const originalFlags = storage.loadCompletedModules();
    const source = readFileSync(new URL("../js/app.js", import.meta.url), "utf8")
        .replace(/^import[\s\S]*?;\s*$/gm, "")
        .replace(/\ninitApp\(\);\s*$/, "");
    const navigations = [];
    const context = {courseData, ...storage, getMissingRequiredResponses,
        validateRequiredFields: () => true, saveResponseDrafts: () => {}, navigations, console};
    vm.createContext(context);
    vm.runInContext(source + `
        goToLesson = (id, key) => navigations.push({id, key});
        updateSidebar = () => {};
        goToReflectionSummary = () => navigations.push({id: 'reflection-summary'});
        showIncompleteReflections = module => navigations.push({moduleKey: module.key, missing: getMissingRequiredResponses(module)});
        globalThis.controller = {completeModule, isWorkshopComplete, isModuleComplete};
    `, context);
    const culture = courseData.modules[0];
    assert.equal(context.controller.isModuleComplete(culture), false);
    assert.equal(context.controller.isWorkshopComplete(), false);
    assert.equal(context.controller.completeModule("culture"), false);
    assert.equal(navigations[0].missing[0].storageKey, "cultureDefinition");
    assert.deepEqual(storage.loadCompletedModules(), originalFlags);
    for (const module of courseData.modules) {
        for (const entry of module.lessons.flatMap(getReflectionEntries).filter(entry => entry.required)) {
            storage.saveResponse(entry.storageKey, "a");
        }
    }
    assert.equal(context.controller.isWorkshopComplete(), true);
    assert.equal(context.controller.completeModule("culture"), true);
    storage.saveResponse("pragueDaeaReflection", "\t");
    assert.equal(context.controller.isWorkshopComplete(), false);
    assert.equal(context.controller.completeModule("prague"), false);
    assert.equal(navigations.at(-1).moduleKey, "prague");
    assert.equal(navigations.at(-1).missing[0].storageKey, "pragueDaeaReflection");
});
