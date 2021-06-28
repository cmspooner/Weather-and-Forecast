import { peerSocket } from "messaging";
import { geolocation } from "geolocation";
import { outbox } from "file-transfer";
import * as cbor from "cbor";

import { WEATHER_MESSAGE_KEY, WEATHER_DATA_FILE, WEATHER_ERROR_FILE, Conditions } from './common.js';

export default class Weather {

  constructor() {
    this._apiKey = '';
    this._provider = '';
    this._feelsLike = true;
    this._weather = undefined;
    this._maximumAge = 0;
    this._unit = 'f'

    this.onerror = undefined;
    this.onsuccess = undefined;

    peerSocket.addEventListener("message", (evt) => {
      // We are receiving a request from the app
      if (evt.data !== undefined && evt.data[WEATHER_MESSAGE_KEY] !== undefined) {
        let message = evt.data[WEATHER_MESSAGE_KEY];
        prv_fetchRemote(message.provider, message.apiKey, message.feelsLike, message.unit);
      }
    });
  }

  setApiKey(apiKey) {
    this._apiKey = apiKey;
  }

  setUnit(unit){
    if (unit == "f")
      this._unit = 'f';
    else
      this._unit = 'c';
  }

  setProvider(provider) {
    this._provider = provider;
  }

  setFeelsLike(feelsLike) {
    this._feelsLike = feelsLike;
  }

  setMaximumAge(maximumAge) {
    this._maximumAge = maximumAge;
  }

  fetch() {
    let now = new Date().getTime();
    if(this._weather !== undefined && this._weather.timestamp !== undefined && (now - this._weather.timestamp < this._maximumAge)) {
      // return previous weather if the maximu age is not reached
      if(this.onsuccess) this.onsuccess(this._weather);
      return;
    }

    geolocation.getCurrentPosition(
      (position) => {
        //console.log("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
        prv_fetch(this._provider, this._apiKey, this._feelsLike, this_.unit, position.coords.latitude, position.coords.longitude,
              (data) => {
                this._weather = data;
                if(this.onsuccess) this.onsuccess(data);
              },
              this.onerror);
      },
      (error) => {
        if(this.onerror) this.onerror(error);
      },
      {"enableHighAccuracy" : false, "maximumAge" : 1000 * 1800});
  }
};

/*******************************************/
/*********** PRIVATE FUNCTIONS  ************/
/*******************************************/

function prv_fetchRemote(provider, apiKey, feelsLike, unit) {
  geolocation.getCurrentPosition(
    (position) => {
      prv_fetch(provider, apiKey, feelsLike, unit, position.coords.latitude, position.coords.longitude,
          (data) => {
            data.provider = provider;
            outbox
              .enqueue(WEATHER_DATA_FILE, cbor.encode(data))
              .catch(error => console.log("Failed to send weather: " + error));
          },
          (error) => {
            outbox
              .enqueue(WEATHER_ERROR_FILE, cbor.encode({ error : error }))
              .catch(error => console.log("Failed to send weather error: " + error));
          }
      );
    },
    (error) => {
      outbox
        .enqueue(WEATHER_ERROR_FILE, cbor.encode({ error : error }))
        .catch(error => console.log("Failed to send weather error: " + error));
    },
    {"enableHighAccuracy" : false, "maximumAge" : 1000 * 1800});
}

function prv_fetch(provider, apiKey, feelsLike, unit, latitude, longitude, success, error) {
  if( provider === "wunderground" ) {
    prv_queryWUWeather(apiKey, feelsLike, latitude, longitude, success, error);
  }
  else if (provider === "omw") {
    prv_queryOWMWeather(apiKey, latitude, longitude, success, error);
  } else {
    //prv_queryAccuWeather(apiKey, feelsLike, latitude, longitude, unit, success, error);
    var accuWeatherMetricUnit = false;
    if (unit === 'c') {
      accuWeatherMetricUnit=true;
    }

    getAccuWeatherLocation(apiKey, latitude, longitude, error).then(locationData => {
      getAccuWeatherCurrentConditions(apiKey, feelsLike, locationData.key, accuWeatherMetricUnit, error).then(currentConditions => {
        getAccuWeatherResults(apiKey, feelsLike, accuWeatherMetricUnit, locationData, currentConditions, success, error);
      })
    });
  }
}

function getAccuWeatherLocation(apiKey, latitude, longitude, error) {
  //43.6420965828,-79.3734772147
  //https://developer.accuweather.com/accuweather-locations-api/apis/get/locations/v1/cities/geoposition/search
  return fetch('https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=' + apiKey + '&q=43.6420965828,-79.3734772147')
    .then((response) => {return response.json()})
    .then((data) => {

      if(data === undefined) {
        if(error) {
          error(data);
        }
        return;
      }
      return {
        key: data.Key, //3393497
        localizedName: data.LocalizedName, //Waterfront Communities
      }

    })
  .catch((err) => {
    if(error) error(err);
  });
}

