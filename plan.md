# Secret Agent Static Website Plan

This file describes the design and implementation plan for a GitHub Pages static website for **Secret Agent: Field Operations**.

The full game rules should live in `Rules.md` and be linked from the site. Do **not** duplicate the full rules inside the website plan or page content. The website should treat `Rules.md` as the canonical rules source.

---

## 1. Project Goals

The website should:

- Explain the Secret Agent game clearly to new players
- Present the core concept quickly and dramatically
- Link to the full rules in `Rules.md`
- Provide example missions and mission categories
- Support multiple game instances, such as `defcon-2026`, `local-meetup-001`, or `test-game`
- Show per-game dead drops, status, and event-specific information
- Maintain a Hall of Fame for completed games
- Include a static-friendly LLM mission generator
- Be easy to host for free on GitHub Pages
- Be easy to update by editing Markdown, JSON, or YAML files in the repo

---

## 2. Recommended Tech Stack

Use a static site generator that works well with GitHub Pages.

Recommended options:

### Option A: Astro

Best choice for a polished static site.

Pros:
- Fast static output
- Great Markdown support
- Easy routing
- Easy JSON/YAML data imports
- Can add interactive JavaScript components only where needed

Suggested if the site may grow.

### Option B: Jekyll

Most GitHub-native choice.

Pros:
- Built into GitHub Pages
- Markdown-first
- Simple hosting

Suggested if you want minimal build complexity.

### Option C: Plain HTML/CSS/JS

Simplest possible approach.

Pros:
- No framework
- No build step
- Easy to understand

Suggested if the repo should stay extremely lightweight.

## Recommendation

Use **Astro** if you are comfortable with a small build step. Use **Jekyll** if you want the most GitHub Pages-native setup.

This plan assumes an Astro-style structure, but the content model works with Jekyll or plain HTML too.

---

## 3. Proposed Site Map

```text
/
├── index.html                  # Landing page
├── rules/                      # Rules overview page linking to Rules.md
├── examples/                   # Example missions and play stories
├── missions/                   # Mission generator and mission design guide
├── games/                      # Portal for specific game instances
│   ├── index.html              # List of game instances
│   ├── defcon-2026/
│   │   ├── index.html          # Game briefing
│   │   ├── join/               # Mission intake page (QR code landing target)
│   │   ├── dead-drops.html     # Dead drop list
│   │   ├── leaderboard.html    # Optional static leaderboard
│   │   └── status.html         # Active, completed, archived
│   └── test-game/
├── hall-of-fame/               # Completed games and notable agents
├── handler/                    # Handler resources
│   ├── mission-writing.html
│   ├── safety-checklist.html
│   ├── printables.html
│   └── qr-codes.html           # QR code generator for game intake URLs
└── about/                      # Origin, design principles, credits
```

---

## 4. Repository Structure

Recommended repo structure:

