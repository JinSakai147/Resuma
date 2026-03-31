import React from 'react';
import { Target, TrendingUp, CheckCircle, AlertTriangle, PieChart as PieChartIcon } from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function AnalysisTab({ results }) {
  if (!results) return null;

  const keywordDistribution = results.keywordDistribution || [];
  const suggestions = results.suggestions || [];
  const detailedRecommendations = results.detailedRecommendations || [];

  const COLORS = ['#d946ef', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="tab-content" style={{ animation: 'fadeIn 0.4s ease-out', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
         <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
            Detailed Analysis
         </h2>
         <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Comprehensive breakdown of your resume metrics and AI insights.
         </p>
      </div>

      <div className="dashboard-grid">
         {/* Pie Chart for Keywords */}
        {keywordDistribution.length > 0 && (
          <div className="chart-card glass-panel" style={{ background: 'rgba(255,255,255,0.02)', border: 'none' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PieChartIcon size={20} color="var(--secondary-color)" /> Keyword Density Mapping
            </h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={keywordDistribution.map(item => ({ ...item, value: Number(item.value) || Number(item.count) || Number(item.percentage) || 10 }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {keywordDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--panel-bg)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-main)' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', border: 'none', background: 'rgba(255,255,255,0.02)' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} color="var(--primary-color)" /> Actionable Feedback
        </h3>
        <ul className="suggestions-list">
          {suggestions.map((s, i) => (
            <li 
              key={i} 
              className="suggestion-item dynamic-card"
              style={{
                borderLeftColor: s.type === 'success' ? '#22c55e' : '#eab308',
                borderLeftWidth: '4px',
                borderLeftStyle: 'solid',
                backgroundColor: s.type === 'success' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(234, 179, 8, 0.08)',
                boxShadow: s.type === 'success' ? 'inset 0 0 20px rgba(34, 197, 94, 0.02)' : 'inset 0 0 20px rgba(234, 179, 8, 0.02)'
              }}
            >
              <span className="suggestion-icon">
                {s.type === 'success' ? <CheckCircle size={22} color="#22c55e" /> : <AlertTriangle size={22} color="#eab308" />}
              </span>
              <span style={{color: '#ffffff', fontWeight: '500', letterSpacing: '0.4px'}}>{String(s.text)}</span>
            </li>
          ))}
        </ul>
      </div>

      {detailedRecommendations.length > 0 && (
        <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(217, 70, 239, 0.2)', background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.08) 0%, rgba(0,0,0,0) 100%)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-color)' }}>
            <TrendingUp size={24} color="#d946ef" /> Deep AI Recommendations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {detailedRecommendations.map((rec, i) => (
              <div key={i} style={{ padding: '1.2rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', borderLeft: '3px solid #d946ef', color: '#ffffff', lineHeight: '1.6', letterSpacing: '0.3px', fontSize: '0.95rem' }}>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
