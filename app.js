navigator.geolocation.getCurrentPosition(Gpsuccess, Gperror);

var map = L.map('map');
var marker = L.marker([0, 0]).addTo(map);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



function onMapClick(e) {

    console.log(e.latlng)
    actualizaTodo(e.latlng.lat, e.latlng.lng);

}

map.on('click', onMapClick);



const ctx = document.getElementById('chart');

var grafico = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Tempº',
            data: [],
            borderColor: 'lime',
            backgroundColor: 'lime',
            borderWidth: 1,
            lineTension: 0.3
        },
        {
            label: 'Sensacionº',
            data: [],
            borderWidth: 1,
            borderColor: 'yellow',
            backgroundColor: 'yellow',
            lineTension: 0.3
        },
        {
            label: 'TempMax',
            data: [],
            borderColor: 'red',
            backgroundColor: 'red',
            borderWidth: 1,
            lineTension: 0.3
        },
        {
            label: 'TempMin',
            data: [],
            borderWidth: 1,
            borderColor: 'blue',
            backgroundColor: 'blue',
            lineTension: 0.3
        }
        ]
    },
    options: {
        plugins: {
            responsive: true,
            title: {
                display: true,
                text: '<Chart.js Line Chart>',
                color: 'whitesmoke',
                font: {
                    weight: 'bold',
                    size: 32
                }
            
            },
            legend: {
                display: true,
                labels: {
                    color: 'whitesmoke'
                }
            },
        },
        
        animations: {
            tension: {
            duration: 1000,
            easing: 'linear',
            from: 1,
            to: 0,
            loop: true
            }
        },
        scales: {
            x: {
                ticks:{
                    color: 'black',
                }
            },
            y: {
                ticks:{
                    color: 'black',
                },
                beginAtZero: true,
                
            },
        
            
        }
    }
};


const myChart = new Chart(ctx, grafico);






let apiCallbase = 'https://api.openweathermap.org/data/2.5/forecast?&units=metric&appid=a16ec826797a1b3e6ede633fa4b92a87';
let apiCallURL = "";
let apiCallWeather = 'https://api.openweathermap.org/data/2.5/weather?&units=metric&appid=a16ec826797a1b3e6ede633fa4b92a87';
let datosTemp = document.getElementById('datosTemp')

function apiCall(apiCallbase) {
    fetch(apiCallbase)
        .then(response => response.json())
        .then(json => actualizaChart(json));

}


function actualizaChart(json) {

    grafico.data.labels =[];
    grafico.data.datasets[0].data = [];
    grafico.data.datasets[1].data = [];
    grafico.data.datasets[2].data = [];
    grafico.data.datasets[3].data = [];



    for (let i = 0; i < json.cnt; i++) {
        let date = new Date(json.list[i].dt_txt);
        let formatoFechaHora = date.toLocaleString();
    
        grafico.options.plugins.title.text = json.city.name;
        grafico.data.labels.push(formatoFechaHora);
        grafico.data.datasets[0].data.push(json.list[i].main.temp);
        grafico.data.datasets[1].data.push(json.list[i].main.feels_like);
        grafico.data.datasets[2].data.push(json.list[i].main.temp_max);
        grafico.data.datasets[3].data.push(json.list[i].main.temp_min);
    }


    myChart.update();
}


function Gpsuccess(pos) {
    const crd = pos.coords;
    actualizaTodo(crd.latitude, crd.longitude);

}

function Gperror(err) {
    let lat = 37.9855747
    let lon = -1.1821219
    actualizaTodo(lat, lon);

}

