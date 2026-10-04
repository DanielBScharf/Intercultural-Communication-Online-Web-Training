// ======================================
// Module Progress
// js/moduleProgress.js
// ======================================
//
// Purpose:
// Works out where the learner is in a module for the progress bar at
// the top of each lesson.
//
// The bar counts every step in the module, not every lesson. A plain
// lesson is one step. An activity with several steps of its own (a
// guided activity's slides, a scenario's decisions, a perspective
// flip's panels, a signal transcript's two steps) counts each of them, so the bar keeps moving while
// the learner works through the activity.
//
// The module's intro and completion screens are not counted.
// ======================================

import { getScenarioStepCount } from "./branchingScenario.js";
import { getPerspectiveStepCount } from "./perspectiveFlip.js";
import { getTranscriptStepCount } from "./signalTranscript.js";

function isCountedLesson(lesson) {
    return lesson.type !== "moduleIntro" && lesson.type !== "moduleComplete";
}

// How many steps one lesson adds to the module's progress bar.
export function getLessonStepCount(lesson) {
    let count = 1;

    if (lesson?.type === "guidedActivity") count = (lesson.slides || []).length;
    if (lesson?.type === "branchingScenario") count = getScenarioStepCount(lesson);
    if (lesson?.type === "perspectiveFlip") count = getPerspectiveStepCount(lesson);
    if (lesson?.type === "signalTranscript") count = getTranscriptStepCount(lesson);

    return Math.max(count, 1);
}

export function getModuleStepTotal(module) {
    return (module?.lessons || [])
        .filter(isCountedLesson)
        .reduce((total, lesson) => total + getLessonStepCount(lesson), 0);
}

// The learner's position in the module. stepInLesson is the step inside
// the current lesson, starting at 0. Returns null for lessons the bar
// does not count.
export function getModuleStepPosition(module, lesson, stepInLesson = 0) {
    const lessons = (module?.lessons || []).filter(isCountedLesson);
    const lessonIndex = lessons.findIndex(moduleLesson => moduleLesson.id === lesson?.id);

    if (lessonIndex < 0) return null;

    const stepsBefore = lessons
        .slice(0, lessonIndex)
        .reduce((total, moduleLesson) => total + getLessonStepCount(moduleLesson), 0);
    const lastStep = getLessonStepCount(lessons[lessonIndex]) - 1;
    const step = Math.min(Math.max(Number(stepInLesson) || 0, 0), lastStep);

    return {
        currentIndex: stepsBefore + step + 1,
        total: getModuleStepTotal(module),
        moduleName: module.title
    };
}
