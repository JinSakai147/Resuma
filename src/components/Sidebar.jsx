import React from 'react';
import { LayoutDashboard, PieChart, Briefcase, FileText, Settings, Sparkles } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab, onNewUpload }) {
  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <h1 className="logo-title sidebar-logo">
          RESUMA <Sparkles size={24} color="#d946ef" />
        </h1>
      </div>

      <div className="sidebar-action">
        <button className="new-resume-btn" onClick={onNewUpload}>
          Analyze New Resume
        </button>
      </div>

      <nav className="sidebar-nav">
        <button 
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <LayoutDashboard size={20} /> Dashboard
        </button>
        <button 
          className={`nav-item ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          <PieChart size={20} /> Analysis
        </button>
      </nav>
    </aside>
  );
}
