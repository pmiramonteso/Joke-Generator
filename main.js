"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const buttonChiste = document.querySelector('#btn-chiste');
const contenedorChiste = document.querySelector('.contenedor-chiste');
const botonesVoto = document.querySelectorAll('.btn-vote');
const clima1 = document.getElementById('clima');
let chisteActual = null;
let reportAcudits = [];
const blobs = [
    'svg/blob.svg',
    'svg/blob1.svg',
    'svg/blob2.svg',
    'svg/blob3.svg',
    'svg/blob4.svg',
    'svg/blob5.svg',
    'svg/blob6.svg',
    'svg/blob7.svg',
];
let blobsMostrados = [];
function cambiarBlob() {
    const blobImg = document.getElementById('blob-svg');
    if (blobsMostrados.length === blobs.length) {
        blobsMostrados = [];
    }
    const blobsDisponibles = blobs.filter(blob => !blobsMostrados.includes(blob));
    if (blobsDisponibles.length > 0) {
        const randomBlob = blobsDisponibles[Math.floor(Math.random() * blobsDisponibles.length)];
        if (blobImg) {
            blobImg.src = randomBlob;
        }
        blobsMostrados.push(randomBlob);
    }
}
function traerTiempo() {
    return __awaiter(this, void 0, void 0, function* () {
        let keyWeather = '2a487b657710441188a2574c64ec2db9';
        let lat = '41.38879';
        let lon = '2.15899';
        let urlTiempo = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${keyWeather}&units=metric&lang=es`;
        try {
            const respuesta = yield fetch(urlTiempo);
            if (respuesta.ok) {
                const data = yield respuesta.json();
                console.log('Datos del clima:', data);
                const temperatura = parseInt(data.main.temp);
                const icono = data.weather[0].icon;
                ;
                const iconMap = {
                    '01d': 'wi-day-sunny',
                    '01n': 'wi-night-clear',
                    '02d': 'wi-day-cloudy',
                    '02n': 'wi-night-alt-cloudy',
                    '03d': 'wi-cloud',
                    '03n': 'wi-cloud',
                    '04d': 'wi-cloudy',
                    '04n': 'wi-cloudy',
                    '09d': 'wi-showers',
                    '09n': 'wi-showers',
                    '10d': 'wi-day-rain',
                    '10n': 'wi-night-rain',
                    '11d': 'wi-thunderstorm',
                    '11n': 'wi-thunderstorm',
                    '13d': 'wi-snow',
                    '13n': 'wi-snow',
                    '50d': 'wi-fog',
                    '50n': 'wi-fog'
                };
                const iconoClase = iconMap[icono] || 'wi-na';
                let climaClass = 'mild';
                if (temperatura > 25) {
                    climaClass = 'warm';
                }
                else if (temperatura < 10) {
                    climaClass = 'cold';
                }
                clima1.innerHTML = `
                <p>${temperatura}°C</p>
                <i class="wi ${iconoClase}"></i>
            `;
                clima1.classList.remove('warm', 'cold', 'mild');
                clima1.classList.add(climaClass);
            }
            else {
                throw new Error(`Error al obtener el clima: ${respuesta.status} ${respuesta.statusText}`);
            }
        }
        catch (error) {
            console.error('Error al obtener el clima:', error);
        }
    });
}
function traerChiste() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const obtenerChiste = Math.random() < 0.5;
            if (obtenerChiste) {
                const respuesta = yield fetch('https://icanhazdadjoke.com/', {
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'My Typescript App (https://github.com/pmiramonteso/Sprint-4.git)',
                    }
                });
                if (respuesta.ok) {
                    const chistes = yield respuesta.json();
                    chisteActual = chistes;
                    crearChiste(chistes);
                    console.log('Chiste obtenido:', chistes.joke);
                }
                else {
                    throw new Error(`Error al obtener chiste: ${respuesta.status} ${respuesta.statusText}`);
                }
            }
            else {
                const respuesta2 = yield fetch('https://api.chucknorris.io/jokes/random');
                if (respuesta2.ok) {
                    const chiste = yield respuesta2.json();
                    chisteActual = { joke: chiste.value };
                    crearChiste(chisteActual);
                    console.log('Chiste de Chuck Norris obtenido:', chiste.value);
                }
                else {
                    throw new Error(`Error al obtener chiste de Chuck Norris: ${respuesta2.status} ${respuesta2.statusText}`);
                }
            }
        }
        catch (error) {
            console.error('Tenemos malas noticias: ', error);
        }
        cambiarBlob();
    });
}
function crearChiste(chiste) {
    contenedorChiste.innerHTML = '';
    const texto = document.createElement('p');
    texto.textContent = chiste.joke;
    const div = document.createElement('div');
    div.appendChild(texto);
    contenedorChiste === null || contenedorChiste === void 0 ? void 0 : contenedorChiste.appendChild(div);
}
function votar(valor) {
    if (chisteActual) {
        const chisteExistente = reportAcudits.find(report => report.joke === chisteActual.joke);
        if (chisteExistente) {
            chisteExistente.score = valor;
            chisteExistente.date = new Date().toISOString();
        }
        else {
            reportAcudits.push({
                joke: chisteActual.joke,
                score: valor,
                date: new Date().toISOString(),
            });
        }
        console.log('Reporte de Chistes:');
        reportAcudits.forEach((report, index) => {
            console.log(`Chiste ${index + 1}: "${report.joke}"`);
            console.log(`Puntuación: ${report.score}`);
            console.log(`Fecha: ${report.date}`);
            console.log('----------------------');
        });
    }
    else {
        console.error('No hay un chiste actual para votar.');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    if (buttonChiste) {
        buttonChiste.addEventListener('click', traerChiste);
    }
    botonesVoto.forEach(button => {
        button.addEventListener('click', (event) => {
            const score = event.currentTarget.getAttribute('data-score');
            if (score) {
                votar(parseInt(score));
            }
        });
    });
    traerChiste();
    traerTiempo();
});
