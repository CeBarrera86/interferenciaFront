import { Polygon } from '@react-google-maps/api';

export function MapShapes({ ubicaciones }) {
  return (
    <>
      {ubicaciones.map((intf) => {
        const esPoligonoValido =
          intf.forma?.tipo === 'polygon' &&
          Array.isArray(intf.forma.path) &&
          intf.forma.path.length > 0;

        if (!esPoligonoValido) return null;

        return (
          <Polygon
            key={`poly-${intf.id}`}
            paths={intf.forma.path.map((p) => ({ lat: p.lat, lng: p.lng }))}
            options={{
              fillColor: intf.color,
              strokeColor: intf.color,
              strokeWeight: 2,
              fillOpacity: 0.2,
            }}
          />
        );
      })}
    </>
  );
}