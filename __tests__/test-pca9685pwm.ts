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
*/

const numberOfInstalledBoard = 1;

import { init } from 'raspi';
import { IPWMConfig } from 'raspi-soft-pwm';
import { PCA9685PWM, publicConst } from '../src/index';
import { module } from '../src/index';
import { SoftPWM } from 'raspi-soft-pwm';

function test_pwm(port: number, freq:number, val:number): void {
    var pwm: PCA9685PWM;
    let i = 1;

    test(`${i++}. Instantiation of PWM object: illegal port(negative) should fail`, () => {
	expect(() => {
	    pwm = new PCA9685PWM(-1);
	}).toThrow();
    });
    
    test(`${i++}. Instantiation of PWM object: illegal port(exceed available h/w) should fail`, () => {
	expect(() => {
	    pwm = new PCA9685PWM(publicConst.maxChannelsPerBoard*numberOfInstalledBoard);
	}).toThrow();
    });

    test(`${i++}. Instantiation of PWM object: illegal port(string)) should fail`, () => {
	expect(() => {
	    pwm = new PCA9685PWM('GPIO22');
	}).toThrow();
    });
    
    test(`${i++}. Instantiation of PWM object: IPWMConfig (pin:number) should be accepted.`, () => {
	let config: IPWMConfig = { pin: port, frequency: freq };
	pwm = new PCA9685PWM(config);
	expect(pwm).toBeDefined();
    });

    test(`${i++}. Instantiation of PWM object: IPWMConfig (pin:string) should be accepted.`, () => {
	let config: IPWMConfig = { pin: String(port), frequency: freq };
	pwm = new PCA9685PWM(config);
	expect(pwm).toBeDefined();
    });

    test(`${i++}. Member functions: frequency() should agree given freq=${freq}.`, () => {
	// This test must follow the first successful instantiation of pwm.
	// Because PCA9685Module is instantiated only once and freq is never renewed after this.
	expect(pwm.frequency).toBe(freq);
    });

    test(`${i++}. Instantiation of PWM object: port as string should be accepted.`, () => {
	pwm = new PCA9685PWM("0");
	expect(pwm).toBeDefined();
    });
    
    test(`${i++}. Instantiation of PWM object: port as number should be accepted.`, () => {
	pwm = new PCA9685PWM(0);
	expect(pwm).toBeDefined();
    });
    
    test(`${i++}. Instantiation of PWM object: omitting frequency in IPWMConfig should be accepted.`, () => {
	let config: IPWMConfig = { pin: port };
	pwm = new PCA9685PWM(config);
	expect(pwm).toBeDefined();
    });

    test(`${i++}. Multiple instantiation of PWM object should be no harm.`, () => {
	expect(() => {
	    pwm.write(val);
	}).not.toThrow();
    });


    test(`${i++}. Member functions: PWM read value should agree to PWM write value.`, () => {
	pwm.write(val);
	expect(pwm.dutyCycle).toBeCloseTo(val);
    });

    test(`${i++}. Member functions: After off(), dutyCycle to be 0.`, () => {
	pwm.off();
	expect(pwm.dutyCycle).toBe(0);
    });

    test(`${i++}. Member functions: After on(), dutyCycle to be 1.`, () => {
	pwm.on();
	expect(pwm.dutyCycle).toBeCloseTo(1);
    });

    test(`${i++}. Member functions: After alloff(), dutyCycle to be 0.`, () => {
	pwm.allOff();
	expect(pwm.dutyCycle).toBeCloseTo(0);
    });



    test(`${i++}. Factory: Successfully produce SoftPWM`, () => {
	expect(() => {
	    let pwm: SoftPWM | PCA9685PWM;
            pwm = module.createPWM('GPIO22');
	    pwm.write(0.5);
	}).not.toThrow();
    });

    test(`${i++}. Factory: Successfully produce PCA9685PWM`, () => {
	expect(() => {
	    let pwm: SoftPWM | PCA9685PWM;
            pwm = module.createPWM(2);
	    pwm.write(0.5);
	}).not.toThrow();
    });
}

function main() {
    let progname: string = process.argv[1];
    let port: number = 1;
    let freq: number = 1000;
    var val: number = 0.2;
    
    switch (process.argv.length) {
	case 3:
	    val = parseFloat(process.argv[2]);
	    break;
	case 4:
	    val = parseFloat(process.argv[2]);
	    port = parseFloat(process.argv[3]);
	    break;
	case 5:
	    val = parseFloat(process.argv[2]);
	    port = parseFloat(process.argv[3]);
	    freq = parseFloat(process.argv[4]);
	    break;
    }

    init(() => {
    });

    test_pwm(port, freq, val);
};

main();
