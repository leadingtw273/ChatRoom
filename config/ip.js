export default {
  API_Server:
    process.env.NODE_ENV === 'production'
      ? process.env.API_SERVER
      : 'http://192.168.0.8:3000',
  Chaos_Server:
    process.env.NODE_ENV === 'production'
      ? process.env.CHAOS_SERVER
      : 'http://192.168.0.6:9453',
};
