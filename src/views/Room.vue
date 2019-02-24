<script>
import io from 'socket.io-client';
import dayjs from 'dayjs';

let socket = {};
let chaos_socket = {};
export default {
  name: 'Room',
  data() {
    return {
      reLoadDisabled: true,
      messages: [],
      message: '',
      key: '',
    };
  },
  computed: {
    userName() {
      return this.$store.state.user;
    },
    roomId() {
      return this.$route.params.id;
    },
  },
  methods: {
    sortData(data, count = 1) {
      return data
        .slice()
        .sort((a, b) =>
          dayjs(a.createTime).isBefore(dayjs(b.createTime)) ? count : -count
        );
    },
    printTime(time) {
      return dayjs(time).format('YYYY/MM/DD HH:mm:ss');
    },
    addMsg() {
      if (this.message !== '') {
        console.log(this.message);
        chaos_socket.emit('encrypt', {
          _key: this.key,
          _target: this.message,
        });
      }
    },
    setKey() {
      if (this.key !== '') {
        this.reLoadDisabled = true;
        this.messages = [];
        socket.emit('getMessage', { id: this.roomId });
      }
    },
  },
  updated() {
    const scrollItem = this.$el.querySelector('.message-bar');
    scrollItem.scrollTop = scrollItem.scrollHeight;
  },
  created() {
    socket = io('http://localhost:3000/', {
      path: '/messages',
    });
    chaos_socket = io('http://192.168.0.4:9453/', {
      path: '/chaos',
    });
    socket.emit('getMessage', { id: this.roomId });

    chaos_socket.on('encrypt_data', data => {
      socket.emit('setMessage', {
        roomId: this.roomId,
        message: {
          createTime: dayjs().format(),
          from: this.userName,
          message: data._target,
          Um: data._Um,
        },
      });
    });

    chaos_socket.on('decrypt_data', data => {
      this.messages.push({
        createTime: data.createTime,
        from: data.from,
        id: data.id,
        message: data._target,
      });
      this.reLoadDisabled = false;
    });

    socket.on('messages', data => {
      data.forEach(cryptData => {
        chaos_socket.emit('decrypt', {
          _target: cryptData.message,
          _Um: cryptData.Um,
          _key: this.key,
          ...cryptData,
        });
      });
    });

    socket.on('pushMessage', data => {
      chaos_socket.emit('decrypt', {
        _target: data.message,
        _Um: data.Um,
        _key: this.key,
        ...data,
      });
    });
  },
  beforeDestroy() {
    socket.close();
    chaos_socket.close();
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
          <input type="text" class="form-control" placeholder="Room's Key" v-model.trim="key">
        </div>
      </div>
      <div class="col-sm-3 d-flex justify-content-end">
        <button
          class="btn btn-primary my-1"
          type="button"
          :disabled="reLoadDisabled"
          @click="setKey()"
        >RELOAD</button>
      </div>
    </div>
    <div class="border-chat p-3">
      <div class="message-bar">
        <div
          class="message-item text-left"
          v-for="message in sortData(messages, -1)"
          :key="message.id"
        >
          <p
            :class="['name', message.from === userName ? 'text-primary' : 'text-info']"
          >{{message.from}}</p>
          <div class="text d-flex justify-content-between align-items-end">
            <span class="text-message">{{message.message}}</span>
            <span class="text-time">{{printTime(message.createTime)}}</span>
          </div>
        </div>
      </div>
      <div class="input-bar px-3">
        <hr class="my-3">
        <div class="input-group">
          <input type="text" class="form-control" placeholder="text" v-model="message">
          <div class="input-group-append">
            <span class="input-group-text" id="basic-addon1">{{userName}}</span>
            <button
              class="btn btn-primary"
              type="button"
              @click="addMsg()"
              :disabled="key === ''"
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

