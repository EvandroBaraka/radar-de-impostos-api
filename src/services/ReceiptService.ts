import { prisma } from "../utils/prisma";
import { Receipt } from "../types";
import NFCeService from "./NFCeService";

const createReceipt = async (userId: string, data: Receipt) => {
    return await prisma.receipts.create({
        data: {
            userId,
            storeName: data.storeName,
            totalValue: data.totalValue,
            tributes: data.tributes,
            purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
            nfeKey: data.nfeKey,
        },
    });
};

const listReceipts = async (userId: string | undefined) => {
    const receipts = await prisma.receipts.findMany({
        where: {
            userId,
        },
        orderBy: {
            purchaseDate: "desc",
        },
    });
    return receipts;
};

const searchReceipt = async (url: string) => {
    return await NFCeService.fetchNFCeData(url);
};

const getReceiptByNfeKey = async (nfeKey: string, userId: string | undefined) => {
    const receipt = await prisma.receipts.findFirst({
        where: {
            nfeKey,
            userId,
        },
    });

    return receipt || null;
};

const deleteReceipt = async (nfeKey: string, userId: string | undefined) => {
    return await prisma.receipts.deleteMany({
        where: {
            nfeKey: nfeKey,
            userId
        }
    });
};

const getTaxesSummary = async (userId: string | undefined, query: any) => {
    // Implementação básica para evitar erros, pode ser expandida depois
    const stats = await prisma.receipts.aggregate({
        where: { userId },
        _sum: {
            totalValue: true,
            tributes: true
        }
    });

    return {
        totalSpent: stats._sum.totalValue || 0,
        totalTaxes: stats._sum.tributes || 0,
        period: query,
    };
};

export default {
    createReceipt,
    listReceipts,
    searchReceipt,
    getReceiptByNfeKey,
    deleteReceipt,
    getTaxesSummary,
};
