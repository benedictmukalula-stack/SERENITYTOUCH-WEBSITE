'use client';

import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  variant: 'card' | 'text' | 'image' | 'form';
  count?: number;
}

function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="surface-raised rounded-2xl p-6 md:p-8"
    >
      <div className="skeleton h-40 rounded-xl mb-5" />
      <div className="skeleton h-5 w-3/4 rounded mb-3" />
      <div className="skeleton h-4 w-full rounded mb-2" />
      <div className="skeleton h-4 w-5/6 rounded mb-2" />
      <div className="skeleton h-4 w-2/3 rounded mb-5" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="skeleton w-10 h-10 rounded-full" />
          <div>
            <div className="skeleton h-3.5 w-24 rounded mb-1.5" />
            <div className="skeleton h-3 w-16 rounded" />
          </div>
        </div>
        <div className="skeleton h-9 w-24 rounded-full" />
      </div>
    </motion.div>
  );
}

function SkeletonText() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-5/6 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-4/5 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
    </motion.div>
  );
}

function SkeletonImage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="skeleton h-56 md:h-72 rounded-2xl w-full" />
      <div className="skeleton h-3.5 w-2/3 rounded mx-auto" />
    </motion.div>
  );
}

function SkeletonForm() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="surface-raised rounded-2xl p-6 md:p-8 space-y-5"
    >
      <div className="space-y-2">
        <div className="skeleton h-3.5 w-28 rounded" />
        <div className="skeleton h-11 rounded-xl w-full" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3.5 w-20 rounded" />
        <div className="skeleton h-11 rounded-xl w-full" />
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3.5 w-36 rounded" />
        <div className="skeleton h-28 rounded-xl w-full" />
      </div>
      <div className="skeleton h-12 rounded-full w-full" />
    </motion.div>
  );
}

const skeletonMap: Record<string, () => JSX.Element> = {
  card: SkeletonCard,
  text: SkeletonText,
  image: SkeletonImage,
  form: SkeletonForm,
};

export default function LoadingSkeleton({ variant, count = 3 }: LoadingSkeletonProps) {
  const Component = skeletonMap[variant];

  return (
    <div
      className={
        variant === 'image'
          ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
          : variant === 'card'
            ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'
            : 'space-y-6'
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}