// Complete updated types.ts

// ============ ENUMS ============

export enum AppPhase {
  WELCOME = 'WELCOME',
  
  // Assessment flow
  ASSESSMENT_INTRO = 'ASSESSMENT_INTRO',
  ASSESSMENT_RECORDING = 'ASSESSMENT_RECORDING',
  ASSESSMENT_ANALYZING = 'ASSESSMENT_ANALYZING',
  ASSESSMENT_RESULTS = 'ASSESSMENT_RESULTS',
  
  // Main app
  DASHBOARD = 'DASHBOARD',
  
  // Learning path
  PATH_OVERVIEW = 'PATH_OVERVIEW',
  MODULE_INTRO = 'MODULE_INTRO',
  MODULE_EXERCISE = 'MODULE_EXERCISE',
  MODULE_COMPLETE = 'MODULE_COMPLETE',
  
  // Practice session
  PRACTICE_WARMUP = 'PRACTICE_WARMUP',
  PRACTICE_MAIN = 'PRACTICE_MAIN',
  PRACTICE_FEEDBACK = 'PRACTICE_FEEDBACK',
  PRACTICE_COMPLETE = 'PRACTICE_COMPLETE',
  
  // Progress
  SESSION_SUMMARY = 'SESSION_SUMMARY',
  REASSESSMENT = 'REASSESSMENT',

  // Additions for compatibility with existing App.tsx logic
  PATH_COMPLETE = 'PATH_COMPLETE',
  PRACTICE_SESSION_GENERATE = 'PRACTICE_SESSION_GENERATE',
  PRACTICE_SESSION = 'PRACTICE_SESSION',
}

export enum Level {
  TOURIST = 'Tourist',
  LOCAL = 'Local',
  INSIDER = 'Insider'
}

export enum Goal {
  CASUAL = 'Natural & Clear',
  SLANG = 'Fluent with Slang'
}

export enum LearningPath {
  CONNECTED_SPEECH = 'CONNECTED_SPEECH',
  SOUND_ACCURACY = 'SOUND_ACCURACY',
  RHYTHM_FLOW = 'RHYTHM_FLOW',
  VOCABULARY_SLANG = 'VOCABULARY_SLANG'
}

export enum ExerciseType {
  SHADOWING = 'SHADOWING',
  DELAYED_SHADOWING = 'DELAYED_SHADOWING',
  MUMBLE_SHADOWING = 'MUMBLE_SHADOWING',
  MINIMAL_PAIRS = 'MINIMAL_PAIRS',
  TONGUE_PLACEMENT = 'TONGUE_PLACEMENT',
  MIRROR_PRACTICE = 'MIRROR_PRACTICE',
  LISTEN_REPEAT = 'LISTEN_REPEAT',
  LISTEN_IDENTIFY = 'LISTEN_IDENTIFY',
  DICTATION = 'DICTATION',
  FREESTYLE = 'FREESTYLE',
  TRANSLATION = 'TRANSLATION',
  SENTENCE_BUILD = 'SENTENCE_BUILD',
  ROLE_PLAY = 'ROLE_PLAY',
  BEAT_MAPPING = 'BEAT_MAPPING',
  METRONOME_PRACTICE = 'METRONOME_PRACTICE',
  CONVERSATION = 'CONVERSATION',
  SPEED_DRILLS = 'SPEED_DRILLS',
  // FIX: Added missing ExerciseType enum members to fix errors in data/learningPaths.ts.
  TONGUE_TWISTERS = 'TONGUE_TWISTERS',
  WORD_LISTS = 'WORD_LISTS',
  VOWEL_CHARTS = 'VOWEL_CHARTS',
  CONTEXT_MATCHING = 'CONTEXT_MATCHING',
  DIALOGUE_PRACTICE = 'DIALOGUE_PRACTICE',
  REPLACE_FORMAL = 'REPLACE_FORMAL',
  NATURAL_INSERTION = 'NATURAL_INSERTION',
  REFERENCE_MATCHING = 'REFERENCE_MATCHING',
  SCHWA_SPOTTING = 'SCHWA_SPOTTING',
  INTONATION_MAPPING = 'INTONATION_MAPPING',
  FOCUS_DRILLS = 'FOCUS_DRILLS'
}


