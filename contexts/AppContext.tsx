
import React, { createContext, useContext, useMemo, useRef, ReactNode } from 'react';
import type { Project, Chapter, TranslationSettings, GlossaryTerm, MatchType } from '../types';
import { useProjects } from '../hooks/useProjects';
import { useSettings } from '../hooks/useSettings';
import { useModals } from '../hooks/useModals';
import { useLogs, LogEntry } from '../hooks/useLogs';
import { BatchProcessState } from '../services/batchOrchestrator';

interface AppContextType {
  // State from useProjects
  projects: Project[];
  activeProjectId: string | null;
  activeChapterId: string | null;
  view: 'dashboard' | 'workspace';
  saveStatus: 'saved' | 'saving';
  pendingResumeJob: { projectId: string; state: BatchProcessState } | null;

  // Derived state from useProjects
  activeProject?: Project;
  activeChapter?: Chapter;

  // Actions from useProjects
  handleOpenProject: (projectId: string) => void;
  handleBackToDashboard: () => void;
  handleSelectProject: (projectId: string) => void;
  handleAddProject: () => void;
  handleDeleteProject: (projectId: string) => void;
  handleRenameProject: (projectId: string, newName: string) => void;
  handleAddChapter: () => void;
  handleDeleteChapter: (chapterId: string) => void;
  handleRenameChapter: (chapterId: string, newName: string) => void;
  handleChapterChange: (chapterId: string, updates: Partial<Chapter>) => void;
  handleUpdateChapters: (updatedChapters: Chapter[]) => void;
  handleReorderChapters: (draggedChapterId: string, dropTargetChapterId: string) => void;
  handleAddToTranslationMemory: (source: string, target: string) => void;
  setActiveChapterId: (id: string | null) => void;
  handleExportProject: () => void;
  handleImportProject: (event: React.ChangeEvent<HTMLInputElement>) => void;
  triggerImportProject: React.MutableRefObject<(() => void) | null>;
  handleImportChaptersFromFiles: (chapters: { name: string; sourceText: string }[]) => void;
  clearPendingResumeJob: () => void;

  // State from useSettings
  settings: TranslationSettings;
  editingTermInGlossaryViewId: string | null;

  // Actions from useSettings
  handleSettingsChange: (updater: React.SetStateAction<TranslationSettings>) => void;
  handleGlossaryTermUpdate: (updatedTerm: GlossaryTerm) => void;
  handleGlossaryBulkUpdate: (oldTranslation: string, newTranslation: string, matchType: MatchType) => void;
  setEditingTermInGlossaryViewId: (id: string | null) => void;

  // State & Actions from useModals
  isBatchTranslateOpen: boolean;
  setIsBatchTranslateOpen: (isOpen: boolean) => void;
  isBatchExtractOpen: boolean;
  setIsBatchExtractOpen: (isOpen: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (isOpen: boolean) => void;
  isImportFilesModalOpen: boolean;
  setIsImportFilesModalOpen: (isOpen: boolean) => void;
  isGlossaryViewOpen: boolean;
  setIsGlossaryViewOpen: (isOpen: boolean) => void;
  findReplaceState: { side: 'source' | 'target'; text: string } | null;
  setFindReplaceState: (state: { side: 'source' | 'target'; text: string } | null) => void;
  glossaryReviewState: {
    terms: Omit<GlossaryTerm, 'id'>[];
    resolve: (termsToAdd: Omit<GlossaryTerm, 'id'>[]) => void;
  } | null;
  handleStartGlossaryReview: (terms: Omit<GlossaryTerm, 'id'>[]) => Promise<Omit<GlossaryTerm, 'id'>[]>;
  handleGlossaryReviewClose: (termsToAdd: Omit<GlossaryTerm, 'id'>[]) => void;
  handleAddReviewedTerms: (termsToAdd: Omit<GlossaryTerm, 'id'>[]) => void;
  handleFindReplace: (newText: string) => void;

  // State & Actions from useLogs
  logs: LogEntry[];
  addLog: (message: string) => void;
  clearLogs: () => void;
  
  // State for UI
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings, editingTermInGlossaryViewId, handleSettingsChange, handleGlossaryTermUpdate, setEditingTermInGlossaryViewId } = useSettings();
  const { logs, addLog, clearLogs } = useLogs();

  const projectsData = useProjects(settings, addLog);
  
  const modalsData = useModals({
      activeChapterId: projectsData.activeChapterId,
      handleChapterChange: projectsData.handleChapterChange,
      handleSettingsChange: handleSettingsChange
  });
  
  const handleGlossaryBulkUpdate = (oldTranslation: string, newTranslation: string, matchType: MatchType) => {
    if (!projectsData.activeProject) return;
    const chaptersToUpdate = projectsData.activeProject.chapters.map(chapter => {
        const flags = matchType === 'Case-Insensitive' ? 'gi' : 'g';
        const regex = new RegExp(`\\b${oldTranslation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, flags);
        const updatedTranslatedText = chapter.translatedText.replace(regex, newTranslation);
        return { ...chapter, translatedText: updatedTranslatedText };
    });
    projectsData.handleUpdateChapters(chaptersToUpdate);
  };

  const value: AppContextType = {
    ...projectsData,
    settings,
    editingTermInGlossaryViewId,
    handleSettingsChange,
    handleGlossaryTermUpdate,
    handleGlossaryBulkUpdate,
    setEditingTermInGlossaryViewId,
    ...modalsData,
    logs,
    addLog,
    clearLogs,
    isSidebarOpen: projectsData.isSidebarOpen,
    setIsSidebarOpen: projectsData.setIsSidebarOpen,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
