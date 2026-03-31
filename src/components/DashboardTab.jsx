import React from 'react';
import { BarChart2, CheckCircle, AlertTriangle, Briefcase } from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

export default function DashboardTab({ results }) {
  if (!results) return null;

  const candidateName = results.candidateName || 'User';
  const overallScore = results.overallScore || results.score || 85;
  const categoryScores = results.categoryScores || [];
  const strengths = results.strengths || [];
  const skillGaps = results.skillGaps || [];
  const jobRoleFits = results.jobRoleFits || [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="tab-content" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      
      {/* Header */}
      <div style={{ paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
            AI Resume Analyzer
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {getGreeting()}, <span style={{ color: 'var(--primary-color)'}}>{candidateName.trim()}</span>. Here's your overview.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Score Card */}
        <div className="chart-card score-main-card">
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>AI Match Score</h3>
          <div className="score-circle massive-score" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <span className="score-number">{overallScore}</span>
            <span style={{ position: 'absolute', bottom: '15px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>/100</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ color: 'var(--primary-color)', fontSize: '1.1rem', marginBottom: '4px' }}>Overall Performance</h4>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Status: {overallScore > 80 ? 'Exceptional' : overallScore > 60 ? 'Competitive' : 'Needs Review'}</span>
          </div>
        </div>

        {/* Radar Card */}
        {categoryScores.length > 0 && (
          <div className="chart-card">
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>Technical Proficiency</h3>
            <div style={{ width: '100%', height: 260, marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={categoryScores}>
                  <PolarGrid stroke="rgba(255,255,255,0.15)" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar 
                    name="Score" 
                    dataKey="score" 
                    stroke="var(--secondary-color)" 
                    fill="url(#radarGradient)" 
                    fillOpacity={0.6} 
                  />
                  <defs>
                    <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--secondary-color)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ textAlign: 'center', color: '#10b981', fontWeight: '500', fontSize: '0.9rem' }}>High Match ({categoryScores.reduce((a, b) => a + b.score, 0) / categoryScores.length}%)</div>
          </div>
        )}
      </div>

      {/* Tri-Pane Row for Strengths, Gaps, Roles */}
      <div className="pill-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
        
        <div className="glass-panel" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
            <CheckCircle size={16} color="var(--primary-color)" /> Key Strengths
          </h4>
          <div className="keywords-stack">
            {strengths.slice(0, 4).map((k, i) => (
              <span key={i} className="stack-pill">{k}</span>
            ))}
            {strengths.length === 0 && <span className="stack-pill empty">None detected</span>}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
            <AlertTriangle size={16} color="#f59e0b" /> Top Skill Gaps
          </h4>
          <div className="keywords-stack">
            {skillGaps.slice(0, 4).map((k, i) => (
              <span key={i} className="stack-pill warning">{k}</span>
            ))}
            {skillGaps.length === 0 && <span className="stack-pill empty">Analysis incomplete</span>}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
            <Briefcase size={16} color="var(--secondary-color)" /> Job Role Fits
          </h4>
          <div className="keywords-stack">
            {jobRoleFits.slice(0, 4).map((k, i) => (
               <span key={i} className="stack-pill highlight">{k}</span>
            ))}
            {jobRoleFits.length === 0 && <span className="stack-pill empty">Analysis incomplete</span>}
          </div>
        </div>

      </div>
    </div>
  );
}
