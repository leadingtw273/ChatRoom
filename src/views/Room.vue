<script>
import io from 'socket.io-client';
import dayjs from 'dayjs';
import ip from '../../config/ip.js';
import _ from 'lodash';
import HENMAP from '../plugins/HENMAP.js';

const chaos = new HENMAP(0.00001, [-0.0001, 0.0001]);

let back_socket = {};

export default {
  name: 'Room',
  sockets: {
    chaos_next_um({ _x, _step, _isSync }) {
      this.isSync = _isSync;
      if (!this.isSync) {
        this.chaosValue.step = _step + 1;
        this.chaosValue.x = chaos.runChaos(this.chaosValue.step, _x);
        this.chaosValue.um = chaos.createUm(this.chaosValue.x);

        this.$socket.emit('chaos_um', _.cloneDeep(this.chaosValue));
      }
    },
    encrypt_data(data) {
      const dec_data = this.$_decryptData(data);

      back_socket.emit('setMessage', {
        createTime: dayjs().format(),
        from: this.$_userName,
        message: dec_data._target,
        Um: dec_data._Um,
      });
    },
    decrypt_data(data) {
      const { createTime, from, id, _target } = this.$_decryptData(data);
      this.messages.push({ createTime, from, id, message: _target });
      this.reLoadDisabled = false;
    },
  },
  data() {
    return {
      reLoadDisabled: true,
      messages: [],
      message: '',
      key: '',
      isSync: false,
      chaosValue: {
        step: 100,
        x: [],
        um: 0,
      },
    };
  },
  watch: {
    isSync(val) {
      if (val) {
        const key = this.chaosValue.x
          .map(val => val.toString().slice(0, val.toString().indexOf('.') + 5))
          .join('/');
        this.$store.commit('SET_PRIVATE_KEY', { key });
      }
    },
  },
  methods: {
    startChaosSync() {
      const CHAOS_INIT_VALUE = chaos.getRandomInitValue();

      const step = 100;
      const x = chaos.chaosInit(CHAOS_INIT_VALUE, step);
      const um = chaos.createUm(x);

      this.chaosValue = { x, step, um };
      this.$socket.emit('chaos_ready', this.chaosValue);
    },
    decMessage(msg) {
      return Buffer.from(msg, 'hex').toString();
    },
    addMsg() {
      if (this.message != '') {
        const enc_data = this.$_encrypData({
          _target: this.message,
          _key: this.key,
        });
        this.$socket.emit('encrypt', enc_data);
        this.message = '';
      }
    },
    setKey() {
      if (this.key !== '') {
        this.reLoadDisabled = true;
        this.messages = [];
        back_socket.emit('getMessage');
      }
    },
  },
  updated() {
    const scrollItem = this.$el.querySelector('.message-bar');
    scrollItem.scrollTop = scrollItem.scrollHeight;
  },
  created() {
    this.startChaosSync();

    back_socket = io(ip.dev.backend);

    back_socket.on('messages', data => {
      data.forEach(cryptData => {
        const enc_data = this.$_encrypData({
          _target: cryptData.message,
          _Um: cryptData.Um,
          _key: this.key,
          ...cryptData,
        });

        this.$socket.emit('decrypt', enc_data);
      });
    });

    back_socket.on('pushMessage', data => {
      const enc_data = this.$_encrypData({
        _target: data.message,
        _Um: data.Um,
        _key: this.key,
        ...data,
      });

      this.$socket.emit('decrypt', enc_data);
    });

    back_socket.on('system', data => {
      console.log(data);
    });

    back_socket.emit('join', this.$_userName);
  },
  beforeDestroy() {
    back_socket.emit('leave');
    back_socket.close();
  },
};
</script>

<template>
  <div class="ChatRoom">
    <div>
      <h1>ChatRoom</h1>
      <hr>
    </div>
    <div class="form-row align-items-center mb-3">
      <div class="col-sm-9">
        <div class="input-group">
          <div class="input-group-prepend">
            <div class="input-group-text">
              <i class="fas fa-key"></i>
            </div>
          </div>
          <input
            type="text"
            class="form-control"
            :disabled="!isSync"
            placeholder="Room's Key"
            v-model.trim="key"
          >
        </div>
      </div>
      <div class="col-sm-3 d-flex justify-content-end">
        <button
          class="btn btn-primary my-1"
          type="button"
          :disabled=" !isSync || reLoadDisabled"
          @click="setKey()"
        >RELOAD</button>
      </div>
    </div>
    <div class="border-chat p-3">
      <div class="message-bar">
        <div
          class="message-item text-left"
          v-for="message in $_timeSort(messages, -1)"
          :key="message.id"
        >
          <p
            :class="['name', message.from === $_userName ? 'text-primary' : 'text-info']"
          >{{message.from}}</p>
          <div class="text d-flex justify-content-between align-items-end">
            <span class="text-message">{{decMessage(message.message)}}</span>
            <span class="text-time">{{$_timeFormat(message.createTime, 'YYYY/MM/DD HH:mm:ss')}}</span>
          </div>
        </div>
      </div>
      <div class="input-bar px-3">
        <hr class="my-3">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="text" v-model="message">
          <div class="input-group-append">
            <span class="input-group-text" id="basic-addon1">{{$_userName}}</span>
            <button
              class="btn btn-primary"
              type="button"
              @click="addMsg()"
              :disabled="!isSync || reLoadDisabled"
            >send</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/style/all.scss';

.ChatRoom {
  .border-chat {
    height: 370px;
    border: 3px solid $secondary;
    border-radius: 1rem;
    background-color: $gray-100;
    position: relative;
    .message-bar {
      height: calc(100% - 100px);
      width: 100%;
      overflow-y: scroll;
      > .user {
        color: $primary;
      }
      > .message-item {
        padding-bottom: 10px;

        + * {
          border-top: 1px solid $gray-200;
        }
        > * {
          margin: 0px;
          padding: 0px;
        }
        .name {
          font-size: 20px;
          font-weight: bold;
        }
        .text {
          word-wrap: break-word;
          .text-time {
            font-size: 12px;
          }
        }
      }
    }
    .input-bar {
      position: absolute;
      bottom: 0px;
      left: 0px;
      height: 100px;
      width: 100%;
    }
  }
}

@include media-breakpoint-up(sm) {
  .ChatRoom {
    .border-chat {
      height: 500px;
    }
  }
}
</style>

