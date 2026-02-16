'use client';

import { useState, useEffect } from 'react';
import { supabase, QuizAttempt, ExerciseSubmission } from '@/lib/supabase';
import { questions } from '@/data/questions';

interface AdminModeProps {
    onBack: () => void;
}

export default function AdminMode({ onBack }: AdminModeProps) {
    const [view, setView] = useState<'quiz' | 'exo'>('quiz');
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [exercises, setExercises] = useState<ExerciseSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);
    const [selectedExo, setSelectedExo] = useState<ExerciseSubmission | null>(null);

    useEffect(() => {
        if (view === 'quiz') fetchAttempts();
        else fetchExercises();
    }, [view]);

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

    const fetchExercises = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('Exercises')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error) setExercises(data || []);
        } finally {
            setLoading(false);
        }
    };

    const getPercentage = (attempt: QuizAttempt) => {
        if (!attempt.user_answers || attempt.user_answers.length === 0) return 0;
        return Math.round((attempt.score / attempt.user_answers.length) * 100);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
                            Dashboard Admin
                        </h1>
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={() => setView('quiz')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${view === 'quiz' ? 'bg-purple-600 text-white' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                            >
                                Résultats Quiz
                            </button>
                            <button
                                onClick={() => setView('exo')}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${view === 'exo' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 border border-white/10'}`}
                            >
                                Travaux Exo
                            </button>
                        </div>
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
                                        {view === 'quiz' && <th className="px-6 py-4 text-gray-300 font-semibold">Score</th>}
                                        <th className="px-6 py-4 text-gray-300 font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {view === 'quiz' ? (
                                        attempts.length === 0 ? (
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
                                                        {attempt.created_at ? new Date(attempt.created_at).toLocaleString('fr-FR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPercentage(attempt) >= 70
                                                            ? 'bg-green-500/20 text-green-400'
                                                            : getPercentage(attempt) >= 40
                                                                ? 'bg-yellow-500/20 text-yellow-400'
                                                                : 'bg-red-500/20 text-red-400'
                                                            }`}>
                                                            {attempt.score} / {attempt.user_answers.length} ({getPercentage(attempt)}%)
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-purple-400 hover:text-purple-300 font-medium">
                                                            Voir Détails
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                    ) : (
                                        exercises.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                                    Aucun exercice soumis.
                                                </td>
                                            </tr>
                                        ) : (
                                            exercises.map((exo) => (
                                                <tr key={exo.id} onClick={() => setSelectedExo(exo)} className="hover:bg-blue-500/5 cursor-pointer transition-colors group">
                                                    <td className="px-6 py-4 font-medium text-white">{exo.prenom} {exo.nom}</td>
                                                    <td className="px-6 py-4 text-gray-400">
                                                        {exo.created_at ? new Date(exo.created_at).toLocaleString('fr-FR', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right"><button className="text-blue-400 font-medium">Voir Code</button></td>
                                                </tr>
                                            ))
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Modal Détails Quiz */}
                {selectedAttempt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-gray-900 border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        Détails du test : {selectedAttempt.prenom} {selectedAttempt.nom}
                                    </h2>
                                    <p className="text-purple-400 font-semibold">
                                        Score Final : {selectedAttempt.score} / {selectedAttempt.user_answers.length} ({getPercentage(selectedAttempt)}%)
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
                                {selectedAttempt.user_answers.map((ua, idx) => {
                                    const q = questions.find(q => q.id === ua.questionId);
                                    if (!q) return null;

                                    const isCoding = q.type === 'coding';
                                    let isCorrect = false;

                                    if (isCoding) {
                                        const code = ua.codeAnswer?.toLowerCase() || '';
                                        isCorrect = q.expectedKeywords?.every(kw => code.includes(kw.toLowerCase())) || false;
                                    } else {
                                        isCorrect = ua.selectedAnswer === q.correctAnswer;
                                    }

                                    return (
                                        <div key={ua.questionId} className={`p-4 rounded-xl border-l-4 ${isCorrect ? 'bg-green-500/5 border-green-500' : 'bg-red-500/5 border-red-500'}`}>
                                            <h4 className="text-white font-semibold mb-3">
                                                {idx + 1}. {q.question}
                                            </h4>

                                            {isCoding ? (
                                                <div className="bg-black/40 rounded-lg p-4 font-mono text-sm border border-white/10">
                                                    <div className="text-xs text-gray-500 mb-2 uppercase select-none">Code Soumis :</div>
                                                    <pre className="text-purple-200 whitespace-pre-wrap">{ua.codeAnswer || "// Aucun code soumis"}</pre>
                                                    {!isCorrect && q.expectedKeywords && (
                                                        <div className="mt-4 p-2 bg-red-500/10 rounded border border-red-500/20 text-xs text-red-400">
                                                            Mots-clés manquants ou incorrects.
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {q.options?.map((opt, optIdx) => {
                                                        const isUserSelected = ua.selectedAnswer === optIdx;
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
                                                                    {isUserSelected && <span className="text-[10px] uppercase font-bold ml-2">Choisi</span>}
                                                                    {isRightAnswer && !isUserSelected && <span className="text-[10px] uppercase font-bold ml-2 opacity-50">Correction</span>}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
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

                {/* Modal Détails Exo */}
                {selectedExo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <div className="bg-gray-900 border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{selectedExo.prenom} {selectedExo.nom}</h2>
                                    <p className="text-blue-400">Soumission Exercice Libre</p>
                                </div>
                                <button onClick={() => setSelectedExo(null)} className="p-2 hover:bg-white/10 rounded-full"><svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                            </div>
                            <div className="p-6 overflow-y-auto bg-black/20">
                                <pre className="text-blue-100 font-mono text-sm whitespace-pre-wrap">{selectedExo.code}</pre>
                            </div>
                            <div className="p-4 border-t border-white/10 bg-white/5 text-right text-gray-500 text-xs">
                                Envoyé le {new Date(selectedExo.created_at || '').toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
