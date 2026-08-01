import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

export default function EditSubject({ subject, teachers }) {
    const [form, setForm] = useState({
        name: subject.name,
        code: subject.code || '',
        description: subject.description || '',
        is_active: subject.is_active,
    });
    const [teacherId, setTeacherId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('admin.subjects.update', subject.id), form);
    };

    const handleAssignTeacher = (e) => {
        e.preventDefault();
        if (!teacherId) return;
        router.post(route('admin.subjects.teachers.assign', subject.id), {
            teacher_id: teacherId,
        });
        setTeacherId('');
    };

    const handleRemoveTeacher = (teacherId) => {
        if (confirm('Remove this teacher from the subject?')) {
            router.delete(route('admin.subjects.teachers.remove', [subject.id, teacherId]));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Subject" />

            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Subject</h1>
                        <p className="text-sm text-gray-500 mt-1">Update subject details and manage teachers.</p>
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
                            <InputLabel htmlFor="name" value="Subject Name" />
                            <TextInput
                                id="name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="code" value="Code" />
                            <TextInput
                                id="code"
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value })}
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
                                <i className="fa-solid fa-check mr-2 text-xs"></i> Save Changes
                            </PrimaryButton>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3.5 bg-slate-50 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Assigned Teachers</h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-2 mb-6">
                            {subject.teachers && subject.teachers.length > 0 ? (
                                subject.teachers.map((teacher) => (
                                    <div key={teacher.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold uppercase">
                                                {teacher.name?.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                                                <p className="text-xs text-gray-500">{teacher.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveTeacher(teacher.id)}
                                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <i className="fa-solid fa-trash text-xs"></i> Remove
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 mb-6">No teachers assigned yet.</p>
                            )}
                        </div>

                        <form onSubmit={handleAssignTeacher} className="flex flex-col sm:flex-row gap-2">
                            <select
                                value={teacherId}
                                onChange={(e) => setTeacherId(e.target.value)}
                                className="flex-1 rounded-lg border-slate-300 px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            >
                                <option value="">Select a teacher</option>
                                {(teachers || []).map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>{teacher.name} ({teacher.email})</option>
                                ))}
                            </select>
                            <PrimaryButton type="submit">
                                <i className="fa-solid fa-user-plus mr-2 text-xs"></i> Assign
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
