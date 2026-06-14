# 🌿 Peluquería Daniel - Sistema de Gestión de Citas

¡Bienvenido al repositorio de **Peluquería**! Una aplicación web moderna, fluida y con una estética _aesthetic_ minimalista, diseñada específicamente para optimizar la reserva de citas de belleza y peluquería en tiempo real.

Desarrollado con **Angular**, este proyecto destaca por una interfaz limpia con una paleta de colores inspirada en la naturaleza (verde botánico y tonos madera) y una barra de navegación superior completamente centrada.

---

## ✨ Características Principales

- **Diseño Aesthetic & Minimalista:** Paleta de colores orgánicos basada en verde oliva, tonos arena, madera cálida y blancos rotos.
- **Navegación Centralizada:** Menú superior elegante y fijo (`sticky navbar`) optimizado para una experiencia fluida.
- **Arquitectura de Sola Página (SPA):** Navegación suave por secciones sin recargar el navegador.
- **Motor de Citas Reactivo (Bloques de 30 min):** Gestión inteligente del tiempo donde los huecos se actualizan al instante usando **RxJS** y estados compartidos.
- **Pasarela de Pago Simulada:** Formulario integrado interactivo con validación visual para simular la confirmación del pago de la reserva.
- **Gestión de Staff:** Tarjetas de presentación de estilistas para que el cliente elija a su profesional favorito.

---

## 🎨 Paleta de Colores (CSS Variables)

El diseño visual está centralizado en `src/styles.css` mediante las siguientes variables:

- `--color-fondo:` `#FDFBF7` (Blanco roto / Arena claro)
- `--color-verde:` `#4A5D4E` (Verde Oliva Botánico)
- `--color-madera:` `#B08968` (Tono madera cálido)
- `--color-texto:` `#2F2E2C` (Antracita suave para lectura cómoda)

---

## 🛠️ Estructura del Proyecto

La arquitectura sigue las mejores prácticas de modularidad de Angular:

```text
src/app/
│
├── components/
│   ├── navbar/         # Barra de navegación central superior
│   ├── inicio/         # Sección de bienvenida (Hero)
│   ├── sobre-nosotros/ # Información de la peluquería y selección de personal
│   └── citas/          # Módulo integrado de Calendario + Horas + Pago Simulado
│
├── services/
│   └── citas.service.ts # Lógica reactiva, control de horas de 30 min y estado de reservas
│
└── styles.css          # Estilos globales y tokens de diseño aesthetic
```

---

# Peluqueria

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
