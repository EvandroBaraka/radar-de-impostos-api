import { Request, Response } from "express";
import ReceiptService from "../services/ReceiptService.js";

const addReceipt = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Usuário não autenticado" });
        }

        const existingReceipt = await ReceiptService.getReceiptByNfeKey(
            req.body.nfeKey,
            userId,
        );
        if (existingReceipt) {
            return res.status(409).json({ error: "Cupom já cadastrado" });
        }

        const receipt = await ReceiptService.createReceipt(userId, req.body);
        return res.status(201).json(receipt);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

const listReceipts = async (req: Request, res: Response) => {
    const receipts = await ReceiptService.listReceipts(req.user?.id);
    return res.status(200).json(receipts);
};

const searchNewReceipt = async (req: Request, res: Response) => {
    const url = req.query.url;

    if (!url || typeof url !== "string") {
        return res
            .status(400)
            .json({ error: "Parâmetro de consulta inválido" });
    }

    try {
        const result = await ReceiptService.searchReceipt(url);
        return res.status(200).json(result);
    } catch (error: any) {
        console.error("Erro ao buscar NFC-e:", error);
        return res
            .status(500)
            .json({ error: error.message || "Erro interno ao buscar NFC-e" });
    }
};

const getReceipt = async (req: Request, res: Response) => {
    const receipt = await ReceiptService.getReceiptByNfeKey(
        req.params.nfeKey as string,
        req.user?.id,
    );

    if (!receipt) {
        return res.status(404).json({ error: "Cupom não encontrado" });
    }

    return res.status(200).json(receipt);
};

const deleteReceipt = async (req: Request, res: Response) => {
    try {
        await ReceiptService.deleteReceipt(
            req.params.nfeKey as string,
            req.user?.id,
        );
        return res.status(204).send();
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export default {
    listReceipts,
    searchNewReceipt,
    getReceipt,
    deleteReceipt,
    addReceipt,
};
