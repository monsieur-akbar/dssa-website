"use client";

import { useState } from "react";

const ROADMAPS = [
  {
    id: "python",
    title: "Python for Data Science",
    emoji: "🐍",
    color: "from-blue-500 to-cyan-500",
    description: "Master the language of data: syntax, data structures, NumPy, Pandas, and visualization.",
    levels: [
      { name: "Beginner", topics: ["Variables & Types", "Control Flow", "Functions", "Lists & Dicts"], progress: 100 },
      { name: "Intermediate", topics: ["NumPy & Pandas", "Visualization", "OOP Basics", "Error Handling"], progress: 65 },
      { name: "Advanced", topics: ["Decorators", "Async", "Packaging", "Testing"], progress: 20 },
    ],
    resources: ["Python Cheat Sheet", "Intro Workshop Deck", "Practice Datasets"],
  },
  {
    id: "sql",
    title: "SQL & Databases",
    emoji: "🗄️",
    color: "from-emerald-500 to-teal-500",
    description: "Query, join, and transform data. Relational design, window functions, and analytics SQL.",
    levels: [
      { name: "Beginner", topics: ["SELECT & WHERE", "JOINs", "GROUP BY", "Aggregations"], progress: 100 },
      { name: "Intermediate", topics: ["Subqueries", "CTEs", "Window Functions", "Indexes"], progress: 40 },
      { name: "Advanced", topics: ["Query Optimization", "Transactions", "Stored Procedures"], progress: 0 },
    ],
    resources: ["SQL Pattern Notes", "SQL Workshop Slides", "Sample DB Dumps"],
  },
  {
    id: "statistics",
    title: "Statistics & Probability",
    emoji: "📊",
    color: "from-violet-500 to-purple-500",
    description: "Distributions, hypothesis testing, confidence intervals, and Bayesian thinking.",
    levels: [
      { name: "Beginner", topics: ["Descriptive Stats", "Probability Basics", "Distributions"], progress: 90 },
      { name: "Intermediate", topics: ["Hypothesis Testing", "p-values", "Confidence Intervals"], progress: 55 },
      { name: "Advanced", topics: ["Bayesian Stats", "A/B Testing", "Causal Inference"], progress: 10 },
    ],
    resources: ["Stats Formula Sheet", "Hypothesis Testing Deck", "A/B Test Sample Data"],
  },
  {
    id: "ml",
    title: "Machine Learning",
    emoji: "🤖",
    color: "from-orange-500 to-amber-500",
    description: "Classical algorithms to model evaluation: regression, classification, clustering, pipelines.",
    levels: [
      { name: "Beginner", topics: ["Supervised vs Unsupervised", "Linear Regression", "Logistic Regression"], progress: 80 },
      { name: "Intermediate", topics: ["Decision Trees & RF", "SVM", "Feature Engineering"], progress: 45 },
      { name: "Advanced", topics: ["Ensemble Methods", "Hyperparameter Tuning", "Pipelines"], progress: 15 },
    ],
    resources: ["ML Algorithms Summary", "Scikit-learn Workshop", "UCI / Kaggle Starter Sets"],
  },
  {
    id: "dl",
    title: "Deep Learning",
    emoji: "🧠",
    color: "from-rose-500 to-pink-500",
    description: "Neural networks, CNNs, RNNs/Transformers, and practical training with PyTorch.",
    levels: [
      { name: "Beginner", topics: ["Perceptron & MLP", "Activation Functions", "Backprop Intuition"], progress: 70 },
      { name: "Intermediate", topics: ["CNNs", "RNNs & LSTMs", "Transfer Learning"], progress: 30 },
      { name: "Advanced", topics: ["Transformers", "Attention", "Fine-tuning"], progress: 5 },
    ],
    resources: ["NN Architecture Notes", "PyTorch Intro Deck", "Image / Text Mini Datasets"],
  },
  {
    id: "genai",
    title: "Generative AI",
    emoji: "✨",
    color: "from-indigo-500 to-blue-600",
    description: "LLMs, prompt engineering, RAG, fine-tuning, and building useful AI applications.",
    levels: [
      { name: "Beginner", topics: ["What are LLMs?", "Prompt Engineering", "Chat Completions"], progress: 85 },
      { name: "Intermediate", topics: ["Embeddings", "RAG Pipelines", "Vector DBs"], progress: 50 },
      { name: "Advanced", topics: ["Fine-tuning", "Evaluation", "Ethics & Governance"], progress: 10 },
    ],
    resources: ["Prompt Patterns Guide", "RAG Workshop Deck", "Sample RAG Corpus"],
  },
];

const LEVEL_STYLES = {
  Beginner: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Intermediate: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Advanced: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

function RoadmapCard({ roadmap }) {
  const [expanded, setExpanded] = useState(false);
  const overall = Math.round(roadmap.levels.reduce((s, l) => s + l.progress, 0) / roadmap.levels.length);

  return (
    <div className="bg-slate-900/80 border border-slate-700 rounded-2xl overflow-hidden hover:border-slate-500 transition-all">
      <div className={`h-1.5 bg-gradient-to-r ${roadmap.color}`} />
      <div className="p-5">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{roadmap.emoji}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">{roadmap.title}</h3>
            <p className="mt-1 text-sm text-slate-400 leading-relaxed">{roadmap.description}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-slate-500 uppercase">Overall</span>
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-slate-400 to-white rounded-full" style={{ width: `${overall}%` }} />
          </div>
          <span className="text-sm font-semibold text-slate-300">{overall}%</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {roadmap.levels.map((level) => (
            <span key={level.name} className={`px-2.5 py-1 rounded-full text-xs font-medium border ${LEVEL_STYLES[level.name]}`}>
              {level.name} · {level.progress}%
            </span>
          ))}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-sm text-slate-400 hover:text-white transition-colors"
        >
          {expanded ? "Hide topics ▲" : "View roadmap topics ▼"}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3 border-t border-slate-800 pt-3">
            {roadmap.levels.map((level) => (
              <div key={level.name}>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-1.5">{level.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {level.topics.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-slate-800 text-xs text-slate-300 border border-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-xs text-slate-500 uppercase mb-2">Resources</p>
          <div className="flex flex-wrap gap-2">
            {roadmap.resources.map((r) => (
              <span key={r} className="text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer">
                📄 {r}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Learning() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-indigo-400 text-sm font-medium mb-2">Education & Career</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Curated Learning Roadmaps</h1>
          <p className="mt-3 max-w-2xl text-slate-400 text-base leading-relaxed">
            Structured paths from fundamentals to advanced topics. Track your level and explore notes, workshop decks, and practice datasets — curated by DSSA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ROADMAPS.map((r) => (
            <RoadmapCard key={r.id} roadmap={r} />
          ))}
        </div>
      </div>
    </div>
  );
}