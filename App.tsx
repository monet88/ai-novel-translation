
import React, { useRef } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TranslationWorkspace from './components/TranslationWorkspace';
import BatchTranslateModal from './components/BatchTranslateModal';
import GlossaryReviewModal from './components/GlossaryReviewModal';
import BatchExtractModal from './components/BatchExtractModal';
import FindReplaceModal from './components/FindReplaceModal';
import ImportFromFilesModal from './components/ImportFromFilesModal';
import ProjectSelectionView from './components/ProjectSelectionView';
import { AppProvider, useAppContext } from './contexts/AppContext';
import GlossaryView from './components/GlossaryView';

const AppContent: React.FC = () => {
  const {
    view,
    isBatchTranslateOpen,
    isBatchExtractOpen,
    glossaryReviewState,
    handleGlossaryReviewClose,
    findReplaceState,
    setFindReplaceState,
    handleFindReplace,
    isImportFilesModalOpen,
    setIsImportFilesModalOpen,
    handleImportChaptersFromFiles,
    triggerImportProject,
    handleImportProject,
    isGlossaryViewOpen,
    setIsGlossaryViewOpen,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useAppContext();

  const importProjectInputRef = useRef<HTMLInputElement>(null);

  // Effect to link the trigger function to the input click
  React.useEffect(() => {
    triggerImportProject.current = () => importProjectInputRef.current?.click();
  }, [triggerImportProject]);

  return (
    <div className="flex flex-col h-screen font-sans">
      <input
        type="file"
        ref={importProjectInputRef}
        onChange={handleImportProject}
        accept=".json"
        className="hidden"
      />

      {view === 'dashboard' ? (
        <ProjectSelectionView />
      ) : (
        <>
          <Header />
          <div className="flex flex-1 overflow-hidden relative">
            {isSidebarOpen && (
              <div 
                onClick={() => setIsSidebarOpen(false)} 
                className="lg:hidden fixed inset-0 bg-black/60 z-20"
                aria-hidden="true"
              />
            )}
            <Sidebar />
            <TranslationWorkspace />
          </div>
        </>
      )}

      {isBatchTranslateOpen && <BatchTranslateModal />}
      {isBatchExtractOpen && <BatchExtractModal />}

      {isGlossaryViewOpen && (
        <GlossaryView onClose={() => setIsGlossaryViewOpen(false)} />
      )}

      {glossaryReviewState && (
        <GlossaryReviewModal
          extractedTerms={glossaryReviewState.terms}
          onComplete={handleGlossaryReviewClose}
        />
      )}
      
      {findReplaceState && (
        <FindReplaceModal 
            isOpen={!!findReplaceState}
            onClose={() => setFindReplaceState(null)}
            initialText={findReplaceState.text}
            onReplace={handleFindReplace}
        />
      )}
      
      {isImportFilesModalOpen && (
        <ImportFromFilesModal
            onClose={() => setIsImportFilesModalOpen(false)}
            onImport={handleImportChaptersFromFiles}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
