import dayjs from 'dayjs';

export default {
  computed: {
    $_roomId() {
      return this.$route.params.id;
    },
    $_routeName() {
      return this.$route.name;
    },
    $_userName() {
      return this.$store.getters.userName;
    },
    $_roomList() {
      return this.$store.getters.roomList;
    },
  },
  methods: {
    $_getRoomName(id) {
      return this.$store.getters.roomName(id);
    },
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
          dayjs(a.createTime).isBefore(dayjs(b.createTime)) ? count : -count
        );
    },
    $_timeFormat(time, format) {
      if (format == null) {
        return dayjs(time).format();
      } else {
        return dayjs(time).format(format);
      }
    },
  },
};
