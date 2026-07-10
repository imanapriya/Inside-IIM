import { NextRequest } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Simple sleep utility for simulation delays
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Force dynamic runtime for streaming
export const dynamic = "force-dynamic";

interface ResearchRequest {
  companyName: string;
  useDemo: boolean;
  apiKeys?: {
    openai?: string;
    gemini?: string;
    tavily?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: ResearchRequest = await req.json();
    const { companyName, useDemo, apiKeys } = body;

    if (!companyName) {
      return new Response(JSON.stringify({ error: "Company name is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Set up SSE stream headers
    const headers = {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    };

    const encoder = new TextEncoder();

    // Create readable stream
    const stream = new ReadableStream({
      async start(controller) {
        // Helper function to send log messages
        const sendLog = (message: string, type: "info" | "success" | "warn" | "error" = "info", progress: number) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "log", message, logType: type, progress })}\n\n`)
          );
        };

        // Helper function to send final results
        const sendResult = (data: any) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "result", data })}\n\n`)
          );
        };

        try {
          sendLog(`Initializing Investment Research Agent for "${companyName}"...`, "info", 5);
          await sleep(1000);

          if (useDemo || (!apiKeys?.openai && !apiKeys?.gemini)) {
            // DEMO / SIMULATION MODE (High fidelity, extremely detailed data)
            sendLog(`No API Keys detected or Sandbox Mode enabled. Initializing high-fidelity sandbox agent...`, "warn", 10);
            await sleep(1500);

            sendLog(`[WebSearchAgent] Running Tavily search queries for "${companyName}" financial statements, market reports, and latest news...`, "info", 20);
            await sleep(2000);

            sendLog(`[FinancialAgent] Scraping recent SEC 10-K/10-Q filings, historical stock prices, and income statements...`, "info", 35);
            await sleep(2000);

            sendLog(`[FinancialAgent] Calculating key ratios: Debt-to-Equity, P/E Ratio, Operating Margin, and Return on Equity (ROE)...`, "info", 50);
            await sleep(1500);

            sendLog(`[AnalysisAgent] Computing financial solvency metrics. Altman Z-Score calculated.`, "success", 65);
            await sleep(1500);

            sendLog(`[SentimentAgent] Analyzing social media sentiment, news headlines, and analyst consensus ratings...`, "info", 80);
            await sleep(2000);

            sendLog(`[ThesisAgent] Synthesizing investment recommendation (INVEST / PASS) based on risk matrix and target returns...`, "info", 90);
            await sleep(1500);

            sendLog(`[ThesisAgent] Research analysis complete. Generating final report...`, "success", 100);
            await sleep(1000);

            // Generate realistic mock data based on the company name
            const normalized = companyName.toLowerCase();
            let mockData: any = {};

            if (normalized.includes("apple") || normalized.includes("aapl")) {
              mockData = getMockAppleData();
            } else if (normalized.includes("tesla") || normalized.includes("tsla")) {
              mockData = getMockTeslaData();
            } else if (normalized.includes("nvidia") || normalized.includes("nvda")) {
              mockData = getMockNvidiaData();
            } else if (normalized.includes("reliance") || normalized.includes("ril")) {
              mockData = getMockRelianceData();
            } else {
              mockData = getMockGenericData(companyName);
            }

            sendResult(mockData);
          } else {
            // LIVE AI EXECUTION
            sendLog(`API Keys detected. Bootstrapping LLM & Tool chain...`, "info", 12);
            await sleep(1000);

            let llm: ChatOpenAI | ChatGoogleGenerativeAI;
            if (apiKeys.openai) {
              sendLog(`Instantiating ChatOpenAI (gpt-4o-mini)...`, "info", 20);
              llm = new ChatOpenAI({
                openAIApiKey: apiKeys.openai,
                modelName: "gpt-4o-mini",
                temperature: 0.2,
              });
            } else {
              sendLog(`Instantiating ChatGoogleGenerativeAI (gemini-1.5-flash)...`, "info", 20);
              llm = new ChatGoogleGenerativeAI({
                apiKey: apiKeys.gemini,
                model: "gemini-1.5-flash",
                temperature: 0.2,
              });
            }

            sendLog(`[WebSearchAgent] Querying web search for current information on ${companyName}...`, "info", 35);
            
            // Simple mock tavily call or actual tavily call
            let searchResults = "";
            if (apiKeys.tavily) {
              try {
                const response = await fetch("https://api.tavily.com/search", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    api_key: apiKeys.tavily,
                    query: `${companyName} financial status stock price news recent performance 2026`,
                    search_depth: "advanced",
                    include_answer: true,
                  }),
                });
                const searchJson = await response.json();
                searchResults = searchJson.answer || JSON.stringify(searchJson.results);
                sendLog(`[WebSearchAgent] Tavily search completed successfully. Found recent news and financial statements.`, "success", 50);
              } catch (err: any) {
                sendLog(`[WebSearchAgent] Tavily Search failed (${err.message}). Falling back to LLM built-in knowledge base.`, "warn", 50);
                searchResults = "No real-time search results available. Please run with default knowledge base.";
              }
            } else {
              sendLog(`[WebSearchAgent] Tavily key not provided. Relying on LLM knowledge base for ${companyName} financials and news.`, "warn", 50);
              searchResults = "No real-time search results available. Relying on model knowledge.";
            }

            sendLog(`[AnalysisAgent] Feeding data into LLM. Performing SWOT, financial analysis, risk calculation, and investment synthesis...`, "info", 70);

            const prompt = `You are a Senior Investment Research Analyst. Your task is to perform thorough investment research on "${companyName}" using the provided search results/knowledge base, and make an investment decision: "INVEST" or "PASS".
            
            Search context / Latest info:
            ${searchResults}
            
            You must return a JSON object with EXACTLY the following structure (do not include any markdown backticks in your raw response, return only valid JSON):
            {
              "recommendation": "INVEST" or "PASS",
              "reasoning": "A comprehensive markdown-formatted text explaining the investment thesis. Use headers, bullet points, and clean lists. Highlight financial trends, macroeconomic factors, competitive advantage, and valuation.",
              "metrics": {
                "peRatio": "P/E ratio (e.g. 28.4)",
                "revenueGrowth": "YoY Revenue Growth rate (e.g. +12.5%)",
                "debtToEquity": "Debt to Equity ratio (e.g. 0.85)",
                "profitMargin": "Net Profit Margin (e.g. 18.2%)",
                "altmanZScore": "Altman Z-Score (e.g. 3.45)",
                "marketCap": "Market Capitalization (e.g. $2.85T)"
              },
              "sentiment": {
                "bullish": 70, // percentage of positive sentiment (0-100)
                "bearish": 20, // percentage of negative sentiment (0-100)
                "neutral": 10  // percentage of neutral sentiment (0-100)
              },
              "swot": {
                "strengths": ["list of 3-4 key strengths"],
                "weaknesses": ["list of 3-4 key weaknesses"],
                "opportunities": ["list of 3-4 key opportunities"],
                "threats": ["list of 3-4 key threats"]
              },
              "risks": {
                "high": ["list of high risk items"],
                "medium": ["list of medium risk items"],
                "low": ["list of low risk items"]
              }
            }
            
            Ensure the response is strict JSON. Do not write text before or after the JSON.`;

            sendLog(`[ThesisAgent] Invoking agent core chain...`, "info", 85);
            
            const response = await llm.invoke([
              new SystemMessage("You are a strict financial analysis assistant that output only JSON."),
              new HumanMessage(prompt),
            ]);

            const contentText = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
            
            // Extract JSON if it contains markdown wrappers
            let cleanJsonStr = contentText.trim();
            if (cleanJsonStr.startsWith("```json")) {
              cleanJsonStr = cleanJsonStr.substring(7);
            }
            if (cleanJsonStr.endsWith("```")) {
              cleanJsonStr = cleanJsonStr.substring(0, cleanJsonStr.length - 3);
            }
            cleanJsonStr = cleanJsonStr.trim();

            try {
              const data = JSON.parse(cleanJsonStr);
              sendLog(`[ThesisAgent] Analysis parsed successfully. Compiling dashboard metrics.`, "success", 95);
              await sleep(1000);
              sendLog(`[ThesisAgent] Report generated successfully.`, "success", 100);
              sendResult(data);
            } catch (parseErr: any) {
              sendLog(`[Error] Failed to parse LLM response as JSON. Raw response: ${cleanJsonStr.substring(0, 100)}...`, "error", 95);
              throw new Error("Invalid JSON structure returned by the LLM.");
            }
          }
        } catch (err: any) {
          sendLog(`[Fatal] Agent workflow crashed: ${err.message}`, "error", 100);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, { headers });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ==========================================
