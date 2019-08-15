'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const defaultRouter = require('./defaultRouter');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', defaultRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  return console.info(`server is listening on port ${port}`);
});
