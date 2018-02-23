/**
 * @author Mukul <@mukul1904>
 */

'use strict';

const alexaLogger = require('./logger');
const BotFactory = require('./bot');
const AlexaFactory = require('./alexa-skill');
const helper = require('./helper');

exports.handler = (event, context, callback) => {
    try {
        alexaLogger.logInfo('Lambda invokes');
        if (helper.isBot(event)) {
            alexaLogger.logInfo('Bot Request found');
            return BotFactory.handleRequest(event, callback);
        } else if (helper.isAlexaSkill(event)) {
            alexaLogger.logInfo('Alexa Skill Request found');
            return AlexaFactory.handleRequest(event, callback);
        }
        alexaLogger.logError('Invalid format found');
        return callback('Invalid format found');
    } catch (err) {
        alexaLogger.logError(`Error in book-engine-core - ${err}`)
        callback(err);
    }
};