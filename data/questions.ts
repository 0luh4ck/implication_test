export interface Question {
  id: number;
  question: string;
  options?: string[];
  correctAnswer?: number; // Index de la réponse correcte (0-3) pour les QCM
  type?: 'mcq' | 'coding';
  codeTemplate?: string;
  expectedKeywords?: string[];
}

export const questions: Question[] = [
  // PARTIE 1 — SMART CONTRACTS
  {
    id: 1,
    question: "Qu’est-ce qu’un smart contract ?",
    options: ["Un contrat papier numérisé", "Un programme auto-exécuté sur une blockchain", "Une base de données", "Un site web"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 2,
    question: "Où s’exécutent les smart contracts ?",
    options: ["Sur un serveur central", "Sur le cloud", "Sur une blockchain", "Sur un navigateur"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 3,
    question: "Quelle propriété garantit l’exécution automatique ?",
    options: ["Décentralisation", "Transparence", "Programmabilité", "Anonymat"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 4,
    question: "Une fois déployé, un smart contract est :",
    options: ["Facilement modifiable", "Supprimable", "Immuable par défaut", "Temporaire"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 5,
    question: "Qui exécute réellement le smart contract ?",
    options: ["Les développeurs", "Les utilisateurs", "Les mineurs/validateurs", "Les gouvernements"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 6,
    question: "Quelle blockchain est la plus connue pour les smart contracts ?",
    options: ["Bitcoin", "Ethereum", "Lightning", "IPFS"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 7,
    question: "Langage principal des smart contracts Ethereum ?",
    options: ["Python", "Java", "Solidity", "Rust"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 8,
    question: "Un smart contract Ethereum s’exécute sur :",
    options: ["Linux", "JVM", "EVM", "Docker"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 9,
    question: "Le “gas” sert à :",
    options: ["Payer l’électricité", "Récompenser les utilisateurs", "Payer l’exécution du contrat", "Créer des tokens"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 10,
    question: "Si le gas est insuffisant :",
    options: ["Le contrat s’exécute quand même", "Le contrat échoue", "Le réseau s’arrête", "Le code est modifié"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 11,
    question: "Quelle est une faille célèbre des smart contracts ?",
    options: ["SQL Injection", "Reentrancy", "Buffer overflow", "XSS"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 12,
    question: "Le hack de The DAO était dû à :",
    options: ["Une erreur humaine", "Une reentrancy attack", "Une attaque réseau", "Un bug matériel"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 13,
    question: "Pourquoi auditer un smart contract ?",
    options: ["Le rendre plus rapide", "Vérifier sa légalité", "Détecter des failles", "Changer la blockchain"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 14,
    question: "Quel est un risque majeur ?",
    options: ["Trop de documentation", "Code irréversible mal écrit", "Trop de décentralisation", "Trop de transparence"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 15,
    question: "Un smart contract peut-il mentir ?",
    options: ["Oui", "Non, il exécute ce qui est codé", "Parfois", "Seulement avec un oracle"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 16,
    question: "Un oracle sert à :",
    options: ["Stocker des tokens", "Fournir des données externes", "Miner des blocs", "Sécuriser la blockchain"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 17,
    question: "Exemple de donnée fournie par un oracle ?",
    options: ["Code source", "Prix BTC/USD", "Hash de bloc", "Gas fee"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 18,
    question: "Les oracles posent un problème de :",
    options: ["Centralisation potentielle", "Performance", "UX", "Langage"],
    correctAnswer: 0,
    type: 'mcq'
  },
  {
    id: 19,
    question: "Exemple d’usage réel des smart contracts :",
    options: ["Jeux vidéo", "DeFi (prêts, échanges)", "Antivirus", "Email"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 20,
    question: "La DeFi signifie :",
    options: ["Développement financier", "Finance décentralisée", "Données financières", "Défense financière"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 21,
    question: "Un smart contract upgradable utilise souvent :",
    options: ["Un proxy", "Une base SQL", "Une API REST", "Un fork"],
    correctAnswer: 0,
    type: 'mcq'
  },
  {
    id: 22,
    question: "Qui décide des règles d’un smart contract ?",
    options: ["Le réseau", "Les utilisateurs", "Le développeur (au départ)", "Les mineurs"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 23,
    question: "Un bug dans un smart contract peut :",
    options: ["Être patché facilement", "Causer des pertes financières", "Être ignoré", "Arrêter la blockchain"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 24,
    question: "Les smart contracts sont :",
    options: ["Juridiques uniquement", "Techniques uniquement", "Techniques avec implications juridiques", "Illégaux"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 25,
    question: "Un smart contract peut gérer :",
    options: ["De l’argent", "Des règles", "Des conditions", "Toutes les réponses"],
    correctAnswer: 3,
    type: 'mcq'
  },
  {
    id: 26,
    question: "Quelle blockchain n’utilise PAS l’EVM ?",
    options: ["Ethereum", "BNB Chain", "Solana", "Polygon"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 27,
    question: "Les smart contracts sont visibles par :",
    options: ["Personne", "Les développeurs", "Tous (public)", "Les gouvernements"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 28,
    question: "Un smart contract mal conçu est :",
    options: ["Inoffensif", "Dangereux", "Lent", "Illégal"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 29,
    question: "Le principal avantage des smart contracts ?",
    options: ["Vitesse", "Automatisation sans confiance", "Anonymat", "Gratuité"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 30,
    question: "Les smart contracts remplacent-ils les lois ?",
    options: ["Oui", "Non, ils les complètent parfois", "Toujours", "Jamais"],
    correctAnswer: 1,
    type: 'mcq'
  },
  // 🟠 PARTIE 2 — BITCOIN
  {
    id: 32, // Changé pour laisser 31 au coding
    question: "Bitcoin est :",
    options: ["Une entreprise", "Une cryptomonnaie décentralisée", "Une banque", "Un token Ethereum"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 33,
    question: "Créateur de Bitcoin ?",
    options: ["Vitalik Buterin", "Elon Musk", "Satoshi Nakamoto", "Hal Finney"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 34,
    question: "Bitcoin utilise :",
    options: ["Proof of Stake", "Proof of Work", "Proof of Authority", "Proof of Speed"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 35,
    question: "Rôle des mineurs ?",
    options: ["Créer des wallets", "Valider les transactions", "Programmer Bitcoin", "Fixer le prix"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 36,
    question: "Bitcoin permet surtout :",
    options: ["Les smart contracts complexes", "Les paiements pair-à-pair", "Le cloud computing", "Le stockage"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 37,
    question: "Offre maximale de Bitcoin ?",
    options: ["Illimitée", "100 millions", "21 millions", "1 milliard"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 38,
    question: "Bitcoin est :",
    options: ["Centralisé", "Contrôlé par une banque", "Résistant à la censure", "Privé"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 39,
    question: "Une transaction Bitcoin est :",
    options: ["Réversible", "Instantanée", "Publique et vérifiable", "Gratuite"],
    correctAnswer: 2,
    type: 'mcq'
  },
  {
    id: 40,
    question: "Le halving sert à :",
    options: ["Doubler les récompenses", "Réduire l’émission de BTC", "Arrêter le réseau", "Créer des forks"],
    correctAnswer: 1,
    type: 'mcq'
  },
  {
    id: 41,
    question: "Bitcoin est souvent comparé à :",
    options: ["Le dollar", "L’or numérique", "Une action", "Une entreprise"],
    correctAnswer: 1,
    type: 'mcq'
  },
  // 🔵 QUESTION 31 OBLIGATOIRE - SIMULATEUR CODING
  {
    id: 31,
    question: "Écrivez un smart contract Solidity simple nommé 'Compteur' qui contient une variable d'état entière 'compte' et une fonction 'incrementer()' qui augmente cette variable de 1.",
    type: 'coding',
    codeTemplate: "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.0;\n\ncontract Compteur {\n    uint public compte;\n\n    function incrementer() public {\n        // Votre code ici\n    }\n}",
    expectedKeywords: ["compte++", "compte = compte + 1", "compte += 1"]
  }
];
