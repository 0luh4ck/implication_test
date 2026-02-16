'use client';

import { useState } from 'react';
import Image from 'next/image';
import StudentMode from '@/components/StudentMode';
import AdminMode from '@/components/AdminMode';
import AdminLogin from '@/components/AdminLogin';

export default function Home() {
  const [mode, setMode] = useState<'select' | 'student' | 'admin'>('select');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  if (mode === 'student') {
    return <StudentMode onBack={() => setMode('select')} />;
  }

  if (mode === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLogin={() => setIsAdminAuthenticated(true)}
          onBack={() => setMode('select')}
        />
      );
    }
    return <AdminMode onBack={() => {
      setMode('select');
      setIsAdminAuthenticated(false); // Optionnel: déconnexion au retour
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="relative w-32 h-32 bg-white/10 rounded-3xl p-4 backdrop-blur-md border border-white/20 shadow-2xl transform hover:rotate-6 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="Logo Quiz Blockchain"
                width={128}
                height={128}
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
            Quiz Blockchain
          </h1>
          <p className="text-gray-300 text-xl">
            Testez vos connaissances sur la Blockchain et les Smart Contracts
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Student Mode Card */}
          <button
            onClick={() => setMode('student')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Mode Étudiant</h2>
              <p className="text-purple-100">
                Passez le quiz et testez vos connaissances
              </p>
            </div>
          </button>

          {/* Admin Mode Card */}
          <button
            onClick={() => setMode('admin')}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Mode Admin</h2>
              <p className="text-pink-100">
                Consultez les résultats des étudiants
              </p>
            </div>
          </button>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block bg-white/5 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/10">
            <p className="text-gray-300 text-sm">
              💡 <span className="font-semibold">30 questions</span> sur la Blockchain et les Smart Contracts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
