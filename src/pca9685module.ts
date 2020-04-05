/*
The MIT License (MIT)

Copyright (c) Tiago Alves <tralves@gmail.com> and Bryan Hughes <bryan@nebri.us>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
   Raspi-PCA9685 - Provides access to PCA9685 via I2C on the Raspberry Pi from Node.js

   Make Asayake to Wake Project.
   Kiyo Chinzei
   https://github.com/asayake-led/raspi-pca9685

   raspi-pca9685 is built upon raspi-i2c, submodule of Raspi.js
      https://www.npmjs.com/package/raspi
   I also looked at pca9685 module in npm.
      https://www.npmjs.com/package/pca9685
      https://github.com/101100/pca9685
   I also learned from Adafruit PCA9685 python code
      https://github.com/adafruit/Adafruit_Python_PCA9685/
   But the API is modified to be consistent to raspi-soft-pwm.
      https://github.com/nebrius/raspi-soft-pwm

   Due to this design, it should be minimal to switch between
   raspi-soft-pwm and raspi-pca9685.
*/

// Private constants from pca9685.ts in https://github.com/101100/pca9685
// Start citation
/*
 * src/pca9685.ts
 * https://github.com/101100/pca9685
 *
 * Library for PCA9685 I2C 16-channel PWM/servo driver.
 *
 * Copyright (c) 2015 Jason Heard
 * Licensed under the MIT license.
 */
const privConst = {
    modeRegister1: 0x00,	// MODE1
    modeRegister1Default: 0x01,
    sleepBit: 0x10,
    restartBit: 0x80,
    modeRegister2: 0x01,	// MODE2
    modeRegister2Default: 0x04,
    channel0OnStepLowByte: 0x06, // LED0_ON_L
    channel0OnStepHighByte: 0x07, // LED0_ON_H
    channel0OffStepLowByte: 0x08, // LED0_OFF_L
    channel0OffStepHighByte: 0x09, // LED0_OFF_H
    registersPerChannel: 4,
    allChannelsOnStepLowByte: 0xFA, // ALL_LED_ON_L
    allChannelsOnStepHighByte: 0xFB, // ALL_LED_ON_H
    allChannelsOffStepLowByte: 0xFC, // ALL_LED_OFF_L
    allChannelsOffStepHighByte: 0xFD, // ALL_LED_OFF_H
    channelFullOnOrOff: 0x10,	// must be sent to the off step high byte
    preScaleRegister: 0xFE,		// PRE_SCALE
    autoIncrementOn 0xA1,
    stepsPerCycle: 4096,
    defaultAddress: 0x40,
    defaultFrequency: 200,	// Sufficient for LED PWM
    baseClockHertz: 25000000,
};
// End of citation

/*
  PCA9685 can offset 'on timing' to decrease the current surge and EMC.
  Offset will be given so that the distance of each channel being as large as possible,
  assuming that we use channels from 0 to 15, board address given by wiring from 0,1,..
    offset = (baseClockHertz / frequency) / maxChannels * onOffset_Ch[ch]
*/
const onOffcet_Ch[] = {
    0x00, 0x08, 0x04, 0x0C,
    0x02, 0x0A, 0x06, 0x0E,
    0x01, 0x09, 0x05, 0x0D,
    0x03, 0x0B, 0x07, 0x0F};
/* onOffcet_Bourd[] is not used now
const onOffcet_Bourd[] = {
    0x00, 0x20, 0x10, 0x30,
    0x08, 0x28, 0x18, 0x38,
    0x04, 0x34, 0x14, 0x34,
    0x0C, 0x2C, 0x1C, 0x3C,

    0x02, 0x22, 0x12, 0x32,
    0x0A, 0x2A, 0x1A, 0x3A,
    0x06, 0x26, 0x16, 0x36,
    0x0E, 0x2E, 0x1E, 0x3E,

    0x01, 0x21, 0x11, 0x31,
    0x09, 0x29, 0x19, 0x39,
    0x05, 0x25, 0x15, 0x35,
    0x0D, 0x2D, 0x1D, 0x3D,

    0x03, 0x23, 0x13, 0x33,
    0x0B, 0x2B, 0x1B, 0x3B,
    0x07, 0x27, 0x17, 0x37,
    0x0F, 0x2F};  // max 62 board.
*/

import { I2C } from "raspi-i2c";
import { publicConst } from './pca9685';

//import { II2CModule, II2C } from 'j5-io-types';

interface I2C_PCA9685Module {
    address(): number;
    frequency(): number;
    dutyCycle(ch: number): number;
    dutyCycle(ch: number, dutyCycleNormalized: number): void;
    reset(): void;
}

/*
  class PCA9685Module takes care of a PCA9685 board, including.
  - Initializing the baord. 
  - Setting PWM frequency.
  - Reading/writing PWM duty cycle.
*/

export class PCA9685Module implements I2C_PCA9685Module {
    static  _i2c: I2C = new I2C();
    readonly _address: number;
    readonly _frequency: number;

    public get address() {return this._address; }
    public get frequency() { return this._frequency; }

    public dutyCycle(ch: number, dutyCycleNormalized: number) {
    }
    public dutyCycle(ch: number): number {
	let dutyCycleNormalized: number;
    }
    
    private set frequency(frequency: number) {
	// Following equence is translated from
	// https://github.com/adafruit/Adafruit_CircuitPython_PCA9685/blob/master/adafruit_pca9685.py
	let prescale = Math.floor(privConst.baseClockHertz / privConst.stepsPerCycle / frequency + 0.5);
	if (prescale < 3) {
	    throw new Error('Invalid config, must be a number, string, or object.');
	}
	
	// JS/TS doesn't have sleep().
	// https://qiita.com/asa-taka/items/888bc5a1d7f30ee7eda2
	const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
	(async () => {
	    let mode1: number;
	    let sleepMode: number;
	    mode1 = _i2c.readByteSync(address, prevConst.modeRegister1)
	    sleepMode = (mode1 & 0x7F) | privConst.sleepBit  // wake up (reset sleep)
	    _i2c.writeByteSync(address, prevConst.preScaleRegister, sleepMode);
	    _i2c.writeByteSync(address, prevConst.modeRegister1, mode1);
	    await sleep(5);	// wait for oscillator
	    mode1 = mode1 | privConst.autoIncrementOn;
	    _i2c.writeByteSync(address, prevConst.modeRegister1, mode1);
	})();
	this._frequency = frequency;
    }
    
    public reset() {
	const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
	(async () => {
	    _i2c.writeByteSync(this._address, prevConst.modeRegister2, privConst.modeRegister2Default);
	    _i2c.writeByteSync(this._address, prevConst.modeRegister1, privConst.modeRegister1Default);
	    await sleep(5);
	})();
    }
    
    constructor(board: number, frequency: number) {
	this._address = privConst.defaultAddress + number;
	reset();
	this.frequency = frequency;
    }
}
