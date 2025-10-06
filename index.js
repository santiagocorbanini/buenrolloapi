import "dotenv/config";
import express from "express";
import path from "path";
import authRoutes from "./routes/auth.routes.js";
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';
import cors from "cors";
import showRoute from "./routes/show.routes.js";
import lugarRoute from "./routes/lugar.routes.js";
import seccionRoute from "./routes/seccion.routes.js";
import infoRoute from "./routes/info.routes.js";
import colorsRoute from "./routes/colors.routes.js";
import brandingRoute from "./routes/branding.routes.js";
import generalsRoute from "./routes/generals.routes.js";
import settingsRoute from "./routes/settings.routes.js";
import bannerRoute from "./routes/banner.routes.js";
import cron from "node-cron";
import { showModel } from "./models/show.model.js";

const app = express();

app.use(express.json({ limit: "10mb" })); // Cambia "10mb" según sea necesario
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join("public/uploads")));

app.use('/api-docs', cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];
*/

app.use((req, res, next) => {
  const origin = req.headers.origin;
   /*
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
    */
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
app.use("/auth", authRoutes); 

app.use("/shows", showRoute);

app.use("/lugares", lugarRoute);

app.use("/secciones", seccionRoute);

app.use("/info", infoRoute);

app.use("/colors", colorsRoute);

app.use("/branding", brandingRoute);

app.use("/generals", generalsRoute);

app.use("/settings", settingsRoute);

app.use("/banners", bannerRoute);

// Todos los días 03:00 AM Buenos Aires
cron.schedule("0 3 * * *", async () => {
    try {
      const result = await showModel.deletePastShows();
      console.log(`[${new Date().toISOString()}] [CRON] deletePastShows OK`, result);
    } catch (err) {
      console.error(`[${new Date().toISOString()}] [CRON] deletePastShows ERROR`, err);
    }
  }, {
    timezone: "America/Argentina/Buenos_Aires"
  });

const PORT = process.env.PORT || 5000;

/*
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
*/
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
  });
