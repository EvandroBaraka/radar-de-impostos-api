import * as cheerio from "cheerio";
import { parseDateBR } from "../utils/date-utils.js";

export type NFCeResult = {
    storeName: string;
    cnpj: string;
    totalValue: number;
    tributes: number | null;
    purchaseDate: Date | null;
    nfeKey: string;
};

const fetchNFCeData = async (url: string): Promise<NFCeResult> => {
    const fetchOptions: RequestInit = {
        headers: {
            // Define um User-Agent de navegador comum para evitar bloqueios simples
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            Connection: "close",
        },
        // Permite que o fetch siga automaticamente o redirect 302 da SEFAZ
        redirect: "follow",
    };

    let response: globalThis.Response | undefined;
    let attempt = 0;
    while (attempt < 2) {
        attempt += 1;
        try {
            response = await fetch(url, fetchOptions);
            break;
        } catch (err: any) {
            console.warn(
                `Fetch attempt ${attempt} failed:`,
                err?.message ?? err,
            );
            if (attempt >= 2) throw err;
        }
    }

    if (!response) {
        throw new Error("Falha ao obter resposta da SEFAZ");
    }

    // Extrai o conteúdo HTML da resposta
    const html = await response.text();

    // Verifica se a resposta da SEFAZ foi bem-sucedida (status 200-299)
    if (!response.ok) {
        throw new Error(`Falha ao buscar SEFAZ: ${response.status}`);
    }

    const $ = cheerio.load(html);

    const cupomCompleto = $("div#conteudo");

    // Busca os dados necessários usando seletores CSS e extrai o texto, removendo espaços extras
    const storeName = $("div#u20").text().trim();

    const cnpjRaw = $("div.txtCenter > div.text").filter((i, el) => {
        return $(el).text().includes("CNPJ");
    }).text();
    const cnpj = cnpjRaw.replace(/\D/g, "");

    let tributes = parseFloat($("span.txtObs").text().trim().replace(",", "."));

    if (!tributes) {
        const texto = $('h4:contains("Informações de interesse")')
            .parent()
            .find("li")
            .text()
            .trim();

        const valores = texto.match(/R\$\s*([\d.,]+)/g) || [];

        // Soma os valores
        tributes = valores.reduce((total, valor) => {
            const numero = parseFloat(
                valor
                    .replace("R$", "")
                    .replace(/\./g, "")
                    .replace(",", ".")
                    .trim(),
            );

            return total + numero;
        }, 0);
    }

    const totalValue = parseFloat(
        $("span.txtMax").text().trim().replace(",", "."),
    );

    const stringWithDate = $('h4:contains("Informações gerais da Nota")')
        .next("ul")
        .find("li")
        .text();

    // Usando Regex para extrair apenas a data (DD/MM/AAAA)
    const dateMatch = stringWithDate.match(/\d{2}\/\d{2}\/\d{4}/);
    const purchaseDate: Date | null = dateMatch
        ? parseDateBR(dateMatch[0])
        : new Date(); // Se não encontrar data, usa a data atual como fallback

    const acessKey = $("span.chave").text().trim();
    const cleanAcessKey = acessKey.replaceAll(" ", "");

    return {
        storeName,
        cnpj,
        totalValue,
        tributes,
        purchaseDate,
        nfeKey: cleanAcessKey,
    };
};

export default {
    fetchNFCeData,
};
