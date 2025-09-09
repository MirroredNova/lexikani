'use client';

import { useEffect, useCallback, useReducer, useMemo } from 'react';
import type { ReviewItem, ReviewQuestion, ReviewPair } from '@/types';
import { generateReviewQuestions, fuzzyMatchText, generateAcceptableAnswers } from '@/lib/utils';
import { calculateOptimisticSrsUpdate } from '@/lib/utils/srs';

// State interface
interface ReviewState {
  questions: ReviewQuestion[];
  reviewPairs: Map<string, ReviewPair>;
  currentQuestionIndex: number;
  userInput: string;
  showResult: boolean;
  correctAnswers: number;
  totalQuestions: number;
  isProcessing: boolean;
  reviewComplete: boolean;
  canUndo: boolean;
  lastAnswer: {
    wasCorrect: boolean;
    userInput: string;
    correctAnswers: number;
    reviewPairs: Map<string, ReviewPair>;
    showPairResult: boolean;
  } | null;
  showWordDetails: boolean;
  pendingUpdate: {
    pairId: string;
  } | null;
}

// Action types
type ReviewAction =
  | { type: 'INITIALIZE'; questions: ReviewQuestion[]; pairs: Map<string, ReviewPair> }
  | { type: 'SET_USER_INPUT'; input: string }
  | { type: 'START_PROCESSING' }
  | { type: 'STOP_PROCESSING' }
  | { type: 'SUBMIT_ANSWER'; isCorrect: boolean; pairId: string; direction: string }
  | { type: 'NEXT_QUESTION' }
  | { type: 'COMPLETE_REVIEW' }
  | { type: 'UNDO_ANSWER' }
  | { type: 'TOGGLE_WORD_DETAILS' }
  | { type: 'RESET_WORD_DETAILS' }
  | { type: 'SET_PENDING_UPDATE'; pairId: string }
  | { type: 'CLEAR_PENDING_UPDATE' };

// Initial state
const initialState: ReviewState = {
  questions: [],
  reviewPairs: new Map(),
  currentQuestionIndex: 0,
  userInput: '',
  showResult: false,
  correctAnswers: 0,
  totalQuestions: 0,
  isProcessing: false,
  reviewComplete: false,
  canUndo: false,
  lastAnswer: null,
  showWordDetails: false,
  pendingUpdate: null,
};

// Reducer function
function reviewReducer(state: ReviewState, action: ReviewAction): ReviewState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...initialState,
        questions: action.questions,
        reviewPairs: action.pairs,
        totalQuestions: action.questions.length,
      };

    case 'SET_USER_INPUT':
      return { ...state, userInput: action.input };

    case 'START_PROCESSING':
      return { ...state, isProcessing: true };

    case 'STOP_PROCESSING':
      return { ...state, isProcessing: false };

    case 'SUBMIT_ANSWER': {
      const currentState = {
        wasCorrect: action.isCorrect,
        userInput: state.userInput,
        correctAnswers: state.correctAnswers,
        reviewPairs: new Map(state.reviewPairs),
        showPairResult: false, // Will be calculated
      };

      const updatedPairs = new Map(state.reviewPairs);
      const pair = updatedPairs.get(action.pairId);
      if (!pair) return state;

      // Record the answer for this direction
      if (action.direction === 'word-to-meaning') {
        pair.wordToMeaning = action.isCorrect;
      } else {
        pair.meaningToWord = action.isCorrect;
      }

      const bothAnswered = pair.wordToMeaning !== null && pair.meaningToWord !== null;
      const bothCorrect = pair.wordToMeaning === true && pair.meaningToWord === true;
      currentState.showPairResult = bothAnswered;

      if (bothAnswered) {
        pair.completed = true;
        const originalSrsStage = pair.item.srsStage;

        // Calculate optimistic SRS update using the same logic as server
        const { newSrsStage } = calculateOptimisticSrsUpdate(originalSrsStage, bothCorrect);

        pair.srsProgression = { from: originalSrsStage, to: newSrsStage };

        // Store optimistic update in srsProgression for display
        // Don't modify pair.item.srsStage as it's the source of truth for subsequent calculations
        // The server update will happen in background and sync the real state
      }

      return {
        ...state,
        showResult: true,
        canUndo: true,
        lastAnswer: currentState,
        correctAnswers: action.isCorrect ? state.correctAnswers + 1 : state.correctAnswers,
        reviewPairs: updatedPairs,
        pendingUpdate: bothAnswered ? { pairId: action.pairId } : state.pendingUpdate,
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
      } else {
        return {
          ...state,
          reviewComplete: true,
        };
      }
    }

    case 'COMPLETE_REVIEW':
      return { ...state, reviewComplete: true };

    case 'UNDO_ANSWER':
      if (!state.canUndo || !state.lastAnswer) return state;
      return {
        ...state,
        correctAnswers: state.lastAnswer.correctAnswers,
        reviewPairs: state.lastAnswer.reviewPairs,
        userInput: state.lastAnswer.userInput,
        showResult: false,
        canUndo: false,
        lastAnswer: null,
        pendingUpdate: null,
      };

    case 'TOGGLE_WORD_DETAILS':
      return { ...state, showWordDetails: !state.showWordDetails };

    case 'RESET_WORD_DETAILS':
      return { ...state, showWordDetails: false };

    case 'SET_PENDING_UPDATE':
      return { ...state, pendingUpdate: { pairId: action.pairId } };

    case 'CLEAR_PENDING_UPDATE':
      return { ...state, pendingUpdate: null };

    default:
      return state;
  }
}

