import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/UI/DataTable';
import { useState } from 'react';

const roleStyles = {
    super_admin: 'bg-rose-50 text-rose-700 border-rose-200',
    institution_admin: 'bg-purple-50 text-purple-700 border-purple-200',
    teacher: 'bg-sky-50 text-sky-700 border-sky-200',
    student: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

function formatRoleName(role) {
    if (!role) return 'Student';
    return role.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatDate(date) {
    return new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Index({ users, totalUsers, roleCounts }) {
    const [roleFilter, setRoleFilter] = useState('');

    const rows = roleFilter ? users.data.filter((u) => u.role === roleFilter) : users.data;

    const roleCards = [
        { name: 'Super Admins', value: roleCounts?.super_admin || 0, color: 'bg-rose-50 text-rose-600', label: 'SA' },
        { name: 'Inst. Admins', value: roleCounts?.institution_admin || 0, color: 'bg-purple-50 text-purple-600', label: 'IA' },
        { name: 'Teachers', value: roleCounts?.teacher || 0, color: 'bg-sky-50 text-sky-600', label: 'T' },
        { name: 'Students', value: roleCounts?.student || 0, color: 'bg-emerald-50 text-emerald-600', label: 'S' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Users List" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                        <p className="text-sm text-gray-500 mt-1">View and manage all registered platform users and role assignments.</p>
                    </div>
                    <span className="inline-flex px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full text-xs font-semibold">
                        Total Users: {totalUsers}
                    </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {roleCards.map((card) => (
                        <div key={card.name} className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-500">{card.name}</p>
                                <p className="text-xl font-bold text-gray-900 mt-0.5">{card.value}</p>
                            </div>
                            <div className={`w-9 h-9 rounded-lg ${card.color} flex items-center justify-center font-bold text-xs`}>
                                {card.label}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between gap-3">
                    <label className="text-xs font-medium text-gray-600 shrink-0">Filter Role:</label>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="">All Roles</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="institution_admin">Institution Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>
                </div>

                <DataTable
                    rows={rows}
                    searchableKeys={['name', 'email']}
                    defaultSort={{ key: 'created_at', dir: 'desc' }}
                    searchPlaceholder="Search by name or email…"
                    emptyText="No users found matching the selected filters."
                    columns={[
                        { key: 'user', label: 'User', sortable: true },
                        { key: 'role', label: 'Role', sortable: true },
                        { key: 'verification', label: 'Verification' },
                        { key: 'created_at', label: 'Joined Date', sortable: true },
                    ]}
                    renderCell={(key, row) => {
                        if (key === 'user') {
                            return (
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-sky-600 text-white font-semibold text-xs flex items-center justify-center shrink-0">
                                        {row.name ? row.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{row.name}</p>
                                        <p className="text-xs text-gray-500">{row.email}</p>
                                    </div>
                                </div>
                            );
                        }
                        if (key === 'role') {
                            return (
                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${roleStyles[row.role] || roleStyles.student}`}>
                                    {formatRoleName(row.role)}
                                </span>
                            );
                        }
                        if (key === 'verification') {
                            return row.email_verified_at ? (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <i className="fa-solid fa-circle-check text-[10px]"></i> Verified
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                    Unverified
                                </span>
                            );
                        }
                        if (key === 'created_at') {
                            return <span className="text-xs text-gray-600">{formatDate(row.created_at)}</span>;
                        }
                    }}
                />
            </div>
        </AuthenticatedLayout>
    );
}
