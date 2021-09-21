//jshint esversion:8
const execute = async (client, msg, args) => {
  let chat = await msg.getChat();

  if (chat.isGroup) {
    try {
      console.log(chat.participants);
      msg.reply(await chat.participants.toString());
    } catch (error) {
      msg.reply(error.toString());
    }
  } else {
    msg.reply(`This command can only be used in a group`);
  }
};

module.exports = {
  name: "Ban member",
  description: "Ban a group's member",
  command: "!ban",
  commandType: "group",
  isDependent: false,
  help: "Reply with !ban to ban a member",
  execute,
};
