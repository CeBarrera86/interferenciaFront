import React from 'react';
import { Button, useTheme } from '@mui/material';
import { forwardRef } from 'react';

const MapButton = forwardRef(
  ({ onClick, disabled, children, selected = false, color, ...props }, ref) => {
    const theme = useTheme();

    const baseColor =
      typeof color === 'string'
        ? theme.palette[color]?.main || theme.palette.primary.main
        : color;

    const hoverColor =
      typeof color === 'string'
        ? theme.palette[color]?.dark || theme.palette.primary.dark
        : theme.palette.primary.dark;

    const contrastText = theme.palette.primary.contrastText;

    return (
      <Button
        ref={ref}
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        sx={{
          backgroundColor: selected ? theme.palette.primary.main : baseColor,
          color: selected ? '#fff' : contrastText,
          border: selected ? '2px solid #1565c0' : 'none',
          boxShadow: selected ? '0 0 0 2px rgba(25, 118, 210, 0.3)' : 'none',
          transition: 'transform 0.2s ease-in-out',
          transform: selected ? 'scale(1.1)' : 'scale(1)',
          borderRadius: '50%',
          minWidth: 40,
          height: 40,
          padding: 0,
          '&:hover': {
            backgroundColor: selected ? '#1565c0' : hoverColor,
          },
          '&.Mui-disabled': {
            backgroundColor: theme.palette.grey[400],
            color: theme.palette.grey[700],
          },
          ...props.sx,
        }}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

export default MapButton;