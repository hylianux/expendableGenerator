'use strict';
const Router = require('express').Router;
const path = require('path');
const Room = require('./roomsGenerator').Room;
const RoomsError = require('./roomsGenerator').RoomsError;
const defaultRouter = Router();

defaultRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'), err => {
    if (err) {
      console.error('error!', err);
    }
  });
});

defaultRouter.get('/rooms', (req, res) => {
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
    res.json(rooms);
  } catch (e) {
    console.error('error: ', e);
    res.send('error');
  }
});

defaultRouter.post('/rooms', (req, res) => {
  let roomsData = req.body;
  if (!(roomsData instanceof Array)) {
    console.error(`invalid data`, new RoomsError(`invalid data, expected array`, roomsData));
    res.send(`invalid data`);
  } else {
    let rooms = [];
    try {
      roomsData.forEach(data => {
        let room = new Room(data.name, data.enemies);
        rooms.push(room.serialize());
      });
      res.json(rooms);
    } catch (e) {
      console.error('error: ', e);
      res.send('error!');
    }
  }
});
module.exports = defaultRouter;
