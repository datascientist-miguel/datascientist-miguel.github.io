# Clasificador de Células Sanguíneas

## Descripción
Esta página web está diseñada para clasificar imágenes de células sanguíneas utilizando un modelo de Red Convolucional (CNN). La aplicación permite a los usuarios utilizar la cámara web para capturar imágenes de células sanguíneas y clasificarlas en diferentes tipos.

## Características Principales
- **Clasificación Automática y Manual:** 
  - *Modo Automático*: Realiza una clasificación continua de las imágenes capturadas por la cámara web.
  - *Modo Manual*: Permite al usuario tomar una captura única y clasificarla.
- **Conteo de Células:** Contabiliza la cantidad de células de cada tipo detectadas y muestra los resultados en tiempo real.
- **Cambio de Cámara:** Opción para cambiar entre la cámara frontal y trasera del dispositivo.

## Funcionalidades
- **Mostrar Cámara:** Inicia la cámara web del usuario para la captura de imágenes.
- **Cambiar Cámara:** Permite al usuario cambiar entre las cámaras disponibles en su dispositivo.
- **Procesar Cámara:** Captura imágenes continuamente desde la cámara web y las muestra en un canvas.
- **Cargar Modelo:** Carga el modelo de CNN para la clasificación de células sanguíneas.
- **Iniciar/Pausar/Detener Conteo (Modo Automático):** Controla el proceso de clasificación y conteo automático.
- **Captura Manual (Modo Manual):** Realiza una captura única y clasifica la imagen capturada.
- **Reiniciar Contador:** Reinicia el conteo de células de todos los tipos a cero.
- **Actualización de Contadores:** Actualiza la interfaz con el número total y tipo de células identificadas.
- **Predicción:** Clasifica las células en la imagen actual y actualiza los contadores correspondientes.

## Tecnologías Utilizadas
- HTML5
- CSS3
- JavaScript
- TensorFlow.js

## Instrucciones de Uso
1. **Seleccionar Modo de Clasificación:** Al cargar la página, elija entre 'Conteo Automático' o 'Conteo Manual'.
2. **Captura y Clasificación de Células:**
   - En el modo automático, haga clic en 'Iniciar Conteo' para comenzar la clasificación en tiempo real. Use 'Pausar' y 'Detener' para controlar el proceso.
   - En el modo manual, haga clic en 'Captura Manual' para tomar una foto y clasificarla.
3. **Visualización de Resultados:** Los resultados se mostrarán en la tabla 'Contador por Tipo de Célula'.

## Contacto
- **Email:** m.angel9106@gmail.com
- **LinkedIn:** [Miguel Ángel Carvajal](https://www.linkedin.com/in/miguel-angel-carvajal/)
- **GitHub:** [datascientist-miguel](https://github.com/datascientist-miguel)
