const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { marked } = require('marked');

const projectDir = path.resolve(__dirname, '..');
const reportFilesDir = path.join(projectDir, 'Project_Report_Files');
const mdFilePath = path.join(reportFilesDir, 'Collectly_40_Page_Final_Project_Report.md');
const htmlFilePath = path.join(reportFilesDir, 'Collectly_Final_Report_Printable.html');
const pdfFilePath = path.join(reportFilesDir, 'Collectly_Final_Year_Project_Report.pdf');

console.log('Reading Markdown report from:', mdFilePath);
let mdContent = fs.readFileSync(mdFilePath, 'utf8');

// Replace markdown image references with inline base64 or absolute paths so headless browser renders them seamlessly
const diagramsDir = path.join(reportFilesDir, 'diagrams');
mdContent = mdContent.replace(/!\[(.*?)\]\((diagrams\/[^)]+)\)/g, (match, alt, relPath) => {
    const filename = path.basename(relPath);
    const fullPath = path.join(diagramsDir, filename);
    if (fs.existsSync(fullPath)) {
        const ext = path.extname(filename).toLowerCase();
        let mime = 'image/jpeg';
        if (ext === '.svg') mime = 'image/svg+xml';
        else if (ext === '.png') mime = 'image/png';
        
        const b64 = fs.readFileSync(fullPath).toString('base64');
        return `\n\n<div class="figure-container"><img src="data:${mime};base64,${b64}" alt="${alt}" class="report-figure" /><p class="figure-caption">${alt}</p></div>\n\n`;
    }
    return match;
});

// Configure marked options
marked.setOptions({
    gfm: true,
    breaks: false
});

const bodyHtml = marked.parse(mdContent);

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Collectly - Final Year B.Tech Project Report</title>
<style>
  @page {
    size: A4 portrait;
    margin: 20mm 15mm 20mm 20mm;
    @bottom-right {
      content: counter(page);
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 9pt;
      color: #64748b;
    }
  }

  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.6;
    color: #1e293b;
    margin: 0;
    padding: 0;
  }

  h1, h2, h3, h4, h5, h6 {
    color: #0f172a;
    font-weight: 700;
    page-break-after: avoid;
    break-after: avoid;
  }

  h1 {
    font-size: 18pt;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 6px;
    margin-top: 28pt;
    margin-bottom: 14pt;
    page-break-before: always;
    break-before: always;
  }

  /* Do not page-break before the first h1 */
  body > h1:first-child {
    page-break-before: avoid;
    break-before: avoid;
  }

  h2 {
    font-size: 14pt;
    border-bottom: 1px solid #cbd5e1;
    padding-bottom: 4px;
    margin-top: 20pt;
    margin-bottom: 10pt;
  }

  h3 {
    font-size: 12pt;
    margin-top: 14pt;
    margin-bottom: 6pt;
    color: #1e40af;
  }

  p {
    margin-top: 0;
    margin-bottom: 8pt;
    text-align: justify;
    text-justify: inter-word;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10pt;
    margin-bottom: 14pt;
    font-size: 9pt;
    page-break-inside: auto;
  }

  tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  thead {
    display: table-header-group;
  }

  th {
    background-color: #1e293b;
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 7px 9px;
    border: 1px solid #334155;
  }

  td {
    padding: 6px 9px;
    border: 1px solid #cbd5e1;
    vertical-align: top;
  }

  tbody tr:nth-child(even) {
    background-color: #f8fafc;
  }

  code {
    font-family: 'Consolas', 'Courier New', Courier, monospace;
    font-size: 9pt;
    background-color: #f1f5f9;
    padding: 2px 5px;
    border-radius: 4px;
    color: #0f172a;
    border: 1px solid #e2e8f0;
  }

  pre {
    background-color: #0f172a;
    color: #f8fafc;
    padding: 10pt 14pt;
    border-radius: 6px;
    font-size: 8.5pt;
    line-height: 1.45;
    overflow-x: auto;
    page-break-inside: avoid;
    break-inside: avoid;
    margin: 10pt 0;
  }

  pre code {
    background-color: transparent;
    color: inherit;
    padding: 0;
    border: none;
  }

  blockquote {
    border-left: 4px solid #2563eb;
    margin: 10pt 0;
    padding: 6pt 14pt;
    background-color: #eff6ff;
    color: #1e40af;
    font-style: italic;
  }

  ul, ol {
    margin-top: 0;
    margin-bottom: 8pt;
    padding-left: 20px;
  }

  li {
    margin-bottom: 3pt;
  }

  .figure-container {
    text-align: center;
    margin: 16pt 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .report-figure {
    max-width: 95%;
    max-height: 380px;
    height: auto;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    background-color: #ffffff;
  }

  .figure-caption {
    font-size: 9.5pt;
    font-weight: 600;
    color: #475569;
    margin-top: 6pt;
    font-style: italic;
  }

  hr {
    border: 0;
    height: 1px;
    background-color: #e2e8f0;
    margin: 18pt 0;
  }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

fs.writeFileSync(htmlFilePath, htmlTemplate, 'utf8');
console.log('Successfully written styled HTML report to:', htmlFilePath);

// Determine Chrome or Edge executable
let browserPath = 'C:\\Program Files\\Google\Chrome\\Application\\chrome.exe';
if (!fs.existsSync(browserPath)) {
    browserPath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
}

console.log('Using browser engine for PDF rendering:', browserPath);

const cmd = `"${browserPath}" --headless=new --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${pdfFilePath}" "${htmlFilePath}"`;

console.log('Rendering PDF document...');
try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('PDF Generation Complete!');
    if (fs.existsSync(pdfFilePath)) {
        const stats = fs.statSync(pdfFilePath);
        console.log(`Verified generated PDF: ${pdfFilePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    } else {
        console.error('PDF file was not created!');
    }
} catch (err) {
    console.error('Error during headless browser print:', err);
}
