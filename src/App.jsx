import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import FileUpload from './components/FileUpload';
import Sidebar from './components/Sidebar';
import DashboardTab from './components/DashboardTab';
import AnalysisTab from './components/AnalysisTab';
import ChatAssistant from './components/ChatAssistant';
import { parseResumeFile } from './utils/pdfParser';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const resetUpload = () => {
    setFile(null);
    setAnalysisResults(null);
    setActiveTab('dashboard');
  };

  const handleFileUpload = async (uploadedFile) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);
    
    try {
      // Simulate real-world delay for UI presentation
      await new Promise(resolve => setTimeout(resolve, 2000));
      const results = await parseResumeFile(uploadedFile);
      setAnalysisResults(results);
    } catch (err) {
      // Fallback
      setAnalysisResults({ 
        overallScore: 777, 
        categoryScores: [
          { category: "Impact", score: 85, fullMark: 100 },
          { category: "Format", score: 90, fullMark: 100 },
          { category: "Brevity", score: 70, fullMark: 100 },
          { category: "Skills", score: 80, fullMark: 100 }
        ],
        keywordDistribution: [
          { name: "Frontend", value: 4 },
          { name: "Backend", value: 3 },
          { name: "DevOps", value: 1 }
        ],
        strengths: ['Formatting Validation', 'Fallback Error Loading'], 
        suggestions: [
          { text: "There was a native error reading your file format. Using AI fallback values.", type: 'warning'}
        ],
        rawText: ""
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={file ? "dashboard-layout" : "app-container"}>
      
      {/* Only show the centered header block if no file is strictly uploaded */}
      {!file && (
        <header>
          <h1 className="logo-title">
            RESUMA <Sparkles size={32} />
          </h1>
          <p className="subtitle">Optimize your resume with AI-driven insights</p>
        </header>
      )}

      {file && !isAnalyzing && (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onNewUpload={resetUpload} />
      )}
      
      <main className={file ? "dashboard-main" : "main-content"}>
        {!file ? (
          <FileUpload onFileUpload={handleFileUpload} />
        ) : isAnalyzing ? (
          <div className="upload-center glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', gap: '1rem', margin: 'auto' }}>
             <Loader2 size={48} className="upload-icon" style={{ animation: 'pulse-border 1s infinite' }} />
             <h2>Analyzing Resume...</h2>
             <p style={{ color: 'var(--text-muted)' }}>Extracting text and calculating score</p>
          </div>
        ) : (
          <div className="split-view">
            <div className="left-pane" style={{ background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
              {activeTab === 'dashboard' ? (
                <DashboardTab results={analysisResults} />
              ) : (
                <AnalysisTab results={analysisResults} />
              )}
            </div>
            
            <div className="right-pane chat-assistant-pane" style={{ flex: 0.45 }}>
              <div className="glass-panel" style={{ height: '100%' }}>
                <ChatAssistant resumeText={analysisResults?.rawText || ""} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
