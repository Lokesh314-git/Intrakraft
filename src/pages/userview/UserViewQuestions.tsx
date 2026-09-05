import React from 'react';
import { HelpCircle, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UserViewQuestions: React.FC = () => {
  const { questions, products } = useAppStore();

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-luxe-border pb-6 space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
          MERCHANDISING INQUIRIES
        </span>
        <h1 className="font-playfair text-3xl font-bold text-luxe-text">Product Q&A Directory</h1>
        <p className="text-xs text-luxe-muted">
          Community questions regarding apparel specifications, grade allocations, and size ratio rules.
        </p>
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-luxe-border rounded bg-luxe-surface p-8">
            <p className="text-xs text-luxe-muted">No questions submitted yet.</p>
          </div>
        ) : (
          questions.map((q) => {
            const product = products.find((p) => p.id === q.productId);
            return (
              <div key={q.id} className="p-6 rounded border border-luxe-border bg-luxe-surface space-y-3">
                <div className="flex items-center justify-between border-b border-luxe-border/60 pb-2">
                  <span className="text-xs font-bold text-luxe-text">{product?.name || 'Product'}</span>
                  <span className="text-[10px] text-luxe-muted font-mono">{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-start gap-2 text-xs font-bold text-luxe-text">
                  <HelpCircle className="w-4 h-4 text-luxe-muted shrink-0 mt-0.5" />
                  <span>Q: {q.question}</span>
                </div>

                {q.answer && (
                  <div className="pl-6 text-xs text-luxe-muted bg-luxe-bg p-3 rounded border border-luxe-border/60 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-luxe-text text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Answer:</span>
                    </div>
                    <p>{q.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
