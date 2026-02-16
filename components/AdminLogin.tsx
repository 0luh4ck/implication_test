'use client';

import { useState } from 'react';
import Image from 'next/image';

interface AdminLoginProps {
    onLogin: () => void;
    onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Le mot de passe demandé par l'utilisateur
        if (password === "Marv's_8002") {
            onLogin();
        } else {
            setError(true);
            setTimeout(() => setError(false), 3000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <button
                    onClick={onBack}
                    className="mb-6 text-purple-300 hover:text-purple-100 flex items-center gap-2 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour
                </button>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="bg-white/5 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                            <Image src="/logo.png" alt="Logo" width={64} height={64} className="object-contain" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2 text-center">Accès Admin</h2>
                    <p className="text-purple-200 mb-8 text-center text-sm">Veuillez saisir le mot de passe pour continuer</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-purple-200 mb-2 font-medium">Mot de passe</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg bg-white/5 border ${error ? 'border-red-500 animate-shake' : 'border-white/10'} text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                                placeholder="••••••••"
                                required
                            />
                            {error && (
                                <p className="text-red-400 text-xs mt-2">Mot de passe incorrect. Réessayez.</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                        >
                            Se connecter
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
