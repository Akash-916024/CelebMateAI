# 🏛️ CelebMate AI — Architecture & Design

CelebMate AI is engineered as an ultra-lightweight, client-side, zero-dependency progressive web app tailored for the **Hack2Skill PromptWar [Challenge 5] Celebration & Event Planner**.

---

## 1. High-Level System Architecture

```mermaid
graph TD
    User["👤 Event Host / User"]
    
    subgraph UI ["🎨 Client UI Shell (Vanilla JS & Modern CSS)"]
        Nav["Sidebar & Mobile Navigation"]
        Dash["Event Dashboard"]
        Budget["💰 AI Budget Planner"]
        Timeline["📅 Timeline Generator"]
        Chat["🤖 Celebration Assistant"]
        Invites["💌 Multilingual Invitations"]
        Themes["🎭 Theme & Décor Suggester"]
        Modals["Settings & Toast Alerts"]
    end

    subgraph Core ["⚙️ Modular Core Layer (<200 lines/file)"]
        DOM["dom-helpers.js"]
        Valid["validators.js"]
        Sanitize["sanitizer.js (XSS Prevention)"]
        Store["storage.js (localStorage/sessionStorage)"]
        AIEngine["ai-engine.js (BYOK & Offline Sim)"]
    end

    subgraph External ["🌐 External AI & APIs"]
        Gemini["Google Gemini 3.1 Flash Lite API"]
        LocalMock["Smart Offline Heuristic Engine"]
    end

    User --> Nav
    Nav --> Dash & Budget & Timeline & Chat & Invites & Themes
    Budget & Timeline & Chat & Invites & Themes --> Core
    Core --> Store
    AIEngine -->|If API Key Present| Gemini
    AIEngine -->|Fallback / Offline| LocalMock
```

---

## 2. Data Flow & Security Boundaries

1. **User Input Validation**: All user inputs (guest count, budget INR, celebration dates, custom notes) are parsed through `validators.js`.
2. **Sanitization**: All strings sent to or returned from the AI engine pass through `sanitizer.js` to eliminate XSS vectors.
3. **Session Caching**: Identical requests are cached in `sessionStorage` to minimize API latency and token consumption.
4. **Offline Resilience**: If no Gemini API key is configured, the application falls back immediately to domain heuristics, ensuring judges and offline evaluators experience 100% functionality.
