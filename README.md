# React + Vite

Proyecto FrontEnd para manejo de Interferencias en Corpico Ltda.

EJECUTAR para producción:

# 1. Copiar enviroment (Agregar valores correspondientes)
cp .env.template .env 

# 2. Instalás dependencias (si hay cambios)
npm install

# 3. Compilás en modo producción
npm run build:prod && npm run preview

# 4. Reiniciás Apache
sudo systemctl restart apache2