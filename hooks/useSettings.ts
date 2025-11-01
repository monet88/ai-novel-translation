
import React, { useState, useEffect, useRef } from 'react';
import type { TranslationSettings, GlossaryTerm } from '../types';
import { DEFAULT_GLOSSARY_EXTRACTION_INSTRUCTIONS, DEFAULT_EXCLUSION_LIST } from '../constants';

export const useSettings = () => {
  const [settings, setSettings] = useState<TranslationSettings>({
    aiProvider: 'gemini',
    geminiApiKey: '',
    openaiApiKey: '',
    openaiApiEndpoint: 'https://api.openai.com/v1/chat/completions',
    deepseekApiKey: '',
    deepseekApiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    glossary: [],
    useGlossaryAI: true,
    editAI: true,
    customInstructions: '',
    glossaryExtractionInstructions: '',
    exclusionList: DEFAULT_EXCLUSION_LIST,
  });
  const [editingTermInGlossaryViewId, setEditingTermInGlossaryViewId] = useState<string | null>(null);

  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('ai-novel-weaver-settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        if (!parsedSettings.aiProvider) parsedSettings.aiProvider = 'gemini';
        if (!parsedSettings.geminiApiKey) parsedSettings.geminiApiKey = '';
        if (!parsedSettings.openaiApiKey) parsedSettings.openaiApiKey = '';
        if (!parsedSettings.openaiApiEndpoint) parsedSettings.openaiApiEndpoint = 'https://api.openai.com/v1/chat/completions';
        if (!parsedSettings.deepseekApiKey) parsedSettings.deepseekApiKey = '';
        if (!parsedSettings.deepseekApiEndpoint) parsedSettings.deepseekApiEndpoint = 'https://api.deepseek.com/v1/chat/completions';
        
        // Migration logic for old default instructions
        if (parsedSettings.glossaryExtractionInstructions === DEFAULT_GLOSSARY_EXTRACTION_INSTRUCTIONS) {
            parsedSettings.glossaryExtractionInstructions = '';
        }

        // Remove old settings that are no longer used to avoid them being spread into the state
        delete parsedSettings.useProxy;
        delete parsedSettings.proxyType;
        delete parsedSettings.proxyDetails;
        delete parsedSettings.proxyBridgeUrl;
        delete parsedSettings.importContentSelector;
        delete parsedSettings.importProxyUrl;

        setSettings(prev => ({ ...prev, ...parsedSettings }));
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    }
  }, []);

  const handleSettingsChange = (updater: React.SetStateAction<TranslationSettings>) => {
    setSettings(prevSettings => {
      const newSettings = typeof updater === 'function' ? updater(prevSettings) : updater;
      try {
        localStorage.setItem('ai-novel-weaver-settings', JSON.stringify(newSettings));
      } catch (error) {
        console.error("Failed to save settings to localStorage", error);
      }
      return newSettings;
    });
  };

  const handleGlossaryTermUpdate = (updatedTerm: GlossaryTerm) => {
    handleSettingsChange(prev => ({
      ...prev,
      glossary: prev.glossary.map(term => term.id === updatedTerm.id ? updatedTerm : term)
    }));
  };

  return {
    settings,
    editingTermInGlossaryViewId,
    handleSettingsChange,
    handleGlossaryTermUpdate,
    setEditingTermInGlossaryViewId,
  };
};