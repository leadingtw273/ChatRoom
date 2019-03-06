import io from 'socket.io-client';
// import AES from './AES';
import HENMAP from './HENMAP';
import f from 'float';

const socket = io('http://192.168.0.4:9453/', {
    path: '/chaos',
});

const getInitValue = () => {
    const value = [];
    for (let i = 0; i < 3; i++) {
        value.push(f.round(Math.random() * 2 - 1, 6));
    }
    return value;
};

// 排除初始影響
const chaosInit = (initValue, timeStep) => {
    let step = 0;
    let finValue = initValue;
    while (step < timeStep) {
        finValue = chaos.runChaos(step, finValue);
        step++;
    }
    return finValue;
};

// const AES_ECB = new AES('aes-256-ecb', 'sha256');
const CHAOS_INIT_VALUE = getInitValue();
const chaos = new HENMAP(0.00001, [-0.0001, 0.0001]);

let step = 100;
let x = chaosInit(CHAOS_INIT_VALUE, step);
let um = chaos.createUm(x);

socket.emit('', {
    step,
    x,
    um,
});

socket.on('', ({ x, isSync, step }) => {
    if (!isSync) {
        const _step = step + 1;
        const _x = chaos.runChaos(_step, x);
        const _um = chaos.createUm(_x);

        socket.emit('', {
            step: _step,
            x: _x,
            um: _um,
        });
    } else {
        console.log('is Sync!!');
    }
});

export default {};
