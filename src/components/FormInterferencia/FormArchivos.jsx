import React, { useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';

export default function FormArchivos({ errors, onFilesChange, onRemoveFile, onPreviewImage }) {
  const { control } = useFormContext();
  const fileAdjuntos = useWatch({ control, name: 'SOI_DOCUMENTO' }) || [];

  const maxFileSizeMB = 5;
  const maxTotalSizeMB = 20;

  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  const validFiles = fileAdjuntos.filter(file => file instanceof File);
  const totalSizeMB = validFiles.reduce((sum, file) => sum + file.size / (1024 * 1024), 0);

  const handleInternalFileChange = useCallback(
    (event) => {
      const files = Array.from(event.target.files);
      const nuevosValidos = [];

      for (const file of files) {
        const fileSize = file.size / (1024 * 1024);
        const fileType = file.type;

        if (!allowedTypes.includes(fileType)) {
          console.error('Tipo de archivo no permitido:', file.name);
          continue;
        }

        if (fileSize > maxFileSizeMB) {
          console.error('Archivo demasiado grande:', file.name, fileSize.toFixed(2), 'MB');
          continue;
        }

        nuevosValidos.push(file);
      }

      const nuevosSizeMB = nuevosValidos.reduce((sum, file) => sum + file.size / (1024 * 1024), 0);

      if (totalSizeMB + nuevosSizeMB > maxTotalSizeMB) {
        console.error('Excede el límite total de archivos:', (totalSizeMB + nuevosSizeMB).toFixed(2), 'MB');
        return;
      }

      if (nuevosValidos.length > 0) {
        onFilesChange([...validFiles, ...nuevosValidos]);
      }

      event.target.value = null;
    },
    [validFiles, onFilesChange, totalSizeMB]
  );

  const getProgressColor = () => {
    if (totalSizeMB >= maxTotalSizeMB) return 'error';
    if (totalSizeMB >= maxTotalSizeMB * 0.75) return 'warning';
    return 'primary';
  };

  const isLimitReached = totalSizeMB >= maxTotalSizeMB;

  const getIconForFile = (type) => {
    if (!type || typeof type !== 'string') return <DescriptionIcon />;
    if (type.includes('pdf')) return <PictureAsPdfIcon color="error" />;
    if (type.includes('image')) return <ImageIcon color="primary" />;
    if (type.includes('word')) return <DescriptionIcon color="info" />;
    if (type.includes('sheet')) return <TableChartIcon color="success" />;
    return <DescriptionIcon />;
  };

  const handlePreview = (file) => {
    if (file.type?.includes('image')) {
      const reader = new FileReader();
      reader.onload = () => onPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    }
  };

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', p: 2, mb: 2, mt: 2, position: 'relative' }}>
      <Typography variant="subtitle1" sx={{ position: 'absolute', top: -12, left: 12, bgcolor: 'background.paper', px: 1 }}>
        Documentos
      </Typography>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Archivos permitidos (PDF, JPG, PNG, DOCX, XLSX - Máx. 20MB total)
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Tooltip title={isLimitReached ? 'Límite de carga alcanzado (20MB)' : 'Seleccionar archivos'}>
            <Button variant="outlined" component="label" disabled={isLimitReached}>
              Adjuntar archivos
              <input
                type="file"
                multiple
                onChange={handleInternalFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.docx,.xlsx"
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  opacity: 0,
                  cursor: isLimitReached ? 'not-allowed' : 'pointer',
                }}
              />
            </Button>
          </Tooltip>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="body2">
            Espacio usado: {totalSizeMB.toFixed(2)} MB / {maxTotalSizeMB} MB
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(totalSizeMB / maxTotalSizeMB) * 100}
            color={getProgressColor()}
            sx={{ height: 8, borderRadius: 4, mt: 1 }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          {validFiles.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {validFiles.map((file, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getIconForFile(file.type)}
                    <Typography variant="body2">
                      {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title="Abrir archivo">
                      <IconButton onClick={() => handlePreview(file)} size="small">
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar archivo">
                      <IconButton color="error" onClick={() => onRemoveFile(index)} size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        {errors?.SOI_DOCUMENTOS && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {errors.SOI_DOCUMENTOS.message}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}