import express from "express";
import expressRateLimit from "express-rate-limit";
import appConfig from "./2-utils/app-config";
import catchAll from "./4-middleware/catch-all";
import routeNotFound from "./4-middleware/route-not-found";
import vacationsController from "./6-controllers/vacations-controller";
import authController from "./6-controllers/auth-controller" 
import { fileSaver } from "uploaded-file-saver";
import path from "path"

const server = express();


server.use(expressRateLimit({
    windowMs: 1000, 
    limit: 2 
}));

fileSaver.config(path.join(__dirname, "1-assets", "images"));

server.use("/api", vacationsController, authController);

server.use(express.json());

server.use(routeNotFound);

server.use(catchAll);

server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));