// HIGH FIDELITY MOCK DATA GENERATORS
// ==========================================

function getMockAppleData() {
  return {
    recommendation: "INVEST",
    metrics: {
      peRatio: "32.4",
      revenueGrowth: "+8.7% YoY",
      debtToEquity: "1.42",
      profitMargin: "26.3%",
      altmanZScore: "7.84",
      marketCap: "$3.45T",
    },
    sentiment: { bullish: 75, bearish: 15, neutral: 10 },
    swot: {
      strengths: [
        "Unrivaled brand ecosystem and customer loyalty",
        "Services revenue (iCloud, Apple Pay, Apple Music) provides stable recurring margins",
        "Superior pricing power and supply chain dominance",
        "Enormous cash flows ($110B+ annual free cash flow)"
      ],
      weaknesses: [
        "High dependence on iPhone sales (~50% of total revenue)",
        "Premium pricing makes it vulnerable in developing/emerging markets",
        "Heavy regulatory scrutiny on App Store fees globally",
        "Perceived lag behind competitors in launching core generative AI models on server side"
      ],
      opportunities: [
        "On-device Apple Intelligence driving a major iPhone upgrade supercycle",
        "Expansion of healthcare/fitness tracking hardware and subscription services",
        "Further expansion of manufacturing outside China (India/Vietnam) to de-risk geopolitics",
        "Integration of mixed-reality computing ecosystem (Vision Pro) as it scales down in cost"
      ],
      threats: [
        "Geopolitical tensions between US and China impacting assembly and sales",
        "Anti-trust lawsuits in US and EU targeting ecosystem lock-in",
        "Fierce competition in China from local high-end phone manufacturers like Huawei",
        "Global consumer spending slowdowns impacting high-ticket hardware purchases"
      ]
    },
    risks: {
      high: [
        "Regulatory & Antitrust: EU DMA and US DOJ lawsuits could dismantle the lucrative App Store monopoly."
      ],
      medium: [
        "Supply Chain Geopolitics: Heavy concentration of manufacturing in Greater China region is vulnerable to sudden political disruption."
      ],
      low: [
        "AI Innovation: Risk of falling permanently behind in LLM capabilities (largely mitigated by OpenAI/Google integrations)."
      ]
    },
    reasoning: `### Executive Summary
**Apple Inc. (NASDAQ: AAPL)** represents a high-conviction **INVEST** opportunity. The core thesis centers around the launch of **Apple Intelligence**, which acts as a catalyst for a massive global iPhone upgrade supercycle. While hardware sales have experienced cyclical plateaus, the Services division continues to grow at double-digit rates, offering high-margin recurring income.

### Financial Health Analysis
- **Altman Z-Score of 7.84**: Apple lies deep inside the "Safe Zone" regarding bankruptcy risk, supported by its fortress balance sheet.
- **Operating Leverage**: Despite elevated CapEx for AI infrastructure, Apple's operating margin remains robust at **~30%**, driven by the high-margin Services mix.
- **Capital Returns**: A consistent program of share buybacks ($110B authorized in 2024) and growing dividend payouts continues to create a strong floor for EPS growth.

### Growth Catalysts & Competitive Moat
1. **The Ecosystem Lock-in**: With over **2.2 billion active devices**, Apple's switching costs are incredibly high. Users are highly unlikely to leave the ecosystem due to iCloud and hardware integrations.
2. **On-Device AI Premium**: By restricting Apple Intelligence to newer chips (A17 Pro and M-series), Apple triggers a multi-year hardware refresh cycle, raising the average selling price (ASP).
3. **Services Expansion**: High-margin Services revenue accounts for nearly 25% of total sales, neutralizing hardware seasonality.

### Valuation & Risk Mitigation
At a P/E ratio of **32.4x**, Apple is trading at a premium compared to its historical 5-year average (~26x). However, this premium is justified by its defensive moat, superior cash flow characteristics, and upcoming AI cycle. Risks are primarily regulatory (anti-trust) and geopolitical, both of which are managed through geographical supply chain diversification (e.g., India production scaling to 25%). We recommend a phased accumulation of shares.`
  };
}

