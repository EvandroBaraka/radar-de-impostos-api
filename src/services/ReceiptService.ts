import { prisma } from "../utils/prisma.js";
import type { Receipt } from "../types/index.js";
import NFCeService from "./NFCeService.js";
import CnpjService from "./CnpjService.js";

const createReceipt = async (userId: string, data: Receipt) => {
    let category = data.category;

    // Se não tiver categoria mas tiver CNPJ, tenta buscar
    if (!category && data.cnpj) {
        try {
            category = await CnpjService.getCategoryByCnpj(data.cnpj);
        } catch (error) {
            console.error("Erro ao buscar categoria pelo CNPJ:", error);
            category = "Outros";
        }
    }

    return await prisma.receipts.create({
        data: {
            userId,
            storeName: data.storeName,
            cnpj: data.cnpj,
            category: category || "Outros",
            totalValue: data.totalValue,
            tributes: data.tributes,
            purchaseDate: data.purchaseDate
                ? new Date(data.purchaseDate)
                : null,
            nfeKey: data.nfeKey,
        },
    });
};

const listReceipts = async (userId: string | undefined, limit?: number, offset?: number) => {
    const query: any = {
        where: {
            userId,
        },
        orderBy: {
            purchaseDate: "desc",
        },
    };

    if (limit !== undefined && !isNaN(limit)) query.take = limit;
    if (offset !== undefined && !isNaN(offset)) query.skip = offset;

    const receipts = await prisma.receipts.findMany(query);
    return receipts;
};

const searchReceipt = async (url: string) => {
    return await NFCeService.fetchNFCeData(url);
};

const getReceiptByNfeKey = async (
    nfeKey: string,
    userId: string | undefined,
) => {
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
            userId,
        },
    });
};

const getTaxesSummary = async (userId: string | undefined, query: any) => {
    // Implementação básica para evitar erros, pode ser expandida depois
    const stats = await prisma.receipts.aggregate({
        where: { userId },
        _sum: {
            totalValue: true,
            tributes: true,
        },
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
