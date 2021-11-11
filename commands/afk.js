//jshint esversion:8
const logger = require('../logger');
const { setAfk } = require('../helpers/afkhandler');

const execute = async (client,msg,args) => {
    msg.delete(true);
    let isAfk = await setAfk(args.join(' '));
    if(isAfk){
        await logger(client,`You're now marked as offline. To mark yourself back online, use !online`);
    }
    else{
        await logger(client,`Some error occured.`);
    }
};

module.exports = {
    name: 'Away',
    description: 'Mark yourself as offline.',
    command: '!afk',
    commandType: 'admin',
    isDependent: false,
    help: 'Use !afk to mark yourself as offline. Recipients will be replied with an automated message when you\'re offline. You can also provide further information with the command like this -\n\n!afk [info]\n\nTo mark yourself back online, use !awake',
    execute};