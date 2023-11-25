import cors from "cors";
import express from "express";
import passport from "passport";
import passportHttp from "passport-http";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import swaggerDocument from "../build/swagger.json";
import newsDetailRoutes from "./routes/newsDetailRoutes";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT ?? 8080;

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

if (!USERNAME || !PASSWORD) throw new Error("secrets missing.");
// passport.use(
//   new passportHttp.BasicStrategy((username, password, done) => {
//     if (username === USERNAME && password === PASSWORD) return done(null, true);
//     else return done(null, false);
//   }),
// );
passport.use(
  new passportHttp.DigestStrategy({ qop: "auth" }, (username, cb) => {
    if (username === USERNAME) return cb(null, username, PASSWORD);
    else return cb(null, false);
  }),
);

app.use(
  cors({
    origin: ["https://private.s-hirano.com", "http://localhost:3000"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  // passport.authenticate("basic", {
  //   session: false,
  // }),
  passport.authenticate("digest", {
    session: false,
  }),
);
// this route file is not included in Swagger UI
app.use("/v1/news-detail", newsDetailRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
RegisterRoutes(app);

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test")
    /* istanbul ignore next */
    console.log(`REST API express server ready at: http://localhost:${PORT}`);
});

export { app, server };
