# Vanguard AI: Autonomous Investment Research Agent

Vanguard AI is a premium, autonomous, multi-agent investment research platform designed to automate fundamental analysis, market sentiment tracking, and risk assessment for target assets. 

Developed as part of the **InsideIIM × Altuni AI Labs** Product Development Engineer Take-Home Assignment, Vanguard AI features a sleek, Bloomberg-terminal-inspired dark UI/UX that streams real-time agent execution traces and aggregates financial health indicators, sentiment metrics, and qualitative SWOT profiles.

---

## 🚀 Overview

Vanguard AI features a multi-tiered architecture that includes:
- **Interactive Landing Page**: The default home interface prior to authentication. It features a fully simulated, live-updating terminal mock showing agent research flows in action, preset assets preview tables, and client-side data safety highlights.
- **Enhanced Authentication Gate**: An authorization panel supporting instant toggle tabs for **Sign In** and **Sign Up** flows, along with a "Back to Home" navigation link to return to the landing page.
- **Dynamic Dual-Theme Styling**: Support for seamless switching between a Bloomberg-inspired dark mode (deep crimson/wine backgrounds with glowing borders) and a premium light mode (warm beige layouts with dark maroon branding) across all landing pages and terminal dashboards.

Once logged in, Vanguard AI takes a company name (e.g., Apple, NVIDIA, Tesla) and deploys a coordinated pipeline of specialized sub-agents:
1. **Web Search Agent**: Queries Tavily Search to gather the latest financial releases, news articles, and macroeconomic contexts.
2. **Financial Analysis Agent**: Gathers core ratios (P/E, margins, debt-to-equity) and calculates insolvency benchmarks such as the **Altman Z-Score**.
3. **Sentiment Analysis Agent**: Classifies media headlines and analyst reports to output an aggregate Bullish/Bearish/Neutral dial.
4. **Thesis Synthesis Agent**: Reconciles the qualitative and quantitative insights, constructs a risk matrix, and issues a final **INVEST** or **PASS** recommendation.

---

## 🛠️ How to Run It

### Prerequisites
- Node.js (v18.0 or later, v25 recommended)
- npm (v10 or later)

### Setup Steps
1. **Extract/Clone the repository**:
   Navigate into the project root directory.

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and add your API keys:
   ```env
   OPENAI_API_KEY=sk-proj-...  # Required for live runs (or GEMINI_API_KEY)
   GEMINI_API_KEY=AIzaSy...    # Optional: Alternative LLM
   TAVILY_API_KEY=tvly-...     # Optional: For real-time web search
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Sandbox Mode (No API Keys Required)**:
   If no API keys are configured, Vanguard AI automatically initiates **Sandbox Mode**. This utilizes pre-loaded fundamental models for popular stocks (Apple, NVIDIA, Tesla, Reliance Industries) and custom simulation rules, allowing full review of the live log streaming and dashboard rendering out-of-the-box.

---

## 🧠 How It Works: Approach & Architecture

Vanguard AI is built around a **Server-Sent Events (SSE)** streaming architecture to provide a real-time terminal window into the AI's thoughts.

```
[User UI Dashboard] 
       │ 
       ▼ (POST request with target company & API Keys)
[src/app/api/research/route.ts] ───► Streams live sub-agent logs via SSE
       │
       ├─► [WebSearchAgent] ────► Tavily API (Latest news & statements)
       ├─► [FinancialAgent] ───► Valuation metrics and Altman Z-Score
       ├─► [SentimentAgent] ───► Classifies news headlines & reports
       └─► [ThesisAgent] ──────► LangChain LLM (gpt-4o-mini / gemini-1.5-flash)
                                     │
                                     ▼ (Strict JSON Schema Parser)
                               Returns complete Dashboard + Thesis Report
```

### Key Modules:
- **Client Page (`src/app/page.tsx`)**: Manages the application lifecycle and utilizes a low-overhead stream decoder to parse incoming server logs line-by-line without causing UI freezes.
- **Backend Stream Controller (`src/app/api/research/route.ts`)**: Initializes a `ReadableStream` that hooks into LangChain call handlers and streams live traces.
- **Vanilla CSS Engine (`src/app/globals.css`)**: Provides standard modular stylesheets with custom animations, dial rotation handlers, and a specialized `@media print` stylesheet that formats the final PDF report for download.

---

## ⚖️ Key Decisions & Trade-Offs

### 1. Framework: Next.js App Router (React)
- **Why**: Allows combining both backend API endpoints and frontend components in a single, deployable repository. The App Router provides built-in streaming support, which is critical for Server-Sent Events (SSE).
- **Trade-Off**: Higher complexity in typescript compilation, but results in a single production bundle.

### 2. Styling: Vanilla CSS vs Tailwind CSS
- **Why**: Used Custom Vanilla CSS variables for layout and gauges, while preserving standard utility frameworks. This allows exact pixel-perfect control over complex radial speedometer gauges, custom risk matrix layout, and print media outputs.
- **Trade-Off**: Writing CSS modules takes longer, but prevents template looks and provides a unique design.

### 3. Key Missing Feature: Live SEC Edgar API Integration
- **Why it was left out**: Integrating direct SEC SEC-Edgar APIs requires strict corporate headers, user-agents, and presents high latency. Instead, we used **Tavily Search** to extract financial snippets and combined it with LLM retrieval, which is significantly faster and more resilient.

---

## 📊 Example Runs

### 1. Apple Inc. (AAPL)
- **Verdict**: **INVEST**
- **Altman Z-Score**: 7.84 (Deep Safe Zone)
- **Bullish Sentiment**: 75%
- **Core Thesis**: Apple Intelligence launches trigger a major hardware refresh supercycle. Fortified services margins offset hardware saturation.
- **Key Risk**: Antitrust litigation from US DOJ and EU regulators.

### 2. Tesla Inc. (TSLA)
- **Verdict**: **PASS**
- **Altman Z-Score**: 6.22 (Safe Zone)
- **Bullish Sentiment**: 45% (Highly polar)
- **Core Thesis**: While the energy segment scales, auto gross margins are shrinking due to price wars with Chinese manufacturers. A P/E of 74.8x prices in FSD robotaxis which face long timelines.

---

## 🔮 What I Would Improve With More Time

1. **Long-Term Memory / Vector DB**: Cache previously researched companies in a Pinecone vector index to provide comparative sector-level analyses (e.g., comparing Apple directly to Microsoft/Google).
2. **Interactive Charting Engine**: Introduce dynamic canvas charting using `Chart.js` to graph historical stock trends and Z-score shifts over time.
3. **Multi-Agent Collaboration Graphs (LangGraph)**: Move from sequential sub-agent execution to a cyclic graph network where agents can review and challenge each other's outputs (e.g., a "Bear Agent" actively arguing against a "Bull Agent").

---

## 🎁 BONUS: Chat History & Agent Transcript

Per the assignment guidelines, the complete development chat session history is included in this repository under:
👉 **[llm_chat_transcript.jsonl](./llm_chat_transcript.jsonl)**

This contains the raw thoughts, command logs, compile checks, and code modifications from our pair programming session with the AI.
