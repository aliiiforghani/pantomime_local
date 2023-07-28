const Application = require("./app/server");
// new Application(
//   2000,
//   "mongodb://root:FmgoSYdnejPPabJoVrr6NW7t@pantomimedb:27017/my-app?authSource=admin"
// );
// new Application(2000, "mongodb://localhost:27017/pantomimedb2");
new Application(
  2000,
  "mongodb+srv://forganiali:c7Kb3hKMdmSmtpt2@cluster0.zwyr6sx.mongodb.net/?retryWrites=true&w=majority"
);
// c7Kb3hKMdmSmtpt2;
