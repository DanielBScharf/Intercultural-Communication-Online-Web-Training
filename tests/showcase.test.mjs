import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {courseData} from '../js/courseData.js';
import * as storage from '../js/storage.js';
import {getMissingRequiredResponses, getReflectionEntries} from '../js/reflectionValidation.js';
import {getModuleStepTotal, getModuleStepPosition} from '../js/moduleProgress.js';
import {validateScenario} from '../js/branchingScenario.js';
import {validatePerspectiveFlip} from '../js/perspectiveFlip.js';
import {SHOWCASE_ID_PREFIX} from '../modules/showcase.js';

const showcase = courseData.showcase;
const moduleLessons = courseData.modules.flatMap(module => module.lessons);

// Runs the app controller without a page, the same way the other app tests do.
function controllerFixture(saved = new Map()) {
    globalThis.localStorage = {getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value)};
    const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8')
        .replace(/^import[\s\S]*?;\s*$/gm, '').replace(/\ninitApp\(\);\s*$/, '');
    const visits = [], contexts = [], boundaries = [];
    const context = {courseData, ...storage, getMissingRequiredResponses, saveResponseDrafts: () => {}, validateRequiredFields: () => true,
        renderLesson: (lesson, lessonContext) => { visits.push(lesson.id); contexts.push(lessonContext); }, console, window: {scrollTo() {}}, boundaries};
    vm.createContext(context);
    vm.runInContext(source + `;updateSidebar=()=>{};showIncompleteReflections=module=>boundaries.push(module.key);globalThis.api={goToLesson,goToModule,goToShowcase,state:appState};`, context);
    return {api: context.api, visits, contexts, boundaries, saved};
}

test('the showcase runs the ten agreed screens in order', () => {
    assert.deepEqual(showcase.lessons.map(lesson => lesson.id), [
        'showcase-welcome',
        'showcase-culture-iceberg-intro',
        'showcase-culture-iceberg-sort',
        'showcase-culture-hidden-matters',
        'showcase-stereotypes-scenario',
        'showcase-daea-overview',
        'showcase-prague-perspectives',
        'showcase-incident-drinking-expectation',
        'showcase-incident-drinking-reflection',
        'showcase-closing'
    ]);
    assert.equal(showcase.lessons[0].type, 'moduleIntro');
    assert.equal(showcase.lessons.at(-1).type, 'showcaseEnd');
});

test('showcase screens never clash with module screens, and it is not a module', () => {
    const moduleIds = new Set(moduleLessons.map(lesson => lesson.id));
    const showcaseIds = showcase.lessons.map(lesson => lesson.id);
    assert.equal(new Set(showcaseIds).size, showcaseIds.length);
    showcaseIds.forEach(id => {
        assert.ok(id.startsWith(SHOWCASE_ID_PREFIX), id);
        assert.equal(moduleIds.has(id), false, id);
    });
    assert.equal(courseData.modules.some(module => module.key === showcase.key), false);
    assert.equal(courseData.modules.length, 7);
});

test('copied screens stay in step with their originals and share saved progress', () => {
    const copies = showcase.lessons.filter(lesson => lesson.sourceLessonId);
    assert.equal(copies.length, 8);
    copies.forEach(copy => {
        const original = moduleLessons.find(lesson => lesson.id === copy.sourceLessonId);
        assert.ok(original, copy.sourceLessonId);
        assert.equal(copy.stateId, original.id);
        assert.equal(copy.type, original.type);
        assert.equal(copy.title, original.title);
    });
    const sort = showcase.lessons.find(lesson => lesson.id === 'showcase-culture-iceberg-sort');
    assert.equal(sort.items, moduleLessons.find(lesson => lesson.id === 'culture-iceberg-sort').items);
});

test('showcase activities have sound content and nothing in the showcase is required', () => {
    showcase.lessons.filter(lesson => lesson.type === 'branchingScenario')
        .forEach(lesson => assert.deepEqual(validateScenario(lesson), [], lesson.id));
    showcase.lessons.filter(lesson => lesson.type === 'perspectiveFlip')
        .forEach(lesson => assert.deepEqual(validatePerspectiveFlip(lesson), [], lesson.id));
    const required = showcase.lessons.flatMap(getReflectionEntries).filter(entry => entry.required);
    assert.deepEqual(required, []);
    const reflection = showcase.lessons.find(lesson => lesson.id === 'showcase-incident-drinking-reflection');
    assert.equal(reflection.storageKey, 'incidentDrinkingDaeaReflection');
    assert.ok(moduleLessons.some(lesson => lesson.id === reflection.scenarioRecap));
    assert.equal(moduleLessons.find(lesson => lesson.id === 'incident-drinking-reflection').required, true);
});

