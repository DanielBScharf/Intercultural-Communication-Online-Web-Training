export const designPrinciples = {
  recognizeIncompletePicture: {
    id: "recognizeIncompletePicture",
    title: "Recognize When You Don't Have the Whole Picture",
    description:
      "Intercultural situations often involve incomplete information. Recognizing what you do and do not know helps prevent assumptions from becoming conclusions.",
  },

  delayJudgment: {
    id: "delayJudgment",
    title: "Delay Judgment Until More Information Is Available",
    description:
      "Pause before deciding what unfamiliar behavior or situations mean. Allow time to observe, reflect, and gather additional context.",
  },

  seekInformation: {
    id: "seekInformation",
    title: "Seek Information Rather Than Filling in the Gaps Yourself",
    description:
      "When something is unclear, use observation, questions, research, cultural informants, and other sources of context rather than relying only on assumptions.",
  },

  reviseInterpretation: {
    id: "reviseInterpretation",
    title: "Revise Your Interpretation When New Information Becomes Available",
    description:
      "Treat initial interpretations as provisional. New information may confirm, complicate, or challenge what you originally believed.",
  },

  multipleInterpretations: {
    id: "multipleInterpretations",
    title: "Recognize That Multiple Interpretations Can Coexist",
    description:
      "Culture, experience, and perspective can lead people to interpret the same situation differently. A different interpretation is not automatically an incorrect one.",
  },

  reflectionToAction: {
    id: "reflectionToAction",
    title: "Use Reflection to Inform Future Action",
    description:
      "Reflection becomes most useful when it influences what happens next. Use insights from past experiences to make more thoughtful decisions in future intercultural situations.",
  },
};

export function getDesignPrinciple(id) {
  const designPrinciple = designPrinciples[id];

  if (!designPrinciple) {
    console.warn(`Unknown design principle ID: ${id}`);
    return {
      id,
      title: "Unknown Design Principle",
      description: "Design principle information is not available.",
    };
  }

  return designPrinciple;
}
