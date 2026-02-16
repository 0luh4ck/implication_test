export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer (0-3)
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Qu'est-ce qu'un bloc dans une blockchain?",
    options: [
      "App mobile",
      "Serveur central",
      "Une cryptomonnaie",
      "Groupe transactions + header"
    ],
    correctAnswer: 3
  },
  {
    id: 2,
    question: "Comment les blocs sont liés ?",
    options: [
      "Par internet",
      "Par le hash du bloc précédent",
      "Par mot de passe",
      "Par des Signatures manuelles"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Quel est le principal intérêt blockchain ?",
    options: [
      "Elle est rapide",
      "Immuable/décentralisée",
      "Gratuit",
      "Elle est secrète"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "Qu'est-ce que le hashing ?",
    options: [
      "Un chiffrement qu'on peut déchiffrer",
      "Une sauvegarde",
      "Une fonction qui transforme une donnée en empreinte numérique",
      "Une compression"
    ],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Si on change une seule lettre d'un message, le hash:",
    options: [
      "Ne change pas",
      "Change complètement",
      "Seulement les majuscules",
      "Change un peu"
    ],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "A quoi sert la merkle root ?",
    options: [
      "A stocker de l'argent",
      "A identifier un utilisateur",
      "A regrouper toutes les transactions du bloc",
      "A donner l'heure"
    ],
    correctAnswer: 2
  },
  {
    id: 7,
    question: "Une blockchain décentralisée signifie:",
    options: [
      "Un ordinateur principal",
      "Plusieurs ordinateurs partagent les données",
      "Pas besoin d'internet",
      "Données stockées dans le cloud"
    ],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "Bitcoin est ?",
    options: [
      "Une blockchain",
      "Une entreprise",
      "Une banque",
      "Un serveur"
    ],
    correctAnswer: 0
  },
  {
    id: 9,
    question: "Le consensus sert à:",
    options: [
      "Elire un chef",
      "Stocker les blocs",
      "Chiffrer les données",
      "Se mettre d'accord sur l'état de la blockchain"
    ],
    correctAnswer: 3
  },
  {
    id: 10,
    question: "Le proof of work repose sur :",
    options: [
      "La confiance",
      "Un vote humain",
      "La puissance de calcul",
      "Le hasard"
    ],
    correctAnswer: 2
  },
  {
    id: 11,
    question: "Modifier un bloc ancien :",
    options: [
      "Est Facile",
      "Casse la suite de la blockchain",
      "Est Automatique",
      "Est invisible"
    ],
    correctAnswer: 1
  },
  {
    id: 12,
    question: "Un Nœud blockchain est :",
    options: [
      "Ordinateur qui participe au réseau",
      "Un Utilisateur",
      "Un wallet",
      "Un bloc"
    ],
    correctAnswer: 0
  },
  {
    id: 13,
    question: "Le timestamp indique :",
    options: [
      "Le nombre d'utilisateur",
      "La durée d'une transaction",
      "La date et l'heure du bloc",
      "Le Prix"
    ],
    correctAnswer: 2
  },
  {
    id: 14,
    question: "Pourquoi la Blockchain est immuable ?",
    options: [
      "Parce qu'elle est protégée par la loi",
      "Parce que les blocs sont liés par des hashs",
      "Parce qu'elle est privée",
      "Serveurs"
    ],
    correctAnswer: 1
  },
  {
    id: 15,
    question: "Une DataBase classique est :",
    options: [
      "Centralisée modifiable",
      "Identique a une blockchain",
      "Gratuite",
      "Plus lente"
    ],
    correctAnswer: 0
  },
  {
    id: 16,
    question: "Le Nonce sert à ?",
    options: [
      "Donner un nom au bloc",
      "Trouver un hash valide",
      "Stocker des données",
      "Signer une transaction"
    ],
    correctAnswer: 1
  },
  {
    id: 17,
    question: "Un fork se produit quand:",
    options: [
      "La blockchain s'arrête",
      "Le réseau est cassé",
      "Il y a piratage",
      "Deux versions valident existent en même temps"
    ],
    correctAnswer: 3
  },
  {
    id: 18,
    question: "La blockchain peut servir à:",
    options: [
      "La traçabilité et la logistique",
      "Seulement aux banques",
      "Uniquement a la crypto",
      "Scammer"
    ],
    correctAnswer: 0
  },
  {
    id: 19,
    question: "Un smart contract peut fonctionner sans blockchain:",
    options: [
      "Vrai",
      "Faux",
      "",
      ""
    ],
    correctAnswer: 1
  },
  {
    id: 20,
    question: "Un smart contract est :",
    options: [
      "Un contract juridique signé en ligne",
      "Un programme exécuté automatiquement sur la blockchain",
      "Un wallet sécurisé",
      "Un NFT"
    ],
    correctAnswer: 1
  },
  {
    id: 21,
    question: "A quoi sert Remix IDE?",
    options: [
      "Gérer des wallets",
      "Miner de l'Ether",
      "Créer des NFTs graphiques",
      "Ecrire, compiler et déployer des smart contracts"
    ],
    correctAnswer: 3
  }
];
