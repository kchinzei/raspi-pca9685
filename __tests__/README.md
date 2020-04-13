Testing TypeScript Module
=========================

This directory
contains [ts-ject](https://github.com/kulshekhar/ts-jest) files.

### Prerequisites

Apply following commands in the root directory of the project.
```Shell
npm i -D jest typescript
npm i -D ts-jest @types/jest
```

### Running tests
Since thsi test contains crating SoftPWM object from 
[raspi soft pwm](https://github.com/nebrius/raspi-soft-pwm),
following requirements apply as standard ones for SoftPWM.
- Run test using `sudo`.
- If `pigpiod` ruiing, stop it. `sudo systemctl stop pigpiod.service`

```Shell
sudo npx jest
```

### More info
- [ts-ject @ github.com](https://github.com/kulshekhar/ts-jest)
- [ts-ject document site](https://kulshekhar.github.io/ts-jest/)
- [Configuring Jest](https://jestjs.io/docs/en/22.x/configuration)
