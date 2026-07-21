"use client";

import { useMemo, useState } from "react";
import { Boxes, Calculator, ChevronRight, Gauge, MapPin, Package, Plus, Route, Save, Trash2, X } from "lucide-react";
import { CALCULATOR_TYPES } from "../../lib/calculators/types";
import { createEmptyRoute, createEmptyStop } from "../../lib/routes/defaults";
import { formatMoney } from "../../lib/formatters/money";

function Field({ label, children }) {
  return <label className="cr-field"><span>{label}</span>{children}</label>;
}

export default function CentrumRentownosciPanel() {
  const [tab, setTab] = useState("kalkulator");
  const [selectedCalculator, setSelectedCalculator] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [draft, setDraft] = useState(createEmptyRoute());

  const totals = useMemo(() => draft.stops.reduce((result, stop) => ({
    pallets: result.pallets + Number(stop.pallets || 0),
    weightKg: result.weightKg + Number(stop.weightKg || 0),
  }), { pallets: 0, weightKg: 0 }), [draft.stops]);

  const setField = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const setStop = (id, key, value) => setDraft((current) => ({ ...current, stops: current.stops.map((stop) => stop.id === id ? { ...stop, [key]: value } : stop) }));
  const addStop = () => setDraft((current) => ({ ...current, stops: [...current.stops, createEmptyStop()] }));
  const removeStop = (id) => setDraft((current) => ({ ...current, stops: current.stops.length > 1 ? current.stops.filter((stop) => stop.id !== id) : current.stops }));
  const saveRoute = () => {
    if (!draft.name.trim()) return;
    setRoutes((current) => [...current, { ...draft, status: "zaplanowana" }]);
    setDraft(createEmptyRoute());
    setTab("magazyn");
  };

  return (
    <section className="cr-root">
      <style>{`
        .cr-root{--bg:#14181b;--surface:#1c2226;--surface2:#232a2f;--border:#333c42;--text:#ebe9e3;--dim:#9aa3a8;--accent:#4f9db8;max-width:1240px;margin:auto;border:1px solid var(--border);border-radius:16px;overflow:hidden;background:var(--bg);color:var(--text)}
        .cr-header{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;padding:26px 28px;border-bottom:1px solid var(--border)}.cr-eyebrow{color:var(--accent);font-size:11px;letter-spacing:.15em;text-transform:uppercase}.cr-title{font-size:28px;font-weight:700;margin-top:5px}.cr-subtitle{color:var(--dim);font-size:13px;margin-top:6px;max-width:700px}.cr-kpis{display:flex;gap:8px}.cr-kpi{min-width:110px;padding:10px 12px;background:var(--surface);border:1px solid var(--border);border-radius:10px}.cr-kpi strong{display:block}.cr-kpi span{color:var(--dim);font-size:10px}
        .cr-tabs{display:flex;overflow:auto;padding:8px 16px 0;border-bottom:1px solid var(--border)}.cr-tab{display:flex;gap:7px;align-items:center;padding:11px 13px;border:0;border-bottom:2px solid transparent;background:none;color:var(--dim);cursor:pointer;white-space:nowrap}.cr-tab.active{color:var(--text);border-bottom-color:var(--accent)}.cr-body{padding:24px 28px 32px}.cr-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.cr-card,.cr-panel{background:var(--surface);border:1px solid var(--border);border-radius:12px}.cr-card{padding:17px;text-align:left;color:var(--text);cursor:pointer}.cr-card:hover,.cr-card.selected{border-color:var(--accent)}.cr-card h3{font-size:14px;margin:12px 0 6px}.cr-card p{color:var(--dim);font-size:12px;line-height:1.45}.cr-selected{margin-top:18px;padding:16px;border:1px solid var(--accent);border-radius:12px;background:rgba(79,157,184,.08)}
        .cr-layout{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(270px,.7fr);gap:20px}.cr-panel{padding:18px}.cr-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px}.cr-field{display:flex;flex-direction:column;gap:5px}.cr-field span{font-size:11px;color:var(--dim)}.cr-input,.cr-select{width:100%;padding:9px 10px;border:1px solid var(--border);border-radius:7px;background:var(--surface2);color:var(--text)}.cr-stop{padding:13px;margin-top:10px;border:1px solid var(--border);border-radius:10px;background:var(--surface2)}.cr-stop-head{display:flex;align-items:center;gap:8px;margin-bottom:10px;color:var(--dim);font-size:12px}.cr-icon{margin-left:auto;border:0;background:none;color:var(--dim);cursor:pointer}.cr-row{display:flex;justify-content:space-between;gap:15px;padding:9px 0;border-bottom:1px solid var(--border);font-size:12px}.cr-row span{color:var(--dim)}.cr-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.cr-button{display:inline-flex;align-items:center;gap:7px;padding:10px 15px;border:0;border-radius:8px;background:#2f6f88;color:white;cursor:pointer}.cr-button.secondary{background:transparent;border:1px solid var(--border);color:var(--dim)}
        .cr-empty{text-align:center;padding:55px 20px;border:1px dashed var(--border);border-radius:12px;color:var(--dim)}.cr-table-wrap{overflow:auto;border:1px solid var(--border);border-radius:10px}.cr-table{width:100%;min-width:820px;border-collapse:collapse;font-size:12px}.cr-table th,.cr-table td{padding:10px;border-bottom:1px solid var(--border);text-align:left}.cr-table th{color:var(--dim);font-size:10px;text-transform:uppercase}.cr-opt{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.cr-opt article{padding:17px;background:var(--surface);border:1px solid var(--border);border-radius:12px}.cr-opt p{color:var(--dim);font-size:12px;line-height:1.45}@media(max-width:900px){.cr-layout{grid-template-columns:1fr}}@media(max-width:640px){.cr-body,.cr-header{padding:18px}.cr-kpis{width:100%}.cr-kpi{flex:1;min-width:0}}
      `}</style>

      <header className="cr-header">
        <div><div className="cr-eyebrow">Analiza</div><div className="cr-title">Centrum Rentowności</div><div className="cr-subtitle">Analiza handlu, dystrybucji, transportu, spedycji, importu, eksportu, magazynowania i produkcji.</div></div>
        <div className="cr-kpis"><div className="cr-kpi"><strong>{routes.length}</strong><span>Trasy</span></div><div className="cr-kpi"><strong>0 zł</strong><span>Łączny zysk</span></div><div className="cr-kpi"><strong>0%</strong><span>Średnia marża</span></div></div>
      </header>

      <nav className="cr-tabs">
        {[['kalkulator','Kalkulator',Calculator],['tworzenie','Tworzenie trasy',Route],['magazyn','Magazyn tras',Boxes],['optymalizacja','Optymalizacja trasy',Gauge]].map(([id,label,Icon]) => <button key={id} className={`cr-tab ${tab===id?'active':''}`} onClick={() => setTab(id)}><Icon size={15}/>{label}</button>)}
      </nav>

      <div className="cr-body">
        {tab === "kalkulator" && <><div className="cr-grid">{CALCULATOR_TYPES.map((calculator) => { const Icon=calculator.icon; return <button key={calculator.id} className={`cr-card ${selectedCalculator?.id===calculator.id?'selected':''}`} onClick={() => setSelectedCalculator(calculator)}><Icon size={22} color="var(--accent)"/><h3>{calculator.name}</h3><p>{calculator.description}</p><span style={{color:'var(--accent)',fontSize:12}}>Wybierz <ChevronRight size={13} style={{verticalAlign:'middle'}}/></span></button>; })}</div>{selectedCalculator && <div className="cr-selected"><strong>{selectedCalculator.name}</strong><div style={{color:'var(--dim)',fontSize:12,marginTop:4}}>Wybrany moduł kalkulacji. Formularz zostanie podłączony jako osobna część aplikacji.</div></div>}</>}

        {tab === "tworzenie" && <div className="cr-layout"><div className="cr-panel"><h3>Dane trasy</h3><div className="cr-fields"><Field label="Nazwa trasy"><input className="cr-input" value={draft.name} onChange={(e)=>setField('name',e.target.value)}/></Field><Field label="Miejsce startu"><input className="cr-input" value={draft.startPlace} onChange={(e)=>setField('startPlace',e.target.value)}/></Field><Field label="Kraj docelowy"><input className="cr-input" value={draft.destinationCountry} onChange={(e)=>setField('destinationCountry',e.target.value)}/></Field><Field label="Przewoźnik"><input className="cr-input" value={draft.carrier} onChange={(e)=>setField('carrier',e.target.value)}/></Field><Field label="Data załadunku"><input type="date" className="cr-input" value={draft.loadingDate} onChange={(e)=>setField('loadingDate',e.target.value)}/></Field><Field label="Planowana dostawa"><input type="date" className="cr-input" value={draft.deliveryDate} onChange={(e)=>setField('deliveryDate',e.target.value)}/></Field><Field label="Dystans (km)"><input type="number" className="cr-input" value={draft.distanceKm} onChange={(e)=>setField('distanceKm',Number(e.target.value))}/></Field><Field label="Rodzaj towaru"><input className="cr-input" value={draft.cargoType} onChange={(e)=>setField('cargoType',e.target.value)}/></Field><Field label="Temperatura"><input className="cr-input" value={draft.temperature} onChange={(e)=>setField('temperature',e.target.value)}/></Field><Field label="Wartość ładunku"><input type="number" className="cr-input" value={draft.cargoValue} onChange={(e)=>setField('cargoValue',Number(e.target.value))}/></Field></div><h3>Punkty trasy</h3>{draft.stops.map((stop,index)=><div className="cr-stop" key={stop.id}><div className="cr-stop-head"><MapPin size={14}/> Punkt {index+1}{draft.stops.length>1&&<button className="cr-icon" onClick={()=>removeStop(stop.id)}><X size={15}/></button>}</div><div className="cr-fields"><Field label="Typ punktu"><select className="cr-select" value={stop.type} onChange={(e)=>setStop(stop.id,'type',e.target.value)}><option value="zaladunek">Załadunek</option><option value="dostawa">Dostawa</option><option value="przeladunek">Przeładunek</option></select></Field><Field label="Miejsce"><input className="cr-input" value={stop.place} onChange={(e)=>setStop(stop.id,'place',e.target.value)}/></Field><Field label="Palety"><input type="number" className="cr-input" value={stop.pallets} onChange={(e)=>setStop(stop.id,'pallets',Number(e.target.value))}/></Field><Field label="Waga (kg)"><input type="number" className="cr-input" value={stop.weightKg} onChange={(e)=>setStop(stop.id,'weightKg',Number(e.target.value))}/></Field></div></div>)}<div className="cr-actions"><button className="cr-button secondary" onClick={addStop}><Plus size={15}/>Dodaj punkt</button><button className="cr-button" onClick={saveRoute}><Save size={15}/>Zapisz trasę</button></div></div><aside className="cr-panel"><h3>Podsumowanie</h3><div className="cr-row"><span>Nazwa</span><strong>{draft.name||'Bez nazwy'}</strong></div><div className="cr-row"><span>Kierunek</span><strong>{draft.startPlace||'—'} → {draft.destinationCountry||'—'}</strong></div><div className="cr-row"><span>Punkty</span><strong>{draft.stops.length}</strong></div><div className="cr-row"><span>Palety</span><strong>{totals.pallets}</strong></div><div className="cr-row"><span>Waga</span><strong>{totals.weightKg.toLocaleString('pl-PL')} kg</strong></div><div className="cr-row"><span>Wartość</span><strong>{formatMoney(draft.cargoValue)}</strong></div></aside></div>}

        {tab === "magazyn" && (routes.length===0?<div className="cr-empty">Magazyn tras jest pusty. Nie dodajemy przykładowych tras.</div>:<div className="cr-table-wrap"><table className="cr-table"><thead><tr><th>Trasa</th><th>Status</th><th>Kierunek</th><th>Przewoźnik</th><th>Palety</th><th>Waga</th><th>Dystans</th><th></th></tr></thead><tbody>{routes.map((route)=>{const pallets=route.stops.reduce((sum,s)=>sum+Number(s.pallets||0),0);const weight=route.stops.reduce((sum,s)=>sum+Number(s.weightKg||0),0);return <tr key={route.id}><td>{route.name}</td><td>{route.status}</td><td>{route.startPlace||'—'} → {route.destinationCountry||'—'}</td><td>{route.carrier||'—'}</td><td>{pallets}</td><td>{weight.toLocaleString('pl-PL')} kg</td><td>{route.distanceKm} km</td><td><button className="cr-icon" onClick={()=>setRoutes((current)=>current.filter((item)=>item.id!==route.id))}><Trash2 size={15}/></button></td></tr>})}</tbody></table></div>)}

        {tab === "optymalizacja" && (routes.length===0?<div className="cr-empty">Brak tras do optymalizacji. Moduł uruchomi się po zapisaniu pierwszej trasy.</div>:<div className="cr-opt"><article><Gauge/><h3>Optymalizacja finansowa</h3><p>Próg rentowności, minimalna cena sprzedaży i maksymalny koszt przewoźnika.</p></article><article><Route/><h3>Kolejność punktów</h3><p>Długość trasy, czas przejazdu i ograniczenie pustych kilometrów.</p></article><article><Package/><h3>Ładunek</h3><p>Wykorzystanie palet, kilogramów i możliwość połączenia tras.</p></article><article><MapPin/><h3>Konsolidacja</h3><p>Łączenie podobnych kierunków i punktów dostawy.</p></article></div>)}
      </div>
    </section>
  );
}
