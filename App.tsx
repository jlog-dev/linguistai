import React, { useState } from 'react';
import { LearningMaterial, ProficiencyLevel, AppState, Tab } from './types';
import InputForm from './components/InputForm';
import ReadingView from './components/ReadingView';
import VocabCard from './components/VocabCard';
import QuizView from './components/QuizView';
import { Book, GraduationCap, BrainCircuit, RotateCcw } from 'lucide-react';
import { generateLearningContentFromQwen } from './services/qianwenService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SETUP);
  const [material, setMaterial] = useState<LearningMaterial | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('read');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleGenerate = async (topic: string, level: ProficiencyLevel) => {
    setState(AppState.LOADING);
    setErrorMsg('');
    try {
      const data = await generateLearningContentFromQwen(topic, level);
      setMaterial(data);
      setState(AppState.LEARNING);
    } catch (error) {
      setState(AppState.ERROR);
      setErrorMsg("Failed to generate content. Please try a different topic or check your API key.");
    }
  };

  const resetApp = () => {
    setState(AppState.SETUP);
    setMaterial(null);
    setActiveTab('read');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-french-blue cursor-pointer" onClick={resetApp}>
            <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold font-serif">L</div>
            <span className="font-bold text-xl tracking-tight text-slate-800">Linguist<span className="text-french-blue">AI</span></span>
          </div>
          {state === AppState.LEARNING && (
            <button 
              onClick={resetApp}
              className="text-sm font-medium text-slate-500 hover:text-french-blue flex items-center gap-2"
            >
              <RotateCcw size={16} />
              New Lesson
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        
        {state === AppState.SETUP && (
          <div className="animate-fade-in w-full flex justify-center">
            <InputForm onSubmit={handleGenerate} isLoading={false} />
          </div>
        )}

        {state === AppState.LOADING && (
          <div className="text-center animate-pulse">
             <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-slate-100 flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-french-blue border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-slate-800">C'est parti!</h3>
                <p className="text-slate-500 mt-2">Writing your story and preparing quiz...</p>
             </div>
          </div>
        )}

        {state === AppState.ERROR && (
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border-l-4 border-red-500">
            <h3 className="text-lg font-bold text-red-600 mb-2">Error</h3>
            <p className="text-slate-600 mb-6">{errorMsg}</p>
            <button 
              onClick={resetApp}
              className="text-sm font-semibold text-slate-500 hover:text-slate-800 underline"
            >
              Go back
            </button>
          </div>
        )}

        {state === AppState.LEARNING && material && (
          <div className="w-full max-w-5xl animate-fade-in flex flex-col md:flex-row gap-6 items-start">
            {/* Sidebar Navigation (Desktop) / Top Bar (Mobile) */}
            <nav className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-slate-200 p-2 flex md:flex-col gap-1 sticky top-20">
              <button
                onClick={() => setActiveTab('read')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'read' ? 'bg-french-blue text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <Book size={18} />
                Reading
              </button>
              <button
                onClick={() => setActiveTab('vocab')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'vocab' ? 'bg-french-blue text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <GraduationCap size={18} />
                Vocabulary
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'quiz' ? 'bg-french-blue text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <BrainCircuit size={18} />
                Quiz
              </button>
            </nav>

            {/* Content Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10 min-h-[600px]">
              
              {activeTab === 'read' && (
                <ReadingView 
                  title={material.title} 
                  frenchText={material.frenchText} 
                  englishTranslation={material.englishTranslation} 
                />
              )}

              {activeTab === 'vocab' && material?.vocabulary && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Key Vocabulary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {material.vocabulary.map((item, idx) => (
                      <VocabCard key={idx} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && (
                <div className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Comprehension Check</h2>
                  <QuizView questions={material.quiz} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;