//https://developer.accuweather.com/weather-icons
function convertAccuWeatherIconToCondition(icon) {
  switch(parseInt(icon)) {
    case 1:
    case 2:
    case 33:
    case 34: return Conditions.ClearSky; break;
    case 3:
    case 35: return Conditions.Conditions.FewClouds; break;
    case 4:
    case 36: return Conditions.ScatteredClouds;  break;
    case 6:
    case 7:
    case 38: return Conditions.BrokenClouds;  break;
    case 12:
    case 13:
    case 14:
    case 39:
    case 40: return Conditions.ShowerRain;  break;
    case 18: return Conditions.Rain; break;
    case 15:
    case 16:
    case 17:
    case 41:
    case 42: return Conditions.Thunderstorm; break;
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
    case 25:
    case 26:
    case 29:
    case 43:
    case 44: return Conditions.Snow; break;
    case 5:
    case 8:
    case 11:
    case 37: return Conditions.Mist; break;
    default: return Conditions.Unknown; break;
  }
}

function getAccuWeatherCurrentConditions(apiKey, feelsLike, locationKey, accuWeatherMetricUnit, error) {
  //https://developer.accuweather.com/accuweather-current-conditions-api/apis/get/currentconditions/v1/%7BlocationKey%7D
  return fetch('https://dataservice.accuweather.com/currentconditions/v1/' + locationKey + '?apikey=' + apiKey + '&details=true')
    .then((response) => {return response.json()})
    .then((data) => {
  
      if(data[0] === undefined) {
        if(error) {
          error(data);
        }
        return;
      }

      var temp = data[0].RealFeelTemperature.Metric.Value;
      if (feelsLike) {
        temp = accuWeatherMetricUnit ? data[0].RealFeelTemperature.Metric.Value : [0].RealFeelTemperature.Imperial.Value;
      } else {
        temp = accuWeatherMetricUnit ? data[0].Temperature.Metric.Value : [0].Temperature.Imperial.Value;
      }

      return {
        condition: getSimpleCondition(convertAccuWeatherIconToCondition(data[0].WeatherIcon)),
        conditionText: data[0].WeatherText,
        isDay: data[0].IsDayTime,
        temp: temp,
        
        windSpeed: parseFloat(accuWeatherMetricUnit ? data[0].Wind.Speed.Metric.Value : data[0].Wind.Speed.Imperial.Value),
        windUnit: accuWeatherMetricUnit ? data[0].Wind.Speed.Metric.Unit : data[0].Wind.Speed.Imperial.Unit,
        windDirection: parseInt(data[0].Wind.Direction.Degrees),
        windChill: parseInt(accuWeatherMetricUnit ? data[0].WindChillTemperature.Metric.Value : data[0].WindChillTemperature.Imperial.Value),

        humidity: parseInt(data[0].RelativeHumidity),
        //humidityRising: parseInt(1),
        pressure: parseFloat(accuWeatherMetricUnit ? data[0].Pressure.Metric.Value : data[0].Pressure.Imperial.Value),
        pressureUnit: accuWeatherMetricUnit ? data[0].Pressure.Metric.Unit : data[0].Pressure.Imperial.Unit,
        visibility: parseFloat(accuWeatherMetricUnit ? data[0].Visibility.Metric.Value : data[0].Visibility.Imperial.Value),
        visibilityUnit: accuWeatherMetricUnit ? data[0].Visibility.Metric.Unit : data[0].Visibility.Imperial.Unit,
        timestamp: Date(Date.parse(data[0].LocalObservationDateTime)),
      }
  })
  .catch((err) => {
    if(error) error(err);
  });
}

