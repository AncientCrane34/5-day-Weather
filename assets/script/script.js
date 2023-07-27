let userFormEl = document.querySelector('#user-form');
let cityEl = document.querySelector('#city');
let citySearchResultsEl = document.querySelector('#city-search-results');
let cityListEl = document.querySelector('#city-list');
let clearListEl = document.querySelector('#clear-list');
let todaysWeatherL = document.querySelector('.todays-weather')
let forcastWeatherEl = document.querySelector('.forcast-weather')
let searchHistory = []


// function to handle form submission
let formSubmitHandler = (event) => {
  event.preventDefault()

  let city = cityEl.value.trim()
  if (city) {
    getCoordinates(city)
    storeSearch(city)
    getHistory()
    cityEl.value = ""
  } else {
    alert('Enter a city')
  }
}

let getCoordinates = (city) => {
  todaysWeatherL.textContent = ""
  let apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=3&appid=59ab240baddbecea4a276e311442c974"

  fetch(apiUrl).then(function(response) {
    if(response.ok) {
      response.json().then(function(data) {
        getWeather(data[0]);
        getForcast(data[0])
      })
    } else {
      console.log("error")
    }
  }.catch(function(err) {
    console.log(err)                                           
  }))
};

const getWeather = (location => {
  let { lat, lon } = location

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=&limit=3&appid=59ab240baddbecea4a276e311442c974`

  fetch(apiUrl)
    .then(function (response){
      return response.json()
    })
    .then(function (data){
      renderToday(data)
    })
})

const getForcast = (location) => {
  let {lat, lon} = location;

  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=&limit=3&appid=59ab240baddbecea4a276e311442c974`

  fetch(apiUrl)
    .then(function (response){
      return response.json()
    })
    .then(function (data){
      renderForcast(data)
    })
}

const renderToday = (data) => {
  let currentDate = dayjs().format('MMM D, YYYY')
  let cityName = document.createElement('div')
  let cityTemp = document.createElement('div')
  let cityHumidity = document.createElement('div')
  let cityWindSpeed = document.createElement('div')
  let iconId = data.weather[0].icon
  let iconUrl = `http://openweathermap.org/img/w/${iconId}.png`
  let iconIMG = document.createElement('img')

  iconIMG.setAttribute('src', iconUrl)

  cityName.textContent = data.name
  cityTemp.textContent = 'TEMP: ' + data.main.temp
  cityHumidity.textContent = 'Humidity: ' + data.main.humidity
  cityWindSpeed.textContent = 'Wind Speed: ' + data.wind.speed

  todaysWeatherL.append(currentDate)
  todaysWeatherL.append(cityName)
  todaysWeatherL.append(iconIMG)
  todaysWeatherL.append(temp)
  todaysWeatherL.append(humidity)
  todaysWeatherL.append(windSpeed)
};

const renderForcast = (data) => {
  let forcastArr = data.list
  let dayArr = []

  for(let i = 0; i < forcastArr.length; i++) {
    let timeStamp = forcastArr[i].dt;
    let hour = dayjs.unix(timeStamp).format('HH');
    let convertedDay = dayjs.unix(timeStamp).format('D');
    let today = dayjs().format('D');
    if (today !== convertedDay && dayArr.length === 0) {
      dayArr.push(forcastArr[i]);
    } else if (hour === '01') {
      dayArr.push(forcastArr[i])
    }
  }
  renderForcastCard(dayArr)
}

const renderForcastCard = (data) => {
  forcastWeatherEl.innerHTML=""

  data.map((forcast) => {
    let card = document.createElement('div')
    let cardTitle = document.createElement('div')
    let iconId = forcast.weather[0].icon
    let iconUrl = `http://openweathermap.org/img/w/${iconId}.png`
    let iconImg = document.createElement('img')
    let temp = document.createElement('div')
    let wind = document.createElement('div')
    let humidity = document.createElement('div')

    cardTitle.textContent = dayjs.unix(forcast.dt).format('MMM D, YYYY')
    iconImg.setAttribute('src', iconUrl)
    temp.textContent = 'Temp; ' + forcast.main.temp
    wind.textContent = 'Wind Speed; ' + forcast.wind.speed
    humidity.textContent = 'Humidity; ' + forcast.main.temp

    card.classList.add('forcastCard')

    card.appendChild(cardTitle)
    card.appendChild(iconImg)
    card.appendChild(temp)
    card.appendChild(wind)
    card.appendChild(humidity)
    forcastWeatherEl.appendChild(card)
  })
}

const storeSearch = (input) => {
  searchHistory.push(input)

  localStorage.setItem('search-history', searchHistory)
}

const getHistory = () => {
  cityListEl.textContent = ''

  let storedHistory = localStorage.getItem('search-history')

  if(storedHistory) {
    searchHistory = storedHistory.split(',')
  }
  for(let i = 0; i < searchHistory.length; i++) {
    let citiesEl = document.createElement('button')
    citiesEl.classList.add('btn', 'mb-3', 'city-buttons')
    citiesEl.textContent = searchHistory[i]
    cityListEl.append(citiesEl)
  }
}

const clearHistory = () => {
  localStorage.removeItem('search-history')
  searchHistory = []
  cityListEl.textContent = ""
}

getHistory()

userFormEl.addEventListener("submit", formSubmitHandler)
cityListEl.addEventListener('click', (e) => {
  let city = e.target.textContent
  getCoordinates(city)
})
clearListEl.addEventListener('click', clearHistory)
