import { KeywordScore, KeywordMapping } from '../types';
import { KEYWORD_MAPPINGS } from '../constants';

export const calculateTopCapabilities = (
  text: string, 
  availableCapabilities: string[]
): string[] => {
  const normalizedText = text.toLowerCase();
  const scores: Record<string, number> = {};

  // Initialize scores
  availableCapabilities.forEach(cap => {
    scores[cap] = 0;
  });

  // Iterate through mappings and score
  KEYWORD_MAPPINGS.forEach((mapping: KeywordMapping) => {
    mapping.keywords.forEach(keyword => {
      if (normalizedText.includes(keyword.toLowerCase())) {
        // Boost associated capabilities if they exist in the current mode's list
        mapping.capabilities.forEach(targetCap => {
          if (scores.hasOwnProperty(targetCap)) {
            scores[targetCap] += 1;
          }
        });
      }
    });
  });

  // Convert to array and sort
  const sortedScores: KeywordScore[] = Object.keys(scores)
    .map(cap => ({ capability: cap, score: scores[cap] }))
    .sort((a, b) => b.score - a.score);

  // If no keywords matched (all scores 0), return empty to let LLM fallback to its own logic
  // However, prompts says "Pick exactly 3".
  // If scores are all zero, we pick the first 3 or let the LLM handle "AUTO".
  // For this implementation, if top score is 0, we return "AUTO" to let LLM decide 
  // rather than picking alphabetically.
  if (sortedScores.length > 0 && sortedScores[0].score === 0) {
      return ["AUTO"];
  }

  // Return top 3
  return sortedScores.slice(0, 3).map(s => s.capability);
};
