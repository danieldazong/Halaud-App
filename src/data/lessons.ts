import { Lesson } from "@/types/learning";

export const lessons: Lesson[] = [
  {
    id: "es-u1-l1",
    unitId: "es-u1",
    order: 1,
    title: "Hello and Goodbye",
    goal: "Greet someone and say goodbye in Spanish.",
    vocab: [
      { term: "Hola", translation: "Hello", audioPromptText: "Hola" },
      { term: "Adiós", translation: "Goodbye", audioPromptText: "Adiós" },
      {
        term: "Buenos días",
        translation: "Good morning",
        audioPromptText: "Buenos días",
      },
    ],
    phrases: [
      {
        text: "Hola, ¿cómo estás?",
        translation: "Hello, how are you?",
        audioPromptText: "Hola, ¿cómo estás?",
      },
    ],
    activities: [
      {
        id: "es-u1-l1-a1",
        type: "vocab-intro",
        prompt: "Listen and repeat.",
        vocab: {
          term: "Hola",
          translation: "Hello",
          audioPromptText: "Hola",
        },
      },
      {
        id: "es-u1-l1-a2",
        type: "multiple-choice",
        prompt: "What does 'Adiós' mean?",
        options: ["Hello", "Goodbye", "Please"],
        correctAnswer: "Goodbye",
      },
      {
        id: "es-u1-l1-a3",
        type: "speak-and-repeat",
        prompt: "Say it back.",
        phrase: {
          text: "Hola, ¿cómo estás?",
          translation: "Hello, how are you?",
          audioPromptText: "Hola, ¿cómo estás?",
        },
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are a warm, patient Spanish teacher for absolute beginners. Speak slowly, praise effort, and correct pronunciation gently by repeating the correct form.",
      openingLine: "¡Hola! Let's learn how to say hello and goodbye today.",
    },
  },
  {
    id: "es-u1-l2",
    unitId: "es-u1",
    order: 2,
    title: "Introducing Yourself",
    goal: "Say your name and ask someone else's name.",
    vocab: [
      {
        term: "Me llamo",
        translation: "My name is",
        audioPromptText: "Me llamo",
      },
      {
        term: "¿Cómo te llamas?",
        translation: "What is your name?",
        audioPromptText: "¿Cómo te llamas?",
      },
    ],
    phrases: [
      {
        text: "Me llamo Ana. ¿Cómo te llamas?",
        translation: "My name is Ana. What is your name?",
        audioPromptText: "Me llamo Ana. ¿Cómo te llamas?",
      },
    ],
    activities: [
      {
        id: "es-u1-l2-a1",
        type: "vocab-intro",
        prompt: "Listen and repeat.",
        vocab: {
          term: "Me llamo",
          translation: "My name is",
          audioPromptText: "Me llamo",
        },
      },
      {
        id: "es-u1-l2-a2",
        type: "listen-and-match",
        prompt: "Match the phrase to its meaning.",
        options: ["What is your name?", "Good morning", "Goodbye"],
        correctAnswer: "What is your name?",
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are a warm, patient Spanish teacher for absolute beginners. Speak slowly, praise effort, and correct pronunciation gently by repeating the correct form.",
      openingLine: "Now let's learn how to introduce yourself in Spanish.",
    },
  },
  {
    id: "fr-u1-l1",
    unitId: "fr-u1",
    order: 1,
    title: "Hello and Goodbye",
    goal: "Greet someone and say goodbye in French.",
    vocab: [
      { term: "Bonjour", translation: "Hello", audioPromptText: "Bonjour" },
      { term: "Au revoir", translation: "Goodbye", audioPromptText: "Au revoir" },
      { term: "Merci", translation: "Thank you", audioPromptText: "Merci" },
    ],
    phrases: [
      {
        text: "Bonjour, comment ça va?",
        translation: "Hello, how are you?",
        audioPromptText: "Bonjour, comment ça va?",
      },
    ],
    activities: [
      {
        id: "fr-u1-l1-a1",
        type: "vocab-intro",
        prompt: "Listen and repeat.",
        vocab: {
          term: "Bonjour",
          translation: "Hello",
          audioPromptText: "Bonjour",
        },
      },
      {
        id: "fr-u1-l1-a2",
        type: "multiple-choice",
        prompt: "What does 'Au revoir' mean?",
        options: ["Hello", "Goodbye", "Thank you"],
        correctAnswer: "Goodbye",
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are a warm, patient French teacher for absolute beginners. Speak slowly, praise effort, and correct pronunciation gently by repeating the correct form.",
      openingLine: "Bonjour! Let's learn how to say hello and goodbye today.",
    },
  },
  {
    id: "ja-u1-l1",
    unitId: "ja-u1",
    order: 1,
    title: "Hello and Goodbye",
    goal: "Greet someone and say goodbye in Japanese.",
    vocab: [
      {
        term: "こんにちは",
        translation: "Hello",
        audioPromptText: "こんにちは",
      },
      {
        term: "さようなら",
        translation: "Goodbye",
        audioPromptText: "さようなら",
      },
      {
        term: "ありがとう",
        translation: "Thank you",
        audioPromptText: "ありがとう",
      },
    ],
    phrases: [
      {
        text: "こんにちは、お元気ですか？",
        translation: "Hello, how are you?",
        audioPromptText: "こんにちは、お元気ですか？",
      },
    ],
    activities: [
      {
        id: "ja-u1-l1-a1",
        type: "vocab-intro",
        prompt: "Listen and repeat.",
        vocab: {
          term: "こんにちは",
          translation: "Hello",
          audioPromptText: "こんにちは",
        },
      },
      {
        id: "ja-u1-l1-a2",
        type: "multiple-choice",
        prompt: "What does 'さようなら' mean?",
        options: ["Hello", "Goodbye", "Thank you"],
        correctAnswer: "Goodbye",
      },
    ],
    aiTeacherPrompt: {
      systemPrompt:
        "You are a warm, patient Japanese teacher for absolute beginners. Speak slowly, praise effort, and correct pronunciation gently by repeating the correct form.",
      openingLine: "こんにちは! Let's learn how to say hello and goodbye today.",
    },
  },
];