function getMockTeslaData() {
  return {
    recommendation: "PASS",
    metrics: {
      peRatio: "74.8",
      revenueGrowth: "+4.2% YoY",
      debtToEquity: "0.08",
      profitMargin: "12.1%",
      altmanZScore: "6.22",
      marketCap: "$820B",
    },
    sentiment: { bullish: 45, bearish: 45, neutral: 10 },
    swot: {
      strengths: [
        "Industry-leading EV production scale and vertical integration",
        "Fortress balance sheet with virtually zero net debt",
        "Pioneering brand in Autonomous Driving and Full Self-Driving (FSD) data collection",
        "Strong growth in Tesla Energy (Megapacks) storage business"
      ],
      weaknesses: [
        "Declining automotive gross margins due to global EV price wars",
        "Aging vehicle lineup (Model 3/Y carry the bulk of sales)",
        "Key-man risk regarding CEO Elon Musk's attention and public image",
        "Poor customer service reputation and repair wait times in multiple regions"
      ],
      opportunities: [
        "Licensing FSD software and software stack to legacy automotive OEMs",
        "Launch of the Next-Generation low-cost vehicle platform (~$25k model)",
        "Mass-market scaling of Optimus Humanoid Robot and Robotaxi network",
        "Accelerating deployment of Grid-scale battery storage (Megapack margins are high)"
      ],
      threats: [
        "Extreme competition from low-cost Chinese EV manufacturers (BYD, Geely, Xiaomi)",
        "Global slowdown in consumer adoption rates of electric vehicles relative to hybrids",
        "Regulatory investigation and legal liabilities arising from Autopilot/FSD safety incidents",
        "Lithium-ion battery materials supply chain constraints or tariff barriers"
      ]
    },
    risks: {
      high: [
        "Margin Compression: Severe pricing pressure from Chinese manufacturers threatens long-term automotive profitability."
      ],
      medium: [
        "Autonomous Driving Timelines: The current valuation relies heavily on FSD becoming a fully autonomous Robotaxi reality, which faces major technical and regulatory hurdles."
      ],
      low: [
        "Balance Sheet Risk: Almost non-existent due to $28B+ in cash reserves."
      ]
    },
    reasoning: `### Executive Summary
**Tesla Inc. (NASDAQ: TSLA)** is currently rated as a **PASS**. While Tesla remains the undisputed leader in Western EV markets and boasts an exceptional balance sheet, the current valuation (**P/E of 74.8x**) is pricing in rapid autonomous driving (FSD) monetization, which is still speculative. Core automotive profit margins have shrunk significantly, and growth has slowed as the market transitions to hybrids.

### The Margin Dilemma
Tesla's automotive gross margin (excluding regulatory credits) has dropped from peak levels of **~30%** down to **~15%** due to aggressive price cuts to maintain volume. Competition in China from BYD and others makes recovery of high vehicle margins unlikely in the near term.

### Valuation and FSD Speculation
At a market cap of over $800B, the market is valuing Tesla as a high-margin AI/robotics company rather than an automotive manufacturer. While the **Tesla Energy** segment (battery storage) is growing rapidly (+100% YoY), it does not yet generate enough cash flow to justify the aggregate valuation.

### Conclusion
We recommend waiting for a more attractive entry price or concrete evidence of FSD software licensing revenues before investing. The current risk-reward profile is skewed to the downside given the high valuation and intense competitive landscape.`
  };
}

