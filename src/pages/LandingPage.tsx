import React from 'react';
import { Sparkles, Zap, Shield, BarChart3, HelpCircle, Users, ArrowRight, CheckCircle2, Star, Globe, Clock, Award, Layers, Bot, GitBranch, QrCode, Code2, Link } from 'lucide-react';
import { Logo } from '../components/Logo';

interface Props {
    onGetStarted: () => void;
    onSignIn: () => void;
}

export const LandingPage: React.FC<Props> = ({ onGetStarted, onSignIn }) => {
    const features = [
        { icon: Layers, title: 'Drag & Drop Builder', desc: '30+ field types with intuitive drag-and-drop canvas' },
        { icon: Bot, title: 'AI Form Generation', desc: 'Generate complete forms from natural language prompts' },
        { icon: GitBranch, title: 'Conditional Logic', desc: 'Branching, formulas, and dynamic scoring rules' },
        { icon: QrCode, title: 'Multi-Channel Publishing', desc: 'Share via link, QR code, or embed HTML snippet' },
        { icon: Shield, title: 'Anti-Cheat Quizzes', desc: 'Tab detection, copy protection, and proctoring' },
        { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Funnels, sentiment analysis, and live dashboards' },
        { icon: Award, title: 'PDF Certificates', desc: 'Auto-generate certificates for quiz participants' },
        { icon: Users, title: 'Team Collaboration', desc: 'Roles, private notes, tags, and bulk actions' },
    ];

    const stats = [
        { value: '30+', label: 'Field Types' },
        { value: '8', label: 'Quiz Question Types' },
        { value: '100%', label: 'Free Forever' },
        { value: '< 5s', label: 'AI Generation' },
    ];

    const testimonials = [
        { name: 'Sarah Chen', role: 'Product Manager', text: 'Collectly replaced three tools for us. The AI generation is incredibly accurate.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80' },
        { name: 'Marcus Johnson', role: 'HR Director', text: 'The quiz anti-cheat features saved us during remote assessments. Game changer.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80' },
        { name: 'Emily Rodriguez', role: 'Event Coordinator', text: 'Registration forms with QR codes made check-in seamless for 500+ attendees.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80' },
    ];

    return (
        <div className="min-h-screen bg-brand-bg">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-surface/80 backdrop-blur-md border-b border-brand-border">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Logo size="md" showTagline tagline="AI-Powered Platform" />
                    <div className="flex items-center space-x-3">
                        <button onClick={onSignIn} className="px-4 py-2 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-surfaceLight transition-colors">
                            Sign In
                        </button>
                        <button onClick={onGetStarted} className="px-5 py-2 rounded-xl bg-brand-primary text-white text-sm font-semibold shadow-glow hover:opacity-90 transition-all">
                            Get Started Free
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-glow-gradient pointer-events-none" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-xs font-semibold text-brand-primary mb-6">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI-Powered Form Builder — Free Forever</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-text leading-tight">
                        Build Forms, Surveys &<br />
                        <span className="text-transparent bg-clip-text bg-brand-gradient">Quizzes in Seconds</span>
                    </h1>
                    <p className="text-lg text-brand-muted max-w-2xl mx-auto mt-6 leading-relaxed">
                        The all-in-one platform for creating AI-powered forms, interactive quizzes, and comprehensive surveys. No credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                        <button onClick={onGetStarted} className="px-8 py-4 rounded-xl bg-brand-gradient text-white font-bold text-sm shadow-glow hover:opacity-90 transition-all flex items-center space-x-2">
                            <span>Start Building Free</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button onClick={onSignIn} className="px-8 py-4 rounded-xl bg-brand-surface border border-brand-border text-brand-text font-semibold text-sm hover:border-brand-primary/50 transition-all">
                            Sign In to Dashboard
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-8 text-xs text-brand-muted">
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No credit card</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Unlimited forms</span>
                        <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> AI included</span>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 px-6 border-y border-brand-border bg-brand-surface/50">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl font-black text-brand-text">{stat.value}</div>
                            <div className="text-xs text-brand-muted mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-brand-text">Everything You Need</h2>
                        <p className="text-sm text-brand-muted mt-2">Powerful features to create, publish, and analyze forms</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div key={feature.title} className="p-6 rounded-2xl bg-brand-surface border border-brand-border hover:border-brand-primary/50 transition-all group shadow-card">
                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-sm font-bold text-brand-text">{feature.title}</h3>
                                    <p className="text-xs text-brand-muted mt-1 leading-relaxed">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 bg-brand-surface/50 border-y border-brand-border">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-brand-text">How It Works</h2>
                        <p className="text-sm text-brand-muted mt-2">From idea to live form in three simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '1', title: 'Describe or Build', desc: 'Use AI to generate from a prompt, pick a template, or drag-and-drop fields', icon: Bot },
                            { step: '2', title: 'Customize & Configure', desc: 'Add conditional logic, scoring rules, branding, and security settings', icon: GitBranch },
                            { step: '3', title: 'Publish & Analyze', desc: 'Share via link, QR, or embed. Track responses in real-time analytics', icon: BarChart3 },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.step} className="text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center mx-auto mb-4 shadow-glow">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="text-xs font-bold text-brand-primary mb-1">STEP {item.step}</div>
                                    <h3 className="text-lg font-bold text-brand-text">{item.title}</h3>
                                    <p className="text-xs text-brand-muted mt-2 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-brand-text">Loved by Teams</h2>
                        <p className="text-sm text-brand-muted mt-2">See what our users have to say</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t) => (
                            <div key={t.name} className="p-6 rounded-2xl bg-brand-surface border border-brand-border shadow-card">
                                <div className="flex items-center gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-brand-text leading-relaxed mb-4">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                                    <div>
                                        <div className="text-xs font-bold text-brand-text">{t.name}</div>
                                        <div className="text-[10px] text-brand-muted">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="p-12 rounded-3xl bg-brand-gradient relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-extrabold text-white">Ready to Build Your First Form?</h2>
                            <p className="text-sm text-white/80 mt-3 max-w-md mx-auto">
                                Join thousands of teams using Collectly to create beautiful, intelligent forms and quizzes.
                            </p>
                            <button onClick={onGetStarted} className="mt-8 px-8 py-4 rounded-xl bg-white text-brand-primary font-bold text-sm hover:bg-brand-bg transition-colors inline-flex items-center space-x-2">
                                <span>Get Started Free</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-brand-border bg-brand-surface">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <Logo size="sm" showTagline tagline="AI-Powered Forms & Quizzes" />
                        <div className="flex items-center gap-6 text-xs text-brand-muted">
                            <span>AI-Powered Forms, Surveys & Quizzes</span>
                            <span>•</span>
                            <span>Free Forever</span>
                            <span>•</span>
                            <span>Realtime Analytics</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};