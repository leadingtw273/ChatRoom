<script>
import io from 'socket.io-client';
import E2E from '../services/E2E.js';
import ChaosSync from '../services/ChaosSync.js';

let _chaosSync = {};
let _e2e = {};
let _messageSocket = {};

export default {
  name: 'Room',
  sockets: {
    UmCatch(isSync) {
      if (!isSync) {
        _chaosSync.runChaos();
        this.$socket.emit('UmPush', _chaosSync.getUm());
      } else {
        console.log('[Chaos Sync Success!!]');
        this.isSync = true;
        _e2e = new E2E(_chaosSync.getKey());
        _messageSocket.emit('join', this.$_userName);
      }
    },
    e2eEncryptReturn(data) {
      const dec_data = _e2e.decrypt(data);

      _messageSocket.emit('setMessage', {
        from: this.$_userName,
        message: dec_data._target,
        Um: dec_data._Um,
      });
    },
    e2eDecryptReturn(data) {
      const { createTime, from, id, _target } = _e2e.decrypt(data);
      this.messages.push({ createTime, from, id, message: _target });
    },
  },
  data() {
    return {
      reLoad: false,
      keySet: false,
      isSync: false,
      messages: [],
      message: '',
      key: '',
    };
  },
  watch: {
    key() {
      this.keySet = false;
    },
  },
  methods: {
    decHex(msg) {
      return Buffer.from(msg, 'hex').toString();
    },
    addMsg() {
      if (this.message === '') return false;

      const enc_data = _e2e.encrypt({
        _target: this.message,
        _key: this.key,
      });
      this.$socket.emit('e2eEncrypt', enc_data);
      this.message = '';
    },
    setKey() {
      this.keySet = true;
      this.reLoad = true;
      this.messages = [];
      _messageSocket.emit('getMessage');
    },
  },
  updated() {
    const scrollItem = this.$el.querySelector('.message-bar');
    scrollItem.scrollTop = scrollItem.scrollHeight;
  },
  created() {
    _chaosSync = new ChaosSync();
    this.$socket.emit('SyncReady', _chaosSync.getUm());

    _messageSocket = io(process.env.VUE_APP_SERVER_URL, {
      path: process.env.VUE_APP_API_SOCKET_PATH,
    });

    _messageSocket.on('messages', data => {
      this.reLoad = false;
      data.forEach(cryptData => {
        const enc_data = _e2e.encrypt({
          _target: cryptData.message,
          _Um: cryptData.Um,
          _key: this.key,
          ...cryptData,
        });

        this.$socket.emit('e2eDecrypt', enc_data);
      });
    });

    _messageSocket.on('pushMessage', data => {
      const enc_data = _e2e.encrypt({
        _target: data.message,
        _Um: data.Um,
        _key: this.key,
        ...data,
      });

      this.$socket.emit('e2eDecrypt', enc_data);
    });

    _messageSocket.on('system', data => {
      console.log('[System Info] : ', data);
    });
  },
  beforeDestroy() {
    _messageSocket.emit('leave');
    _messageSocket.close();
  },
};
</script>

<template>
  <div class="ChatRoom">
    <div>
      <h1 class="text-info">{{$_getRoomName($_roomId)}}</h1>
      <hr>
    </div>
    <div class="form-row align-items-center mb-3">
      <div class="col-sm-12">
        <div class="input-group">
          <div class="input-group-prepend">
            <div class="input-group-text">
              <i class="fas fa-key"></i>
            </div>
          </div>
          <input
            type="text"
            class="form-control"
            placeholder="Room's Key"
            v-model.trim="key"
            maxlength="60"
          >
          <div class="input-group-append">
            <button
              class="btn btn-primary"
              :class="[keySet ? 'btn-success':'btn-info']"
              type="button"
              :disabled=" reLoad || keySet || !isSync || key === ''"
              @click="setKey()"
            >
              <i class="far fa-check-circle" v-if="keySet"></i>
              <i class="fas fa-redo-alt" v-else></i>
            </button>
          </div>
        </div>
      </div>
      <div class="col-sm-3 d-flex justify-content-end"></div>
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
          <div class="text d-flex">
            <span class="text-message">{{decHex(message.message)}}</span>
          </div>
          <div class="text d-flex justify-content-end mt-2">
            <span class="text-time">{{$_timeFormat(message.createTime, 'YYYY/MM/DD HH:mm:ss')}}</span>
          </div>
        </div>
      </div>
      <div class="input-bar px-3">
        <hr class="my-3">
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="text"
            maxlength="50"
            v-model="message"
            :disabled="reLoad || !keySet|| !isSync"
          >
          <div class="input-group-append">
            <span class="input-group-text" id="basic-addon1">{{$_userName}}</span>
            <button
              class="btn btn-primary"
              type="button"
              @click="addMsg()"
              :disabled="reLoad || !keySet|| !isSync || message === ''"
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

      padding-right: 10px;
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
          word-break: break-all;
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