function getMockNvidiaData() {
  return {
    recommendation: "INVEST",
    metrics: {
      peRatio: "44.6",
      revenueGrowth: "+112% YoY",
      debtToEquity: "0.15",
      profitMargin: "55.8%",
      altmanZScore: "18.34",
      marketCap: "$3.12T",
    },
    sentiment: { bullish: 82, bearish: 10, neutral: 8 },
    swot: {
      strengths: [
        "Absolute dominance in AI training and inference GPUs (~90% market share)",
        "CUDA software ecosystem creates a massive developer lock-in",
        "Extraordinary net profit margins (exceeding 55%)",
        "Rapid product design cycle (annual cadence from Hopper to Blackwell)"
      ],
      weaknesses: [
        "Customer concentration: Top 4 cloud providers (hyperscalers) represent ~40% of revenue",
        "Vulnerability to TSMC fabrication capacity bottlenecks",
        "Extremely high valuation and growth expectations leave little room for error",
        "Geopolitical restrictions on shipping high-end chips to key markets like China"
      ],
      opportunities: [
        "Unlocking sovereign AI markets (nations building localized data centers)",
        "Expansion into custom silicon design (ASICs) for specific enterprise workloads",
        "Nvidia AI Enterprise software suites providing high-margin recurring software revenues",
        "Growth in industrial robotics and autonomous driving chips (Orin/Thor)"
      ],
      threats: [
        "Hyperscalers (Google, Amazon, Microsoft) developing proprietary AI chips (TPUs, Inferentia)",
        "Potential cyclical downturn in AI infrastructure spending once capacity is built out",
        "Geopolitical conflict over Taiwan interrupting TSMC production",
        "Emergence of viable hardware competitors (AMD's MI300 series or open-source software like ROCm)"
      ]
    },
    risks: {
      high: [
        "Taiwan Geopolitics: 100% of high-end GPU fabrication occurs at TSMC in Taiwan. Any geopolitical event there would halt operations instantly."
      ],
      medium: [
        "AI CapEx Cyclicality: If enterprise adoption of Generative AI does not yield direct ROI, hyperscalers may pause GPU acquisitions."
      ],
      low: [
        "Financial Leverage: Minimal risk. Zero-debt-like structure with massive cash generation."
      ]
    },
    reasoning: `### Executive Summary
**NVIDIA Corporation (NASDAQ: NVDA)** is rated as a strong **INVEST**. NVIDIA is the primary picks-and-shovels beneficiary of the global artificial intelligence infrastructure build-out. Its competitive moat is not just hardware performance, but the **CUDA Software Platform**, which developers have used for 15+ years. 

### Astonishing Financial Metrics
- **55.8% Net Margin**: Unprecedented profitability for a hardware company, showing ultimate pricing power.
- **Altman Z-Score of 18.34**: Represents one of the most financially secure balances in the entire technology sector.
- **PEG Ratio**: Despite the high nominal P/E of 44.6, the growth rate (+112% YoY) makes the PEG ratio extremely reasonable (< 1.0).

### Moat and Software Lock-in
Competitors like AMD and Intel can match chip specifications, but matching CUDA is almost impossible due to developer habits and libraries. Furthermore, NVIDIA's transition to a complete system architect (selling InfiniBand switches, cooling systems, and full supercomputer racks rather than single cards) lock in giant enterprise clients.

### Valuation and Risks
While hyperscaler CapEx sustainability is a valid long-term concern, current demand for the **Blackwell GPU architecture** continues to outstrip supply for the next 12-18 months. Geopolitical risk (Taiwan) is the only major threat, but the risk is shared by the entire global tech sector. We recommend maintaining a large allocation.`
  };
}

