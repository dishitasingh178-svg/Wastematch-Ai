# ♻️ WasteMatch AI  

### AI-Powered Industrial Resource Marketplace

**WasteMatch AI** is an AI-powered industrial resource marketplace that connects businesses generating industrial waste with facilities that can reuse those materials.

Instead of treating industrial by-products as waste, WasteMatch identifies **potential reuse opportunities**, evaluates compatibility, considers distance, capacity, contamination, safety, economic value, and environmental impact, and presents users with explainable matches.

> **Turning industrial waste into valuable resources.**

---

## 👥 Team

### Team GROK IS THIS TRUE

* **Vishesh Agrawal**
* **Dishita Singh**
* **Akshra Srivastava**
* **Akshara Singh**

---

## 🌍 The Problem

Industries generate large quantities of materials that are often treated as waste even though they may still have significant value.

At the same time, another industry may require those exact materials as raw inputs.

This creates a disconnect:

```text
Industry A
Generates Material
       ↓
     WASTE ❌
       ↓
 Disposal / Storage

While...

Industry B
Needs Material
       ↓
Buys New Raw Material
       ↓
Higher Cost + More Resources
```

The problem is not always that the material has no value.

The problem is **finding the right match**.

---

## 💡 Our Solution

WasteMatch AI creates a digital marketplace for industrial resource exchange.

It analyzes available materials and potential facilities to identify where a waste stream could potentially be reused.

The platform considers multiple real-world constraints rather than matching businesses based only on material names.

### WasteMatch evaluates:

* ♻️ Material compatibility
* 🧪 Contamination tolerance
* 📦 Quantity and daily throughput
* 🏭 Facility capacity
* 📍 Geographic distance
* 🛡️ Hazardous-material safety
* 💰 Potential economic value
* 🌱 Potential CO₂ offset

This allows the platform to produce **practical and explainable matches** rather than simple keyword-based recommendations.

---

# 🚀 How WasteMatch AI Works

## 1. Add Industrial Material

A waste-generating business provides information about the available material.

Depending on the workflow, this can include:

* Material name
* Quantity
* Location
* Contamination information
* Availability
* Relevant material characteristics

The system uses this information as the basis for finding potential reuse opportunities.

---

## 2. Material Understanding

WasteMatch uses **Google Gemini** to understand and process material information.

The AI can handle variations in terminology and normalize material names so that semantically related materials can be considered during matching.

For example, different ways of describing a material do not have to be treated as completely unrelated inputs.

This makes the matching process more flexible than a simple exact-text search.

---

## 3. Compatibility Analysis

The platform evaluates whether a material is suitable for a potential receiving facility.

Compatibility can depend on several factors, including:

* Material type
* Required material
* Contamination limits
* Quantity requirements
* Facility capacity
* Processing requirements

A potential match is therefore evaluated using **multiple constraints simultaneously**.

---

## 4. Geographic Matching

Location matters when dealing with industrial materials.

Transporting a material over extremely large distances may make an otherwise technically suitable match impractical.

WasteMatch therefore considers the geographic distance between the material source and potential receiving facility.

The application uses **Haversine distance calculation** to estimate the distance between locations.

```text
Material Source
      │
      │ Geographic Distance
      ▼
Potential Facility
```

Distance can then contribute to the ranking of potential matches.

---

## 5. Hazardous Material Safety Gating 🛡️

Safety is an important part of industrial resource exchange.

WasteMatch includes a safety layer that prevents hazardous material streams from being automatically matched with facilities that are not equipped or intended to handle them.

The system separates hazardous and non-hazardous scenarios before allowing unsuitable recommendations.

This helps prevent potentially unsafe matches from appearing in the results.

---

## 6. Match Ranking

After evaluating compatibility, the system ranks potential matches.

Rather than using a single variable, WasteMatch considers multiple factors together:

```text
Material Compatibility
        +
Contamination Compatibility
        +
Quantity / Capacity
        +
Geographic Distance
        +
Economic Potential
        +
Environmental Impact
        ↓
   Match Ranking
```

This produces a more useful shortlist of potential industrial matches.

---

# 🔎 "Why Matched?"

One of the key features of WasteMatch AI is **explainable matching**.

The platform doesn't simply tell a user:

> "This facility is a match."

It provides factual reasons explaining **why** the match was recommended.

These reasons can include:

* Material compatibility
* Exact or estimated distance
* Contamination allowance
* Daily throughput
* Facility capacity
* Net economic margin
* Potential CO₂ offset

