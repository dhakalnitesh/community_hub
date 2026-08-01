import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-white flex">
            <Head title="EduVoice - Register" />

            {/* Left Side - Visual/Branding (Hidden on small screens) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden items-center justify-center">
                {/* Decorative background elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 opacity-90 z-0" />
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMSIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==')] z-0 [background-size:24px_24px]" />
                
                {/* Glowing Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500 blur-[120px] opacity-40 z-0 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400 blur-[120px] opacity-30 z-0" />

                <div className="relative z-10 px-12 max-w-lg text-white">
                    <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                        <span className="flex h-2 w-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-50">GMC Hackathon 2026</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        Empowering Education <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Through Technology.</span>
                    </h1>
                    
                    <p className="text-indigo-100/90 text-lg leading-relaxed mb-10 font-medium">
                        Join EduVoice to access anonymous Q&A, seamless classroom management, and a safer environment for students to speak up.
                    </p>

                    <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-white/10">
                        <div>
                            <div className="font-bold text-3xl text-white mb-1.5">100%</div>
                            <div className="text-sm font-medium text-indigo-200">Anonymous safety</div>
                        </div>
                        <div>
                            <div className="font-bold text-3xl text-white mb-1.5">24/7</div>
                            <div className="text-sm font-medium text-indigo-200">Collaborative learning</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-gray-50/50">
                <div className="w-full max-w-md">
                    
                    {/* Mobile Logo (visible only on small screens) */}
                    <div className="lg:hidden mb-8 flex justify-center">
                        <Link href="/" className="inline-flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                    <path d="M2 17l10 5 10-5" />
                                    <path d="M2 12l10 5 10-5" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold text-gray-900 tracking-tight">
                                EduVoice
                            </span>
                        </Link>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-200 p-8 sm:p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h2>
                            <p className="text-sm text-gray-500 font-medium">Please enter your details to register.</p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        placeholder="John Doe"
                                        autoComplete="name"
                                        autoFocus
                                        required
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 font-medium"
                                    />
                                </div>
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Email Address */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        placeholder="name@example.com"
                                        autoComplete="username"
                                        required
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 font-medium"
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        required
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full pl-11 pr-12 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 015.682 1.933m4.05 4.05c1.17 1.254 2.016 2.766 2.45 4.417-1.275 4.057-5.065 7-9.542 7-1.127 0-2.204-.187-3.21-.527M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        required
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full pl-11 pr-12 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 font-medium"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 015.682 1.933m4.05 4.05c1.17 1.254 2.016 2.766 2.45 4.417-1.275 4.057-5.065 7-9.542 7-1.127 0-2.204-.187-3.21-.527M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group mt-2"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registering...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 text-center text-sm font-medium text-gray-500">
                        Already have an account?{' '}
                        <Link
                            href={route('login')}
                            className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
