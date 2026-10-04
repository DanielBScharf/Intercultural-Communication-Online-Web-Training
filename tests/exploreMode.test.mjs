import test from 'node:test';
import assert from 'node:assert/strict';

const saved = new Map();
globalThis.localStorage = {
    getItem: key => saved.get(key) ?? null,
    setItem: (key, value) => saved.set(key, value)
};

const { isExploreModeOn, setExploreMode, getMissingRequiredResponses } = await import('../js/reflectionValidation.js');
const { courseData } = await import('../js/courseData.js');

test('explore mode is on by default, so nothing is required', () => {
    saved.clear();
    assert.equal(isExploreModeOn(), true);
    for (const module of courseData.modules) assert.deepEqual(getMissingRequiredResponses(module), []);
});

test('switching explore mode off applies the requirements', () => {
    saved.clear();
    setExploreMode(false);
    assert.equal(isExploreModeOn(), false);
    for (const module of courseData.modules.filter(module => module.key !== 'reflection')) {
        assert.ok(getMissingRequiredResponses(module).length > 0, module.key);
    }
});

test('explore mode removes the requirements and switching it off restores them', () => {
    saved.clear();
    setExploreMode(true);
    assert.equal(isExploreModeOn(), true);
    for (const module of courseData.modules) assert.deepEqual(getMissingRequiredResponses(module), []);

    setExploreMode(false);
    assert.equal(isExploreModeOn(), false);
    assert.ok(getMissingRequiredResponses(courseData.modules[0]).length > 0);
});

test('explore mode does not save or change any responses', () => {
    saved.clear();
    setExploreMode(true);
    assert.deepEqual([...saved.keys()], ['interculturalWorkshop_exploreMode']);
});
