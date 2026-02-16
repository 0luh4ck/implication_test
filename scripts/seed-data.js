const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_project_url') {
    console.error('Erreur: Veuillez configurer vos clés Supabase dans .env.local avant de lancer ce script.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const dummyAttempts = [
    {
        nom: 'Doe',
        prenom: 'John',
        score: 18,
        user_answers: [
            { questionId: 1, selectedAnswer: 3 },
            { questionId: 2, selectedAnswer: 1 },
            { questionId: 3, selectedAnswer: 1 },
            { questionId: 4, selectedAnswer: 2 },
            { questionId: 5, selectedAnswer: 1 },
            { questionId: 6, selectedAnswer: 2 },
            { questionId: 7, selectedAnswer: 1 },
            { questionId: 8, selectedAnswer: 0 },
            { questionId: 9, selectedAnswer: 3 },
            { questionId: 10, selectedAnswer: 2 },
            { questionId: 11, selectedAnswer: 1 },
            { questionId: 12, selectedAnswer: 0 },
            { questionId: 13, selectedAnswer: 2 },
            { questionId: 14, selectedAnswer: 1 },
            { questionId: 15, selectedAnswer: 0 },
            { questionId: 16, selectedAnswer: 1 },
            { questionId: 17, selectedAnswer: 3 },
            { questionId: 18, selectedAnswer: 0 },
            { questionId: 19, selectedAnswer: 1 }, // Correct
            { questionId: 20, selectedAnswer: 1 }, // Correct
            { questionId: 21, selectedAnswer: 2 }, // Wrong (Correct is 3)
        ]
    },
    {
        nom: 'Dupont',
        prenom: 'Marie',
        score: 5,
        user_answers: [
            { questionId: 1, selectedAnswer: 0 },
            { questionId: 2, selectedAnswer: 0 },
            { questionId: 3, selectedAnswer: 0 },
            { questionId: 4, selectedAnswer: 0 },
            { questionId: 5, selectedAnswer: 0 },
        ]
    }
];

async function seed() {
    console.log('⏳ Insertion de données de test dans Supabase...');

    const { data, error } = await supabase
        .from('Results')
        .insert(dummyAttempts);

    if (error) {
        console.error('❌ Erreur lors de l\'insertion :', error.message);
        if (error.message.includes('relation "Results" does not exist')) {
            console.log('💡 Conseil : Avez-vous créé la table "Results" dans SQL Editor sur Supabase ?');
        }
    } else {
        console.log('✅ Données de test insérées avec succès !');
        console.log('Vous pouvez maintenant rafraîchir le Dashboard Admin pour voir les résultats.');
    }
}

seed();
