'use client';

import { useState, useEffect } from 'react';
import { questions as originalQuestions, Question } from '@/data/questions';
import { supabase } from '@/lib/supabase';

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
    const [userAnswers, setUserAnswers] = useState<{ questionId: number; selectedAnswer: number }[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Shuffle questions on start
    const shuffleArray = (array: any[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const handleInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userInfo.nom && userInfo.prenom) {
            setShuffledQuestions(shuffleArray(originalQuestions));
            setStep('quiz');
        }
    };

    const handleAnswerSelect = (answerIndex: number) => {
        setSelectedAnswer(answerIndex);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer === null) return;

        const newAnswers = [
            ...userAnswers,
            { questionId: shuffledQuestions[currentQuestion].id, selectedAnswer }
        ];
        setUserAnswers(newAnswers);

        if (currentQuestion < shuffledQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
        } else {
            // Calculate score
            const finalScore = newAnswers.reduce((acc, answer) => {
                const question = originalQuestions.find(q => q.id === answer.questionId);
                return acc + (question?.correctAnswer === answer.selectedAnswer ? 1 : 0);
            }, 0);
            setScore(finalScore);
            saveResults(finalScore, newAnswers);
        }
    };

    const saveResults = async (finalScore: number, answers: { questionId: number; selectedAnswer: number }[]) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('Results')
                .insert([
                    {
                        nom: userInfo.nom,
                        prenom: userInfo.prenom,
                        score: finalScore,
                        user_answers: answers
                    }
                ]);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error saving to Supabase, falling back to LocalStorage:', error);

            // Sauvegarde locale en cas d'échec Supabase
            const localResults = JSON.parse(localStorage.getItem('quiz_results_backup') || '[]');
            localResults.push({
                nom: userInfo.nom,
                prenom: userInfo.prenom,
                score: finalScore,
                user_answers: answers,
                date: new Date().toISOString()
            });
            localStorage.setItem('quiz_results_backup', JSON.stringify(localResults));

            alert('Note: Vos résultats ont été sauvegardés localement car la connexion à Supabase a échoué. Votre note est quand même enregistrée !');
        } finally {
            setIsSubmitting(false);
            setStep('results');
        }
    };

    if (step === 'info') {
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
                        <h2 className="text-3xl font-bold text-white mb-6">Informations Étudiant</h2>
                        <form onSubmit={handleInfoSubmit} className="space-y-6">
                            <div>
                                <label className="block text-purple-200 mb-2 font-medium">Nom</label>
                                <input
                                    type="text"
                                    value={userInfo.nom}
                                    onChange={(e) => setUserInfo({ ...userInfo, nom: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-purple-200 mb-2 font-medium">Prénom</label>
                                <input
                                    type="text"
                                    value={userInfo.prenom}
                                    onChange={(e) => setUserInfo({ ...userInfo, prenom: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="Votre prénom"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                            >
                                Commencer le Quiz
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'quiz') {
        const question = shuffledQuestions[currentQuestion];
        if (!question) return null; // Safety check
        const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-purple-300 font-medium">
                                Question {currentQuestion + 1} / {shuffledQuestions.length}
                            </span>
                            <span className="text-purple-300 font-medium">
                                {userInfo.prenom} {userInfo.nom}
                            </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                        <h3 className="text-2xl font-bold text-white mb-8">{question.question}</h3>
                        <div className="space-y-4">
                            {question.options.map((option, index) => (
                                option && (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-102 ${selectedAnswer === index
                                            ? 'bg-purple-600/30 border-purple-400 shadow-lg shadow-purple-500/30'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-400/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedAnswer === index
                                                    ? 'border-purple-400 bg-purple-500'
                                                    : 'border-white/30'
                                                    }`}
                                            >
                                                {selectedAnswer === index && (
                                                    <div className="w-3 h-3 rounded-full bg-white" />
                                                )}
                                            </div>
                                            <span className="text-white font-medium">{option}</span>
                                        </div>
                                    </button>
                                )
                            ))}
                        </div>

                        <button
                            onClick={handleNextQuestion}
                            disabled={selectedAnswer === null || isSubmitting}
                            className={`mt-8 w-full py-3 rounded-lg font-semibold transition-all duration-300 ${selectedAnswer === null || isSubmitting
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50'
                                }`}
                        >
                            {isSubmitting
                                ? 'Enregistrement...'
                                : currentQuestion < shuffledQuestions.length - 1
                                    ? 'Question Suivante'
                                    : 'Terminer le Quiz'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Results
    const totalQuestions = originalQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl text-center">
                    <div className="mb-6">
                        <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                            <span className="text-5xl font-bold text-white">{percentage}%</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2">Quiz Terminé !</h2>
                        <p className="text-purple-200 text-xl">
                            {userInfo.prenom} {userInfo.nom}
                        </p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-6 mb-8">
                        <p className="text-gray-300 text-lg mb-2">Votre Score</p>
                        <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            {score} / {totalQuestions}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={onBack}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                        >
                            Retour à l'accueil
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
