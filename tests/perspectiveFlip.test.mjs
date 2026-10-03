import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createPerspectiveState, getPerspectiveView, guessPerspective, revealPerspective,
    advancePerspective, retreatPerspective, restorePerspectiveState, getLastPerspectiveStep,
    getPerspectiveGuesses, validatePerspectiveFlip, writesFirst
} from '../js/perspectiveFlip.js';
import {courseData} from '../js/courseData.js';
import {pragueModule} from '../modules/prague.js';
import {getReflectionEntries} from '../js/reflectionValidation.js';

const activity = pragueModule.lessons.find(lesson => lesson.id === 'prague-perspectives');

function play(lesson, optionIds) {
    return optionIds.reduce((state, optionId) => {
        const guessed = optionId ? guessPerspective(lesson, state, optionId) : revealPerspective(lesson, state);
        return advancePerspective(lesson, guessed).state;
    }, createPerspectiveState());
}

test('every perspective flip in the course has sound content', () => {
    const activities = courseData.modules.flatMap(module => module.lessons)
        .filter(lesson => lesson.type === 'perspectiveFlip');
    assert.ok(activities.length >= 1);
    activities.forEach(lesson => assert.deepEqual(validatePerspectiveFlip(lesson), [], lesson.id));
});

test('the Prague module runs setup, perspectives, then the ending and one reflection', () => {
    assert.deepEqual(pragueModule.lessons.map(lesson => [lesson.id, lesson.type]), [
        ['prague-intro', 'moduleIntro'],
        ['prague-arrival', 'contentImage'],
        ['prague-perspectives', 'perspectiveFlip'],
        ['prague-guided-activity', 'guidedActivity'],
        ['prague-complete', 'moduleComplete']
    ]);
    const entries = pragueModule.lessons.flatMap(getReflectionEntries);
    assert.deepEqual(entries.map(entry => [entry.storageKey, entry.required]), [['pragueDaeaReflection', true]]);
    assert.deepEqual(getReflectionEntries(activity), []);
    assert.deepEqual(activity.panels.map(panel => panel.image.match(/panel-(\d)/)[1]), ['2', '3', '4']);
});

test('the clerk view is presented as likely, and translates what she shouts', () => {
    assert.match(activity.note, /most likely explanation, not a known fact/);
    const shouts = activity.panels.find(panel => panel.id === 'shouts').second.said;
    assert.deepEqual(shouts.map(line => line.original), ['Ne!', 'Tam!', 'Tamhle!', 'Přes chodbu!', 'Ne tady!']);
    assert.deepEqual(shouts.map(line => line.meaning), ['No!', 'There!', 'Over there!', 'Across the hall!', 'Not here!']);
    const rows = activity.summary.rows;
    assert.deepEqual(rows.map(row => row.label), ['Describe', 'Analyze', 'Evaluate']);
    assert.equal(rows[0].first, rows[0].second);
    assert.notEqual(rows[1].first, rows[1].second);
});

test('a new activity starts on the first panel, unflipped', () => {
    const view = getPerspectiveView(activity, createPerspectiveState());
    assert.deepEqual(view, {kind: 'panel', panelId: 'asks', flipped: false, answer: null});
});

test('Next asks for a guess before moving on', () => {
    const result = advancePerspective(activity, createPerspectiveState());
    assert.equal(result.needsGuess, true);
    assert.equal(result.moved, false);
});

test('a guess flips the panel, keeps the written text, and is locked', () => {
    const guessed = guessPerspective(activity, createPerspectiveState(), 'no-english', '  maybe she is busy  ');
    const view = getPerspectiveView(activity, guessed);
    assert.equal(view.flipped, true);
    assert.deepEqual(view.answer, {optionId: 'no-english', text: 'maybe she is busy'});
    assert.equal(guessPerspective(activity, guessed, 'foreigner'), guessed);
    assert.equal(guessPerspective(activity, createPerspectiveState(), 'not-an-option').answers.asks, undefined);
});

test('Skip for Now flips without a guess', () => {
    const revealed = revealPerspective(activity, createPerspectiveState(), 'typed only');
    assert.deepEqual(getPerspectiveView(activity, revealed).answer, {optionId: null, text: 'typed only'});
    assert.equal(advancePerspective(activity, revealed).moved, true);
    assert.equal(revealPerspective(activity, revealed), revealed);
});

test('a full run reaches the comparison and then hands back to the lesson', () => {
    const state = play(activity, ['wrong-window', 'not-getting-it', 'still-helping']);
    assert.deepEqual(getPerspectiveView(activity, state), {kind: 'summary'});
    assert.equal(state.step, getLastPerspectiveStep(activity));
    assert.deepEqual(getPerspectiveGuesses(activity, state).map(guess => guess.option.id), ['wrong-window', 'not-getting-it', 'still-helping']);
    const result = advancePerspective(activity, state);
    assert.equal(result.moved, false);
    assert.equal(result.finished, true);
});

test('Previous steps back through the panels before leaving the activity', () => {
    let result = retreatPerspective(play(activity, ['foreigner', null, 'glad']));
    assert.equal(getPerspectiveView(activity, result.state).panelId, 'leaves');
    result = retreatPerspective(result.state);
    assert.deepEqual(getPerspectiveView(activity, result.state).answer, {optionId: null, text: ''});
    result = retreatPerspective(result.state);
    assert.equal(retreatPerspective(result.state).moved, false);
});

test('an activity without a closing table ends on its last panel', () => {
    const noSummary = {...activity, summary: undefined};
    assert.equal(getLastPerspectiveStep(noSummary), 2);
    const state = play(noSummary, ['foreigner', 'angry']);
    const last = guessPerspective(noSummary, state, 'glad');
    assert.equal(advancePerspective(noSummary, last).finished, true);
});

test('saved progress is restored, and out-of-date progress is dropped safely', () => {
    const saved = JSON.parse(JSON.stringify(play(activity, ['no-english', 'go-away', 'still-angry'])));
    assert.deepEqual(restorePerspectiveState(activity, saved), saved);
    assert.deepEqual(restorePerspectiveState(activity, null), createPerspectiveState());
    assert.deepEqual(restorePerspectiveState(activity, 'broken'), createPerspectiveState());
    assert.equal(restorePerspectiveState(activity, {step: 99, answers: {asks: {optionId: 'no-english', text: ''}}}).step, 1);
    assert.equal(restorePerspectiveState(activity, {step: 3, answers: {shouts: {optionId: 'angry', text: ''}}}).step, 0);
    const stale = restorePerspectiveState(activity, {step: 0, answers: {asks: {optionId: 'removed-option', text: 'kept'}}});
    assert.deepEqual(stale.answers.asks, {optionId: null, text: 'kept'});
});

test('content mistakes are reported', () => {
    const problems = validatePerspectiveFlip({panels: [{id: 'p', guess: {options: [{id: 'a'}]}}], summary: {rows: [{label: 'Describe'}]}});
    for (const expected of ['a name for each of its two views', 'no image.', 'no image description', 'no thought for the first view', 'no thought for the second view', 'no guess prompt', 'at least two guess options', 'no label', 'Summary row 1']) {
        assert.ok(problems.some(problem => problem.includes(expected)), expected);
    }
    assert.ok(validatePerspectiveFlip({views: {first: 'A', second: 'B'}}).includes('The activity has no panels.'));
});

test('the choices wait for a written guess unless the activity turns that off', () => {
    assert.equal(writesFirst(activity), true);
    assert.equal(writesFirst({}), true);
    assert.equal(writesFirst({writeFirst: false}), false);
});
