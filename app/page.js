'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

function buildPlainText(r, d) {
  const s = '────────────────────────────────────────────────────';
  return ['RECRUITER VIEW SIMULATOR — ANALYSIS REPORT','Generated: '+d,s,'','GRADE: '+r.overallGrade,r.oneLineSummary,'',s,'FIRST IMPRESSION',s,r.firstImpression,'',s,'WHAT READS CLEAR',s,...r.clearElements.map(e=>'  ✓ '+e),'',s,'WHAT FEELS CONFUSING',s,...r.confusingElements.map(e=>'  ? '+e),'',s,'PERCEIVED TARGET ROLE',s,r.perceivedTarget,'',s,'SKIP TRIGGERS',s,...r.skipTriggers.map(t=>'  ✕ '+t),'',s,'POSITIONING FIXES',s,...r.positioning.flatMap((p,i)=>['  '+(i+1)+'. ISSUE: '+p.issue,'     FIX:   '+p.fix,'']),s,'Powered by Recruiter View Simulator · danscareercorner.com'].join('\n');
}

function buildStyledReport(r, dateStr) {
  const gc = ({A:'#22c55e','B+':'#22c55e',B:'#84cc16','B-':'#84cc16','C+':'#eab308',C:'#eab308','C-':'#eab308',D:'#f97316',F:'#ef4444'})[r.overallGrade] || '#6b7280';
  const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Recruiter View — Analysis Report</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0a0e17;color:#e5e7eb;font-family:'DM Sans',sans-serif;padding:48px;max-width:820px;margin:0 auto}
.card{background:#111827;border:1px solid #1f2937;border-radius:12px;padding:20px 24px;margin-bottom:16px}
.card-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;font-family:'Space Mono',monospace;margin-bottom:12px}
.tag{display:inline-block;padding:5px 12px;border-radius:7px;font-size:12px;margin:3px 4px 3px 0}
.tg{background:#052e16;color:#86efac}.to{background:#431407;color:#fdba74}
.two-col{display:flex;gap:16px;margin-bottom:16px}.two-col>div{flex:1}
.fix-grid{display:flex;gap:12px;margin-bottom:14px}.fix-grid>div{flex:1;background:#0d1117;border-radius:8px;padding:12px 16px}
.fi{border-left:3px solid #ef4444}.fs{border-left:3px solid #22c55e}
.fl{font-size:9px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;margin-bottom:6px;font-family:'Space Mono',monospace}
.ft{font-size:12px;line-height:1.6;color:#d1d5db}
.trigger-row{display:flex;align-items:flex-start;gap:8px;font-size:13px;line-height:1.6;color:#d1d5db;margin-bottom:6px}
.trigger-x{color:#ef4444;font-family:'Space Mono',monospace;font-size:11px;margin-top:3px}
@media print{body{padding:24px;-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}.no-print{display:none!important}}
</style></head><body>
<div class="no-print" style="text-align:right;margin-bottom:20px">
<button onclick="window.print()" style="padding:10px 24px;border-radius:8px;border:none;background:linear-gradient(135deg,#f59e0b,#d97706);color:#0a0e17;font-weight:700;font-family:'Space Mono',monospace;font-size:13px;cursor:pointer">🖨 PRINT / SAVE AS PDF</button></div>
<div style="display:flex;align-items:center;gap:14px;margin-bottom:6px">
<div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,#f59e0b,#d97706);display:flex;align-items:center;justify-content:center;font-size:22px">👁</div>
<div style="font-family:'Playfair Display',serif;font-size:26px;font-weight:900;color:#f9fafb">Recruiter View</div></div>
<div style="font-size:12px;color:#6b7280;font-family:'Space Mono',monospace;margin-bottom:28px;padding-left:54px">Analysis Report · ${esc(dateStr)}</div>
<div class="card" style="display:flex;align-items:center;gap:20px;border-radius:14px;padding:22px 24px;margin-bottom:20px">
<div style="width:72px;height:72px;border-radius:50%;border:4px solid ${gc};display:flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;font-size:28px;font-weight:700;color:${gc};background:${gc}11;flex-shrink:0">${esc(r.overallGrade)}</div>
<div><div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#6b7280;font-family:'Space Mono',monospace;margin-bottom:4px">Recruiter Readiness</div>
<div style="font-size:16px;font-weight:700;color:#f9fafb;font-family:'Playfair Display',serif;line-height:1.4">${esc(r.oneLineSummary)}</div></div></div>
<div class="card"><div class="card-title" style="color:#f59e0b">💭 First Impression</div>
<div style="font-size:14px;line-height:1.7;color:#d1d5db;font-style:italic">"${esc(r.firstImpression)}"</div></div>
<div class="two-col"><div class="card"><div class="card-title" style="color:#22c55e">✅ What Reads Clear</div>
${r.clearElements.map(e=>'<span class="tag tg">'+esc(e)+'</span>').join('')}</div>
<div class="card"><div class="card-title" style="color:#f97316">❓ What Feels Confusing</div>
${r.confusingElements.map(e=>'<span class="tag to">'+esc(e)+'</span>').join('')}</div></div>
<div class="card"><div class="card-title" style="color:#8b5cf6">🎯 Perceived Target Role</div>
<div style="font-size:14px;line-height:1.7;color:#d1d5db">${esc(r.perceivedTarget)}</div></div>
<div class="card"><div class="card-title" style="color:#ef4444">⏭ Skip Triggers</div>
${r.skipTriggers.map(t=>'<div class="trigger-row"><span class="trigger-x">✕</span>'+esc(t)+'</div>').join('')}</div>
<div class="card"><div class="card-title" style="color:#06b6d4">🔧 Sharpen Your Positioning</div>
${r.positioning.map(p=>'<div class="fix-grid"><div class="fi"><div class="fl">Issue</div><div class="ft">'+esc(p.issue)+'</div></div><div class="fs"><div class="fl">Fix</div><div class="ft">'+esc(p.fix)+'</div></div></div>').join('')}</div>
<div style="text-align:center;font-size:11px;color:#4b5563;font-family:'Space Mono',monospace;padding-top:12px;border-top:1px solid #1f2937;margin-top:8px">Powered by Recruiter View Simulator · danscareercorner.com</div>
</body></html>`;
}

const GradeRing = ({ grade, size = 88 }) => {
  const colors = {A:'#22c55e','B+':'#22c55e',B:'#84cc16','B-':'#84cc16','C+':'#eab308',C:'#eab308','C-':'#eab308',D:'#f97316',F:'#ef4444'};
  const color = colors[grade] || '#6b7280';
  return (<div style={{ width:size,height:size,borderRadius:'50%',border:'4px solid '+color,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Space Mono',monospace",fontSize:size*0.4,fontWeight:700,color,background:color+'11',flexShrink:0 }}>{grade||'—'}</div>);
};

const SectionCard = ({ icon, title, children, accent = '#f59e0b', delay = 0 }) => {
  const [v, setV] = useState(false);
  useEffect(() => { const t = setTimeout(() => setV(true), delay); return () => clearTimeout(t); }, [delay]);
  return (<div style={{ background:'#111827',border:'1px solid #1f2937',borderRadius:12,padding:'20px 24px',opacity:v?1:0,transform:v?'translateY(0)':'translateY(12px)',transition:'all 0.5s cubic-bezier(0.16,1,0.3,1)' }}><div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14,fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:accent,fontFamily:"'Space Mono',monospace" }}><span style={{fontSize:18}}>{icon}</span>{title}</div>{children}</div>);
};

const Tag = ({ children, color = '#374151', textColor = '#d1d5db' }) => (<span style={{ display:'inline-block',padding:'6px 14px',borderRadius:8,background:color,color:textColor,fontSize:13,lineHeight:1.4,fontFamily:"'DM Sans',sans-serif" }}>{children}</span>);

const ActionBtn = ({ onClick, icon, label, variant, feedback }) => {
  const [fb, setFb] = useState(false);
  const go = async () => { await onClick(); if(feedback){setFb(true);setTimeout(()=>setFb(false),2000);} };
  const p = variant==='primary';
  return (<button onClick={go} style={{ display:'flex',alignItems:'center',gap:8,padding:p?'10px 24px':'10px 20px',borderRadius:10,border:p?'none':'1px solid #374151',background:p?'linear-gradient(135deg,#f59e0b,#d97706)':'#111827',color:p?'#0a0e17':'#d1d5db',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'Space Mono',monospace",letterSpacing:'0.02em',transition:'all 0.2s' }}><span style={{fontSize:16}}>{fb?'✅':icon}</span>{fb?feedback:label}</button>);
};

export default function Home() {
  const [profileText, setProfileText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const startTimer = () => { startRef.current=Date.now(); timerRef.current=setInterval(()=>setElapsed(Date.now()-startRef.current),100); };
  const stopTimer = () => clearInterval(timerRef.current);

  const analyze = async () => {
    if(!profileText.trim()) return;
    setLoading(true); setError(''); setResult(null); setElapsed(0); startTimer();
    try {
      const res = await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profileText})});
      if(!res.ok) {
        const data = await res.json().catch(()=>({}));
        throw new Error(data.error || 'Analysis failed');
      }
      setResult(await res.json());
    } catch(e){ setError(e.message || 'Analysis failed. Please try again.'); }
    finally { stopTimer(); setLoading(false); }
  };

  const reset = () => { setResult(null); setProfileText(''); setError(''); setElapsed(0); };
  const dateStr = new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'});
  const fileDate = new Date().toISOString().slice(0,10);

  const downloadText = useCallback(()=>{
    if(!result) return;
    const blob = new Blob([buildPlainText(result,dateStr)],{type:'text/plain'});
    const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='recruiter-view-'+fileDate+'.txt'; a.click(); URL.revokeObjectURL(a.href);
  },[result,dateStr,fileDate]);

  const copyText = useCallback(async()=>{
    if(!result) return;
    const text = buildPlainText(result,dateStr);
    try{await navigator.clipboard.writeText(text);}catch{
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  },[result,dateStr]);

  const savePdf = useCallback(()=>{
    if(!result) return;
    const w = window.open('','_blank');
    if(w){ w.document.write(buildStyledReport(result,dateStr)); w.document.close(); }
  },[result,dateStr]);

  return (
    <div style={{minHeight:'100vh',background:'#0a0e17',color:'#e5e7eb',fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:wght@700;900&display=swap');@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes scanline{0%{top:-2px}100%{top:100%}}textarea:focus{outline:none;border-color:#f59e0b!important}*{box-sizing:border-box}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#111827}::-webkit-scrollbar-thumb{background:#374151;border-radius:3px}`}</style>

      <div style={{borderBottom:'1px solid #1f2937',padding:'24px 32px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:4}}>
            <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(135deg,#f59e0b,#d97706)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>👁</div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:900,margin:0,color:'#f9fafb',letterSpacing:'-0.02em'}}>Recruiter View</h1>
          </div>
          <p style={{fontSize:13,color:'#6b7280',margin:0,fontFamily:"'Space Mono',monospace",paddingLeft:48}}>See your profile through a recruiter&apos;s eyes · 10-20 second scan</p>
        </div>
        <div style={{fontFamily:"'Space Mono',monospace",fontSize:14,color:loading?'#f59e0b':'#6b7280',display:'flex',alignItems:'center',gap:6}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:loading?'#f59e0b':'#374151',animation:loading?'pulse 1s infinite':'none'}}/>
          {loading?'Scanning...':'Ready'} · {(elapsed/1000).toFixed(1)}s
        </div>
      </div>

      <div style={{maxWidth:860,margin:'0 auto',padding:'32px 24px'}}>
        {!result ? (
          <div>
            <div style={{background:'#111827',border:'1px solid #1f2937',borderRadius:16,padding:28,position:'relative',overflow:'hidden'}}>
              {loading&&<div style={{position:'absolute',top:0,left:0,right:0,height:'100%',overflow:'hidden',pointerEvents:'none'}}><div style={{position:'absolute',left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,#f59e0b,transparent)',animation:'scanline 2s linear infinite'}}/></div>}
              <label style={{display:'block',fontSize:13,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',color:'#9ca3af',marginBottom:12,fontFamily:"'Space Mono',monospace"}}>Paste profile content below</label>
              <p style={{fontSize:13,color:'#6b7280',margin:'0 0 16px 0',lineHeight:1.5}}>Copy your LinkedIn headline, About section, and top 2-3 experience entries.</p>
              <textarea value={profileText} onChange={e=>setProfileText(e.target.value)} placeholder={'Headline: Senior Product Manager | B2B SaaS\n\nAbout: Product leader with 8+ years...\n\nExperience:\nProduct Manager at TechCorp (2021-Present)\n- Led team of 12...'} disabled={loading} style={{width:'100%',minHeight:240,padding:20,borderRadius:10,border:'1px solid #374151',background:'#0d1117',color:'#e5e7eb',fontSize:14,fontFamily:"'DM Sans',sans-serif",lineHeight:1.7,resize:'vertical',transition:'border-color 0.2s'}}/>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:16}}>
                <span style={{fontSize:12,color:'#4b5563',fontFamily:"'Space Mono',monospace"}}>{profileText.length>0?profileText.split(/\s+/).filter(Boolean).length+' words':''}</span>
                <button onClick={analyze} disabled={loading||!profileText.trim()} style={{padding:'12px 32px',borderRadius:10,border:'none',background:loading||!profileText.trim()?'#374151':'linear-gradient(135deg,#f59e0b,#d97706)',color:loading||!profileText.trim()?'#6b7280':'#0a0e17',fontSize:14,fontWeight:700,fontFamily:"'Space Mono',monospace",cursor:loading||!profileText.trim()?'not-allowed':'pointer',letterSpacing:'0.04em',textTransform:'uppercase',transition:'all 0.2s'}}>{loading?'Scanning Profile...':'Run Recruiter Scan'}</button>
              </div>
            </div>
            {error&&<div style={{marginTop:16,padding:'12px 20px',background:'#1c1013',border:'1px solid #7f1d1d',borderRadius:10,color:'#fca5a5',fontSize:13}}>{error}</div>}
            <div style={{marginTop:32,display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
              {[{icon:'⏱',title:'10-Second Scan',desc:'Simulates a real recruiter\u2019s rapid first pass'},{icon:'🎯',title:'Positioning Read',desc:'Reveals what role you appear to target vs. intent'},{icon:'⚡',title:'Skip Triggers',desc:'Flags what makes recruiters move on'}].map((item,i)=>(<div key={i} style={{background:'#111827',border:'1px solid #1f2937',borderRadius:12,padding:20}}><div style={{fontSize:24,marginBottom:10}}>{item.icon}</div><div style={{fontSize:14,fontWeight:700,color:'#f9fafb',marginBottom:6}}>{item.title}</div><div style={{fontSize:13,color:'#6b7280',lineHeight:1.5}}>{item.desc}</div></div>))}
            </div>
          </div>
        ) : (
          <div>
            <div style={{display:'flex',alignItems:'center',gap:24,background:'#111827',border:'1px solid #1f2937',borderRadius:16,padding:'24px 28px',marginBottom:20}}>
              <GradeRing grade={result.overallGrade}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:11,textTransform:'uppercase',letterSpacing:'0.1em',color:'#6b7280',fontFamily:"'Space Mono',monospace",marginBottom:6}}>Recruiter Readiness</div>
                <div style={{fontSize:18,fontWeight:700,color:'#f9fafb',fontFamily:"'Playfair Display',serif",lineHeight:1.4}}>{result.oneLineSummary}</div>
              </div>
            </div>
            <div style={{display:'grid',gap:16}}>
              <SectionCard icon="💭" title="First Impression" accent="#f59e0b" delay={100}><p style={{margin:0,fontSize:15,lineHeight:1.7,color:'#d1d5db',fontStyle:'italic'}}>&ldquo;{result.firstImpression}&rdquo;</p></SectionCard>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:16}}>
                <SectionCard icon="✅" title="What Reads Clear" accent="#22c55e" delay={200}><div style={{display:'flex',flexWrap:'wrap',gap:8}}>{result.clearElements?.map((item,i)=><Tag key={i} color="#052e16" textColor="#86efac">{item}</Tag>)}</div></SectionCard>
                <SectionCard icon="❓" title="What Feels Confusing" accent="#f97316" delay={300}><div style={{display:'flex',flexWrap:'wrap',gap:8}}>{result.confusingElements?.map((item,i)=><Tag key={i} color="#431407" textColor="#fdba74">{item}</Tag>)}</div></SectionCard>
              </div>
              <SectionCard icon="🎯" title="Perceived Target Role" accent="#8b5cf6" delay={400}><p style={{margin:0,fontSize:15,lineHeight:1.7,color:'#d1d5db'}}>{result.perceivedTarget}</p></SectionCard>
              <SectionCard icon="⏭" title="Skip Triggers" accent="#ef4444" delay={500}><div style={{display:'flex',flexDirection:'column',gap:10}}>{result.skipTriggers?.map((t,i)=><div key={i} style={{display:'flex',alignItems:'flex-start',gap:10,fontSize:14,lineHeight:1.6,color:'#d1d5db'}}><span style={{color:'#ef4444',fontFamily:"'Space Mono',monospace",fontSize:12,marginTop:3,flexShrink:0}}>✕</span>{t}</div>)}</div></SectionCard>
              <SectionCard icon="🔧" title="Sharpen Your Positioning" accent="#06b6d4" delay={600}><div style={{display:'flex',flexDirection:'column',gap:16}}>{result.positioning?.map((item,i)=><div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}><div style={{background:'#0d1117',borderRadius:8,padding:'12px 16px',borderLeft:'3px solid #ef4444'}}><div style={{fontSize:10,textTransform:'uppercase',letterSpacing:'0.1em',color:'#6b7280',marginBottom:6,fontFamily:"'Space Mono',monospace"}}>Issue</div><div style={{fontSize:13,lineHeight:1.6,color:'#d1d5db'}}>{item.issue}</div></div><div style={{background:'#0d1117',borderRadius:8,padding:'12px 16px',borderLeft:'3px solid #22c55e'}}><div style={{fontSize:10,textTransform:'uppercase',letterSpacing:'0.1em',color:'#6b7280',marginBottom:6,fontFamily:"'Space Mono',monospace"}}>Fix</div><div style={{fontSize:13,lineHeight:1.6,color:'#d1d5db'}}>{item.fix}</div></div></div>)}</div></SectionCard>
            </div>
            <div style={{marginTop:28,background:'#111827',border:'1px solid #1f2937',borderRadius:14,padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:14}}>
              <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                <ActionBtn onClick={downloadText} icon="📄" label="Download TXT" feedback="Downloaded!"/>
                <ActionBtn onClick={copyText} icon="📋" label="Copy Text" feedback="Copied!"/>
                <ActionBtn onClick={savePdf} icon="📑" label="Save as PDF" variant="primary"/>
              </div>
              <button onClick={reset} style={{padding:'10px 24px',borderRadius:10,border:'1px solid #374151',background:'transparent',color:'#d1d5db',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'Space Mono',monospace",letterSpacing:'0.04em',textTransform:'uppercase',transition:'all 0.2s'}}>Scan Another Profile</button>
            </div>
            <div style={{textAlign:'center',marginTop:14,fontSize:12,color:'#4b5563',fontFamily:"'Space Mono',monospace"}}>Analysis completed in {(elapsed/1000).toFixed(1)}s</div>
          </div>
        )}
      </div>
    </div>
  );
}
