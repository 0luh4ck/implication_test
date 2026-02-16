'use client';

import { useState, useEffect } from 'react';
import { questions as originalQuestions, Question } from '@/data/questions';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface StudentModeProps {
    onBack: () => void;
}

interface UserInfo {
    nom: string;
    prenom: string;
}

export default function StudentMode({ onBack }: StudentModeProps) {
    const [step, setStep] = useState<'info' | 'quiz' | 'results'>('info');
    const [userInfo, setUserInfo] = useState<UserInfo>({ nom: '', prenom: '' });
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<{ questionId: number; selectedAnswer?: number; codeAnswer?: string }[]>([]);
    const [score, setScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes in seconds
    const [checkingAccess, setCheckingAccess] = useState(false);

    const shuffleArray = (array: any[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (userInfo.nom && userInfo.prenom) {
            setCheckingAccess(true);
            try {
                // Check if user already submitted
                const { data, error } = await supabase
                    .from('Results')
                    .select('id')
                    .ilike('nom', userInfo.nom.trim())
                    .ilike('prenom', userInfo.prenom.trim())
                    .maybeSingle();

                if (data) {
                    alert(`Désolé ${userInfo.prenom}, vous avez déjà soumis ce quiz. L'accès multiple est restreint.`);
                    setCheckingAccess(false);
                    return;
                }

                const pool = originalQuestions.filter(q => q.id !== 31);
                const shuffled = shuffleArray(pool);
                const selected = shuffled.slice(0, 30);

                const q31 = originalQuestions.find(q => q.id === 31);
                if (q31) {
                    setShuffledQuestions([...selected, q31]);
                } else {
                    setShuffledQuestions(selected);
                }

                setStep('quiz');
                setTimeLeft(2400); // Reset timer to 40 mins
            } catch (err) {
                console.error("Error checking access:", err);
                // Fallback: allow entry if check fails, but log it
                setStep('quiz');
            } finally {
                setCheckingAccess(false);
            }
        }
    };

    const handleAnswer = (questionId: number, selectedAnswer?: number, codeAnswer?: string) => {
        setAnswers(prev => {
            const existing = prev.find(a => a.questionId === questionId);
            if (existing) {
                return prev.map(a => a.questionId === questionId ? { ...a, selectedAnswer, codeAnswer } : a);
            }
            return [...prev, { questionId, selectedAnswer, codeAnswer }];
        });
    };

    const calculateScore = () => {
        let currentScore = 0;
        answers.forEach(ans => {
            const q = originalQuestions.find(q => q.id === ans.questionId);
            if (q) {
                if (q.type === 'mcq' && ans.selectedAnswer === q.correctAnswer) {
                    currentScore++;
                } else if (q.type === 'coding' && ans.codeAnswer) {
                    const code = ans.codeAnswer.toLowerCase();
                    const allKeywordsPresent = q.expectedKeywords?.every(kw =>
                        code.includes(kw.toLowerCase())
                    );
                    if (allKeywordsPresent) currentScore++;
                }
            }
        });
        return currentScore;
    };

    // Countdown effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === 'quiz' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && step === 'quiz') {
            // Auto-submit when time is up
            const finalScore = calculateScore();
            setScore(finalScore);
            saveResults(finalScore, answers);
            alert("Temps écoulé ! Votre travail a été soumis automatiquement.");
        }
        return () => clearInterval(timer);
    }, [step, timeLeft]);

    const handleNextQuestion = () => {
        if (currentQuestion < shuffledQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            const finalScore = calculateScore();
            setScore(finalScore);
            saveResults(finalScore, answers);
        }
    };

    const saveResults = async (finalScore: number, finalAnswers: any[]) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('Results')
                .insert([{
                    nom: userInfo.nom,
                    prenom: userInfo.prenom,
                    score: finalScore,
                    user_answers: finalAnswers
                }]);

            if (error) throw error;
        } catch (error) {
            console.error('Error saving to Supabase:', error);
            const localResults = JSON.parse(localStorage.getItem('quiz_results_backup') || '[]');
            localResults.push({
                nom: userInfo.nom,
                prenom: userInfo.prenom,
                score: finalScore,
                user_answers: finalAnswers,
                date: new Date().toISOString()
            });
            localStorage.setItem('quiz_results_backup', JSON.stringify(localResults));
            alert('Résultats sauvegardés localement (erreur de connexion).');
        } finally {
            setIsSubmitting(false);
            setStep('results');
        }
    };

    if (step === 'info') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <button onClick={onBack} className="mb-6 text-purple-300 hover:text-purple-100 flex items-center gap-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour
                    </button>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                        <div className="flex justify-center mb-6">
                            <Image src="/logo.png" alt="Logo" width={64} height={64} className="object-contain" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">Informations Étudiant</h2>
                        <form onSubmit={handleInfoSubmit} className="space-y-6">
                            <input
                                type="text"
                                value={userInfo.nom}
                                onChange={(e) => setUserInfo({ ...userInfo, nom: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Nom"
                                required
                            />
                            <input
                                type="text"
                                value={userInfo.prenom}
                                onChange={(e) => setUserInfo({ ...userInfo, prenom: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Prénom"
                                required
                            />
                            <button
                                type="submit"
                                disabled={checkingAccess}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                {checkingAccess ? 'Vérification...' : 'Commencer le Quiz'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'quiz') {
        const q = shuffledQuestions[currentQuestion];
        if (!q) return null;
        const currentAnswer = answers.find(a => a.questionId === q.id);
        const canProceed = q.type === 'coding' ? true : currentAnswer?.selectedAnswer !== undefined;

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-6 text-purple-300">
                        <div className="flex flex-col">
                            <span className="text-sm opacity-70">Question {currentQuestion + 1} / {shuffledQuestions.length}</span>
                            <span className="font-bold">{userInfo.prenom} {userInfo.nom}</span>
                        </div>

                        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${timeLeft < 300 ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-white/5 border-white/10'}`}>
                            <svg className={`w-5 h-5 ${timeLeft < 300 ? 'text-red-400' : 'text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className={`font-mono text-xl font-bold ${timeLeft < 300 ? 'text-red-400' : 'text-white'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>

                    <div className="w-full bg-white/10 h-2 rounded-full mb-8 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500" style={{ width: `${((currentQuestion + 1) / shuffledQuestions.length) * 100}%` }} />
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-white leading-tight">{q.question}</h3>
                            <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-lg text-xs font-bold border border-purple-500/30">
                                {q.type === 'coding' ? 'SOLIDITY' : 'MCQ'}
                            </span>
                        </div>

                        {q.type === 'coding' ? (
                            <div className="relative bg-black/40 rounded-xl border border-white/10 overflow-hidden mt-6">
                                <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-white/5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                                </div>
                                <textarea
                                    className="w-full h-64 p-4 bg-transparent text-purple-100 font-mono text-sm focus:outline-none resize-none"
                                    value={currentAnswer?.codeAnswer ?? q.codeTemplate ?? ''}
                                    onChange={(e) => handleAnswer(q.id, undefined, e.target.value)}
                                    placeholder="// Votre code Solidity..."
                                    spellCheck={false}
                                />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 mt-8">
                                {q.options?.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(q.id, i)}
                                        className={`p-4 rounded-xl text-left border transition-all ${currentAnswer?.selectedAnswer === i ? 'bg-purple-600/40 border-purple-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${currentAnswer?.selectedAnswer === i ? 'bg-purple-500 text-white' : 'bg-white/10 text-purple-300'}`}>
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                            <span className="text-white">{opt}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        <button
                            onClick={handleNextQuestion}
                            disabled={!canProceed || isSubmitting}
                            className="mt-8 w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {currentQuestion < shuffledQuestions.length - 1 ? 'Question Suivante' : 'Terminer le Quiz'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-5xl font-bold text-white">
                    {Math.round((score / shuffledQuestions.length) * 100)}%
                </div>
                <h2 className="text-4xl font-bold text-white mb-2">Quiz Terminé !</h2>
                <p className="text-purple-200 text-xl mb-8">{userInfo.prenom} {userInfo.nom}</p>
                <div className="bg-white/5 rounded-lg p-6 mb-8 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    {score} / {shuffledQuestions.length}
                </div>
                <button onClick={onBack} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition-transform">
                    Retour à l'accueil
                </button>
            </div>
        </div>
    );
}
