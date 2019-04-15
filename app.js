const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');
const app = express();

const showLogger = function(req, res, next) {
  console.log('LOGGED: ', req.path);
  next();
};

app.use(history());
app.use(showLogger);
app.use(express.static(path.join(__dirname, 'dist')));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App listening on port ${port}.`);
  console.log(`Service run on ${process.env.NODE_ENV}.`);
});
