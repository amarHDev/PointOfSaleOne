const db = require('../config/database');
const EventProduct = require('../models/user');

let newEvent = [
    new EventProduct({
        lastName: 'BOUZOURENE ',
        firstName: 'madjid',
        email: 'madjid@gmail.com',
        tel:'0555784136',
        adress: 'cité 400log',
        mdp: 'pass',
        date: '10/11/1996',
        created_at: Date.now()

    }),
]


newEvent.forEach((event) => {
    event.save((err) => {
        if (err) {
            console.log(err)
        }
    })
})