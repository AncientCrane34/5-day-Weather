var cityId = document.querySelector('#city')
var priorCity = document.querySelector('#priorCity')
var currentWeather = document.querySelector('#currentWeather')
var forcast = document.querySelector('#cityForcast')
var humidity = document.querySelector('#humidity')
var temp = document.querySelector('#temp')
var wind = document.querySelector('#wind')
var search = document.querySelector('#search')
var name = document.querySelector('#cityName')
var cityName = document.querySelector('#cityInfo')
var date = document.querySelector('#date')
var icon = document.querySelector('#icon')
var apiKey = '59ab240baddbecea4a276e311442c974'
var cities = []
const forcastArray = [0, 8, 16, 24, 32]

// 0, 8, 16, 24, 32
// http://api.openweathermap.org/geo/1.0/direct?q={city name},001&appid=apiKey
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// if (localStorage.getitems("cities")) {
//   storedCities = JSON.parse(localStorage.getItem("cities"))
//   for (var i = 0; i < storedCities.length; i++) {
//     lastCitySearched = storedCities.length - 1
//     var lastCity = storedCities[lastCitySearched]
//   }
// } else {
//   cities;
// }

var formSubmit = function (event) {
  event.preventDefault()
  // console.log("FORM SUBMIT")
  var citySearch = cityId.value.trim()
  // console.log(citySearch)
  if (citySearch) {
    getCordinants(citySearch)
  } else {
    alert('Enter a city name')
  }
}



var getWeather = function (lat, lon) {
  // console.log("lat: "+lat)
  // console.log("lon: "+lon)
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
  fetch(apiUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // console.log("FORCAST DATA")
    // console.log(data)
    cities.push(data.city.name)
    localStorage.setItem("cities", JSON.stringify(cities))
    // localStorage.setItem("currentCity", JSON.stringify(data.city.name))
    // localStorage.setItem("date", JSON.stringify(data.list[0].dt_txt))
    // // localStorage.setItem("icon", JSON.stringify(data.list[0].weather.icon))
    // localStorage.setItem("temp", JSON.stringify(data.list[0].main.temp))
    // localStorage.setItem("wind", JSON.stringify(data.list[0].wind.speed))
    // localStorage.setItem("humidity", JSON.stringify(data.list[0].main.humidity))
    // localStorage.setItem("icon", JSON.stringify(data.list[0].weather[0].icon))
    // icon.src = "http://openweathermap.org/img/wn/"+data.list[0].weather[0].icon+"@2x.png"
    // console.log(data.list[0].dt_txt)
    // console.log(data.list[0].weather[0].icon)
    // console.log(data.list[0].main.temp)
    // console.log(data.list[0].wind.speed)
    // console.log(data.list[0].main.humidity)
    renderToday(data)
    renderFiveDay(data)
    renderPriorCity()
  })
}

var renderToday = function (data) {
  cityName.textContent = data.city.name
  date.textContent = data.list[0].dt_txt
  temp.textContent = data.list[0].main.temp
  wind.textContent = data.list[0].wind.speed
  humidity.textContent = data.list[0].main.humidity
  icon.src = "http://openweathermap.org/img/wn/"+data.list[0].weather[0].icon+"@2x.png"
  // console.log("http://openweathermap.org/img/wn/"+localStorage.getItem('icon')+"@2x.png")
}

var renderFiveDay = function (data) {
  for (const value of forcastArray) {
    var textDate = document.createElement('h4')
    var textTemp = document.createElement('p')
    var textWind = document.createElement('p')
    var textHumid = document.createElement('p')
    var image = document.createElement('img')
    textDate.textContent = data.list[value].dt_txt
    textTemp.textContent = data.list[value].main.temp
    textWind.textContent = data.list[value].wind.speed
    textHumid.textContent = data.list[value].main.humidity
    image.src = "http://openweathermap.org/img/wn/"+data.list[value].weather[0].icon+"@2x.png"
    forcast.append(textDate)
    forcast.append(textTemp)
    forcast.append(image)
    forcast.append(textWind)
    forcast.append(textHumid)
  }
}

var renderPriorCity = function () {
  priorCity.textContent = localStorage.getItem("cities")
}

var getCordinants = function(cityId) {
  var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+cityId+'&appid=59ab240baddbecea4a276e311442c974'
  fetch(apiUrl)
  .then(function (response) {
    if(response.ok) {
      response.json().then(function (data) {
        const lat = data[0].lat
        const lon =  data[0].lon
        // for (var i = 0; i < data.length; i++){
        //   console.log(data[i].lat)
        //   console.log(data[i].lon)
        //   localStorage.setItem('lat', data[i].lat)
        //   localStorage.setItem('lon', data[i].lon)
        // }
        getWeather(lat, lon)
      })
    } else {
      alert('Error: ' + response.statusText)
    }
  })
  .catch(function (error) {
    alert('Unable to connect to openweathermap')
  })
}

search.addEventListener('submit', formSubmit)