```text
secret-agent-site/
├── README.md
├── Rules.md
├── plan.md
├── package.json
├── astro.config.mjs
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── rules.astro
│   │   ├── examples.astro
│   │   ├── missions.astro
│   │   ├── games/
│   │   │   ├── index.astro
│   │   │   ├── [slug].astro
│   │   │   └── [slug]/
│   │   │       └── join.astro     # Mission intake page (QR landing target)
│   │   ├── hall-of-fame.astro
│   │   └── handler/
│   │       ├── mission-writing.astro
│   │       ├── safety-checklist.astro
│   │       ├── printables.astro
│   │       └── qr-codes.astro     # QR code generator for intake URLs
│   ├── components/
│   │   ├── Layout.astro
│   │   ├── MissionCard.astro
│   │   ├── MissionIntake.astro    # QR landing + handle registration flow
│   │   ├── DeadDropList.astro
│   │   ├── GameStatusBadge.astro
│   │   └── LlmMissionGenerator.astro
│   ├── data/
│   │   ├── games.json
│   │   ├── dead-drops.json
│   │   ├── hall-of-fame.json
│   │   ├── mission-examples.json
│   │   └── mission-categories.json
│   └── styles/
│       └── global.css
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 5. Content Strategy

### Landing Page

Purpose: convince visitors they understand the vibe in under 30 seconds.

Suggested sections:

1. Hero section
   - Title: `Secret Agent: Field Operations`
   - Subtitle: `A covert social mission game played in plain sight.`
   - CTA buttons:
     - `Read the Rules`
     - `View Active Games`
     - `Generate Missions`

2. The Pitch
   - Short explanation:
     - You receive a secret mission.
     - You must complete it without revealing you are playing.
     - You collect evidence.
     - Other agents may expose you.

3. How It Works
   - Receive mission
   - Maintain cover
   - Complete objective
   - Submit evidence
   - Avoid exposure

4. Current / Featured Game
   - Show the currently active game instance, if any.

5. Safety Callout
   - Clear note that all missions must be legal, consensual, non-harassing, and venue-safe.

---

## 6. Rules Page

The rules page should reference `Rules.md` as the canonical rules document.

Recommended behavior:

- Render a short summary on the website
- Link to `/Rules.md` or a rendered rules page
- Include a downloadable link if the repo includes printable formats
- Avoid maintaining two separate full copies of the rules

Suggested text:

> The complete rules for Secret Agent are maintained in `Rules.md`. The website summarizes the game for quick onboarding, but `Rules.md` is the canonical source for disputes, scoring, safety rules, and Handler authority.

---

## 7. Examples Page

Purpose: show what good missions feel like without revealing active missions.

Sections:

### Example Mission Cards

Each example should include:

- Mission title
- Category
- Difficulty
- Risk level
- Objective
- Evidence requirement
- Handler notes

Example data shape:

```json
{
  "title": "The Salute Protocol",
  "category": "Social Engineering",
  "difficulty": "Easy",
  "risk": "Low",
  "objective": "Convince three different people to salute you without explaining why.",
  "evidence": "One photo or video showing at least one salute, plus Handler judgment.",
  "handlerNotes": "Best for open social environments. Avoid pressuring people."
}
```

### Example Play Stories

Short fictional or real recaps:

- `The agent who survived the whole conference`
- `The obvious spy who somehow was not exposed`
- `The dead drop that became a trap`

### Mission Anti-Examples

Include examples of missions that should not be used:

- Anything involving touching strangers
- Anything that blocks walkways
- Anything that pressures staff
- Anything sexual, humiliating, discriminatory, illegal, or unsafe

---

## 8. Games Portal

The `/games/` page should list game instances.

Each game instance represents a specific run of Secret Agent.

Examples:

- `defcon-2026`
- `defcon-2027`
- `local-test-001`
- `campus-night-game`
- `private-party-2026-08`

Each game page should support:

- Game title
- Slug
- Status
- Dates
- Location
- Handler name or alias
- Briefing text
- Rules link
- Dead drops
- Optional leaderboard
- Optional Hall of Fame link after completion

Example `games.json`:

```json
[
  {
    "slug": "defcon-2026",
    "title": "Secret Agent: DEF CON 2026",
    "status": "planned",
    "startDate": "2026-08-01",
    "endDate": "2026-08-04",
    "location": "Las Vegas, NV",
    "handler": "Control",
    "briefing": "Field operations will occur throughout the event. Maintain cover. Submit evidence through approved dead drops only.",
    "rulesPath": "/Rules.md",
    "deadDropSet": "defcon-2026",
    "leaderboardEnabled": false
  }
]
```

Game status values:

- `planned`
- `active`
- `paused`
- `completed`
- `archived`

---

## 9. Dead Drops

Dead drops should be stored in a data file so they can be updated per game without editing page code.

Example `dead-drops.json`:

```json
{
  "defcon-2026": [
    {
      "id": "dd-001",
      "name": "The Blue Signal",
      "status": "planned",
      "locationHint": "Near a place where people wait before moving again.",
      "instructions": "Submit evidence by showing the Handler the required photo and saying the passphrase.",
      "passphrase": "The package is light.",
      "availableFrom": "2026-08-01T10:00:00",
      "availableUntil": "2026-08-01T18:00:00",
      "public": true
    }
  ]
}
```

Dead drop status values:

- `planned`
- `open`
- `closed`
- `compromised`
- `retired`

Important design note:

Since this is a static site, do not publish sensitive real-time dead drop information if secrecy matters. For active games, either:

- Publish only vague location hints
- Publish dead drops shortly before use
- Use QR codes or physical cards to reveal exact dead drop instructions
- Keep exact details in a private Handler file not deployed to GitHub Pages

Recommended public fields:

- Name
- Status
- Vague location hint
- Availability window
- Public instructions

Recommended private fields, not deployed:

- Exact location
- Handler contact information
- Backup instructions
- Emergency notes

---

## 10. Mission Intake and Handle Registration

The Mission Intake flow is how players officially join a game instance. It is triggered by scanning a QR code printed or displayed by the Handler.

### QR Code Design

Each game instance has its own intake URL:

```
https://<site>/games/defcon-2026/join
```

The Handler generates a QR code for this URL using the Handler QR tool at `/handler/qr-codes`. The QR code can be printed on cards, displayed on a screen, or embedded in a printed rules handout.

Multiple QR codes can exist for the same game (e.g., placed around the venue). Each points to the same intake URL — the randomization happens client-side.

### Intake Page Flow

When an agent scans the QR code and lands on `/games/[slug]/join`:

1. **Game check** — The page confirms the game is `active`. If `planned`, `paused`, `completed`, or `archived`, a message is shown and no mission is issued.

2. **Mission draw** — A mission is randomly selected client-side from the game's available mission pool (loaded from static JSON). The full mission text is never shown until the handle is registered.

3. **Handle entry** — The agent enters their desired handle. The field should:
   - Reject empty values
   - Enforce a max length (e.g., 24 characters)
   - Disallow handles already taken in this game (checked against a registered handles list)

4. **Mission reveal** — After the agent submits their handle, the full mission briefing is shown once:
   - Mission title (obfuscated or redacted in the UI)
   - Objective
   - Evidence requirement
   - Cover story suggestion
   - Handler contact method for evidence submission

5. **Confirmation** — The agent is reminded to memorize the mission and dismiss the page. The briefing should not persist in the browser after the agent navigates away. A "I have memorized my mission" button dismisses the briefing.

6. **Registration** — The handle + assigned mission are submitted to the registration backend.

### Static vs. Dynamic Registration

Because GitHub Pages is fully static, handle registration requires a decision about the backend:

#### Option A: Handler-Confirmed Registration (Recommended for V1)

The intake page generates a mission and shows the handle entry form, but does **not** submit to a backend. Instead:

- The agent reads their mission briefing
- They show the Handler their screen (or their chosen handle)
- The Handler records the handle manually on a score sheet

Pros: fully static, no server, no accounts, no data privacy concerns  
Cons: requires Handler involvement at intake, doesn't scale for large events

#### Option B: Form Service Registration

Use a third-party form service (Formspree, Netlify Forms, Basin) to capture:

- Game slug
- Agent handle
- Assigned mission ID (not the full text)
- Timestamp

The form submission sends an email or webhook to the Handler.

Pros: no server needed, still static-compatible  
Cons: third-party dependency, mission IDs visible in form payload

#### Option C: Serverless Registration Backend

Use a lightweight serverless function (Cloudflare Workers, Netlify Functions) to:

- Accept handle + mission ID
- Validate uniqueness of the handle
- Store registration in KV or a simple database
- Return a confirmation token to the client

Pros: real uniqueness enforcement, scales to large events, enables real-time leaderboards  
Cons: not pure GitHub Pages, requires a separate deployment

**Recommendation:** Start with Option A for the first game. Upgrade to Option B or C if the event is large enough that Handler confirmation at intake becomes a bottleneck.

### Handle Uniqueness

- Handles must be unique within a game instance.
- In Option A, the Handler enforces uniqueness manually.
- In Options B/C, uniqueness is enforced by the backend before confirming registration.

### Mission Pool Data

Each game instance references a mission pool in its `games.json` entry. The pool is a reference to a set of mission IDs in a separate missions file. The intake page draws randomly from unassigned missions in that pool.

Example addition to `games.json`:

```json
{
  "slug": "defcon-2026",
  "missionPool": "defcon-2026-missions",
  "intakeEnabled": true,
  "intakeBackend": "handler-confirmed"
}
```

Example `missions/defcon-2026-missions.json`:

```json
[
  {
    "id": "m-001",
    "title": "REDACTED",
    "category": "Social Engineering",
    "difficulty": "Easy",
    "objective": "Convince three strangers to salute you.",
    "coverStory": "You're doing a social experiment for a design class.",
    "evidence": "One photo showing at least one salute.",
    "handlerContact": "Submit evidence at the Blue Signal dead drop."
  }
]
```

The `title` field can be displayed as `[REDACTED]` in the UI to preserve mystery, while the `objective` is only revealed after handle registration.

### QR Code Generator (Handler Tool)

The Handler QR tool at `/handler/qr-codes` should:

- Accept a game slug
- Generate a QR code for `/games/[slug]/join`
- Allow download as PNG or SVG for printing
- Show the raw URL for manual sharing

This tool runs entirely client-side using a QR code library (e.g., `qrcode.js`).

---

## 11. Hall of Fame

The Hall of Fame should celebrate completed games and notable accomplishments.

Possible categories:

- Best Cover
- Most Stylish Completion
- Most Spectacular Exposure
- Most Paranoid Agent
- Best Handler Award
- Cleanest Evidence
- Longest Survival
- Best Double Agent
- Most Cinematic Moment

Example `hall-of-fame.json`:

```json
[
  {
    "gameSlug": "defcon-2026",
    "agentName": "Agent Moth",
    "award": "Best Cover",
    "citation": "Completed three missions while convincing everyone they were only looking for stickers.",
    "year": 2026
  }
]
```

Privacy note:

Use aliases by default. Do not publish real names or identifiable photos without consent.

---

## 12. Mission Generator

The site should include an LLM-assisted mission generator, but it should remain compatible with static hosting.

Because GitHub Pages cannot safely store API keys or run private backend logic, there are three recommended implementation paths.

---

### Option A: Prompt-Only Static Generator

Simplest and safest.

The website provides:

- A mission design form
- A generated prompt
- A copy button
- Instructions to paste the prompt into ChatGPT or another LLM

Pros:
- No API key needed
- Works fully static
- No backend
- No cost
- Easy to maintain

Cons:
- User must paste the prompt into an LLM manually

Recommended for version 1.

---

### Option B: Bring-Your-Own-Key Browser Generator

The website includes JavaScript that lets the Handler paste their own API key locally in the browser.

Pros:
- Still static
- No server needed
- More interactive

Cons:
- API keys in browsers are risky
- Users must understand the risk
- Not recommended for public shared devices

Only use this if clearly labeled as experimental.

---

### Option C: External Serverless Function

Use a separate backend such as:

- Cloudflare Workers
- Netlify Functions
- Vercel Serverless Functions

Pros:
- Better API key protection
- Fully interactive

Cons:
- No longer purely GitHub Pages-only
- Requires deployment outside GitHub Pages
- May create cost or maintenance burden

Recommended later, not for the first static release.

---

## 13. Recommended Mission Generator V1

Start with **Option A: Prompt-Only Static Generator**.

The page should ask the Handler for:

- Event type
- Player count
- Mission duration
- Venue constraints
- Difficulty level
- Mission category
- Tone
- Safety strictness
- Evidence type
- Whether counterintel missions are allowed
- Number of missions desired

Then it outputs a prompt like:

```text
You are helping design missions for Secret Agent: Field Operations.