test('the Prague screen carries its own one-line setup in the showcase only', () => {
    const copy = showcase.lessons.find(lesson => lesson.id === 'showcase-prague-perspectives');
    const original = moduleLessons.find(lesson => lesson.id === 'prague-perspectives');
    assert.match(copy.instructions, /monthly rail pass in Prague/);
    assert.doesNotMatch(original.instructions, /monthly rail pass/);
    assert.equal(copy.panels, original.panels);
});

test('the showcase progress bar counts every step', () => {
    assert.equal(getModuleStepTotal(showcase), 17);
    const position = id => getModuleStepPosition(showcase, showcase.lessons.find(lesson => lesson.id === id)).currentIndex;
    assert.equal(position('showcase-culture-iceberg-intro'), 1);
    assert.equal(position('showcase-stereotypes-scenario'), 4);
    assert.equal(position('showcase-prague-perspectives'), 8);
    assert.equal(position('showcase-closing'), 17);
    assert.equal(getModuleStepPosition(showcase, showcase.lessons[0]), null);
});

test('the showcase opens and moves on its own route, without the module checks', () => {
    const {api, visits, contexts, boundaries} = controllerFixture();
    const culture = courseData.modules[0];

    // Start a module and leave its required reflections unanswered.
    api.goToModule(culture.key);
    api.goToLesson(culture.lessons[2].id);
    assert.equal(getMissingRequiredResponses(culture).length > 0, true);

    api.goToShowcase();
    assert.equal(visits.at(-1), 'showcase-welcome');
    assert.equal(boundaries.length, 0);
    assert.equal(contexts.at(-1).previousLesson, null);
    assert.equal(contexts.at(-1).nextLesson.id, 'showcase-culture-iceberg-intro');
    assert.equal(contexts.at(-1).currentModule, showcase);

    api.goToLesson('showcase-incident-drinking-expectation');
    assert.equal(visits.at(-1), 'showcase-incident-drinking-expectation');
    assert.equal(contexts.at(-1).previousLesson.id, 'showcase-prague-perspectives');
    assert.equal(contexts.at(-1).nextLesson.id, 'showcase-incident-drinking-reflection');
    assert.deepEqual([contexts.at(-1).modulePosition.currentIndex, contexts.at(-1).modulePosition.total], [7, 9]);

    api.goToLesson('showcase-closing');
    assert.equal(contexts.at(-1).nextLesson, null);
    assert.equal(storage.loadItem('resumeLesson'), 'showcase-closing');
    assert.equal(storage.loadCurrentLesson(), 'showcase-closing');
});

test('the showcase does not change module progress or the module sequence', () => {
    const {api, visits, contexts, boundaries} = controllerFixture();
    const [culture, stereotypes] = courseData.modules;
    api.goToShowcase();
    api.goToLesson('showcase-incident-drinking-reflection');
    assert.equal(storage.loadItem('activeModuleKey'), null);
    assert.deepEqual(storage.loadItem('startedModuleKeys', []), []);
    assert.deepEqual(storage.loadCompletedModules(), {});

    // The normal course still works afterward, including its checks.
    api.goToModule(culture.key);
    assert.equal(visits.at(-1), culture.lessons[0].id);
    assert.equal(contexts.at(-1).nextLesson.id, culture.lessons[1].id);
    api.goToModule(stereotypes.key);
    assert.equal(visits.at(-1), culture.lessons[0].id);
    assert.deepEqual(boundaries, [culture.key]);

    const last = courseData.modules.at(-1).lessons.at(-1);
    for (const module of courseData.modules) for (const entry of module.lessons.flatMap(getReflectionEntries)) storage.saveResponse(entry.storageKey, 'answer');
    api.goToLesson(last.id);
    assert.equal(contexts.at(-1).nextLesson, null);
});