function actualizaTodo(lat, lon) {

    apiCall(apiCallbase + "&lat=" + lat + "&lon=" + lon);
    displayWeather(lat, lon);


    map.setView([lat, lon], 13);
    var newLatLng = new L.LatLng(lat, lon);
    marker.setLatLng(newLatLng);

    $.getJSON(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=a16ec826797a1b3e6ede633fa4b92a87`, function (weatherData) {
        if (weatherData.hasOwnProperty('name')) {
            var city = weatherData.name;
        } else {
            var city = 'No disponible';
        }

        var weatherIcon = `<img id="icono" src="weather/PNG/${weatherData.weather[0].icon}.png">`;
        var temperature = Math.round(weatherData.main.temp);
        marker.bindPopup('<div class="leaflet-popup-content">' + city + '<br>' + weatherIcon + temperature + '°C' + '</div>').openPopup();
        marker.getPopup().update();
    });


}


function pintaDatos() {
    navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;

        // Obtener datos del tiempo
        var apiKey = "a16ec826797a1b3e6ede633fa4b92a87";
        var url = "https://api.openweathermap.org/data/2.5/weather?&lang=es&lat=" + lat + "&lon=" + lon + "&units=metric&appid=" + apiKey;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Pintar datos en el div
                document.getElementById("datosTemp").innerHTML +=
                    "<p>" + data.name + " , " + data.sys.country + "</p>" + "<br>" +
                    "<p>" + "Feels like " + Math.round(data.main.feels_like) + "ºC" + "</p>" +
                    "<p>" + Math.round(data.main.temp) + "°C" + "</p><br>" +
                    "<p>Humedad: " + data.main.humidity + "%" + "</p>" +
                    "<p>Velocidad del viento: " + data.wind.speed + " m/s" + "</p>";

                let desc = data.weather[0].description;
                document.getElementById("datosTemp").innerHTML += "<br>" + desc.toUpperCase();

                let iconoAnimado = document.getElementById('icono-animado');

                console.log(data.weather[0].main)
                switch (data.weather[0].main) {
                    case 'Thunderstorm':
                        iconoAnimado.src = 'animated/thunder.svg';
                        break;
                    case 'Drizzle':
                        iconoAnimado.src = 'animated/rainy-2.svg';
                        break;
                    case 'Rain':
                        iconoAnimado.src = 'animated/rainy-7.svg';
                        break;
                    case 'Snow':
                        iconoAnimado.src = 'animated/snowy-6.svg';
                        break;
                    case 'Clear':
                        iconoAnimado.src = 'animated/day.svg';
                        break;
                    case 'Atmosphere':
                        iconoAnimado.src = 'animated/weather.svg';
                        break;
                    case 'Clouds':
                        iconoAnimado.src = 'animated/cloudy-day-1.svg';
                        break;
                    default:
                        iconoAnimado.src = 'animated/cloudy-day-1.svg';
                }
            });
    });
}

pintaDatos();

function displayWeather(lat, lon) {
        const weatherDiv = document.getElementById('weatherDiv');
        weatherDiv.innerHTML = '<h2>PRONÓSTICO-5 DÍAS🥶</h2>';
        const apiCallWeather = `https://api.openweathermap.org/data/2.5/forecast?lang=es&lat=${lat}&lon=${lon}&units=metric&appid=a16ec826797a1b3e6ede633fa4b92a87`;
        fetch(apiCallWeather)
            .then(response => response.json())
            .then(json => {
                const weatherData = json.list;
                

                let printedDays = [];
                
                for (let i = 0; i < weatherData.length; i++) {
                    const date = new Date(weatherData[i].dt * 1000);
                    const day = date.toLocaleDateString('default', { day: 'numeric' });
                    const dayOfWeek = date.toLocaleDateString('default', { weekday: 'long' });
                    const month = date.toLocaleDateString('default', { month: 'long' });
                    const icon = weatherData[i].weather[0].icon;
                    const temperature = Math.round(weatherData[i].main.temp_max) + '/' + Math.round(weatherData[i].main.temp_min) +  'ºC';
                    const descripcion = weatherData[i].weather[0].description;
                    if (!printedDays.includes(day)) {
                        weatherDiv.innerHTML = `<table>
                                                <tr>
                                                    <td>${dayOfWeek} ${month} ${day}</td>
                                                    <td><img src="https://openweathermap.org/img/w/${icon}.png"></td>
                                                    <td>${temperature}</td>
                                                    <td>${descripcion}</td>
                                                </tr>
                                                </table>` + weatherDiv.innerHTML;
                        printedDays.push(day);
                    }
            

                }

            });

}





