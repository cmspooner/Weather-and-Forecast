

/*
 * Entry point for the watch app
 */
import { me } from "appbit";
import document from "document";
import * as fs from "fs";

import * as messaging from "messaging";
import { display } from "display";
import { preferences } from "user-settings";
import { units } from "user-settings";

import * as util from "../common/utils";

import { me as device } from "device";
if (!device.screen) device.screen = { width: 348, height: 250 };

let background = document.getElementById("clickbg");

let settings = loadSettings();
let weatherData = loadWeather();
if (weatherData == null){
  drawLoadingScreen();
} else {
  drawLoadingWeather();
}

//fs.unlinkSync(SETTINGS_FILE);

var clkMsgs =["Forcing Download",
              "Trying again",
              "Really trying this time",
              "Maybe This Will Work",
              "How about now?",
              "Try syncing your phone",
              "Maybe reboot your phone?",
              "Email the Dev!"];
var msg = 0;

messaging.peerSocket.onopen = function() {
  weather.fetch();
}

messaging.peerSocket.onmessage = evt => {
  if (evt.data.key === "unitToggle" && evt.data.newValue) {
    let degreesF = !JSON.parse(evt.data.newValue);
    console.log(`Fahrenheit: ${degreesF}`);
    var oldUnit = settings.unit;
    if (degreesF)
      settings.unit = 'f';
    else
      settings.unit = 'c';
    if (oldUnit != settings.unit){
      applySettings(settings)
      weather.setMaximumAge(0); 
      weather.fetch();
      weather.setMaximumAge(10 * 60 * 1000); 
    }
  }
  if (evt.data.key === "distUnitToggle" && evt.data.newValue) {
    settings.forceDist = JSON.parse(evt.data.newValue);
    console.log(`Force Distance: ${settings.forceDist}`);
    if (weatherData)
      drawWeather(weatherData);
  }
  if (evt.data.key === "color" && evt.data.newValue) {
    settings.color = JSON.parse(evt.data.newValue);
    console.log("New Color: " + settings.color);
    applySettings(settings);
  }
  if (evt.data.key === "apiKey" && evt.data.newValue) {
    let inputText = JSON.parse(evt.data.newValue);
    settings.apiKey = inputText.name;
    applySettings(settings);
  }
  saveSettings();
}

//----------------Weather Setup------------------------
import Weather from '../common/weather/device';

let weather = new Weather();
weather.setProvider("accuWeather");
weather.setApiKey(settings.apiKey); //dev "pAmZzAyNvGJG4XCwv4ty3fCCRz8rhhLM" //prod xsV6jaZaDKlFaGTxkWJjABsudnIYkIk7
weather.setMaximumAge(10 * 60 * 1000); 
weather.setFeelsLike(true);
weather.setUnit(units.temperature.toLowerCase());
if (!settings.unit)
  settings.unit = units.temperature.toLowerCase();
applySettings(settings);

weather.onsuccess = (data) => {
  drawLoadedWeather(data);
}

function drawLoadedWeather(data){
  let todayHeader = document.getElementById("todayHeader");
  weatherData = data;
  todayHeader.text = "Currently";

  drawWeather(data);
}
  
function drawLoadingScreen(){
  let loadingText1 = document.getElementById("loadingText1");
  let loadingText2 = document.getElementById("loadingText2");
  let loadingText3 = document.getElementById("loadingText3");

  loadingText1.text = "Downloading"
  loadingText2.text = "Weather"
  loadingText3.text = "Click to Force Update"
}

function drawLoadingWeather(){
  let todayHeader = document.getElementById("todayHeader");
  
  let today = new Date()
  let timeStamp = new Date(weatherData.timestamp);
  if (timeStamp.getDate()!=today.getDate())
    timeStamp = timeStamp.getMonth()+1+"/"+timeStamp.getDate()
  else
    timeStamp = util.hourAndMinToTime(timeStamp.getHours(), timeStamp.getMinutes());
  //weatherData.location += " as of " + timeStamp;
  todayHeader.text = "As of " + timeStamp;
  drawWeather(weatherData);
}
  
