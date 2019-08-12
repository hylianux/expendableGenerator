'use strict';
const express = require('express');
const defaultRouter = require('./defaultRouter');

let app = express();

app.use('/', defaultRouter);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  return console.info(`server is listening on port ${port}`);
});
