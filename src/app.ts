import express from "express";
import healthRoutes from "./routes/healthRoutes";
// import rssRoutes from "./routes/rssRoutes";
import "dotenv/config";

const app = express();

const IP_ADDRESS = process.env.IP_ADDRESS;
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/v1/rss", rssRoutes);
app.use("/health", healthRoutes);

const server = app.listen(PORT, () => {
  console.log(`REST API express server ready at: ${IP_ADDRESS}:${PORT}`);
});

export { app, server };
