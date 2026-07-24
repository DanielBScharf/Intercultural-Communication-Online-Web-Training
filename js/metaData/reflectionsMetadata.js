export const lessons = {
  culture: {
    id: "culture",
    title: "What Is Culture?",
  },

  stereotypes: {
    id: "stereotypes",
    title: "Stereotypes and Assumptions",
  },

  tolerance: {
    id: "tolerance",
    title: "Tolerance of Ambiguity",
  },

  daea: {
    id: "daea",
    title: "Critical Reflection and DAEA",
  },

  prague: {
    id: "prague",
    title: "A Misunderstanding in Prague",
  },

  criticalIncidents: {
    id: "criticalIncidents",
    title: "Additional Critical Incidents",
  },

  finalReflection: {
    id: "finalReflection",
    title: "Final Reflection",
  },
};

export function getLesson(lessonId) {
  const lesson = lessons[lessonId];

  if (!lesson) {
    console.warn(`Unknown lesson ID: ${lessonId}`);
    return {
      id: lessonId,
      title: "Untitled Lesson",
    };
  }

  return lesson;
}