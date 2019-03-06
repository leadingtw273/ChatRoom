import crypto from 'crypto';

let _aesParam = new WeakMap();

class AES {
    /**
     * AES 的 constructor
     */
    constructor(aes, ...opt) {
        _aesParam.set(this, {
            aesMode: aes,
            hashMode: opt[0] ? opt[0] : null,
            iv: opt[1] ? opt[1] : null,
        });
    }

    /**
     * 將傳入值進行hash運算
     */
    setKey(crptKey) {
        let privateData = _aesParam.get(this);
        // hash 混沌產生值 轉成對稱金鑰
        if (null != privateData.hashMode) {
            return crypto
                .createHash(privateData.hashMode)
                .update(crptKey)
                .digest();
        } else {
            return crptKey;
        }
    }

    /**
     * 將傳入值進行AES加密運算
     */
    encryp(data, key) {
        let privateData = _aesParam.get(this);
        let aes256Enc = null;
        let sendData = Buffer.alloc(16);
        while (data.length % 16 != 0) {
            data = Buffer.concat([data, Buffer.alloc(1)]);
        }
        try {
            aes256Enc = crypto
                .createCipheriv(
                    privateData.aesMode,
                    this.setKey(key),
                    privateData.iv || ''
                )
                .setAutoPadding(false);

            sendData = Buffer.concat([
                aes256Enc.update(data),
                aes256Enc.final(),
            ]);
        } catch (e) {
            throw e;
        }
        return sendData;
    }

    /**
     * 將傳入值進行AES解密運算
     */
    decryp(data, key) {
        let privateData = _aesParam.get(this);
        let aes256Dec = null;
        let getData = Buffer.alloc(16);
        try {
            aes256Dec = crypto
                .createDecipheriv(
                    privateData.aesMode,
                    this.setKey(key),
                    privateData.iv || ''
                )
                .setAutoPadding(false);

            getData = aes256Dec.update(data);
            getData = Buffer.concat([getData, aes256Dec.final()]);
        } catch (e) {
            throw e;
        }
        return getData;
    }
}

export default AES;
