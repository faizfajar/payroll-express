const fs = require("fs");
const path = require("path");

module.exports = async () => {
  const tokenPath = path.join(__dirname, "token-cache.json");
  if (fs.existsSync(tokenPath)) {
    fs.unlinkSync(tokenPath);
  }
};
