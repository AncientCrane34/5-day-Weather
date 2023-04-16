var cityId = document.querySelector('#city')
var priorCity = document.querySelector('#priorCity')
var currentWeather = document.querySelector('#currentWeather')
var fiveDay = document.querySelector('#cityForcast')
var humidity = document.querySelector('#humidity')
var temp = document.querySelector('#temp')
var wind = document.querySelector('#wind')
var search = document.querySelector('#search')
var apiKey = '59ab240baddbecea4a276e311442c974'

// http://api.openweathermap.org/geo/1.0/direct?q={city name},001&appid=apiKey
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

var formSubmit = function (event) {
  event.preventDefault()

  var citySearch = cityId.value.trim()

  if (citySearch) {
    getCordinants(citySearch)
  } else {
    alert('Enter a city name')
  }
}

var getWeather = function (lat, lon) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+localStorage.getItem('lat')+'&lon='+localStorage.getItem('lon')+'&appid='+apiKey+'&units=imperial'
  fetch(apiUrl)
  .then(function (response) {
    if(response.ok) {
      console.log(response)
      response.json().then(function(data) {
        console.log(data)
        for (var i = 0; i < data.length; i++){
          localStorage.setItem('city', data[i].city.name)
          localStorage.setItem('date', data[i].list.dt)
          localStorage.setItem('icon', data[i].list.weather.icon)
          localStorage.setItem('temp', data[i].list.main.temp)
          localStorage.setItem('wind', data[i].list.wind.speed)
          localStorage.setItem('humidity', data[i].list.main.humidity)
        }
      })
    }
  })
}

var getCordinants = function (cityId) {
  var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+cityId+'&appid=59ab240baddbecea4a276e311442c974'
  fetch(apiUrl)
  .then(function (response) {
    if(response.ok) {
      console.log(response)
      response.json().then(function (data) {
        console.log(data)
        for (var i = 0; i < data.length; i++){
          console.log(data[i].lat)
          console.log(data[i].lon)
          localStorage.setItem('lat', data[i].lat)
          localStorage.setItem('lon', data[i].lon)
        }
        getWeather('lat', 'lon')
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