function drawWeather(data){
  let loadingScreen = document.getElementById("loadingScreen");
  let weatherScreen = document.getElementById("weatherScreen");
  
  let locationHeader = document.getElementById("locationHeader");

  let seperatorBar = document.getElementById("seperatorBar");

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

  let sunRise = document.getElementById("sunRise");
  let sunSet = document.getElementById("sunSet");

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

  
  weatherScreen.style.display = "inline";
  loadingScreen.style.display = "none";
  
  let today = new Date();
  let day = today.getDay();
  
  locationHeader.text = data.location;
  
  //------------Today----------------
  //todayHeader.text = "Today";
  todayWeatherImage.href = util.getWeatherIcon(data);
  todayDescription.text = util.shortenText(data.description);
  todayTemperature.text = "Temperature: " + data.temperature + "°"
  todayHigh.text = "High:"
  todayHighVal.text = data.todayHigh + "°"
  todayLow.text = "Low:"
  todayLowVal.text = data.todayLow + "°"
  
  todayWind.text = "Wind:"
  windDirection.groupTransform.rotate.angle = data.windDirection;
  if (settings.forceDist && data.windUnit == 'km/h')
    todayWindSpeed.text = "Speed: " + util.round2(data.windSpeed * 0.621371) + " " + "mph";
  else
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
  pressure.text = "Pressure: " + util.round2(data.pressure*0.0295301) + " " + data.pressureUnit;
  if (settings.forceDist && data.visibilityUnit == "km")
    visibility.text = "Visibility: " + util.round2(data.visibility *  0.621371) + " " + "mi";
  else
    visibility.text = "Visibility: " + data.visibility + " " + data.visibilityUnit;
  
  let sunR = new Date(data.sunrise);
  let sunRH = sunR.getHours();
  let sunRM = util.zeroPad(sunR.getMinutes());
  let Rampm = " am"
  if (preferences.clockDisplay == "12h"){
    if (sunRH > 12){
      Rampm = " pm";
      sunRH -= 12;
    } else if (sunRH == 12){
      Rampm = " pm"
    }else if (sunRH == 0 && Rampm == " am"){
      sunRH += 12;
    }
  } else {
    Rampm = ""
  }
  let sunS = new Date(data.sunset);
  let sunSH = sunS.getHours();
  let sunSM = util.zeroPad(sunS.getMinutes());
  let Sampm = " am"
  if (preferences.clockDisplay == "12h"){
    if (sunSH > 12){
      Sampm = " pm";
      sunSH -= 12;
    } else if (sunSH == 12){
      Rampm = " pm"
    }else if (sunSH == 0 && Sampm == " am"){
      sunSH += 12;
    }
  } else {
    Sampm = ""
  }
  
  if (preferences.clockDisplay == "12h"){
    sunRise.text = "Sun Rise: " + sunRH + ":" + sunRM + " " + Rampm;
    sunSet.text = "Sun Set: " + sunSH + ":" + sunSM + " " + Sampm;
  } else {
    sunRise.text = "Sun Rise: " + sunRH + ":" + sunRM ;
    sunSet.text = "Sun Set: " + sunSH + ":" + sunRM ;
  }

  
  //--------------Day 2--------------
  day2Header.text = util.toDay(day+1, "long");
  tomorrowWeatherImage.href = util.getForecastIcon(data.tomorrowCondition,
                                                   data.tomorrowDescription);
  tomorrowDescription.text = util.shortenText(data.tomorrowDescription);
  tomorrowHigh.text = "High:"
  tomorrowHighVal.text = data.tomorrowHigh + "°"
  tomorrowLow.text = "Low:"
  tomorrowLowVal.text = data.tomorrowLow + "°"
  
  //--------------Day 3--------------
  day3Header.text = util.toDay(day+2, "long");
  day3WeatherImage.href = util.getForecastIcon(data.day3Condition,
                                                   data.day3Description);
  day3Description.text = util.shortenText(data.day3Description);
  day3High.text = "High:"
  day3HighVal.text = data.day3High + "°"
  day3Low.text = "Low:"
  day3LowVal.text = data.day3Low + "°"
  
  //--------------Day 4--------------
  day4Header.text = util.toDay(day+3, "long");
  day4WeatherImage.href = util.getForecastIcon(data.day4Condition,
                                                   data.day4Description);
  day4Description.text = util.shortenText(data.day4Description);
  day4High.text = "High:"
  day4HighVal.text = data.day4High + "°"
  day4Low.text = "Low:"
  day4LowVal.text = data.day4Low + "°"
  
  //--------------Day 5--------------
  day5Header.text = util.toDay(day+4, "long");
  day5WeatherImage.href = util.getForecastIcon(data.day5Condition,
                                                   data.day5Description);
  day5Description.text = util.shortenText(data.day5Description);
  day5High.text = "High:"
  day5HighVal.text = data.day5High + "°"
  day5Low.text = "Low:"
  day5LowVal.text = data.day5Low + "°"
}

weather.onerror = (error) => {
  let loadingText1 = document.getElementById("loadingText1");
  let loadingText2 = document.getElementById("loadingText2");
  let loadingText3 = document.getElementById("loadingText3");
  console.log("Weather error " + JSON.stringify(error));
  loadingText1.text = "Update Failed!";
  loadingText2.text = "Click to Try Again";
  
}
function applySettings(settings){
  let seperatorBar = document.getElementById("seperatorBar");
  weather.setUnit(settings.unit);
  weather.setApiKey(settings.apiKey);
  seperatorBar.style.fill = settings.color;
}

background.onclick = function(evt) {
  console.log("Click");
  let loadingText1 = document.getElementById("loadingText1");
  let loadingText2 = document.getElementById("loadingText2");
  let loadingText3 = document.getElementById("loadingText3");
  
  loadingText1.text = "Downloading";
  loadingText2.text = "Weather";
  loadingText3.text = clkMsgs[msg];
  if (msg < clkMsgs.length-1)
    msg++;
  weather.fetch();
}

me.onunload = saveSettings;

function loadSettings() {
  const SETTINGS_TYPE = "cbor";
  const SETTINGS_FILE = "settings.cbor";
  
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    // Defaults
    return {
      unit      : units.temperature.toLowerCase(),
      forceDist : false,
      color     : 'steelblue'
    }
  }
}

function loadWeather(){
  const SETTINGS_TYPE = "cbor";
  const WEATHER_FILE = "weather.cbor";
  
  try {
    return fs.readFileSync(WEATHER_FILE, SETTINGS_TYPE);
  } catch (ex) {
    // Defaults
    return null;
  }
}

function saveSettings() {
  const SETTINGS_TYPE = "cbor";
  const SETTINGS_FILE = "settings.cbor";
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
  saveWeather();
}

function saveWeather() {
  const SETTINGS_TYPE = "cbor";
  const WEATHER_FILE = "weather.cbor";

  fs.writeFileSync(WEATHER_FILE, weatherData, SETTINGS_TYPE);
}
