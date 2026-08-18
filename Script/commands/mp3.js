const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

async function baseApiUrl() {
  const { data } = await axios.get(
    "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json"
  );
  return data.api;
}

module.exports.config = {
  name: "mp3",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "MURSALIN HIMU",
  description: "Convert video to MP3",
  commandCategory: "media",
  usages: "[reply video/link]",
  cooldowns: 10
};

module.exports.run = async function ({
  api,
  event,
  args
}) {
  try {
    let url;

    if (args.length) {
      url = args.join(" ");
    } else if (
      event.messageReply &&
      event.messageReply.attachments &&
      event.messageReply.attachments.length > 0
    ) {
      url = event.messageReply.attachments[0].url;
    } else {
      return api.sendMessage(
        "⚠️ Reply to a video or provide a video link.",
        event.threadID,
        event.messageID
      );
    }

    api.setMessageReaction("⏳", event.messageID, () => {}, true);

    const apiUrl = await baseApiUrl();

    const { data } = await axios.get(
      `${apiUrl}/ytDl3?link=${encodeURIComponent(url)}&format=mp3&quality=1`
    );

    const cache = path.join(__dirname, "cache");
    await fs.ensureDir(cache);

    const filePath = path.join(cache, `mp3_${Date.now()}.mp3`);

    const audio = await axios.get(data.downloadLink, {
      responseType: "arraybuffer"
    });

    await fs.writeFile(filePath, Buffer.from(audio.data));

    api.setMessageReaction("✅", event.messageID, () => {}, true);

    api.sendMessage(
      {
        body: "🎵 Video Successfully Converted To MP3!",
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );

  } catch (err) {
    console.log(err);
    api.setMessageReaction("❌", event.messageID, () => {}, true);

    api.sendMessage(
      "❌ Video MP3 Convert Failed.",
      event.threadID,
      event.messageID
    );
  }
};