//jshint esversion:8
const { setOnline }= require('../helpers/afkhandler');
const logger = require('../logger');
const execute = async (client,msg) => {
    let data = await setOnline();
    if(data) {
        await logger(client, JSON.stringify(data,null,4));
    }
    else {
        await logger(client, `Your aren't afk`);
    }
};

module.exports = {
    name: 'Online',
    description: 'Disable afk', 
    command: '!online', 
    commandType: 'admin', 
    isDependent: true,
    help: 'Type in !online.',
    execute};