import React, { useState } from 'react';
import { HelpCircle, Send, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface QuestionSectionProps {
  productId: string;
}

export const QuestionSection: React.FC<QuestionSectionProps> = ({ productId }) => {
  const { questions, addQuestion } = useAppStore();
  const [questionText, setQuestionText] = useState('');

  const productQuestions = questions.filter((q) => q.productId === productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    addQuestion(productId, questionText.trim());
    setQuestionText('');
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-luxe-border pb-4">
        <h3 className="font-playfair text-xl font-bold text-luxe-text">Questions & Answers</h3>
        <p className="text-xs text-luxe-muted mt-0.5">Ask questions about fabric, specifications, grade assignments, or size ratios.</p>
      </div>

      {/* Ask Question Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Ask a question about this product..."
          className="flex-1 bg-luxe-bg border border-luxe-border rounded px-4 py-2.5 text-xs text-luxe-text focus:border-luxe-dark focus:outline-none"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded text-xs font-semibold bg-luxe-dark text-luxe-bg hover:bg-black transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask Question</span>
        </button>
      </form>

      {/* Q&A List */}
      <div className="space-y-4 pt-2">
        {productQuestions.length === 0 ? (
          <div className="py-6 text-center border border-dashed border-luxe-border rounded bg-luxe-surface p-4">
            <p className="text-xs text-luxe-muted">No questions asked yet for this item. Submit the first question above!</p>
          </div>
        ) : (
          productQuestions.map((q) => (
            <div key={q.id} className="p-4 rounded border border-luxe-border bg-luxe-surface space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-luxe-text">
                  <HelpCircle className="w-4 h-4 text-luxe-muted shrink-0" />
                  <span>Q: {q.question}</span>
                </div>
                <span className="text-[10px] text-luxe-muted font-mono">{new Date(q.createdAt).toLocaleDateString()}</span>
              </div>

              {q.answer ? (
                <div className="pl-6 text-luxe-muted space-y-1 bg-luxe-bg p-3 rounded border border-luxe-border/60 mt-1">
                  <div className="flex items-center gap-1.5 font-semibold text-luxe-text text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>LUXÉ Merchandising Team Answer:</span>
                  </div>
                  <p className="text-xs leading-relaxed">{q.answer}</p>
                </div>
              ) : (
                <p className="pl-6 text-[11px] italic text-luxe-muted">Pending answer from merchandising specialist...</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
