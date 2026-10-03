import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createScenarioState, getNextDecisionId, getPendingDecisionId, isScenarioComplete,
    getScenarioView, chooseScenarioOption, advanceScenario, retreatScenario,
    restoreScenarioState, getScenarioChoices, validateScenario
} from '../js/branchingScenario.js';
import {courseData} from '../js/courseData.js';
import {stereotypesModule} from '../modules/stereotypes.js';

const scenario = stereotypesModule.lessons.find(lesson => lesson.id === 'stereotypes-scenario');
const option = (id, extra = {}) => ({id, label: id, outcome: [id], ...extra});
const branching = {
    id: 'branching',
    decisions: [
        {id: 'first', prompt: 'First?', options: [option('to-third', {next: 'third'}), option('stop', {next: 'end'}), option('default')]},
        {id: 'second', prompt: 'Second?', options: [option('a'), option('b')]},
        {id: 'third', prompt: 'Third?', options: [option('c'), option('d')]}
    ]
};

function play(lesson, optionIds) {
    return optionIds.reduce((state, optionId) => {
        const chosen = chooseScenarioOption(lesson, state, optionId);
        return advanceScenario(lesson, chosen).state;
    }, createScenarioState());
}

test('every scenario in the course has sound content', () => {
    const scenarios = courseData.modules.flatMap(module => module.lessons)
        .filter(lesson => lesson.type === 'branchingScenario');
    assert.ok(scenarios.length >= 1);
    scenarios.forEach(lesson => assert.deepEqual(validateScenario(lesson), [], lesson.id));
});

test('the stereotypes scenario sits between the content and its reflection', () => {
    const ids = stereotypesModule.lessons.map(lesson => lesson.id);
    assert.equal(ids.indexOf('stereotypes-scenario') + 1, ids.indexOf('stereotypes-assumption-check'));
    assert.equal(stereotypesModule.lessons.find(lesson => lesson.id === 'stereotypes-assumption-check').scenarioRecap, 'stereotypes-scenario');
    assert.equal(ids.includes('stereotypes-sort'), false);
});

test('a new scenario starts on its first decision with nothing chosen', () => {
    const state = createScenarioState();
    assert.deepEqual(getScenarioView(scenario, state), {kind: 'decision', decisionId: 'conclusion', chosenOptionId: null});
    assert.equal(isScenarioComplete(scenario, state), false);
});

test('Next asks for a choice before moving on', () => {
    const result = advanceScenario(scenario, createScenarioState());
    assert.equal(result.needsChoice, true);
    assert.equal(result.moved, false);
});

test('choosing shows the outcome on the same view and locks the choice', () => {
    const chosen = chooseScenarioOption(scenario, createScenarioState(), 'judgment');
    assert.deepEqual(getScenarioView(scenario, chosen), {kind: 'decision', decisionId: 'conclusion', chosenOptionId: 'judgment'});
    assert.equal(chooseScenarioOption(scenario, chosen, 'observation'), chosen);
    assert.equal(chooseScenarioOption(scenario, createScenarioState(), 'not-an-option').path.length, 0);
});

test('a full run reaches the compare screen and then hands back to the lesson', () => {
    const state = play(scenario, ['observation', 'ask']);
    assert.deepEqual(getScenarioView(scenario, state), {kind: 'review'});
    assert.equal(isScenarioComplete(scenario, state), true);
    assert.deepEqual(getScenarioChoices(scenario, state).map(choice => choice.option.id), ['observation', 'ask']);
    const result = advanceScenario(scenario, state);
    assert.equal(result.moved, false);
    assert.equal(result.finished, true);
});

test('Previous steps back through the scenario before leaving it', () => {
    let state = play(scenario, ['stereotype', 'avoid']);
    let result = retreatScenario(state);
    assert.equal(result.moved, true);
    assert.equal(getScenarioView(scenario, result.state).decisionId, 'action');
    result = retreatScenario(result.state);
    assert.equal(getScenarioView(scenario, result.state).chosenOptionId, 'stereotype');
    assert.equal(retreatScenario(result.state).moved, false);
});

test('decisions follow list order unless an option names its own next step', () => {
    assert.equal(getNextDecisionId(branching, 'first', 'default'), 'second');
    assert.equal(getNextDecisionId(branching, 'first', 'to-third'), 'third');
    assert.equal(getNextDecisionId(branching, 'first', 'stop'), null);
    assert.equal(getNextDecisionId(branching, 'third', 'c'), null);
    assert.deepEqual(getScenarioView(branching, play(branching, ['stop'])), {kind: 'review'});
    assert.equal(getPendingDecisionId(branching, play(branching, ['to-third'])), 'third');
    assert.deepEqual(getScenarioChoices(branching, play(branching, ['to-third', 'd'])).map(choice => choice.decision.id), ['first', 'third']);
});

test('saved progress is restored, and out-of-date progress is dropped safely', () => {
    const saved = JSON.parse(JSON.stringify(play(scenario, ['observation', 'ask'])));
    assert.deepEqual(restoreScenarioState(scenario, saved), saved);
    assert.deepEqual(restoreScenarioState(scenario, null), createScenarioState());
    assert.deepEqual(restoreScenarioState(scenario, {path: 'broken'}), createScenarioState());
    const stale = {path: [{decisionId: 'conclusion', optionId: 'observation'}, {decisionId: 'action', optionId: 'removed-option'}], view: 2};
    assert.deepEqual(restoreScenarioState(scenario, stale), {path: [{decisionId: 'conclusion', optionId: 'observation'}], view: 1});
    assert.equal(restoreScenarioState(scenario, {path: saved.path, view: 99}).view, 2);
});

test('content mistakes are reported', () => {
    const problems = validateScenario({decisions: [
        {id: 'only', prompt: '', options: [{id: 'x', label: 'X', outcome: [], next: 'nowhere'}]}
    ]});
    assert.ok(problems.some(problem => problem.includes('no prompt')));
    assert.ok(problems.some(problem => problem.includes('at least two options')));
    assert.ok(problems.some(problem => problem.includes('no outcome')));
    assert.ok(problems.some(problem => problem.includes('not a decision')));
    assert.deepEqual(validateScenario({decisions: []}), ['The scenario has no decisions.']);
});

test('a scenario is optional and never blocks module completion', async () => {
    const {getReflectionEntries} = await import('../js/reflectionValidation.js');
    assert.deepEqual(getReflectionEntries(scenario), []);
});
