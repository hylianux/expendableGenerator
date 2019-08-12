'use strict';
const Router = require('express').Router;
const path = require('path');
const Room = require('./roomsGenerator');
const defaultRouter = Router();

defaultRouter.get('/', (req, res) => {
  console.log('received request');
  res.sendFile(path.join(__dirname + '/index.html'), err => {
    if (err) {
      console.error('error!', err);
      res.end();
    }
  });
});

defaultRouter.get('/rooms', (req, res) => {
  console.log('received rooms request');
  try {
    let rooms = [
      new Room('Green Armor Room', [0, 4]).serialize(),
      new Room('Computer Room', [2, 4]).serialize(),
      new Room('Acid Room', [3, 3, 2]).serialize(),
      new Room('Final Room', [4, 1, 1]).serialize(),
      new Room('Elevator Room', [0, 0, 1]).serialize(),
      new Room('Secret Elevator Room', [0, 1]).serialize(),
      new Room('Secret Acid Room', [0, 2]).serialize(),
    ];
    console.log("rooms generated, let's send 'em home");
    res.json(rooms);
    console.log('sent home');
    res.end();
  } catch (e) {
    console.log('error: ', e);
    res.send('error');
    res.end();
  }
});
module.exports = defaultRouter;