Use the canonical rules from Rules.md as the governing design constraints.

Create [NUMBER] missions for a [EVENT TYPE] with approximately [PLAYER COUNT] players.

Constraints:
- Difficulty: [DIFFICULTY]
- Mission category: [CATEGORY]
- Tone: [TONE]
- Duration target: [DURATION]
- Evidence type: [EVIDENCE TYPE]
- Venue restrictions: [VENUE RESTRICTIONS]
- Counterintel allowed: [YES/NO]

Safety requirements:
- No touching strangers without consent
- No illegal activity
- No harassment
- No sexual, discriminatory, or humiliating content
- No blocking walkways
- No interfering with staff, security, emergency workers, or event operations
- No entering restricted areas
- Missions must be plausibly normal in public

Return each mission in this format:

Mission Title:
Category:
Difficulty:
Risk Level:
Objective:
Cover Story:
Evidence Requirement:
Failure Condition:
Handler Notes:
Safety Check:
```

---

## 14. Mission Generator Output Format

Every generated mission should be structured as:

```text
Mission Title:
Category:
Difficulty:
Risk Level:
Objective:
Cover Story:
Evidence Requirement:
Failure Condition:
Handler Notes:
Safety Check:
```

Optional fields:

```text
Counterintel Hook:
Dead Drop Tie-In:
Scoring Modifier:
Burned-Agent Variant:
```

---

## 15. Mission Categories

The site should define stable mission categories.

Suggested categories:

- Social Engineering
- Stealth Placement
- Collection
- Performance
- Observation
- Misdirection
- Photo Acquisition
- Information Relay
- Dead Drop
- Counterintelligence

Example `mission-categories.json`:

```json
[
  {
    "name": "Social Engineering",
    "description": "Missions that require convincing others to participate in a harmless action without revealing the game."
  },
  {
    "name": "Stealth Placement",
    "description": "Missions that involve placing or positioning a harmless object in a visible location."
  },
  {
    "name": "Counterintelligence",
    "description": "Missions focused on identifying, misleading, or exposing other agents."
  }
]
```

---

## 16. Handler Resources

Create a `/handler/` section with resources for running games.

Pages:

### Mission Writing Guide

Include:

- How to write safe missions
- How to write evidence requirements
- How to tune difficulty
- How to prevent mission leakage
- How to avoid copying existing games too closely

### Safety Checklist

Before approving a mission, the Handler should ask:

- Is this legal?
- Is this safe?
- Is this non-harassing?
- Does it avoid touching strangers?
- Does it avoid humiliating people?
- Does it avoid restricted areas?
- Does it avoid interfering with staff?
- Can it be completed without creating a crowd hazard?
- Is the evidence requirement reasonable?

### Printables

Possible printable files:

- Mission card template
- Handler score sheet
- Dead drop card
- Burned agent card
- Counterintel card
- Quick rules handout

---

## 17. Design Direction

Visual identity:

- Spy dossier
- Field manual
- Classified briefing
- Dead drop notes
- Redacted text
- Minimal noir-inspired interface

Suggested UI elements:

- Black/gray/cream palette
- Monospace accent font
- Redacted labels
- Stamped status badges
- Mission cards that look like briefing cards
- Dead drop cards with status indicators
- “CLASSIFIED” and “BURN NOTICE” visual motifs

Avoid making the site look like a generic party game page. It should feel like an operational field manual.

---

## 18. Static Data Model

Use JSON files for game data.

Data files:

```text
src/data/games.json
src/data/dead-drops.json
src/data/hall-of-fame.json
src/data/mission-examples.json
src/data/mission-categories.json
```

Benefits:

- Easy to update
- Easy to review in pull requests
- No database needed
- Works on GitHub Pages
- Can later migrate to a backend if needed

---

## 19. Updating a Game Instance

To create or update a game:

1. Add a game entry to `src/data/games.json`
2. Add dead drops to `src/data/dead-drops.json`
3. Add optional example missions or event-specific public notes
4. Commit changes
5. Push to GitHub
6. GitHub Pages deploys the updated site

Recommended branch model:

- `main`: deployed public site
- `handler-drafts`: private or protected draft branch for upcoming missions
- Pull request: review dead drops and public information before publishing

---

## 20. Security and Privacy Considerations

Because GitHub Pages is public by default:

Do not commit:

- Real names without consent
- Exact private locations
- Live mission lists that should remain secret
- API keys
- Phone numbers
- Private Handler notes
- Sensitive event security details

Recommended approach:

- Public repo: public rules, examples, archived games, vague dead drop hints
- Private notes: local files, private repo, or printed cards
- Active missions: distributed physically or via controlled channels

---

## 21. MVP Build Plan

### Phase 1: Static Foundation

- Add `Rules.md`
- Add this `plan.md`
- Create landing page
- Create rules summary page linking to `Rules.md`
- Create examples page
- Create mission generator prompt page
- Create games portal using static JSON
- Create dead drops component

### Phase 2: Game Instance Support

- Add `games.json`
- Add `[slug]` game pages
- Add per-game dead drops
- Add status badges
- Add archived/completed game display

### Phase 3: Mission Intake

- Add per-game mission pool JSON files
- Add `/games/[slug]/join` intake page
- Add client-side random mission draw
- Add handle entry form with validation
- Add one-time mission briefing reveal
- Add QR code generator at `/handler/qr-codes`
- Add intake flow to Handler printables

### Phase 4: Handler Tools

- Add mission writing guide
- Add safety checklist
- Add printable templates
- Add mission card generator layout

### Phase 5: Hall of Fame

- Add `hall-of-fame.json`
- Add awards page
- Add archived game recap format
- Add privacy/consent notes

### Phase 6: Optional Interactive Tools

- Add copy-to-clipboard prompt generator
- Add downloadable mission card output
- Consider BYO API key mode only if needed
- Consider external serverless mission generation only if the project outgrows pure static hosting

---

## 22. Suggested First Issues

Create these as GitHub issues:

1. Create Astro or Jekyll site scaffold
2. Add landing page
3. Add rules summary page linking to `Rules.md`
4. Add examples page
5. Add `games.json` and games portal
6. Add `dead-drops.json` and dead drop display
7. Add mission pool JSON and `/games/[slug]/join` intake page
8. Add QR code generator at `/handler/qr-codes`
9. Add Hall of Fame page
10. Add mission generator prompt builder
11. Add Handler safety checklist
12. Add printable mission card template

---

## 23. Definition of Done

The first version is complete when:

- The site deploys on GitHub Pages
- The landing page explains the game clearly
- `Rules.md` is linked as the canonical rules document
- Visitors can view example missions
- Visitors can view a list of game instances
- Each game instance can show dead drops from data
- Each active game instance has a working `/join` intake page reachable by QR code
- Agents can enter a handle and receive a one-time mission briefing
- The Handler QR code generator produces a printable QR for each game
- The Hall of Fame page exists
- The mission generator creates a copyable LLM prompt
- No secrets, API keys, private mission lists, or unsafe details are committed

---

## 24. Future Ideas

Possible future improvements:

- Serverless handle uniqueness enforcement and real-time leaderboard
- Printable mission card generator
- Public “classified broadcast” page for active games
- Evidence submission instructions and form service integration
- Static leaderboard for archived games
- Encrypted dead drop hints
- PWA/offline field manual mode
- Theme variants for different events
- Multiple QR code variants per game (e.g., one per venue area, each seeded to a mission category)
- Agent code name generator as alternative to free-form handle entry
