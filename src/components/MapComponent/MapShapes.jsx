import { Polygon, Rectangle } from '@react-google-maps/api';

export function MapShapes({ ubicaciones, onShapeEdit }) {
  return (
    <>
      {ubicaciones.map((intf) => {
        if (intf.forma?.tipo === 'polygon' && Array.isArray(intf.forma.path) && intf.forma.path.length > 0) {
          return (
            <Polygon
              key={`poly-${intf.id}`}
              paths={Array.isArray(intf.forma.path) ? intf.forma.path : []}
              editable
              draggable
              options={{ fillColor: intf.color, strokeColor: intf.color, strokeWeight: 2, fillOpacity: 0.2, }}
              onMouseUp={(e) => {
                const poly = e.overlay || e;
                if (!poly.getPath) return;
                const pathArr = poly.getPath().getArray().map((latLng) => ({ lat: latLng.lat(), lng: latLng.lng(), }));
                onShapeEdit(intf.id, pathArr);
              }}
            />
          );
        }

        // if (intf.forma?.tipo === 'rectangle' && intf.forma.bounds) {
        //   return (
        //     <Rectangle
        //       key={`rect-${intf.id}`}
        //       bounds={intf.forma.bounds}
        //       editable
        //       draggable
        //       options={{ fillColor: intf.color, strokeColor: intf.color, strokeWeight: 2, fillOpacity: 0.2, }}
        //       onBoundsChanged={(ref) => {
        //         const bounds = ref.getBounds();
        //         if (!bounds) return;
        //         onShapeEdit(intf.id, {
        //           north: bounds.getNorthEast().lat(),
        //           east: bounds.getNorthEast().lng(),
        //           south: bounds.getSouthWest().lat(),
        //           west: bounds.getSouthWest().lng(),
        //         });
        //       }}
        //     />
        //   );
        // }

        return null;
      })}
    </>
  );
}