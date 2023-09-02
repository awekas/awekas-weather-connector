/*
/**
 *
 *      ioBroker AWEKAS weather data connector
 *
 *      (c) 2023 AWEKAS Gmbh
 *      MIT License
 *      Versio  0.0.4
 *
 *  The adapter provides the ability to query live weather data and a forecast from an AWEKAS weather station. 
 *  To do this, the AWEKAS API key, which can be found on the website https://my.awekas.at in the Additional section, must be entered. 
 *  Please note the information on the AWEKAS Stations API at:
 *  https://www.awekas.at/for2/index.php?thread/17080-software-api-stations-api-beschreibung/
 */

"use strict";

const utils = require("@iobroker/adapter-core");
const axios = require("axios");

let APIrequestIntervall = 30000; // Intervall to collect data in ms (30000 = 30s) - do not use value below 15000!

let language = null;
let intervalID;
let timer = APIrequestIntervall;
class AwekasWeatherConnector extends utils.Adapter {
  /**
   * @param {Partial<utils.AdapterOptions>} [options={}]
   */
  constructor(options) {
    super({
      ...options,
      name: "awekas-weather-connector",
    });
    this.on("ready", this.onReady.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
    // this.on("objectChange", this.onObjectChange.bind(this));
    // this.on("message", this.onMessage.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
 
  onReady() {
    let adapter = this;

    // initialize adapter

    adapter.log.info("AWEKAS weather connector started...");

    // get language from ioBroker
    adapter.getForeignObject("system.config", (err, systemConfig) => {
      language = systemConfig.common.language;
      if (
        language != "de" &&
        language != "en" &&
        languega != "fr" &&
        language != "es" &&
        language != "nl"
      ) {
        language = "en";
      }
      return language;
    });

    // Create ioBroker objects
    adapter.createObject(adapter);

    // run cyclic requests for values every 30 sek
    adapter.setTimer(adapter);
  }

  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   * @param {() => void} callback
   */
  onUnload(callback) {
    try {
      // Here you must clear all timeouts or intervals that may still be active
      clearInterval(intervalID);

      callback();
    } catch (e) {
      callback();
    }
  }

  /**
   * Is called if a subscribed state changes
   * @param {string} id
   * @param {ioBroker.State | null | undefined} state
   */
  onStateChange(id, state) {
    if (state) {
    } else {
    }
  }
  
 requestData(adapter) {
    // fetch data from AWEKAS API server
    let url = "https://api.awekas.at/current.php?key=";

    if (adapter.config.token == "" || adapter.config.token == undefined) {
      adapter.log.error("no API Key set!");
    } else {
      //adapter.log.info('REQUEST: '+ url + adapter.config.token + "&lng=" + language);

        axios
        .get(url + adapter.config.token + "&lng=" + language)
        .then( async function (response) {
          if (response.status == 200) {
            //adapter.log.info('Response :'  + JSON.stringify(response.data));
            try {
              let obj = response.data;
              let APIerror = obj.error;

              await adapter.setStateAsync("error", { val: APIerror, ack: true });
              
              if (APIerror == null) {
                await adapter.setStateAsync("fetchdate", { val: obj.fetchdate, ack: true });
                await adapter.setStateAsync("datatimestamp", {
                  val: obj.current.datatimestamp,
                  ack: true,
                });
                await adapter.setStateAsync("timeoffset", {
                  val: obj.current.timeoffset,
                  ack: true,
                });
                await adapter.setStateAsync("conditiontimestamp", {
                  val: obj.current.conditiontimestamp,
                  ack: true,
                });
                await adapter.setStateAsync("condition", {
                  val: obj.current.condition,
                  ack: true,
                });

                // current values
                await adapter.setStateAsync("current_temperature", {
                  val: obj.current.temperature,
                  ack: true,
                });
                await adapter.setStateAsync("current_dewpoint", {
                  val: obj.current.dewpoint,
                  ack: true,
                });
                await adapter.setStateAsync("current_windchill", {
                  val: obj.current.windchill,
                  ack: true,
                });
                await adapter.setStateAsync("current_wetbulbtemperature", {
                  val: obj.current.wetbulbtemperature,
                  ack: true,
                });
                await adapter.setStateAsync("current_humidity", {
                  val: obj.current.humidity,
                  ack: true,
                });
                await adapter.setStateAsync("current_airpress_rel", {
                  val: obj.current.airpress_rel,
                  ack: true,
                });
                await adapter.setStateAsync("current_tendency", {
                  val: obj.current.tendency,
                  ack: true,
                });
                await adapter.setStateAsync("current_precipitation", {
                  val: obj.current.precipitation,
                  ack: true,
                });
                await adapter.setStateAsync("current_rainrate", {
                  val: obj.current.rainrate,
                  ack: true,
                });
                await adapter.setStateAsync("current_itsraining", {
                  val: obj.current.itsraining,
                  ack: true,
                });
                await adapter.setStateAsync("current_windspeed", {
                  val: obj.current.windspeed,
                  ack: true,
                });
                await adapter.setStateAsync("current_gustspeed", {
                  val: obj.current.gustspeed,
                  ack: true,
                });
                await adapter.setStateAsync("current_winddirection", {
                  val: obj.current.winddirection,
                  ack: true,
                });
                let winddir_text = adapter.convertWinddirText(obj.current.winddirection);
                await adapter.setStateAsync("current_winddirection_text", {
                  val: winddir_text,
                  ack: true,
                });
                await adapter.setStateAsync("current_uv", {
                  val: obj.current.uv,
                  ack: true,
                });
                await adapter.setStateAsync("current_solar", {
                  val: obj.current.solar,
                  ack: true,
                });
                await adapter.setStateAsync("current_brightness", {
                  val: obj.current.brightness,
                  ack: true,
                });
                await adapter.setStateAsync("current_suntime", {
                  val: obj.current.suntime,
                  ack: true,
                });
                await adapter.setStateAsync("snowheighttimestamp", {
                  val: obj.current.snowheighttimestamp,
                  ack: true,
                });
                await adapter.setStateAsync("snowheight", {
                  val: obj.current.snowheight,
                  ack: true,
                });
                await adapter.setStateAsync("current_temp1", {
                  val: obj.current.temp1,
                  ack: true,
                });
                await adapter.setStateAsync("current_temp2", {
                  val: obj.current.temp2,
                  ack: true,
                });
                await adapter.setStateAsync("current_temp3", {
                  val: obj.current.temp3,
                  ack: true,
                });
                await adapter.setStateAsync("current_temp4", {
                  val: obj.current.temp4,
                  ack: true,
                });
                await adapter.setStateAsync("current_humidity1", {
                  val: obj.current.humidity1,
                  ack: true,
                });
                await adapter.setStateAsync("current_humidity2", {
                  val: obj.current.humidity2,
                  ack: true,
                });
                await adapter.setStateAsync("current_humidity3", {
                  val: obj.current.humidity3,
                  ack: true,
                });
                await adapter.setStateAsync("current_humidity4", {
                  val: obj.current.humidity4,
                  ack: true,
                });
                await adapter.setStateAsync("current_soilmoisture1", {
                  val: obj.current.soilmoisture1,
                  ack: true,
                });
                await adapter.setStateAsync("current_soilmoisture2", {
                  val: obj.current.soilmoisture2,
                  ack: true,
                });
                await adapter.setStateAsync("current_soilmoisture3", {
                  val: obj.current.soilmoisture3,
                  ack: true,
                });
                await adapter.setStateAsync("current_soilmoisture4", {
                  val: obj.current.soilmoisture4,
                  ack: true,
                });
                await adapter.setStateAsync("current_leafwetness1", {
                  val: obj.current.leafwetness1,
                  ack: true,
                });
                await adapter.setStateAsync("current_leafwetness2", {
                  val: obj.current.leafwetness2,
                  ack: true,
                });
                await adapter.setStateAsync("current_indoortemperature", {
                  val: obj.current.indoortemperature,
                  ack: true,
                });
                await adapter.setStateAsync("current_indoorhumidity", {
                  val: obj.current.indoorhumidity,
                  ack: true,
                });
                await adapter.setStateAsync("current_airquality_pm1", {
                  val: obj.current.airquality_pm1,
                  ack: true,
                });
                await adapter.setStateAsync("current_airquality_pm2", {
                  val: obj.current.airquality_pm2,
                  ack: true,
                });
                await adapter.setStateAsync("current_airquality_pm10", {
                  val: obj.current.airquality_pm10,
                  ack: true,
                });

                // 1h values
                await adapter.setStateAsync("1h_precipitation", {
                  val: obj["1h"]["precipitation_1h"],
                  ack: true,
                });

                // values for current da
                await adapter.setStateAsync("day_temp_min", {
                  val: obj.day.temp_min,
                  ack: true,
                });
                await adapter.setStateAsync("day_temp_min_ts", {
                  val: obj.day.temp_min_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_temp_max", {
                  val: obj.day.temp_max,
                  ack: true,
                });
                await adapter.setStateAsync("day_temp_max_ts", {
                  val: obj.day.temp_max_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_dewpoint_min", {
                  val: obj.day.dewpoint_min,
                  ack: true,
                });
                await adapter.setStateAsync("day_dewpoint_min_ts", {
                  val: obj.day.dewpoint_min_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_dewpoint_max", {
                  val: obj.day.dewpoint_max,
                  ack: true,
                });
                await adapter.setStateAsync("day_dewpoint_max_ts", {
                  val: obj.day.dewpoint_max_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_hum_min", {
                  val: obj.day.hum_min,
                  ack: true,
                });
                await adapter.setStateAsync("day_hum_min_ts", {
                  val: obj.day.hum_min_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_hum_max", {
                  val: obj.day.hum_max,
                  ack: true,
                });
                await adapter.setStateAsync("day_hum_max_ts", {
                  val: obj.day.hum_max_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_airp_rel_min", {
                  val: obj.day.airp_rel_min,
                  ack: true,
                });
                await adapter.setStateAsync("day_airp_rel_min_ts", {
                  val: obj.day.airp_rel_min_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_airp_rel_max", {
                  val: obj.day.airp_rel_max,
                  ack: true,
                });
                await adapter.setStateAsync("day_airp_rel_max_ts", {
                  val: obj.day.airp_rel_max_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_windspeed_min", {
                  val: obj.day.windspeed_min,
                  ack: true,
                });
                await adapter.setStateAsync("day_windspeed_min_ts", {
                  val: obj.day.windspeed_min_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_windspeed_max", {
                  val: obj.day.windspeed_max,
                  ack: true,
                });
                await adapter.setStateAsync("day_windspeed_max_ts", {
                  val: obj.day.windspeed_max_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_winddir_max", {
                  val: obj.day.winddir_max,
                  ack: true,
                });
                let winddir_max_text = adapter.convertWinddirText(obj.day.winddir_max);
                await adapter.setStateAsync("day_winddir_max_text", {
                  val: winddir_max_text,
                  ack: true,
                });
                await adapter.setStateAsync("day_gustspeed_min", {
                  val: obj.day.gustspeed_min,
                  ack: true,
                });
                await adapter.setStateAsync("day_gustspeed_min_ts", {
                  val: obj.day.gustspeed_min_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_gustspeed_max", {
                  val: obj.day.gustspeed_max,
                  ack: true,
                });
                await adapter.setStateAsync("day_gustspeed_max_ts", {
                  val: obj.day.gustspeed_max_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_gustdir_max", {
                  val: obj.day.gustdir_max,
                  ack: true,
                });
                let gustdir_max_text = adapter.convertWinddirText(obj.day.gustdir_max);
                await adapter.setStateAsync("day_gustdir_max_text", {
                  val: gustdir_max_text,
                  ack: true,
                });
                await adapter.setStateAsync("day_rainrate_max", {
                  val: obj.day.rainrate_max,
                  ack: true,
                });
                await adapter.setStateAsync("day_rainrate_max_ts", {
                  val: obj.day.rainrate_max_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_precipitation_24h", {
                  val: obj.day.precipitation_24h,
                  ack: true,
                });
                await adapter.setStateAsync("day_brightness_max", {
                  val: obj.day.brightness_max,
                  ack: true,
                });
                await adapter.setStateAsync("day_brightness_max_ts", {
                  val: obj.day.brightness_max_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_solar_max", {
                  val: obj.day.solar_max,
                  ack: true,
                });
                await adapter.setStateAsync("day_solar_max_ts", {
                  val: obj.day.solar_max_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_uv_max", {
                  val: obj.day.uv_max,
                  ack: true,
                });
                await adapter.setStateAsync("day_uv_max_ts", {
                  val: obj.day.uv_max_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_intemp_min", {
                  val: obj.day.intemp_min,
                  ack: true,
                });
                await adapter.setStateAsync("day_intemp_min_ts", {
                  val: obj.day.intemp_min_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_intemp_max", {
                  val: obj.day.intemp_max,
                  ack: true,
                });
                await adapter.setStateAsync("day_intemp_max_ts", {
                  val: obj.day.intemp_max_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_inhum_min", {
                  val: obj.day.inhum_min,
                  ack: true,
                });
                await adapter.setStateAsync("day_inhum_min_ts", {
                  val: obj.day.inhum_min_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_inhum_max", {
                  val: obj.day.inhum_max,
                  ack: true,
                });
                await adapter.setStateAsync("day_inhum_max_ts", {
                  val: obj.day.inhum_max_ts,
                  ack: true,
                });
                await adapter.setStateAsync("day_airquality_pm1", {
                  val: obj.day.airquality_pm1,
                  ack: true,
                });
                await adapter.setStateAsync("day_airquality_pm2", {
                  val: obj.day.airquality_pm2,
                  ack: true,
                });
                await adapter.setStateAsync("day_airquality_pm10", {
                  val: obj.day.airquality_pm10,
                  ack: true,
                });

                // forecast Day 0
                await adapter.setStateAsync("forecast_day0_code", {
                  val: obj.forecast.day0.fc_code,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day0_icon", {
                  val: obj.forecast.day0.fc_icon,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day0_text", {
                  val: obj.forecast.day0.fc_text,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day0_temp_min", {
                  val: obj.forecast.day0.fc_temp_min,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day0_temp_max", {
                  val: obj.forecast.day0.fc_temp_max,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day0_rainsum", {
                  val: obj.forecast.day0.fc_rainsum,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day0_rain_possibility", {
                  val: obj.forecast.day0.fc_rain_possibility,
                  ack: true,
                });

                // forecast Day 1
                await adapter.setStateAsync("forecast_day1_code", {
                  val: obj.forecast.day1.fc_code,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day1_icon", {
                  val: obj.forecast.day1.fc_icon,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day1_text", {
                  val: obj.forecast.day1.fc_text,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day1_temp_min", {
                  val: obj.forecast.day1.fc_temp_min,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day1_temp_max", {
                  val: obj.forecast.day1.fc_temp_max,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day1_rainsum", {
                  val: obj.forecast.day1.fc_rainsum,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day1_rain_possibility", {
                  val: obj.forecast.day1.fc_rain_possibility,
                  ack: true,
                });

                // forecast Day 2
                await adapter.setStateAsync("forecast_day2_code", {
                  val: obj.forecast.day2.fc_code,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day2_icon", {
                  val: obj.forecast.day2.fc_icon,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day2_text", {
                  val: obj.forecast.day2.fc_text,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day2_temp_min", {
                  val: obj.forecast.day2.fc_temp_min,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day2_temp_max", {
                  val: obj.forecast.day2.fc_temp_max,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day2_rainsum", {
                  val: obj.forecast.day2.fc_rainsum,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day2_rain_possibility", {
                  val: obj.forecast.day2.fc_rain_possibility,
                  ack: true,
                });

                // forecast Day 3
                await adapter.setStateAsync("forecast_day3_code", {
                  val: obj.forecast.day3.fc_code,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day3_icon", {
                  val: obj.forecast.day3.fc_icon,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day3_text", {
                  val: obj.forecast.day3.fc_text,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day3_temp_min", {
                  val: obj.forecast.day3.fc_temp_min,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day3_temp_max", {
                  val: obj.forecast.day3.fc_temp_max,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day3_rainsum", {
                  val: obj.forecast.day3.fc_rainsum,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day3_rain_possibility", {
                  val: obj.forecast.day3.fc_rain_possibility,
                  ack: true,
                });

                // forecast Day 4
                await adapter.setStateAsync("forecast_day4_code", {
                  val: obj.forecast.day4.fc_code,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day4_icon", {
                  val: obj.forecast.day4.fc_icon,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day4_text", {
                  val: obj.forecast.day4.fc_text,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day4_temp_min", {
                  val: obj.forecast.day4.fc_temp_min,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day4_temp_max", {
                  val: obj.forecast.day4.fc_temp_max,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day4_rainsum", {
                  val: obj.forecast.day4.fc_rainsum,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day4_rain_possibility", {
                  val: obj.forecast.day4.fc_rain_possibility,
                  ack: true,
                });

                // forecast Day 5
                await adapter.setStateAsync("forecast_day5_code", {
                  val: obj.forecast.day5.fc_code,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day5_icon", {
                  val: obj.forecast.day5.fc_icon,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day5_text", {
                  val: obj.forecast.day5.fc_text,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day5_temp_min", {
                  val: obj.forecast.day5.fc_temp_min,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day5_temp_max", {
                  val: obj.forecast.day5.fc_temp_max,
                  ack: true,
                });
                await adapter.setStateAsync("forecast_day5_rainsum", {
                  val: obj.forecast.day5.fc_rainsum,
                  ack: true,
                });
                adapter.setStateAsync("forecast_day5_rain_possibility", {
                  val: obj.forecast.day5.fc_rain_possibility,
                  ack: true,
                });

                // check timer if in waiting state
                if (timer == 300000) {
                  timer = APIrequestIntervall;
                  adapter.setTimer(adapter);
                  adapter.log.info(
                    "AWEKAS Server connection restored. set request timer to normal"
                  );
                }
              } else {
                // station API error handling
                if (APIerror == "maximum quota exceeded") {
                  adapter.log.warn(
                    "maximum quota exceeded - to many requests. waiting 5min..."
                  );
                  timer = 300000;
                  adapter.setTimer(adapter);
                }
                if (APIerror == "AWEKAS plus not active") {
                  adapter.log.warn(
                    "AWEKAS Plus not active - AWEKAS Plus is necessary for station API- please activate AWEKAS Plus in AWEKAS user profile."
                  );
                  timer = 300000;
                  adapter.setTimer(adapter);
                }
                if (APIerror == "invalid key") {
                  adapter.log.warn(
                    "Invalid AWEKAS API key - please get the correct key from https://my.awekas.at "
                  );
                  timer = 300000;
                  adapter.setTimer(adapter);
                }
              }
            } catch (error) {
              adapter.log.warn("Could not write object: " + error);
            }
          } else {
            adapter.log.warn("no response from AWEKAS server");
          }
        })
        .catch(function (error) {
          adapter.log.info("AWEKAS server cannot be contacted. waiting 5min...");
          timer = 300000;
          adapter.setTimer(adapter);
        });
    }
  }

  // set intervall for request
  setTimer(adapter) {
    clearInterval(intervalID);
    intervalID = setInterval(this.requestData, timer, adapter);
  }
  
  // transform deggree to winddirection in selected language
  convertWinddirText(richtung) {
    if (richtung >=0 && richtung <=360){
       richtung = 2 + Math.floor((richtung - 11.24) / 22.5);
       if (richtung > 16) richtung = 1;

       let wr;
       if (language == "de") {
          wr = ["-","N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW"];
       }
       if (language == "en") {
          wr = ["-","N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
       }
       if (language == "es") {
          wr = ["-","N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO"];
       }
       if (language == "it") {
          wr = ["-","N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO"];
       }
       if (language == "fr") {
          wr = ["-","N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO"];
       }
       if (language == "nl") {
          wr = ["-","N","NNO","NO","ONO","O","OZO","ZO","ZZO","Z","ZZW","ZW","WZW","W","WNW","NW","NNW"];
       }
      return wr[richtung];
    }
  }

  createObject(adapter) {
    try {
      adapter.setObjectNotExistsAsync("fetchdate", {
        type: "state",
        common: {
          name: "fetchdate",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("error", {
        type: "state",
        common: {
          name: "error",
          type: "string",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("datatimestamp", {
        type: "state",
        common: {
          name: "datatimestamp",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("timeoffset", {
        type: "state",
        common: {
          name: "timeoffset",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("conditiontimestamp", {
        type: "state",
        common: {
          name: "conditiontimestamp",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("condition", {
        type: "state",
        common: {
          name: "condition",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_temperature", {
        type: "state",
        common: {
          name: "current_temperature",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_dewpoint", {
        type: "state",
        common: {
          name: "current_dewpoint",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_windchill", {
        type: "state",
        common: {
          name: "current_windchill",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_wetbulbtemperature", {
        type: "state",
        common: {
          name: "current_wetbulbtemperature",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_humidity", {
        type: "state",
        common: {
          name: "current_humidity",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_airpress_rel", {
        type: "state",
        common: {
          name: "current_airpress_rel",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "hPa",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_tendency", {
        type: "state",
        common: {
          name: "current_tendency",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_precipitation", {
        type: "state",
        common: {
          name: "current_precipitation",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "mm",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_rainrate", {
        type: "state",
        common: {
          name: "current_rainrate",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "mm/h",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_itsraining", {
        type: "state",
        common: {
          name: "current_itsraining",
          type: "boolean",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_windspeed", {
        type: "state",
        common: {
          name: "current_windspeed",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "km/h",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_gustspeed", {
        type: "state",
        common: {
          name: "current_gustspeed",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "km/h",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_winddirection", {
        type: "state",
        common: {
          name: "current_winddirection",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_winddirection_text", {
        type: "state",
        common: {
          name: "current_winddirection",
          type: "string",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_uv", {
        type: "state",
        common: {
          name: "current_uv",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "idx",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_solar", {
        type: "state",
        common: {
          name: "current_solar",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "W/m²",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_brightness", {
        type: "state",
        common: {
          name: "current_brightness",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "Lux",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_suntime", {
        type: "state",
        common: {
          name: "current_suntime",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "h",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("snowheighttimestamp", {
        type: "state",
        common: {
          name: "snowheighttimestamp",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("snowheight", {
        type: "state",
        common: {
          name: "snowheight",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "cm",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_temp1", {
        type: "state",
        common: {
          name: "current_temp1",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_temp2", {
        type: "state",
        common: {
          name: "current_temp2",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_temp3", {
        type: "state",
        common: {
          name: "current_temp3",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_temp4", {
        type: "state",
        common: {
          name: "current_temp4",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_humidity1", {
        type: "state",
        common: {
          name: "current_humidity1",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_humidity2", {
        type: "state",
        common: {
          name: "current_humidity2",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_humidity3", {
        type: "state",
        common: {
          name: "current_humidity3",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_humidity4", {
        type: "state",
        common: {
          name: "current_humidity4",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_soilmoisture1", {
        type: "state",
        common: {
          name: "current_soilmoisture1",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "cbar",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_soilmoisture2", {
        type: "state",
        common: {
          name: "current_soilmoisture2",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "cbar",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_soilmoisture3", {
        type: "state",
        common: {
          name: "current_soilmoisture3",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "cbar",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_soilmoisture4", {
        type: "state",
        common: {
          name: "current_soilmoisture4",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "cbar",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_leafwetness1", {
        type: "state",
        common: {
          name: "current_leafwetness1",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_leafwetness2", {
        type: "state",
        common: {
          name: "current_leafwetness2",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_indoortemperature", {
        type: "state",
        common: {
          name: "current_indoortemperature",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_indoorhumidity", {
        type: "state",
        common: {
          name: "current_indoorhumidity",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_airquality_pm1", {
        type: "state",
        common: {
          name: "current_airquality_pm1",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "μg/m³",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_airquality_pm2", {
        type: "state",
        common: {
          name: "current_airquality_pm2",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "μg/m³",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("current_airquality_pm10", {
        type: "state",
        common: {
          name: "current_airquality_pm10",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "μg/m³",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("1h_precipitation", {
        type: "state",
        common: {
          name: "1h_precipitation",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "mm",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_temp_min", {
        type: "state",
        common: {
          name: "day_temp_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_temp_min_ts", {
        type: "state",
        common: {
          name: "day_temp_min_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_temp_max", {
        type: "state",
        common: {
          name: "day_temp_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_temp_max_ts", {
        type: "state",
        common: {
          name: "day_temp_max_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_dewpoint_min", {
        type: "state",
        common: {
          name: "day_dewpoint_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_dewpoint_min_ts", {
        type: "state",
        common: {
          name: "day_dewpoint_min_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_dewpoint_max", {
        type: "state",
        common: {
          name: "day_dewpoint_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_dewpoint_max_ts", {
        type: "state",
        common: {
          name: "day_dewpoint_max_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_hum_min", {
        type: "state",
        common: {
          name: "day_hum_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_hum_min_ts", {
        type: "state",
        common: {
          name: "day_hum_min_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_hum_max", {
        type: "state",
        common: {
          name: "day_hum_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_hum_max_ts", {
        type: "state",
        common: {
          name: "day_hum_max_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_airp_rel_min", {
        type: "state",
        common: {
          name: "day_airp_rel_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "hPa",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_airp_rel_min_ts", {
        type: "state",
        common: {
          name: "day_airp_rel_min_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_airp_rel_max", {
        type: "state",
        common: {
          name: "day_airp_rel_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "hPa",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_airp_rel_max_ts", {
        type: "state",
        common: {
          name: "day_airp_rel_max_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_windspeed_min", {
        type: "state",
        common: {
          name: "day_windspeed_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "km/h",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_windspeed_min_ts", {
        type: "state",
        common: {
          name: "day_windspeed_min_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_windspeed_max", {
        type: "state",
        common: {
          name: "day_windspeed_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "km/h",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_windspeed_max_ts", {
        type: "state",
        common: {
          name: "day_windspeed_max_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_gustdir_max", {
        type: "state",
        common: {
          name: "day_gustdir_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_gustdir_max_text", {
        type: "state",
        common: {
          name: "day_gustdir_max",
          type: "string",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_winddir_max", {
        type: "state",
        common: {
          name: "day_winddir_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_winddir_max_text", {
        type: "state",
        common: {
          name: "day_winddir_max",
          type: "string",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_gustspeed_min", {
        type: "state",
        common: {
          name: "day_gustspeed_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "km/h",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_gustspeed_min_ts", {
        type: "state",
        common: {
          name: "day_gustspeed_min_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_gustspeed_max", {
        type: "state",
        common: {
          name: "day_gustspeed_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "km/h",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_gustspeed_max_ts", {
        type: "state",
        common: {
          name: "day_gustspeed_max_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_rainrate_max", {
        type: "state",
        common: {
          name: "day_rainrate_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "mm/h",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_rainrate_max_ts", {
        type: "state",
        common: {
          name: "day_rainrate_max_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_precipitation_24h", {
        type: "state",
        common: {
          name: "day_precipitation_24h",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "mm",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_brightness_max", {
        type: "state",
        common: {
          name: "day_brightness_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "Lux",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_brightness_max_ts", {
        type: "state",
        common: {
          name: "day_brightness_max_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_solar_max", {
        type: "state",
        common: {
          name: "day_solar_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "W/m²",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_solar_max_ts", {
        type: "state",
        common: {
          name: "day_solar_max_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_uv_max", {
        type: "state",
        common: {
          name: "day_uv_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "idx",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_uv_max_ts", {
        type: "state",
        common: {
          name: "day_uv_max_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_intemp_min", {
        type: "state",
        common: {
          name: "day_intemp_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_intemp_min_ts", {
        type: "state",
        common: {
          name: "day_intemp_min_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_intemp_max", {
        type: "state",
        common: {
          name: "day_intemp_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_intemp_max_ts", {
        type: "state",
        common: {
          name: "day_intemp_max_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_inhum_min", {
        type: "state",
        common: {
          name: "day_inhum_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_inhum_min_ts", {
        type: "state",
        common: {
          name: "day_inhum_min_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_inhum_max", {
        type: "state",
        common: {
          name: "day_inhum_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_inhum_max_ts", {
        type: "state",
        common: {
          name: "day_inhum_max_ts",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_airquality_pm1", {
        type: "state",
        common: {
          name: "day_airquality_pm1",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "μg/m³",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_airquality_pm2", {
        type: "state",
        common: {
          name: "day_airquality_pm2",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "μg/m³",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("day_airquality_pm10", {
        type: "state",
        common: {
          name: "day_airquality_pm10",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "μg/m³",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day0_code", {
        type: "state",
        common: {
          name: "forecast_day0_code",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day0_icon", {
        type: "state",
        common: {
          name: "forecast_day0_icon",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day0_text", {
        type: "state",
        common: {
          name: "forecast_day0_text",
          type: "string",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day0_temp_min", {
        type: "state",
        common: {
          name: "forecast_day0_temp_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day0_temp_max", {
        type: "state",
        common: {
          name: "forecast_day0_temp_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day0_rainsum", {
        type: "state",
        common: {
          name: "forecast_day0_rainsum",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "mm",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day0_rain_possibility", {
        type: "state",
        common: {
          name: "forecast_day0_rain_possibility",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day1_code", {
        type: "state",
        common: {
          name: "forecast_day1_code",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day1_icon", {
        type: "state",
        common: {
          name: "forecast_day1_icon",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day1_text", {
        type: "state",
        common: {
          name: "forecast_day1_text",
          type: "string",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day1_temp_min", {
        type: "state",
        common: {
          name: "forecast_day1_temp_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day1_temp_max", {
        type: "state",
        common: {
          name: "forecast_day1_temp_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day1_rainsum", {
        type: "state",
        common: {
          name: "forecast_day1_rainsum",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "mm",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day1_rain_possibility", {
        type: "state",
        common: {
          name: "forecast_day1_rain_possibility",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day2_code", {
        type: "state",
        common: {
          name: "forecast_day2_code",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day2_icon", {
        type: "state",
        common: {
          name: "forecast_day2_icon",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day2_text", {
        type: "state",
        common: {
          name: "forecast_day2_text",
          type: "string",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day2_temp_min", {
        type: "state",
        common: {
          name: "forecast_day2_temp_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day2_temp_max", {
        type: "state",
        common: {
          name: "forecast_day2_temp_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day2_rainsum", {
        type: "state",
        common: {
          name: "forecast_day2_rainsum",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "mm",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day2_rain_possibility", {
        type: "state",
        common: {
          name: "forecast_day2_rain_possibility",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day3_code", {
        type: "state",
        common: {
          name: "forecast_day3_code",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day3_icon", {
        type: "state",
        common: {
          name: "forecast_day3_icon",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day3_text", {
        type: "state",
        common: {
          name: "forecast_day3_text",
          type: "string",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day3_temp_min", {
        type: "state",
        common: {
          name: "forecast_day3_temp_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day3_temp_max", {
        type: "state",
        common: {
          name: "forecast_day3_temp_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day3_rainsum", {
        type: "state",
        common: {
          name: "forecast_day3_rainsum",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "mm",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day3_rain_possibility", {
        type: "state",
        common: {
          name: "forecast_day3_rain_possibility",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day4_code", {
        type: "state",
        common: {
          name: "forecast_day4_code",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day4_icon", {
        type: "state",
        common: {
          name: "forecast_day4_icon",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day4_text", {
        type: "state",
        common: {
          name: "forecast_day4_text",
          type: "string",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day4_temp_min", {
        type: "state",
        common: {
          name: "forecast_day4_temp_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day4_temp_max", {
        type: "state",
        common: {
          name: "forecast_day4_temp_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day4_rainsum", {
        type: "state",
        common: {
          name: "forecast_day4_rainsum",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "mm",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day4_rain_possibility", {
        type: "state",
        common: {
          name: "forecast_day4_rain_possibility",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day5_code", {
        type: "state",
        common: {
          name: "forecast_day5_code",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day5_icon", {
        type: "state",
        common: {
          name: "forecast_day5_icon",
          type: "number",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day5_text", {
        type: "state",
        common: {
          name: "forecast_day5_text",
          type: "string",
          role: "value",
          read: true,
          write: false,
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day5_temp_min", {
        type: "state",
        common: {
          name: "forecast_day5_temp_min",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day5_temp_max", {
        type: "state",
        common: {
          name: "forecast_day5_temp_max",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "°C",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day5_rainsum", {
        type: "state",
        common: {
          name: "forecast_day5_rainsum",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "mm",
        },
        native: {},
      });
      adapter.setObjectNotExistsAsync("forecast_day5_rain_possibility", {
        type: "state",
        common: {
          name: "forecast_day5_rain_possibility",
          type: "number",
          role: "value",
          read: true,
          write: false,
          unit: "%",
        },
        native: {},
      });
    } catch (error) {
      adapter.log.error("Could create object: " + error);
    }
  }

}

if (require.main !== module) {
  // Export the constructor in compact mode
  /**
   * @param {Partial<utils.AdapterOptions>} [options={}]
   */
  module.exports = (options) => new AwekasWeatherConnector(options);
} else {
  // otherwise start the instance directly
  new AwekasWeatherConnector();
}




