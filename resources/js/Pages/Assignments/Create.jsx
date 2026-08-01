import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ subjects }) {
    const [form, setForm] = useState({
        subject_id: subjects.length > 0 ? subjects[0].id : '',
        title: '',
        description: '',
        max_score: '',
        due_date: '',
        allow_late_submission: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('assignments.store'), form);
    };

    const inputClass =
        'w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <AuthenticatedLayout>
            <Head title="Create Assignment" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Assignment</h1>
                        <p className="text-sm text-gray-500 mt-1">Add a new assignment for your students.</p>
                    </div>
                    <Link href={route('assignments.index')} className="text-sm text-indigo-600 hover:underline">
                        Back to Assignments
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3.5 bg-slate-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Assignment Details</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="subject_id" value="Subject" />
                            <select
                                id="subject_id"
                                value={form.subject_id}
                                onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                                className={inputClass}
                                required
                            >
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name} ({subject.semester?.name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <InputLabel htmlFor="title" value="Title" />
                            <TextInput
                                id="title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Sorting Algorithms Lab"
                                required
                                maxLength={255}
                            />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Description" />
                            <textarea
                                id="description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className={inputClass}
                                rows={5}
                                placeholder="Describe the assignment requirements..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="max_score" value="Max Score" />
                                <TextInput
                                    id="max_score"
                                    type="number"
                                    value={form.max_score}
                                    onChange={(e) => setForm({ ...form, max_score: e.target.value })}
                                    min="1"
                                    placeholder="e.g. 20"
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="due_date" value="Due Date" />
                                <TextInput
                                    id="due_date"
                                    type="date"
                                    value={form.due_date}
                                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="allow_late"
                                checked={form.allow_late_submission}
                                onChange={(e) => setForm({ ...form, allow_late_submission: e.target.checked })}
                                className="rounded border-slate-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            />
                            <label htmlFor="allow_late" className="text-sm font-medium text-gray-700">
                                Allow late submissions
                            </label>
                        </div>

                        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                            <Link
                                href={route('assignments.index')}
                                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton type="submit">
                                <i className="fa-solid fa-plus mr-2 text-xs"></i>
                                Create Assignment
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
