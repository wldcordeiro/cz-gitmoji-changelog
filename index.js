const engine = require("./engine");
const gitmojiCommitTypes = require("gitmoji-commit-types");

module.exports = engine({ types: gitmojiCommitTypes.types });
