# Appraise

**AI-assisted appraisal summaries for UK clinicians**

Appraise is a simple web application that helps doctors turn clinical notes or reflections into clear, appraisal-ready summaries. It is designed to save time while maintaining professional standards and clinical responsibility.

---

## Purpose

Completing appraisal documentation is time-consuming. Appraise aims to reduce administrative burden by helping clinicians quickly structure reflections in a format suitable for appraisal and revalidation.

Appraise is an **assistive drafting tool**. It does not provide medical advice and does not replace professional judgement.

---

## Who This Is For

- General Practitioners (GPs)
- Hospital Doctors
- Clinicians completing:
  - Annual appraisal
  - Portfolio reflections
  - PDP entries
  - Supporting information documentation

---

## Core Features

- **Paste → Generate workflow**  
  Paste a clinical note or reflection and generate an appraisal-ready draft.

- **GP / Hospital mode**  
  Toggle between GP and Hospital contexts to tailor the output.

- **Automatic capability linking**  
  Automatically links the three most relevant capabilities, with the option to select manually.

- **Structured output**  
  Outputs follow a consistent appraisal format:
  - Title
  - Summary
  - Reflection (What happened / So what / Now what)
  - Linked capabilities
  - Actions / PDP points

- **Copy-ready results**  
  Output is formatted for easy copying into appraisal systems.

---

## Design Principles

- Clinically appropriate and appraisal-safe
- Minimal and easy to use
- Clear visual hierarchy
- Calm, professional interface
- No unnecessary features or distractions

---

## What Appraise Is Not

- Not a clinical decision support tool
- Not a diagnostic or treatment system
- Not an appraisal submission platform
- Not a replacement for professional judgement

Appraise assists with **writing**, not **decision-making**.

---

## Data & Safety

- Do not enter patient-identifiable information
- All outputs are drafts and must be reviewed by the user
- The clinician remains responsible for accuracy and final submission

---

## Project Status

**Current**
- Single-page app
- GP / Hospital mode toggle
- Auto capability linking
- Appraisal-ready output

**Planned (Appraise Pro)**
- Saved notes
- History and logbook
- Advanced reasoning model
- Subscription model (coming soon)

---

## Typical Tech Stack

- Frontend: React / Next.js
- Styling: Tailwind CSS
- Animations: Framer Motion (minimal use)
- AI: Large language model API
- Hosting: Vercel or equivalent

---

## Local Development

```bash
npm install
npm run dev
