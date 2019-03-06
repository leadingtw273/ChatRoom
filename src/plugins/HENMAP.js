import f from 'float';

const _Map = new WeakMap();

class Chaos {
    /**
     * Chaos 的 constructor
     */
    constructor(A, c) {
        _Map.set(this, {
            A: 0,
            c: [],
            ax: [1, 1, 1],
            dx: [0, 0, 0],
            g: [],
            h: [],
            j: [],
            count: 0,
        });

        let privateData = _Map.get(this);
        privateData.A = A;
        privateData.c = c;

        this.runModulation();
    }

    /**
     * 設定調變參數
     */
    setModulation(ax, dx) {
        let privateData = _Map.get(this);
        privateData.ax = ax;
        privateData.dx = dx;

        this.runModulation();
    }

    /**
     * 執行調變參數運算，
     * 求出 (g) (h) (j) 的值
     */
    runModulation() {
        let privateData = _Map.get(this);
        let ax = privateData.ax;
        let dx = privateData.dx;

        privateData.g[0] = -(ax[0] / (ax[1] * ax[1]));
        privateData.g[1] = (2 * ax[0] * dx[1]) / (ax[1] * ax[1]);
        privateData.g[2] = (-0.1 * ax[0]) / ax[2];
        privateData.g[3] =
            ax[0] *
                (1.76 -
                    (dx[1] * dx[1]) / (ax[1] * ax[1]) +
                    (0.1 * ax[0] * dx[2]) / ax[2]) +
            dx[0];

        privateData.h[0] = ax[1] / ax[0];
        privateData.h[1] = -(ax[1] * dx[0]) / ax[0] + dx[1];

        privateData.j[0] = ax[2] / ax[1];
        privateData.j[1] = -(ax[2] * dx[1]) / ax[1] + dx[2];
    }

    /**
     * 混沌運算
     */
    runChaos(k, x) {
        let privateData = _Map.get(this);
        let t = [];

        let g = privateData.g;
        let h = privateData.h;
        let j = privateData.j;

        if (k <= 1) {
            x[0] = privateData.ax[0] * x[0] + privateData.dx[0];
            x[1] = privateData.ax[1] * x[1] + privateData.dx[1];
            x[2] = privateData.ax[2] * x[2] + privateData.dx[2];
        }

        t = x.slice();
        t[0] = f.round(
            g[0] * (x[1] * x[1]) + g[1] * x[1] + g[2] * x[2] + g[3],
            6
        );
        t[1] = f.round(h[0] * x[0] + h[1], 6);
        t[2] = f.round(j[0] * x[1] + j[1], 6);

        return t;
    }

    /**
     * 主混沌運算
     */
    runMaster(k, x) {
        return this.runChaos(k, x);
    }

    /**
     * 僕混沌運算
     */
    runSlave(k, x, Um) {
        let t = this.runChaos(k, x);
        if (k > 1) {
            t[0] = f.round(t[0] + this.createUs(x) + Um, 10);
        }
        return t;
    }

    /**
     * 計算同步控制器(Uk)
     */
    createUk(X, Y) {
        let Um = this.createUm(X);
        let Us = this.createUs(Y);

        return f.round(Um + Us, 6);
    }

    /**
     * 計算主端控制器(Um)
     */
    createUm(x) {
        let privateData = _Map.get(this);
        let A = privateData.A;
        let c = privateData.c;
        let g = privateData.g;
        let h = privateData.h;
        let j = privateData.j;

        let Um =
            Math.pow(x[1], 2) * g[0] +
            x[1] * g[1] +
            x[2] * g[2] +
            x[0] * c[0] * h[0] +
            x[1] * c[1] * j[0] -
            x[0] * A -
            x[1] * c[0] * A -
            x[2] * c[1] * A;

        return f.round(Um, 6);
    }

    /**
     * 計算僕端控制器(Us)
     */
    createUs(y) {
        let privateData = _Map.get(this);
        let A = privateData.A;
        let c = privateData.c;
        let g = privateData.g;
        let h = privateData.h;
        let j = privateData.j;

        let Us =
            -Math.pow(y[1], 2) * g[0] -
            y[1] * g[1] -
            y[2] * g[2] -
            y[0] * c[0] * h[0] -
            y[1] * c[1] * j[0] +
            y[0] * A +
            y[1] * c[0] * A +
            y[2] * c[1] * A;

        return f.round(Us, 6);
    }

    /**
     * 確認兩混沌系統是否同步
     */
    checkSync(Us, Um) {
        let privateData = _Map.get(this);
        let sync = false;

        Um = f.round(Um, 4);
        Us = f.round(Us, 4);

        if (Us + Um == 0) {
            privateData.count = privateData.count + 1;

            if (privateData.count >= 10) {
                sync = true;
            }
        } else {
            privateData.count = 0;
        }

        return sync;
    }

    /**
     * 取得亂數初始直
     * @param {number} carry 進位
     * @returns {array}
     */
    getRandomInitValue(carry = 6) {
        const value = [];
        for (let i = 0; i < 3; i++) {
            value.push(f.round(Math.random() * 2 - 1, carry));
        }
        return value;
    }

    /**
     * 排除初始引響
     * @param {number} initValue 初始值
     * @param {number} timeStep 運算次數
     */
    chaosInit(initValue, timeStep) {
        let step = 0;
        let finValue = initValue;
        while (step <= timeStep) {
            finValue = this.runChaos(step, finValue);
            step++;
        }
        return finValue;
    }

    /**
     * 顯示測試
     */
    show() {
        let privateData = _Map.get(this);
        console.log(
            `A = ${privateData.A}, c = ${privateData.c}, g = ${
                privateData.g
            }, h = ${privateData.h}, j = ${privateData.j}`
        );
    }
}

export default Chaos;
