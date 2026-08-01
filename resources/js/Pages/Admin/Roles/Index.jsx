import SuperAdminLayout from '@/Layouts/SuperAdminLayout';
import { Head, router } from '@inertiajs/react';
import DataTable from '@/Components/UI/DataTable';

const roles = [
    { value: 'super_admin', label: 'Super Admin', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { value: 'institution_admin', label: 'Inst. Admin', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { value: 'teacher', label: 'Teacher', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    { value: 'student', label: 'Student', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { value: 'user', label: 'User', color: 'bg-gray-100 text-gray-700 border-gray-200' },
];

function getRoleColor(role) {
    const r = roles.find((x) => x.value === role);
    return r ? r.color : roles[roles.length - 1].color;
}

export default function Index({ users }) {
    const handleRoleChange = (userId, newRole) => {
        router.put(route('admin.roles.update', userId), { role: newRole }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <SuperAdminLayout activeItem="Roles & Permissions">
            <Head title="Roles & Permissions" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manage Platform Roles</h1>
                        <p className="text-sm text-gray-500 mt-1">Assign and manage access levels for all registered users across the platform.</p>
                    </div>
                </div>

                <DataTable
                    rows={users.data || []}
                    searchableKeys={['name', 'email']}
                    defaultSort={{ key: 'name', dir: 'asc' }}
                    searchPlaceholder="Search users by name or email…"
                    emptyText="No users found."
                    columns={[
                        { key: 'user', label: 'User', sortable: true },
                        { key: 'email', label: 'Email' },
                        { key: 'role', label: 'Current Role', sortable: true },
                        { key: 'assign', label: 'Assign New Role', align: 'right' },
                    ]}
                    renderCell={(key, row) => {
                        if (key === 'user') {
                            return (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs uppercase">
                                        {row.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{row.name}</p>
                                        <p className="text-[10px] text-gray-500">Joined {new Date(row.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            );
                        }
                        if (key === 'role') {
                            return (
                                <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleColor(row.role)}`}>
                                    {row.role ? row.role.replace('_', ' ') : 'None'}
                                </span>
                            );
                        }
                        if (key === 'assign') {
                            return (
                                <div className="flex justify-end">
                                    <select
                                        value={row.role || 'user'}
                                        onChange={(e) => handleRoleChange(row.id, e.target.value)}
                                        className="w-40 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                    >
                                        {roles.map((r) => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                </div>
                            );
                        }
                    }}
                />
            </div>
        </SuperAdminLayout>
    );
}