// ============ INTERFACES ============

// Assessment
export interface AssessmentText {
  id: string;
  text: string;
  targets: PhoneticTarget[];
  difficulty: 'diagnostic';
}

export interface PhoneticTarget {
  sound: string;
  examples: string[];
  commonErrors: string[];
}

export interface DetailedAssessmentResult {
  overallLevel: number;
  levelName: Level;
  goal: Goal;
  phoneticProfile: PhoneticProfile;
  topStrength: string;
  primaryFocus: string;
  secondaryFocus: string;
  recommendedPath: LearningPath;
  encouragement: string;
}

export interface PhoneticProfile {
  flapT: FeatureScore;
  connectedSpeech: FeatureScore;
  thSounds: FeatureScore;
  vowelQuality: FeatureScore;
  rhythmStress: FeatureScore;
  rSound: FeatureScore;
  intonation: FeatureScore;
}

export interface FeatureScore {
  score: number;
  trend: 'improving' | 'stable' | 'needs_work';
  lastUpdated: string;
  history: number[];
  feedback?: string;
  priority?: 'high' | 'medium' | 'low';
}

// Learning Path
export interface PathModule {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  exercises: ExerciseType[];
  assessmentCriteria: string[];
  estimatedMinutes: number;
}

export interface LearningPathDefinition {
  path: LearningPath;
  name: string;
  forWho: string;
  modules: PathModule[];
}

// Exercises
export interface Exercise {
  type: ExerciseType;
  content: ExerciseContent;
  targetSounds?: string[];
  difficulty: 1 | 2 | 3;
}

export interface ExerciseContent {
  audioUrl?: string;
  text: string;
  breakdown?: string[];
  tips?: string[];
  modelPronunciation?: string;
}

// Scripts
export interface TargetedScript {
  script: string;
  type: 'dialogue' | 'monologue' | 'social_post' | 'story';
  context: string;
  targetInstances: TargetInstance[];
  warmupPhrase: string;
  pronunciation_notes: string[];
}

export interface TargetInstance {
  phrase: string;
  feature: string;
  howItLooks: string;
  howItSounds: string;
}

// Feedback
export interface DetailedFeedback {
  overallScore: number;
  targetFeaturesAnalysis: FeatureAnalysis[];
  rhythm: { score: number; feedback: string };
  clarity: { score: number; feedback: string };
  naturalness: { score: number; feedback: string };
  celebration: string;
  oneThingToFix: string;
  practiceRecommendation: string;
}

export interface FeatureAnalysis {
  feature: string;
  score: number;
  heard: string;
  target: string;
  howItLooks: string;
  howItSounds: string;
  tip: string;
}

// FIX: Add missing SpokenResponseAnalysis type definition.
export interface SpokenResponseAnalysis {
  score: number;
  feedback: string;
}

// Progress
export interface UserProgress {
  odId: string;
  createdAt: string;
  lastSessionAt: string;
  initialAssessment: DetailedAssessmentResult | null;
  assessmentHistory: AssessmentHistoryEntry[];
  currentLevel: number;
  currentLevelName: Level;
  assignedPath: LearningPath;
  goal: Goal;
  completedModules: string[];
  currentModule: string | null;
  moduleProgress: Record<string, ModuleProgressData>;
  exerciseHistory: ExerciseAttempt[];
  phoneticProfile: PhoneticProfile;
  totalPracticeMinutes: number;
  totalSessions: number;
  streakDays: number;
  lastStreakDate: string;
}

export interface AssessmentHistoryEntry {
  date: string;
  level: number;
  phoneticProfile: PhoneticProfile;
}

export interface ModuleProgressData {
  moduleId: string;
  started: string;
  completed: string | null;
  exercisesCompleted: number;
  exercisesTotal: number;
  averageScore: number;
}

export interface ExerciseAttempt {
  exerciseId: string;
  moduleId: string;
  date: string;
  score: number;
  feedback: string;
  targetFeatures: string[];
  duration: number;
}

// Slang (keeping from original)
export interface SlangTerm {
  term: string;
  meaning: string;
}

export interface VibeCheckContent {
  slangBreakdown: SlangTerm[];
  questions: string[];
  challenge: string;
}
