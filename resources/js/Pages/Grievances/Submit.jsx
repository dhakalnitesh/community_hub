import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useLanguage } from '../../Context/LanguageContext';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Submit({ institutions, categories, semesters, subjects, priorities }) {
  const { t, lang } = useLanguage();
  const { auth } = usePage().props;
  const user = auth?.user;
  const [step, setStep] = useState(0);

  const { data, setData, post, processing, errors, reset } = useForm({
    institution_id: user?.institution_id || '',
    semester_id: '',
    subject_id: '',
    category_id: '',
    priority: 'medium',
    title: '',
    description: '',
    is_anonymous: true,
    photo: null,
    video: null,
    website: '',
  });

  function handleSubmit(e) {
    e.preventDefault();
    post('/grievances', {
      forceFormData: true,
      onSuccess: () => { reset(); setStep(0); },
    });
  }

  function handlePhotoChange(e) {
    setData('photo', e.target.files[0]);
    setData('video', null);
  }

  function handleVideoChange(e) {
    setData('video', e.target.files[0]);
    setData('photo', null);
  }

  const filteredCategories = categories;
  const steps = ['issue_details', 'description', 'review'];

  function canProceed() {
    if (step === 0) return data.institution_id && data.category_id && data.priority && data.title;
    if (step === 1) return data.description && data.description.length >= 10;
    return true;
  }

  const content = (
    <div className="min-h-screen bg-gray-50 pb-12 pt-6">
      <Head title={t('submit.title')} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('submit.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('submit.subtitle')}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full -z-10"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 transition-all duration-300 -z-10 rounded-full"
                 style={{ width: `${(step / 2) * 100}%` }}></div>

            {steps.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i <= step ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${i <= step ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {t(`submit.steps.${s}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {step === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    {t('submit.institution')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data.institution_id}
                    onChange={e => setData('institution_id', e.target.value)}
                    className="w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  >
                    <option value="">{t('submit.select_institution')}</option>
                    {institutions.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                  </select>
                  {errors.institution_id && <p className="mt-1 text-sm text-red-600">{errors.institution_id}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    {t('submit.category')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={data.category_id}
                    onChange={e => setData('category_id', e.target.value)}
                    className="w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  >
                    <option value="">{t('submit.select_category')}</option>
                    {filteredCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">{t('submit.semester')}</label>
                  <select
                    value={data.semester_id}
                    onChange={e => setData('semester_id', e.target.value)}
                    className="w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">{t('submit.optional')}</option>
                    {semesters.map(sem => (
                      <option key={sem.id} value={sem.id}>{sem.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">{t('submit.subject')}</label>
                  <select
                    value={data.subject_id}
                    onChange={e => setData('subject_id', e.target.value)}
                    className="w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">{t('submit.optional')}</option>
                    {subjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  {t('submit.title')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={e => setData('title', e.target.value)}
                  className="w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder={t('submit.title_placeholder')}
                  required
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{t('submit.priority.label')}</label>
                <div className="flex gap-4">
                  {Object.entries(priorities).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="priority"
                        value={key}
                        checked={data.priority === key}
                        onChange={e => setData('priority', e.target.value)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  {t('submit.description')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  rows="6"
                  className="w-full rounded-lg border-gray-300 border px-3 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                  placeholder={t('submit.description_placeholder')}
                  required
                />
                <p className="mt-2 text-xs text-gray-400">{data.description.length} / 10 {t('submit.min_chars')}</p>
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">{t('submit.evidence.label')}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors group cursor-pointer relative overflow-hidden">
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <i className="fa-solid fa-image text-3xl text-gray-400 group-hover:text-indigo-600 transition-colors mb-2 block"></i>
                    <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">{t('submit.evidence.photo')}</p>
                    {data.photo && <p className="text-xs text-indigo-600 font-bold mt-2 truncate">{data.photo.name}</p>}
                  </div>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors group cursor-pointer relative overflow-hidden">
                    <input type="file" accept="video/*" onChange={handleVideoChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <i className="fa-solid fa-clapperboard text-3xl text-gray-400 group-hover:text-indigo-600 transition-colors mb-2 block"></i>
                    <p className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">{t('submit.evidence.video')}</p>
                    {data.video && <p className="text-xs text-indigo-600 font-bold mt-2 truncate">{data.video.name}</p>}
                  </div>
                </div>
                {errors.photo && <p className="mt-1 text-sm text-red-600">{errors.photo}</p>}
                {errors.video && <p className="mt-1 text-sm text-red-600">{errors.video}</p>}
              </div>

              <div className="absolute opacity-0 pointer-events-none" tabIndex={-1} aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  autoComplete="off"
                  value={data.website}
                  onChange={e => setData('website', e.target.value)}
                  tabIndex={-1}
                />
              </div>

              {!user && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-start gap-3">
                  <i className="fa-solid fa-circle-info text-indigo-600 mt-0.5"></i>
                  <p className="text-sm text-gray-600 font-medium">{t('submit.anonymous_note')}</p>
                </div>
              )}

              {user && (
                <label className="flex items-center gap-4 cursor-pointer group border-t border-gray-200 pt-6">
                  <div
                    onClick={() => setData('is_anonymous', !data.is_anonymous)}
                    className={`relative w-14 h-8 rounded-full transition-colors duration-300 ease-in-out ${data.is_anonymous ? 'bg-indigo-600' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center ${data.is_anonymous ? 'translate-x-6' : 'translate-x-0'}`}>
                      {data.is_anonymous && <i className="fa-solid fa-eye-slash text-sm text-indigo-600"></i>}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">{t('submit.anonymous')}</span>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">Your identity is hidden from peers.</p>
                  </div>
                </label>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">Review Summary</h3>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
                <div><span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium block mb-1">Title</span> <span className="font-bold text-gray-900 text-lg">{data.title}</span></div>
                <div><span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium block mb-1">Priority</span> <span className="font-bold text-indigo-600">{priorities[data.priority]}</span></div>
                <div><span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium block mb-1">Description</span> <span className="font-medium text-gray-600 leading-relaxed">{data.description}</span></div>
                <div><span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium block mb-1">Anonymous Mode</span> <span className="font-bold text-gray-900">{data.is_anonymous ? 'Yes' : 'No'}</span></div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(step - 1)}
                className="px-6 py-2.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                Back
              </button>
            ) : <div />}

            {step < 2 ? (
              <button type="button" onClick={() => canProceed() && setStep(step + 1)} disabled={!canProceed()}
                className="px-8 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none">
                Next Step
              </button>
            ) : (
              <button type="submit" disabled={processing}
                className="px-8 py-2.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none">
                <i className="fa-solid fa-paper-plane text-sm"></i>
                {processing ? t('submit.submitting') : t('submit.submit_btn')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  if (user) {
      return <AuthenticatedLayout header={t('submit.title')}>{content}</AuthenticatedLayout>;
  }

  return content;
}