"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MarketRegion,
  REGIONS,
  REGION_LABEL,
  getRegionCookie,
  setRegionCookie,
} from "@/app/lib/market";

export default function RegionSelector({ initialRegion }: { initialRegion: MarketRegion }) {
  const [region, setRegion] = useState<MarketRegion>(initialRegion);
  const router = useRouter();

  useEffect(() => {
    const cookieRegion = getRegionCookie();
    if (cookieRegion) setRegion(cookieRegion);
  }, []);

  const handleSelect = (next: MarketRegion) => {
    if (next === region) return;
    setRegionCookie(next);
    setRegion(next);
    router.refresh();
  };

  return (
    <ul>
      {REGIONS.map((r) => (
        <li key={r}>
          <button
            type="button"
            onClick={() => handleSelect(r)}
            className={region === r ? "underline" : ""}
          >
            {REGION_LABEL[r]}
          </button>
        </li>
      ))}
    </ul>
  );
}
