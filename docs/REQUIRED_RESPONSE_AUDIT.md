# Required-response validation audit

Current course data is authoritative. This change adds only response requirements and validation behavior; prompts, rationales, prose, metadata definitions, and segmented position logic are unchanged.

> **Update, October 2026:** `incidentDrinkingInitialReflection` is now the open question inside the "A Work Dinner" branching scenario. It is still saved and still appears in the Reflection Summary, but it no longer blocks module completion. The table below is the original audit.
>
> **Update, October 2026:** `pragueInitialDescription` and the `pragueDecision` choice were removed when the Prague module was rebuilt around the perspective-flip activity. The course now has 25 reflection entries, 23 of them required.

> **Update, October 2026:** `incidentNegotiationInitialReflection` was removed when the negotiation incident was rebuilt as a signal transcript ("Where Was the No?"), a follow-up scenario, and one reflection. The course now has 24 reflection entries, 22 of them required.

## Required (25 responses)

| Reflection ID / storage key | Module | Title |
| --- | --- | --- |
| `cultureDefinition` | Understanding Culture | What is Culture? |
| `cultureIcebergReflection` | Understanding Culture | Your Culture Iceberg |
| `cultureHiddenMisunderstandingReflection` | Understanding Culture | Hidden Culture and Misunderstandings |
| `culturePerspectiveReflection` | Understanding Culture | Whose Perspective Is Correct? |
| `cultureReflectionGrowth` | Understanding Culture | How My Understanding Changed |
| `stereotypesReflection` | Stereotypes | Recognizing Stereotypes |
| `stereotypesAssumptionCheckReflection` | Stereotypes | Checking an Assumption |
| `ambiguityUncomfortableReflection` | Tolerance of Ambiguity | Uncomfortable is Not Always Bad |
| `ambiguityDailyLifeReflection` | Tolerance of Ambiguity | Applying Tolerance of Ambiguity |
| `reflectionDefinition` | Critical Reflection / DAEA | What is Reflection? |
| `daeaDescribeResponse` | Critical Reflection / DAEA | Practice: Describe |
| `daeaAnalyzeResponse` | Critical Reflection / DAEA | Practice: Analyze |
| `daeaEvaluateResponse` | Critical Reflection / DAEA | Practice: Evaluate |
| `daeaApplyResponse` | Critical Reflection / DAEA | Apply |
| `pragueInitialDescription` | Prague Example Practice | First Impressions |
| `pragueDaeaReflection` | Prague Example Practice | Reconsidering the Situation |
| `incidentDrinkingInitialReflection` | Critical Incidents | First Impressions |
| `incidentDrinkingDaeaReflection` | Critical Incidents | Reconsidering the Situation |
| `incidentNegotiationInitialReflection` | Critical Incidents | First Impressions |
| `incidentNegotiationDaeaReflection` | Critical Incidents | Reconsidering the Situation |
| `incidentGuestHostInitialReflection` | Critical Incidents | First Impressions |
| `incidentGuestHostDaeaReflection` | Critical Incidents | Reconsidering the Situation |
| `finalReflectionUsefulConcept` | Final Reflection | Most Useful Concept |
| `finalReflectionDifferentResponse` | Final Reflection | Responding Differently |
| `finalReflectionFurtherQuestion` | Final Reflection | Questions to Explore |

The DAEA practice responses and the initial Prague/Critical Incident responses are explicit reflection activities with entries in Reflection Summary. They remain separate staged responses, with their current wording and disclosures preserved; each requires only non-whitespace text.

## Not required

| ID / input | Module | Reason |
| --- | --- | --- |
| `pragueDecision` | Prague Example Practice | A decision slide, explicitly optional in the existing activity architecture; it is not a substantive reflection or a Reflection Summary entry. |

## Ambiguous / needs design decision (left non-required)

