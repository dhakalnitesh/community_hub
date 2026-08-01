import { useState } from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useLanguage } from '../../Context/LanguageContext';

export default function UpvoteButton({ grievance, compact = false }) {
  const { lang } = useLanguage();
  const [optimisticUpvoted, setOptimisticUpvoted] = useState(grievance.is_upvoted);
  const [optimisticCount, setOptimisticCount] = useState(grievance.upvotes_count || 0);
  const [loading, setLoading] = useState(false);

  function handleUpvote(e) {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    const newUpvoted = !optimisticUpvoted;
    setOptimisticUpvoted(newUpvoted);
    setOptimisticCount(prev => prev + (newUpvoted ? 1 : -1));

    router.post(route('grievances.upvote', grievance.id), {}, {
      preserveScroll: true,
      preserveState: true,
      onError: () => {
        setOptimisticUpvoted(!newUpvoted);
        setOptimisticCount(prev => prev + (newUpvoted ? -1 : 1));
      },
      onFinish: () => setLoading(false),
    });
  }

  if (compact) {
    return (
      <button onClick={handleUpvote} disabled={loading}
        className={`flex items-center gap-1 text-xs transition-all ${optimisticUpvoted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}>
        <i className={`${optimisticUpvoted ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
        <span>{optimisticCount}</span>
      </button>
    );
  }

  return (
    <button onClick={handleUpvote} disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
        optimisticUpvoted
          ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-red-500'
      }`}>
      <i className={`${optimisticUpvoted ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
      <span>{lang === 'np' ? 'प्रतिक्रिया' : 'React'} ({optimisticCount})</span>
    </button>
  );
}