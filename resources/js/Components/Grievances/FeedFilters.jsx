import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useLanguage } from '../../Context/LanguageContext';

export default function FeedFilters({ categories, filters = {} }) {
  const { t } = useLanguage();

  function updateFilter(key, value) {
    router.get(route('grievances.feed'), { ...filters, [key]: value || undefined }, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex flex-wrap items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-1.5 flex-1 min-w-[160px]">
        <i className="fa-solid fa-magnifying-glass text-gray-400 text-xs shrink-0"></i>
        <input type="text" defaultValue={filters.search || ''} placeholder="Search grievances..."
          onKeyDown={e => e.key === 'Enter' && updateFilter('search', e.target.value)}
          className="w-full text-xs border-0 outline-none focus:ring-0 p-0 bg-transparent text-gray-700 placeholder-gray-400" />
      </div>

      <select value={filters.category || ''} onChange={e => updateFilter('category', e.target.value)}
        className="text-xs rounded-lg border-gray-200 border px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
        <option value="">{t('submit.category_label')}</option>
        {categories?.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <select value={filters.status || ''} onChange={e => updateFilter('status', e.target.value)}
        className="text-xs rounded-lg border-gray-200 border px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
        <option value="">{t('status.status')}</option>
        {Object.entries(t('statuses')).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>

      <select value={filters.priority || ''} onChange={e => updateFilter('priority', e.target.value)}
        className="text-xs rounded-lg border-gray-200 border px-2 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
        <option value="">{t('submit.priority_label')}</option>
        {Object.entries(t('priorities')).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>

      {(filters.search || filters.category || filters.status || filters.priority) && (
        <button onClick={() => router.get(route('grievances.feed'), {}, { preserveState: true, replace: true })}
          className="text-xs text-red-600 hover:text-red-800 font-medium whitespace-nowrap">
          Clear
        </button>
      )}
    </div>
  );
}