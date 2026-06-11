"use client";

import { useMemo, useState, useTransition } from "react";
import { createQuote, type QuoteResult } from "@/app/actions/quote";
import { WASTE_FACTOR, money } from "@/lib/format";
import { WhatsAppLink } from "@/components/site/WhatsAppButton";
import type { Dictionary } from "@/lib/dictionaries";

type FlooringType = {
  id: number;
  name: string;
  description: string;
  wearLayer: string;
  priceMin: number;
  priceMax: number;
  imageUrl: string;
};

type Extra = {
  id: number;
  name: string;
  pricePerUnit: number;
  unit: string;
};

type Room = { name: string; widthFt: string; lengthFt: string };

export function EstimateWizard({
  flooringTypes,
  extras,
  t,
}: {
  flooringTypes: FlooringType[];
  extras: Extra[];
  t: Dictionary["estimate"];
}) {
  const [step, setStep] = useState(0);
  const [floorId, setFloorId] = useState<number | null>(null);
  const [rooms, setRooms] = useState<Room[]>([
    { name: "", widthFt: "", lengthFt: "" },
  ]);
  const [selectedExtras, setSelectedExtras] = useState<Record<number, boolean>>({});
  const [linearFt, setLinearFt] = useState<Record<number, string>>({});
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    contactTime: "",
    smsConsent: false,
  });
  const [error, setError] = useState("");
  const [result, setResult] = useState<Extract<QuoteResult, { ok: true }> | null>(null);
  const [pending, startTransition] = useTransition();

  const floor = flooringTypes.find((f) => f.id === floorId) ?? null;

  const parsedRooms = useMemo(
    () =>
      rooms
        .map((r) => ({
          name: r.name.trim(),
          widthFt: parseFloat(r.widthFt),
          lengthFt: parseFloat(r.lengthFt),
        }))
        .filter((r) => r.name && r.widthFt > 0 && r.lengthFt > 0),
    [rooms]
  );

  const totalSqft = useMemo(
    () => parsedRooms.reduce((s, r) => s + r.widthFt * r.lengthFt, 0),
    [parsedRooms]
  );

  const extrasDetail = useMemo(() => {
    return extras
      .filter((ex) => selectedExtras[ex.id])
      .map((ex) => {
        const qty =
          ex.unit === "sqft"
            ? totalSqft
            : ex.unit === "flat"
              ? 1
              : parseFloat(linearFt[ex.id] ?? "0") || 0;
        return { ...ex, qty, subtotal: qty * ex.pricePerUnit };
      });
  }, [extras, selectedExtras, linearFt, totalSqft]);

  const extrasTotal = extrasDetail.reduce((s, e) => s + e.subtotal, 0);
  const areaWithWaste = totalSqft * WASTE_FACTOR;
  const estMin = floor ? areaWithWaste * floor.priceMin + extrasTotal : 0;
  const estMax = floor ? areaWithWaste * floor.priceMax + extrasTotal : 0;

  function next() {
    setError("");
    if (step === 0 && !floor) return setError(t.errFloor);
    if (step === 1 && parsedRooms.length === 0) return setError(t.errRooms);
    if (step === 2) {
      const missingLf = extrasDetail.find(
        (e) => e.unit === "linear_ft" && e.qty <= 0
      );
      if (missingLf) return setError(`${t.errLinearFt} "${missingLf.name}".`);
    }
    setStep((s) => Math.min(s + 1, t.steps.length - 1));
  }

  function back() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit() {
    setError("");
    if (!customer.name.trim() || customer.name.trim().length < 2)
      return setError(t.errName);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customer.email))
      return setError(t.errEmail);
    if (customer.phone.trim().length < 7) return setError(t.errPhone);
    if (customer.zip.trim().length < 3) return setError(t.errZip);

    startTransition(async () => {
      const res = await createQuote({
        flooringTypeId: floor!.id,
        rooms: parsedRooms.map((r) => ({
          name: r.name,
          widthFt: r.widthFt,
          lengthFt: r.lengthFt,
        })),
        extras: extrasDetail.map((e) => ({ extraId: e.id, quantity: e.qty })),
        customer,
      });
      if (res.ok) {
        setResult(res);
      } else {
        setError(res.error);
      }
    });
  }

  if (result) {
    return (
      <div className="rounded-xl border border-brand/10 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
          ✓
        </div>
        <h2 className="mt-4 text-2xl font-extrabold text-brand">
          {t.successTitle}
        </h2>
        <p className="mt-2 text-ink/70">
          {t.successNumber}{" "}
          <span className="font-bold text-brand">{result.quoteNumber}</span>
        </p>
        <div className="mx-auto mt-6 max-w-sm rounded-lg bg-cream p-5">
          <p className="text-sm text-ink/60">
            {t.successRange} {result.totalSqft.toFixed(0)} sq ft
          </p>
          <p className="mt-1 text-3xl font-extrabold text-brand">
            {money(result.estimateMin)} – {money(result.estimateMax)}
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-md text-sm text-ink/70">
          {t.successBody}
        </p>
        <div className="mt-6">
          <WhatsAppLink label={t.whatsappBtn} />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-brand/10 bg-white shadow-sm">
      {/* Step indicator */}
      <div className="flex border-b border-brand/10">
        {t.steps.map((label, i) => (
          <div
            key={label}
            className={`flex-1 px-2 py-3 text-center text-xs font-bold uppercase tracking-wide sm:text-sm ${
              i === step
                ? "border-b-2 border-accent text-brand"
                : i < step
                  ? "text-accent-dark"
                  : "text-ink/40"
            }`}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {/* STEP 1 — flooring type */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-extrabold text-brand">{t.chooseFloor}</h2>
            <p className="mt-1 text-sm text-ink/60">{t.pricesNote}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {flooringTypes.map((ft) => (
                <button
                  key={ft.id}
                  type="button"
                  onClick={() => setFloorId(ft.id)}
                  className={`overflow-hidden rounded-xl border-2 text-left transition ${
                    floorId === ft.id
                      ? "border-accent bg-accent/10"
                      : "border-brand/10 hover:border-accent/50"
                  }`}
                >
                  {ft.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ft.imageUrl}
                      alt={ft.name}
                      className="aspect-[3/1.4] w-full object-cover"
                    />
                  )}
                  <div className="p-5 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-brand">{ft.name}</h3>
                      {floorId === ft.id && (
                        <span className="text-accent-dark">●</span>
                      )}
                    </div>
                    <p className="text-xs font-semibold uppercase text-accent-dark">
                      {ft.wearLayer}
                    </p>
                    <p className="mt-2 text-sm text-ink/70">{ft.description}</p>
                    <p className="mt-3 font-extrabold text-brand">
                      ${ft.priceMin.toFixed(2)}–${ft.priceMax.toFixed(2)}
                      <span className="text-xs font-medium text-ink/50">
                        {" "}
                        /sq ft
                      </span>
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — rooms */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-extrabold text-brand">{t.addRooms}</h2>
            <p className="mt-1 text-sm text-ink/60">{t.roomsNote}</p>
            <div className="mt-5 space-y-3">
              {rooms.map((room, i) => {
                const w = parseFloat(room.widthFt);
                const l = parseFloat(room.lengthFt);
                const area = w > 0 && l > 0 ? w * l : 0;
                return (
                  <div
                    key={i}
                    className="grid grid-cols-12 items-center gap-2 rounded-lg border border-brand/10 bg-cream p-3"
                  >
                    <input
                      className="col-span-12 rounded-md border border-brand/20 bg-white px-3 py-2 text-sm sm:col-span-4"
                      placeholder={t.roomNamePlaceholder}
                      value={room.name}
                      onChange={(e) =>
                        setRooms(rooms.map((r, j) => (j === i ? { ...r, name: e.target.value } : r)))
                      }
                    />
                    <input
                      className="col-span-4 rounded-md border border-brand/20 bg-white px-3 py-2 text-sm sm:col-span-2"
                      placeholder={t.widthPlaceholder}
                      type="number"
                      min="0"
                      value={room.widthFt}
                      onChange={(e) =>
                        setRooms(rooms.map((r, j) => (j === i ? { ...r, widthFt: e.target.value } : r)))
                      }
                    />
                    <span className="col-span-1 text-center text-ink/40">×</span>
                    <input
                      className="col-span-4 rounded-md border border-brand/20 bg-white px-3 py-2 text-sm sm:col-span-2"
                      placeholder={t.lengthPlaceholder}
                      type="number"
                      min="0"
                      value={room.lengthFt}
                      onChange={(e) =>
                        setRooms(rooms.map((r, j) => (j === i ? { ...r, lengthFt: e.target.value } : r)))
                      }
                    />
                    <span className="col-span-2 text-right text-sm font-bold text-brand sm:col-span-2">
                      {area > 0 ? `${area.toFixed(0)} ft²` : "—"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRooms(rooms.filter((_, j) => j !== i))}
                      disabled={rooms.length === 1}
                      className="col-span-1 text-right text-ink/40 hover:text-red-600 disabled:opacity-30"
                      aria-label={t.removeRoom}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setRooms([...rooms, { name: "", widthFt: "", lengthFt: "" }])}
              className="mt-4 rounded-lg border-2 border-dashed border-brand/30 px-4 py-2 text-sm font-semibold text-brand hover:border-accent hover:text-accent-dark"
            >
              {t.addRoomBtn}
            </button>
            {totalSqft > 0 && (
              <p className="mt-4 text-right font-bold text-brand">
                {t.total}: {totalSqft.toFixed(0)} sq ft
              </p>
            )}
          </div>
        )}

        {/* STEP 3 — extras */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-extrabold text-brand">{t.extrasTitle}</h2>
            <p className="mt-1 text-sm text-ink/60">{t.extrasNote}</p>
            <div className="mt-5 space-y-3">
              {extras.map((ex) => (
                <label
                  key={ex.id}
                  className={`flex flex-wrap items-center gap-3 rounded-lg border-2 p-4 ${
                    selectedExtras[ex.id]
                      ? "border-accent bg-accent/10"
                      : "border-brand/10"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!selectedExtras[ex.id]}
                    onChange={(e) =>
                      setSelectedExtras({ ...selectedExtras, [ex.id]: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#3555e8]"
                  />
                  <span className="flex-1 text-sm font-semibold text-brand">
                    {ex.name}
                  </span>
                  <span className="text-sm text-ink/60">
                    ${ex.pricePerUnit.toFixed(2)}
                    {ex.unit === "sqft" && " /sq ft"}
                    {ex.unit === "linear_ft" && ` ${t.perLinearFt}`}
                    {ex.unit === "flat" && ` ${t.flat}`}
                  </span>
                  {ex.unit === "linear_ft" && selectedExtras[ex.id] && (
                    <input
                      type="number"
                      min="0"
                      placeholder={t.linearFtPlaceholder}
                      value={linearFt[ex.id] ?? ""}
                      onChange={(e) =>
                        setLinearFt({ ...linearFt, [ex.id]: e.target.value })
                      }
                      className="w-28 rounded-md border border-brand/20 bg-white px-3 py-1.5 text-sm"
                    />
                  )}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4 — review */}
        {step === 3 && floor && (
          <div>
            <h2 className="text-xl font-extrabold text-brand">{t.reviewTitle}</h2>
            <div className="mt-5 overflow-hidden rounded-lg border border-brand/10">
              <table className="w-full text-left text-sm">
                <tbody>
                  {parsedRooms.map((r, i) => (
                    <tr key={i} className="border-b border-brand/5">
                      <td className="px-4 py-2.5">{r.name}</td>
                      <td className="px-4 py-2.5 text-ink/60">
                        {r.widthFt} × {r.lengthFt} ft
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold">
                        {(r.widthFt * r.lengthFt).toFixed(0)} ft²
                      </td>
                    </tr>
                  ))}
                  <tr className="border-b border-brand/5 bg-cream">
                    <td className="px-4 py-2.5 font-semibold">{t.measuredArea}</td>
                    <td />
                    <td className="px-4 py-2.5 text-right font-bold">
                      {totalSqft.toFixed(0)} ft²
                    </td>
                  </tr>
                  <tr className="border-b border-brand/5">
                    <td className="px-4 py-2.5">{t.wasteMargin}</td>
                    <td />
                    <td className="px-4 py-2.5 text-right">
                      {areaWithWaste.toFixed(0)} ft²
                    </td>
                  </tr>
                  <tr className="border-b border-brand/5">
                    <td className="px-4 py-2.5">
                      {floor.name}{" "}
                      <span className="text-ink/50">
                        (${floor.priceMin.toFixed(2)}–${floor.priceMax.toFixed(2)}/ft²)
                      </span>
                    </td>
                    <td />
                    <td className="px-4 py-2.5 text-right">
                      {money(areaWithWaste * floor.priceMin)} –{" "}
                      {money(areaWithWaste * floor.priceMax)}
                    </td>
                  </tr>
                  {extrasDetail.map((e) => (
                    <tr key={e.id} className="border-b border-brand/5">
                      <td className="px-4 py-2.5">{e.name}</td>
                      <td className="px-4 py-2.5 text-ink/60">
                        {e.unit === "flat"
                          ? ""
                          : `${e.qty.toFixed(0)} ${e.unit === "sqft" ? "ft²" : "lf"}`}
                      </td>
                      <td className="px-4 py-2.5 text-right">{money(e.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between bg-brand px-4 py-4 text-white">
                <span className="font-bold">{t.estimatedTotal}</span>
                <span className="text-xl font-extrabold text-accent-light">
                  {money(estMin)} – {money(estMax)}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink/50">{t.disclaimer}</p>
          </div>
        )}

        {/* STEP 5 — contact */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-extrabold text-brand">
              {t.contactTitle}
            </h2>
            <p className="mt-1 text-sm text-ink/60">{t.contactNote}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <input
                className="rounded-md border border-brand/20 bg-white px-3 py-2.5 text-sm"
                placeholder={t.fullName}
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
              <input
                className="rounded-md border border-brand/20 bg-white px-3 py-2.5 text-sm"
                placeholder={t.emailField}
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              />
              <input
                className="rounded-md border border-brand/20 bg-white px-3 py-2.5 text-sm"
                placeholder={t.phoneField}
                type="tel"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />
              <input
                className="rounded-md border border-brand/20 bg-white px-3 py-2.5 text-sm"
                placeholder={t.zipField}
                value={customer.zip}
                onChange={(e) => setCustomer({ ...customer, zip: e.target.value })}
              />
              <select
                className="rounded-md border border-brand/20 bg-white px-3 py-2.5 text-sm sm:col-span-2"
                value={customer.contactTime}
                onChange={(e) =>
                  setCustomer({ ...customer, contactTime: e.target.value })
                }
              >
                <option value="">{t.bestTime}</option>
                <option value="Morning">{t.morning}</option>
                <option value="Afternoon">{t.afternoon}</option>
                <option value="Evening">{t.evening}</option>
              </select>
              <label className="flex items-start gap-2 text-xs text-ink/60 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={customer.smsConsent}
                  onChange={(e) =>
                    setCustomer({ ...customer, smsConsent: e.target.checked })
                  }
                  className="mt-0.5 h-4 w-4 accent-[#3555e8]"
                />
                {t.smsConsent}
              </label>
            </div>
            <div className="mt-5 rounded-lg bg-cream p-4 text-center">
              <span className="text-sm text-ink/60">{t.yourTotal} </span>
              <span className="font-extrabold text-brand">
                {money(estMin)} – {money(estMax)}
              </span>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={back}
            disabled={step === 0}
            className="rounded-lg border border-brand/20 px-5 py-2.5 text-sm font-semibold text-brand disabled:opacity-30"
          >
            {t.back}
          </button>
          {step < t.steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-accent-dark"
            >
              {t.next}
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-white hover:bg-accent-dark disabled:opacity-60"
            >
              {pending ? t.sending : t.submit}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
