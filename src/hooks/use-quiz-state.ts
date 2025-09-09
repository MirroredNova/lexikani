'use client';

import { useEffect, useCallback, useReducer, useMemo } from 'react';
import type { VocabularyItem, QuizQuestion } from '@/types';
import { generateQuizQuestions, fuzzyMatchText, generateAcceptableAnswers } from '@/lib/utils';

// State interface
interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  userInput: string;
  showResult: boolean;
  wrongAnswers: QuizQuestion[];
  retestWrongAnswers: QuizQuestion[];
  totalQuestions: number;
  firstAttemptCorrect: number;
  isRetestPhase: boolean;
  canUndo: boolean;
  lastAnswer: {
    wasCorrect: boolean;
    userInput: string;
    firstAttemptCorrect: number;
    wrongAnswers: QuizQuestion[];
    retestWrongAnswers: QuizQuestion[];
  } | null;
  showWordDetails: boolean;
  quizComplete: boolean;
}

// Action types
type QuizAction =
  | { type: 'INITIALIZE'; questions: QuizQuestion[] }
  | { type: 'SET_USER_INPUT'; input: string }
  | { type: 'SUBMIT_ANSWER'; isCorrect: boolean; currentQuestion: QuizQuestion }
  | { type: 'NEXT_QUESTION' }
  | { type: 'UNDO_ANSWER' }
  | { type: 'TOGGLE_WORD_DETAILS' }
  | { type: 'RESET_WORD_DETAILS' };

// Initial state
const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  userInput: '',
  showResult: false,
  wrongAnswers: [],
  retestWrongAnswers: [],
  totalQuestions: 0,
  firstAttemptCorrect: 0,
  isRetestPhase: false,
  canUndo: false,
  lastAnswer: null,
  showWordDetails: false,
  quizComplete: false,
};

// Reducer function
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...initialState,
        questions: action.questions,
        totalQuestions: action.questions.length,
      };

    case 'SET_USER_INPUT':
      return { ...state, userInput: action.input };

    case 'SUBMIT_ANSWER': {
      const currentState = {
        wasCorrect: action.isCorrect,
        userInput: state.userInput,
        firstAttemptCorrect: state.firstAttemptCorrect,
        wrongAnswers: [...state.wrongAnswers],
        retestWrongAnswers: [...state.retestWrongAnswers],
      };

      return {
        ...state,
        showResult: true,
        canUndo: true,
        lastAnswer: currentState,
        firstAttemptCorrect:
          action.isCorrect && !state.isRetestPhase
            ? state.firstAttemptCorrect + 1
            : state.firstAttemptCorrect,
        wrongAnswers:
          !action.isCorrect && !state.isRetestPhase
            ? [...state.wrongAnswers, action.currentQuestion]
            : state.wrongAnswers,
        retestWrongAnswers:
          !action.isCorrect && state.isRetestPhase
            ? [...state.retestWrongAnswers, action.currentQuestion]
            : state.retestWrongAnswers,
      };
    }

    case 'NEXT_QUESTION': {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        return {
          ...state,
          currentQuestionIndex: state.currentQuestionIndex + 1,
          userInput: '',
          showResult: false,
          canUndo: false,
          lastAnswer: null,
          showWordDetails: false,
        };
      } else if (state.wrongAnswers.length > 0 && !state.isRetestPhase) {
        return {
          ...state,
          questions: [...state.questions, ...state.wrongAnswers],
          wrongAnswers: [],
          isRetestPhase: true,
          currentQuestionIndex: state.currentQuestionIndex + 1,
          userInput: '',
          showResult: false,
          canUndo: false,
          lastAnswer: null,
          showWordDetails: false,
        };
      } else if (state.retestWrongAnswers.length > 0) {
        return {
          ...state,
          questions: [...state.questions, ...state.retestWrongAnswers],
          retestWrongAnswers: [],
          isRetestPhase: true,
          currentQuestionIndex: state.currentQuestionIndex + 1,
          userInput: '',
          showResult: false,
          canUndo: false,
          lastAnswer: null,
          showWordDetails: false,
        };
      }
      // Quiz is complete - no more questions or retests
      return {
        ...state,
        quizComplete: true,
      };
    }

    case 'UNDO_ANSWER':
      if (!state.canUndo || !state.lastAnswer) return state;
      return {
        ...state,
        firstAttemptCorrect: state.lastAnswer.firstAttemptCorrect,
        wrongAnswers: state.lastAnswer.wrongAnswers,
        retestWrongAnswers: state.lastAnswer.retestWrongAnswers,
        userInput: state.lastAnswer.userInput,
        showResult: false,
        canUndo: false,
        lastAnswer: null,
      };

    case 'TOGGLE_WORD_DETAILS':
      return { ...state, showWordDetails: !state.showWordDetails };

    case 'RESET_WORD_DETAILS':
      return { ...state, showWordDetails: false };

    default:
      return state;
  }
}

// Custom hook
export function useQuizState(words: VocabularyItem[]) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Memoize expensive quiz generation
  const generatedQuestions = useMemo(() => generateQuizQuestions(words), [words]);

  useEffect(() => {
    dispatch({ type: 'INITIALIZE', questions: generatedQuestions });
  }, [generatedQuestions]);

  // Derived state
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const questionsAnswered = state.isRetestPhase
    ? state.totalQuestions
    : Math.min(state.currentQuestionIndex + 1, state.totalQuestions);

  // Clean action methods
  const actions = {
    setUserInput: useCallback((input: string) => {
      dispatch({ type: 'SET_USER_INPUT', input });
    }, []),

    submitAnswer: useCallback((currentQuestion: QuizQuestion, userInput: string) => {
      // Get acceptable answers - only use for word-to-meaning direction
      let acceptableAnswers: string[] | undefined;

      if (currentQuestion.direction === 'word-to-meaning') {
        acceptableAnswers =
          currentQuestion.word.acceptedAnswers ||
          generateAcceptableAnswers(currentQuestion.correctAnswer);
      } else {
        acceptableAnswers = undefined;
      }

      const isCorrect = fuzzyMatchText(userInput, currentQuestion.correctAnswer, acceptableAnswers);

      dispatch({
        type: 'SUBMIT_ANSWER',
        isCorrect,
        currentQuestion,
      });
    }, []),

    nextQuestion: useCallback(() => {
      dispatch({ type: 'RESET_WORD_DETAILS' });
      dispatch({ type: 'NEXT_QUESTION' });
    }, []),

    undoAnswer: useCallback(() => {
      dispatch({ type: 'UNDO_ANSWER' });
    }, []),

    toggleWordDetails: useCallback(() => {
      dispatch({ type: 'TOGGLE_WORD_DETAILS' });
    }, []),
  };

  return {
    // State
    ...state,
    currentQuestion,
    questionsAnswered,

    // Actions
    actions,
  };
}