function getAccuWeatherResults(apiKey, feelsLike, accuWeatherMetricUnit, locationData, currentConditions, success, error) {
  //https://developer.accuweather.com/accuweather-forecast-api/apis/get/forecasts/v1/daily/5day/%7BlocationKey%7D
  fetch('https://dataservice.accuweather.com/forecasts/v1/daily/5day/' + locationData.key + '?apikey=' + apiKey + '&details=true&metric=' + accuWeatherMetricUnit)
    .then((response) => {return response.json()})
    .then((data) => {
  
      if(data.DailyForecasts === undefined) {
        if(error) {
          error(data);
        }
        return;
      }

      let todayHigh = parseInt(feelsLike ? data.DailyForecasts[0].RealFeelTemperature.Maximum.Value : data.DailyForecasts[0].Temperature.Maximum.Value);
      let todayLow = parseInt(feelsLike ? data.DailyForecasts[0].RealFeelTemperature.Minimum.Value : data.DailyForecasts[0].Temperature.Minimum.Value);
      let tomorrowHigh = parseInt(feelsLike ? data.DailyForecasts[1].RealFeelTemperature.Maximum.Value : data.DailyForecasts[1].Temperature.Maximum.Value);
      let tomorrowLow = parseInt(feelsLike ? data.DailyForecasts[1].RealFeelTemperature.Minimum.Value : data.DailyForecasts[1].Temperature.Minimum.Value);
      let day3High = parseInt(feelsLike ? data.DailyForecasts[2].RealFeelTemperature.Maximum.Value : data.DailyForecasts[2].Temperature.Maximum.Value);
      let day3Low = parseInt(feelsLike ? data.DailyForecasts[2].RealFeelTemperature.Minimum.Value : data.DailyForecasts[2].Temperature.Minimum.Value);
      let day4High = parseInt(feelsLike ? data.DailyForecasts[3].RealFeelTemperature.Maximum.Value : data.DailyForecasts[3].Temperature.Maximum.Value);
      let day4Low = parseInt(feelsLike ? data.DailyForecasts[3].RealFeelTemperature.Minimum.Value : data.DailyForecasts[3].Temperature.Minimum.Value);
      let day5High = parseInt(feelsLike ? data.DailyForecasts[4].RealFeelTemperature.Maximum.Value : data.DailyForecasts[4].Temperature.Maximum.Value);
      let day5Low = parseInt(feelsLike ? data.DailyForecasts[4].RealFeelTemperature.Minimum.Value : data.DailyForecasts[4].Temperature.Minimum.Value);

      let weather = {
        temperature: parseInt(currentConditions.temp),
        location: locationData.localizedName,
        description: currentConditions.conditionText,
        isDay: currentConditions.isDay,
        condition: currentConditions.condition,

        windSpeed: currentConditions.windSpeed,
        windUnit: currentConditions.windUnit,
        windDirection: currentConditions.windDirection,
        windChill: currentConditions.windChill,

        humidity: currentConditions.humidity,
        humidityRising: currentConditions.humidityRising,
        pressure: currentConditions.pressure,
        pressureUnit: currentConditions.pressureUnit,
        visibility: currentConditions.visibility,
        visibilityUnit: currentConditions.visibilityUnit,

        sunrise: data.DailyForecasts[0].Sun.Rise,
        sunset: data.DailyForecasts[0].Sun.Set,
        timestamp: currentConditions.timestamp,
        
        //todayDate: "Today",
        todayHigh: todayHigh,
        todayLow: todayLow,
        todayCondition: getSimpleCondition(currentConditions.condition),
        todayDescription: currentConditions.conditionText,

        tomorrowDate: data.DailyForecasts[1].Date,
        tomorrowHigh: tomorrowHigh,
        tomorrowLow: tomorrowLow,
        tomorrowCondition: getSimpleCondition(convertAccuWeatherIconToCondition(data.DailyForecasts[1].Day.Icon)),
        tomorrowDescription: data.DailyForecasts[1].Day.ShortPhrase,

        day3Date: data.DailyForecasts[2].Date,
        day3High: day3High,
        day3Low: day3Low,
        day3Condition: getSimpleCondition(convertAccuWeatherIconToCondition(data.DailyForecasts[2].Day.Icon)),
        day3Description: data.DailyForecasts[2].Day.ShortPhrase,

        day4Date: data.DailyForecasts[3].Date,
        day4High: day4High,
        day4Low: day4High,
        day4Condition: getSimpleCondition(convertAccuWeatherIconToCondition(data.DailyForecasts[3].Day.Icon)),
        day4Description: data.DailyForecasts[3].Day.ShortPhrase,

        day5Date: data.DailyForecasts[4].Date,
        day5High: day5High,
        day5Low: day5Low,
        day5Condition: getSimpleCondition(convertAccuWeatherIconToCondition(data.DailyForecasts[4].Day.Icon)),
        day5Description: data.DailyForecasts[4].Day.ShortPhrase,
      };
      // Send the weather data to the device
      if(success) success(weather);
    })
  .catch((err) => {
    if(error) error(err);
  });
}

