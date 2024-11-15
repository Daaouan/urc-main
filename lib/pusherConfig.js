// pusherConfig.js
const PushNotifications = require('@pusher/push-notifications-server');

const beamsClient = new PushNotifications({
  instanceId: 'd119df2c-f7bd-4788-9562-9bd8ed920f5c',
  secretKey: '011FE802D12636A89CD615C3B68C0E8C524F592E1420DB909FB8F68E670A4CC2'
});

module.exports = beamsClient;
