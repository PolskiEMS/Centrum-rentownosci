"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calculator, Check, CircleDollarSign, Plus, Trash2 } from "lucide-react";
import { CALCULATOR_DEFINITIONS, INPUT_FIELDS, REUSABLE_RUBRICS } from "../../lib/calculators/definitions";

const money = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const parseValue = (value) => Number(String(value || "").replace(/\s/g, "").replace(",", ".")) || 0;

export default function ProfitabilityCalculator({ slug }) {
  const router = useRouter();
  const calculator = CALCULATOR_DEFINITIONS.find((item) => item.slug === slug);
  const defaultFields = INPUT_FIELDS[slug];
  const isCreator = slug === "kreator";
  const [customFields, setCustomFields] = useState(null);
  const [selectedReusableRubric, setSelectedReusableRubric] = useState("");
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldKind, setNewFieldKind] = useState("cost");
  const [values, setValues] = useState({});
  const [hasCalculated, setHasCalculated] = useState(false);
  const fields = isCreator ? customFields ?? defaultFields : defaultFields;

  const analysis = useMemo(() => {
    const revenue = (fields || []).filter((field) => field.kind === "revenue").reduce((sum, field) => sum + parseValue(values[field.key]), 0);
    const costs = (fields || []).filter((field) => field.kind === "cost").reduce((sum, field) => sum + parseValue(values[field.key]), 0);
    const profit = revenue - costs;
    return { revenue, costs, profit, margin: revenue > 0 ? (profit / revenue) * 100 : 0 };
  }, [fields, values]);

  if (!calculator || !fields) {
    router.replace("/dashboard");
    return null;
  }

  function selectReusableRubric(label) {
    setSelectedReusableRubric(label);
    const field = REUSABLE_RUBRICS.find((item) => item.label === label);
    if (field) setNewFieldKind(field.kind);
    setNewFieldLabel(label);
  }

  function addCustomField() {
    const label = newFieldLabel.trim();
    if (!label) return;
    setCustomFields((current) => [...(current ?? defaultFields ?? []), { key: `custom-${Date.now()}`, label, placeholder: "np. 1 000", kind: newFieldKind }]);
    setNewFieldLabel("");
    setSelectedReusableRubric("");
    setHasCalculated(false);
  }

  function removeCustomField(key) {
    setCustomFields((current) => (current ?? defaultFields ?? []).filter((field) => field.key !== key));
    setValues((current) => { const next = { ...current }; delete next[key]; return next; });
    setHasCalculated(false);
  }

  return (
    <main className="app-shell">
      <style jsx global>{`
        .calculator-root{--cr-bg:#14181b;--cr-surface:#1c2226;--cr-border:#333c42;--cr-text:#ebe9e3;--cr-dim:#9aa3a8;--cr-accent:#4f9db8;max-width:1240px;margin:auto;overflow:hidden;border:1px solid var(--cr-border);border-radius:16px;background:var(--cr-bg);color:var(--cr-text)}
        .calculator-root .cr-header{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;padding:26px 28px;border-bottom:1px solid var(--cr-border)}
        .calculator-root .cr-eyebrow{margin:0;color:var(--cr-accent);font-size:11px;letter-spacing:.15em;text-transform:uppercase}
        .calculator-root .cr-title{margin:5px 0 0;font-size:28px}.calculator-root .cr-subtitle{max-width:700px;margin:6px 0 0;color:var(--cr-dim);font-size:13px}
        .back-link{display:inline-flex;align-items:center;gap:6px;margin-bottom:22px;color:var(--cr-dim);font-size:12px;text-decoration:none}.back-link:hover{color:var(--cr-text)}
        .calculator-badge{display:flex;align-items:center;gap:8px;padding:10px 13px;border:1px solid var(--cr-border);border-radius:9px;background:var(--cr-surface);color:var(--cr-dim);font-size:12px}
        .calculator-body{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(260px,.7fr);gap:18px;padding:28px}
        .calculator-form-panel,.result-panel{border:1px solid var(--cr-border);border-radius:12px;background:var(--cr-surface)}.calculator-form-panel{padding:22px}
        .section-heading{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.section-heading h2{margin:6px 0 0;font-size:18px}.step-label{padding:6px 8px;border-radius:6px;background:#14191c;color:var(--cr-dim);font-size:10px}
        .calculator-fields{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:25px}.calculator-field{position:relative;display:grid;gap:7px;color:var(--cr-dim);font-size:12px}
        .field-control{display:flex;align-items:center;border:1px solid var(--cr-border);border-radius:8px;background:#14191c}.field-control:focus-within{border-color:var(--cr-accent)}
        .field-control input{width:100%;min-width:0;padding:11px 10px;border:0;outline:0;background:transparent;color:var(--cr-text);font-size:13px}.field-control input::placeholder{color:#5f696e}.field-control em{padding-right:10px;color:var(--cr-dim);font-size:11px;font-style:normal}
        .remove-field-button{position:absolute;top:-5px;right:-5px;display:grid;width:22px;height:22px;place-items:center;padding:0;border:1px solid var(--cr-border);border-radius:50%;background:#20282d;color:var(--cr-dim)}.remove-field-button:hover{border-color:#d77e7e;color:#d77e7e}
        .custom-field-builder{margin-top:24px;padding-top:18px;border-top:1px solid var(--cr-border)}.custom-field-controls{display:grid;grid-template-columns:minmax(0,1fr) 180px 130px auto;gap:8px;margin-top:9px}
        .custom-field-controls input,.custom-field-controls select{min-width:0;padding:10px;border:1px solid var(--cr-border);border-radius:8px;outline:0;background:#14191c;color:var(--cr-text);font-size:12px}.custom-field-controls input:focus,.custom-field-controls select:focus{border-color:var(--cr-accent)}
        .add-field-button{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:0 13px;border:1px solid var(--cr-accent);border-radius:8px;background:transparent;color:var(--cr-accent);font-size:12px;font-weight:600}.add-field-button:hover{background:rgba(79,157,184,.12)}
        .calculate-button{display:inline-flex;align-items:center;gap:7px;margin-top:24px;padding:11px 14px;border:0;border-radius:8px;background:var(--cr-accent);color:#10181b;font-size:12px;font-weight:700}.calculate-button:hover{background:#62aec7}
        .result-panel{display:flex;flex-direction:column;padding:22px;color:var(--cr-dim)}.result-panel>svg{margin-bottom:20px;color:var(--cr-accent)}.result-panel strong{margin-top:20px;color:var(--cr-text);font-size:26px}.result-panel>span{margin-top:4px;font-size:11px}.result-divider{height:1px;margin:22px 0 14px;background:var(--cr-border)}.result-row{display:flex;justify-content:space-between;padding:7px 0;font-size:12px}.result-row b{color:var(--cr-text);font-weight:500}.positive-result{color:#79bf91!important}.negative-result{color:#d77e7e!important}
        @media(max-width:900px){.calculator-body{grid-template-columns:1fr}.calculator-fields{grid-template-columns:1fr}.custom-field-controls{grid-template-columns:1fr}.add-field-button{min-height:38px}}
        @media(max-width:640px){.calculator-root .cr-header,.calculator-body{padding:18px}.calculator-form-panel,.result-panel{padding:18px}}
      `}</style>
      <section className="cr-root calculator-root">
        <header className="cr-header calculator-header">
          <div><Link className="back-link" href="/dashboard"><ArrowLeft size={15}/> Centrum Rentowności</Link><p className="cr-eyebrow">Kalkulator</p><h1 className="cr-title">{calculator.title}</h1><p className="cr-subtitle">{calculator.description}</p></div>
          <div className="calculator-badge"><Calculator size={19}/> Nowa analiza</div>
        </header>
        <div className="calculator-body">
          <div className="calculator-form-panel">
            <div className="section-heading"><div><p className="cr-eyebrow">Dane wejściowe</p><h2>Wartości dla kalkulatora</h2></div><span className="step-label">{fields.length} parametrów</span></div>
            <div className="calculator-fields">{fields.map((field)=><div className="calculator-field" key={field.key}><label htmlFor={field.key}>{field.label}</label><div className="field-control"><input id={field.key} type="text" inputMode="decimal" placeholder={field.placeholder} value={values[field.key]??""} onChange={(event)=>{setValues((current)=>({...current,[field.key]:event.target.value}));setHasCalculated(false)}}/><em>zł</em></div>{isCreator&&<button className="remove-field-button" type="button" onClick={()=>removeCustomField(field.key)} aria-label={`Usuń ${field.label}`}><Trash2 size={14}/></button>}</div>)}</div>
            {isCreator&&<div className="custom-field-builder"><p className="cr-eyebrow">Nowa rubryka</p><div className="custom-field-controls"><input value={newFieldLabel} onChange={(event)=>{setNewFieldLabel(event.target.value);setSelectedReusableRubric("")}} onKeyDown={(event)=>event.key==="Enter"&&addCustomField()} placeholder="Wpisz własną nazwę"/><select value={selectedReusableRubric} onChange={(event)=>selectReusableRubric(event.target.value)}><option value="">Wybierz gotową</option>{REUSABLE_RUBRICS.map((field)=><option value={field.label} key={field.label}>{field.label}</option>)}</select><select value={newFieldKind} onChange={(event)=>setNewFieldKind(event.target.value)}><option value="revenue">Przychód</option><option value="cost">Koszt</option></select><button className="add-field-button" type="button" onClick={addCustomField}><Plus size={15}/> Dodaj</button></div></div>}
            <button className="calculate-button" type="button" onClick={()=>setHasCalculated(true)}><Check size={16}/> Oblicz rentowność</button>
          </div>
          <aside className={`result-panel${hasCalculated?" result-ready":""}`}><CircleDollarSign size={22}/><p className="cr-eyebrow">Wynik analizy</p>{hasCalculated?<><strong>{money.format(analysis.profit)} zł</strong><span>{analysis.profit>=0?"Szacowany zysk":"Szacowana strata"}</span><div className="result-divider"/><div className="result-row"><span>Przychód</span><b>{money.format(analysis.revenue)} zł</b></div><div className="result-row"><span>Koszty</span><b>{money.format(analysis.costs)} zł</b></div><div className="result-row"><span>Marża</span><b>{money.format(analysis.margin)}%</b></div><div className="result-row"><span>Rentowność</span><b className={analysis.profit>=0?"positive-result":"negative-result"}>{analysis.revenue===0?"Brak danych":analysis.profit>=0?"Dodatnia":"Ujemna"}</b></div></>:<><strong>—</strong><span>Uzupełnij dane i kliknij „Oblicz rentowność”</span></>}</aside>
        </div>
      </section>
    </main>
  );
}
