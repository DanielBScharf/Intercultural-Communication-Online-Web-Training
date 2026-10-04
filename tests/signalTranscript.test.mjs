import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.localStorage = { getItem: () => null, setItem() {} };

const {
    createTranscriptState, toggleTranscriptLine, advanceTranscript, retreatTranscript,
    restoreTranscriptState, getTranscriptResults, getTranscriptScore, getSignalLines,
    validateSignalTranscript, getTranscriptStepCount
} = await import('../js/signalTranscript.js');
const { incidentsModule } = await import('../modules/incidents.js');

const lesson = {
    id: 'sample',
    type: 'signalTranscript',
    speakers: { you: { name: 'You', self: true }, other: { name: 'Other' } },
    lines: [
        { id: 'you1', speaker: 'you', text: 'Can we agree?' },
        { id: 'a', speaker: 'other', text: 'Thank you.' },
        { id: 'b', speaker: 'other', text: 'That may be difficult.', signal: true, heard: 'h', meant: 'm' },
        { id: 'c', speaker: 'other', text: 'How was your flight?', signal: true, heard: 'h', meant: 'm' }
    ]
};

test('lines are marked and unmarked, and unknown lines are ignored', () => {
    let state = createTranscriptState();
    state = toggleTranscriptLine(lesson, state, 'b');
    state = toggleTranscriptLine(lesson, state, 'a');
    assert.deepEqual(state.selected, ['b', 'a']);
    state = toggleTranscriptLine(lesson, state, 'a');
    assert.deepEqual(state.selected, ['b']);
    assert.equal(toggleTranscriptLine(lesson, state, 'nope'), state);
    assert.equal(toggleTranscriptLine(lesson, state, 'you1'), state);
});

test('the review needs at least one marked line', () => {
    const empty = createTranscriptState();
    assert.deepEqual(advanceTranscript(lesson, empty), { state: empty, moved: false, needsSelection: true });

    const marked = toggleTranscriptLine(lesson, empty, 'b');
    const result = advanceTranscript(lesson, marked);
    assert.equal(result.moved, true);
    assert.equal(result.state.step, 1);
    assert.equal(advanceTranscript(lesson, result.state).moved, false);
});

test('marks cannot change during the review, and Previous keeps them', () => {
    const review = { step: 1, selected: ['b'] };
    assert.equal(toggleTranscriptLine(lesson, review, 'c'), review);
    assert.deepEqual(retreatTranscript(review), { state: { step: 0, selected: ['b'] }, moved: true });
    assert.equal(retreatTranscript(createTranscriptState()).moved, false);
});

test('results separate found, missed and extra lines', () => {
    const state = { step: 1, selected: ['a', 'b'] };
    assert.deepEqual(getTranscriptResults(lesson, state).map(result => result.status), ['plain', 'extra', 'found', 'missed']);
    assert.deepEqual(getTranscriptScore(lesson, state), { found: 1, total: 2, extra: 1 });
    assert.deepEqual(getTranscriptResults(lesson, createTranscriptState()).map(result => result.status), ['plain', 'plain', 'missed', 'missed']);
});

test('saved progress is repaired when it is missing, damaged or out of date', () => {
    assert.deepEqual(restoreTranscriptState(lesson, null), { step: 0, selected: [] });
    assert.deepEqual(restoreTranscriptState(lesson, 'x'), { step: 0, selected: [] });
    assert.deepEqual(restoreTranscriptState(lesson, { step: 1, selected: ['gone'] }), { step: 0, selected: [] });
    assert.deepEqual(restoreTranscriptState(lesson, { step: 1, selected: ['b', 'b', 'gone', 'you1'] }), { step: 1, selected: ['b'] });
});

test('authoring problems are reported', () => {
    assert.deepEqual(validateSignalTranscript(lesson), []);
    const broken = {
        speakers: { you: { name: 'You' } },
        lines: [
            { id: 'a', speaker: 'you', text: 'Hello' },
            { id: 'a', speaker: 'ghost', text: '', signal: true }
        ]
    };
    const problems = validateSignalTranscript(broken).join(' ');
    assert.match(problems, /used more than once/);
    assert.match(problems, /no text/);
    assert.match(problems, /not listed in speakers/);
    assert.match(problems, /needs both heard and meant/);
    assert.match(validateSignalTranscript({ lines: [] }).join(' '), /no lines/);
});

test('the negotiation incident is a valid transcript followed by a scenario and one reflection', () => {
    const ids = incidentsModule.lessons.map(item => item.id);
    const start = ids.indexOf('incident-negotiation-misunderstanding');
    assert.equal(ids[start - 1], 'incident-negotiation-indirect');
    assert.deepEqual(ids.slice(start, start + 3), [
        'incident-negotiation-misunderstanding',
        'incident-negotiation-followup',
        'incident-negotiation-reflection'
    ]);

    const transcript = incidentsModule.lessons[start];
    assert.equal(transcript.type, 'signalTranscript');
    assert.deepEqual(validateSignalTranscript(transcript), []);
    assert.equal(getSignalLines(transcript).length, 4);
    assert.equal(getTranscriptStepCount(transcript), 2);

    // None of the learner's own lines is a signal.
    assert.equal(transcript.lines.some(line => line.signal && transcript.speakers[line.speaker].self), false);

    const followup = incidentsModule.lessons[start + 1];
    assert.equal(followup.type, 'branchingScenario');
    assert.equal(followup.decisions[0].options.filter(option => option.recommended).length, 1);

    const reflection = incidentsModule.lessons[start + 2];
    assert.equal(reflection.storageKey, 'incidentNegotiationDaeaReflection');
    assert.equal(reflection.scenarioRecap, 'incident-negotiation-followup');
});
