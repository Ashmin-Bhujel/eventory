import { Map, MapControls } from "#/components/ui/map";
import { useCallback, useMemo } from "react";

type LocationMapProps = {
  coordinates: { lat: number; lon: number };
};

export default function LocationMap({ coordinates }: LocationMapProps) {
  const viewport = useMemo(
    () => ({ center: [coordinates.lon, coordinates.lat] as [number, number], zoom: 15 }),
    [coordinates.lat, coordinates.lon],
  );
  const handleViewportChange = useCallback(() => {}, []);

  return (
    <Map
      viewport={viewport}
      onViewportChange={handleViewportChange}
      styles={{
        light: "https://tiles.openfreemap.org/styles/bright",
        dark: "https://tiles.openfreemap.org/styles/bright",
      }}
      className="min-h-96 w-full overflow-hidden rounded-2xl"
    >
      <MapControls />
    </Map>
  );
}
