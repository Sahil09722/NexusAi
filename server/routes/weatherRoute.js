import { Router } from "express"
import { getWeatherByCity } from "../controllers/weatherController.js"

const router = Router();

router.get("/", getWeatherByCity);

export default router
