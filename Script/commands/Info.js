module.exports.config = {
  name: "info",
  version: "1.0.0",
  hasPermission: 0,
  credits: "MURSALIN HIMU",
  description: "Bot information command",
  commandCategory: "For users",
  hide: true,
  usages: "",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
  const { threadID } = event;
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const moment = require("moment-timezone");

  const { configPath } = global.client;
  delete require.cache[require.resolve(configPath)];
  const config = require(configPath);

  const { commands } = global.client;
  const threadSetting = (await Threads.getData(String(threadID))).data || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : config.PREFIX;

  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  const totalUsers = global.data.allUserID.length;
  const totalThreads = global.data.allThreadID.length;

  const msg = `╭───  ❖  BOT INFORMATION  ❖ ───╮
│
├──  🤖  Name : Himu chat bot
├── 📍 Prefix : ${config.PREFIX}
├── 📌 Prefix Box : ${prefix}
├── 🧩 Modules : ${commands.size}
├── ⚡ Ping : ${Date.now() - event.timestamp}ms
│
╰──────────────────────────╯

╭─── ❖ OWNER INFO ❖ ───╮
│
├── 👑 Name : MURSALIN HIMU
├── 📬 Facebook : 
│ facebook.com/61577305903781
├── 💬 WhatsApp : 
│ 01329288340
│
╰──────────────────────────╯

╭─── ❖ ACTIVITIES ❖ ───╮
│
├── ⏰ Active Time : ${hours}h ${minutes}m ${seconds}s
├── 👨‍👩‍👧‍👦 Groups : ${totalThreads}
├── 👤 Total Users : ${totalUsers}
╰──────────────────────────╯

❤️ Thanks for using 🌺
😍 Himu chat bot 😍`;

  const imgLinks = [
    "https://www.image2url.com/r2/default/images/1787121973694-117e202a-9fd6-49fb-98ae-e221440f6845.jpg",
    "https://www.image2url.com/r2/default/images/1787121973694-117e202a-9fd6-49fb-98ae-e221440f6845.jpg"
  ];

  const imgLink = imgLinks[Math.floor(Math.random() * imgLinks.length)];
  const downloadPath = __dirname + "/cache/info.jpg";

  // নিশ্চিত করা যে cache ফোল্ডারটি আছে
  if (!fs.existsSync(__dirname + "/cache")) {
    fs.mkdirSync(__dirname + "/cache", { recursive: true });
  }

  const callback = () => {
    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(downloadPath)
      },
      threadID,
      () => {
        if (fs.existsSync(downloadPath)) {
          fs.unlinkSync(downloadPath);
        }
      }
    );
  };

  return request(encodeURI(imgLink))
    .pipe(fs.createWriteStream(downloadPath))
    .on("close", callback);
};
