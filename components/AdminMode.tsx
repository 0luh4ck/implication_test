'use client';

import { useState, useEffect } from 'react';
import { supabase, QuizAttempt } from '@/lib/supabase';
import { questions } from '@/data/questions';

interface AdminModeProps {
    onBack: () => void;
}

export default function AdminMode({ onBack }: AdminModeProps) {
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

    useEffect(() => {
        fetchAttempts();
    }, []);

    const fetchAttempts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('Results')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching attempts:', error);
            } else {
                setAttempts(data || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPercentage = (score: number) => {
        return Math.round((score / questions.length) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                            Dashboard Admin
                        </h1>
                        <p className="text-gray-400 mt-1">Gérez et consultez les performances des étudiants</p>
                    </div>
                    <button
                        onClick={onBack}
                        className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/10">
                                        <th className="px-6 py-4 text-gray-300 font-semibold">Étudiant</th>
                                        <th className="px-6 py-4 text-gray-300 font-semibold">Date</th>
                                        <th className="px-6 py-4 text-gray-300 font-semibold">Score</th>
                                        <th className="px-6 py-4 text-gray-300 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {attempts.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                                Aucun résultat trouvé pour le moment.
                                            </td>
                                        </tr>
                                    ) : (
                                        attempts.map((attempt) => (
                                            <tr
                                                key={attempt.id}
                                                onClick={() => setSelectedAttempt(attempt)}
                                                className="hover:bg-white/5 cursor-pointer transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-white group-hover:text-purple-400 transition-colors">
                                                        {attempt.prenom} {attempt.nom}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400">
                                                    {attempt.created_at ? new Date(attempt.created_at).toLocaleDateString('fr-FR', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPercentage(attempt.score) >= 70
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : getPercentage(attempt.score) >= 40
                                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                                : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {attempt.score} / {questions.length} ({getPercentage(attempt.score)}%)
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-purple-400 hover:text-purple-300 font-medium">
                                                        Voir Détails
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal Détails */}
                {selectedAttempt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-gray-900 border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Détails du test : {selectedAttempt.prenom} {selectedAttempt.nom}
                                    </h2>
                                    <p className="text-purple-400 font-semibold">
                                        Score Final : {selectedAttempt.score} / {questions.length} ({getPercentage(selectedAttempt.score)}%)
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedAttempt(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto space-y-6 bg-gray-900/50">
                                {questions.map((q, idx) => {
                                    const userAns = selectedAttempt.user_answers.find(ua => ua.questionId === q.id);
                                    const isCorrect = userAns?.selectedAnswer === q.correctAnswer;

                                    return (
                                        <div key={q.id} className={`p-4 rounded-xl border-l-4 ${isCorrect ? 'bg-green-500/5 border-green-500' : 'bg-red-500/5 border-red-500'
                                            }`}>
                                            <h4 className="text-white font-semibold mb-3">
                                                {idx + 1}. {q.question}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {q.options.map((opt, optIdx) => {
                                                    if (!opt) return null;
                                                    const isUserSelected = userAns?.selectedAnswer === optIdx;
                                                    const isRightAnswer = q.correctAnswer === optIdx;

                                                    let cardStyles = "p-3 rounded-lg border text-sm ";
                                                    if (isUserSelected && isRightAnswer) {
                                                        cardStyles += "bg-green-500/20 border-green-500 text-green-200";
                                                    } else if (isUserSelected && !isRightAnswer) {
                                                        cardStyles += "bg-red-500/20 border-red-500 text-red-200";
                                                    } else if (isRightAnswer) {
                                                        cardStyles += "bg-white/5 border-green-500/50 text-green-200/70";
                                                    } else {
                                                        cardStyles += "bg-white/5 border-white/5 text-gray-400";
                                                    }

                                                    return (
                                                        <div key={optIdx} className={cardStyles}>
                                                            <div className="flex justify-between items-center">
                                                                <span>{opt}</span>
                                                                {isUserSelected && (
                                                                    <span className="text-[10px] uppercase font-bold ml-2">Choisi</span>
                                                                )}
                                                                {isRightAnswer && !isUserSelected && (
                                                                    <span className="text-[10px] uppercase font-bold ml-2 opacity-50">Correction</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end">
                                <button
                                    onClick={() => setSelectedAttempt(null)}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
