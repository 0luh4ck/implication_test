'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface ExoModeProps {
    onBack: () => void;
}

export default function ExoMode({ onBack }: ExoModeProps) {
    const [step, setStep] = useState<'info' | 'editor' | 'success'>('info');
    const [userInfo, setUserInfo] = useState({ nom: '', prenom: '' });
    const [code, setCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userInfo.nom && userInfo.prenom) {
            setStep('editor');
        }
    };

    const handleSubmit = async () => {
        if (!code.trim()) {
            alert("Veuillez coller votre code avant de soumettre.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('Exercises')
                .insert([{
                    nom: userInfo.nom,
                    prenom: userInfo.prenom,
                    code: code
                }]);

            if (error) throw error;
            setStep('success');
        } catch (error) {
            console.error('Error submitting exercise:', error);
            alert("Une erreur est survenue lors de la soumission. Vérifiez votre connexion.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === 'info') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <button onClick={onBack} className="mb-6 text-blue-300 hover:text-blue-100 flex items-center gap-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour
                    </button>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                        <div className="flex justify-center mb-6">
                            <Image src="/logo.png" alt="Logo" width={64} height={64} className="object-contain" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">Espace Exercices</h2>
                        <form onSubmit={handleInfoSubmit} className="space-y-6">
                            <input
                                type="text"
                                value={userInfo.nom}
                                onChange={(e) => setUserInfo({ ...userInfo, nom: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nom"
                                required
                            />
                            <input
                                type="text"
                                value={userInfo.prenom}
                                onChange={(e) => setUserInfo({ ...userInfo, prenom: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Prénom"
                                required
                            />
                            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                                Accéder à l'éditeur
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'editor') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6 text-blue-300">
                        <h2 className="text-2xl font-bold text-white">Soumission de Code</h2>
                        <span className="font-medium">{userInfo.prenom} {userInfo.nom}</span>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
                        <p className="text-gray-300 mb-6">Collez votre code Solidity ou vos exercices ci-dessous. Assurez-vous que votre code est complet avant de soumettre.</p>

                        <div className="relative bg-black/40 rounded-xl border border-white/10 overflow-hidden mb-8">
                            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-white/5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                <span className="ml-4 text-[10px] text-gray-500 font-mono uppercase tracking-widest">Code Editor</span>
                            </div>
                            <textarea
                                className="w-full h-[500px] p-4 bg-transparent text-blue-100 font-mono text-sm focus:outline-none resize-none"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="// Collez votre code ici..."
                                spellCheck={false}
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep('info')}
                                className="flex-1 py-3 rounded-lg font-semibold border border-white/10 text-white hover:bg-white/5 transition-colors"
                            >
                                Modifier Infos
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-[2] py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                {isSubmitting ? 'Envoi en cours...' : 'Soumettre le Travail'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Code Envoyé !</h2>
                <p className="text-blue-200 mb-8">Merci {userInfo.prenom}, votre travail a été enregistré avec succès.</p>
                <button onClick={onBack} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                    Retour à l'accueil
                </button>
            </div>
        </div>
    );
}
