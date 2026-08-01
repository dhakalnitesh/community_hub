import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function EditSemester({ semester }) {
    const [form, setForm] = useState({
        name: semester.name,
        academic_year: semester.academic_year || '',
        invite_code: semester.invite_code,
        is_active: semester.is_active,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('admin.semesters.update', semester.id), form);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Semester" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Semester</h1>
                        <p className="text-sm text-gray-500 mt-1">Update the semester details.</p>
                    </div>
                    <Link href={route('admin.semesters.index')} className="text-sm text-indigo-600 hover:underline">
                        Back to Semesters
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3.5 bg-slate-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Semester Details</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="name" value="Semester Name" />
                            <TextInput
                                id="name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="academic_year" value="Academic Year" />
                            <TextInput
                                id="academic_year"
                                value={form.academic_year}
                                onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="invite_code" value="Invite Code" />
                            <TextInput
                                id="invite_code"
                                value={form.invite_code}
                                onChange={(e) => setForm({ ...form, invite_code: e.target.value })}
                                className="font-mono"
                                required
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
                            <Link href={route('admin.semesters.index')} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </Link>
                            <PrimaryButton type="submit">
                                <i className="fa-solid fa-check mr-2 text-xs"></i> Save Changes
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
