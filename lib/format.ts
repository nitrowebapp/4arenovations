export function money(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function moneyExact(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export const QUOTE_STATUSES = ["NEW", "CONTACTED", "SCHEDULED", "CLOSED", "LOST"] as const;

export const STATUS_LABELS: Record<string, string> = {
  NEW: "Novo",
  CONTACTED: "Contatado",
  SCHEDULED: "Visita agendada",
  CLOSED: "Fechado",
  LOST: "Perdido",
};

export const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  CONTACTED: "bg-yellow-100 text-yellow-800",
  SCHEDULED: "bg-purple-100 text-purple-800",
  CLOSED: "bg-green-100 text-green-800",
  LOST: "bg-gray-200 text-gray-600",
};

export const UNIT_LABELS: Record<string, string> = {
  sqft: "/ sq ft",
  linear_ft: "/ linear ft",
  flat: "flat rate",
};

/** Waste/cut margin applied to measured area */
export const WASTE_FACTOR = 1.1;