// Custom hook
export function useReviewState(initialReviews: ReviewItem[]) {
  const [state, dispatch] = useReducer(reviewReducer, initialState);

  // Generate review questions and initialize state
  const reviewData = useMemo(() => generateReviewQuestions(initialReviews), [initialReviews]);

  useEffect(() => {
    dispatch({
      type: 'INITIALIZE',
      questions: reviewData.questions,
      pairs: reviewData.pairs,
    });
  }, [reviewData]);

  // Derived state
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const questionsAnswered = Math.min(state.currentQuestionIndex + 1, state.totalQuestions);

  const currentPair = useMemo(
    () => (currentQuestion ? state.reviewPairs.get(currentQuestion.pairId) : undefined),
    [currentQuestion, state.reviewPairs],
  );

  const showPairResult = useMemo(
    () =>
      !!(
        state.showResult &&
        currentPair &&
        currentPair.wordToMeaning !== null &&
        currentPair.meaningToWord !== null
      ),
    [state.showResult, currentPair],
  );

  const completedPairs = useMemo(() => {
    return Array.from(state.reviewPairs.values()).filter(pair => pair.completed).length;
  }, [state.reviewPairs]);

  // Clean action methods
  const actions = {
    setUserInput: useCallback((input: string) => {
      dispatch({ type: 'SET_USER_INPUT', input });
    }, []),

    submitAnswer: useCallback(
      async (currentQuestion: ReviewQuestion, userInput: string) => {
        if (!userInput.trim() || state.isProcessing) return;

        dispatch({ type: 'START_PROCESSING' });

        // Get acceptable answers - only use for word-to-meaning direction
        let acceptableAnswers: string[] | undefined;

        if (currentQuestion.direction === 'word-to-meaning') {
          acceptableAnswers =
            currentQuestion.item.acceptedAnswers ||
            generateAcceptableAnswers(currentQuestion.correctAnswer);
        } else {
          acceptableAnswers = undefined;
        }

        const isCorrect = fuzzyMatchText(
          userInput,
          currentQuestion.correctAnswer,
          acceptableAnswers,
        );

        dispatch({
          type: 'SUBMIT_ANSWER',
          isCorrect,
          pairId: currentQuestion.pairId,
          direction: currentQuestion.direction,
        });

        dispatch({ type: 'STOP_PROCESSING' });
      },
      [state.isProcessing],
    ),

    nextQuestion: useCallback(() => {
      dispatch({ type: 'RESET_WORD_DETAILS' });

      if (state.currentQuestionIndex < state.questions.length - 1) {
        dispatch({ type: 'NEXT_QUESTION' });
      } else {
        dispatch({ type: 'COMPLETE_REVIEW' });
      }
    }, [state.currentQuestionIndex, state.questions.length]),

    undoAnswer: useCallback(() => {
      dispatch({ type: 'UNDO_ANSWER' });
    }, []),

    toggleWordDetails: useCallback(() => {
      dispatch({ type: 'TOGGLE_WORD_DETAILS' });
    }, []),

    setPendingUpdate: useCallback((pairId: string) => {
      dispatch({ type: 'SET_PENDING_UPDATE', pairId });
    }, []),

    clearPendingUpdate: useCallback(() => {
      dispatch({ type: 'CLEAR_PENDING_UPDATE' });
    }, []),
  };

  return {
    // State
    ...state,
    currentQuestion,
    currentPair,
    questionsAnswered,
    showPairResult,
    completedPairs,

    // Actions
    actions,
  };
}
