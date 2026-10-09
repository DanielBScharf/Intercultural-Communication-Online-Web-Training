import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.localStorage = { getItem: () => null, setItem() {} };

const {
    createInquiryState, pickInquiryOption, advanceInquiry, retreatInquiry, restoreInquiryState,
    getPickLimit, getPicksLeft, getInquiryQuestions, validateInquiry, getInquiryStepCount
} = await import('../js/inquiryActivity.js');
const { incidentsModule } = await import('../modules/incidents.js');

const option = (id, value = 'high') => ({ id, label: id, result: ['r'], value });
const lesson = {
    id: 'sample',
    type: 'inquiry',
    question: { prompt: 'Why?', storageKey: 'sampleWhy' },
    picks: 2,
    options: [option('a'), option('b', 'low'), option('c', 'some')]
};

test('the question needs an answer unless it is skipped', () => {
    const start = createInquiryState();
    assert.deepEqual(advanceInquiry(lesson, start), { state: start, moved: false, needsWriting: true });
    assert.equal(advanceInquiry(lesson, start, { hasAnswer: true }).state.step, 1);
    assert.equal(advanceInquiry(lesson, start, { force: true }).state.step, 1);
    assert.equal(advanceInquiry({ ...lesson, question: undefined }, start).state.step, 1);
});

test('choices are limited, cannot repeat, and cannot be made outside the choosing step', () => {
    assert.equal(getPickLimit(lesson), 2);
    assert.equal(getPickLimit({ options: [option('a')], picks: 5 }), 1);

    const start = createInquiryState();
    assert.equal(pickInquiryOption(lesson, start, 'a'), start);

    let state = { step: 1, picks: [] };
    state = pickInquiryOption(lesson, state, 'a');
    assert.equal(pickInquiryOption(lesson, state, 'a'), state);
    assert.equal(pickInquiryOption(lesson, state, 'nope'), state);
    assert.equal(getPicksLeft(lesson, state), 1);
    state = pickInquiryOption(lesson, state, 'b');
    assert.deepEqual(state.picks, ['a', 'b']);
    assert.equal(pickInquiryOption(lesson, state, 'c'), state);
});

test('the review opens only when every choice has been used', () => {
    const one = { step: 1, picks: ['a'] };
    assert.deepEqual(advanceInquiry(lesson, one), { state: one, moved: false, needsPicks: true });

    const two = { step: 1, picks: ['a', 'b'] };
    const result = advanceInquiry(lesson, two);
    assert.equal(result.state.step, 2);
    assert.equal(advanceInquiry(lesson, result.state).moved, false);
    assert.deepEqual(retreatInquiry(result.state).state, { step: 1, picks: ['a', 'b'] });
    assert.equal(retreatInquiry(createInquiryState()).moved, false);
});

test('saved progress is repaired when it is missing, damaged or out of date', () => {
    assert.deepEqual(restoreInquiryState(lesson, null), { step: 0, picks: [] });
    assert.deepEqual(restoreInquiryState(lesson, { step: 9, picks: 'x' }), { step: 0, picks: [] });
    assert.deepEqual(restoreInquiryState(lesson, { step: 2, picks: ['a', 'gone'] }), { step: 1, picks: ['a'] });
    assert.deepEqual(restoreInquiryState(lesson, { step: 2, picks: ['a', 'a', 'b', 'c'] }), { step: 2, picks: ['a', 'b'] });
});

test('the written question is passed to the Reflection Summary', () => {
    assert.deepEqual(getInquiryQuestions(lesson).map(question => question.storageKey), ['sampleWhy']);
    assert.deepEqual(getInquiryQuestions({ options: [] }), []);
});

test('authoring problems are reported', () => {
    assert.deepEqual(validateInquiry(lesson), []);
    const problems = validateInquiry({
        picks: 2,
        question: { prompt: 'Why?' },
        options: [{ id: 'a', label: 'A', result: ['r'], value: 'high' }, { id: 'a', result: [], value: 'great' }]
    }).join(' ');
    assert.match(problems, /fewer than the number of options/);
    assert.match(problems, /no storageKey/);
    assert.match(problems, /used more than once/);
    assert.match(problems, /no label/);
    assert.match(problems, /no result/);
    assert.match(problems, /"high", "some" or "low"/);
});

test('the wedding incident is a valid inquiry followed by one required reflection', () => {
    const ids = incidentsModule.lessons.map(item => item.id);
    const start = ids.indexOf('incident-guest-host-communication');
    const wedding = incidentsModule.lessons[start];

    assert.equal(wedding.type, 'inquiry');
    assert.deepEqual(validateInquiry(wedding), []);
    assert.equal(wedding.options.length, 6);
    assert.equal(getPickLimit(wedding), 3);
    assert.equal(wedding.options.filter(item => item.value === 'high').length, 3);
    assert.equal(getInquiryStepCount(wedding), 3);
    assert.equal(wedding.question.storageKey, 'incidentGuestHostInitialReflection');

    const reflection = incidentsModule.lessons[start + 1];
    assert.equal(reflection.id, 'incident-guest-host-reflection');
    assert.equal(reflection.storageKey, 'incidentGuestHostDaeaReflection');
    assert.equal(reflection.required, true);
});
