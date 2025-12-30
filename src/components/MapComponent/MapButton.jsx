import { forwardRef } from 'react';
import { Button, useTheme } from '@mui/material';

const MapButton = forwardRef(
  ({ onClick, disabled, children, selected = false, color = 'primary', sx = {}, ...props }, ref) => {
    const theme = useTheme();

    const resolveColor = (shade) =>
      typeof color === 'string'
        ? theme.palette[color]?.[shade] || theme.palette.primary[shade]
        : color;

    const styles = {
      backgroundColor: selected ? resolveColor('main') : resolveColor('main'),
      color: selected ? '#fff' : theme.palette.primary.contrastText,
      border: selected ? `2px solid ${resolveColor('dark')}` : 'none',
      boxShadow: selected ? `0 0 0 2px rgba(25, 118, 210, 0.3)` : 'none',
      transition: 'transform 0.2s ease-in-out',
      transform: selected ? 'scale(1.1)' : 'scale(1)',
      borderRadius: '50%',
      minWidth: 40,
      height: 40,
      padding: 0,
      '&:hover': {
        backgroundColor: selected ? resolveColor('dark') : resolveColor('dark'),
      },
      '&.Mui-disabled': {
        backgroundColor: theme.palette.grey[400],
        color: theme.palette.grey[700],
      },
      ...sx,
    };

    return (
      <Button
        ref={ref}
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        sx={styles}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

export default MapButton;