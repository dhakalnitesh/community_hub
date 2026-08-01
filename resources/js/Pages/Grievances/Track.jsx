import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useLanguage } from '../../Context/LanguageContext';
import { StatusBadge, PriorityBadge } from '../../Components/UI/Badge';
import ProgressSteps from '../../Components/UI/ProgressSteps';

export default function Track({ grievance, error }) {
  const { t, lang } = useLanguage();
  const isNp = lang === 'np';
  const { data, setData, get, processing } = useForm({ code: '' });

  function handleSubmit(e) {
    e.preventDefault();
    get(route('grievances.track'), { preserveState: true });
  }

  return (
    <>
      <Head title={`${t('status.title')}`} />

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-7">
          <div className="text-center mb-5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('status.title')}</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{t('status.desc')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('status.code_label')}</label>
              <input type="text" value={data.code} onChange={e => setData('code', e.target.value.toUpperCase())}
                placeholder={t('status.code_placeholder')}
                className="w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase tracking-wider font-mono" />
            </div>
            <button type="submit" disabled={processing || !data.code}
              className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm">
              {processing ? t('status.searching') : t('status.lookup_btn')}
            </button>
          </form>

          {error && (
            <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-xs sm:text-sm">{error}</p>
            </div>
          )}

          {grievance && (
            <div className="mt-6 space-y-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <ProgressSteps currentStatus={grievance.status} events={grievance.events || []} />
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-xs sm:text-sm">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{t('status.details_title')}</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div><span className="text-gray-500 block text-[10px] sm:text-xs">{t('status.reference')}</span>
                    <span className="font-mono font-bold text-gray-900">{grievance.reference_code}</span></div>
                  <div><span className="text-gray-500 block text-[10px] sm:text-xs">{t('status.institution')}</span>
                    <span className="font-medium text-gray-900">{grievance.institution}</span></div>
                  <div><span className="text-gray-500 block text-[10px] sm:text-xs">{t('status.priority')}</span>
                    <PriorityBadge priority={grievance.priority} /></div>
                  <div><span className="text-gray-500 block text-[10px] sm:text-xs">{t('status.status')}</span>
                    <StatusBadge status={grievance.status} /></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}