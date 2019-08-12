'use strict';
'use strict';
const express = require('express');
const defaultRouter = require('./defaultRouter');
const bodyParser = require('body-parser');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', defaultRouter);

const port = process.env.PORT || 3000;

app.listen(port, err => {
  if (err) {
    console.error('error!', err);
  }
  return console.info(`server is listening on port ${port}`);
});
