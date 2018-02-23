/**
 * @author Mukul <@mukul1904>
 */

'use strict';

const { get, isEqual } = require('lodash');

const alexaId = process.env.ALEXA_ID;

const helpers = {};

helpers.isBot = (event) => get(event, 'bot');

helpers.isAlexaSkill = (event) => isEqual(event.session.application.applicationId, alexaId);

module.exports = helpers;
