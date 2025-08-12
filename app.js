import express from "express";
import cors from "cors";
import questionsRoute from "./routes/questions.route.js";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: "*",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/test", questionsRoute);
app.get("/", (_, res) => {
  return res.status(200).json({
    success: true,
    data: null,
    message: "App is running",
  });
});

export default app;

// Reload website every 5 minutes (or provided time)
function reloadWebsite() {
  fetch(process.env.PUBLIC_URL || "https://lastminprep.onrender.com")
    .then((response) => {
      console.log(
        `Reloaded at ${new Date().toLocaleString("en-IN")}: Status Code ${
          response.status
        }`
      );
    })
    .catch((error) => {
      console.error(
        `Error reloading at ${new Date().toLocaleString("en-IN")}:`,
        error.message
      );
    });
}

if (process.env.NODE_ENV === "production") {
  setInterval(
    reloadWebsite,
    parseInt(process.env.RELOAD_INTERVAL || 1000 * 60 * 5)
  );
}