This makes the recommendation easier for businesses to understand and evaluate.

---

# 💰 Economic & Environmental Insights

WasteMatch goes beyond finding a potential buyer.

For suitable matches, the platform can provide insights into the potential value created by redirecting industrial material toward productive reuse.

### Economic Perspective

A material that would otherwise require disposal may represent a potential revenue opportunity for its generator.

At the same time, a receiving facility may reduce its need to source virgin or alternative raw materials.

### Environmental Perspective

Reusing industrial by-products can potentially reduce:

* Waste sent for disposal
* Demand for new raw materials
* Unnecessary transportation
* Associated emissions

WasteMatch therefore highlights potential **CO₂ offset and resource-utilization benefits** alongside the match.

---

# 🧪 Example

Consider a steel manufacturing facility producing **steel slag**.

Instead of treating the steel slag simply as waste:

```text
Steel Manufacturer
       │
       │ Steel Slag
       ▼
  WasteMatch AI
       │
       ├── Material Compatibility
       ├── Contamination Check
       ├── Quantity Check
       ├── Facility Capacity
       ├── Distance
       ├── Economic Value
       └── CO₂ Impact
       │
       ▼
Potential Cement Industry Match
```

WasteMatch can identify a potential cement-related reuse opportunity and explain why that facility is a suitable candidate.

The result is a shift from:

**Waste → Disposal**

to:

**Waste → Resource → Potential Value**

---

# ✨ Key Features

### 🤖 AI-Powered Matching

Uses Google Gemini to understand materials and assist with intelligent matching.

### 🔍 Material Normalization

Handles material terminology and synonyms to improve matching accuracy.

### 🧪 Contamination-Aware Matching

Considers whether contamination levels are acceptable for a potential receiving facility.

### 📦 Capacity & Throughput Analysis

Considers available quantity, required quantity, facility capacity, and daily throughput.

### 📍 Distance-Based Matching

Uses geographic distance to make matches more practically relevant.

### 🛡️ Hazardous Material Safety Gating

Automatically filters unsafe hazardous-to-non-hazardous facility matches.

### 📊 Match Ranking

Ranks potential matches using multiple compatibility and business factors.

### 💡 Explainable AI

Provides factual **"Why Matched?"** reasoning instead of unexplained recommendations.

### 💰 Economic Insights

Estimates potential economic value and net economic margin for suitable matches.

### 🌱 Environmental Insights

Provides potential CO₂ offset information associated with resource reuse.

### 🚫 No-Match Handling

If no suitable facility satisfies the required constraints, the system can clearly return a no-match result instead of forcing an unsuitable recommendation.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React UI        │
                    │     TypeScript       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │        Vite          │
                    │   Frontend Runtime   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Node.js Server   │
                    │    Server-side AI    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Google Gemini     │
                    │       API            │
                    │  + Gemini Vision     │
                    └──────────┬───────────┘
                               │
                               ▼
              ┌─────────────────────────────────┐
              │       Matching Engine           │
              │                                 │
              │ • Material Compatibility        │
              │ • Synonym Normalization         │
              │ • Contamination Analysis        │
              │ • Capacity Analysis             │
              │ • Distance Calculation          │
              │ • Safety Filtering              │
              │ • Match Ranking                 │
              │ • Economic Analysis             │
              │ • CO₂ Impact                    │
              └────────────────┬────────────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Match Results      │
                    │                      │
                    │ • Ranked Matches     │
                    │ • Why Matched?       │
                    │ • Economic Insights  │
                    │ • CO₂ Insights       │
                    └──────────────────────┘
