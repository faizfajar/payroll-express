const fs = require("fs");
const path = require("path");

beforeAll(() => {
  const tokenPath = path.join(__dirname, "token-cache.json");
  const { token } = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
  global.token = token;
});
