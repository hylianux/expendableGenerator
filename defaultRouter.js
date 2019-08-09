'use strict';
const Router = require('express').Router;
const path = require('path');
const roomsGenerator = require('./roomsGenerator');
const defaultRouter = Router();

defaultRouter.get('/', (req, res) => {
    console.log('received request');
    res.sendFile(path.join(__dirname + '/index.html'));
});

defaultRouter.get('/rooms', (req, res) => {
    console.log('received rooms request');
    let rooms = [
        new roomsGenerator.Room('Green Armor Room', [0, 4]),
        new roomsGenerator.Room('Computer Room', [2, 4]),
        new roomsGenerator.Room('Acid Room', [3, 3, 2]),
        new roomsGenerator.Room('Final Room', [4, 1, 1]),
        new roomsGenerator.Room('Elevator Room', [0, 0, 1]),
        new roomsGenerator.Room('Secret Elevator Room', [0, 1]),
        new roomsGenerator.Room('Secret Acid Room', [0, 2]),
    ];
    let response = JSON.stringify(rooms);
    console.log(rooms);
    res.json(rooms);
});
module.exports = defaultRouter;
