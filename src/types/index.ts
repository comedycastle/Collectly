export type FieldType =
    // Basic & Contact
    | 'text'
    | 'textarea'
    | 'email'
    | 'number'
    | 'phone'
    | 'url'
    | 'date'
    | 'time'
    | 'datetime'
    // Choice & Selection
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'rating'
    | 'scale'
    | 'nps'
    | 'matrix'
    | 'ranking'
    // Advanced & Interactive
    | 'signature'
    | 'file'
    | 'slider'
    | 'color'
    | 'code'
    | 'map'
    | 'audio'
    | 'video'
    | 'terms'
    | 'payment'
    // Layout Controls
    | 'section'
    | 'page_break'
    // Quiz Specific
    | 'quiz_mcq'
    | 'quiz_tf'
    | 'quiz_matching'
    | 'quiz_short'
    | 'quiz_ordering'
    | 'quiz_fill_blank';

export type LogicOperator =
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'not_contains'
    | 'greater_than'
    | 'less_than'
    | 'is_empty'
    | 'is_not_empty';

export type LogicAction = 'show' | 'hide' | 'jump_to_page' | 'calculate_score';

export interface LogicRule {
    id: string;
    sourceFieldId: string;
    operator: LogicOperator;
    targetValue: string;
    action: LogicAction;
    targetFieldId?: string;
    targetPage?: number;
    scoreAdjustment?: number;
}

export interface FieldOption {
    id: string;
    label: string;
    value: string;
    isCorrect?: boolean; // For quiz questions
    scorePoints?: number;
}

export interface MatchingPair {
    id: string;
    left: string;
    right: string;
}

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    description?: string;
    placeholder?: string;
    required: boolean;
    order: number;
    page?: number;
    options?: FieldOption[];
    matchingPairs?: MatchingPair[]; // For matching quiz type
    matrixColumns?: string[]; // For matrix grid columns
    correctAnswer?: string | string[]; // For quiz short answer / tf / fill blank
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: string;
    points?: number; // Quiz points assigned
    logicRules?: LogicRule[];
    validationPattern?: string;
    acceptedFileTypes?: string;
    maxFileSizeMb?: number;
}

export interface FormTheme {
    primaryColor: string;
    secondaryColor?: string;
    accentColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    gradientStart?: string;
    gradientEnd?: string;
    fontFamily: string;
    borderRadius: string;
    logoUrl?: string;
    customCss?: string;
}

export interface QuizSettings {
    enabled: boolean;
    timeLimitMinutes?: number;
    perQuestionTimerSeconds?: number;
    showLeaderboard: boolean;
    showImmediateFeedback: boolean;
    antiCheatTabDetection: boolean;
    antiCheatDisableCopyPaste: boolean;
    passPercentage: number;
    generateCertificate: boolean;
    certificateTitle?: string;
}

export interface FormSettings {
    passwordProtection?: string;
    requireLogin: boolean;
    responseLimit?: number;
    startsAt?: string;
    endsAt?: string;
    showTimerCountdown: boolean;
    redirectUrl?: string;
    customThankYouTitle?: string;
    customThankYouMessage?: string;
    thankYouPages?: Array<{ id: string; condition: string; title: string; message: string }>;
    quiz: QuizSettings;
    theme: FormTheme;
    aiSentimentEnabled: boolean;
    enableCaptcha: boolean;
    enableDuplicateDetection: boolean;
    totalPages: number;
}

export interface FormVersion {
    id: string;
    formId: string;
    version: number;
    title: string;
    fields: FormField[];
    settings: FormSettings;
    createdAt: string;
    createdBy: string;
    changeDescription: string;
}

export interface ExportRecord {
    id: string;
    formId: string;
    formTitle: string;
    type: 'csv' | 'excel' | 'pdf';
    fileUrl?: string;
    requestedAt: string;
    requestedBy: string;
    recordCount: number;
}

export interface WebhookConfig {
    id: string;
    url: string;
    events: string[];
    active: boolean;
    secret?: string;
}

export type FormStatus = 'draft' | 'published' | 'archived' | 'closed';
export type FormCategory = 'Survey' | 'Quiz' | 'Registration' | 'Feedback' | 'Application' | 'Lead Generation' | 'General';

export interface Form {
    id: string;
    title: string;
    description: string;
    category: FormCategory;
    status: FormStatus;
    isQuiz: boolean;
    fields: FormField[];
    settings: FormSettings;
    createdAt: string;
    updatedAt: string;
    responseCount: number;
    completionRate: number; // percentage
    averageTimeSeconds: number;
    shareUrl: string;
}

export interface ResponseAnswer {
    fieldId: string;
    fieldLabel: string;
    value: any;
    isCorrect?: boolean;
    pointsEarned?: number;
}

export interface FormResponse {
    id: string;
    formId: string;
    submittedAt: string;
    answers: Record<string, ResponseAnswer>;
    score?: number;
    totalPossiblePoints?: number;
    passed?: boolean;
    timeSpentSeconds: number;
    isDuplicate: boolean;
    isSpam: boolean;
    tags: string[];
    teamNotes: Array<{
        id: string;
        author: string;
        text: string;
        createdAt: string;
    }>;
    sentiment?: 'positive' | 'neutral' | 'negative';
    sentimentScore?: number;
    deviceInfo?: {
        browser: string;
        os: string;
        device: 'desktop' | 'tablet' | 'mobile';
        country: string;
        city: string;
    };
}

export interface AnalyticsSummary {
    totalViews: number;
    totalSubmissions: number;
    completionRate: number;
    avgTimeSeconds: number;
    deviceBreakdown: { desktop: number; tablet: number; mobile: number };
    geoBreakdown: Array<{ country: string; count: number }>;
    funnelData: Array<{ step: string; dropoffRate: number; count: number }>;
    sentimentBreakdown: { positive: number; neutral: number; negative: number };
    responsesTimeline: Array<{ date: string; count: number }>;
}

export type AIProvider = 'gemini' | 'openrouter' | 'groq' | 'fallback';

export interface AIProviderConfig {
    activeProvider: AIProvider;
    geminiApiKey: string;
    openrouterApiKey: string;
    groqApiKey: string;
    fallbackOrder: AIProvider[];
}

export interface UserProfile {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string;
    role: 'Owner' | 'Admin' | 'Viewer';
    teamName: string;
}
