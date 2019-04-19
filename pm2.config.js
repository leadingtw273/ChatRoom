module.exports = {
  apps: [
    {
      name: 'Chatroom_Fontend',
      script: './app.js',
      exec_mode: 'cluster',
      watch: false,
      instances: 1,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
