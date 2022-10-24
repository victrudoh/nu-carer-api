// Import Routes
const authRouter = require("./auth.routes");
const adminRouter = require("./admin.routes");
const caregiverRouter = require("./caregiver.routes");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/caregiver", caregiverRouter);
};
