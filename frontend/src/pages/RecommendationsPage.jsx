import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  UserPlus, 
  Users, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Info,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { fetchRecommendations } from '../services/api';

export default function RecommendationsPage({ onOpenCopilot }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSkill, setExpandedSkill] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const data = await fetchRecommendations();
      setRecommendations(data);
      if (data.length > 0) {
        setExpandedSkill(data[0].skill);
      }
    } catch (err) {
      setError(err.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getStrategyBadge = (strat) => {
    switch (strat) {
      case 'HIRE':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HYBRID':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'RESKILL':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'REDISTRIBUTE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500">Synthesizing Hire vs Reskill vs Redistribute tradeoffs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Optimization Recommendations</h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200 rounded-full">
              Explainable Decision Matrix
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Algorithmic comparison of <strong>Hire vs Reskill vs Redistribute</strong> with transparent cost, lead time, and feasibility calculations.
          </p>
        </div>

        <button
          onClick={onOpenCopilot}
          className="flex items-center space-x-2 px-3.5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ask Copilot: "Can we avoid hiring?"</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="bg-brand-900 text-white p-5 rounded-xl border border-brand-800 shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-1">Algorithmic Workforce Resolution Strategy</h2>
            <p className="text-xs text-brand-200 max-w-3xl leading-relaxed">
              Before issuing high-cost external requisitions, the engine checks for internal reallocation candidates and accelerates training for adjacent skills. Only true net deficits with impending contract deadlines are recommended for external recruitment.
            </p>
          </div>
          <div className="hidden lg:flex items-center space-x-4 bg-brand-950/60 px-4 py-2 rounded-lg border border-brand-800 text-xs">
            <div>
              <span className="text-[10px] text-brand-300 uppercase block font-semibold">Active Gaps</span>
              <span className="font-bold text-white text-sm">{recommendations.length}</span>
            </div>
            <div className="h-6 w-px bg-brand-800"></div>
            <div>
              <span className="text-[10px] text-brand-300 uppercase block font-semibold">Avg Savings</span>
              <span className="font-bold text-emerald-400 text-sm">₹45L+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec, idx) => {
          const isExpanded = expandedSkill === rec.skill;

          return (
            <div 
              key={idx}
              className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Card Header */}
              <div 
                onClick={() => setExpandedSkill(isExpanded ? null : rec.skill)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                    <Layers className="w-5 h-5 text-brand-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-sm text-slate-900">{rec.skill}</h3>
                      <span className="text-xs font-mono font-bold text-rose-600">
                        (+{rec.gap_hours} hrs deficit)
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStrategyBadge(rec.recommended_strategy)}`}>
                        RECOMMENDED: {rec.recommended_strategy}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{rec.executive_summary}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs text-brand-600 font-semibold hidden sm:inline">
                    {isExpanded ? 'Collapse Analysis' : 'Expand Strategy Comparison'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details Body */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-100 bg-slate-50/40 space-y-6 animate-fadeIn">
                  {/* Explainability Breakdown: "WHY" Section */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                      <Info className="w-4 h-4 text-brand-600" />
                      <span>Detailed Explainability: Why this decision?</span>
                    </h4>
                    <ul className="space-y-1.5">
                      {rec.reasoning.map((reason, rIdx) => (
                        <li key={rIdx} className="flex items-start space-x-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 3 Strategy Comparison Columns */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                      Comparative Strategic Options
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {rec.options_comparison.map((opt, oIdx) => (
                        <div 
                          key={oIdx}
                          className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                            opt.strategy === rec.recommended_strategy || (rec.recommended_strategy === 'HYBRID' && opt.strategy === 'HIRE')
                              ? 'bg-white border-brand-500 ring-2 ring-brand-500/10 shadow-xs'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStrategyBadge(opt.strategy)}`}>
                                Option {oIdx + 1}: {opt.strategy}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-500">
                                Feasibility: <strong>{opt.feasibility_score}%</strong>
                              </span>
                            </div>

                            <h5 className="font-bold text-xs text-slate-900 mb-1">{opt.title}</h5>
                            <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">{opt.description}</p>

                            {/* Cost & Timeline Badges */}
                            <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs mb-3">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 flex items-center space-x-1">
                                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Budget Impact:</span>
                                </span>
                                <strong className="text-slate-900">{opt.estimated_cost_inr}</strong>
                              </div>
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 flex items-center space-x-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Delivery Time:</span>
                                </span>
                                <strong className="text-slate-900">{opt.time_to_deliver}</strong>
                              </div>
                            </div>

                            {/* Candidate Names if any */}
                            {opt.candidate_names && opt.candidate_names.length > 0 && (
                              <div className="mb-3">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                  Candidate Matches:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {opt.candidate_names.map((name, nIdx) => (
                                    <span key={nIdx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                                      {name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Advantages & Risks */}
                            <div className="space-y-2 text-[11px]">
                              <div>
                                <span className="font-semibold text-emerald-700 block mb-0.5">Key Advantages:</span>
                                {opt.key_advantages.map((adv, aIdx) => (
                                  <span key={aIdx} className="block text-slate-600">• {adv}</span>
                                ))}
                              </div>
                              <div>
                                <span className="font-semibold text-rose-700 block mb-0.5">Key Risks:</span>
                                {opt.key_risks.map((risk, rIdx) => (
                                  <span key={rIdx} className="block text-slate-500">• {risk}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100">
                            <span className="text-[10px] text-slate-400 font-medium">
                              {opt.strategy === rec.recommended_strategy ? '★ Selected Optimal Solution' : 'Alternative Path'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
