//jshint esversion:8
const execute = async (client, msg) => {
  let chat = await msg.getChat();

  if (chat.isGroup) {
    try {
      let invitecode = await chat.getInviteCode();
      msg.reply(
        `Here is the Invitation link:\n\nchat.whatsapp.com/${invitecode}`
      );
    } catch (error) {
      msg.reply(error.toString());
    }
  } else {
    msg.reply(`This command can only be used in a group`);
  }
};

module.exports = {
  name: "Invite",
  description: "Get group's invitation link",
  command: "!invite",
  commandType: "group",
  isDependent: false,
  help: "Type !invitation in the group chat to get the group's invitation link",
  execute,
};
