:root{
  --bg:#0f1724;
  --card:#0b1220;
  --muted:#9aa6bf;
  --accent:#7c5cff;
  --accent-2:#00d4ff;
  --danger:#ff6b6b;
  --glass: rgba(255,255,255,0.03);
  --glass-2: rgba(255,255,255,0.02);
}
*{box-sizing:border-box}
html,body,#app{height:100%}
body{
  margin:0;
  font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial;
  background:linear-gradient(180deg,var(--bg),#071023);
  color:#e6eef8;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  padding:24px;
}
.app-root{max-width:920px;margin:24px auto;padding:28px;border-radius:16px;background:linear-gradient(180deg,var(--glass),var(--glass-2));box-shadow:0 8px 30px rgba(2,6,23,0.6);}
.app-header{display:flex;align-items:center;justify-content:space-between}
.app-header h1{margin:0;font-size:22px;letter-spacing:0.4px}
.lead{margin:0;color:var(--muted);font-size:13px}
.app-main{margin-top:18px}
.controls{display:flex;gap:18px;align-items:center;flex-wrap:wrap}
.todo-form{display:flex;flex:1;gap:8px}
.todo-form input{flex:1;padding:12px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit;outline:none}
.btn{padding:10px 14px;border-radius:10px;border:0;cursor:pointer;background:transparent;color:inherit}
.btn.primary{background:linear-gradient(90deg,var(--accent),var(--accent-2));color:#041025;font-weight:600}
.filters{display:flex;gap:8px}
.filter{background:transparent;padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);color:var(--muted);cursor:pointer}
.filter.active{border-color:transparent;background:rgba(255,255,255,0.03);color:var(--accent)}
.todos{margin-top:18px;display:grid;gap:12px}
.todo{display:flex;align-items:center;gap:12px;padding:14px;border-radius:12px;background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);border:1px solid rgba(255,255,255,0.02)}
.todo .title{flex:1}
.todo .meta{display:flex;gap:8px;align-items:center}
.checkbox{width:18px;height:18px;border-radius:6px;border:1px solid rgba(255,255,255,0.06);display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
.checkbox.checked{background:linear-gradient(90deg,var(--accent),var(--accent-2));border:0}
.btn.icon{background:transparent;border:0;color:var(--muted);padding:6px}
.btn.icon:hover{color:#fff}
.empty{margin-top:18px;color:var(--muted);text-align:center;padding:22px;border-radius:12px;background:transparent}
.app-footer{margin-top:18px;text-align:center;color:var(--muted)}
.small-muted{font-size:12px;color:var(--muted)}
@media(max-width:640px){.app-root{margin:12px;padding:18px}.controls{flex-direction:column}.filters{width:100%;justify-content:space-between}}


