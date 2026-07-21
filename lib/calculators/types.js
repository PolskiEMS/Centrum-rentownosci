import { Factory, Globe2, Landmark, Route, Settings2, ShoppingCart, Store, Truck, Warehouse } from "lucide-react";

export const CALCULATOR_TYPES = [
  { id: "handel", name: "Rentowność handlu", description: "Zakup, sprzedaż, marża i koszty dodatkowe.", icon: ShoppingCart },
  { id: "dystrybucja", name: "Rentowność dystrybucji", description: "Zakup, sprzedaż, przewoźnik, magazyn, straty i reklamacje.", icon: Store },
  { id: "transport", name: "Rentowność transportu", description: "Paliwo, kierowca, flota, opłaty drogowe i trasa.", icon: Truck },
  { id: "spedycja", name: "Rentowność spedycji", description: "Cena usługi, faktura przewoźnika i pozostałe koszty.", icon: Route },
  { id: "import", name: "Rentowność importu", description: "Waluty, transport, cło i koszt końcowy.", icon: Landmark },
  { id: "eksport", name: "Rentowność eksportu", description: "Sprzedaż zagraniczna, kurs waluty i dokumenty.", icon: Globe2 },
  { id: "magazynowanie", name: "Rentowność magazynowania", description: "Palety, czas składowania, energia i obsługa.", icon: Warehouse },
  { id: "produkcja", name: "Rentowność produkcji", description: "Surowce, pracownicy, energia, odpady i koszt jednostkowy.", icon: Factory },
  { id: "kreator", name: "Kreator kalkulatora", description: "Własne pola, koszty, przychody i wzory.", icon: Settings2 },
];
