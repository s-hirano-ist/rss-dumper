import AdminJSExpress from "@adminjs/express";
import { Database, Resource, getModelByName } from "@adminjs/prisma";
import { PrismaClient } from "@prisma/client";
// FIXME:
// eslint-disable-next-line import/no-named-as-default
import AdminJS from "adminjs";
import express from "express";
// eslint-disable-next-line import/no-relative-packages
import PrismaModule from "../prisma/client-prisma/index.js";
import healthRoutes from "./routes/healthRoutes.ts";
import newsDetailRoutes from "./routes/newsDetailRoutes.ts";
import newsRoutes from "./routes/newsRoutes.ts";
import "dotenv/config";

const app = express();
const IP_ADDRESS = process.env.IP_ADDRESS;
const PORT = process.env.PORT;

const prisma = new PrismaClient();

AdminJS.registerAdapter({
  Resource: Resource,
  Database: Database,
});

const dmmf = (prisma as any)._baseDmmf;
const adminOptions = {
  // We pass Publisher to `resources`
  resources: [
    {
      resource: { model: dmmf.modelMap.Publisher, client: prisma },
      options: {},
    },
  ],
};
const admin = new AdminJS(adminOptions);
const adminRouter = AdminJSExpress.buildRouter(admin);
app.use(admin.options.rootPath, adminRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/news", newsRoutes);
app.use("/v1/news-detail", newsDetailRoutes);
app.use("/health", healthRoutes);

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test") {
    /* istanbul ignore next */
    console.log(`REST API express server ready at: ${IP_ADDRESS}:${PORT}`);
    console.log(
      `AdminJS ready at: ${IP_ADDRESS}:${PORT}${admin.options.rootPath}`,
    );
  }
});

export { app, server };
