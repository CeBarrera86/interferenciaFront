// src/components/InterferenciasForm.jsx

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Import sub-components
import FormSolicitante from './FormInterferencia/FormSolicitante';
import FormUbicacion from './FormInterferencia/FormUbicacion';
import FormFechas from './FormInterferencia/FormFechas';
import FormBotones from './FormInterferencia/FormBotones';
import MapComponent from './MapComponent/MapComponent';

// Import custom hooks
import { useLocalidades } from '../hooks/useLocalidades'; // Adjust path
import { useInterferenciaForm } from '../hooks/useInterferenciaForm'; // Adjust path

export default function InterferenciasForm() {
  // Use the custom hooks
  const { localidades, loadingLocalidades, errorLocalidades } = useLocalidades();
  const {
    control,
    handleSubmit,
    errors,
    currentLat,
    currentLng,
    existingAdjunto,
    mapScreenshotData,
    openMapPreview,
    activeAttachmentType,
    handleMapScreenshot,
    handleFormUbicacionFileChange,
    handleCloseMapPreview,
    handleMapClick,
    clearAttachment,
    onSubmit, // Get onSubmit from the hook
  } = useInterferenciaForm();

  if (loadingLocalidades) return <div>Cargando localidades...</div>;
  if (errorLocalidades) return <div>Error al cargar localidades: {errorLocalidades.message}</div>;

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', }} >
        {/* Primer Panel: Formulario de Interferencia */}
        <Box sx={{ flex: '1 1 500px' }}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Registrar Nueva Interferencia</Typography>
            {/* The onSubmit function is now directly from the hook */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormSolicitante control={control} errors={errors} />
              <FormUbicacion
                control={control}
                errors={errors}
                localidades={localidades}
                onFileChange={handleFormUbicacionFileChange}
                isFileUploadDisabled={activeAttachmentType === 'map'}
                mapScreenshotActive={activeAttachmentType === 'map'}
                currentAdjunto={existingAdjunto}
                onClearAttachment={clearAttachment}
              />
              <FormFechas control={control} errors={errors} />
              {/* FormBotones will now simply trigger the handleSubmit from react-hook-form */}
              <FormBotones />
            </form>
          </Paper>
        </Box>

        {/* Segundo Panel: Zona de Interferencia */}
        <Box sx={{ flex: '1 1 500px' }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Zona de Interferencia</Typography>
            <MapComponent
              center={{ lat: currentLat, lng: currentLng }}
              zoom={13}
              onMapClick={handleMapClick}
              markerPosition={{ lat: currentLat, lng: currentLng }}
              onMapScreenshot={handleMapScreenshot}
              disableCaptureButton={activeAttachmentType === 'file'}
            />
          </Paper>
        </Box>
      </Box>

      {/* Map Preview Dialog */}
      <Dialog open={openMapPreview} onClose={handleCloseMapPreview} maxWidth="md" fullWidth >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Vista Previa del Mapa Capturado</Typography>
            <IconButton edge="end" color="inherit" onClick={handleCloseMapPreview} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {mapScreenshotData ? (
            <img src={mapScreenshotData} alt="Mapa Capturado"
              style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
          ) : (
            <Typography>No hay imagen de mapa para previsualizar.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

// import React, { useState, useEffect, useCallback } from 'react';
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { interferenciasSchema } from '../validation/interferenciasSchema';
// import {
//   Box,
//   Paper,
//   Typography,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import FormSolicitante from './FormInterferencia/FormSolicitante';
// import FormUbicacion from './FormInterferencia/FormUbicacion';
// import FormFechas from './FormInterferencia/FormFechas';
// import FormBotones from './FormInterferencia/FormBotones';
// import MapComponent from './MapComponent/MapComponent';

// export default function InterferenciasForm() {
//   const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
//     resolver: yupResolver(interferenciasSchema),
//     defaultValues: {
//       SOI_CUIT: '',
//       SOI_NOMBRE: '',
//       SOI_APELLIDO: '',
//       SOI_PERSONA: 'F',
//       SOI_EMAIL: '',
//       SOI_CALLE: '',
//       SOI_ALTURA: '',
//       SOI_PISO: '',
//       SOI_DPTO: '',
//       SOI_VEREDA: 'P',
//       SOI_ENTRE1: '',
//       SOI_ENTRE2: '',
//       SOI_LOCALIDAD_ID: '',
//       SOI_LATITUD: -35.65867,
//       SOI_LONGITUD: -63.75715,
//       SOI_DESDE: null,
//       SOI_HASTA: null,
//       SOI_ADJUNTO: null,
//     },
//   });

//   const currentLat = watch('SOI_LATITUD');
//   const currentLng = watch('SOI_LONGITUD');
//   const existingAdjunto = watch('SOI_ADJUNTO');
//   const [localidades, setLocalidades] = useState([]);
//   const [mapScreenshotData, setMapScreenshotData] = useState(null);
//   const [openMapPreview, setOpenMapPreview] = useState(false);
//   // Estado para controlar qué opción de adjunto está activa. 'file': adjunto de archivo tradicional, 'map': captura de mapa, null: ninguno
//   const [activeAttachmentType, setActiveAttachmentType] = useState(null);


//   // useEffect(() => {
//   //   setLocalidades([
//   //     { id: 10041, nombre: 'GENERAL PICO' },
//   //     { id: 10341, nombre: 'SPELUZZI' },
//   //     { id: 10349, nombre: 'TREBOLARES' },
//   //     { id: 10366, nombre: 'VERTIZ' },
//   //   ]);
//   // }, []);

//   useEffect(() => {
//     const fetchLocalidades = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/api/localidades');
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         const formattedLocalidades = data.map(loc => ({ id: loc.LOC_ID, nombre: loc.LOC_DESCRIPCION }));
//         setLocalidades(formattedLocalidades);
//       } catch (error) {
//         console.error("Error fetching localidades:", error);
//         setLocalidades([]);
//       }
//     };
//     fetchLocalidades();
//   }, []);

//   // Efecto para sincronizar activeAttachmentType con existingAdjunto
//   useEffect(() => {
//     if (existingAdjunto) {
//       if (existingAdjunto.name && existingAdjunto.name.startsWith('map_screenshot')) {
//         setActiveAttachmentType('map');
//       } else {
//         setActiveAttachmentType('file');
//       }
//     } else {
//       setActiveAttachmentType(null);
//     }
//   }, [existingAdjunto]);

//   const handleMapScreenshot = useCallback((imageDataUrl) => {
//     console.log('Captura del mapa recibida en InterferenciasForm.');
//     setMapScreenshotData(imageDataUrl);

//     // Convertir la imagen Base64 a Blob/File
//     const byteString = atob(imageDataUrl.split(',')[1]);
//     const mimeString = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];
//     const ab = new ArrayBuffer(byteString.length);
//     const ia = new Uint8Array(ab);
//     for (let i = 0; i < byteString.length; i++) {
//       ia[i] = byteString.charCodeAt(i);
//     }
//     const blob = new Blob([ab], { type: mimeString });
//     const file = new File([blob], 'map_screenshot.png', { type: mimeString });

//     setValue('SOI_ADJUNTO', file, { shouldDirty: true });
//     setOpenMapPreview(true);
//   }, [setValue]);

//   const handleFormUbicacionFileChange = useCallback((file) => {
//     setValue('SOI_ADJUNTO', file, { shouldDirty: true });
//     setMapScreenshotData(null);
//   }, [setValue]);

//   const handleCloseMapPreview = useCallback(() => {
//     setOpenMapPreview(false);
//   }, []);

//   const onSubmit = async (data) => {
//     console.log('Datos a enviar:', data);

//     const formData = new FormData();
//     for (const key in data) {
//       if (data.hasOwnProperty(key)) {
//         if (data[key] instanceof Date) {
//           formData.append(key, data[key].toISOString());
//         } else if (data[key] instanceof File) {
//           formData.append(key, data[key], data[key].name);
//         } else {
//           formData.append(key, data[key]);
//         }
//       }
//     }

//     try {
//       const response = await fetch('http://localhost:3000/api/interferencia/store', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('Error al enviar el formulario:', response.status, errorData);
//         alert(`Error al guardar: ${errorData.message || 'Error desconocido'}`);
//       } else {
//         const result = await response.json();
//         console.log('Formulario enviado con éxito:', result);
//         alert('Formulario enviado con éxito!');
//         // Opcional: Resetear el formulario después de un envío exitoso
//         // reset();
//       }
//     } catch (error) {
//       console.error('Error de red o en la petición:', error);
//       alert('Error de conexión o en la petición. Intente nuevamente.');
//     }
//   };

//   const handleMapClick = useCallback((lat, lng) => {
//     setValue('SOI_LATITUD', lat);
//     setValue('SOI_LONGITUD', lng);
//   }, [setValue]);

//   // Función para limpiar el adjunto
//   const clearAttachment = useCallback(() => {
//     setValue('SOI_ADJUNTO', null, { shouldDirty: true });
//     setMapScreenshotData(null);
//   }, [setValue]);

//   return (
//     <Box sx={{ p: 2 }}>
//       <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', }} >
//         <Box sx={{ flex: '1 1 500px' }}>
//           <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
//             <Typography variant="h6">Registrar Nueva Interferencia</Typography>
//             <form onSubmit={handleSubmit(onSubmit)}>
//               <FormSolicitante control={control} errors={errors} />
//               <FormUbicacion control={control} errors={errors} localidades={localidades}
//                 onFileChange={handleFormUbicacionFileChange}
//                 isFileUploadDisabled={activeAttachmentType === 'map'}
//                 mapScreenshotActive={activeAttachmentType === 'map'}
//                 currentAdjunto={existingAdjunto}
//                 onClearAttachment={clearAttachment} />
//               <FormFechas control={control} errors={errors} />
//               <FormBotones onSubmit={handleSubmit(onSubmit)} />
//             </form>
//           </Paper>
//         </Box>
//         {/* Segundo Panel: Zona de Interferencia */}
//         <Box sx={{ flex: '1 1 500px' }}>
//           <Paper elevation={3} sx={{ p: 2 }}>
//             <Typography variant="h6">Zona de Interferencia</Typography>
//             <MapComponent center={{ lat: currentLat, lng: currentLng }} zoom={13}
//               onMapClick={handleMapClick}
//               markerPosition={{ lat: currentLat, lng: currentLng }}
//               onMapScreenshot={handleMapScreenshot}
//               disableCaptureButton={activeAttachmentType === 'file'}
//             />
//           </Paper>
//         </Box>
//       </Box>

//       <Dialog open={openMapPreview} onClose={handleCloseMapPreview} maxWidth="md" fullWidth >
//         <DialogTitle>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <Typography variant="h6">Vista Previa del Mapa Capturado</Typography>
//             <IconButton edge="end" color="inherit" onClick={handleCloseMapPreview} aria-label="close">
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent dividers>
//           {mapScreenshotData ? (
//             <img src={mapScreenshotData} alt="Mapa Capturado"
//               style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
//           ) : (
//             <Typography>No hay imagen de mapa para previsualizar.</Typography>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// }