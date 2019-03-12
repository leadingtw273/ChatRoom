const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(history());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', function(req, res) {
  const html = fs.readFileSync(
    path.resolve(__dirname, './dist/index.html'),
    'utf-8'
  );
  res.send(html);
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`app listening on port ${port}.`);
});
