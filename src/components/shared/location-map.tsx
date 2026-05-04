import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "#/components/ui/map";
import { MapPin } from "lucide-react";
import { useMemo } from "react";

type LocationMapProps = {
  coordinates: { lat: number; lon: number };
  eventTitle: string;
  eventLocation: string;
};

export default function LocationMap({ coordinates, eventTitle, eventLocation }: LocationMapProps) {
  const viewport = useMemo(
    () => ({ center: [coordinates.lon, coordinates.lat] as [number, number], zoom: 12 }),
    [coordinates.lat, coordinates.lon],
  );

  return (
    <Map
      viewport={viewport}
      styles={{
        light: "https://tiles.openfreemap.org/styles/bright",
        dark: "https://tiles.openfreemap.org/styles/bright",
      }}
      projection={{ type: "globe" }}
      className="min-h-96 w-full overflow-hidden rounded-2xl"
    >
      <MapMarker
        key={coordinates.lat + coordinates.lon}
        longitude={coordinates.lon}
        latitude={coordinates.lat}
      >
        <MarkerContent>
          <MapPin className="fill-primary animate-bounce stroke-white stroke-1" size={28} />
        </MarkerContent>

        <MarkerTooltip>
          {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
        </MarkerTooltip>

        <MarkerPopup>
          <div className="space-y-1">
            <p className="text-foreground font-medium">{eventTitle}</p>
            <p className="text-muted-foreground text-sm">{eventLocation}</p>
            <p className="text-muted-foreground text-xs">
              {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
            </p>
          </div>
        </MarkerPopup>
      </MapMarker>

      <MapControls />
    </Map>
  );
}
