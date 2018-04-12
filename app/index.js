console.log("Weather & Forecast Started");

/*
 * Entry point for the watch app
 */
import document from "document";

import * as messaging from "messaging";
import { display } from "display";
import { preferences } from "user-settings";

import * as util from "../common/utils";

import { me as device } from "device";
if (!device.screen) device.screen = { width: 348, height: 250 };
console.log(`Dimensions: ${device.screen.width}x${device.screen.height}`);

let loadingScreen = document.getElementById("loadingScreen");
let loadingText = document.getElementById("loadingText");
loadingText.text = "Downloading Weather..."
let weatherScreen = document.getElementById("weatherScreen");

let todayHeader = document.getElementById("todayHeader");
let todayDescription = document.getElementById("todayDescription");

let todayWeatherImage = document.getElementById("todayWeatherImage");
let todayTemperature = document.getElementById("todayTemperature");
let todayHigh = document.getElementById("todayHigh");
let todayHighVal = document.getElementById("todayHighVal");
let todayLow = document.getElementById("todayLow");
let todayLowVal = document.getElementById("todayLowVal");

let todayWind = document.getElementById("todayWind");
let windDirection = document.getElementById("windDirection");
let todayWindSpeed = document.getElementById("todayWindSpeed");
let todayWindChill = document.getElementById("todayWindChill");

let todayHumidity = document.getElementById("todayHumidity");
let humidityRising = document.getElementById("humidityRising");
let humidityRisingImage = document.getElementById("humidityRisingImage");
let pressure = document.getElementById("pressure");
let visibility = document.getElementById("visibility");


//-------Day 2--------------
let day2Header = document.getElementById("day2Header");
let tomorrowDescription = document.getElementById("tomorrowDescription");

let tomorrowWeatherImage = document.getElementById("tomorrowWeatherImage");
let tomorrowHigh = document.getElementById("tomorrowHigh");
let tomorrowHighVal = document.getElementById("tomorrowHighVal");
let tomorrowLow = document.getElementById("tomorrowLow");
let tomorrowLowVal = document.getElementById("tomorrowLowVal");

//-------Day 3--------------
let day3Header = document.getElementById("day3Header");
let day3Description = document.getElementById("day3Description");

let day3WeatherImage = document.getElementById("day3WeatherImage");
let day3High = document.getElementById("day3High");
let day3HighVal = document.getElementById("day3HighVal");
let day3Low = document.getElementById("day3Low");
let day3LowVal = document.getElementById("day3LowVal");

//-------Day 4--------------
let day4Header = document.getElementById("day4Header");
let day4Description = document.getElementById("day4Description");

let day4WeatherImage = document.getElementById("day4WeatherImage");
let day4High = document.getElementById("day4High");
let day4HighVal = document.getElementById("day4HighVal");
let day4Low = document.getElementById("day4Low");
let day4LowVal = document.getElementById("day4LowVal");

//-------Day 5--------------
let day5Header = document.getElementById("day5Header");
let day5Description = document.getElementById("day5Description");

let day5WeatherImage = document.getElementById("day5WeatherImage");
let day5High = document.getElementById("day5High");
let day5HighVal = document.getElementById("day5HighVal");
let day5Low = document.getElementById("day5Low");
let day5LowVal = document.getElementById("day5LowVal");


messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "unitToggle" && evt.data.newValue) {
    let degreesF = !JSON.parse(evt.data.newValue);
    console.log(`Fahrenheit: ${degreesF}`);
    if (degreesF)
      weather.setUnit('f')
    else
      weather.setUnit('c')
    weather.setMaximumAge(0); 
    weather.fetch();
    weather.setMaximumAge(1 * 60 * 1000); 
  }
}

//----------------Weather Setup------------------------
import Weather from '../common/weather/device';

let weather = new Weather();
weather.setProvider("yahoo"); 
weather.setApiKey("dj0yJmk9TTkyWW5SNG5rT0JOJmQ9WVdrOVRVMURkRmhhTlRBbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD00MA--");
weather.setMaximumAge(1 * 60 * 1000); 
weather.setFeelsLike(false);

weather.onsuccess = (data) => {
  weatherScreen.style.display = "inline";
  loadingScreen.style.display = "none";
  console.log("Weather is " + JSON.stringify(data));
  
  let today = new Date();
  let day = today.getDay();
  
  //------------Today----------------
  todayHeader.text = "Today";
  todayWeatherImage.href = util.getForecastIcon(data.condition,
                                                data.description);
  todayDescription.text = data.description;
  todayTemperature.text = "Temperature: " + data.temperature + "°"
  todayHigh.text = "High:"
  todayHighVal.text = data.todayHigh + "°"
  todayLow.text = "Low:"
  todayLowVal.text = data.todayLow + "°"
  
  todayWind.text = "Wind:"
  windDirection.groupTransform.rotate.angle = data.windDirection;
  todayWindSpeed.text = "Speed: " + data.windSpeed + " " + data.windUnit
  todayWindChill.text = "Chill: " + data.windChill + "°"
  
  todayHumidity.text = "Humidity: " + data.humidity + "%";
  switch(data.humidityRising){
    case 0:
      humidityRisingImage.href = "icons/weather/dash.png";
      console.log(humidityRisingImage.href);
      break;
    case 1:
      humidityRising.groupTransform.rotate.angle = 0;
      humidityRisingImage.href = "icons/weather/windArrow.png";
      break;
    case 2:
      humidityRising.groupTransform.rotate.angle = 180;
      humidityRisingImage.href = "icons/weather/windArrow.png";
      break;
  }
  pressure.text = "Pressure: " + data.pressure + " " + data.pressureUnit;
  visibility.text = "Visibility: " + data.visibility + " " + data.visibilityUnit;
  
  //--------------Day 2--------------
  day2Header.text = util.toDay(day+1, "long");
  tomorrowWeatherImage.href = util.getForecastIcon(data.tomorrowCondition,
                                                   data.tomorrowdescription);
  tomorrowDescription.text = data.tomorrowDescription;
  tomorrowHigh.text = "High:"
  tomorrowHighVal.text = data.tomorrowHigh + "°"
  tomorrowLow.text = "Low:"
  tomorrowLowVal.text = data.tomorrowLow + "°"
  
  //--------------Day 3--------------
  day3Header.text = util.toDay(day+2, "long");
  day3WeatherImage.href = util.getForecastIcon(data.day3Condition,
                                                   data.day3description);
  day3Description.text = data.day3Description;
  day3High.text = "High:"
  day3HighVal.text = data.day3High + "°"
  day3Low.text = "Low:"
  day3LowVal.text = data.day3Low + "°"
  
  //--------------Day 4--------------
  day4Header.text = util.toDay(day+3, "long");
  day4WeatherImage.href = util.getForecastIcon(data.day4Condition,
                                                   data.day4description);
  day4Description.text = data.day4Description;
  day4High.text = "High:"
  day4HighVal.text = data.day4High + "°"
  day4Low.text = "Low:"
  day4LowVal.text = data.day4Low + "°"
  
  //--------------Day 5--------------
  day5Header.text = util.toDay(day+4, "long");
  day5WeatherImage.href = util.getForecastIcon(data.day5Condition,
                                                   data.day5description);
  day5Description.text = data.day5Description;
  day5High.text = "High:"
  day5HighVal.text = data.day5High + "°"
  day5Low.text = "Low:"
  day5LowVal.text = data.day5Low + "°"
}

weather.onerror = (error) => {
  console.log("Weather error " + JSON.stringify(error));
}

weather.fetch();
