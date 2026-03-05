
import React, { useState, useCallback, useEffect } from 'react';
import { AppPhase, Level, Goal, DetailedAssessmentResult, LearningPathDefinition, Exercise, UserProgress } from './types';
import { ASSESSMENT_TEXTS } from './data/assessmentTexts';
import { LEARNING_PATHS } from './data/learningPaths';
import { assessUserLevelComprehensive, generateExercise } from './services/geminiService';
import { loadProgress, saveProgress, initializeProgress } from './store/userProgress';
import Welcome from './components/Welcome';
import AssessmentFlow from './components/Assessment/AssessmentFlow';
import AssessmentResults from './components/Assessment/AssessmentResults';
import Dashboard from './components/Dashboard/Dashboard';
import PathComplete from './components/LearningPath/PathComplete';
import PracticeSession from './components/Practice/PracticeSession';
import { Spinner } from './components/ui/Spinner';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase | null>(null);
  const [goal, setGoal] = useState<Goal>(Goal.CASUAL);
  const [assessmentResult, setAssessmentResult] = useState<DetailedAssessmentResult | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  // Diagnostic flow state
  const [assessmentIndex, setAssessmentIndex] = useState(0);
  const [diagnosticRecordings, setDiagnosticRecordings] = useState<Blob[]>([]);

  // Learning Path state
  const [currentLearningPath, setCurrentLearningPath] = useState<LearningPathDefinition | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);

  // Main practice loop state
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  
  useEffect(() => {
    const loadedProgress = loadProgress();
    if (loadedProgress) {
        setUserProgress(loadedProgress);
        setGoal(loadedProgress.initialAssessment?.goal || Goal.CASUAL);
        const path = LEARNING_PATHS.find(p => p.path === loadedProgress.assignedPath);
        if (path) {
            setCurrentLearningPath(path);
            const lastCompletedModuleId = loadedProgress.completedModules[loadedProgress.completedModules.length - 1];
            const lastCompletedIndex = lastCompletedModuleId ? path.modules.findIndex(m => m.id === lastCompletedModuleId) : -1;
            setCurrentModuleIndex(lastCompletedIndex + 1);
        }
        setPhase(AppPhase.DASHBOARD);
    } else {
        setPhase(AppPhase.WELCOME);
    }
  }, []);

  const handleStart = useCallback((selectedGoal: Goal) => {
    setGoal(selectedGoal);
    setPhase(AppPhase.ASSESSMENT_RECORDING);
  }, []);

  const handleSingleRecordingComplete = useCallback((recording: Blob) => {
    const newRecordings = [...diagnosticRecordings, recording];
    setDiagnosticRecordings(newRecordings);

    if (assessmentIndex < ASSESSMENT_TEXTS.length - 1) {
      setAssessmentIndex(prev => prev + 1);
    } else {
      setPhase(AppPhase.ASSESSMENT_ANALYZING);
    }
  }, [diagnosticRecordings, assessmentIndex]);

  useEffect(() => {
    const runAnalysis = async () => {
      if (phase === AppPhase.ASSESSMENT_ANALYZING && diagnosticRecordings.length === ASSESSMENT_TEXTS.length) {
        const finalAssessment = await assessUserLevelComprehensive(diagnosticRecordings, goal, ASSESSMENT_TEXTS);
        setAssessmentResult(finalAssessment);
        setPhase(AppPhase.ASSESSMENT_RESULTS);
      }
    };
    runAnalysis();
  }, [phase, diagnosticRecordings, goal]);
  
  const handleStartPlan = useCallback(() => {
    if (assessmentResult) {
      const path = LEARNING_PATHS.find(p => p.path === assessmentResult.recommendedPath);
      if (path) {
        const progress = initializeProgress(assessmentResult);
        progress.currentModule = path.modules[0].id; // Set the first module as current

        saveProgress(progress);
        setUserProgress(progress);
        setCurrentLearningPath(path);
        setCurrentModuleIndex(0);
        setPhase(AppPhase.DASHBOARD);
      }
    }
  }, [assessmentResult]);

  const handleStartSession = useCallback(() => {
    setPhase(AppPhase.PRACTICE_SESSION_GENERATE);
  }, []);

  useEffect(() => {
    if (phase === AppPhase.PRACTICE_SESSION_GENERATE && userProgress && currentLearningPath) {
        const fetchExercise = async () => {
            const module = currentLearningPath.modules[currentModuleIndex];
            const exercise = await generateExercise(userProgress.currentLevelName, module);
            setCurrentExercise(exercise);
            setPhase(AppPhase.PRACTICE_SESSION);
        };
        fetchExercise();
    }
  }, [phase, userProgress, currentLearningPath, currentModuleIndex]);
  
  const handleSessionComplete = useCallback(() => {
    if (!userProgress || !currentLearningPath) return;

    const completedModuleId = currentLearningPath.modules[currentModuleIndex].id;
    const newCompletedModules = [...userProgress.completedModules, completedModuleId];
    const newModuleIndex = currentModuleIndex + 1;
    
    setCurrentExercise(null);

    if (newModuleIndex < currentLearningPath.modules.length) {
      const newCurrentModuleId = currentLearningPath.modules[newModuleIndex].id;
      const updatedProgress: UserProgress = {
        ...userProgress,
        completedModules: newCompletedModules,
        currentModule: newCurrentModuleId,
        lastSessionAt: new Date().toISOString(),
        totalSessions: userProgress.totalSessions + 1,
      };
      
      setUserProgress(updatedProgress);
      saveProgress(updatedProgress);
      setCurrentModuleIndex(newModuleIndex);
      setPhase(AppPhase.DASHBOARD);
    } else {
      const updatedProgress: UserProgress = {
        ...userProgress,
        completedModules: newCompletedModules,
        currentModule: null, // No current module
      };
      setUserProgress(updatedProgress);
      saveProgress(updatedProgress);
      setPhase(AppPhase.PATH_COMPLETE);
    }
  }, [userProgress, currentLearningPath, currentModuleIndex]);
  
  const handleRestart = useCallback(() => {
      localStorage.removeItem('accent_app_progress');
      window.location.reload();
  }, []);

  const renderContent = () => {
    if (phase === null) {
      return (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      );
    }
    switch (phase) {
      case AppPhase.WELCOME:
        return <Welcome onStart={handleStart} />;
      case AppPhase.ASSESSMENT_RECORDING:
      case AppPhase.ASSESSMENT_ANALYZING:
        return (
          <AssessmentFlow 
            currentPhase={phase} 
            assessmentIndex={assessmentIndex}
            onSingleRecordingComplete={handleSingleRecordingComplete}
          />
        );
      case AppPhase.ASSESSMENT_RESULTS:
        return <AssessmentResults result={assessmentResult} onStartPlan={handleStartPlan} />;
      case AppPhase.DASHBOARD:
        if (!userProgress || !currentLearningPath) return null;
        return <Dashboard 
          userProgress={userProgress} 
          learningPath={currentLearningPath}
          currentModuleIndex={currentModuleIndex}
          onStartSession={handleStartSession} 
        />;
      case AppPhase.PATH_COMPLETE:
        return <PathComplete onRestart={handleRestart} />;
      case AppPhase.PRACTICE_SESSION_GENERATE:
         return (
            <div className="flex flex-col items-center justify-center text-center">
                <Spinner />
                <p className="mt-4 text-gray-400">Designing the perfect exercise for you...</p>
            </div>
         );
      case AppPhase.PRACTICE_SESSION:
        if (!currentExercise || !userProgress || !currentLearningPath) return null;
         return (
            <PracticeSession
                level={userProgress.currentLevelName}
                exercise={currentExercise}
                module={currentLearningPath.modules[currentModuleIndex]}
                moduleNumber={currentModuleIndex + 1}
                onSessionComplete={handleSessionComplete}
            />
         );
      default:
        return <Welcome onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-400 tracking-tight">
            The American Cultural Insider
          </h1>
          <p className="text-gray-400 mt-2">Your coach for sounding like a local 🤙</p>
        </header>
        <main className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 min-h-[400px] flex flex-col justify-center">
          {renderContent()}
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Powered by Gemini. Built for a natural, authentic learning experience.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
