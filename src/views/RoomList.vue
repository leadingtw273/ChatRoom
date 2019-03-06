<script>
import io from 'socket.io-client';
import dayjs from 'dayjs';
import ip from '../../config/ip.js';

const socket = io(ip.dev.backend, { path: '/rooms' });

export default {
  name: 'RoomList',
  data() {
    return {
      roomName: '',
      rooms: [],
    };
  },
  methods: {
    clickRoom(id) {
      this.$router.push({
        name: 'Room',
        params: { id },
      });
    },
    addRoom() {
      if (this.roomName !== '') {
        const data = {
          createTime: dayjs().format(),
          roomName: this.roomName,
          master: this.userName,
        };
        socket.emit('setRoom', data);
        this.roomName = '';
      }
    },
  },
  created() {
    socket.on('rooms', data => {
      this.rooms = data;
    });

    socket.on('pushRoom', data => {
      this.rooms.push(data);
    });

    socket.emit('getRooms');
  },
  beforeDestroy() {
    socket.close();
  },
};
</script>

<template>
  <div class="ChatRoomList">
    <div>
      <h1>ChatRoomList</h1>
      <hr>
    </div>
    <div class="w-100 d-flex">
      <button
        type="button"
        class="btn btn-primary"
        data-toggle="collapse"
        data-target="#collapseExample"
      >
        <i class="fas fa-plus-circle"></i>
      </button>
      <div class="collapse w-100" id="collapseExample">
        <div class="card card-body">
          <form>
            <div class="form-row align-items-center">
              <div class="col-sm-10">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text">
                      <i class="fas fa-warehouse"></i>
                    </div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Room's Name"
                    v-model.trim="roomName"
                  >
                </div>
              </div>
              <div class="col-sm-2 d-flex justify-content-end">
                <button class="btn btn-primary my-1" type="button" @click="addRoom">NEW</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="list-group mt-4">
      <a
        href="javascript:;"
        class="list-group-item list-group-item-action d-flex justify-content-center"
        v-for="(room, index) in $_timeSort(rooms)"
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

