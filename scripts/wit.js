"use strict";

const witHelper = require('hubot-wit-helper');

const WIT_TOKEN = 'AUGKNTA4PRJTXBW2EDFXPOXIDCDLM7KJ';
const actions = {
    say(session, context, message, cb) {
        //res object is attached to the session
        session.res.reply(message);
        cb();
    },
    merge(session, context, entities, message, cb) {
        cb(context);
    },
    error(session, context, error) {
        console.error(error.message);
        session.res.send('Something went wrong with Wit.ai');
    },
    send(request, response) {

        const { sessionId } = request;
        const { text } = response;

        return new Promise(function(resolve) {
            //res object is attached to the sessionId
            sessionId.res.reply(text);
            return resolve();
        });
    },
    sendHi(req, res) {
        const { sessionId } = req;
        const { text } = res;

        return new Promise(function(resolve) {
            //res object is attached to the sessionId
            sessionId.res.reply(text);
            return resolve();
        });
    },
    getForecast({context, entities}) {
        console.log('entities', entities);
        console.log('cotext', context);
        return new Promise((resolve) => {

            if ( entities.location ) {
                context.forecast ='lame';
                delete context.missingLocation;
            } else {
                context.missingLocation = true;
            }

            return resolve(context);
        });
    }
};
const bot = (robot) => {
    const witRobot = new witHelper.Robot(WIT_TOKEN, actions, robot, new witHelper.log.Logger(witHelper.log.DEBUG));

    const reg = /(\ *@(.*):\ +(hey)(.*))/i;

    witRobot.getMessage = (res) => { //custom getMessage
        console.log('------' + res);
        return res.match[3]; //return "you"
    };

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