| Reflection ID / storage key | Module | Reason |
| --- | --- | --- |
| `currentCultureDefinition` | Understanding Culture | Invites learners to decide whether they would like to update their definition. Requiring a revised definition could contradict that invitation. Explicit `required: false` until the intended participation requirement is clarified. |
| `finalReflectionDisagreement` | Final Reflection | Asks whether anything was questioned or disagreed with. It is unclear whether learners with no disagreement must write a response. Explicit `required: false` until that design decision is made. |

## Other response surfaces

Reflection Summary editors are alternate editors of these same 27 response IDs, not additional reflection activities. They derive required status from module response data. Review/comparison panels and accordion examples only display saved responses. Think-about-it lists are instructional prose with no entry fields. Sorting activities have classifications, not free-text reflections. Dormant `storyActivity` and `imageReveal` renderer code has no activity instances in the current module data and is not made required.

## Implementation

- `required: true` / `required: false` is declared on single-response reflection lessons, individual multi-question prompts, and individual guided reflection slides. Missing flags default to non-required.
- `js/reflectionValidation.js` centralizes the non-whitespace rule, semantic response discovery, saved-response checks, feedback markup, invalid-state handling, and focus.
- `js/renderer.js` checks required fields before outer Next navigation. Guided activities also check all required slide responses before leaving the activity. Previous and menu navigation remain unrestricted.
- `js/activities.js` checks the current reflection before guided-slide Next and can open the exact missing slide after an integrity check.
- `js/app.js` checks required saved responses before recording module completion; on failure it returns to the first missing response with feedback. Existing completion flags are retained, but sidebar status, progress totals, workshop completion, and Summary availability count a flagged module only when its current required responses are valid.
- Reflection Summary uses the same validation rule before saving required edits. Failed edits keep the saved response intact and the editor open. Optional edits retain their existing behavior.
- Feedback uses the existing danger color, text next to the field, `aria-invalid`, `aria-required`, `aria-describedby`, a polite live region, and focus on the first invalid field. A valid input clears stale feedback without repeated keystroke announcements.
- Autosave and all storage keys remain unchanged. No additional response copies, migration, minimum length/word count, or content evaluation are introduced.

## Architectural issues addressed

1. Guided activities have both slide navigation and outer lesson navigation; guarding only the slide button would allow required responses to be skipped. Both paths are checked.
2. Completion previously trusted saved module flags alone. Existing flags now remain stored while effective completion is derived from both the flag and actual required response content. This protects old saved progress and handles deleting an earlier answer.

## Verification

Automated: `node --test --test-isolation=none tests/reflectionValidation.test.mjs` (5 passing tests). Covers whitespace and one-character cases, all configured response IDs, old saved data preservation, first-error focus/clearing, multi-field checks, controller completion, Summary eligibility, and missing guided reflection routing.

Browser checks with isolated sample progress: empty/spaces/line-breaks/tabs rejected; `Not sure.` accepted; response restored after Previous and reload; deleting a saved answer blocks Next; Previous works while blank; completion redirects to missing response; guided slide and outer Next both enforce requirements; Summary displays saved response and rejects whitespace edits without overwriting it; valid Summary edits save; optional Summary edits can clear; multiple prompts focus the next missing field; existing valid progress remains complete; keyboard Enter activates validation; narrow layout has no horizontal overflow. Native screen-reader announcement playback was not independently tested; live-region and field associations were inspected.

## Files changed

- `modules/culture.js`, `modules/stereotypes.js`, `modules/ambiguity.js`, `modules/daea.js`, `modules/prague.js`, `modules/incidents.js`, `modules/finalReflection.js`: explicit per-response requirement flags only.
- `js/reflectionValidation.js`: new shared validation helper.
- `js/renderer.js`: ordinary Next checks, guided activity exit check, validation markup, and protected Summary edits.
- `js/activities.js`: guided slide checks and missing-response routing.
- `js/app.js`: completion integrity, effective progress, and Summary eligibility.
- `css/styles.css`: restrained feedback styling using existing colors.
- `tests/reflectionValidation.test.mjs`: validation and completion regression tests.
- `docs/REQUIRED_RESPONSE_AUDIT.md`: complete input audit, design decisions, implementation, and verification.