```

---

# 🛠️ Tech Stack

| Technology            | Purpose                                         |
| --------------------- | ----------------------------------------------- |
| **React**             | Frontend application and UI                     |
| **TypeScript**        | Type-safe application development               |
| **Vite**              | Development server and production build tooling |
| **Node.js**           | Server-side application layer                   |
| **Google Gemini API** | AI-powered material understanding and matching  |
| **Gemini Vision API** | Vision-based AI analysis                        |
| **CSS**               | Application styling and responsive UI           |

---

# 📁 Project Structure

```text
Wastematch-Ai/
│
├── data/
│
├── src/
│   ├── ai/
│   ├── components/
│   ├── data/
│   ├── matching/
│   └── server/
│
├── tests/
│
├── App.tsx
├── main.tsx
├── types.ts
├── index.css
│
├── server.ts
├── vite.config.ts
├── tsconfig.json
├── package.json
├── metadata.json
├── index.html
├── .env.example
└── README.md
```

---

# 🔐 AI & API Security

The Gemini API is accessed through the server-side layer rather than exposing sensitive API credentials directly in the client application.

Environment variables can be configured using the provided `.env.example` file.

Example:

```text
GEMINI_API_KEY=your_api_key_here
```

**Never commit real API keys or other secrets to GitHub.**

---

# 🧪 Testing & Verification

The application includes automated verification for core matching and AI functionality.

The final project was tested for:

### Linting

```bash
npm run lint
```

### Matching Tests

```bash
npm run test:matching
```

### AI Tests

```bash
npm run test:ai
```

### Production Build

```bash
npm run build
```

The matching test suite verifies areas including:

* Material weights
* Synonym handling
* Contamination
* Capacity
* Haversine distance
* Hazardous-material gating
* Match ranking
* Match breakdowns
* Factual match explanations
* No-match handling

The AI test suite covers:

* Schema normalization
* Prompt engineering
* Stream coverage
* Fallback protection
* Mock execution
* Live Gemini Vision API calls

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have:

* **Node.js**
* **npm**
* A **Google Gemini API key**

---

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/Wastematch-Ai.git
cd Wastematch-Ai
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env.local` file based on `.env.example`.

Add your Gemini API key:

```text
GEMINI_API_KEY=your_api_key_here
```

---

## 4. Start the Application

```bash
npm run dev
```

The Vite development server will start the application locally.

---

## 5. Build for Production

```bash
npm run build
```

---

# 🔄 Complete Workflow

The complete WasteMatch workflow can be summarized as:

```text
        ┌───────────────────────┐
        │ Industrial Material   │
        │       Submitted       │
        └───────────┬───────────┘
                    ↓
        ┌───────────────────────┐
        │ Material Understanding│
        │    & Normalization    │
        └───────────┬───────────┘
                    ↓
        ┌───────────────────────┐
        │ Safety / Hazard Check │
        └───────────┬───────────┘
                    ↓
        ┌───────────────────────┐
        │ Compatibility Analysis│
        └───────────┬───────────┘
                    ↓
        ┌───────────────────────┐
        │ Capacity + Quantity   │
        │      Evaluation       │
        └───────────┬───────────┘
                    ↓
        ┌───────────────────────┐
        │ Distance Calculation  │
        └───────────┬───────────┘
                    ↓
        ┌───────────────────────┐
        │   Match Ranking       │
        └───────────┬───────────┘
                    ↓
        ┌───────────────────────┐
        │ Why Matched? + Impact │
        │       Insights        │
        └───────────┬───────────┘
                    ↓
        ┌───────────────────────┐
        │ Potential Industrial  │
        │       Match ♻️        │
        └───────────────────────┘
```

---

# 🎯 What Makes WasteMatch AI Different?

Traditional waste-management systems often focus on **collection and disposal**.

WasteMatch focuses on **resource discovery and intelligent matching**.

Instead of asking:

> **"How do we get rid of this waste?"**

WasteMatch asks:

> **"Who can use this material?"**

The platform combines AI with real-world constraints such as distance, contamination, capacity, safety, economics, and environmental impact.

This makes the system more than a simple marketplace or keyword search engine.

It is designed as an **AI-assisted industrial symbiosis platform**.

---

# 🌱 Vision

WasteMatch AI envisions an industrial ecosystem where waste streams are connected to the facilities capable of giving them a second life.

```text
        WASTE
          ↓
       MATCH
          ↓
       REUSE
          ↓
       VALUE
          ↓
    LESS WASTE ♻️
```

Our vision is to help industries move toward a **circular economy**, where materials remain useful for longer and resources are not unnecessarily discarded.

---

# 🏆 Project Highlights

* AI-powered industrial resource marketplace
* Explainable AI matching
* Multi-factor compatibility scoring
* Material synonym normalization
* Contamination-aware recommendations
* Capacity and throughput analysis
* Geographic distance calculation
* Hazardous-material safety gating
* Economic value estimation
* CO₂ offset estimation
* Intelligent no-match handling
* Automated matching and AI test suites
* Production build verification

---

## 👥 Team GROK IS THIS TRUW

**WasteMatch AI**

**Vishesh Agrawal • Dishita Singh • Akshra Srivastava • Akshara Singh**

### ♻️ One industry's waste can become another industry's resource.

**WasteMatch AI | Match Waste. Create Value. Build a Circular Future.**
