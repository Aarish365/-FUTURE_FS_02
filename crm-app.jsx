import { useState, useEffect, useRef } from "react";

// ─── Inject Google Fonts ───────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap";
document.head.appendChild(fontLink);

// ─── Global Styles ─────────────────────────────────────────────────────────
const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0b0c10;
    --surface: #13151c;
    --surface2: #1c1f2b;
    --border: #272b3a;
    --accent: #6ee7b7;
    --accent2: #818cf8;
    --accent3: #f472b6;
    --text: #e2e8f0;
    --muted: #64748b;
    --danger: #f87171;
    --warn: #fbbf24;
    --new-badge: #3b82f6;
    --contacted-badge: #a78bfa;
    --converted-badge: #34d399;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 12px;
    --radius-sm: 8px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(32px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .fade-up { animation: fadeUp 0.4s ease forwards; }
  .slide-in { animation: slideIn 0.35s ease forwards; }

  /* ── Layout ── */
  .crm-wrap { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .sidebar {
    width: 240px; min-height: 100vh; background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    padding: 28px 0; position: sticky; top: 0; height: 100vh; overflow-y: auto;
    flex-shrink: 0;
  }
  .sidebar-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 0 24px 28px; border-bottom: 1px solid var(--border);
  }
  .logo-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .logo-text { font-family: var(--font-head); font-weight: 800; font-size: 18px; }
  .logo-sub { font-size: 10px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }

  .sidebar-nav { padding: 20px 12px; flex: 1; }
  .nav-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); padding: 0 12px; margin-bottom: 8px; margin-top: 16px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: var(--radius-sm); cursor: pointer; font-size: 14px;
    font-weight: 500; color: var(--muted); transition: all 0.18s;
    margin-bottom: 2px;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(110,231,183,0.08); color: var(--accent); }
  .nav-item .nav-icon { font-size: 16px; width: 20px; text-align: center; }
  .nav-badge {
    margin-left: auto; background: var(--accent); color: var(--bg);
    font-size: 10px; font-weight: 700; border-radius: 20px; padding: 1px 7px;
  }

  .sidebar-footer { padding: 20px 24px 0; border-top: 1px solid var(--border); margin: 0 12px; }
  .admin-chip {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 12px; border-radius: var(--radius-sm);
    background: var(--surface2);
  }
  .admin-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent2), var(--accent3));
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .admin-name { font-size: 13px; font-weight: 500; }
  .admin-role { font-size: 10px; color: var(--muted); }

  /* ── Main ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  /* ── Topbar ── */
  .topbar {
    display: flex; align-items: center; gap: 16px;
    padding: 20px 32px; border-bottom: 1px solid var(--border);
    background: var(--surface); position: sticky; top: 0; z-index: 10;
  }
  .topbar-title { font-family: var(--font-head); font-size: 20px; font-weight: 700; flex: 1; }
  .topbar-search {
    display: flex; align-items: center; gap: 8px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 8px 14px; width: 240px;
  }
  .topbar-search input {
    background: transparent; border: none; outline: none;
    color: var(--text); font-size: 13px; font-family: var(--font-body); width: 100%;
  }
  .topbar-search input::placeholder { color: var(--muted); }

  /* ── Content ── */
  .content { flex: 1; padding: 32px; overflow-y: auto; }

  /* ── Stats Bar ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px 24px;
    display: flex; align-items: flex-start; gap: 14px;
    animation: fadeUp 0.4s ease both;
  }
  .stat-card:nth-child(2) { animation-delay: 0.05s; }
  .stat-card:nth-child(3) { animation-delay: 0.1s; }
  .stat-card:nth-child(4) { animation-delay: 0.15s; }
  .stat-icon {
    width: 42px; height: 42px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;
  }
  .stat-num { font-family: var(--font-head); font-size: 28px; font-weight: 800; line-height: 1; }
  .stat-label { font-size: 12px; color: var(--muted); margin-top: 4px; }
  .stat-delta { font-size: 11px; margin-top: 6px; color: var(--accent); }

  /* ── Toolbar ── */
  .toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 9px 18px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 500; font-family: var(--font-body);
    cursor: pointer; border: none; transition: all 0.18s; white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: var(--bg); }
  .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
  .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--text); }
  .btn-ghost:hover { background: var(--surface2); }
  .btn-danger { background: rgba(248,113,113,0.1); color: var(--danger); border: 1px solid rgba(248,113,113,0.2); }
  .btn-danger:hover { background: rgba(248,113,113,0.2); }
  .btn-sm { padding: 5px 12px; font-size: 12px; }

  .filter-tabs { display: flex; gap: 4px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 4px; }
  .filter-tab {
    padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 500;
    cursor: pointer; color: var(--muted); transition: all 0.18s;
  }
  .filter-tab.active { background: var(--accent); color: var(--bg); }
  .filter-tab:not(.active):hover { color: var(--text); }

  .sort-select {
    background: var(--surface); border: 1px solid var(--border); color: var(--text);
    font-family: var(--font-body); font-size: 13px; padding: 8px 12px;
    border-radius: var(--radius-sm); cursor: pointer; outline: none;
  }
  .sort-select option { background: var(--surface2); }

  /* ── Table ── */
  .table-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
  }
  table { width: 100%; border-collapse: collapse; }
  thead { background: var(--surface2); }
  th {
    padding: 12px 20px; text-align: left; font-size: 11px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted);
    border-bottom: 1px solid var(--border);
  }
  td { padding: 14px 20px; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.015); }
  tbody tr { animation: fadeUp 0.3s ease both; cursor: pointer; }
  tbody tr:nth-child(1) { animation-delay: 0.05s; }
  tbody tr:nth-child(2) { animation-delay: 0.08s; }
  tbody tr:nth-child(3) { animation-delay: 0.11s; }
  tbody tr:nth-child(4) { animation-delay: 0.14s; }
  tbody tr:nth-child(5) { animation-delay: 0.17s; }

  .lead-name { font-weight: 600; color: var(--text); }
  .lead-email { color: var(--muted); font-size: 12px; margin-top: 2px; }
  .lead-source {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 500; color: var(--muted);
    background: var(--surface2); border-radius: 20px; padding: 3px 10px;
  }

  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; border-radius: 20px; padding: 4px 10px;
    letter-spacing: 0.03em;
  }
  .badge-new { background: rgba(59,130,246,0.15); color: #60a5fa; }
  .badge-contacted { background: rgba(167,139,250,0.15); color: #a78bfa; }
  .badge-converted { background: rgba(52,211,153,0.15); color: #34d399; }
  .badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
  }
  .badge-new .badge-dot { background: #60a5fa; }
  .badge-contacted .badge-dot { background: #a78bfa; }
  .badge-converted .badge-dot { background: #34d399; }

  .lead-date { font-size: 12px; color: var(--muted); }
  .actions-cell { display: flex; gap: 8px; align-items: center; }

  .empty-state {
    text-align: center; padding: 64px 32px; color: var(--muted);
  }
  .empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.4; }
  .empty-text { font-size: 15px; margin-bottom: 8px; color: var(--text); opacity: 0.7; }
  .empty-sub { font-size: 13px; }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    display: flex; align-items: center; justify-content: center;
    z-index: 100; backdrop-filter: blur(4px); padding: 20px;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; width: 100%; max-width: 560px; max-height: 90vh;
    overflow-y: auto; animation: slideIn 0.3s ease;
    box-shadow: var(--shadow);
  }
  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 28px; border-bottom: 1px solid var(--border);
    position: sticky; top: 0; background: var(--surface); z-index: 1;
  }
  .modal-title { font-family: var(--font-head); font-size: 18px; font-weight: 700; }
  .modal-close {
    width: 32px; height: 32px; border-radius: 50%; background: var(--surface2);
    border: none; color: var(--muted); font-size: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s;
  }
  .modal-close:hover { background: var(--border); color: var(--text); }
  .modal-body { padding: 24px 28px; }

  .form-group { margin-bottom: 18px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; display: block; }
  .form-input, .form-select, .form-textarea {
    width: 100%; background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 10px 14px; color: var(--text);
    font-size: 13px; font-family: var(--font-body); outline: none; transition: border-color 0.18s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent); }
  .form-select option, .form-select { background: var(--surface2); }
  .form-textarea { min-height: 80px; resize: vertical; }
  .form-footer { display: flex; gap: 10px; justify-content: flex-end; padding-top: 8px; }

  /* ── Lead Detail Panel ── */
  .detail-panel {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; width: 100%; max-width: 680px; max-height: 90vh;
    overflow-y: auto; animation: slideIn 0.3s ease;
    box-shadow: var(--shadow);
  }
  .detail-header {
    padding: 28px; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; gap: 16px;
  }
  .detail-avatar {
    width: 52px; height: 52px; border-radius: 14px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-head); font-size: 20px; font-weight: 800;
  }
  .detail-info { flex: 1; }
  .detail-name { font-family: var(--font-head); font-size: 22px; font-weight: 700; }
  .detail-email { color: var(--muted); font-size: 13px; margin-top: 4px; }
  .detail-meta { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }

  .detail-body { padding: 24px 28px; }
  .detail-section { margin-bottom: 24px; }
  .detail-section-title {
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
  }
  .detail-section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  .status-buttons { display: flex; gap: 8px; }
  .status-btn {
    flex: 1; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border);
    background: var(--surface2); color: var(--muted); font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.18s; text-align: center; font-family: var(--font-body);
  }
  .status-btn.active-new { background: rgba(59,130,246,0.15); color: #60a5fa; border-color: rgba(59,130,246,0.3); }
  .status-btn.active-contacted { background: rgba(167,139,250,0.15); color: #a78bfa; border-color: rgba(167,139,250,0.3); }
  .status-btn.active-converted { background: rgba(52,211,153,0.15); color: #34d399; border-color: rgba(52,211,153,0.3); }

  .notes-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
  .note-card {
    background: var(--surface2); border-radius: var(--radius-sm);
    padding: 12px 14px; border-left: 3px solid var(--accent2);
    animation: fadeUp 0.3s ease;
  }
  .note-text { font-size: 13px; line-height: 1.6; }
  .note-meta { font-size: 11px; color: var(--muted); margin-top: 6px; display: flex; justify-content: space-between; }
  .note-delete { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 12px; padding: 0; }
  .note-delete:hover { color: var(--danger); }

  .note-form { display: flex; gap: 8px; }
  .note-form textarea {
    flex: 1; background: var(--bg); border: 1px solid var(--border);
    border-radius: var(--radius-sm); padding: 10px 14px; color: var(--text);
    font-size: 13px; font-family: var(--font-body); outline: none; resize: none; height: 40px;
    transition: all 0.18s;
  }
  .note-form textarea:focus { border-color: var(--accent2); height: 80px; }

  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .info-item { background: var(--surface2); border-radius: var(--radius-sm); padding: 12px 14px; }
  .info-item-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
  .info-item-value { font-size: 13px; font-weight: 500; }

  /* ── Login ── */
  .login-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg);
    background-image: radial-gradient(ellipse at 20% 50%, rgba(110,231,183,0.04) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 20%, rgba(129,140,248,0.04) 0%, transparent 60%);
  }
  .login-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 48px; width: 100%; max-width: 400px;
    animation: fadeUp 0.5s ease;
    box-shadow: var(--shadow);
  }
  .login-logo { text-align: center; margin-bottom: 36px; }
  .login-logo-icon {
    width: 64px; height: 64px; border-radius: 18px; margin: 0 auto 14px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center; font-size: 28px;
  }
  .login-title { font-family: var(--font-head); font-size: 26px; font-weight: 800; }
  .login-sub { color: var(--muted); font-size: 13px; margin-top: 6px; }
  .login-error {
    background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.2);
    border-radius: var(--radius-sm); padding: 10px 14px; font-size: 13px; color: var(--danger);
    margin-bottom: 16px;
  }

  /* ── Toast ── */
  .toast-container { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 8px; z-index: 200; }
  .toast {
    background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 12px 18px; font-size: 13px; display: flex; align-items: center; gap: 10px;
    animation: slideIn 0.3s ease; box-shadow: var(--shadow); min-width: 260px;
  }
  .toast-success { border-left: 3px solid var(--accent); }
  .toast-error { border-left: 3px solid var(--danger); }
  .toast-info { border-left: 3px solid var(--accent2); }

  /* ─── Responsive ─── */
  @media (max-width: 900px) {
    .sidebar { width: 60px; }
    .sidebar-logo .logo-text, .sidebar-logo .logo-sub, .nav-item span, .admin-name, .admin-role, .nav-badge, .nav-label { display: none; }
    .nav-item { justify-content: center; padding: 10px; }
    .admin-chip { justify-content: center; padding: 8px; }
    .topbar { padding: 16px 20px; }
    .content { padding: 20px; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .form-row { grid-template-columns: 1fr; }
  }
`;

const styleEl = document.createElement("style");
styleEl.textContent = styles;
document.head.appendChild(styleEl);

// ─── Data & Utils ─────────────────────────────────────────────────────────

const SOURCES = ["Website", "Contact Form", "Referral", "Social Media", "Email Campaign", "Cold Outreach", "Event"];
const ADMIN_CREDS = { username: "admin", password: "admin123" };

const COLORS = ["#6ee7b7","#818cf8","#f472b6","#fbbf24","#60a5fa","#fb923c"];
const avatarColor = (name) => COLORS[name.charCodeAt(0) % COLORS.length];
const avatarBg = (c) => `rgba(${parseInt(c.slice(1,3),16)},${parseInt(c.slice(3,5),16)},${parseInt(c.slice(5,7),16)},0.18)`;

const initials = (name) => name.split(" ").slice(0,2).map(n=>n[0]).join("").toUpperCase();
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const fmtTime = (iso) => new Date(iso).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
const uid = () => Math.random().toString(36).slice(2,10);

const SEED_LEADS = [
  { id: uid(), name: "Alice Monroe", email: "alice@example.com", phone: "+1 555-0101", company: "Artisan Labs", source: "Website", status: "converted", notes: [{id:uid(),text:"Signed contract for 3-month retainer.",date:new Date(Date.now()-86400000*2).toISOString()}], createdAt: new Date(Date.now()-86400000*10).toISOString() },
  { id: uid(), name: "David Chen", email: "dchen@techco.io", phone: "+1 555-0202", company: "TechCo", source: "Referral", status: "contacted", notes: [{id:uid(),text:"Had a call. Interested in the premium plan.",date:new Date(Date.now()-86400000*1).toISOString()}], createdAt: new Date(Date.now()-86400000*7).toISOString() },
  { id: uid(), name: "Samira Patel", email: "samira@bloom.co", phone: "", company: "Bloom Agency", source: "Contact Form", status: "new", notes: [], createdAt: new Date(Date.now()-86400000*3).toISOString() },
  { id: uid(), name: "Marcus Reeves", email: "m.reeves@growthspark.com", phone: "+1 555-0303", company: "GrowthSpark", source: "Social Media", status: "new", notes: [], createdAt: new Date(Date.now()-86400000*1).toISOString() },
  { id: uid(), name: "Fiona Walsh", email: "fiona@crestwave.net", phone: "+1 555-0404", company: "Crestwave", source: "Email Campaign", status: "contacted", notes: [{id:uid(),text:"Follow up next Monday.",date:new Date().toISOString()}], createdAt: new Date(Date.now()-86400000*5).toISOString() },
];

function useStorage(key, def) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : def; } catch { return def; }
  });
  const set = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, set];
}

// ─── Toast System ─────────────────────────────────────────────────────────

function Toasts({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const add = (msg, type = "success") => {
    const id = uid();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };
  return { toasts, toast: add };
}

// ─── Login ────────────────────────────────────────────────────────────────

function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    if (user === ADMIN_CREDS.username && pass === ADMIN_CREDS.password) onLogin();
    else setErr("Invalid credentials. Try admin / admin123");
  };
  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">🎯</div>
          <div className="login-title">LeadFlow CRM</div>
          <div className="login-sub">Sign in to your admin panel</div>
        </div>
        {err && <div className="login-error">{err}</div>}
        <div className="form-group">
          <label className="form-label">Username</label>
          <input className="form-input" value={user} onChange={e=>setUser(e.target.value)} placeholder="admin" onKeyDown={e=>e.key==="Enter"&&submit()} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&submit()} />
        </div>
        <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"12px"}} onClick={submit}>Sign In →</button>
        <p style={{textAlign:"center",marginTop:16,fontSize:12,color:"var(--muted)"}}>Demo: admin / admin123</p>
      </div>
    </div>
  );
}

// ─── Add/Edit Lead Modal ──────────────────────────────────────────────────

function LeadModal({ lead, onSave, onClose }) {
  const [form, setForm] = useState(lead || { name:"", email:"", phone:"", company:"", source:"Website", status:"new" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const valid = form.name.trim() && form.email.trim();
  const save = () => { if (!valid) return; onSave(form); };
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{lead ? "Edit Lead" : "Add New Lead"}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Jane Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="jane@company.com" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="+1 555-0000" />
            </div>
            <div className="form-group">
              <label className="form-label">Company</label>
              <input className="form-input" value={form.company} onChange={e=>set("company",e.target.value)} placeholder="Acme Inc." />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Source</label>
              <select className="form-select" value={form.source} onChange={e=>set("source",e.target.value)}>
                {SOURCES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e=>set("status",e.target.value)}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
              </select>
            </div>
          </div>
          <div className="form-footer">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={save} disabled={!valid} style={{opacity:valid?1:0.5}}>
              {lead ? "Save Changes" : "Add Lead"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lead Detail Panel ────────────────────────────────────────────────────

function LeadDetail({ lead, onUpdate, onClose }) {
  const [noteText, setNoteText] = useState("");
  const textRef = useRef();
  const color = avatarColor(lead.name);
  const bg = avatarBg(color);

  const changeStatus = (s) => onUpdate({...lead, status: s});

  const addNote = () => {
    if (!noteText.trim()) return;
    const note = { id: uid(), text: noteText.trim(), date: new Date().toISOString() };
    onUpdate({...lead, notes: [...(lead.notes||[]), note]});
    setNoteText("");
  };

  const deleteNote = (nid) => onUpdate({...lead, notes: lead.notes.filter(n=>n.id!==nid)});

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="detail-panel">
        <div className="modal-header">
          <span className="modal-title">Lead Details</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="detail-header">
          <div className="detail-avatar" style={{background:bg,color}}>
            {initials(lead.name)}
          </div>
          <div className="detail-info">
            <div className="detail-name">{lead.name}</div>
            <div className="detail-email">✉ {lead.email}{lead.phone && ` · 📞 ${lead.phone}`}</div>
            <div className="detail-meta">
              <StatusBadge s={lead.status} />
              {lead.company && <span className="lead-source">🏢 {lead.company}</span>}
              <span className="lead-source">📡 {lead.source}</span>
            </div>
          </div>
        </div>

        <div className="detail-body">
          {/* Status */}
          <div className="detail-section">
            <div className="detail-section-title">Update Status</div>
            <div className="status-buttons">
              {["new","contacted","converted"].map(s=>(
                <button key={s} onClick={()=>changeStatus(s)}
                  className={`status-btn${lead.status===s?" active-"+s:""}`}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Info grid */}
          <div className="detail-section">
            <div className="detail-section-title">Contact Info</div>
            <div className="info-grid">
              <div className="info-item"><div className="info-item-label">Added</div><div className="info-item-value">{fmtDate(lead.createdAt)}</div></div>
              <div className="info-item"><div className="info-item-label">Source</div><div className="info-item-value">{lead.source}</div></div>
              <div className="info-item"><div className="info-item-label">Company</div><div className="info-item-value">{lead.company||"—"}</div></div>
              <div className="info-item"><div className="info-item-label">Phone</div><div className="info-item-value">{lead.phone||"—"}</div></div>
            </div>
          </div>

          {/* Notes */}
          <div className="detail-section">
            <div className="detail-section-title">Notes & Follow-ups ({(lead.notes||[]).length})</div>
            {(lead.notes||[]).length > 0 && (
              <div className="notes-list">
                {lead.notes.map(n=>(
                  <div key={n.id} className="note-card">
                    <div className="note-text">{n.text}</div>
                    <div className="note-meta">
                      <span>{fmtDate(n.date)} at {fmtTime(n.date)}</span>
                      <button className="note-delete" onClick={()=>deleteNote(n.id)}>✕ Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="note-form">
              <textarea
                ref={textRef}
                value={noteText}
                onChange={e=>setNoteText(e.target.value)}
                placeholder="Add a note or follow-up reminder..."
                onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),addNote())}
              />
              <button className="btn btn-primary btn-sm" onClick={addNote} style={{alignSelf:"flex-start",marginTop:1}}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────

function StatusBadge({ s }) {
  return (
    <span className={`badge badge-${s}`}>
      <span className="badge-dot" /> {s.charAt(0).toUpperCase()+s.slice(1)}
    </span>
  );
}

// ─── Main CRM App ─────────────────────────────────────────────────────────

export default function App() {
  const [authed, setAuthed] = useStorage("crm_auth", false);
  const [leads, setLeads] = useStorage("crm_leads", SEED_LEADS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [showAdd, setShowAdd] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [detailLead, setDetailLead] = useState(null);
  const [view, setView] = useState("leads");
  const { toasts, toast } = useToasts();

  const stats = {
    total: leads.length,
    new: leads.filter(l=>l.status==="new").length,
    contacted: leads.filter(l=>l.status==="contacted").length,
    converted: leads.filter(l=>l.status==="converted").length,
  };

  const filtered = leads
    .filter(l => filter==="all" || l.status===filter)
    .filter(l => {
      const q = search.toLowerCase();
      return !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || (l.company||"").toLowerCase().includes(q);
    })
    .sort((a,b) => {
      if (sort==="newest") return new Date(b.createdAt)-new Date(a.createdAt);
      if (sort==="oldest") return new Date(a.createdAt)-new Date(b.createdAt);
      if (sort==="name") return a.name.localeCompare(b.name);
      return 0;
    });

  const addLead = (form) => {
    const l = { ...form, id: uid(), notes: [], createdAt: new Date().toISOString() };
    setLeads([l, ...leads]);
    setShowAdd(false);
    toast("Lead added successfully!");
  };

  const saveLead = (form) => {
    setLeads(leads.map(l=>l.id===form.id?{...l,...form}:l));
    setEditLead(null);
    toast("Lead updated.");
  };

  const updateLead = (upd) => {
    setLeads(leads.map(l=>l.id===upd.id?upd:l));
    setDetailLead(upd);
    toast("Lead saved.", "info");
  };

  const deleteLead = (id) => {
    setLeads(leads.filter(l=>l.id!==id));
    setDetailLead(null);
    toast("Lead deleted.", "error");
  };

  if (!authed) return <Login onLogin={()=>setAuthed(true)} />;

  return (
    <div className="crm-wrap">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🎯</div>
          <div>
            <div className="logo-text">LeadFlow</div>
            <div className="logo-sub">CRM System</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label">Menu</div>
          {[
            {key:"leads",icon:"📋",label:"Leads", badge: stats.new},
            {key:"dashboard",icon:"📊",label:"Analytics"},
          ].map(n=>(
            <div key={n.key} className={`nav-item${view===n.key?" active":""}`} onClick={()=>setView(n.key)}>
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
              {n.badge > 0 && <span className="nav-badge">{n.badge}</span>}
            </div>
          ))}
          <div className="nav-label" style={{marginTop:24}}>Actions</div>
          <div className="nav-item" onClick={()=>setShowAdd(true)}>
            <span className="nav-icon">➕</span>
            <span>Add Lead</span>
          </div>
        </nav>
        <div className="sidebar-footer">
          <div className="admin-chip">
            <div className="admin-avatar">A</div>
            <div>
              <div className="admin-name">Admin</div>
              <div className="admin-role">Super Admin</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{width:"100%",justifyContent:"center",marginTop:10}} onClick={()=>setAuthed(false)}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">{view === "leads" ? "Leads" : "Analytics"}</div>
          {view === "leads" && (
            <>
              <div className="topbar-search">
                <span style={{color:"var(--muted)"}}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search leads..." />
              </div>
              <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>+ Add Lead</button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="content">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{background:"rgba(110,231,183,0.12)"}}>📋</div>
              <div><div className="stat-num">{stats.total}</div><div className="stat-label">Total Leads</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{background:"rgba(96,165,250,0.12)"}}>🆕</div>
              <div><div className="stat-num" style={{color:"#60a5fa"}}>{stats.new}</div><div className="stat-label">New</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{background:"rgba(167,139,250,0.12)"}}>📞</div>
              <div><div className="stat-num" style={{color:"#a78bfa"}}>{stats.contacted}</div><div className="stat-label">Contacted</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{background:"rgba(52,211,153,0.12)"}}>✅</div>
              <div>
                <div className="stat-num" style={{color:"#34d399"}}>{stats.converted}</div>
                <div className="stat-label">Converted</div>
                <div className="stat-delta">{stats.total > 0 ? Math.round(stats.converted/stats.total*100) : 0}% rate</div>
              </div>
            </div>
          </div>

          {view === "leads" ? (
            <>
              {/* Toolbar */}
              <div className="toolbar">
                <div className="filter-tabs">
                  {["all","new","contacted","converted"].map(f=>(
                    <div key={f} className={`filter-tab${filter===f?" active":""}`} onClick={()=>setFilter(f)}>
                      {f.charAt(0).toUpperCase()+f.slice(1)}
                    </div>
                  ))}
                </div>
                <select className="sort-select" value={sort} onChange={e=>setSort(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A–Z</option>
                </select>
                <span style={{marginLeft:"auto",fontSize:13,color:"var(--muted)"}}>
                  {filtered.length} lead{filtered.length!==1?"s":""}
                </span>
              </div>

              {/* Table */}
              <div className="table-wrap">
                {filtered.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <div className="empty-text">No leads found</div>
                    <div className="empty-sub">Try adjusting your filters or adding a new lead.</div>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Lead</th>
                        <th>Source</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th>Added</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(l => {
                        const color = avatarColor(l.name);
                        const bg = avatarBg(color);
                        return (
                          <tr key={l.id} onClick={()=>setDetailLead(l)}>
                            <td>
                              <div style={{display:"flex",alignItems:"center",gap:12}}>
                                <div style={{width:34,height:34,borderRadius:10,background:bg,color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-head)",fontWeight:700,fontSize:13,flexShrink:0}}>
                                  {initials(l.name)}
                                </div>
                                <div>
                                  <div className="lead-name">{l.name}</div>
                                  <div className="lead-email">{l.email}</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="lead-source">📡 {l.source}</span></td>
                            <td><StatusBadge s={l.status} /></td>
                            <td><span style={{fontSize:12,color:"var(--muted)"}}>{(l.notes||[]).length} note{(l.notes||[]).length!==1?"s":""}</span></td>
                            <td><span className="lead-date">{fmtDate(l.createdAt)}</span></td>
                            <td onClick={e=>e.stopPropagation()}>
                              <div className="actions-cell">
                                <button className="btn btn-ghost btn-sm" onClick={()=>setDetailLead(l)}>View</button>
                                <button className="btn btn-ghost btn-sm" onClick={()=>setEditLead(l)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={()=>deleteLead(l.id)}>✕</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <Analytics leads={leads} />
          )}
        </div>
      </div>

      {/* Modals */}
      {showAdd && <LeadModal onSave={addLead} onClose={()=>setShowAdd(false)} />}
      {editLead && <LeadModal lead={editLead} onSave={saveLead} onClose={()=>setEditLead(null)} />}
      {detailLead && <LeadDetail lead={detailLead} onUpdate={updateLead} onClose={()=>setDetailLead(null)} />}

      <Toasts toasts={toasts} />
    </div>
  );
}

// ─── Analytics View ───────────────────────────────────────────────────────

function Analytics({ leads }) {
  const bySource = SOURCES.reduce((a,s)=>({...a,[s]:leads.filter(l=>l.source===s).length}),{});
  const maxSrc = Math.max(...Object.values(bySource), 1);

  const byMonth = {};
  leads.forEach(l => {
    const m = new Date(l.createdAt).toLocaleDateString("en-US",{month:"short",year:"2-digit"});
    byMonth[m] = (byMonth[m]||0)+1;
  });
  const months = Object.entries(byMonth).slice(-6);
  const maxM = Math.max(...months.map(x=>x[1]),1);

  const convRate = leads.length ? Math.round(leads.filter(l=>l.status==="converted").length/leads.length*100) : 0;

  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {/* Sources */}
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:24}}>
          <div style={{fontFamily:"var(--font-head)",fontWeight:700,marginBottom:20}}>Leads by Source</div>
          {SOURCES.map((s,i)=>(
            <div key={s} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                <span>{s}</span><span style={{color:"var(--muted)"}}>{bySource[s]}</span>
              </div>
              <div style={{height:6,background:"var(--surface2)",borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(bySource[s]/maxSrc)*100}%`,background:`hsl(${i*40+160},70%,60%)`,borderRadius:4,transition:"width 0.5s ease"}} />
              </div>
            </div>
          ))}
        </div>

        {/* Status donut (CSS) */}
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:24}}>
          <div style={{fontFamily:"var(--font-head)",fontWeight:700,marginBottom:20}}>Status Breakdown</div>
          {[
            {label:"New",key:"new",color:"#60a5fa"},
            {label:"Contacted",key:"contacted",color:"#a78bfa"},
            {label:"Converted",key:"converted",color:"#34d399"},
          ].map(s=>{
            const cnt = leads.filter(l=>l.status===s.key).length;
            const pct = leads.length ? (cnt/leads.length*100).toFixed(0) : 0;
            return (
              <div key={s.key} style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:12,height:12,borderRadius:"50%",background:s.color,flexShrink:0}} />
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:4}}>
                    <span>{s.label}</span><span style={{color:"var(--muted)"}}>{cnt} ({pct}%)</span>
                  </div>
                  <div style={{height:6,background:"var(--surface2)",borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:s.color,borderRadius:4,transition:"width 0.6s ease"}} />
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{marginTop:20,padding:"14px",background:"var(--surface2)",borderRadius:"var(--radius-sm)",textAlign:"center"}}>
            <div style={{fontFamily:"var(--font-head)",fontSize:32,fontWeight:800,color:"#34d399"}}>{convRate}%</div>
            <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>Overall Conversion Rate</div>
          </div>
        </div>
      </div>

      {/* Monthly trend */}
      {months.length > 0 && (
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"var(--radius)",padding:24}}>
          <div style={{fontFamily:"var(--font-head)",fontWeight:700,marginBottom:24}}>Monthly Lead Volume</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:12,height:120}}>
            {months.map(([m,v])=>(
              <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <div style={{fontSize:11,color:"var(--muted)"}}>{v}</div>
                <div style={{width:"100%",background:"linear-gradient(to top, var(--accent), var(--accent2))",borderRadius:"4px 4px 0 0",height:`${(v/maxM)*96}px`,minHeight:4,transition:"height 0.5s ease"}} />
                <div style={{fontSize:10,color:"var(--muted)"}}>{m}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
