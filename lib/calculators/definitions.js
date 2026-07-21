import { Earth, Factory, Landmark, Route, Settings2, ShoppingCart, Store, Truck, Warehouse } from "lucide-react";

export const CALCULATOR_DEFINITIONS = [
  { slug: "handel", title: "Rentowność handlu", description: "Zakup, sprzedaż, marża i koszty dodatkowe.", icon: ShoppingCart },
  { slug: "dystrybucja", title: "Rentowność dystrybucji", description: "Zakup, sprzedaż, przewoźnik, magazyn, straty i reklamacje.", icon: Store },
  { slug: "transport", title: "Rentowność transportu", description: "Paliwo, kierowca, flota, opłaty drogowe i trasa.", icon: Truck },
  { slug: "spedycja", title: "Rentowność spedycji", description: "Cena usługi, faktura przewoźnika i pozostałe koszty.", icon: Route },
  { slug: "import", title: "Rentowność importu", description: "Waluty, transport, cło i koszt końcowy.", icon: Landmark },
  { slug: "eksport", title: "Rentowność eksportu", description: "Sprzedaż zagraniczna, kurs waluty i dokumenty.", icon: Earth },
  { slug: "magazynowanie", title: "Rentowność magazynowania", description: "Palety, czas składowania, energia i obsługa.", icon: Warehouse },
  { slug: "produkcja", title: "Rentowność produkcji", description: "Surowce, pracownicy, energia, odpady i koszt jednostkowy.", icon: Factory },
  { slug: "kreator", title: "Kreator kalkulatora", description: "Własne pola, koszty, przychody i wzory.", icon: Settings2 },
];

export const INPUT_FIELDS = {
  handel: [
    { key: "sales", label: "Wartość sprzedaży", placeholder: "np. 18 500", kind: "revenue" },
    { key: "purchase", label: "Koszt zakupu towaru", placeholder: "np. 12 000", kind: "cost" },
    { key: "additional", label: "Koszty dodatkowe", placeholder: "np. 650", kind: "cost" },
    { key: "discounts", label: "Rabaty i prowizje", placeholder: "np. 250", kind: "cost" },
  ],
  dystrybucja: [
    { key: "sales", label: "Wartość sprzedaży", placeholder: "np. 42 000", kind: "revenue" },
    { key: "purchase", label: "Koszt zakupu", placeholder: "np. 25 000", kind: "cost" },
    { key: "carrier", label: "Koszt przewoźnika", placeholder: "np. 3 200", kind: "cost" },
    { key: "warehouse", label: "Magazyn i obsługa", placeholder: "np. 1 100", kind: "cost" },
    { key: "claims", label: "Straty i reklamacje", placeholder: "np. 400", kind: "cost" },
  ],
  transport: [
    { key: "freight", label: "Przychód z trasy", placeholder: "np. 8 500", kind: "revenue" },
    { key: "fuel", label: "Paliwo", placeholder: "np. 2 100", kind: "cost" },
    { key: "driver", label: "Koszt kierowcy", placeholder: "np. 1 800", kind: "cost" },
    { key: "tolls", label: "Opłaty drogowe", placeholder: "np. 450", kind: "cost" },
    { key: "fleet", label: "Flota i serwis", placeholder: "np. 600", kind: "cost" },
  ],
  spedycja: [
    { key: "service", label: "Cena usługi", placeholder: "np. 6 800", kind: "revenue" },
    { key: "carrier", label: "Faktura przewoźnika", placeholder: "np. 4 900", kind: "cost" },
    { key: "commission", label: "Prowizja spedytora", placeholder: "np. 350", kind: "cost" },
    { key: "other", label: "Pozostałe koszty", placeholder: "np. 200", kind: "cost" },
  ],
  import: [
    { key: "sales", label: "Wartość towaru", placeholder: "np. 35 000", kind: "revenue" },
    { key: "purchase", label: "Zakup w walucie", placeholder: "np. 21 000", kind: "cost" },
    { key: "transport", label: "Transport zagraniczny", placeholder: "np. 2 800", kind: "cost" },
    { key: "duty", label: "Cło i podatki", placeholder: "np. 1 900", kind: "cost" },
    { key: "insurance", label: "Ubezpieczenie", placeholder: "np. 300", kind: "cost" },
  ],
  eksport: [
    { key: "sales", label: "Sprzedaż zagraniczna", placeholder: "np. 48 000", kind: "revenue" },
    { key: "purchase", label: "Koszt towaru", placeholder: "np. 29 000", kind: "cost" },
    { key: "transport", label: "Transport i dostawa", placeholder: "np. 3 500", kind: "cost" },
    { key: "documents", label: "Dokumenty i odprawa", placeholder: "np. 450", kind: "cost" },
    { key: "currency", label: "Koszt przewalutowania", placeholder: "np. 280", kind: "cost" },
  ],
  magazynowanie: [
    { key: "revenue", label: "Przychód z magazynowania", placeholder: "np. 14 000", kind: "revenue" },
    { key: "palettes", label: "Palety i składowanie", placeholder: "np. 3 200", kind: "cost" },
    { key: "time", label: "Czas obsługi", placeholder: "np. 1 900", kind: "cost" },
    { key: "energy", label: "Energia", placeholder: "np. 850", kind: "cost" },
    { key: "service", label: "Obsługa magazynu", placeholder: "np. 2 100", kind: "cost" },
  ],
  produkcja: [
    { key: "sales", label: "Wartość sprzedaży", placeholder: "np. 60 000", kind: "revenue" },
    { key: "materials", label: "Surowce", placeholder: "np. 26 000", kind: "cost" },
    { key: "employees", label: "Pracownicy", placeholder: "np. 12 000", kind: "cost" },
    { key: "energy", label: "Energia i media", placeholder: "np. 3 800", kind: "cost" },
    { key: "waste", label: "Odpady i straty", placeholder: "np. 900", kind: "cost" },
  ],
  kreator: [
    { key: "revenue", label: "Przychody", placeholder: "np. 25 000", kind: "revenue" },
    { key: "fixed", label: "Koszty stałe", placeholder: "np. 5 000", kind: "cost" },
    { key: "variable", label: "Koszty zmienne", placeholder: "np. 8 000", kind: "cost" },
    { key: "other", label: "Pozostałe koszty", placeholder: "np. 500", kind: "cost" },
  ],
};

export const REUSABLE_RUBRICS = Array.from(new Map(Object.values(INPUT_FIELDS).flat().map((field) => [field.label, field])).values());