function getMockRelianceData() {
  return {
    recommendation: "INVEST",
    metrics: {
      peRatio: "26.8",
      revenueGrowth: "+11.4% YoY",
      debtToEquity: "0.38",
      profitMargin: "9.2%",
      altmanZScore: "3.10",
      marketCap: "₹18.4L Cr",
    },
    sentiment: { bullish: 70, bearish: 15, neutral: 15 },
    swot: {
      strengths: [
        "Diversified giant spanning Retail, Digital Services (Jio), and Oil & Petrochemicals",
        "Jio telecom dominates the Indian digital ecosystem with 450M+ subscribers",
        "Reliance Retail is the absolute largest retailer in India by sales and network",
        "Strong backing and leadership under Mukesh Ambani"
      ],
      weaknesses: [
        "Capital-intensive business requiring continuous massive CapEx",
        "Legacy Oil-to-Chemicals (O2C) margins are highly volatile and subject to global oil cycles",
        "Relatively high gross debt level (offset by liquid assets)",
        "Slower execution in launching new energy (green hydrogen/giga-factories) facilities"
      ],
      opportunities: [
        "Jio financial services spin-off capturing a massive share of Indian fintech market",
        "Expansion of 5G monetization and digital subscriptions (JioCinema, gaming)",
        "Pivoting legacy energy business towards Green Hydrogen, Solar, and Battery gigafactories",
        "Potential public listings of Jio and Reliance Retail unlocking massive shareholder value"
      ],
      threats: [
        "Regulatory changes in Indian telecom or retail laws (e.g. e-commerce regulations)",
        "Prolonged downturn in global refining margins (GRMs)",
        "Aggressive competition from Adani Group in new energy and infrastructure segments",
        "Inflation impacting discretionary consumer spending at Reliance Retail outlets"
      ]
    },
    risks: {
      high: [
        "O2C Cyclicality: Heavy reliance on legacy petrochemical cash flows to fund high-growth telecom/retail projects makes it sensitive to global oil cycles."
      ],
      medium: [
        "Debt Serviceability: High CapEx pipeline requires careful leverage management, though the balance sheet remains strong overall."
      ],
      low: [
        "Digital Disruption: Minimal risk. Jio is the primary market disruptor, not the disrupted."
      ]
    },
    reasoning: `### Executive Summary
**Reliance Industries Limited (NSE: RELIANCE)** is a high-conviction **INVEST** within the Indian equities market. Reliance is a proxy for the Indian consumer growth story. By shifting from a pure oil-and-gas conglomerate to a telecom, retail, and digital powerhouse, Reliance has secured high-growth, high-margin revenue streams.

### Core Moats: Jio & Retail
1. **Reliance Jio**: Jio has built a virtual monopoly in India's digital pipeline. With cheap 5G pricing and a suite of digital applications, Jio is the gatekeeper to India's internet economy.
2. **Reliance Retail**: With over 18,000 stores, it is bigger than the next 5 competitors combined. It leverages a strong supply chain to dominate both offline and online channels.

### Green Energy Transition
Reliance's ₹75,000 Crore investment in clean energy (solar gigafactories, green hydrogen) in Gujarat positions the conglomerate for the next 50 years of energy demand, protecting it from oil asset obsolescence.

### Conclusion
A forward P/E of **26.8x** is highly attractive given the conglomerate's scale and upcoming value-unlocking events (the IPOs of Jio and Retail). We rate Reliance as a core portfolio buy for Indian and emerging market portfolios.`
  };
}

