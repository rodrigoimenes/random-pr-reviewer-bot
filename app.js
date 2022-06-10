const { App } = require("@slack/bolt");
require("dotenv").config();
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,

});

app.command("/pr", async ({ command, ack, say, client, payload }) => {
    try {
      await ack();

      console.log(command);

      const regexGroup = /(?<=\^)\w+/gi;
      const groupId = payload.text.match(regexGroup);

      if (!groupId) {
        say(`Não identifiquei um grupo na sua mensagem, pode tentar novamente marcando um grupo? :awesome:`);
        return
      }

      const groupUsers = await client.usergroups.users.list({ usergroup: groupId[0] });

      const regexQuantity = /(?<= )\d+/;
      const matchQtt = payload.text.match(regexQuantity);
      const quantity = matchQtt ? matchQtt[0] || 1 : 1;

      const usernames = groupUsers.users.sort(() => Math.random() - Math.random()).slice(0, quantity);
      say(`Olá ${usernames.map(username => `<@${username}>`)}, pode(m) revisar esse PR? :sonic_waiting:`);
    } catch (error) {
        console.log("err")
      console.error(error);
    }
});

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();