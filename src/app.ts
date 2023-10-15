import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";
import swaggerDocument from "../build/swagger.json";
import healthRoutes from "./routes/healthRoutes";
import newsDetailRoutes from "./routes/newsDetailRoutes";
import newsRoutes from "./routes/newsRoutes";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT ?? 8080;

app.use(
  cors({
    origin: ["https://private.s-hirano.com", "http://localhost:3000"],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/news", newsRoutes);
app.use("/v1/news-detail", newsDetailRoutes);
app.use("/health", healthRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
RegisterRoutes(app);

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test")
    /* istanbul ignore next */
    console.log(`REST API express server ready at: http://localhost:${PORT}`);
});

export { app, server };
