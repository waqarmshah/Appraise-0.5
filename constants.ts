import { AppMode, KeywordMapping } from './types';

export const GP_CAPABILITIES = [
  "Decision-making and Diagnosis",
  "Clinical management",
  "Medical complexity",
  "Team working",
  "Performance, learning and teaching",
  "Organisation, management and leadership",
  "Holistic practice, health promotion and safeguarding",
  "Community health and environmental sustainability",
  "Fitness to practise",
  "An Ethical Approach",
  "Communicating and Consulting",
  "Data gathering and interpretation",
  "Clinical examination and procedural skills"
];

export const HOSPITAL_CAPABILITIES = [
  "Communication",
  "Analysis",
  "Empathy & Support",
  "Objectivity",
  "Ethical Understanding"
];

// Phase 1: Simple keyword scoring mapping
export const KEYWORD_MAPPINGS: KeywordMapping[] = [
  {
    keywords: ["discussed", "explained", "consent", "relative", "sbar"],
    capabilities: ["Communicating and Consulting", "Communication"]
  },
  {
    keywords: ["reviewed bloods", "ct", "ecg", "differential", "diagnosis"],
    capabilities: ["Decision-making and Diagnosis", "Data gathering and interpretation", "Analysis"]
  },
  {
    keywords: ["antibiotics", "iv", "analgesia", "fluids", "discharge", "follow-up"],
    capabilities: ["Clinical management"]
  },
  {
    keywords: ["capacity", "dnacpr", "confidentiality", "safeguarding"],
    capabilities: ["An Ethical Approach", "Fitness to practise", "Holistic practice, health promotion and safeguarding", "Ethical Understanding"]
  },
  {
    keywords: ["handover", "mdt", "nurse", "physio", "on-call"],
    capabilities: ["Team working"]
  }
];

export const SYSTEM_INSTRUCTION = `You are an assistant that helps clinicians draft appraisal-ready summaries and reflections from clinical notes. Do not provide medical advice. Do not invent details. If information is missing, make safe, generic placeholders like “[add detail]”. Output must be concise, professional, and suitable to paste into an appraisal portfolio.`;

export const SUBSCRIPTION_TIE_PRICE = "£10";
