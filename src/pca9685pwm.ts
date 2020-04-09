/*
The MIT License (MIT)

Copyright (c) Kiyo Chinzei (kchinzei@gmail.com)

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
   Raspi-PCA9685-pwm - Hardware PWM by PCA9685 via I2C on the Raspberry Pi.

   Make Asayake to Wake Project.
   Kiyo Chinzei
   https://github.com/asayake-led/raspi-pca9685-pwm

   Raspi-pca9685-pwm is built upon raspi-i2c, submodule of Raspi.js
      https://www.npmjs.com/package/raspi
   I also looked at pca9685 module in npm.
      https://www.npmjs.com/package/pca9685
      https://github.com/101100/pca9685
   I also learned from Adafruit PCA9685 python code
      https://github.com/adafruit/Adafruit_Python_PCA9685/
   But the API is modified to be consistent to raspi-soft-pwm.
      https://github.com/nebrius/raspi-soft-pwm

   Due to this design, you can switch easily between
   raspi-soft-pwm and raspi-pca9685-pwm.
*/

import { PCA9685Module, publicConst } from './pca9685module';

export interface IPCA9685PWMConfig {
    port: number;	//  0 - maxChannelsPerBoard*maxBoards-1
    frequency?: number;
}

//export interface IPCA9685PWM extends IPeripheral {
export interface IPCA9685PWM {
    dutyCycle: number;
    readonly ch: number;
    readonly board: number;
    readonly frequency: number;
    write(dutyCycle: number): void;
    read(): number;
    on(): void;
    off(): void;
    allOff(): void;
}

export class PCA9685PWM implements IPCA9685PWM {
    private static _pca9685: PCA9685Module[] = new Array(publicConst.maxBoards);
    private _ch = 0;
    private _board = 0;
    private _dutyCycle = 0;

    public get ch() { return this._ch; }
    public get board() { return this._board; }
    public get frequency() { return PCA9685PWM._pca9685[this.board].frequency; }
    public get dutyCycle() { return this._dutyCycle; }	// Can't return correct value for on(), off(), allOff().
    public set dutyCycle(dutyCycle: number) { this.write(dutyCycle); }

    public write(dutyCycle: number): void {
	PCA9685PWM._pca9685[this.board].setDutyCycle(this.ch, dutyCycle);
	this._dutyCycle = dutyCycle;
    }
    
    public read(): number {
	return this._dutyCycle = PCA9685PWM._pca9685[this.board].dutyCycle(this.ch);
    }

    public on(): void {
	PCA9685PWM._pca9685[this.board].channelOn(this.ch);
    }
    
    public off(): void {
	PCA9685PWM._pca9685[this.board].channelOff(this.ch);
    }
    
    public allOff(): void {
	PCA9685PWM._pca9685[this.board].channelOff();
    }

    constructor(config: number | string | IPCA9685PWMConfig) {
	// It preserves channel's current PWM status.
	// If application should init PWM before use, it's your task.
	let port: number;
	let frequency = publicConst.defaultFrequency;
	if (typeof config === 'number') {
	    port = config;
	} else if (typeof config === 'string') {
	    port = Number(config);
	} else if (typeof config === 'object') {
	    port = config.port;
	    if (typeof config.frequency === 'number') {
		frequency = config.frequency;
	    }
	} else {
	    /* istanbul ignore next */
	    throw new TypeError('Invalid config, must be a number, string, or object');
	}

	if (port < 0 || port >= publicConst.maxChannelsPerBoard*publicConst.maxBoards) {
	    throw new RangeError(`Invalid port number ${port}, out of [0,${publicConst.maxChannelsPerBoard*publicConst.maxBoards}).`);
	}
	this._ch = port % publicConst.maxChannelsPerBoard;
	this._board = Math.floor(port / publicConst.maxChannelsPerBoard);

	if (typeof PCA9685PWM._pca9685[this.board] === 'undefined') {
	    PCA9685PWM._pca9685[this.board] = new PCA9685Module(this.board, frequency);
	}
	this.read();
    }

    /* istanbul ignore next */
    public destroy() {
	// It does not destroy I2C communication.
    }
}
