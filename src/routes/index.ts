import { Router } from "express";
import authRoutes from "./authRoutes.js";
import receiptRoutes from "./receiptsRoutes.js";
import statsRoutes from "./statsRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/receipts", receiptRoutes);
router.use("/stats", statsRoutes);

export default router;
