"use client";

import { useMemo, useRef, useState } from "react";

type LocationPickerProps = {
  address: string;
  latitude: string;
  longitude: string;
};

export function LocationPicker({
  address,
  latitude,
  longitude,
}: LocationPickerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);

  const mapQuery = useMemo(() => {
    const coordinates = lat && lng ? `${lat},${lng}` : address;
    return encodeURIComponent(coordinates);
  }, [address, lat, lng]);

  return (
    <div className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
          Latitude
          <input
            className="field"
            name="business_latitude"
            value={lat}
            onChange={(event) => setLat(event.target.value)}
            placeholder="-17.8292"
          />
        </label>
        <label className="grid gap-1 text-xs font-semibold text-[var(--muted)]">
          Longitude
          <input
            className="field"
            name="business_longitude"
            value={lng}
            onChange={(event) => setLng(event.target.value)}
            placeholder="31.0127"
          />
        </label>
      </div>

      <button
        className="btn-secondary w-full text-sm sm:w-fit"
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        Open map modal
      </button>

      <dialog
        ref={dialogRef}
        className="w-[min(720px,calc(100vw-1.5rem))] rounded-2xl border border-[var(--border)] bg-white p-0 text-[var(--foreground)] shadow-2xl backdrop:bg-black/45"
      >
        <div className="border-b border-[var(--border)] p-4">
          <h3 className="text-base font-semibold">Select garage location</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
            Move around in Maps, confirm the actual garage spot, then paste the
            latitude and longitude above before saving.
          </p>
        </div>
        <iframe
          className="h-[380px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
          title="LuckyStar garage map"
        />
        <div className="flex flex-col gap-2 border-t border-[var(--border)] p-4 sm:flex-row sm:justify-between">
          <a
            className="btn-secondary text-center text-sm"
            href={`https://maps.google.com/?q=${mapQuery}`}
            rel="noreferrer"
            target="_blank"
          >
            Open in Google Maps
          </a>
          <button
            className="btn-primary text-sm"
            type="button"
            onClick={() => dialogRef.current?.close()}
          >
            Done
          </button>
        </div>
      </dialog>
    </div>
  );
}
