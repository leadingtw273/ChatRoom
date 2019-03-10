import AES from '../libs/crypto.js';

const _private = new WeakMap();
const crypto = new AES('aes-256-ecb', 'sha256');

class E2E {
  constructor(key) {
    _private.set(this, {
      key,
    });
  }

  encrypt(data) {
    const { key } = _private.get(this);

    const sendData = JSON.stringify(data);
    const buf_data = Buffer.from(sendData, 'utf8');
    const buf_key = Buffer.from(key, 'utf8');
    return crypto.encryp(buf_data, buf_key).toString('hex');
  }

  decrypt(data) {
    const { key } = _private.get(this);

    const buf_data = Buffer.from(data, 'hex');
    const buf_key = Buffer.from(key, 'utf8');

    const dec_data = crypto
      .decryp(buf_data, buf_key)
      .toString()
      .replace(/\'/g, '"')
      .replace(/\0/g, '');
    return JSON.parse(dec_data);
  }
}

export default E2E;
