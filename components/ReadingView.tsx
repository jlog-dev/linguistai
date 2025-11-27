import React, { useState } from 'react';
import { Volume2, Loader2, Eye, EyeOff } from 'lucide-react';
import { playAudio } from '../utils/audioUtils';
import { generateSpeech } from '../services/geminiService';

interface ReadingViewProps {
  title: string;
  frenchText: string;
  translation: string;
}

const ReadingView: React.FC<ReadingViewProps> = ({ title, frenchText, translation }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const base64 = await generateSpeech(frenchText);
      await playAudio(base64);
    } catch (err) {
      console.error(err);
      alert("Could not generate audio at this time.");
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-start border-b border-slate-100 pb-4">
        <h2 className="text-3xl font-serif font-bold text-french-dark">{title}</h2>
        <button
          onClick={handlePlayAudio}
          disabled={isPlaying}
          className="flex-shrink-0 p-3 rounded-full bg-french-blue/10 text-french-blue hover:bg-french-blue/20 transition-colors disabled:opacity-50"
          title="Listen to text"
        >
          {isPlaying ? <Loader2 className="animate-spin" size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="font-serif text-xl leading-relaxed text-slate-800 whitespace-pre-wrap">
          {frenchText}
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">English Translation</h3>
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className="text-french-blue text-sm font-medium flex items-center gap-2 hover:underline"
          >
            {showTranslation ? <><EyeOff size={16}/> Hide</> : <><Eye size={16}/> Reveal</>}
          </button>
        </div>
        
        {showTranslation ? (
          <p className="text-slate-600 leading-relaxed animate-fade-in">
            {translation}
          </p>
        ) : (
          <div className="h-24 flex items-center justify-center bg-slate-100 rounded-lg border-2 border-dashed border-slate-200 text-slate-400">
            Translation hidden
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingView;