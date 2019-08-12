'use strict';
const Router = require('express').Router;
const path = require('path');
const Room = require('./roomsGenerator');
const defaultRouter = Router();

defaultRouter.get('/', (req, res) => {
  console.log('received request');
  res.sendFile(path.join(__dirname + '/index.html'));
});

defaultRouter.get('/rooms', (req, res) => {
  console.log('received rooms request');
  try {
    let rooms = [
      new Room('Green Armor Room', [0, 4]),
      new Room('Computer Room', [2, 4]),
      new Room('Acid Room', [3, 3, 2]),
      new Room('Final Room', [4, 1, 1]),
      new Room('Elevator Room', [0, 0, 1]),
      new Room('Secret Elevator Room', [0, 1]),
      new Room('Secret Acid Room', [0, 2]),
    ];
    res.json(rooms);
  } catch (e) {
    console.log('error: ', e);
  }
});
module.exports = defaultRouter;
