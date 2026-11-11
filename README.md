# Brunch Express

Aplicación móvil de prueba desarrollada para la asignatura **Programación de Dispositivos Móviles** de Ingeniería de Software.

Brunch Express permite consultar el menú de un restaurante, agregar productos a un carrito y **simular** la confirmación de un pedido. Es un proyecto académico: no realiza pagos ni envía pedidos a un restaurante real y **no almacena los pedidos de forma permanente**.

## Funcionalidades

- **Inicio:** presentación del restaurante y acceso al menú.
- **Menú:** listado de platos y bebidas con descripción, categoría y precio.
- **Carrito:** agregar productos, aumentar o disminuir cantidades, eliminar productos y calcular subtotales y total.
- **Confirmación:** validación del nombre del cliente, ventana de confirmación y mensaje de resultado. Al confirmar, se vacía el carrito.

## Tecnologías utilizadas

- Ionic y Angular
- TypeScript, HTML y SCSS
- Capacitor para la plataforma Android
- Android Studio y Gradle para generar el APK
- Git y GitHub para el control de versiones

## Organización principal

```text
src/app/
├── models/
│   └── producto.model.ts
├── services/
│   └── carrito.service.ts
├── tab1/           # Inicio
├── tab2/           # Menú
├── tab3/           # Carrito y confirmación
└── tabs/           # Navegación inferior
android/            # Proyecto nativo Android
```

## Ejecutar el proyecto en el navegador

**Requisitos:** Node.js, npm e Ionic CLI.

1. Clonar el repositorio e ingresar a la carpeta:

   ```bash
   git clone https://github.com/02Oscar27/brunch-express.git
   cd brunch-express
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Iniciar la aplicación:

   ```bash
   ionic serve
   ```

## Compilar y generar el APK de Android

**Requisitos:** Android Studio con el SDK de Android y las herramientas de compilación instaladas.

Desde la raíz del proyecto:

```bash
ionic build
npx cap sync android
npx cap open android
```

En Android Studio, seleccionar la variante **debug** del módulo `app` y utilizar la opción del menú **Build** para generar el APK.

Ubicación esperada del archivo:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

La carpeta `android/` forma parte del repositorio. No hace falta ejecutar `npx cap add android` al clonar este proyecto.

## Descargar e instalar

La versión de prueba está publicada en **GitHub Releases**:

[Descargar Brunch Express v1.0.0](https://github.com/02Oscar27/brunch-express/releases/tag/v1.0.0)

Abrir **Assets**, descargar `app-debug.apk` e instalarlo en un dispositivo Android compatible. Android puede solicitar permiso para instalar el archivo desde la aplicación con la que se abrió la descarga.

## Pruebas manuales

1. Abrir Inicio y navegar al Menú.
2. Agregar dos Pancakes y un Waffle al carrito.
3. Comprobar que las cantidades y el total se actualizan ($56.000 para ese ejemplo).
4. Aumentar, disminuir o eliminar un producto y verificar los cálculos.
5. Intentar confirmar sin nombre o con menos de tres caracteres: debe aparecer un mensaje de validación.
6. Cancelar la ventana de confirmación: el carrito conserva sus productos.
7. Confirmar el pedido: aparece el mensaje correspondiente y el carrito queda vacío.

## Alcance

Brunch Express simula el flujo de pedido para demostrar componentes Ionic, navegación, interfaces TypeScript, arreglos, servicios Angular, operaciones matemáticas, eventos y validaciones. No incluye autenticación, pagos en línea, base de datos ni historial de pedidos.
