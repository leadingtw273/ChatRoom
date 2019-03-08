import dayjs from 'dayjs';
import AES from './plugins/AES.js';

const crypto = new AES('aes-256-ecb', 'sha256');

export default {
    computed: {
        $_userName() {
            return this.$store.getters.getUser;
        },
        $_privateKey() {
            return this.$store.getters.getKey;
        },
        $_roomId() {
            return this.$route.params.id;
        },
        $_routeName() {
            return this.$route.name;
        },
        $_rooms() {
            return this.$store.getters.getRooms;
        },
    },
    methods: {
        $_toPage(name, params) {
            if (params == null) {
                this.$router.push({ name });
            } else {
                this.$router.push({ name, params });
            }
        },
        $_timeSort(data, count = 1) {
            return data
                .slice()
                .sort((a, b) =>
                    dayjs(a.createTime).isBefore(dayjs(b.createTime))
                        ? count
                        : -count
                );
        },
        $_timeFormat(time, format) {
            if (format == null) {
                return dayjs(time).format();
            } else {
                return dayjs(time).format(format);
            }
        },
        $_encrypData(data) {
            const sendData = JSON.stringify(data);
            const buf_data = Buffer.from(sendData, 'utf8');
            const buf_key = Buffer.from(this.$_privateKey, 'utf8');
            return crypto.encryp(buf_data, buf_key).toString('hex');
        },
        $_decryptData(data) {
            const buf_data = Buffer.from(data, 'hex');
            const buf_key = Buffer.from(this.$_privateKey, 'utf8');

            const dec_data = crypto
                .decryp(buf_data, buf_key)
                .toString()
                .replace(/\'/g, '"')
                .replace(/\0/g, '');
            return JSON.parse(dec_data);
        },
    },
};
