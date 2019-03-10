import HENMAP from '../libs/chaos.js';

const _private = new WeakMap();
const chaos = new HENMAP(0.00001, [-0.0001, 0.0001]);

class ChaosSync {
  constructor() {
    console.log('[Chaos Init]');
    const CHAOS_INIT_VALUE = chaos.getRandomInitValue();

    const step = 100;
    const x = chaos.chaosInit(CHAOS_INIT_VALUE, step);
    const um = 0;

    _private.set(this, { x, step, um });
  }

  runChaos() {
    let privateData = _private.get(this);
    const { step, x } = privateData;
    privateData.step = step + 1;
    privateData.x = chaos.runChaos(step, x);
    console.log(
      `[chaos] : (runChaos) step = ${privateData.step}, x = ${privateData.x}`
    );
  }

  getUm() {
    let privateData = _private.get(this);
    privateData.um = chaos.createUm(privateData.x);
    console.log(`[chaos] : (getUm) um = ${privateData.um}`);
    console.log('---------------------------------------------------------');
    return privateData.um;
  }

  getKey() {
    const { x } = _private.get(this);
    const key = x
      .map(val => val.toString().slice(0, val.toString().indexOf('.') + 5))
      .join('/');
    console.log(`[Chaos] : (getKey) ${key}`);
    console.log('---------------------------------------------------------');
    return key;
  }
}

export default ChaosSync;
