<script>
import io from 'socket.io-client';

let socket = {};
export default {
    name: 'RoomList',
    data() {
        return {
            roomName: '',
            rooms: [],
        };
    },
    computed: {
        sortRooms() {
            const target = this.rooms.slice();
            return target.sort((a, b) => a.id - b.id);
        },
        userName() {
            return this.$store.state.user;
        },
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
                    id: this.rooms.length,
                    roomName: this.roomName,
                    createBy: this.userName,
                };
                socket.emit('setRoom', data);
                this.rooms.push(data);
                this.roomName = '';
            }
        },
    },
    created() {
        socket = io('http://120.119.73.1:3000/', {
            path: '/rooms',
        });
        socket.emit('getRooms');
        socket.on('rooms', data => {
            this.rooms = data;
        });
        socket.on('pushRoom', data => {
            this.rooms.push(data);
        });
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
                <button class="btn btn-primary my-1" type="button" v-on:click="addRoom">NEW</button>
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
        v-for="(room, index) in sortRooms"
        v-bind:key="room.id"
        v-on:click="clickRoom(room.id)"
      >
        <div class="row">
          <h5 class="col-2 room-index">{{index + 1 }}</h5>
          <p class="col-7 room-name">{{room.roomName}}</p>
          <span
            class="col-3 badge room-creater"
            v-bind:class="room.createBy === username?'badge-primary':'badge-info'"
          >
            <small class>{{room.createBy}}</small>
          </span>
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
            }
            > .room-name {
                text-align: left;
                font-weight: bold;
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

