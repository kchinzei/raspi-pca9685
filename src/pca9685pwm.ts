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

import { PCA9685Module } from './pca9685module';
import { Peripheral } from 'raspi-peripheral';
import { IPeripheral } from 'j5-io-types';

export interface PCA9685PWMConfig {
    port: number;	//  0 - maxChannelsPerBoard*maxBoards-1
    frequency?: number;
}

export interface PCA9685PWM extends IPeripheral {
    readonly dutyCycle: number;
    write(dutyCycle: number): void;
    read(): number;
}

export class PCM9685PWM extends Peripheral implements PCA9685PWM {
    static _pca9685 PCA9685Module[] = Array(publicConst.maxBoards);
    private _ch: number;
    private _board: number;
    private _dutyCycle: number;
    
    public get frequency() {
	return this._pca9685[this._board].frequency;
    }

    public get dutyCycle() {
	return this._dutyCycle;
    }
    
    public set dutyCycle(dutyCycle: number) {
	this.write(dutyCycle);
    }

    public function write(dutyCycle: number): void {
	this._pca9685[this._board].dutyCycle(this._ch, dutyCycle);
    }
    
    public function read(): number {
	return this._pca9685[this._board].dutyCycle(this._ch);
    }
    
    constructor(config: number | string | PCA9685PWMConfig) {
	let port: number;
	let frequency = privConst.defaultFrequency;
	if (typeof config === 'number') {
	    port = config;
	} else if (typeof config === 'string') {
	    port = Number(config);
	} else if (typeof config === 'object') {
	    port = config.port;
	    frequency = config.frequency;
	} else {
	    throw new Error('Invalid config, must be a number, string, or object');
	}

	if (port < 0 || port >= publicConst.maxChannelsPerBoard*publicConst.maxBoards) {
	    throw new Error('Invalid port number in config');
	}
	this._ch = port % publicConst.maxChannelsPerBoard;
	this._board = Math.floor(port / publicConst.maxChannelsPerBoard);

	if (typeof _i2c[this._board] === 'undefined') {
	    this._i2c[this._board] = new PCA9685Module(this._board, frequency);
	}
    }
}
