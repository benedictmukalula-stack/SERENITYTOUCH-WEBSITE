'use client';

import { ChevronRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface BreadcrumbItem {
  label: string;
  page?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <nav aria-label="Breadcrumb" className="container-tinas">
      <ol className="flex items-center gap-1.5 py-4 text-xs">
        <li>
          <button
            onClick={() => navigate('home')}
            className="text-pink-glow/45 hover:text-gold transition-colors duration-200"
          >
            Home
          </button>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-pink-glow/25" />
              {isLast ? (
                <span className="text-gold font-medium">{item.label}</span>
              ) : (
                <button
                  onClick={() => item.page && navigate(item.page)}
                  className="text-pink-glow/45 hover:text-gold transition-colors duration-200"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}