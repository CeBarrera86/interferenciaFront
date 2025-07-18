import { useState, useEffect } from 'react';

export function useLocalidades() {
  const [localidades, setLocalidades] = useState([]);
  const [loadingLocalidades, setLoadingLocalidades] = useState(true);
  const [errorLocalidades, setErrorLocalidades] = useState(null);

  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        setLoadingLocalidades(true);
        const response = await fetch('http://localhost:3000/api/localidades');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedLocalidades = data.map(loc => ({ id: loc.LOC_ID, nombre: loc.LOC_DESCRIPCION }));
        setLocalidades(formattedLocalidades);
      } catch (error) {
        console.error("Error fetching localidades:", error);
        setErrorLocalidades(error);
        setLocalidades([]);
      } finally {
        setLoadingLocalidades(false);
      }
    };
    fetchLocalidades();
  }, []);

  return { localidades, loadingLocalidades, errorLocalidades };
}