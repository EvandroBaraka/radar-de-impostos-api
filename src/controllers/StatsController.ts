import { Request, Response } from "express";
import CouponService from "../services/ReceiptService.js";

const summary = async (req: Request, res: Response) => {
    const summaryData = await CouponService.getTaxesSummary(
        req.user?.id,
        req.query,
    );
    return res.status(200).json(summaryData);
};

export default {
    summary,
};
