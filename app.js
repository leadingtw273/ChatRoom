const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');
const app = express();

const myLogger = function(req, res, next) {
  console.log('LOGGED: ', req.path);
  next();
};

app.use(history());
app.use(myLogger);
app.use('/chatroom', express.static(path.join(__dirname, 'dist')));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app listening on port ${port}.`);
});
