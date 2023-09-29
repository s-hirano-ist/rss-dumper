import express from "express";
import healthRoutes from "./routes/healthRoutes";
import newsDetailRoutes from "./routes/newsDetailRoutes";
import newsRoutes from "./routes/newsRoutes";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT ?? 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/v1/news", newsRoutes);
app.use("/v1/news-detail", newsDetailRoutes);
app.use("/health", healthRoutes);

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test")
    /* istanbul ignore next */
    console.log(`REST API express server ready at: http://localhost:${PORT}`);
});

export { app, server };
