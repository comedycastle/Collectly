const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'Project_Report_Files', 'diagrams');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// 1. ER Diagram SVG
const erSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <style>
      .table-box { fill: #ffffff; stroke: #0f172a; stroke-width: 2; rx: 6px; }
      .header-bg { fill: #1e293b; }
      .header-text { fill: #ffffff; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; font-weight: bold; }
      .row-text { fill: #334155; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; }
      .pk-text { fill: #2563eb; font-weight: bold; }
      .fk-text { fill: #0891b2; font-style: italic; }
      .rel-line { stroke: #475569; stroke-width: 2; fill: none; }
      .title { font-family: 'Segoe UI', Arial, sans-serif; font-size: 20px; font-weight: bold; fill: #0f172a; }
    </style>
  </defs>

  <rect width="100%" height="100%" fill="#f8fafc" />
  <text x="600" y="35" text-anchor="middle" class="title">Figure 5.5: Entity-Relationship (ER) Relational Schema Diagram</text>

  <!-- PROFILES -->
  <g transform="translate(50, 70)">
    <rect width="200" height="150" class="table-box" />
    <path d="M 0,0 L 200,0 L 200,30 L 0,30 Z" class="header-bg" />
    <text x="100" y="20" text-anchor="middle" class="header-text">profiles</text>
    <text x="10" y="50" class="row-text"><tspan class="pk-text">PK</tspan> id : UUID</text>
    <text x="10" y="70" class="row-text">email : TEXT</text>
    <text x="10" y="90" class="row-text">full_name : TEXT</text>
    <text x="10" y="110" class="row-text">role : TEXT (Owner/Admin)</text>
    <text x="10" y="130" class="row-text">team_name : TEXT</text>
  </g>

  <!-- FORMS -->
  <g transform="translate(350, 70)">
    <rect width="240" height="200" class="table-box" />
    <path d="M 0,0 L 240,0 L 240,30 L 0,30 Z" class="header-bg" />
    <text x="120" y="20" text-anchor="middle" class="header-text">forms</text>
    <text x="10" y="50" class="row-text"><tspan class="pk-text">PK</tspan> id : UUID</text>
    <text x="10" y="70" class="row-text"><tspan class="fk-text">FK</tspan> owner_id : UUID</text>
    <text x="10" y="90" class="row-text">title : TEXT</text>
    <text x="10" y="110" class="row-text">category : TEXT</text>
    <text x="10" y="130" class="row-text">status : TEXT</text>
    <text x="10" y="150" class="row-text">is_quiz : BOOLEAN</text>
    <text x="10" y="170" class="row-text">settings : JSONB</text>
    <text x="10" y="190" class="row-text">response_count : INT</text>
  </g>

  <!-- FIELDS -->
  <g transform="translate(700, 70)">
    <rect width="220" height="210" class="table-box" />
    <path d="M 0,0 L 220,0 L 220,30 L 0,30 Z" class="header-bg" />
    <text x="110" y="20" text-anchor="middle" class="header-text">fields</text>
    <text x="10" y="50" class="row-text"><tspan class="pk-text">PK</tspan> id : UUID</text>
    <text x="10" y="70" class="row-text"><tspan class="fk-text">FK</tspan> form_id : UUID</text>
    <text x="10" y="90" class="row-text">type : TEXT (30+ types)</text>
    <text x="10" y="110" class="row-text">label : TEXT</text>
    <text x="10" y="130" class="row-text">order : INTEGER</text>
    <text x="10" y="150" class="row-text">points : INTEGER</text>
    <text x="10" y="170" class="row-text">options : JSONB</text>
    <text x="10" y="190" class="row-text">logic_rules : JSONB</text>
  </g>

  <!-- RESPONSES -->
  <g transform="translate(350, 360)">
    <rect width="240" height="220" class="table-box" />
    <path d="M 0,0 L 240,0 L 240,30 L 0,30 Z" class="header-bg" />
    <text x="120" y="20" text-anchor="middle" class="header-text">responses</text>
    <text x="10" y="50" class="row-text"><tspan class="pk-text">PK</tspan> id : UUID</text>
    <text x="10" y="70" class="row-text"><tspan class="fk-text">FK</tspan> form_id : UUID</text>
    <text x="10" y="90" class="row-text">submitted_at : TIMESTAMPTZ</text>
    <text x="10" y="110" class="row-text">score : INTEGER</text>
    <text x="10" y="130" class="row-text">passed : BOOLEAN</text>
    <text x="10" y="150" class="row-text">tags : TEXT[]</text>
    <text x="10" y="170" class="row-text">answers : JSONB</text>
    <text x="10" y="190" class="row-text">team_notes : JSONB</text>
    <text x="10" y="210" class="row-text">sentiment : TEXT</text>
  </g>

  <!-- CERTIFICATES -->
  <g transform="translate(50, 400)">
    <rect width="210" height="150" class="table-box" />
    <path d="M 0,0 L 210,0 L 210,30 L 0,30 Z" class="header-bg" />
    <text x="105" y="20" text-anchor="middle" class="header-text">certificates</text>
    <text x="10" y="50" class="row-text"><tspan class="pk-text">PK</tspan> id : UUID</text>
    <text x="10" y="70" class="row-text"><tspan class="fk-text">FK</tspan> response_id : UUID</text>
    <text x="10" y="90" class="row-text">recipient_name : TEXT</text>
    <text x="10" y="110" class="row-text">pdf_url : TEXT</text>
    <text x="10" y="130" class="row-text">score_percentage : INT</text>
  </g>

  <!-- ANALYTICS EVENTS -->
  <g transform="translate(700, 370)">
    <rect width="220" height="130" class="table-box" />
    <path d="M 0,0 L 220,0 L 220,30 L 0,30 Z" class="header-bg" />
    <text x="110" y="20" text-anchor="middle" class="header-text">analytics_events</text>
    <text x="10" y="50" class="row-text"><tspan class="pk-text">PK</tspan> id : UUID</text>
    <text x="10" y="70" class="row-text"><tspan class="fk-text">FK</tspan> form_id : UUID</text>
    <text x="10" y="90" class="row-text">event_type : TEXT</text>
    <text x="10" y="110" class="row-text">payload : JSONB</text>
  </g>

  <!-- FORM VERSIONS -->
  <g transform="translate(980, 150)">
    <rect width="180" height="150" class="table-box" />
    <path d="M 0,0 L 180,0 L 180,30 L 0,30 Z" class="header-bg" />
    <text x="90" y="20" text-anchor="middle" class="header-text">form_versions</text>
    <text x="10" y="50" class="row-text"><tspan class="pk-text">PK</tspan> id : UUID</text>
    <text x="10" y="70" class="row-text"><tspan class="fk-text">FK</tspan> form_id : UUID</text>
    <text x="10" y="90" class="row-text">version : INTEGER</text>
    <text x="10" y="110" class="row-text">fields : JSONB</text>
    <text x="10" y="130" class="row-text">change_desc : TEXT</text>
  </g>

  <!-- EXPORTS -->
  <g transform="translate(980, 400)">
    <rect width="180" height="140" class="table-box" />
    <path d="M 0,0 L 180,0 L 180,30 L 0,30 Z" class="header-bg" />
    <text x="90" y="20" text-anchor="middle" class="header-text">exports</text>
    <text x="10" y="50" class="row-text"><tspan class="pk-text">PK</tspan> id : UUID</text>
    <text x="10" y="70" class="row-text"><tspan class="fk-text">FK</tspan> form_id : UUID</text>
    <text x="10" y="90" class="row-text">type : CSV/XLS/PDF</text>
    <text x="10" y="110" class="row-text">record_count : INT</text>
  </g>

  <!-- USER SETTINGS -->
  <g transform="translate(50, 620)">
    <rect width="210" height="130" class="table-box" />
    <path d="M 0,0 L 210,0 L 210,30 L 0,30 Z" class="header-bg" />
    <text x="105" y="20" text-anchor="middle" class="header-text">user_settings</text>
    <text x="10" y="50" class="row-text"><tspan class="pk-text">PK</tspan> id : UUID</text>
    <text x="10" y="70" class="row-text"><tspan class="fk-text">FK</tspan> user_id : UUID</text>
    <text x="10" y="90" class="row-text">settings (aiConfig) : JSONB</text>
    <text x="10" y="110" class="row-text">branding : JSONB</text>
  </g>

  <!-- TEMPLATES -->
  <g transform="translate(350, 650)">
    <rect width="240" height="120" class="table-box" />
    <path d="M 0,0 L 240,0 L 240,30 L 0,30 Z" class="header-bg" />
    <text x="120" y="20" text-anchor="middle" class="header-text">templates</text>
    <text x="10" y="50" class="row-text"><tspan class="pk-text">PK</tspan> id : UUID</text>
    <text x="10" y="70" class="row-text">title : TEXT</text>
    <text x="10" y="90" class="row-text">category : TEXT</text>
    <text x="10" y="110" class="row-text">is_quiz : BOOLEAN</text>
  </g>

  <!-- RELATIONSHIP LINES -->
  <!-- Profiles -> Forms -->
  <path d="M 250,140 L 350,140" class="rel-line" />
  <circle cx="250" cy="140" r="4" fill="#1e293b" />
  <text x="290" y="130" font-size="11" fill="#475569">1:N</text>

  <!-- Forms -> Fields -->
  <path d="M 590,140 L 700,140" class="rel-line" />
  <circle cx="590" cy="140" r="4" fill="#1e293b" />
  <text x="640" y="130" font-size="11" fill="#475569">1:N</text>

  <!-- Forms -> Responses -->
  <path d="M 470,270 L 470,360" class="rel-line" />
  <circle cx="470" cy="270" r="4" fill="#1e293b" />
  <text x="480" y="320" font-size="11" fill="#475569">1:N</text>

  <!-- Responses -> Certificates -->
  <path d="M 350,460 L 260,460" class="rel-line" />
  <circle cx="350" cy="460" r="4" fill="#1e293b" />
  <text x="295" y="450" font-size="11" fill="#475569">1:1</text>

  <!-- Forms -> Analytics -->
  <path d="M 590,240 L 700,420" class="rel-line" />
  <text x="640" y="330" font-size="11" fill="#475569">1:N</text>

  <!-- Forms -> Versions -->
  <path d="M 590,100 L 980,180" class="rel-line" />
  <text x="800" y="125" font-size="11" fill="#475569">1:N</text>

  <!-- Forms -> Exports -->
  <path d="M 590,260 L 980,450" class="rel-line" />
  <text x="820" y="360" font-size="11" fill="#475569">1:N</text>
</svg>`;

// 2. Use Case Diagram SVG
const useCaseSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1100 700" width="1100" height="700">
  <defs>
    <style>
      .boundary { fill: #ffffff; stroke: #334155; stroke-width: 2; rx: 12px; }
      .usecase { fill: #f0fdf4; stroke: #16a34a; stroke-width: 1.5; rx: 30px; ry: 18px; }
      .usecase-text { fill: #0f172a; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; font-weight: 600; text-anchor: middle; }
      .actor-label { fill: #1e293b; font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; font-weight: bold; text-anchor: middle; }
      .conn-line { stroke: #64748b; stroke-width: 1.5; }
      .include-line { stroke: #2563eb; stroke-width: 1.5; stroke-dasharray: 4,4; }
      .tag-text { fill: #2563eb; font-family: 'Segoe UI', Arial, sans-serif; font-size: 10px; font-style: italic; }
      .title { font-family: 'Segoe UI', Arial, sans-serif; font-size: 20px; font-weight: bold; fill: #0f172a; }
    </style>
  </defs>

  <rect width="100%" height="100%" fill="#f8fafc" />
  <text x="550" y="35" text-anchor="middle" class="title">Figure 5.7: UML Use Case Diagram</text>

  <!-- SYSTEM BOUNDARY -->
  <rect x="240" y="60" width="620" height="600" class="boundary" />
  <text x="260" y="90" font-family="'Segoe UI', sans-serif" font-size="16" font-weight="bold" fill="#475569">Collectly Platform Boundary</text>

  <!-- ACTOR 1: FORM AUTHOR -->
  <g transform="translate(100, 200)">
    <!-- Stick figure -->
    <circle cx="20" cy="20" r="15" fill="#e2e8f0" stroke="#0f172a" stroke-width="2"/>
    <line x1="20" y1="35" x2="20" y2="75" stroke="#0f172a" stroke-width="2"/>
    <line x1="0" y1="50" x2="40" y2="50" stroke="#0f172a" stroke-width="2"/>
    <line x1="20" y1="75" x2="5" y2="110" stroke="#0f172a" stroke-width="2"/>
    <line x1="20" y1="75" x2="35" y2="110" stroke="#0f172a" stroke-width="2"/>
    <text x="20" y="130" class="actor-label">Form Author /<tspan x="20" dy="16">Administrator</tspan></text>
  </g>

  <!-- ACTOR 2: PUBLIC RESPONDENT -->
  <g transform="translate(970, 360)">
    <circle cx="20" cy="20" r="15" fill="#e2e8f0" stroke="#0f172a" stroke-width="2"/>
    <line x1="20" y1="35" x2="20" y2="75" stroke="#0f172a" stroke-width="2"/>
    <line x1="0" y1="50" x2="40" y2="50" stroke="#0f172a" stroke-width="2"/>
    <line x1="20" y1="75" x2="5" y2="110" stroke="#0f172a" stroke-width="2"/>
    <line x1="20" y1="75" x2="35" y2="110" stroke="#0f172a" stroke-width="2"/>
    <text x="20" y="130" class="actor-label">Public<tspan x="20" dy="16">Respondent</tspan></text>
  </g>

  <!-- ACTOR 3: EXTERNAL AI PROVIDER -->
  <g transform="translate(100, 500)">
    <rect x="-10" y="10" width="70" height="50" fill="#e0f2fe" stroke="#0369a1" stroke-width="2" rx="6" />
    <text x="25" y="40" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-size="12" font-weight="bold" fill="#0369a1">&lt;&lt;System&gt;&gt;</text>
    <text x="25" y="78" class="actor-label">AI Gateways<tspan x="25" dy="16">(Gemini/Groq)</tspan></text>
  </g>

  <!-- USE CASES -->
  <!-- UC1: Sign In -->
  <ellipse cx="400" cy="120" rx="110" ry="24" class="usecase" />
  <text x="400" y="125" class="usecase-text">Register &amp; Authenticate</text>

  <!-- UC2: Create Form -->
  <ellipse cx="400" cy="180" rx="110" ry="24" class="usecase" />
  <text x="400" y="185" class="usecase-text">Create &amp; Edit Form Canvas</text>

  <!-- UC3: AI Generate -->
  <ellipse cx="400" cy="245" rx="120" ry="24" class="usecase" />
  <text x="400" y="250" class="usecase-text">Generate Form via AI Prompt</text>

  <!-- UC4: Configure Logic -->
  <ellipse cx="680" cy="180" rx="110" ry="24" class="usecase" />
  <text x="680" y="185" class="usecase-text">Configure Branching Logic</text>

  <!-- UC5: Publish & QR -->
  <ellipse cx="400" cy="310" rx="110" ry="24" class="usecase" />
  <text x="400" y="315" class="usecase-text">Publish Form &amp; Generate QR</text>

  <!-- UC6: Access Form -->
  <ellipse cx="680" cy="310" rx="110" ry="24" class="usecase" />
  <text x="680" y="315" class="usecase-text">Access Shared Form URL</text>

  <!-- UC7: Submit Answers -->
  <ellipse cx="680" cy="380" rx="115" ry="24" class="usecase" />
  <text x="680" y="385" class="usecase-text">Submit Form Answers</text>

  <!-- UC8: Take Proctored Quiz -->
  <ellipse cx="680" cy="450" rx="125" ry="24" class="usecase" />
  <text x="680" y="455" class="usecase-text">Take Proctored Quiz (Anti-Cheat)</text>

  <!-- UC9: Download Certificate -->
  <ellipse cx="680" cy="520" rx="115" ry="24" class="usecase" />
  <text x="680" y="525" class="usecase-text">Download PDF Certificate</text>

  <!-- UC10: Live Analytics -->
  <ellipse cx="400" cy="440" rx="110" ry="24" class="usecase" />
  <text x="400" y="445" class="usecase-text">Inspect Real-Time Analytics</text>

  <!-- UC11: Manage Responses -->
  <ellipse cx="400" cy="510" rx="115" ry="24" class="usecase" />
  <text x="400" y="515" class="usecase-text">Audit Responses &amp; Team Notes</text>

  <!-- UC12: Export Data -->
  <ellipse cx="400" cy="580" rx="110" ry="24" class="usecase" />
  <text x="400" y="585" class="usecase-text">Export CSV, Excel &amp; PDF</text>

  <!-- CONNECTIONS -->
  <line x1="145" y1="230" x2="290" y2="125" class="conn-line"/>
  <line x1="145" y1="230" x2="290" y2="185" class="conn-line"/>
  <line x1="145" y1="230" x2="280" y2="250" class="conn-line"/>
  <line x1="145" y1="230" x2="290" y2="315" class="conn-line"/>
  <line x1="145" y1="230" x2="290" y2="445" class="conn-line"/>
  <line x1="145" y1="230" x2="285" y2="515" class="conn-line"/>
  <line x1="145" y1="230" x2="290" y2="585" class="conn-line"/>

  <!-- AI Connection -->
  <line x1="145" y1="520" x2="280" y2="250" class="conn-line"/>

  <!-- Respondent Connections -->
  <line x1="970" y1="390" x2="790" y2="315" class="conn-line"/>
  <line x1="970" y1="390" x2="795" y2="385" class="conn-line"/>
  <line x1="970" y1="390" x2="805" y2="455" class="conn-line"/>
  <line x1="970" y1="390" x2="795" y2="525" class="conn-line"/>

  <!-- Include / Extend lines -->
  <line x1="510" y1="180" x2="570" y2="180" class="include-line"/>
  <text x="515" y="172" class="tag-text">&lt;&lt;include&gt;&gt;</text>

  <line x1="680" y1="474" x2="680" y2="496" class="include-line"/>
  <text x="685" y="490" class="tag-text">&lt;&lt;extend&gt;&gt;</text>
</svg>`;

// 3. Activity Diagram (Proctoring & Submission)
const activitySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 800" width="900" height="800">
  <defs>
    <style>
      .act-node { fill: #f8fafc; stroke: #0f172a; stroke-width: 1.5; rx: 8px; }
      .act-text { fill: #0f172a; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; font-weight: 500; text-anchor: middle; }
      .decision { fill: #fef08a; stroke: #ca8a04; stroke-width: 1.5; }
      .flow-arrow { stroke: #1e293b; stroke-width: 1.8; marker-end: url(#arrow); fill: none; }
      .title { font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #0f172a; }
    </style>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" fill="#ffffff" />
  <text x="450" y="30" text-anchor="middle" class="title">Figure 5.9: UML Activity Diagram - Public Submission &amp; Proctoring</text>

  <!-- START -->
  <circle cx="450" cy="60" r="14" fill="#0f172a" />

  <!-- Step 1: Open Form -->
  <line x1="450" y1="74" x2="450" y2="100" class="flow-arrow" />
  <rect x="350" y="100" width="200" height="40" class="act-node" />
  <text x="450" y="125" class="act-text">Open Form Hash URL</text>

  <!-- Decision 1: Password Gate -->
  <line x1="450" y1="140" x2="450" y2="170" class="flow-arrow" />
  <polygon points="450,170 510,195 450,220 390,195" class="decision" />
  <text x="450" y="200" class="act-text" font-size="10">Password Protected?</text>

  <!-- Step 2: Render Form & Start Listeners -->
  <line x1="450" y1="220" x2="450" y2="260" class="flow-arrow" />
  <rect x="330" y="260" width="240" height="45" class="act-node" />
  <text x="450" y="280" class="act-text">Render Questions &amp; Activate Listeners</text>
  <text x="450" y="295" class="act-text" font-size="10" fill="#64748b">(visibilitychange, blur, copy, cut)</text>

  <!-- Proctoring Loop -->
  <line x1="450" y1="305" x2="450" y2="340" class="flow-arrow" />
  <polygon points="450,340 520,365 450,390 380,365" class="decision" />
  <text x="450" y="370" class="act-text" font-size="10">Tab Defocused / Blurred?</text>

  <!-- Tab switch detected branch -->
  <line x1="520" y1="365" x2="680" y2="365" class="flow-arrow" />
  <rect x="680" y="345" width="180" height="40" class="act-node" fill="#fee2e2" stroke="#ef4444" />
  <text x="770" y="365" class="act-text" fill="#b91c1c">Increment Tab Switch Count</text>
  <text x="770" y="378" class="act-text" font-size="10" fill="#b91c1c">&amp; Log Timestamp</text>
  <line x1="770" y1="345" x2="770" y2="280" class="flow-arrow" />
  <line x1="770" y1="280" x2="570" y2="280" class="flow-arrow" />

  <!-- No violation: Submit -->
  <line x1="450" y1="390" x2="450" y2="430" class="flow-arrow" />
  <rect x="350" y="430" width="200" height="40" class="act-node" />
  <text x="450" y="455" class="act-text">Respondent Clicks Submit</text>

  <!-- Step: Client Validation -->
  <line x1="450" y1="470" x2="450" y2="500" class="flow-arrow" />
  <polygon points="450,500 520,525 450,550 380,525" class="decision" />
  <text x="450" y="530" class="act-text" font-size="10">Validation Passed?</text>

  <!-- Validation Fail -->
  <line x1="380" y1="525" x2="220" y2="525" class="flow-arrow" />
  <rect x="120" y="505" width="100" height="40" class="act-node" fill="#fee2e2" stroke="#dc2626" />
  <text x="170" y="530" class="act-text" fill="#dc2626">Show Errors</text>
  <line x1="170" y1="505" x2="170" y2="280" class="flow-arrow" />
  <line x1="170" y1="280" x2="330" y2="280" class="flow-arrow" />

  <!-- Grade Quiz & Tag -->
  <line x1="450" y1="550" x2="450" y2="590" class="flow-arrow" />
  <rect x="320" y="590" width="260" height="45" class="act-node" />
  <text x="450" y="610" class="act-text">Grade Answers &amp; Append Proctor Tags</text>
  <text x="450" y="625" class="act-text" font-size="10" fill="#64748b">(Passed, Failed, Flagged if tab &gt;= 3)</text>

  <!-- Save to Supabase -->
  <line x1="450" y1="635" x2="450" y2="670" class="flow-arrow" />
  <rect x="330" y="670" width="240" height="40" class="act-node" />
  <text x="450" y="695" class="act-text">Insert into Supabase responses Table</text>

  <!-- End -->
  <line x1="450" y1="710" x2="450" y2="740" class="flow-arrow" />
  <circle cx="450" cy="754" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2" />
  <circle cx="450" cy="754" r="8" fill="#0f172a" />
</svg>`;

// 4. Sequence Diagram (Real-Time Ingestion & DB Trigger)
const sequenceSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 950 650" width="950" height="650">
  <defs>
    <style>
      .lifeline { stroke: #94a3b8; stroke-width: 1.5; stroke-dasharray: 4,4; }
      .actor-box { fill: #1e293b; rx: 4px; }
      .actor-text { fill: #ffffff; font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; font-weight: bold; text-anchor: middle; }
      .msg-line { stroke: #0f172a; stroke-width: 1.5; marker-end: url(#seq-arrow); }
      .ret-line { stroke: #2563eb; stroke-width: 1.5; stroke-dasharray: 4,4; marker-end: url(#seq-arrow-blue); }
      .msg-text { fill: #0f172a; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; font-weight: 500; }
      .title { font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #0f172a; }
      .act-bar { fill: #e2e8f0; stroke: #475569; stroke-width: 1; }
    </style>
    <marker id="seq-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f172a"/>
    </marker>
    <marker id="seq-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" fill="#ffffff" />
  <text x="475" y="30" text-anchor="middle" class="title">Figure 5.11: UML Sequence Diagram - Response Ingestion &amp; Real-Time Broadcast</text>

  <!-- ENTITIES -->
  <!-- 1. Respondent -->
  <rect x="40" y="60" width="140" height="35" class="actor-box" />
  <text x="110" y="82" class="actor-text">Public Respondent</text>
  <line x1="110" y1="95" x2="110" y2="600" class="lifeline" />

  <!-- 2. Public Runtime -->
  <rect x="230" y="60" width="150" height="35" class="actor-box" />
  <text x="305" y="82" class="actor-text">PublicFormViewPage</text>
  <line x1="305" y1="95" x2="305" y2="600" class="lifeline" />

  <!-- 3. PostgreSQL Database -->
  <rect x="430" y="60" width="150" height="35" class="actor-box" />
  <text x="505" y="82" class="actor-text">PostgreSQL Database</text>
  <line x1="505" y1="95" x2="505" y2="600" class="lifeline" />

  <!-- 4. Realtime Server -->
  <rect x="630" y="60" width="140" height="35" class="actor-box" />
  <text x="700" y="82" class="actor-text">Supabase Realtime</text>
  <line x1="700" y1="95" x2="700" y2="600" class="lifeline" />

  <!-- 5. Admin Dashboard -->
  <rect x="800" y="60" width="130" height="35" class="actor-box" />
  <text x="865" y="82" class="actor-text">Admin Dashboard</text>
  <line x1="865" y1="95" x2="865" y2="600" class="lifeline" />

  <!-- MESSAGES -->
  <!-- 1: Submit Form -->
  <line x1="110" y1="140" x2="305" y2="140" class="msg-line" />
  <text x="130" y="132" class="msg-text">1. Click "Submit Response"</text>

  <!-- 2: Self evaluate -->
  <rect x="300" y="150" width="10" height="40" class="act-bar" />
  <text x="320" y="172" class="msg-text">2. Grade Quiz, Compile Telemetry &amp; Tags</text>

  <!-- 3: Insert DB -->
  <line x1="305" y1="210" x2="505" y2="210" class="msg-line" />
  <text x="330" y="202" class="msg-text">3. INSERT INTO public.responses</text>

  <!-- 4: DB Trigger -->
  <rect x="500" y="220" width="10" height="50" class="act-bar" />
  <text x="520" y="242" class="msg-text">4. Trigger on_response_created fires</text>
  <text x="520" y="258" class="msg-text" font-size="11" fill="#475569">UPDATE forms.response_count + 1</text>

  <!-- 5: DB 201 Response -->
  <line x1="505" y1="290" x2="305" y2="290" class="ret-line" />
  <text x="350" y="282" class="msg-text" fill="#2563eb">5. 201 Created (Success Ack)</text>

  <!-- 6: Show Thank You / Confetti -->
  <line x1="305" y1="330" x2="110" y2="330" class="ret-line" />
  <text x="140" y="322" class="msg-text" fill="#2563eb">6. Display Pass Result &amp; Confetti</text>

  <!-- 7: WAL stream to Realtime -->
  <line x1="505" y1="370" x2="700" y2="370" class="msg-line" />
  <text x="530" y="362" class="msg-text">7. Postgres WAL CDC: INSERT Event</text>

  <!-- 8: WebSocket Broadcast -->
  <line x1="700" y1="410" x2="865" y2="410" class="msg-line" />
  <text x="710" y="402" class="msg-text">8. WebSocket Broadcast on channel</text>

  <!-- 9: UI Auto Update -->
  <rect x="860" y="420" width="10" height="40" class="act-bar" />
  <text x="740" y="450" class="msg-text">9. Append new submission row &amp; increment counter</text>
</svg>`;

// 5. Deployment Diagram SVG
const deploySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 650" width="1000" height="650">
  <defs>
    <style>
      .node-box { fill: #f8fafc; stroke: #334155; stroke-width: 2; rx: 8px; }
      .header-node { fill: #0f172a; }
      .header-text { fill: #ffffff; font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; font-weight: bold; }
      .subnode { fill: #ffffff; stroke: #64748b; stroke-width: 1.5; rx: 4px; }
      .subtext { fill: #0f172a; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; }
      .net-line { stroke: #2563eb; stroke-width: 2; stroke-dasharray: 6,4; fill: none; }
      .title { font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #0f172a; }
    </style>
  </defs>

  <rect width="100%" height="100%" fill="#ffffff" />
  <text x="500" y="30" text-anchor="middle" class="title">Figure 5.13: UML Deployment Diagram - Cloud Architecture</text>

  <!-- CLIENT TIER -->
  <g transform="translate(40, 70)">
    <rect width="250" height="200" class="node-box" />
    <rect width="250" height="28" class="header-node" rx="8" />
    <text x="15" y="19" class="header-text">&lt;&lt;Device&gt;&gt; Client Machine</text>
    <rect x="15" y="45" width="220" height="60" class="subnode" />
    <text x="25" y="70" class="subtext" font-weight="bold">Modern Web Browser</text>
    <text x="25" y="90" class="subtext" font-size="11" fill="#64748b">Chrome, Firefox, Safari, Edge</text>
    <rect x="15" y="120" width="220" height="60" class="subnode" />
    <text x="25" y="145" class="subtext" font-weight="bold">React 18 SPA (Vite Build)</text>
    <text x="25" y="165" class="subtext" font-size="11" fill="#64748b">Zustand Store, Logic Engine</text>
  </g>

  <!-- CDN HOSTING -->
  <g transform="translate(370, 70)">
    <rect width="250" height="150" class="node-box" />
    <rect width="250" height="28" class="header-node" rx="8" />
    <text x="15" y="19" class="header-text">&lt;&lt;Cloud CDN&gt;&gt; Edge Hosting (Vercel)</text>
    <rect x="15" y="45" width="220" height="85" class="subnode" />
    <text x="25" y="70" class="subtext" font-weight="bold">Static Web Assets</text>
    <text x="25" y="90" class="subtext" font-size="11" fill="#64748b">HTML5, Bundled JS, CSS, Fonts</text>
    <text x="25" y="110" class="subtext" font-size="11" fill="#2563eb">TLS 1.3 / HTTPS Delivery</text>
  </g>

  <!-- SUPABASE BAAS CLUSTER -->
  <g transform="translate(690, 70)">
    <rect width="270" height="500" class="node-box" />
    <rect width="270" height="28" class="header-node" rx="8" />
    <text x="15" y="19" class="header-text">&lt;&lt;Cloud BaaS&gt;&gt; Supabase AWS Cluster</text>
    
    <rect x="15" y="45" width="240" height="55" class="subnode" />
    <text x="25" y="70" class="subtext" font-weight="bold">Kong API Gateway</text>
    <text x="25" y="88" class="subtext" font-size="11" fill="#64748b">SSL Termination &amp; Routing</text>

    <rect x="15" y="115" width="240" height="55" class="subnode" />
    <text x="25" y="140" class="subtext" font-weight="bold">GoTrue Auth Server</text>
    <text x="25" y="158" class="subtext" font-size="11" fill="#64748b">JWT Token Issuance &amp; Verification</text>

    <rect x="15" y="185" width="240" height="55" class="subnode" />
    <text x="25" y="210" class="subtext" font-weight="bold">PostgREST Engine</text>
    <text x="25" y="228" class="subtext" font-size="11" fill="#64748b">RESTful Database Gateway</text>

    <rect x="15" y="255" width="240" height="55" class="subnode" />
    <text x="25" y="280" class="subtext" font-weight="bold">Realtime Engine (Elixir)</text>
    <text x="25" y="298" class="subtext" font-size="11" fill="#64748b">WebSocket CDC Broadcast</text>

    <rect x="15" y="325" width="240" height="55" class="subnode" />
    <text x="25" y="350" class="subtext" font-weight="bold">Supabase Storage</text>
    <text x="25" y="368" class="subtext" font-size="11" fill="#64748b">S3 Buckets (Certs, Exports, Uploads)</text>

    <rect x="15" y="395" width="240" height="85" class="subnode" fill="#f0fdf4" stroke="#16a34a" />
    <text x="25" y="420" class="subtext" font-weight="bold" fill="#15803d">PostgreSQL 15 Kernel</text>
    <text x="25" y="440" class="subtext" font-size="11" fill="#334155">Row Level Security (RLS) Policies</text>
    <text x="25" y="460" class="subtext" font-size="11" fill="#334155">Triggers (Counters, Profiles) &amp; RPC</text>
  </g>

  <!-- EXTERNAL AI CLUSTER -->
  <g transform="translate(40, 350)">
    <rect width="250" height="220" class="node-box" />
    <rect width="250" height="28" class="header-node" rx="8" />
    <text x="15" y="19" class="header-text">&lt;&lt;Cloud AI&gt;&gt; External LLM Endpoints</text>
    
    <rect x="15" y="45" width="220" height="45" class="subnode" />
    <text x="25" y="68" class="subtext" font-weight="bold">Google Gemini API</text>
    <text x="25" y="82" class="subtext" font-size="10" fill="#64748b">gemini-2.0-flash</text>

    <rect x="15" y="100" width="220" height="45" class="subnode" />
    <text x="25" y="123" class="subtext" font-weight="bold">OpenRouter API</text>
    <text x="25" y="137" class="subtext" font-size="10" fill="#64748b">meta-llama/llama-3.3-70b:free</text>

    <rect x="15" y="155" width="220" height="45" class="subnode" />
    <text x="25" y="178" class="subtext" font-weight="bold">Groq Cloud API</text>
    <text x="25" y="192" class="subtext" font-size="10" fill="#64748b">llama-3.3-70b-versatile</text>
  </g>

  <!-- NETWORK LINKS -->
  <path d="M 290,140 L 370,140" class="net-line" />
  <text x="300" y="130" font-size="10" fill="#2563eb">HTTPS 443</text>

  <path d="M 290,200 L 690,170" class="net-line" />
  <text x="440" y="180" font-size="10" fill="#2563eb">HTTPS (REST) / WSS (WebSockets)</text>

  <path d="M 160,270 L 160,350" class="net-line" />
  <text x="170" y="320" font-size="10" fill="#2563eb">HTTPS Direct REST</text>
</svg>`;

// 6. AI Cascade Flowchart SVG
const aiFlowchartSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 700" width="850" height="700">
  <defs>
    <style>
      .flow-box { fill: #f8fafc; stroke: #0f172a; stroke-width: 1.5; rx: 8px; }
      .flow-text { fill: #0f172a; font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; font-weight: 500; text-anchor: middle; }
      .decision { fill: #fef08a; stroke: #ca8a04; stroke-width: 1.5; }
      .arrow { stroke: #1e293b; stroke-width: 1.8; marker-end: url(#ai-arr); fill: none; }
      .title { font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; font-weight: bold; fill: #0f172a; }
    </style>
    <marker id="ai-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1e293b"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" fill="#ffffff" />
  <text x="425" y="30" text-anchor="middle" class="title">Figure 9.1: Multi-Provider AI Cascade Fallback Flowchart</text>

  <!-- Start -->
  <circle cx="425" cy="65" r="14" fill="#0f172a" />

  <!-- Receive Prompt -->
  <line x1="425" y1="79" x2="425" y2="105" class="arrow" />
  <rect x="300" y="105" width="250" height="40" class="flow-box" />
  <text x="425" y="130" class="flow-text">Receive Prompt &amp; Settings from User</text>

  <!-- Try Gemini -->
  <line x1="425" y1="145" x2="425" y2="180" class="arrow" />
  <polygon points="425,180 520,205 425,230 330,205" class="decision" />
  <text x="425" y="210" class="flow-text" font-size="11">Google Gemini Success?</text>

  <!-- Gemini Success -->
  <line x1="520" y1="205" x2="680" y2="205" class="arrow" />
  <text x="560" y="195" font-size="10" fill="#15803d" font-weight="bold">HTTP 200 / Valid</text>

  <!-- Try OpenRouter -->
  <line x1="425" y1="230" x2="425" y2="280" class="arrow" />
  <text x="435" y="255" font-size="10" fill="#dc2626">Failed / No Key</text>
  <polygon points="425,280 520,305 425,330 330,305" class="decision" />
  <text x="425" y="310" class="flow-text" font-size="11">OpenRouter Success?</text>

  <!-- OpenRouter Success -->
  <line x1="520" y1="305" x2="680" y2="305" class="arrow" />
  <text x="560" y="295" font-size="10" fill="#15803d" font-weight="bold">HTTP 200 / Valid</text>

  <!-- Try Groq -->
  <line x1="425" y1="330" x2="425" y2="380" class="arrow" />
  <text x="435" y="355" font-size="10" fill="#dc2626">Failed / No Key</text>
  <polygon points="425,380 520,405 425,430 330,405" class="decision" />
  <text x="425" y="410" class="flow-text" font-size="11">Groq Cloud Success?</text>

  <!-- Groq Success -->
  <line x1="520" y1="405" x2="680" y2="405" class="arrow" />
  <text x="560" y="395" font-size="10" fill="#15803d" font-weight="bold">HTTP 200 / Valid</text>

  <!-- Local Deterministic Fallback -->
  <line x1="425" y1="430" x2="425" y2="480" class="arrow" />
  <text x="435" y="455" font-size="10" fill="#dc2626">Failed / Offline</text>
  <rect x="290" y="480" width="270" height="45" class="flow-box" fill="#fef2f2" stroke="#b91c1c" />
  <text x="425" y="500" class="flow-text" fill="#b91c1c" font-weight="bold">Execute Local Template Fallback</text>
  <text x="425" y="515" class="flow-text" font-size="10" fill="#b91c1c">Zero Downtime Guarantee</text>

  <!-- Success Collector -->
  <rect x="680" y="180" width="140" height="260" class="flow-box" fill="#f0fdf4" stroke="#16a34a" />
  <text x="750" y="290" class="flow-text" fill="#15803d" font-weight="bold">Parse &amp; Normalize<tspan x="750" dy="18">JSON Schema</tspan></text>

  <!-- Connect Local Fallback to Collector -->
  <line x1="560" y1="500" x2="750" y2="500" class="arrow" />
  <line x1="750" y1="500" x2="750" y2="440" class="arrow" />

  <!-- Render to Canvas -->
  <line x1="750" y1="440" x2="750" y2="560" class="arrow" />
  <rect x="630" y="560" width="240" height="45" class="flow-box" />
  <text x="750" y="585" class="flow-text">Instantiate Fields &amp; Render Canvas</text>

  <!-- End -->
  <line x1="750" y1="605" x2="750" y2="635" class="arrow" />
  <circle cx="750" cy="649" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2" />
  <circle cx="750" cy="649" r="8" fill="#0f172a" />
</svg>`;

// Write all SVGs
fs.writeFileSync(path.join(outDir, 'er_diagram.svg'), erSvg, 'utf8');
fs.writeFileSync(path.join(outDir, 'use_case_diagram.svg'), useCaseSvg, 'utf8');
fs.writeFileSync(path.join(outDir, 'activity_proctoring.svg'), activitySvg, 'utf8');
fs.writeFileSync(path.join(outDir, 'sequence_diagram.svg'), sequenceSvg, 'utf8');
fs.writeFileSync(path.join(outDir, 'deployment_diagram.svg'), deploySvg, 'utf8');
fs.writeFileSync(path.join(outDir, 'ai_cascade_flowchart.svg'), aiFlowchartSvg, 'utf8');

console.log('Successfully generated all professional academic SVG diagrams in Project_Report_Files/diagrams!');
