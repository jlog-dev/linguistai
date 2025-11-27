import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface QuizViewProps {
  questions: QuizQuestion[];
}

const QuizView: React.FC<QuizViewProps> = ({ questions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-100 text-yellow-600 mb-6">
          <span className="text-3xl font-bold">{score}/{questions.length}</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Complete!</h2>
        <p className="text-slate-500 mb-8">
          {score === questions.length ? "Parfait! Perfect score!" : "Bien joué! Keep practicing."}
        </p>
        <button
          onClick={restartQuiz}
          className="bg-french-blue text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 text-sm font-medium text-slate-400">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let className = "w-full p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ";
            
            if (isAnswered) {
              if (idx === currentQuestion.correctIndex) {
                className += "border-green-500 bg-green-50 text-green-700";
              } else if (idx === selectedOption) {
                className += "border-red-500 bg-red-50 text-red-700";
              } else {
                className += "border-slate-100 opacity-50";
              }
            } else {
              className += "border-slate-100 hover:border-french-blue hover:bg-blue-50/30";
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={isAnswered}
                className={className}
              >
                <span>{option}</span>
                {isAnswered && idx === currentQuestion.correctIndex && <CheckCircle size={20} />}
                {isAnswered && idx === selectedOption && idx !== currentQuestion.correctIndex && <XCircle size={20} />}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="animate-fade-in bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="text-french-blue mt-1" size={20} />
            <div>
              <p className="font-semibold text-slate-800 text-sm mb-1">Explanation</p>
              <p className="text-slate-600 text-sm">{currentQuestion.explanation}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={nextQuestion}
          disabled={!isAnswered}
          className="flex items-center gap-2 px-6 py-3 bg-french-dark text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
        >
          {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default QuizView;