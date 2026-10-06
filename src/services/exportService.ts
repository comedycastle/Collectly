import { FormResponse, Form } from '../types';
import jsPDF from 'jspdf';

const saveExportToSupabase = async (form: Form, type: 'csv' | 'excel' | 'pdf', blob: Blob, recordCount: number) => {
    try {
        const { isSupabaseConfigured } = await import('../lib/supabaseClient');
        if (!isSupabaseConfigured) return;
        const { exportService: dbExportService } = await import('./formService');
        const { supabaseStorage } = await import('./supabaseStorage');
        const path = `exports/${form.id}/${Date.now()}.${type === 'excel' ? 'xls' : type}`;
        const storagePath = await supabaseStorage.uploadExport(path, blob);
        const publicUrl = await supabaseStorage.getPublicUrl('exports', storagePath);
        const { supabase } = await import('../lib/supabaseClient');
        const { data: userData } = await supabase.auth.getUser();
        await dbExportService.saveExportRecord({
            form_id: form.id,
            form_title: form.title,
            type,
            file_url: publicUrl,
            requested_by: userData.user?.id,
            record_count: recordCount,
        });
    } catch (e) {
        console.warn('Export Supabase save failed:', e);
    }
};

export const exportService = {
    exportCSV(responses: FormResponse[], form: Form): void {
        const headers = ['Response ID', 'Submitted At', 'Time Spent (s)', 'Score', 'Sentiment', 'Tags', ...form.fields.map(f => f.label)];
        const rows = responses.map(r => [
            r.id,
            new Date(r.submittedAt).toLocaleString(),
            r.timeSpentSeconds,
            r.score !== undefined ? `${r.score}/${r.totalPossiblePoints}` : 'N/A',
            r.sentiment || 'N/A',
            r.tags.join('; '),
            ...form.fields.map(f => {
                const ans = r.answers[f.id];
                return ans ? String(ans.value) : '';
            })
        ]);

        const csvString = '\uFEFF' + [headers.join(','), ...rows.map(e => e.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
        const csvBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
        saveExportToSupabase(form, 'csv', csvBlob, responses.length);
        const csvContent = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
        const link = document.createElement('a');
        link.setAttribute('href', csvContent);
        link.setAttribute('download', `Collectly_${form.title.replace(/\s+/g, '_')}_Responses_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    exportExcel(responses: FormResponse[], form: Form): void {
        const headers = ['Response ID', 'Submitted At', 'Time Spent (s)', 'Score', 'Sentiment', 'Tags', ...form.fields.map(f => f.label)];
        const rows = responses.map(r => [
            r.id,
            new Date(r.submittedAt).toLocaleString(),
            r.timeSpentSeconds,
            r.score !== undefined ? `${r.score}/${r.totalPossiblePoints}` : 'N/A',
            r.sentiment || 'N/A',
            r.tags.join('; '),
            ...form.fields.map(f => {
                const ans = r.answers[f.id];
                return ans ? String(ans.value) : '';
            })
        ]);

        let tableHtml = '<table><thead><tr>';
        headers.forEach(h => { tableHtml += `<th>${h}</th>`; });
        tableHtml += '</tr></thead><tbody>';
        rows.forEach(row => {
            tableHtml += '<tr>';
            row.forEach(cell => { tableHtml += `<td>${cell}</td>`; });
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table>';

        const blob = new Blob([`<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body>${tableHtml}</body></html>`], { type: 'application/vnd.ms-excel' });
        saveExportToSupabase(form, 'excel', blob, responses.length);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Collectly_${form.title.replace(/\s+/g, '_')}_Responses.xls`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    exportPDF(responses: FormResponse[], form: Form): void {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        doc.setFontSize(18);
        doc.setTextColor(37, 99, 235);
        doc.text('Collectly - Response Export', pageWidth / 2, y, { align: 'center' });
        y += 10;

        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text(`Form: ${form.title}`, 14, y);
        y += 7;
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Exported: ${new Date().toLocaleString()} | Total Responses: ${responses.length}`, 14, y);
        y += 15;

        responses.forEach((r, idx) => {
            if (y > 260) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(11);
            doc.setTextColor(37, 99, 235);
            doc.text(`Response #${idx + 1} - ${r.id}`, 14, y);
            y += 6;

            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.text(`Submitted: ${new Date(r.submittedAt).toLocaleString()} | Time: ${r.timeSpentSeconds}s | Sentiment: ${r.sentiment || 'N/A'}`, 14, y);
            y += 5;

            if (r.score !== undefined) {
                doc.text(`Score: ${r.score}/${r.totalPossiblePoints} ${r.passed ? '(PASSED)' : '(FAILED)'}`, 14, y);
                y += 5;
            }

            doc.setTextColor(15, 23, 42);
            form.fields.forEach(f => {
                const ans = r.answers[f.id];
                if (ans) {
                    const line = `${f.label}: ${String(ans.value).substring(0, 80)}`;
                    doc.text(line, 18, y);
                    y += 5;
                }
            });

            doc.setDrawColor(226, 232, 240);
            doc.line(14, y, pageWidth - 14, y);
            y += 10;
        });

        const pdfBlob = doc.output('blob');
        saveExportToSupabase(form, 'pdf', pdfBlob, responses.length);
        doc.save(`Collectly_${form.title.replace(/\s+/g, '_')}_Responses.pdf`);
    },

    exportFormPDF(form: Form): void {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        doc.setFontSize(20);
        doc.setTextColor(37, 99, 235);
        doc.text(form.title, pageWidth / 2, y, { align: 'center' });
        y += 12;

        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139);
        const descLines = doc.splitTextToSize(form.description || 'No description provided.', pageWidth - 40);
        doc.text(descLines, pageWidth / 2, y, { align: 'center' });
        y += descLines.length * 6 + 10;

        form.fields.forEach((field, idx) => {
            if (y > 250) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(12);
            doc.setTextColor(15, 23, 42);
            const label = `Q${idx + 1}. ${field.label}${field.required ? ' *' : ''}`;
            const labelLines = doc.splitTextToSize(label, pageWidth - 40);
            doc.text(labelLines, 14, y);
            y += labelLines.length * 6;

            if (field.description) {
                doc.setFontSize(9);
                doc.setTextColor(100, 116, 139);
                const descLines = doc.splitTextToSize(field.description, pageWidth - 40);
                doc.text(descLines, 18, y);
                y += descLines.length * 5;
            }

            if (field.options && field.options.length > 0) {
                doc.setFontSize(10);
                doc.setTextColor(100, 116, 139);
                field.options.forEach(opt => {
                    doc.text(`  [ ] ${opt.label}`, 18, y);
                    y += 6;
                });
            } else {
                doc.setDrawColor(203, 213, 225);
                doc.line(18, y + 2, pageWidth - 18, y + 2);
                y += 10;
            }

            y += 5;
        });

        doc.save(`Collectly_${form.title.replace(/\s+/g, '_')}_Form.pdf`);
    }
};