function prv_queryOWMWeather(apiKey, latitude, longitude, success, error) {
  var url = 'https://api.openweathermap.org/data/2.5/weather?appid=' + 'apiKey' + '&lat=' + latitude + '&lon=' + longitude;
console.log(url);
  fetch(url)
  .then((response) => {return response.json()})
  .then((data) => {

      if(data.weather === undefined){
        if(error) error(data);
        return;
      }

      var condition = parseInt(data.weather[0].icon.substring(0,2), 10);
      switch(condition){
        case 1 :  condition = Conditions.ClearSky; break;
        case 2 :  condition = Conditions.FewClouds;  break;
        case 3 :  condition = Conditions.ScatteredClouds;  break;
        case 4 :  condition = Conditions.BrokenClouds;  break;
        case 9 :  condition = Conditions.ShowerRain;  break;
        case 10 : condition = Conditions.Rain; break;
        case 11 : condition = Conditions.Thunderstorm; break;
        case 13 : condition = Conditions.Snow; break;
        case 50 : condition = Conditions.Mist; break;
        default : condition = Conditions.Unknown; break;
      }
      let weather = {
        //temperatureK : data.main.temp.toFixed(1),
        temperatureC : data.main.temp - 273.15,
        temperatureF : (data.main.temp - 273.15)*9/5 + 32,
        location : data.name,
        description : data.weather[0].description,
        isDay : (data.dt > data.sys.sunrise && data.dt < data.sys.sunset),
        conditionCode : condition,
        sunrise : data.sys.sunrise * 1000,
        sunset : data.sys.sunset * 1000,
        timestamp : new Date().getTime()
      };
      // Send the weather data to the device
      if(success) success(weather);
  })
  .catch((err) => { if(error) error(err); });
};

function prv_queryWUWeather(apiKey, feelsLike, latitude, longitude, success, error) {
  var url = 'https://api.wunderground.com/api/' + apiKey + '/conditions/q/' + latitude + ',' + longitude + '.json';

  fetch(url)
  .then((response) => {return response.json()})
  .then((data) => {

      if(data.current_observation === undefined){
        if(error) error(data);
        return;
      }

      var condition = data.current_observation.icon;
      if(condition === 'clear'){
        condition = Conditions.ClearSky;
      }
      else if(condition === 'mostlysunny' || condition === 'partlycloudy'){
        condition = Conditions.FewClouds;
      }
      else if(condition === 'partlysunny' || condition === 'mostlycloudy'){
        condition = Conditions.ScatteredClouds;
      }
      else if(condition === 'cloudy'){
        condition = Conditions.BrokenClouds;
      }
      else if(condition === 'rain'){
        condition = Conditions.Rain;
      }
      else if(condition === 'tstorm'){
        condition = Conditions.Thunderstorm;
      }
      else if(condition === 'snow' || condition === 'sleet' || condition === 'flurries'){
        condition = Conditions.Snow;
      }
      else if(condition === 'fog' || condition === 'hazy'){
        condition = Conditions.Mist;
      }
      else {
        condition = Conditions.Unknown;
      }

      var temp = feelsLike ? parseFloat(data.current_observation.feelslike_c) : data.current_observation.temp_c;

      let weather = {
        //temperatureK : (temp + 273.15).toFixed(1),
        temperatureC : temp,
        temperatureF : (temp*9/5 + 32),
        location : data.current_observation.display_location.city,
        description : data.current_observation.weather,
        isDay : data.current_observation.icon_url.indexOf("nt_") == -1,
        conditionCode :condition,
        sunrise : 0,
        sunset : 0,
        timestamp : new Date().getTime()
      };
      // Send the weather data to the device
      if(success) success(weather);
  })
  .catch((err) => { if(error) error(err); });
};

function getSimpleCondition(c){
  if (c === undefined) {
    return Conditions.Unknown;
  }
  switch(c){
        case 31 :
        case 32 :
        case 33 :
        case 34 :
          return Conditions.ClearSky;  break;
        case 29 :
        case 30 :
        case 44 :
          return Conditions.FewClouds;  break;
        case 8 :
        case 9 :
          return Conditions.ShowerRain;  break;
        case 6 :
        case 10 :
        case 11 :
        case 12 :
        case 35 :
        case 40 :
          return Conditions.Rain; break;
        case 1 :
        case 3 :
        case 4 :
        case 37 :
        case 38 :
        case 39 :
        case 47 :
          return Conditions.Thunderstorm; break;
        case 5 :
        case 7 :
        case 13 :
        case 14 :
        case 15 :
        case 16 :
        case 41 :
        case 42 :
        case 43 :
          return Conditions.Snow; break;
        case 20 :
          return Conditions.Mist; break;
        case 26 :
        case 27 :
        case 28 :
          return Conditions.BrokenClouds; break;
        default :
          return Conditions.Unknown; break;
      }
}