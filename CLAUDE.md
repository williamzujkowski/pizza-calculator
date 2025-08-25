# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pizza Calculator for IT Engineers - A humorous yet functional web application that calculates pizza requirements for engineering meetings and debugging sessions. This is a client-side only application with no backend dependencies.

## Architecture

### Tech Stack
- **Frontend Only**: Pure HTML5, CSS3, and Vanilla JavaScript
- **No Build Tools**: Direct browser execution, no compilation/transpilation needed
- **No Package Manager**: No npm/yarn dependencies
- **Deployment**: GitHub Pages static hosting

### File Structure
- `index.html` - Main application file (self-contained HTML with embedded CSS and JS references)
- `Pizza_Calculator_for_IT_Engineers.html` - Alternate version (appears to be similar/duplicate)
- `pizza_calc.js` - Main JavaScript logic (large file ~41KB)
- `README.md` - Project documentation
- `SECURITY.md` - Security policy

### Key Application Components

**JavaScript Architecture (pizza_calc.js):**
- IIFE (Immediately Invoked Function Expression) pattern for encapsulation
- DOM element caching for performance optimization
- LocalStorage integration for user preferences
- Debouncing for input handling
- Multiple calculation modes (standard, quantum, blockchain, etc.)

**CSS Architecture (embedded in HTML):**
- CSS custom properties for theming
- Dark mode support
- "Vibe mode" with animated gradients
- Responsive design with mobile-first approach
- Terminal-inspired UI elements

## Development Commands

### Running the Application
```bash
# Open directly in browser (no server required)
open index.html

# Or use any static file server
python3 -m http.server 8000
# Then navigate to http://localhost:8000
```

### Testing Changes
Since this is a pure frontend application:
1. Make changes to files
2. Refresh browser to see updates
3. Check browser console for JavaScript errors
4. Test responsive design with browser DevTools

### Git Workflow
```bash
# Check current status
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Description of changes"

# Push to GitHub (deploys automatically to GitHub Pages)
git push origin main
```

## Important Notes

- **No Linting/Build Tools**: There's no eslint, prettier, or build process. Ensure JavaScript syntax is valid before committing.
- **Browser Compatibility**: Application uses modern JavaScript features - test in recent browser versions.
- **GitHub Pages**: The main branch deploys automatically to https://williamzujkowski.github.io/pizza-calculator/
- **Large JS File**: `pizza_calc.js` is quite large (~41KB). When modifying, be mindful of file organization and consider performance implications.

<!-- START: HUMOR-AND-ATTITUDE-PROFILE v1 -->
# Humor & Attitude Profile (Pizza-Calculator Edition)

**Mission:** Inject personality that's *funny, feral, and helpful*—without compromising clarity or accessibility. Comedy is opt-in, never blocking.

## Voice pillars
- **Blunt + competent:** say the quiet part out loud, then give the fix.
- **Deadpan absurdism:** strange, specific, never mean to the user.
- **Clarity > comedy:** jokes end where comprehension begins.
- **Accessible by default:** plain language, readable, screen-reader friendly.

## Tone Modes (the "Chaos Dial")
Use these modes across copy, tooltips, and banners. Default to **Sane** in docs unless a section is explicitly marked "Playful".

| Mode       | Use When                                 | Style & Examples                                                   |
|------------|-------------------------------------------|--------------------------------------------------------------------|
| **Sane**   | Core guidance, errors, compliance, legal  | Straight. "Enter guest count." "Calculation complete."             |
| **Party**  | Examples, success toasts, section intros  | Light snark. "Crunching numbers. And crusts."                      |
| **Unhinged** | Optional gags & asides (never errors)   | Feral one-liners. "Running pineapple referendum…" "Commit budgetary misconduct." |

> **Rule:** Errors, warnings, and required steps **MUST use Sane**. Humor is allowed in success toasts, empty states, and optional asides.

## Microcopy Do/Don't
**Do**
- Be clear and brief first; put jokes at the end of sentences or in parentheses.
- Offer outcomes, not vibes: tell users what to do next.
- Prefer concrete nouns/verbs; avoid jargon.
**Don't**
- Joke in error messages or when asking for sensitive inputs.
- Add humor to headings needed for navigation.
- Use sarcasm at the user's expense.

## Copy bank (examples)
Use or remix; keep lines ≤ 80 chars; wrap at word boundaries.

### Empty states
- "Tell me two numbers: people, and how unhinged we should get."
- "If it's just you, own it. We'll be discreet."

### Success toasts
- "Optimal plan ready. We minimized regret and grease."
- "Treaty reached on toppings. No casualties reported."

### Progress/trackers (non-blocking)
- "Calibrating grease coefficient…"
- "Arguing 18″ vs two 12″… still friends (barely)."
- "Summoning Costco aunt…"

### Tooltips
- Pineapple: "Enables diplomacy layer (adds 1 extra pie for faction split)."
- Hunger: "LAN Party = assume nobody ate."

## Accessibility & inclusivity
- Plain language; write for broad reading ages.
- Don't hide required info inside jokes.
- Provide meaningful alt text if images are used.
- Respect all diets and cultures in examples; punch up, never down.

## Implementation notes for editors (you, future Claude)
1) Keep existing sections intact. Append playful examples under "Examples"/"Usage".
2) When adding new examples, tag them with `<!-- tone:party -->` or `<!-- tone:unhinged -->`.
3) Never alter "Error Handling", "Security", "Compliance", or "Requirements" sections except to clarify.
4) If a joke conflicts with clarity, delete the joke.

## Maintainer knobs (optional)
- `humor.enabled`: true|false (default true)
- `humor.mode`: sane|party|unhinged (default sane in docs)
- `humor.maxLength`: 80

<!-- END: HUMOR-AND-ATTITUDE-PROFILE v1 -->