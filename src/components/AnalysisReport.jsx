import React from 'react';
import { Target, TrendingUp, CheckCircle, AlertTriangle, BarChart2, PieChart as PieChartIcon } from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';

export default function AnalysisReport({ results }) {
  if (!results) return null;

  // Fallback defaults match our new schema
  const candidateName = results.candidateName || 'User';
  const overallScore = results.overallScore || results.score || 85;
  const categoryScores = results.categoryScores || [];
  const keywordDistribution = results.keywordDistribution || [];
  
  const strengths = results.strengths || [];
  const suggestions = results.suggestions || [];
  const detailedRecommendations = results.detailedRecommendations || [];

  // Time-based greeting generator
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Theme colors for PieChart (Neon palette)
  const COLORS = ['#d946ef', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e'];

  return (
    <div className="left-pane glass-panel">
      <div className="analysis-container">
        
        {/* Dynamic AI Greeting Header */}
        <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
             {getGreeting()}, <span style={{ color: 'var(--primary-color)'}}>{candidateName.trim()}</span>! ✨
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Your customized AI analysis report is ready.</p>
        </div>
        
        {/* Top Overall Score Card */}
        <div className="score-card">
          <div className="score-circle">
            <span className="score-number">{overallScore}</span>
          </div>
          <div className="score-text">
            <h2>Resume Score</h2>
            <p>Your overall resume rating. See the breakdown below.</p>
          </div>
        </div>

        {/* Dashboard Grid for Charts */}
        <div className="dashboard-grid">
          
          {/* Radar Chart for Categories */}
          {categoryScores.length > 0 && (
            <div className="chart-card">
              <h3><BarChart2 size={20} color="var(--primary-color)" /> Category Breakdown</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={categoryScores}>
                    <PolarGrid stroke="rgba(255,255,255,0.2)" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-muted)' }} />
                    <Radar 
                      name="Score" 
                      dataKey="score" 
                      stroke="var(--primary-color)" 
                      fill="var(--primary-color)" 
                      fillOpacity={0.5} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Pie Chart for Keywords */}
          {keywordDistribution.length > 0 && (
            <div className="chart-card">
              <h3><PieChartIcon size={20} color="var(--secondary-color)" /> Keyword Density</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={keywordDistribution.map(item => ({ ...item, value: Number(item.value) || Number(item.count) || Number(item.percentage) || 10 }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
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

        {/* Textual Feedback Sections */}
        <div className="glass-panel" style={{ padding: '1.5rem', border: 'none', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={20} color="var(--primary-color)" /> Key Strengths
          </h3>
          <div className="keywords">
            {strengths.map((k, i) => (
              <span key={i} className="keyword-pill">{k}</span>
            ))}
          </div>
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

        {/* Deep AI Recommendations Section */}
        {detailedRecommendations.length > 0 && (
          <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(217, 70, 239, 0.2)', background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.08) 0%, rgba(0,0,0,0) 100%)', marginTop: '1.5rem' }}>
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
    </div>
  );
}
