import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, Layers } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserProductCard } from '../../components/userview/UserProductCard';

export const UserViewCollections: React.FC = () => {
  const { collection } = useParams<{ collection: string }>();
  const { products } = useAppStore();
  const navigate = useNavigate();

  const collectionName = (collection || 'new-arrivals').replace(/-/g, ' ').toUpperCase();

  const collectionProducts = products.slice(0, 8);

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-luxe-border pb-6 space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-luxe-muted block">
          CURATED COLLECTION
        </span>
        <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-luxe-text">{collectionName}</h1>
        <p className="text-xs text-luxe-muted">
          Hand-picked merchandising selection across Grade A, B, C & D lines.
        </p>
      </div>

      {collectionProducts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-luxe-border rounded bg-luxe-surface p-8">
          <p className="text-xs text-luxe-muted">Collection empty. Ingest product data from the admin portal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {collectionProducts.map((p) => (
            <UserProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
