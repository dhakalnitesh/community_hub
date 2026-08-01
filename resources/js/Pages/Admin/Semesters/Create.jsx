import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function CreateSemester() {
    const [form, setForm] = useState({
        name: '',
        academic_year: new Date().getFullYear().toString(),
        invite_code: '',
        is_active: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.semesters.store'), form);
    };

    const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = Math.floor(Math.random() * 9000) + 1000;
        let code = '';
        for (let i = 0; i < 3; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
        setForm({ ...form, invite_code: code + nums });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Semester" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Semester</h1>
                        <p className="text-sm text-gray-500 mt-1">Set up a new semester for your institution.</p>
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
                                placeholder="e.g. First Semester"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="academic_year" value="Academic Year" />
                            <TextInput
                                id="academic_year"
                                value={form.academic_year}
                                onChange={(e) => setForm({ ...form, academic_year: e.target.value })}
                                placeholder="e.g. 2026"
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="invite_code" value="Invite Code" />
                            <div className="flex gap-2">
                                <TextInput
                                    id="invite_code"
                                    value={form.invite_code}
                                    onChange={(e) => setForm({ ...form, invite_code: e.target.value })}
                                    placeholder="e.g. ABC1234"
                                    className="flex-1 font-mono"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={generateCode}
                                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <i className="fa-solid fa-dice text-xs"></i> Generate
                                </button>
                            </div>
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
                                <i className="fa-solid fa-plus mr-2 text-xs"></i> Create Semester
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
