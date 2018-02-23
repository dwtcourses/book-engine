/**
 * @author Mukul <@mukul1904>
 */
'use strict';

const alexaLogger = require('../logger');
const { 
    handleBookInfoReq,
    scrapeService 
} = require('../service');

const {
    greetingMessage,
    helpMessage,
    errMessage,
    goodbyeMessage,
    aboutBFI,
    contactUsMessage
} = require('../messages');

const AlexaSkillFactory = {};


AlexaSkillFactory.handleRequest = (event, callback) => {
    try {
        
    } catch (err) {
        callback(err);
    }
};

module.exports = AlexaSkillFactory;
