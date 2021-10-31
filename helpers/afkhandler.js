//jshint esversion:11
const fs = require("fs");
const path = require("path");
const database = require("../db");

async function setDb() {
  try {
    const db = await database('afk');
    return db;
  } catch (error) {
    return {};
  }
}

async function insert(reason, time) {
  let { conn, coll } = await setDb();
  try {
    await coll.insertOne({ isAfk: true, reason, time });
    return true;
  } catch (error) {
    return false;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function read() {
  let { conn, coll } = await setDb();
  try {
    let data = await coll.findOne({ isAfk: true });
    if (data) {
      // save the cache for later usage
      fs.writeFileSync(
        path.join(__dirname, `../cache/AFK.json`),
        JSON.stringify({ ...data, found: true })
      );
    }
    return data ? { ...data, found: true } : { found: false };
  } catch (error) {
    return { found: false };
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function remove() {
  let { conn, coll } = await setDb();
  try {
    const data = await coll.deleteOne({ isAfk: true });
    console.log(data);
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function set() {
  let data = await insert('asdf',Date.now());
  console.log('insert',data);
  data = await read();
  console.log('read',data);
  data = await remove();
  console.log("remove", data);
}

set();

async function setAfk(reason) {
  let { conn, coll } = await setDb();
  const time = Math.floor(Date.now() / 1000);
  let data = { isAfk: true, reason, time };

  try {
    await coll.insertOne(data);
    fs.writeFileSync(
      path.join(__dirname, `../cache/AFK.json`),
      JSON.stringify({ ...data, found: true })
    );
    return true;
  } catch (error) {
    return false;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

async function setOnline() {
  let { conn, coll } = await setDb();
  try {
    fs.unlinkSync(path.join(__dirname, `../cache/AFK.json`));
    console.log(`Deleting afk data`);
  } catch (nofile) {}

  try {
    const { deletedCount: fileDeleted } = await coll.deleteOne({ isAfk: true });
    if (!fileDeleted) return false;
    return true;
  } catch (error) {
    return false;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
}

// AFK_REASONS = (
//     "I'm busy right now. Please talk in a bag and when I come back you can just give me the bag!",
//     "I'm away right now. If you need anything, leave a message after the beep: \
// `beeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeep!`",
//     "You missed me, next time aim better.",
//     "I'll be back in a few minutes and if I'm not...,\nwait longer.",
//     "I'm not here right now, so I'm probably somewhere else.",
//     "Roses are red,\nViolets are blue,\nLeave me a message,\nAnd I'll get back to you.",
//     "Sometimes the best things in life are worth waiting for…\nI'll be right back.",
//     "I'll be right back,\nbut if I'm not right back,\nI'll be back later.",
//     "If you haven't figured it out already,\nI'm not here.",
//     "I'm away over 7 seas and 7 countries,\n7 waters and 7 continents,\n7 mountains and 7 hills,\
// 7 plains and 7 mounds,\n7 pools and 7 lakes,\n7 springs and 7 meadows,\
// 7 cities and 7 neighborhoods,\n7 blocks and 7 houses...\
//     Where not even your messages can reach me!",
//     "I'm away from the keyboard at the moment, but if you'll scream loud enough at your screen,\
//     I might just hear you.",
//     "I went that way\n>>>>>",
//     "I went this way\n<<<<<",
//     "Please leave a message and make me feel even more important than I already am.",
//     "If I were here,\nI'd tell you where I am.\n\nBut I'm not,\nso ask me when I return...",
//     "I am away!\nI don't know when I'll be back!\nHopefully a few minutes from now!",
//     "I'm not available right now so please leave your name, number, \
//     and address and I will stalk you later. :P",
//     "Sorry, I'm not here right now.\nFeel free to talk to my userbot as long as you like.\
// I'll get back to you later.",
//     "I bet you were expecting an away message!",
//     "Life is so short, there are so many things to do...\nI'm away doing one of them..",
//     "I am not here right now...\nbut if I was...\n\nwouldn't that be awesome?",
// )
