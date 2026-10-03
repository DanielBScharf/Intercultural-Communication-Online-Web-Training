import test from 'node:test';
import assert from 'node:assert/strict';
import {
    createScenarioState, getNextDecisionId, getPendingDecisionId, isScenarioComplete,
    getScenarioView, chooseScenarioOption, advanceScenario, retreatScenario,
    restoreScenarioState, getScenarioChoices, validateScenario, getDecisionQuestion, getScenarioQuestions,
    getScenarioQuestion, getLastScenarioView
} from '../js/branchingScenario.js';
import {courseData} from '../js/courseData.js';
import {stereotypesModule} from '../modules/stereotypes.js';
import {incidentsModule} from '../modules/incidents.js';

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

test('an open question is optional, and a decision without one has none', () => {
    assert.equal(getDecisionQuestion(scenario.decisions[0]), null);
    assert.deepEqual(getScenarioQuestions(scenario), []);
    assert.equal(getDecisionQuestion({question: {prompt: 'Why?'}}), null);
    assert.equal(getScenarioQuestion(scenario), null);
    assert.equal(getLastScenarioView(scenario, play(scenario, ['observation', 'ask'])), 2);
});

test('a question on a single decision still works', () => {
    const lesson = {id: 'q', decisions: [
        {id: 'one', prompt: 'One?', options: [option('a'), option('b')], question: {prompt: 'Why?', storageKey: 'qOne'}},
        {id: 'two', prompt: 'Two?', options: [option('c'), option('d')]}
    ]};
    assert.equal(getDecisionQuestion(lesson.decisions[0]).storageKey, 'qOne');
    assert.deepEqual(getScenarioQuestions(lesson).map(question => question.storageKey), ['qOne']);
    assert.deepEqual(getScenarioView(lesson, play(lesson, ['a', 'c'])), {kind: 'review'});
    assert.deepEqual(validateScenario(lesson), []);
});

test('the dinner incident asks for explanations once, after both decisions and before the compare screen', () => {
    const dinner = incidentsModule.lessons.find(lesson => lesson.id === 'incident-drinking-expectation');
    assert.equal(dinner.type, 'branchingScenario');
    assert.equal(dinner.decisions.some(decision => getDecisionQuestion(decision)), false);
    assert.equal(getScenarioQuestion(dinner).storageKey, 'incidentDrinkingInitialReflection');
    assert.equal(dinner.showTagsAfterChoice, false);
    const questions = getScenarioQuestions(dinner);
    assert.equal(questions.length, 1);
    assert.deepEqual(questions[0].learningObjectives, ['LO3']);
    assert.ok(questions[0].prompt.includes('at least two possible explanations'));

    let state = chooseScenarioOption(dinner, createScenarioState(), 'withdraw');
    state = advanceScenario(dinner, state).state;
    assert.equal(getScenarioView(dinner, state).decisionId, 'toast');
    state = chooseScenarioOption(dinner, state, 'join');
    assert.equal(getScenarioView(dinner, state).chosenOptionId, 'join');
    state = advanceScenario(dinner, state).state;
    assert.deepEqual(getScenarioView(dinner, state), {kind: 'question'});
    const toReview = advanceScenario(dinner, state);
    assert.equal(toReview.moved, true);
    assert.deepEqual(getScenarioView(dinner, toReview.state), {kind: 'review'});
    assert.equal(advanceScenario(dinner, toReview.state).finished, true);
    assert.deepEqual(getScenarioView(dinner, retreatScenario(toReview.state).state), {kind: 'question'});
    assert.equal(getLastScenarioView(dinner, toReview.state), 3);
    assert.deepEqual(restoreScenarioState(dinner, JSON.parse(JSON.stringify(toReview.state))), toReview.state);
    assert.equal(restoreScenarioState(dinner, {path: toReview.state.path, view: 99}).view, 3);
    assert.equal(restoreScenarioState(dinner, {path: toReview.state.path.slice(0, 1), view: 99}).view, 1);
});

test('the reason for the custom is not given until the compare screen', () => {
    const dinner = incidentsModule.lessons.find(lesson => lesson.id === 'incident-drinking-expectation');
    const beforeReview = JSON.stringify([dinner.scene, dinner.decisions.map(decision => [decision.body, decision.options.map(dinnerOption => dinnerOption.outcome)])]);
    assert.equal(/Priya|invitation to pour/.test(beforeReview), false);
    assert.ok(dinner.debrief.body.join(' ').includes('an empty glass is an invitation to pour'));
});

test('the dinner incident keeps reasons out of the outcomes until the compare screen', () => {
    const dinner = incidentsModule.lessons.find(lesson => lesson.id === 'incident-drinking-expectation');
    dinner.decisions.flatMap(decision => decision.options).forEach(dinnerOption => {
        assert.ok(dinnerOption.outcome.length >= 1, dinnerOption.id);
        assert.ok(dinnerOption.explanation.length >= 1, dinnerOption.id);
    });
});

test('the dinner incident is followed by one required reflection that shows the choices', async () => {
    const {getReflectionEntries, getMissingRequiredResponses} = await import('../js/reflectionValidation.js');
    const ids = incidentsModule.lessons.map(lesson => lesson.id);
    const reflection = incidentsModule.lessons[ids.indexOf('incident-drinking-expectation') + 1];
    assert.equal(reflection.id, 'incident-drinking-reflection');
    assert.equal(reflection.scenarioRecap, 'incident-drinking-expectation');
    assert.deepEqual(getReflectionEntries(reflection).map(entry => [entry.storageKey, entry.required]), [['incidentDrinkingDaeaReflection', true]]);
    globalThis.localStorage = {getItem: () => null, setItem() {}};
    assert.equal(getMissingRequiredResponses(incidentsModule).some(entry => entry.storageKey === 'incidentDrinkingInitialReflection'), false);
});

test('a question without a prompt or storage key is reported', () => {
    const problems = validateScenario({decisions: [
        {id: 'only', prompt: 'P?', question: {}, options: [{id: 'a', label: 'A', outcome: ['x']}, {id: 'b', label: 'B', outcome: ['y']}]}
    ]});
    assert.ok(problems.some(problem => problem.includes('no prompt')));
    assert.ok(problems.some(problem => problem.includes('no storageKey')));
    const scenarioProblems = validateScenario({question: {prompt: 'Why?'}, decisions: [
        {id: 'only', prompt: 'P?', options: [{id: 'a', label: 'A', outcome: ['x']}, {id: 'b', label: 'B', outcome: ['y']}]}
    ]});
    assert.deepEqual(scenarioProblems, ['The scenario question has no storageKey.']);
});
