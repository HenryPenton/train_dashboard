"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useConfigStore } from "../providers/config";
import { ConfigItem, buildConfigItems } from "../utils/groupAndSortItems";
import EinkDepartures from "../components/eink/EinkDepartures";
import EinkArrivals from "../components/eink/EinkArrivals";
import EinkBestRoute from "../components/eink/EinkBestRoute";
import EinkLineStatus from "../components/eink/EinkLineStatus";
import { EinkMessage } from "../components/eink/EinkSection";

const MIN_EINK_REFRESH_SECONDS = 60;

function renderItem(configItem: ConfigItem, key: string) {
  switch (configItem.type) {
    case "rail_departure":
      return (
        <EinkDepartures
          key={key}
          fromStation={{
            stationCode: configItem.item.originCode,
            stationName: configItem.item.origin,
          }}
          toStation={{
            stationCode: configItem.item.destinationCode,
            stationName: configItem.item.destination,
          }}
        />
      );
    case "tfl_best_route":
      return (
        <EinkBestRoute
          key={key}
          from={{
            placeName: configItem.item.origin,
            naptanOrAtco: configItem.item.originNaPTANOrATCO,
          }}
          to={{
            placeName: configItem.item.destination,
            naptanOrAtco: configItem.item.destinationNaPTANOrATCO,
          }}
        />
      );
    case "tube_departure":
      return (
        <EinkArrivals
          key={key}
          stationId={configItem.item.stationId}
          stationName={configItem.item.stationName}
        />
      );
    case "tfl_line_status":
      return <EinkLineStatus key={key} />;
    default:
      return null;
  }
}

export default function EinkPage() {
  const { config, fetchConfig, lastRefreshTimeStamp } = useConfigStore(
    (state) => state,
  );
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchConfig().finally(() => {
      if (mounted) setConfigLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [fetchConfig]);

  const refreshSeconds = Math.max(
    MIN_EINK_REFRESH_SECONDS,
    config?.refresh_timer ?? MIN_EINK_REFRESH_SECONDS,
  );

  // A full page reload gives the e-ink panel a clean redraw, so use it
  // instead of re-rendering cards in place.
  useEffect(() => {
    if (configLoading) return;
    const timer = setTimeout(() => window.location.reload(), refreshSeconds * 1000);
    return () => clearTimeout(timer);
  }, [configLoading, refreshSeconds]);

  const items = buildConfigItems(config).sort(
    (a, b) => a.importance - b.importance,
  );

  const updated = lastRefreshTimeStamp
    ? new Date(lastRefreshTimeStamp).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <main>
      {!configLoading && (
        <meta httpEquiv="refresh" content={String(refreshSeconds)} />
      )}
      <h1 className="eink-title">Train &amp; Tube Status</h1>

      {configLoading && <EinkMessage>Loading configuration...</EinkMessage>}
      {!configLoading && items.length === 0 && (
        <EinkMessage>
          Nothing configured yet. Add routes in Settings.
        </EinkMessage>
      )}
      {!configLoading &&
        items.map((item, i) => renderItem(item, `item-${i}`))}

      <p className="eink-footer">
        {updated && <>Updated {updated}. </>}
        Refreshes every {refreshSeconds}s. <Link href="/">Standard view</Link>
      </p>
    </main>
  );
}
