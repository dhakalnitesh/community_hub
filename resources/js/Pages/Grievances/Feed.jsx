import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useLanguage } from '../../Context/LanguageContext';
import ComplaintCard from '../../Components/Grievances/ComplaintCard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TrackGrievanceModal from '@/Pages/Grievances/TrackGrievanceModal';
import { useState } from 'react';

export default function Feed({ grievances, filters }) {
  const { t, lang } = useLanguage();
  const isNp = lang === 'np';
  const { auth } = usePage().props;
  const user = auth?.user;

  const [trackOpen, setTrackOpen] = useState(false);

  const content = (
    <div className="min-h-screen bg-gray-50">
      <Head title={`${t('nav.feed')}`} />

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden flex flex-col gap-3">
        <button
          onClick={() => setTrackOpen(true)}
          className="w-12 h-12 bg-white text-gray-700 border border-gray-300 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
          title="Track Grievance"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <Link
          href={route('grievances.create')}
          className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-all hover:scale-110 active:scale-95"
          title="Submit Grievance"
        >
          <i className="fa-solid fa-pen-to-square text-lg"></i>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isNp ? 'उजुरी फीड' : 'Community Grievances'}
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-xl">
              {isNp ? 'विद्यार्थीहरूले रिपोर्ट गरेका उजुरीहरू' : 'Browse and track issues reported by students. Transparency and quick resolutions.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTrackOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <i className="fa-solid fa-magnifying-glass text-xs text-gray-400"></i>
              Track Grievance
            </button>
            <Link
              href={route('grievances.create')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              <i className="fa-solid fa-plus text-xs"></i>
              Submit Grievance
            </Link>
          </div>
        </div>

        {grievances.data.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 mx-auto rounded-xl flex items-center justify-center mb-4 border border-gray-100 text-gray-400">
                <i className="fa-solid fa-inbox text-2xl"></i>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">
              {isNp ? 'कुनै उजुरी भेटिएन' : 'No grievances reported yet.'}
            </h3>
            <p className="text-xs text-gray-500">
                Be the first to report an issue or concern.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grievances.data.map((grievance) => (
              <ComplaintCard key={grievance.id} grievance={grievance} />
            ))}
          </div>
        )}
      </div>

      <TrackGrievanceModal
        open={trackOpen}
        onClose={() => setTrackOpen(false)}
      />
    </div>
  );

  // If user is authenticated, wrap with AuthenticatedLayout so it feels like part of the Student/Teacher Panel
  if (user) {
      return <AuthenticatedLayout>{content}</AuthenticatedLayout>;
  }

  // Otherwise, just return the content (for guests)
  return content;
}
