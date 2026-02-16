import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
// IMPORTANT: Remplacez ces valeurs par vos propres clés Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://celsvptdaaswvhnnlzbs.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  || 'sb_publishable_KdcOwpKfU6efDYdGT5hBgQ_7LNFFRfY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour la base de données
export interface QuizAttempt {
    id?: number;
    nom: string;
    prenom: string;
    score: number;
    user_answers: { questionId: number; selectedAnswer: number }[];
    created_at?: string;
}
