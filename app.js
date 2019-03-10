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
app.listen(8084, () => {
  console.log('app listening on port 8084.');
});
