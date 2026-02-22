
import { Level, LearningPath, DetailedAssessmentResult, PhoneticProfile, Goal, UserProgress } from '../types';

// Using localStorage for persistence (or integrate with a backend later)

// Storage functions
export const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem('accent_app_progress', JSON.stringify(progress));
  } catch (error) {
    console.error("Could not save progress to localStorage", error);
  }
};

export const loadProgress = (): UserProgress | null => {
  try {
    const data = localStorage.getItem('accent_app_progress');
    return data ? JSON.parse(data) : null;
  } catch (error)
 {
    console.error("Could not load progress from localStorage", error);
    return null;
  }
};

export const initializeProgress = (assessment: DetailedAssessmentResult): UserProgress => {
  const now = new Date().toISOString();

  // Set the lastUpdated timestamp for each feature in the profile
  const updatedPhoneticProfile: PhoneticProfile = { ...assessment.phoneticProfile };
  for (const key in updatedPhoneticProfile) {
      if(Object.prototype.hasOwnProperty.call(updatedPhoneticProfile, key)) {
        const typedKey = key as keyof PhoneticProfile;
        updatedPhoneticProfile[typedKey].lastUpdated = now;
      }
  }

  return {
    odId: crypto.randomUUID(),
    createdAt: now,
    lastSessionAt: now,
    initialAssessment: assessment,
    assessmentHistory: [{
      date: now,
      level: assessment.overallLevel,
      phoneticProfile: updatedPhoneticProfile
    }],
    currentLevel: assessment.overallLevel,
    currentLevelName: assessment.levelName,
    assignedPath: assessment.recommendedPath,
    goal: assessment.goal,
    completedModules: [],
    currentModule: null,
    moduleProgress: {},
    exerciseHistory: [],
    phoneticProfile: updatedPhoneticProfile,
    totalPracticeMinutes: 0,
    totalSessions: 1,
    streakDays: 1,
    lastStreakDate: now.split('T')[0]
  };
};
