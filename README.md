Raspi PCA9685 PWM
=================

Hardware PWM by PCA9685.
Raspi PCA9685 PWM is built upon
[Raspi i2c](https://github.com/nebrius/raspi-i2c) to
provide PWM outputs by controling PCA9685 via I2C connection.
It's intended to work on PCA9685 boards such as
from [Adafruit](https://www.adafruit.com/product/815).
Technical information can be found [here](https://learn.adafruit.com/16-channel-pwm-servo-driver).


## System Requirements

- Raspberry Pi Model B Rev 3 or newer (Not tested on older pi's) or Pi
  Zero.
- [Raspi i2c 6.2.4](https://github.com/nebrius/raspi-i2c) or newer.
- Node 13.9.0 or newer (perhaps works with as old as v. 6, but not tested)


## Installation
	
Install with npm:
```Shell
npm install raspi-pca9685-pwm
```


## Example Usage

In TypeScript/ES2019:

```TypeScript
import { init } from 'raspi';
import { IPCA9685PWMConfig, PCA9685PWM } from 'raspi-pca9685-pwm';

init(() => {
	// Use channel 0 on board 0, with 2kHz PWM frequency.
    let config: IPCA9685PWMConfig = { port: 0, frequency: 2000};
    const pwm = new PCA9685PWM(config);

	pwm.write(0.5); // 50% duty cycle.
 });
```

---
## API

### Module Constants
**publicConst** defines convenient parameters.  
  **maxChannelsPerBoard** Number of channels in a PCA9685, 16.  
  **maxBoards** Number of boards that can cascade to I2C bus, 62.  
  **stepsPerCycle** Steps of PWM. PCA9685 has 12-bit PWM. 4096.  
  **defaultFrequency** Used internally as constructor's default.

### Interface and Class
**IPCA9685PWMConfig** is passed to the constructor of PCA9685PWM.
**Port** is calculated by `(board #)*maxChannelsPerBoard + (channel #)`.
**Frequency** is in Hz. When omitted, defaultFrequency is used.
```TypeScript
interface IPCA9685PWMConfig {
    port: number;	//  0 - maxChannelsPerBoard*maxBoards-1
    frequency?: number;  // in Hz.
}
```
**PCA9685PWM** is a PWM channel on a PCA9685 board.
```TypeScript
class PCA9685PWM {
	dutyCycle: number;  // 0.0 - 1.0
    readonly ch: number;
    readonly board: number;
    readonly frequency: number; // in Hz

	write(dutyCycle: number): void;  // Activate PWM by dutyCycle [0,1].
    read(): number;  // Obtain current PWM of this channel by actually
    reading the register state.
    on(): void;  // Turn on this channel.
    off(): void;  // Turn of this channel.
    allOff(): void;  // Turn off all channels on the board.
}
```
### new PCA9685PWM(config: number | string | object)
Instantiates a new PWM channel on a PCA9685 board. When first channel
is made, you may want to provide the PWM frequency by using
**IPCA9685PWMConfig** object. This set the PWM frequency of the
board. Since the frequency is set per board, when instantiating the
rest of channels, you can provide the port number instead of
IPCA9685PWMConfig. Port number is calculated by 
`(board #)*maxChannelsPerBoard + (channel #)`.

Currently, once you instantiate a new PWM channel, you can't change
its PWM frequency. It's not a hardware restriction and you can easily
modify the code to allow it.

---
## Software PWM vs. Hardware PWM

You can get PWM outputs using
[raspi-soft-pwm](https://github.com/nebrius/raspi-soft-pwm) without
extra cost for a hardware PWM board. But you may consider hardware PWM
in the following occasions required;
- Gitter-free output,
- Linearity at low PWM output,
- Many outputs,
- Less burden to CPU.

You can determine if you need hardware PWM or software PWM is
sufficient for your purpose, by prototyping using
[raspi-soft-pwm](https://github.com/nebrius/raspi-soft-pwm).
A prototype code may look like this (the sample code modified from
[README.md](https://github.com/nebrius/raspi-soft-pwm/blob/master/README.md).

```TypeScript
import { init } from 'raspi';
import { SoftPWM } from 'raspi-soft-pwm'; // !!

init(() => {
  const pwm = new SoftPWM('GPIO22'); // !!
    pwm.write(0.5); // 50% Duty Cycle.
});
```
To modify it to use the hardware PWM, you modify two lines with '!!'.

### Caution

However, there is a difference in behavior of the PWM output.
[raspi-soft-pwm](https://github.com/nebrius/raspi-soft-pwm)
uses C library of [pigpio](http://abyz.me.uk/rpi/pigpio/cif.html). Due
to this implementation, when the process terminates, PWM outputs turn
off. In contrast, the outputs of PCA9685 persist unless a reset is sent.

### Known bugs

- read() is not working.
- Testing by [jest](https://jestjs.io) is not fully implemented.


## Credits
	
Code started from modifying
[raspi-soft-pwm](https://github.com/nebrius/raspi-soft-pwm) by nebrius.

learned PCA9685 access by reading [pca9685 module](https://www.npmjs.com/package/pca9685) by Jason Heard.
	
License
=======
	
The MIT License (MIT)
	
Copyright (c) K. Chinzei (kchinzei@gmail.com)
	
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
	
