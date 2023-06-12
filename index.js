const Application = require("./app/server");
new Application(
  2000,
  "mongodb://root:FmgoSYdnejPPabJoVrr6NW7t@pantomimedb:27017/my-app?authSource=admin"
);
// const Application = require("./app/server");
// new Application(2000, "mongodb://localhost:27017/pantomimedb2");
