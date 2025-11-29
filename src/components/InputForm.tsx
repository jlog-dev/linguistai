import { BookOpen, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import { ProficiencyLevel } from '../types';

interface InputFormProps {
  onSubmit: (topic: string, level: ProficiencyLevel) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<ProficiencyLevel>(ProficiencyLevel.A1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onSubmit(topic, level);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-french-blue/10 rounded-full flex items-center justify-center mb-4 text-french-blue">
          <BookOpen size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Start Your French Lesson</h2>
        <p className="text-slate-500 mt-2">What would you like to learn about today?</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700 mb-2">
            Topic or Interest
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Ordering coffee, A walk in Paris, Modern Art..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-french-blue focus:ring-2 focus:ring-french-blue/20 outline-none transition-all"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="level" className="block text-sm font-medium text-slate-700 mb-2">
            Proficiency Level
          </label>
          <div className="relative">
            <select
              id="level"
              value={level}
              onChange={(e) => setLevel(e.target.value as ProficiencyLevel)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-french-blue focus:ring-2 focus:ring-french-blue/20 outline-none appearance-none bg-white transition-all cursor-pointer"
              disabled={isLoading}
            >
              {Object.values(ProficiencyLevel).map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !topic.trim()}
          className="w-full bg-french-blue hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Material...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Create Lesson</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;