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
