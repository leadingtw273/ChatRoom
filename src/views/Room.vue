<script>
import io from 'socket.io-client';
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://120.119.73.1:5000/',
});

let socket = {};
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
    sortMessages() {
      const target = this.messages.slice();
      return target.sort((a, b) => a.id - b.id);
    },
    userName() {
      return this.$store.state.user;
    },
    roomId() {
      return Number(this.$route.params.id);
    },
  },
  methods: {
    addMsg() {
      if (this.message !== '') {
        instance
          .post('/AES_encrypt', {
            key: this.key,
            data: this.message,
          })
          .then(res => {
            return {
              roomId: this.roomId,
              message: {
                from: this.userName,
                id: this.messages.length,
                message: res.data.encrypt_text,
                Um: res.data.Um,
              },
            };
          })
          .then(data => {
            socket.emit('setMessage', data);
            this.messages.push({
              id: this.messages.length,
              message: this.message,
              from: this.userName,
            });
            this.message = '';
          })
          .catch(err => {
            console.log(err);
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
    socket = io('http://127.0.0.1:3000/', {
      path: '/messages',
    });
    socket.emit('getMessage', { id: this.roomId });
    socket.on('messages', data => {
      const forPromis = [];
      data.forEach(cryptData => {
        forPromis.push(
          instance
            .post('/AES_decrypt', {
              data: cryptData.message,
              Um: cryptData.Um,
              key: this.key,
            })
            .then(res => {
              this.messages.push({
                from: cryptData.from,
                id: cryptData.id,
                message: res.data.decrypt_text,
              });
            })
            .catch(err => console.log(err))
        );
      });
      Promise.all(forPromis)
        .then(() => {
          this.reLoadDisabled = false;
        })
        .catch(err => console.log(err));
    });
    socket.on('pushMessage', data => {
      instance
        .post('/AES_decrypt', {
          data: data.message,
          Um: data.Um,
          key: this.key,
        })
        .then(res => {
          this.messages.push({
            from: data.from,
            id: data.id,
            message: res.data.decrypt_text,
          });
        })
        .catch(err => console.log(err));
    });
  },
  beforeDestroy() {
    socket.close();
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
          v-bind:disabled="reLoadDisabled"
          v-on:click="setKey()"
        >RELOAD</button>
      </div>
    </div>
    <div class="border-chat p-3">
      <div class="message-bar">
        <div
          class="message-item text-left"
          v-for="message in sortMessages"
          :key="message.id"
          v-bind:class="message.from === userName ? 'user' : ''"
        >
          <p class="name">{{message.from}}</p>
          <p class="text">{{message.message}}</p>
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
              v-on:click="addMsg()"
              v-bind:disabled="key === ''"
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

