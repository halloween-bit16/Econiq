# Econiq – Policy Impact Simulator

Econiq is an interactive, web-based policy simulation platform designed to help students, early professionals, and small business owners understand how Indian tax and policy decisions affect their real financial outcomes.

Instead of static calculators or complex policy documents, Econiq translates government policies into clear, visual, and personalized simulations.

## 🧠 Problem Statement

Government policies such as income tax regimes, GST rules, and startup incentives significantly impact personal income and business profitability.  
However, these policies are often:
- Complex and jargon-heavy  
- Spread across PDFs and official portals  
- Difficult to translate into real-world financial impact  

As a result, users struggle to understand **which policies apply to them and how different choices affect their finances**.

## 💡 Solution Overview

Econiq bridges this gap by providing:
- Interactive simulations instead of static calculations  
- Personalized outputs based on user inputs  
- Clear visualizations that explain outcomes in simple terms  

Users can explore policy scenarios, compare options, and understand their financial impact without requiring prior financial expertise.

## ✨ Key Features

- **Income Tax Simulator**  
  Compare Old vs New Tax Regime using slab-based calculations and visual breakdowns.

- **GST Impact Calculator**  
  Understand GST applicability, pricing impact, and cash flow effects based on turnover and GST rates.

- **GST Composition Scheme Analyzer**  
  Compare Regular GST vs Composition Scheme eligibility and tax impact for small businesses.

- **Startup India (Section 80-IAC) Simulation**  
  Visualize tax savings from startup tax exemptions based on profit and years since incorporation.

- **Visual Dashboards**  
  Charts, comparisons, and summaries that make policy impact easy to understand.

- **Real ₹ Impact**  
  Outputs focus on actual monetary outcomes such as tax payable, savings, and take-home income.

## 🔍 How It Is Different from Existing Solutions

| Existing Solutions | Econiq |
|-------------------|--------|
| Static tax calculators | Interactive policy simulations |
| Generic rules applied to all users | Personalized, eligibility-aware calculations |
| Policy PDFs | Visual charts and comparisons |
| Numbers without context | Explained real-world impact |
| Compliance-focused | Understanding-focused |

## 🏗️ System Architecture (High-Level)

1. User inputs financial details via the web interface  
2. Inputs are processed through a rule-based policy engine  
3. Policy logic applies eligibility checks, slabs, and thresholds  
4. Results are computed and formatted  
5. Visualizations are rendered in real time  

The system is fully client-side, prioritizing transparency and explainability.

## 🛠️ Tech Stack

### Frontend
- React.js  
- Next.js  
- Tailwind CSS  

### Visualization
- Chart.js / Recharts  

### Logic
- Rule-based JavaScript policy engine  
- Static policy data (tax slabs, thresholds, eligibility rules)

### Deployment
- Netlify  

### Version Control
- Git & GitHub  

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (v18 or above recommended)
- npm / yarn / pnpm

### Installation
git clone https://github.com/your-username/econiq.git
cd econiq
npm install

## ▶️ Run Locally
npm run dev

## Open at:
https://econiq.netlify.app/

## ⚠️ Assumptions & Disclaimer

- All calculations use simplified economic models for educational purposes  
- Results are illustrative and do not constitute financial advice  
- Actual tax liability may vary based on individual circumstances and legal interpretations  
- Users should consult a qualified tax professional for real financial decisions

## 📌 Future Scope
- Backend integration for real-time policy updates
- User accounts and saved simulations
- Expanded policy coverage (state-level incentives, subsidies)
- Advanced scenario comparison and recommendations

## 👥 Team
Built by Team Biryani for Finhack 2025.

## 📄 License
This project is intended for educational use only.
