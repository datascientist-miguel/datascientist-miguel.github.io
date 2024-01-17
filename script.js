// 1. Declaración de Variables Globales
var tamano = 400;
var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var otrocanvas = document.getElementById("otrocanvas");
var currentStream = null;
var facingMode = "user";
var countingInterval = null;
var modelo = null;
var contadoresCelulas = {};
var cellCount = 0;
var maxCellCount = 100;
var tiposCelulas = ['Basofilos', 'Eosinofilos', 'Eritroblastos', 'Linfoblastos', 'Linfocitos', 'Mieloblastos', 'Monocitos', 'Neutrofilos', 'Plaquetas'];

// 2. Funciones de la Cámara
function mostrarCamara() {
    var opciones = {
        audio: false,
        video: {
            width: tamano, height: tamano
        }
    }
    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(opciones)
            .then(function(stream) {
                currentStream = stream;
                video.srcObject = currentStream;
                procesarCamara();
            })
            .catch(function(err) {
                alert("No se pudo utilizar la cámara :(");
                console.error(err);
                alert(err);
            })
    } else {
        alert("No existe la función getUserMedia");
    }
}
function cambiarCamara() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => {
            track.stop();
        });
    }

    facingMode = facingMode == "user" ? "environment" : "user";

    var opciones = {
        audio: false,
        video: {
            facingMode: facingMode, width: tamano, height: tamano
        }
    };

    navigator.mediaDevices.getUserMedia(opciones)
        .then(function(stream) {
            currentStream = stream;
            video.srcObject = currentStream;
        })
        .catch(function(err) {
            console.log("Oops, hubo un error", err);
        })
}
function procesarCamara() {
    ctx.drawImage(video, 0, 0, tamano, tamano, 0, 0, tamano, tamano);
    setTimeout(procesarCamara, 20);
}

// 3. Funciones del Modelo
async function cargarModelo() {
    console.log("Cargando modelo...");
    try {
        modelo = await tf.loadLayersModel("./modelo/model.json");
        console.log("Modelo cargado exitosamente");
    } catch (error) {
        console.error("Error cargando el modelo:", error);
    }
}

// 4. Funciones de Conteo y UI
function startCounting() {
    document.getElementById("startButton").style.display = "none";
    document.getElementById("stopButton").style.display = "inline";
    document.getElementById("pauseButton").style.display = "inline";
    countingInterval = setInterval(predecir, 2000);
}
function stopCounting() {
    clearInterval(countingInterval);
    document.getElementById("stopButton").style.display = "none";
    document.getElementById("startButton").style.display = "inline";
    document.getElementById("pauseButton").style.display = "none";
}
function pauseCounting() {
    clearInterval(countingInterval);
    document.getElementById("pauseButton").style.display = "none";
    document.getElementById("startButton").style.display = "inline";
}  
function updateCounters(clase) {
    if (!contadoresCelulas.hasOwnProperty(clase)) {
        contadoresCelulas[clase] = 1;
    } else {
        contadoresCelulas[clase]++;
    }
    var totalGeneral = Object.keys(contadoresCelulas)
                             .filter(key => key !== 'Plaquetas')
                             .reduce((total, key) => total + contadoresCelulas[key], 0);

    document.getElementById("totalGeneral").innerText = totalGeneral;

    if (totalGeneral >= maxCellCount) {
        stopCounting();
        alert("Se alcanzó el conteo máximo de 100 células (excluyendo plaquetas)");
        return;
    }
    updateCounterList();
}
function updateCounterList() {
    var filasContadores = document.getElementById("filasContadores");
    filasContadores.innerHTML = "";

    for (var tipo in contadoresCelulas) {
        var fila = filasContadores.insertRow();
        fila.insertCell(0).innerText = tipo;
        fila.insertCell(1).innerText = contadoresCelulas[tipo];
    }

    var totalGeneral = Object.values(contadoresCelulas).reduce((total, count) => total + count, 0);
    document.getElementById("totalGeneral").innerText = totalGeneral;
}
function detectCell(clase) {
    var totalGeneral = Object.keys(contadoresCelulas)
                             .filter(key => key !== 'Plaquetas')
                             .reduce((total, key) => total + contadoresCelulas[key], 0);

    if (totalGeneral < maxCellCount) {
        updateCounters(clase);
    } else {
        stopCounting();
        alert("Se alcanzó el conteo máximo de 100 células (excluyendo plaquetas)");
    }
}
function resetCounters() {
cellCount = 0;
tiposCelulas.forEach(tipo => contadoresCelulas[tipo] = 0);
updateCounterList();
document.getElementById("totalGeneral").innerText = 0;
}
function predecir() {
    if (modelo != null && countingInterval != null) {
        var totalGeneral = Object.keys(contadoresCelulas)
                                 .filter(key => key !== 'Plaquetas')
                                 .reduce((total, key) => total + contadoresCelulas[key], 0);

        if (totalGeneral >= maxCellCount) {
            stopCounting();
            alert("Se alcanzó el conteo máximo de 100 células (excluyendo plaquetas)");
            return;
        }
        
        resample_single(canvas, 150, 150, otrocanvas);

        var ctx2 = otrocanvas.getContext("2d");
        var imgData = ctx2.getImageData(0, 0, 150, 150);
        var arr = [];
        var arr150 = [];

        for (var p = 0; p < imgData.data.length; p += 4) {
            var rojo = imgData.data[p] / 255;
            var verde = imgData.data[p + 1] / 255;
            var azul = imgData.data[p + 2] / 255;

            arr150.push([rojo, verde, azul]);
            if (arr150.length == 150) {
                arr.push(arr150);
                arr150 = [];
            }
        }
        arr = [arr];
        var tensor = tf.tensor4d(arr); 
        try {
            var resultado = modelo.predict(tensor).dataSync();

            var clases = [
                'Basofilos', 'Eosinofilos', 'Eritroblastos',
                'Linfoblastos', 'Linfocitos', 'Mieloblastos',
                'Monocitos', 'Neutrofilos', 'Plaquetas'
            ];
            var maxProb = Math.max(...resultado);
            var claseIndex = resultado.indexOf(maxProb);
            var clase = clases[claseIndex];
            updateCounters(clase);
            document.getElementById("resultadoPrediccion").innerHTML = clase
        } catch (error) {
            console.error("Error en la predicción:", error);
        }
    }
}
function resample_single(canvas, width, height, resize_canvas) {
    var width_source = canvas.width;
    var height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    var ctx = canvas.getContext("2d");
    var ctx2 = resize_canvas.getContext("2d");
    var img = ctx.getImageData(0, 0, width_source, height_source);
    var img2 = ctx2.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x2 = (i + j * width) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r = 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = (j + 0.5) * ratio_h;
            var yy_start = Math.floor(j * ratio_h);
            var yy_stop = Math.ceil((j + 1) * ratio_h);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = (i + 0.5) * ratio_w;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(i * ratio_w);
                var xx_stop = Math.ceil((i + 1) * ratio_w);
                for (var xx = xx_start; xx < xx_stop; xx++) {
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    var pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }


    ctx2.putImageData(img2, 0, 0);
}

// 5. Inicialización
document.addEventListener('DOMContentLoaded', (event) => {
    tiposCelulas.forEach(tipo => contadoresCelulas[tipo] = 0);
    updateCounterList();
    mostrarCamara();
    cargarModelo();
});

class L2 {
    static className = 'L2';

    constructor(config) {
        return tf.regularizers.l1l2(config);
    }
}
tf.serialization.registerClass(L2);