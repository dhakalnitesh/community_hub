import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Briefcase, Code, ExternalLink, Plus, Loader2 } from 'lucide-react';
import ReviewSection from './Partials/ReviewSection';

export default function Showcase({ auth, projects }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        tech_stack: '',
        github_url: '',
        live_demo_url: '',
    });

    const isStudent = auth.user.roles?.includes('student') || true; // Adjust based on Spatie roles

    const submit = (e) => {
        e.preventDefault();
        post(route('projects.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight flex items-center gap-2">
                        <Briefcase className="text-indigo-600" /> Campus Talent Showcase
                    </h2>
                    {isStudent && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 transition"
                        >
                            <Plus size={16} className="mr-1" /> Add Project
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Talent Showcase" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* Upload Form (Toggleable) */}
                {showForm && (
                    <div className="bg-white p-6 shadow sm:rounded-lg border-t-4 border-indigo-500 animate-in fade-in slide-in-from-top-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Publish Your Project</h3>
                        <form onSubmit={submit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                    <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tech Stack (Comma separated)</label>
                                    <input type="text" placeholder="e.g. Laravel, React, MySQL" value={data.tech_stack} onChange={e => setData('tech_stack', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                    {errors.tech_stack && <p className="text-sm text-red-600 mt-1">{errors.tech_stack}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea rows="3" value={data.description} onChange={e => setData('description', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">GitHub URL (Optional)</label>
                                    <input type="url" value={data.github_url} onChange={e => setData('github_url', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Live Demo URL (Optional)</label>
                                    <input type="url" value={data.live_demo_url} onChange={e => setData('live_demo_url', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button type="submit" disabled={processing} className="inline-flex items-center px-4 py-2 bg-gray-900 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition">
                                    {processing ? <Loader2 className="animate-spin mr-2" size={16} /> : 'Publish to Showcase'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Project Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 group flex flex-col">
                            <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex flex-col justify-end">
                                <h3 className="text-xl font-bold text-white leading-tight">{project.title}</h3>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center gap-1">
                                        <Code size={12}/> Stack
                                    </span>
                                    <p className="text-xs font-medium text-gray-500 truncate">{project.tech_stack}</p>
                                </div>
                                <p className="text-gray-600 text-sm flex-1 mb-4">{project.description}</p>
                                
                                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900">By {project.user.name}</span>
                                    <div className="flex gap-3 text-gray-400">
                                        {project.github_url && (
                                                <span className="text-sm font-semibold">GitHub</span>
                                        )}
                                        {project.live_demo_url && (
                                            <a href={project.live_demo_url} target="_blank" rel="noreferrer" className="hover:text-indigo-600 transition">
                                                <ExternalLink size={20} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <ReviewSection project={project} auth={auth} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}