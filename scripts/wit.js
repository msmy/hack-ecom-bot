"use strict";

const witHelper = require('hubot-wit-helper');

const WIT_TOKEN = '5PYEZJD6LFDYPLH6E6GARLHTZQUKMGD4';

const speeds = {
  'TW7 2HD': {
      speed: '10',
      town: 'London'
  },
  'IP11 9ER': {
      speed: '80',
      town: 'Ipswich'
  },
  'TW9 2HD': {
      speed: '22',
      town: 'Richmond'
  }
};

const schedule = {
    'game of thrones': '28th July',
    'the walking dead': '1st April at 7pm'
};

const actions = {
    send(request, response) {

        const { sessionId } = request;
        const { text } = response;

        return new Promise(function(resolve) {
            sessionId.res.send(text);
            return resolve();
        });
    },
    sendHi({context, entities}) {
        return new Promise(function(resolve) {
            //res object is attached to the sessionId

            if ( entities.contact ) {
                context.name = entities.contact[0].value;
            }

            return resolve(context);
        });
    },
    getSchedule({context, entities}) {
        return new Promise(function(resolve) {
            //res object is attached to the sessionId

            const content = entities.content[0].value;
            const response = schedule[content];

            if ( response ) {
                context.response = response;
            } else {
                context.response = 'Its not on till later this year!';
            }


            return resolve(context);
        });
    },
    getForecast({context, entities}) {
        //console.log('entities', entities);
        //console.log('cotext', context);
        return new Promise((resolve) => {

            if ( entities.location ) {
                context.forecast ='lame';
                delete context.missingLocation;
            } else {
                context.missingLocation = true;
            }

            return resolve(context);
        });
    },
    getSpeeds({context, entities}) {
       // console.log('entities', entities);
       // console.log('cotext', context);
        return new Promise((resolve) => {

            if ( entities.location ) {

                const data = speeds[entities.location[0].value] || speeds['TW9 2HD'];

                context.town = data.town;
                context.speed = data.speed + ' Mb/s';
                context.postcode = encodeURIComponent(entities.location[0].value);
                delete context.missingPostcode;
            } else {
                context.missingPostcode = true;
            }

            return resolve(context);
        });
    }
};
const bot = (robot) => {
    // const witRobot = new witHelper.Robot(WIT_TOKEN, actions, robot, new witHelper.log.Logger(witHelper.log.DEBUG));
    const witRobot = new witHelper.Robot(WIT_TOKEN, actions, robot);

    witRobot.respond(/(.*)/gi, (err, context, res) => {
        console.log(`[USER] ${witRobot.getMsg(res)}`);
        if (err) {
            console.error(err);
            return;
        }
        //do stuff if you want
    });
};
module.exports = bot;