import test from 'node:test';
import assert from 'node:assert/strict';
import {getLessonStepCount, getModuleStepTotal, getModuleStepPosition} from '../js/moduleProgress.js';
import {courseData} from '../js/courseData.js';

const moduleByKey = key => courseData.modules.find(module => module.key === key);
const lessonById = (module, id) => module.lessons.find(lesson => lesson.id === id);
const position = (module, id, step) => getModuleStepPosition(module, lessonById(module, id), step)?.currentIndex;

test('a plain lesson is one step, and activities count each of their own steps', () => {
    const prague = moduleByKey('prague');
    assert.equal(getLessonStepCount(lessonById(prague, 'prague-arrival')), 1);
    assert.equal(getLessonStepCount(lessonById(prague, 'prague-perspectives')), 4);
    assert.equal(getLessonStepCount(lessonById(prague, 'prague-guided-activity')), 4);
    assert.equal(getLessonStepCount(lessonById(moduleByKey('stereotypes'), 'stereotypes-scenario')), 3);
    assert.equal(getLessonStepCount(lessonById(moduleByKey('incidents'), 'incident-drinking-expectation')), 4);
    assert.equal(getLessonStepCount({type: 'guidedActivity', slides: []}), 1);
    assert.equal(getLessonStepCount({type: 'reflection'}), 1);
});

test('the Prague bar runs from 1 to 9 without gaps', () => {
    const prague = moduleByKey('prague');
    assert.equal(getModuleStepTotal(prague), 9);
    const walk = [
        position(prague, 'prague-arrival', 0),
        ...[0, 1, 2, 3].map(step => position(prague, 'prague-perspectives', step)),
        ...[0, 1, 2, 3].map(step => position(prague, 'prague-guided-activity', step))
    ];
    assert.deepEqual(walk, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
    assert.equal(getModuleStepPosition(prague, lessonById(prague, 'prague-arrival')).total, 9);
    assert.equal(getModuleStepPosition(prague, lessonById(prague, 'prague-arrival')).moduleName, prague.title);
});

test('intro and completion screens are not counted', () => {
    const prague = moduleByKey('prague');
    assert.equal(getModuleStepPosition(prague, lessonById(prague, 'prague-intro')), null);
    assert.equal(getModuleStepPosition(prague, lessonById(prague, 'prague-complete')), null);
    assert.equal(getModuleStepPosition(prague, {id: 'not-in-this-module'}), null);
});

test('a step outside the lesson is kept inside it', () => {
    const prague = moduleByKey('prague');
    assert.equal(position(prague, 'prague-perspectives', 99), 5);
    assert.equal(position(prague, 'prague-perspectives', -3), 2);
    assert.equal(position(prague, 'prague-perspectives', undefined), 2);
});

test('every module has a total that matches its steps, and each lesson starts where the last one ended', () => {
    const totals = Object.fromEntries(courseData.modules.map(module => [module.key, getModuleStepTotal(module)]));
    assert.equal(totals.culture, 13);
    assert.equal(totals.stereotypes, 8);
    assert.equal(totals.prague, 9);
    assert.equal(totals.incidents, 16);
    for (const module of courseData.modules) {
        let expected = 1;
        for (const lesson of module.lessons) {
            const start = getModuleStepPosition(module, lesson);
            if (!start) continue;
            assert.equal(start.currentIndex, expected, lesson.id);
            expected += getLessonStepCount(lesson);
        }
        assert.equal(expected - 1, getModuleStepTotal(module), module.key);
    }
});
