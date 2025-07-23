import React from 'react';
import { Button, useTheme } from '@mui/material';
import { forwardRef } from 'react';

const MapButton = forwardRef(({ onClick, disabled, children, color = 'corpico.azul', ...props }, ref) => {
  const theme = useTheme();

  const bgColor = typeof color === 'string' ? (theme.palette[color] || color) : color;

  return (
    <Button ref={ref} variant="contained" onClick={onClick} disabled={disabled}
      sx={{
        backgroundColor: bgColor,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: typeof color === 'string' ? theme.palette[color]?.dark || theme.palette.primary.dark : theme.palette.primary.dark,
        },
        '&.Mui-disabled': {
          backgroundColor: theme.palette.grey[400],
          color: theme.palette.grey[700],
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
});

export default MapButton;