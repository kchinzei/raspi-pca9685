import { IPCA9685PWMConfig, PCA9685PWM } from '../src/index';

function pwm_on(port: number, freq:number, val:number): number {
    if (val < 0 || val > 1)
	throw new Error('Val out of range [0,1]');

    let readval: number = -1;

    let config: IPCA9685PWMConfig = { port: port, frequency: freq};
    const pwm = new PCA9685PWM(config);

    // JS/TS doesn't have sleep().
    // https://qiita.com/asa-taka/items/888bc5a1d7f30ee7eda2
    const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
    (async () => {
	pwm.write(val);
	readval = pwm.read();
	await sleep(1000);
	pwm.write(0);
    })();
    return readval;
}

function test_pwm(port: number, freq:number, val:number): number {
    let readval = pwm_on(port, freq, val);
    test('1. PWM read value should agree to PWM write value.', () => {
	expect(val).toBeCloseTo(readval);
    });
}

init(() => {
    let progname: string = process.argv[1];
    let port: number = 0;
    let freq: number = 1000;
    let val: number = 0.5;
    
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
    test_pwm(port, freq, val);
});
