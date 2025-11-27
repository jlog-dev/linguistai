import React, { useState } from 'react';
import { VocabularyItem } from '../types';
import { Volume2, Loader2 } from 'lucide-react';

const VocabCard: React.FC<{ item: VocabularyItem }> = ({ item }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playWord = async () => {
    // show alert that this feature is not implemented yet
    alert("This feature is not implemented yet");
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold text-french-dark font-serif">{item.word}</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 mt-1 inline-block">
            {item.type}
          </span>
        </div>
        <button 
          onClick={playWord}
          disabled={isPlaying}
          className="text-french-blue hover:text-blue-700 disabled:opacity-50"
        >
          {isPlaying ? <Loader2 size={20} className="animate-spin" /> : <Volume2 size={20} />}
        </button>
      </div>
      
      <p className="text-slate-600 mb-3 border-b border-slate-50 pb-2">{item.translation}</p>
      
      <div className="bg-blue-50/50 p-3 rounded-lg">
        <p className="text-sm text-slate-700 italic">
          "{item.contextSentence}"
        </p>
      </div>
    </div>
  );
};

export default VocabCard;