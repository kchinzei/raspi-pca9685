Raspi PCA9685 PWM
=================

Raspi PCA9685 PWM is built upon
[Raspi i2c](https://github.com/nebrius/raspi-i2c) to
provide PWM outputs by controling PCA9685 via I2C connection.

** This is early alpha. Don't use. **

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
	
