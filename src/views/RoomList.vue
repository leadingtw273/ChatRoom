<script>
import { minLength, maxLength } from 'vuelidate/lib/validators';

export default {
  name: 'RoomList',
  validations: {
    roomName: {
      minLength: minLength(3),
      maxLength: maxLength(10),
    },
  },
  data() {
    return {
      roomName: '',
    };
  },
  computed: {
    roomNameErrors() {
      const errors = [];
      if (!this.$v.roomName.$dirty) return errors;
      !this.$v.roomName.minLength && errors.push('最少3個字');
      !this.$v.roomName.maxLength && errors.push('最多10個字');

      return errors;
    },
  },
  methods: {
    clickRoom(id) {
      this.$_toPage('Room', { id });
    },
    addRoom() {
      this.$v.roomName.$touch();
      if (this.$v.roomName.$invalid) return false;

      const data = {
        roomName: this.roomName,
        master: this.$_userName,
      };

      this.$store.dispatch('addRoom', data);
      this.roomName = '';
    },
    getRoomList() {
      this.$store.dispatch('getRoomList');
    },
  },
  created() {
    this.getRoomList();
  },
};
</script>

<template>
  <div class="ChatRoomList">
    <div>
      <h1>Room List</h1>
      <hr>
    </div>
    <div class="input-group">
      <div class="input-group-prepend">
        <button class="btn btn-success" type="button" @click="getRoomList()">
          <i class="fas fa-redo-alt"></i>
        </button>
        <div class="input-group-text">
          <i class="fas fa-warehouse"></i>
        </div>
      </div>
      <input
        type="text"
        class="form-control"
        :class="[$v.roomName.$dirty && $v.roomName.$error?'is-invalid':'']"
        placeholder="Room's Name"
        @blur="$v.roomName.$touch()"
        v-model.trim="roomName"
      >
      <div class="input-group-append">
        <button
          class="btn btn-primary"
          type="button"
          @click="addRoom"
          :disabled="roomName.length === 0"
        >NEW</button>
      </div>
    </div>
    <span class="small text-danger" v-for="error in roomNameErrors" :key="error">
      <i class="fas fa-exclamation-circle mr-2"></i>
      <em>{{error}}</em>
    </span>
    <div class="list-group mt-4">
      <a
        href="javascript:;"
        class="list-group-item list-group-item-action d-flex justify-content-center"
        v-for="(room, index) in $_timeSort($_roomList)"
        :key="room.id"
        @click="clickRoom(room.id)"
      >
        <div class="row">
          <div class="col-2 text-info room-index d-flex align-items-center">
            <span>
              <i class="fas fa-angle-left"></i>
              {{index + 1 }}
              <i class="fas fa-angle-right"></i>
            </span>
          </div>
          <div class="col-5 room-name d-flex align-items-center">
            <span class>{{room.roomName}}</span>
          </div>
          <div class="col-2 room-time d-flex align-items-center">
            <span>
              <em>{{$_timeFormat(room.createTime,'YYYY/MM/DD HH:mm:ss')}}</em>
            </span>
          </div>
          <div
            class="col-3 badge room-creater d-flex align-items-center"
            :class="room.master === $_userName?'badge-success':'badge-primary'"
          >
            <span>{{room.master}}</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/style/all.scss';

.ChatRoomList {
  .list-group-item-action {
    color: $gray-800;
    > div {
      width: 100%;

      > * {
        margin: 0px;
        padding: 0px;
      }
      > .room-index {
        text-align: left;
        font-size: 18px;
      }
      > .room-name {
        text-align: left;
        font-weight: bold;
      }
      > .room-time {
        text-align: center;
        font-size: 5px;
      }
      > .room-creater {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 3px;
      }
    }
    &:hover {
      background-color: $primary;
      color: white;
    }
  }
}
</style>

