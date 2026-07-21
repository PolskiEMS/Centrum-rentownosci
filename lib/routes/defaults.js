export const createEmptyStop = () => ({
  id: `stop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  type: "dostawa",
  place: "",
  pallets: 0,
  weightKg: 0,
});

export const createEmptyRoute = () => ({
  id: `route-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: "",
  startPlace: "",
  destinationCountry: "",
  carrier: "",
  loadingDate: "",
  deliveryDate: "",
  distanceKm: 0,
  cargoType: "",
  temperature: "",
  cargoValue: 0,
  status: "szkic",
  stops: [createEmptyStop()],
});
