"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calculator, Check, CircleDollarSign, Plus, Trash2 } from "lucide-react";
import { CALCULATOR_DEFINITIONS, INPUT_FIELDS, REUSABLE_RUBRICS } from "../../lib/calculators/definitions";

const money = new Intl.NumberFormat("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function parseValue(value) {
  return Number(String(value || "").replace(/\s/g, "").replace(",", ".")) || 0;
}

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
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    return { revenue, costs, profit, margin };
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
    setValues((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
    setHasCalculated(false);
  }

  return (
    <main className="app-shell">
      <section className="cr-root calculator-root">
        <header className="cr-header calculator-header">
          <div>
            <Link className="back-link" href="/dashboard"><ArrowLeft size={15} /> Centrum Rentowności</Link>
            <p className="cr-eyebrow">Kalkulator</p>
            <h1 className="cr-title">{calculator.title}</h1>
            <p className="cr-subtitle">{calculator.description}</p>
          </div>
          <div className="calculator-badge"><Calculator size={19} /> Nowa analiza</div>
        </header>

        <div className="calculator-body">
          <div className="calculator-form-panel">
            <div className="section-heading">
              <div><p className="cr-eyebrow">Dane wejściowe</p><h2>Wartości dla kalkulatora</h2></div>
              <span className="step-label">{fields.length} parametrów</span>
            </div>

            <div className="calculator-fields">
              {fields.map((field) => (
                <div className="calculator-field" key={field.key}>
                  <label htmlFor={field.key}>{field.label}</label>
                  <div className="field-control">
                    <input id={field.key} type="text" inputMode="decimal" placeholder={field.placeholder} value={values[field.key] ?? ""} onChange={(event) => { setValues((current) => ({ ...current, [field.key]: event.target.value })); setHasCalculated(false); }} />
                    <em>zł</em>
                  </div>
                  {isCreator && <button className="remove-field-button" type="button" onClick={() => removeCustomField(field.key)} aria-label={`Usuń ${field.label}`}><Trash2 size={14} /></button>}
                </div>
              ))}
            </div>

            {isCreator && (
              <div className="custom-field-builder">
                <p className="cr-eyebrow">Nowa rubryka</p>
                <div className="custom-field-controls">
                  <input value={newFieldLabel} onChange={(event) => { setNewFieldLabel(event.target.value); setSelectedReusableRubric(""); }} onKeyDown={(event) => event.key === "Enter" && addCustomField()} placeholder="Wpisz własną nazwę" />
                  <select value={selectedReusableRubric} onChange={(event) => selectReusableRubric(event.target.value)}><option value="">Wybierz gotową</option>{REUSABLE_RUBRICS.map((field) => <option value={field.label} key={field.label}>{field.label}</option>)}</select>
                  <select value={newFieldKind} onChange={(event) => setNewFieldKind(event.target.value)}><option value="revenue">Przychód</option><option value="cost">Koszt</option></select>
                  <button className="add-field-button" type="button" onClick={addCustomField}><Plus size={15} /> Dodaj</button>
                </div>
              </div>
            )}

            <button className="calculate-button" type="button" onClick={() => setHasCalculated(true)}><Check size={16} /> Oblicz rentowność</button>
          </div>

          <aside className={`result-panel${hasCalculated ? " result-ready" : ""}`}>
            <CircleDollarSign size={22} />
            <p className="cr-eyebrow">Wynik analizy</p>
            {hasCalculated ? <>
              <strong>{money.format(analysis.profit)} zł</strong>
              <span>{analysis.profit >= 0 ? "Szacowany zysk" : "Szacowana strata"}</span>
              <div className="result-divider" />
              <div className="result-row"><span>Przychód</span><b>{money.format(analysis.revenue)} zł</b></div>
              <div className="result-row"><span>Koszty</span><b>{money.format(analysis.costs)} zł</b></div>
              <div className="result-row"><span>Marża</span><b>{money.format(analysis.margin)}%</b></div>
              <div className="result-row"><span>Rentowność</span><b className={analysis.profit >= 0 ? "positive-result" : "negative-result"}>{analysis.revenue === 0 ? "Brak danych" : analysis.profit >= 0 ? "Dodatnia" : "Ujemna"}</b></div>
            </> : <><strong>—</strong><span>Uzupełnij dane i kliknij „Oblicz rentowność”</span></>}
          </aside>
        </div>
      </section>
    </main>
  );
}
