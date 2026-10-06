import { FormField, FormCategory, LogicOperator, LogicAction } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface FormTemplate {
    id: string;
    title: string;
    description: string;
    category: FormCategory;
    isQuiz: boolean;
    icon: string;
    fields: Omit<FormField, 'id'>[];
    settings?: any;
    popularity?: number;
    rating?: number;
}

interface LogicRef {
    src: number;
    operator: LogicOperator;
    value: string;
    action: LogicAction;
    tgt: number;
}

const genId = (p: string) => `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/** Options helper: O('A','B') -> [{label,value}] */
const O = (...labels: string[]) => labels.map((label) => ({ id: genId('opt'), label, value: label.toLowerCase().replace(/[^a-z0-9]+/g, '-') }));

/** Build a template: assigns field ids/order, resolves logic refs (by index) into real rule objects */
const build = (cfg: {
    id: string; title: string; description: string; category: FormCategory; isQuiz: boolean;
    icon: string; fields: any[]; logic?: LogicRef[]; settings?: any; popularity?: number; rating?: number;
}): FormTemplate => {
    const fields: any[] = cfg.fields.map((f, i) => ({
        id: `${cfg.id}-f${i + 1}`,
        order: i + 1,
        page: 1,
        required: false,
        logicRules: [],
        ...f,
    }));
    (cfg.logic || []).forEach((r, ri) => {
        const src = fields[r.src];
        const tgt = fields[r.tgt];
        if (!src || !tgt) return;
        src.logicRules = [...(src.logicRules || []), {
            id: `${cfg.id}-r${ri + 1}`,
            sourceFieldId: src.id,
            operator: r.operator,
            targetValue: r.value,
            action: r.action,
            targetFieldId: tgt.id,
        }];
    });
    return { ...cfg, fields };
};

const quizSettings = (title: string) => ({
    quiz: {
        enabled: true, showLeaderboard: true, showImmediateFeedback: true,
        antiCheatTabDetection: true, antiCheatDisableCopyPaste: true,
        passPercentage: 70, generateCertificate: true, certificateTitle: title,
        timeLimitMinutes: 10,
    },
});

// ---------------------------------------------------------------- FEEDBACK (21)
const FEEDBACK_TOPICS = [
    'Customer Satisfaction', 'NPS Loyalty', 'Product Feedback', 'Support Quality', 'Restaurant Dining',
    'Hotel Stay', 'E-commerce Order', 'Mobile App', 'Online Course', 'Event Experience',
    'SaaS Onboarding', 'Delivery Service', 'Banking Service', 'Healthcare Visit', 'Gym Membership',
    'Airline Travel', 'Bug Report', 'Feature Request', 'Webinar Feedback', 'Subscription Cancellation', 'Community Forum',
];

const feedbackTemplates = (): FormTemplate[] => FEEDBACK_TOPICS.map((t, i) => {
    const pat = i % 3;
    if (pat === 0) {
        return build({
            id: `tpl-fb-${i + 1}`, title: `${t} Survey`, description: `Measure satisfaction for ${t.toLowerCase()} with NPS, ratings and smart follow-ups.`,
            category: 'Feedback', isQuiz: false, icon: '😊', popularity: 95 - i, rating: 4.8,
            fields: [
                { type: 'text', label: 'Full Name', placeholder: 'Your name', required: true },
                { type: 'email', label: 'Email Address', placeholder: 'you@example.com', required: true },
                { type: 'nps', label: `How likely are you to recommend our ${t.toLowerCase()}?`, description: '0 = Not at all, 10 = Extremely likely', required: true },
                { type: 'rating', label: 'Overall satisfaction', required: true, max: 5 },
                { type: 'textarea', label: 'What can we improve?', placeholder: 'Be specific — we read everything...' },
                { type: 'checkbox', label: 'May we contact you about your feedback?', options: O('Yes, by email', 'Yes, by phone', 'No thanks') },
            ],
            logic: [
                { src: 2, operator: 'less_than', value: '7', action: 'show', tgt: 4 },
                { src: 3, operator: 'less_than', value: '3', action: 'show', tgt: 4 },
            ],
        });
    }
    if (pat === 1) {
        return build({
            id: `tpl-fb-${i + 1}`, title: `${t} Review Form`, description: `Star ratings, aspect scores and photo-friendly review flow for ${t.toLowerCase()}.`,
            category: 'Feedback', isQuiz: false, icon: '⭐', popularity: 88 - i, rating: 4.7,
            fields: [
                { type: 'text', label: 'Name', placeholder: 'Your name' },
                { type: 'rating', label: 'Quality', required: true, max: 5 },
                { type: 'rating', label: 'Value for money', required: true, max: 5 },
                { type: 'rating', label: 'Support experience', required: true, max: 5 },
                { type: 'select', label: 'How often do you use it?', required: true, options: O('Daily', 'Weekly', 'Monthly', 'First time') },
                { type: 'textarea', label: 'Tell us more', placeholder: 'What stood out?' },
                { type: 'file', label: 'Attach a screenshot (optional)', acceptedFileTypes: '.png,.jpg,.pdf', maxFileSizeMb: 5 },
            ],
            logic: [{ src: 1, operator: 'less_than', value: '3', action: 'show', tgt: 5 }],
        });
    }
    return build({
        id: `tpl-fb-${i + 1}`, title: `${t} Support Check`, description: `Support reason routing with priority follow-up for ${t.toLowerCase()}.`,
        category: 'Feedback', isQuiz: false, icon: '💬', popularity: 80 - i, rating: 4.6,
        fields: [
            { type: 'email', label: 'Email', placeholder: 'you@example.com', required: true },
            { type: 'select', label: 'Topic', required: true, options: O('Billing', 'Technical issue', 'Account access', 'Something else') },
            { type: 'text', label: 'Account ID (billing only)', placeholder: 'e.g. ACC-1234' },
            { type: 'scale', label: 'Urgency (1-10)', required: true, min: 1, max: 10 },
            { type: 'textarea', label: 'Describe the issue', required: true, placeholder: 'What happened?' },
            { type: 'terms', label: 'I agree to be contacted about this ticket', required: true },
        ],
        logic: [{ src: 1, operator: 'equals', value: 'billing', action: 'show', tgt: 2 }],
    });
});

// ---------------------------------------------------------------- QUIZ (21)
const QUIZ_TOPICS = [
    'React Fundamentals', 'TypeScript Basics', 'Python Essentials', 'JavaScript Mastery', 'CSS Layouts',
    'HTML Semantics', 'SQL Queries', 'Git Workflow', 'Math Challenge', 'Science Explorer',
    'World History', 'Geography Quest', 'English Grammar', 'General Knowledge', 'Digital Marketing',
    'Cyber Security', 'Networking Basics', 'Machine Learning Intro', 'Finance Literacy', 'Sports Trivia', 'Data Structures',
];

const REAL_QUIZ_QA: Record<string, { q: string; opts: string[]; answer: number }[]> = {
    'React Fundamentals': [
        { q: 'Which hook handles side effects in function components?', opts: ['useState', 'useEffect', 'useContext', 'useRef'], answer: 1 },
        { q: 'Which method updates state in class components?', opts: ['this.updateState()', 'this.setState()', 'this.modifyState()', 'this.changeState()'], answer: 1 },
    ],
    'TypeScript Basics': [
        { q: 'What does the keyof operator do?', opts: ['Returns keys of an object type', 'Returns values of an object', 'Creates a new key', 'Deletes a key'], answer: 0 },
        { q: 'Which utility type makes all properties optional?', opts: ['Required<T>', 'Partial<T>', 'Readonly<T>', 'Pick<T>'], answer: 1 },
    ],
    'Python Essentials': [
        { q: 'Which keyword defines a function in Python?', opts: ['func', 'def', 'function', 'lambda-def'], answer: 1 },
        { q: 'What does len([1,2,3]) return?', opts: ['2', '3', '6', 'Error'], answer: 1 },
    ],
    'JavaScript Mastery': [
        { q: 'Which of these is NOT a primitive type?', opts: ['string', 'number', 'object', 'boolean'], answer: 2 },
        { q: 'What does === compare?', opts: ['Value only', 'Value and type', 'Reference only', 'Nothing'], answer: 1 },
    ],
    'CSS Layouts': [
        { q: 'Which property creates a flex container?', opts: ['display: grid', 'display: flex', 'position: flex', 'float: flex'], answer: 1 },
        { q: 'Which unit is relative to the root font size?', opts: ['px', 'em', 'rem', '%'], answer: 2 },
    ],
    'SQL Queries': [
        { q: 'Which clause filters grouped rows?', opts: ['WHERE', 'HAVING', 'FILTER', 'GROUP'], answer: 1 },
        { q: 'Which JOIN returns all rows from both tables?', opts: ['INNER JOIN', 'LEFT JOIN', 'FULL OUTER JOIN', 'CROSS APPLY'], answer: 2 },
    ],
    'Git Workflow': [
        { q: 'Which command stages all changes?', opts: ['git commit -a', 'git add .', 'git stage --all!', 'git push'], answer: 1 },
        { q: 'What does git pull do?', opts: ['Push only', 'Fetch + merge', 'Delete branches', 'Stash changes'], answer: 1 },
    ],
};

const quizTemplates = (): FormTemplate[] => QUIZ_TOPICS.map((t, i) => {
    const real = REAL_QUIZ_QA[t];
    const mcq = (q: string, opts: string[], answer: number, points = 10) => ({
        type: 'quiz_mcq', label: q, required: true, points,
        options: opts.map((label, j) => ({ id: genId('opt'), label, value: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'), isCorrect: j === answer, scorePoints: j === answer ? points : 0 })),
    });
    const fields = real
        ? [
            { type: 'text', label: 'Your Name', placeholder: 'Full name', required: true },
            mcq(real[0].q, real[0].opts, real[0].answer),
            mcq(real[1].q, real[1].opts, real[1].answer),
            { type: 'quiz_tf', label: `${t} rewards consistent practice over cramming.`, required: true, points: 5, correctAnswer: 'true', options: [{ id: genId('opt'), label: 'True', value: 'true', isCorrect: true }, { id: genId('opt'), label: 'False', value: 'false' }] },
            { type: 'quiz_short', label: `In one line, what is the single most important ${t.toLowerCase()} concept?`, required: true, points: 10 },
            { type: 'rating', label: 'Rate your confidence before submitting', max: 5 },
        ]
        : [
            { type: 'text', label: 'Your Name', placeholder: 'Full name', required: true },
            mcq(`Which statement best captures ${t.toLowerCase()} fundamentals?`, [`Core ${t} principle A (correct)`, `${t} misconception B`, `${t} myth C`, `Unrelated option D`], 0),
            mcq(`You face a typical ${t.toLowerCase()} problem. What do you do first?`, ['Define the problem clearly (correct)', 'Guess randomly', 'Skip it entirely', 'Copy an unrelated answer'], 0, 10),
            { type: 'quiz_tf', label: `${t} mastery comes from deliberate practice.`, required: true, points: 5, correctAnswer: 'true', options: [{ id: genId('opt'), label: 'True', value: 'true', isCorrect: true }, { id: genId('opt'), label: 'False', value: 'false' }] },
            { type: 'quiz_short', label: `Define one key ${t.toLowerCase()} term in your own words.`, required: true, points: 10 },
            { type: 'rating', label: 'Rate your confidence before submitting', max: 5 },
        ];
    return build({
        id: `tpl-qz-${i + 1}`, title: `${t} Quiz`, description: `Graded ${t.toLowerCase()} assessment with auto-scoring, timer, anti-cheat and certificates.`,
        category: 'Quiz', isQuiz: true, icon: '🧠', popularity: 96 - i, rating: 4.9,
        fields, settings: quizSettings(`Certified ${t} Achiever`),
    });
});

// ---------------------------------------------------------------- SURVEY (21)
const SURVEY_TOPICS = [
    'Employee Engagement', 'Market Research', 'Customer Needs', 'UX Research', 'Workplace Wellness',
    'Student Satisfaction', 'Course Evaluation', 'Brand Awareness', 'Product-Market Fit', 'Remote Work',
    'Diversity & Inclusion', 'Training Effectiveness', 'Community Needs', 'Health & Lifestyle', 'Travel Preferences',
    'Food Habits', 'Shopping Behavior', 'Social Media Use', 'Environmental Attitudes', 'Event Planning', 'Pricing Sensitivity',
];

const surveyTemplates = (): FormTemplate[] => SURVEY_TOPICS.map((t, i) => {
    const pat = i % 3;
    if (pat === 0) {
        return build({
            id: `tpl-sv-${i + 1}`, title: `${t} Survey`, description: `Agreement-scale ${t.toLowerCase()} survey with conditional deep-dives.`,
            category: 'Survey', isQuiz: false, icon: '📊', popularity: 90 - i, rating: 4.7,
            fields: [
                { type: 'select', label: 'Which best describes you?', required: true, options: O('Student', 'Professional', 'Manager', 'Other') },
                { type: 'radio', label: `Overall, ${t.toLowerCase()} meets my expectations`, required: true, options: O('Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree') },
                { type: 'scale', label: 'Rate the experience (1-10)', required: true, min: 1, max: 10 },
                { type: 'textarea', label: 'What should we do differently?', placeholder: 'Your honest take...' },
                { type: 'checkbox', label: 'Topics you care about', options: O('Quality', 'Speed', 'Price', 'Support') },
            ],
            logic: [
                { src: 1, operator: 'contains', value: 'disagree', action: 'show', tgt: 3 },
                { src: 2, operator: 'less_than', value: '6', action: 'show', tgt: 3 },
            ],
        });
    }
    if (pat === 1) {
        return build({
            id: `tpl-sv-${i + 1}`, title: `${t} Research Poll`, description: `Demographics + behavior poll for ${t.toLowerCase()} insights.`,
            category: 'Survey', isQuiz: false, icon: '🔍', popularity: 84 - i, rating: 4.6,
            fields: [
                { type: 'select', label: 'Age group', required: true, options: O('Under 18', '18-24', '25-34', '35-44', '45+') },
                { type: 'radio', label: 'How often does this topic come up for you?', required: true, options: O('Daily', 'Weekly', 'Monthly', 'Rarely') },
                { type: 'checkbox', label: 'Where do you encounter it?', options: O('Work', 'School', 'Home', 'On the go') },
                { type: 'nps', label: 'How likely are you to recommend our approach?', required: true },
                { type: 'textarea', label: 'Anything we missed?' },
            ],
            logic: [{ src: 3, operator: 'less_than', value: '7', action: 'show', tgt: 4 }],
        });
    }
    return build({
        id: `tpl-sv-${i + 1}`, title: `${t} Quick Pulse`, description: `Two-minute ${t.toLowerCase()} pulse with rating + open text.`,
        category: 'Survey', isQuiz: false, icon: '⚡', popularity: 78 - i, rating: 4.5,
        fields: [
            { type: 'rating', label: `Rate ${t.toLowerCase()} this week`, required: true, max: 5 },
            { type: 'radio', label: 'Trend vs last week?', required: true, options: O('Better', 'Same', 'Worse') },
            { type: 'textarea', label: 'One thing to improve?', placeholder: 'Just one...' },
            { type: 'email', label: 'Email for follow-up (optional)', placeholder: 'you@example.com' },
        ],
        logic: [{ src: 1, operator: 'less_than', value: '3', action: 'show', tgt: 2 }],
    });
});

// ---------------------------------------------------------------- REGISTRATION (21)
const REG_TOPICS = [
    'Tech Conference', 'Design Workshop', 'Live Webinar', 'City Marathon', 'Hackathon',
    'Volunteer Drive', 'Music Festival', 'Art Class', 'Cooking Workshop', 'Yoga Retreat',
    'Career Fair', 'Book Club', 'Gaming Tournament', 'Photography Walk', 'Language Exchange',
    'Startup Pitch Night', 'Alumni Meetup', 'Charity Gala', 'Science Fair', 'Adoption Day', 'Blood Donation',
];

const registrationTemplates = (): FormTemplate[] => REG_TOPICS.map((t, i) => {
    const pat = i % 3;
    if (pat === 0) {
        return build({
            id: `tpl-rg-${i + 1}`, title: `${t} Registration`, description: `Attendee signup for ${t.toLowerCase()} with tickets, meals and consent.`,
            category: 'Registration', isQuiz: false, icon: '🎟️', popularity: 92 - i, rating: 4.8,
            fields: [
                { type: 'text', label: 'Full Name', placeholder: 'Jane Doe', required: true },
                { type: 'email', label: 'Email Address', placeholder: 'jane@example.com', required: true },
                { type: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000' },
                { type: 'select', label: 'Ticket Type', required: true, options: O('General Admission', 'VIP', 'Student', 'Speaker') },
                { type: 'select', label: 'VIP Lounge Access', options: O('Evening mixer', 'Green room', 'Both') },
                { type: 'radio', label: 'Dietary Requirements', options: O('None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Other') },
                { type: 'text', label: 'Please specify dietary needs', placeholder: 'e.g. nut allergy' },
                { type: 'terms', label: 'I agree to the event terms and photo policy', required: true },
            ],
            logic: [
                { src: 3, operator: 'equals', value: 'vip', action: 'show', tgt: 4 },
                { src: 5, operator: 'equals', value: 'other', action: 'show', tgt: 6 },
            ],
        });
    }
    if (pat === 1) {
        return build({
            id: `tpl-rg-${i + 1}`, title: `${t} Signup`, description: `Skill-matched signup for ${t.toLowerCase()} with session picks.`,
            category: 'Registration', isQuiz: false, icon: '📅', popularity: 86 - i, rating: 4.7,
            fields: [
                { type: 'text', label: 'Full Name', required: true, placeholder: 'Jane Doe' },
                { type: 'email', label: 'Email', required: true, placeholder: 'jane@example.com' },
                { type: 'select', label: 'Skill Level', required: true, options: O('Beginner', 'Intermediate', 'Advanced') },
                { type: 'checkbox', label: 'Sessions to attend', options: O('Morning', 'Afternoon', 'Evening', 'Full day') },
                { type: 'textarea', label: 'Goals for the day', placeholder: 'What do you want to learn?' },
                { type: 'terms', label: 'I agree to the code of conduct', required: true },
            ],
            logic: [{ src: 2, operator: 'equals', value: 'beginner', action: 'show', tgt: 4 }],
        });
    }
    return build({
        id: `tpl-rg-${i + 1}`, title: `${t} RSVP`, description: `Fast RSVP for ${t.toLowerCase()} with guest count and notes.`,
        category: 'Registration', isQuiz: false, icon: '✉️', popularity: 80 - i, rating: 4.6,
        fields: [
            { type: 'text', label: 'Full Name', required: true },
            { type: 'email', label: 'Email', required: true },
            { type: 'radio', label: 'Will you attend?', required: true, options: O('Yes, attending', 'Maybe', 'Cannot attend') },
            { type: 'number', label: 'Guests (including you)', min: 1, max: 10 },
            { type: 'textarea', label: 'Notes for organizers' },
        ],
        logic: [{ src: 2, operator: 'equals', value: 'yes,-attending', action: 'show', tgt: 3 }],
    });
});

// ---------------------------------------------------------------- LEAD GEN (21)
const LEAD_TOPICS = [
    'Product Demo', 'Free Trial', 'Consultation Call', 'Ebook Download', 'Webinar Signup',
    'Pricing Quote', 'ROI Calculator', 'Newsletter', 'Partner Program', 'Affiliate Signup',
    'Beta Access', 'Audit Request', 'Migration Assessment', 'Security Review', 'Training Inquiry',
    'Support Plan', 'Enterprise Contact', 'Startup Program', 'Nonprofit Discount', 'Referral Signup', 'Comparison Guide',
];

const leadTemplates = (): FormTemplate[] => LEAD_TOPICS.map((t, i) => {
    const pat = i % 3;
    if (pat === 0) {
        return build({
            id: `tpl-ld-${i + 1}`, title: `${t} — Capture`, description: `Qualify ${t.toLowerCase()} interest with budget routing.`,
            category: 'Lead Generation', isQuiz: false, icon: '🎯', popularity: 93 - i, rating: 4.8,
            fields: [
                { type: 'text', label: 'Full Name', required: true, placeholder: 'Your name' },
                { type: 'email', label: 'Business Email', required: true, placeholder: 'you@company.com' },
                { type: 'text', label: 'Company Name', required: true, placeholder: 'Acme Inc.' },
                { type: 'select', label: 'Company Size', required: true, options: O('1-10', '11-50', '51-200', '201-1000', '1000+') },
                { type: 'radio', label: 'What brings you here?', required: true, options: O('Pricing', 'Live demo', 'Free trial', 'Just researching') },
                { type: 'select', label: 'Monthly budget range', options: O('Under $500', '$500-$2k', '$2k-$10k', '$10k+') },
                { type: 'textarea', label: 'What problem are you solving?' },
            ],
            logic: [{ src: 4, operator: 'equals', value: 'pricing', action: 'show', tgt: 5 }],
        });
    }
    if (pat === 1) {
        return build({
            id: `tpl-ld-${i + 1}`, title: `${t} Signup`, description: `Low-friction ${t.toLowerCase()} signup with role context.`,
            category: 'Lead Generation', isQuiz: false, icon: '🚀', popularity: 87 - i, rating: 4.7,
            fields: [
                { type: 'text', label: 'Full Name', required: true },
                { type: 'email', label: 'Work Email', required: true },
                { type: 'select', label: 'Your Role', required: true, options: O('Founder', 'Marketer', 'Engineer', 'Operations', 'Other') },
                { type: 'text', label: 'Tell us your role', placeholder: 'e.g. Growth lead' },
                { type: 'checkbox', label: 'I want updates about', options: O('New features', 'Webinars', 'Case studies') },
            ],
            logic: [{ src: 2, operator: 'equals', value: 'other', action: 'show', tgt: 3 }],
        });
    }
    return build({
        id: `tpl-ld-${i + 1}`, title: `${t} Express`, description: `Three-field ${t.toLowerCase()} express capture with consent.`,
        category: 'Lead Generation', isQuiz: false, icon: '⚡', popularity: 81 - i, rating: 4.6,
        fields: [
            { type: 'text', label: 'Name', required: true },
            { type: 'email', label: 'Email', required: true },
            { type: 'phone', label: 'Phone (for faster response)' },
            { type: 'terms', label: 'I agree to be contacted about this inquiry', required: true },
        ],
    });
});

// ---------------------------------------------------------------- APPLICATION (21)
const APP_TOPICS = [
    'Job Application', 'Internship', 'Scholarship', 'University Admission', 'Personal Loan',
    'Apartment Rental', 'Volunteer Role', 'Grant Proposal', 'Fellowship', 'Accelerator',
    'Mentorship', 'Freelance Gig', 'Board Membership', 'Pet Adoption', 'Vendor Registration',
    'Press Pass', 'Research Grant', 'Art Residency', 'Coaching Program', 'Visa Support', 'Equipment Loan',
];

const applicationTemplates = (): FormTemplate[] => APP_TOPICS.map((t, i) => {
    const pat = i % 3;
    if (pat === 0) {
        return build({
            id: `tpl-ap-${i + 1}`, title: t, description: `Structured ${t.toLowerCase()} with screening, files and senior-track routing.`,
            category: 'Application', isQuiz: false, icon: '📋', popularity: 91 - i, rating: 4.8,
            fields: [
                { type: 'text', label: 'Full Name', required: true, placeholder: 'Jane Smith' },
                { type: 'email', label: 'Email', required: true },
                { type: 'phone', label: 'Phone', required: true },
                { type: 'select', label: 'Years of Experience', required: true, options: O('0-1 years', '2-4 years', '5-8 years', '8+ years') },
                { type: 'number', label: 'Expected compensation (annual)', min: 0, placeholder: 'e.g. 80000' },
                { type: 'file', label: 'Upload Resume (PDF)', required: true, acceptedFileTypes: '.pdf,.doc,.docx', maxFileSizeMb: 5 },
                { type: 'url', label: 'Portfolio / LinkedIn URL', placeholder: 'https://...' },
                { type: 'textarea', label: 'Why are you a great fit?', required: true },
            ],
            logic: [{ src: 3, operator: 'equals', value: '8+-years', action: 'show', tgt: 4 }],
        });
    }
    if (pat === 1) {
        return build({
            id: `tpl-ap-${i + 1}`, title: t, description: `Essay-based ${t.toLowerCase()} with academic context.`,
            category: 'Application', isQuiz: false, icon: '🎓', popularity: 85 - i, rating: 4.7,
            fields: [
                { type: 'text', label: 'Full Name', required: true },
                { type: 'email', label: 'Email', required: true },
                { type: 'text', label: 'School / Organization', required: true },
                { type: 'number', label: 'GPA (0-4 scale)', min: 0, max: 4, step: 0.1 },
                { type: 'textarea', label: 'Personal statement (300 words)', required: true },
                { type: 'file', label: 'Supporting documents', acceptedFileTypes: '.pdf,.doc,.docx' },
            ],
            logic: [{ src: 3, operator: 'less_than', value: '3', action: 'show', tgt: 5 }],
        });
    }
    return build({
        id: `tpl-ap-${i + 1}`, title: t, description: `Logistics-aware ${t.toLowerCase()} with dates and details.`,
        category: 'Application', isQuiz: false, icon: '📝', popularity: 79 - i, rating: 4.6,
        fields: [
            { type: 'text', label: 'Full Name', required: true },
            { type: 'email', label: 'Email', required: true },
            { type: 'date', label: 'Preferred start date', required: true },
            { type: 'radio', label: 'Do you need special arrangements?', required: true, options: O('Yes', 'No') },
            { type: 'textarea', label: 'Arrangement details', placeholder: 'Tell us what you need...' },
            { type: 'terms', label: 'I confirm the details above are accurate', required: true },
        ],
        logic: [{ src: 3, operator: 'equals', value: 'yes', action: 'show', tgt: 4 }],
    });
});

// ---------------------------------------------------------------- GENERAL (21)
const GENERAL_TOPICS = [
    'Contact Us', 'Quick Poll', 'Table Booking', 'Service Booking', 'Product Order',
    'Event RSVP', 'Appointment', 'Feedback Short', 'Complaint', 'Suggestion Box',
    'Lost & Found', 'Quote Request', 'Callback Request', 'Newsletter Signup', 'Waitlist',
    'Donation', 'Test Drive', 'Site Visit', 'Maintenance Request', 'Return Request', 'Refer-a-Friend',
];

const generalTemplates = (): FormTemplate[] => GENERAL_TOPICS.map((t, i) => {
    const pat = i % 4;
    if (pat === 0) {
        return build({
            id: `tpl-gn-${i + 1}`, title: t, description: `${t} with topic routing and priority follow-up.`,
            category: 'General', isQuiz: false, icon: '📨', popularity: 89 - i, rating: 4.7,
            fields: [
                { type: 'text', label: 'Name', required: true },
                { type: 'email', label: 'Email', required: true },
                { type: 'select', label: 'Topic', required: true, options: O('General question', 'Support', 'Sales', 'Press') },
                { type: 'radio', label: 'Priority', options: O('Low', 'Normal', 'Urgent') },
                { type: 'textarea', label: 'Message', required: true, placeholder: 'How can we help?' },
            ],
            logic: [{ src: 2, operator: 'equals', value: 'support', action: 'show', tgt: 3 }],
        });
    }
    if (pat === 1) {
        return build({
            id: `tpl-gn-${i + 1}`, title: t, description: `One-question ${t.toLowerCase()} poll with optional comment.`,
            category: 'General', isQuiz: false, icon: '📊', popularity: 83 - i, rating: 4.6,
            fields: [
                { type: 'radio', label: `Your take on ${t.toLowerCase()}?`, required: true, options: O('Love it', 'It is fine', 'Needs work', 'No opinion') },
                { type: 'textarea', label: 'Add a comment (optional)' },
                { type: 'email', label: 'Email for results (optional)' },
            ],
        });
    }
    if (pat === 2) {
        return build({
            id: `tpl-gn-${i + 1}`, title: t, description: `Date-based ${t.toLowerCase()} booking with party details.`,
            category: 'General', isQuiz: false, icon: '📅', popularity: 87 - i, rating: 4.7,
            fields: [
                { type: 'text', label: 'Full Name', required: true },
                { type: 'email', label: 'Email', required: true },
                { type: 'date', label: 'Preferred date', required: true },
                { type: 'time', label: 'Preferred time', required: true },
                { type: 'number', label: 'Number of guests', required: true, min: 1, max: 20 },
                { type: 'textarea', label: 'Special requests' },
            ],
            logic: [{ src: 4, operator: 'greater_than', value: '6', action: 'show', tgt: 5 }],
        });
    }
    return build({
        id: `tpl-gn-${i + 1}`, title: t, description: `Order-style ${t.toLowerCase()} with item, quantity and address.`,
        category: 'General', isQuiz: false, icon: '🛒', popularity: 81 - i, rating: 4.6,
        fields: [
            { type: 'text', label: 'Full Name', required: true },
            { type: 'email', label: 'Email', required: true },
            { type: 'select', label: 'Item', required: true, options: O('Standard', 'Premium', 'Deluxe', 'Custom') },
            { type: 'select', label: 'Customization notes', options: O('Gift wrap', 'Express handling', 'None') },
            { type: 'number', label: 'Quantity', required: true, min: 1, max: 99 },
            { type: 'textarea', label: 'Delivery address', required: true },
        ],
        logic: [{ src: 2, operator: 'equals', value: 'custom', action: 'show', tgt: 3 }],
    });
});

// ---------------------------------------------------------------- LIBRARY
const buildLibrary = (): FormTemplate[] => [
    ...feedbackTemplates(),
    ...quizTemplates(),
    ...surveyTemplates(),
    ...registrationTemplates(),
    ...leadTemplates(),
    ...applicationTemplates(),
    ...generalTemplates(),
];

export const formTemplates: FormTemplate[] = buildLibrary();

export const getTemplateById = (id: string): FormTemplate | undefined => {
    return formTemplates.find(t => t.id === id);
};

export const getTemplatesByCategory = (category: FormCategory | 'All'): FormTemplate[] => {
    if (category === 'All') return formTemplates;
    return formTemplates.filter(t => t.category === category);
};

export const searchTemplates = (query: string, category: FormCategory | 'All' = 'All'): FormTemplate[] => {
    const q = query.trim().toLowerCase();
    return getTemplatesByCategory(category).filter((t) =>
        !q || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
};

export const templateStats = () => {
    const cats = ['Feedback', 'Quiz', 'Survey', 'Registration', 'Lead Generation', 'Application', 'General'] as FormCategory[];
    return {
        total: formTemplates.length,
        byCategory: cats.map((c) => ({ category: c, count: formTemplates.filter((t) => t.category === c).length })),
        withLogic: formTemplates.filter((t) => t.fields.some((f: any) => (f.logicRules || []).length > 0)).length,
        quizzes: formTemplates.filter((t) => t.isQuiz).length,
    };
};

/** Instantiate a template into a ready-to-save form payload with fresh UUIDs + remapped logic refs */
export const instantiateTemplate = (t: FormTemplate) => {
    const idMap = new Map<string, string>();
    const fields = t.fields.map((f: any, i: number) => {
        const newId = genId('field');
        idMap.set(f.id, newId);
        return { ...f, id: newId, order: i + 1, page: 1, logicRules: [] as any[] };
    });
    t.fields.forEach((f: any, i: number) => {
        const rules = (f.logicRules || []).map((r: any) => ({
            ...r,
            id: genId('rule'),
            sourceFieldId: idMap.get(r.sourceFieldId) || fields[i].id,
            targetFieldId: r.targetFieldId ? (idMap.get(r.targetFieldId) || r.targetFieldId) : undefined,
        }));
        fields[i].logicRules = rules;
    });
    return {
        title: t.title,
        description: t.description,
        category: t.category,
        isQuiz: t.isQuiz,
        fields,
        settings: t.settings,
    };
};

/** Fetch templates from Supabase (falls back to the local 140+ library) */
export const fetchTemplatesFromSupabase = async (): Promise<FormTemplate[]> => {
    if (!isSupabaseConfigured) return formTemplates;
    try {
        const { data, error } = await supabase.from('templates').select('*').eq('is_public', true).order('created_at', { ascending: false });
        if (error || !data || data.length === 0) return formTemplates;
        return data.map((row: any) => ({
            id: row.id,
            title: row.title,
            description: row.description || '',
            category: row.category,
            isQuiz: row.is_quiz,
            icon: row.icon || '📋',
            fields: row.fields || [],
            settings: row.settings || {},
        }));
    } catch {
        return formTemplates;
    }
};

/** Seed the local library into Supabase templates (run once; skips when rows exist) */
export const seedTemplatesToSupabase = async (): Promise<{ seeded: number; skipped: boolean }> => {
    if (!isSupabaseConfigured) return { seeded: 0, skipped: true };
    const { data: existing } = await supabase.from('templates').select('id').limit(1);
    if (existing && existing.length > 0) return { seeded: 0, skipped: true };
    let seeded = 0;
    for (const t of formTemplates) {
        const { error } = await supabase.from('templates').insert({
            title: t.title,
            description: t.description,
            category: t.category,
            is_quiz: t.isQuiz,
            icon: t.icon,
            fields: t.fields,
            settings: t.settings || {},
            is_public: true,
        });
        if (!error) seeded++;
        if (seeded % 25 === 0) await new Promise((r) => setTimeout(r, 200));
    }
    return { seeded, skipped: false };
};
