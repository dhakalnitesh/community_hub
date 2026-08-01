import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CreateSubject({ semesters }) {
    const [form, setForm] = useState({
        semester_id: semesters.length > 0 ? semesters[0].id : '',
        name: '',
        code: '',
        description: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.subjects.store'), form);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Subject" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Subject</h1>
                        <p className="text-sm text-gray-500 mt-1">Add a new subject to a semester.</p>
                    </div>
                    <Link href={route('admin.subjects.index')} className="text-sm text-indigo-600 hover:underline">
                        Back to Subjects
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3.5 bg-slate-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Subject Details</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="semester_id" value="Semester" />
                            <select
                                id="semester_id"
                                value={form.semester_id}
                                onChange={(e) => setForm({ ...form, semester_id: e.target.value })}
                                className="w-full rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required
                            >
                                <option value="">Select a semester</option>
                                {semesters.map((sem) => (
                                    <option key={sem.id} value={sem.id}>{sem.name} ({sem.institution?.name})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="name" value="Subject Name" />
                            <TextInput
                                id="name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. Data Structures & Algorithms"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="code" value="Code" />
                            <TextInput
                                id="code"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value })}
                                placeholder="e.g. CSE202"
                                className="font-mono"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={form.is_active}
                                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label>
                        </div>
                        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                            <Link href={route('admin.subjects.index')} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </Link>
                            <PrimaryButton type="submit">
                                <i className="fa-solid fa-plus mr-2 text-xs"></i> Create Subject
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
