import React, { useRef, useState } from 'react';
import { X, Award, Download, Printer, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LogoMark } from './Logo';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    recipientName: string;
    quizTitle: string;
    certificateTitle?: string;
    scorePercentage: number;
    completedDate: string;
    responseId?: string;
}

export const CertificateModal: React.FC<Props> = ({
    isOpen,
    onClose,
    recipientName,
    quizTitle,
    certificateTitle = 'Certificate of Achievement',
    scorePercentage,
    completedDate,
    responseId,
}) => {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [certificateId] = useState(() => `COL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

    if (!isOpen) return null;

    const storeCertificateInSupabase = async (pdfBlob: Blob) => {
        try {
            const { isSupabaseConfigured } = await import('../lib/supabaseClient');
            if (!isSupabaseConfigured) return;
            const { certificateService } = await import('../services/formService');
            const { supabaseStorage } = await import('../services/supabaseStorage');
            const path = `certs/${Date.now()}_${(recipientName || 'participant').replace(/\s+/g, '_')}.pdf`;
            const storagePath = await supabaseStorage.uploadCertificate(path, pdfBlob);
            const publicUrl = await supabaseStorage.getPublicUrl('certificates', storagePath);
            if (responseId) {
                await certificateService.createCertificate({
                    response_id: responseId,
                    recipient_name: recipientName || 'Valued Participant',
                    certificate_title: certificateTitle,
                    pdf_url: publicUrl,
                    score_percentage: scorePercentage,
                });
            }
        } catch (e) {
            console.warn('Certificate Supabase store failed:', e);
        }
    };

    const handleDownloadPDF = async () => {
        if (!certificateRef.current) return;
        setIsGenerating(true);
        try {
            // Render at high density (scale 2.5) for crisp print & vector-like font rendering
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2.5,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#090D16',
                logging: false,
                windowWidth: 1200,
            });

            const imgData = canvas.toDataURL('image/png', 1.0);
            // Standard A4 landscape is 297mm x 210mm
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });

            pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
            const pdfBlob = pdf.output('blob');
            await storeCertificateInSupabase(pdfBlob);
            pdf.save(`${(recipientName || 'Participant').replace(/\s+/g, '_')}_Certificate.pdf`);
        } catch (e) {
            console.error('PDF generation error:', e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePrint = async () => {
        if (!certificateRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2.5,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#090D16',
                logging: false,
                windowWidth: 1200,
            });
            const imgData = canvas.toDataURL('image/png', 1.0);

            // Create an isolated hidden iframe for clean full-bleed A4 landscape printing
            const printIframe = document.createElement('iframe');
            printIframe.style.position = 'fixed';
            printIframe.style.right = '0';
            printIframe.style.bottom = '0';
            printIframe.style.width = '0';
            printIframe.style.height = '0';
            printIframe.style.border = '0';
            document.body.appendChild(printIframe);

            const doc = printIframe.contentWindow?.document;
            if (doc) {
                doc.open();
                doc.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${certificateTitle} - ${recipientName || 'Participant'}</title>
                        <style>
                            @page {
                                size: A4 landscape;
                                margin: 0;
                            }
                            html, body {
                                margin: 0;
                                padding: 0;
                                width: 100vw;
                                height: 100vh;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                background: #090D16;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            img {
                                width: 100%;
                                height: 100%;
                                object-fit: contain;
                            }
                        </style>
                    </head>
                    <body>
                        <img src="${imgData}" />
                    </body>
                    </html>
                `);
                doc.close();

                const img = doc.querySelector('img');
                if (img) {
                    img.onload = () => {
                        setTimeout(() => {
                            printIframe.contentWindow?.focus();
                            printIframe.contentWindow?.print();
                            setTimeout(() => {
                                if (document.body.contains(printIframe)) {
                                    document.body.removeChild(printIframe);
                                }
                            }, 2000);
                        }, 250);
                    };
                }
            }
        } catch (e) {
            console.error('Print failed:', e);
            window.print();
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-brand-surface border border-brand-border rounded-2xl shadow-glow overflow-hidden flex flex-col max-h-[92vh]">
                {/* Modal Top Bar */}
                <div className="flex items-center justify-between p-4 border-b border-brand-border bg-brand-bg/60 shrink-0">
                    <div className="flex items-center space-x-2 text-brand-accent">
                        <Award className="w-5 h-5 text-amber-400" />
                        <span className="text-sm font-bold text-brand-text">Verified Assessment Certificate</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-brand-muted hover:text-brand-text hover:bg-brand-surfaceLight transition-colors"
                        aria-label="Close certificate modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Certificate Printable Canvas Container */}
                <div className="p-4 sm:p-6 overflow-auto flex justify-center bg-slate-950/90 items-center flex-1">
                    {/* A4 Landscape Canvas Aspect Ratio (842px x 595px) */}
                    <div
                        ref={certificateRef}
                        id="collectly-certificate-print"
                        className="w-[842px] h-[595px] relative bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E1B4B] rounded-xl p-3 flex flex-col justify-between text-center text-white shadow-2xl overflow-hidden shrink-0 select-none border-4 border-amber-500/80"
                        style={{ boxSizing: 'border-box' }}
                    >
                        {/* Inner Inset Decorative Border */}
                        <div className="w-full h-full border-2 border-amber-400/40 rounded-lg p-6 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-transparent via-blue-950/10 to-indigo-950/20">
                            
                            {/* Decorative Gold Corner Brackets */}
                            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-400" />
                            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-400" />
                            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-400" />
                            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-400" />

                            {/* Background Ambient Glows & Translucent Watermark */}
                            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
                                <LogoMark size="xl" idPrefix="cert-watermark" />
                            </div>

                            {/* Header Section */}
                            <div className="relative z-10 pt-2">
                                <div className="flex items-center justify-center space-x-2.5 mb-2.5">
                                    <div className="w-11 h-11 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-sm">
                                        <Award className="w-6 h-6 text-amber-300" />
                                    </div>
                                </div>
                                <h1
                                    className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.2em] text-amber-400"
                                    style={{ color: '#FBBF24', textShadow: '0 2px 10px rgba(251, 191, 36, 0.25)' }}
                                >
                                    {certificateTitle}
                                </h1>
                                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-200/90 mt-1.5">
                                    THIS IS PROUDLY PRESENTED TO
                                </p>
                            </div>

                            {/* Recipient Section */}
                            <div className="relative z-10 my-auto py-2">
                                <div className="inline-block max-w-[85%] border-b-2 border-amber-400 pb-2 px-8">
                                    <h2
                                        className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide truncate"
                                        style={{
                                            fontFamily: "'Playfair Display', Georgia, Cambria, 'Times New Roman', serif",
                                            color: '#FFFFFF',
                                            textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)'
                                        }}
                                    >
                                        {recipientName || 'Valued Participant'}
                                    </h2>
                                </div>

                                <p className="text-xs sm:text-sm text-slate-200 mt-3.5 max-w-xl mx-auto leading-relaxed">
                                    For successfully demonstrating proficiency and achieving an official score of{' '}
                                    <span className="font-extrabold text-amber-300 text-sm sm:text-base px-1" style={{ color: '#FDE047' }}>
                                        {scorePercentage}%
                                    </span>{' '}
                                    in the assessment:
                                </p>

                                <div className="mt-1.5 px-4 py-1 inline-block max-w-xl truncate">
                                    <span
                                        className="text-base sm:text-lg font-extrabold tracking-wide text-cyan-300"
                                        style={{ color: '#67E8F9' }}
                                    >
                                        {quizTitle}
                                    </span>
                                </div>
                            </div>

                            {/* Certificate Footer: Identification, Seal, and Signatures */}
                            <div className="relative z-10 border-t border-slate-700/80 pt-3.5 px-3 flex items-end justify-between text-left">
                                {/* Left: Verification Details */}
                                <div className="space-y-0.5">
                                    <div className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">Date Issued</div>
                                    <div className="text-xs font-bold text-white">{completedDate}</div>
                                    <div className="text-[10px] font-mono text-slate-300 mt-1">
                                        ID: <span className="font-bold text-amber-300/90">{certificateId}</span>
                                    </div>
                                </div>

                                {/* Center: Verification Seal */}
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center space-x-2 text-emerald-300 bg-emerald-500/20 border border-emerald-400/50 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm">
                                        <LogoMark size="xs" idPrefix="cert-seal" />
                                        <span style={{ color: '#6EE7B7' }}>Officially Verified by Collectly</span>
                                    </div>
                                    <span className="text-[9px] text-slate-300 uppercase tracking-widest mt-1">SECURE DIGITAL CREDENTIAL</span>
                                </div>

                                {/* Right: Signature Authority */}
                                <div className="text-right space-y-0.5">
                                    <div
                                        className="text-lg font-serif italic font-bold text-amber-300"
                                        style={{ color: '#FDE047', fontFamily: "Georgia, 'Times New Roman', serif" }}
                                    >
                                        Collectly Board
                                    </div>
                                    <div className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider border-t border-slate-600/80 pt-0.5 mt-0.5">
                                        Authorized Signatory
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Bottom Actions */}
                <div className="p-4 border-t border-brand-border bg-brand-bg/80 flex items-center justify-between shrink-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-brand-muted hover:text-brand-text transition-colors"
                    >
                        Close
                    </button>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handlePrint}
                            disabled={isGenerating}
                            className="px-4 py-2.5 rounded-xl bg-brand-surfaceLight hover:bg-brand-border text-brand-text font-bold text-xs flex items-center gap-2 border border-brand-border transition-colors disabled:opacity-50"
                        >
                            <Printer className="w-4 h-4 text-brand-accent" />
                            <span>Print Certificate</span>
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGenerating}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-glow flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            <Download className="w-4 h-4" />
                            <span>{isGenerating ? 'Generating PDF…' : 'Download PDF Certificate'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