function getMockGenericData(name: string) {
  return {
    recommendation: "PASS",
    metrics: {
      peRatio: "19.5",
      revenueGrowth: "-2.1% YoY",
      debtToEquity: "0.95",
      profitMargin: "6.4%",
      altmanZScore: "1.82",
      marketCap: "$12.5B",
    },
    sentiment: { bullish: 35, bearish: 40, neutral: 25 },
    swot: {
      strengths: [
        "Established presence and name recognition in historical niche market",
        "Moderate cash generation capabilities from legacy operations",
        "Recent restructuring efforts aimed at lowering fixed operating costs"
      ],
      weaknesses: [
        "Sluggish top-line growth and loss of market share to digital disruptors",
        "Relatively low research and development budgets limiting product innovation",
        "Elevated employee turnover in core technical departments"
      ],
      opportunities: [
        "Strategic pivot towards digital subscription services to stabilize income",
        "Potential joint venture or acquisition target for larger competitors",
        "Expanding sales presence in secondary international markets"
      ],
      threats: [
        "Rising interest rates increasing the cost of refinancing outstanding debt",
        "New, agile startups entering the space with superior technology",
        "Increasingly stringent regulatory and compliance costs in key states"
      ]
    },
    risks: {
      high: [
        "Solvency Risk: Altman Z-score of 1.82 is borderline distress, indicating potential liquidity crunches if credit tightens."
      ],
      medium: [
        "Competitive Erosion: Tech obsolescence poses a substantial threat as competitors digitize faster."
      ],
      low: [
        "Operational Risk: Managed well, but limited growth prospects."
      ]
    },
    reasoning: `### Executive Summary
Our analysis of **${name}** yields a **PASS** recommendation. The company displays classic characteristics of a mature legacy business struggling to adapt to modern technology. Declining sales, low margins, and a borderline Altman Z-Score indicate high fundamental risk with insufficient growth catalysts to justify investment at this price.

### Financial and Structural Risks
The Altman Z-Score of **1.82** suggests the company is near the "Grey Zone" for financial distress. The Debt-to-Equity ratio of **0.95** leaves little room for capital expansion without taking on expensive debt.

### Conclusion
Unless the company undergoes a massive strategic pivot or becomes a take-private acquisition target, we recommend passing on this asset and allocating capital to higher-growth, more solvent companies.`
  };
}
