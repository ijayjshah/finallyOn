import { Router, type IRouter } from "express";
import authRouter from "./auth";
import districtsRouter from "./districts";
import profilesRouter from "./profiles";
import listingsRouter from "./listings";
import jobsRouter from "./jobs";
import waitlistRouter from "./waitlist";
import adminRouter from "./admin";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/districts", districtsRouter);
router.use("/profiles", profilesRouter);
router.use("/listings", listingsRouter);
router.use("/jobs", jobsRouter);
router.use("/waitlist", waitlistRouter);
router.use("/admin", adminRouter);

export default router;
