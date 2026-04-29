# Proyecto: Adtrait - Storytelling Dinámico

¡Hola! Bienvenido al proyecto **Adtrait**. Esta plataforma busca enseñar e interactuar con el concepto del **Storytelling Dinámico** aplicado a ventas y funnels en e-commerce.

## ¿Cómo levantar el proyecto localmente?

Este proyecto utiliza **Node.js** y **Express** para el servidor backend, y HTML/CSS/JS nativo para el frontend. Para ejecutarlo en tu computadora, sigue estos pasos:

1. **Asegúrate de tener Node.js instalado**
   Si no lo tienes, descárgalo e instálalo desde [nodejs.org](https://nodejs.org/).

2. **Instala las dependencias**
   Abre una terminal (o consola de comandos) en la carpeta principal de este proyecto (`proyecto_storytelling`) y ejecuta:
   ```bash
   npm install
   ```
   Esto instalará la librería de `express` y cuaquier otra herramienta definida en el `package.json`.

3. **Inicia el servidor**
   En la misma terminal, ejecuta:
   ```bash
   npm start
   ```

4. **Accede a la página**
   Abre tu navegador web e ingresa a la siguiente dirección: 
   **http://localhost:3000**

---

## Cosas de interés sobre el desarrollo

* **Diseño Responsivo (Mobile-First):** La galería de tarjetas de arquetipos funciona creando cuadrículas (Grids) de CSS con adaptación matemática predictiva. 
* **Interacción Dinámica (Frontend):** Las narrativas que introduces en la página principal se publican al instante interactuando con una API simulada.
* **Separación de responsabilidades:** La funcionalidad de rutas (`routes.js`) está estructurada de forma modular separándola del núcleo del servidor (`server.js`).

## Arquitectura y Patrones de Diseño
Este proyecto implementa patrones de diseño avanzados para asegurar escalabilidad y un código limpio:

1. **Singleton (`CartManager`)**: Gestiona el estado único del carrito de compras en toda la aplicación.
2. **Observer**: Sincroniza en tiempo real el contador del carrito en el header cuando se agregan productos.
3. **Factory Method (`UIFactory`)**: Centraliza la creación de componentes complejos (Tarjetas de Productos, Notificaciones Toast, Comentarios) para desacoplar la lógica de negocio de la interfaz.

---
© 2026 · **Adtrait** · Desarrollado por **Angie Carolina Reyes**.