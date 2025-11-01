
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { GlossaryTerm, TranslationSettings } from '../types';

interface UseModalsProps {
  activeChapterId: string | null;
  handleChapterChange: (chapterId: string, updates: Partial<{ sourceText: string, translatedText: string }>) => void;
  handleSettingsChange: (updater: React.SetStateAction<TranslationSettings>) => void;
}

export const useModals = ({ activeChapterId, handleChapterChange, handleSettingsChange }: UseModalsProps) => {
  const [isBatchTranslateOpen, setIsBatchTranslateOpen] = useState(false);
  const [isBatchExtractOpen, setIsBatchExtractOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isImportFilesModalOpen, setIsImportFilesModalOpen] = useState(false);
  const [isGlossaryViewOpen, setIsGlossaryViewOpen] = useState(false);
  const [findReplaceState, setFindReplaceState] = useState<{ side: 'source' | 'target'; text: string } | null>(null);

  const [glossaryReviewState, setGlossaryReviewState] = useState<{
    terms: Omit<GlossaryTerm, 'id'>[];
    resolve: (termsToAdd: Omit<GlossaryTerm, 'id'>[]) => void;
  } | null>(null);

  const handleStartGlossaryReview = (terms: Omit<GlossaryTerm, 'id'>[]): Promise<Omit<GlossaryTerm, 'id'>[]> => {
    return new Promise((resolve) => {
      setGlossaryReviewState({ terms, resolve });
    });
  };

  const handleAddReviewedTerms = (termsToAdd: Omit<GlossaryTerm, 'id'>[]) => {
      if (termsToAdd.length === 0) return;
      const newGlossaryTerms = termsToAdd.map(term => ({ ...term, id: uuidv4() }));
      handleSettingsChange(prev => ({ ...prev, glossary: [...prev.glossary, ...newGlossaryTerms] }));
  };

  const handleGlossaryReviewClose = (termsToAdd: Omit<GlossaryTerm, 'id'>[]) => {
    glossaryReviewState?.resolve(termsToAdd);
    setGlossaryReviewState(null);
  };

  const handleFindReplace = (newText: string) => {
    if (!findReplaceState || !activeChapterId) return;
    const updateKey = findReplaceState.side === 'source' ? 'sourceText' : 'translatedText';
    handleChapterChange(activeChapterId, { [updateKey]: newText });
    setFindReplaceState(null);
  };

  return {
    isBatchTranslateOpen,
    setIsBatchTranslateOpen,
    isBatchExtractOpen,
    setIsBatchExtractOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isImportFilesModalOpen,
    setIsImportFilesModalOpen,
    isGlossaryViewOpen,
    setIsGlossaryViewOpen,
    findReplaceState,
    setFindReplaceState,
    glossaryReviewState,
    handleStartGlossaryReview,
    handleGlossaryReviewClose,
    handleAddReviewedTerms,
    handleFindReplace,
  };
};
