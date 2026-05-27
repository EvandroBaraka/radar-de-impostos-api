export interface CnpjData {
    cnpj: string;
    razao_social: string;
    nome_fantasia: string;
    cnae_fiscal_descricao: string;
    [key: string]: any;
}

const getCnpjData = async (cnpj: string): Promise<CnpjData | null> => {
    // Remove caracteres não numéricos
    const cleanCnpj = cnpj.replace(/\D/g, "");

    if (cleanCnpj.length !== 14) {
        throw new Error("CNPJ inválido. Deve conter 14 dígitos.");
    }

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                "Accept": "application/json"
            }
        });

        if (response.status === 404) {
            console.warn(`CNPJ ${cleanCnpj} não encontrado na BrasilAPI.`);
            return null;
        }

        if (!response.ok) {
            throw new Error(`Erro ao consultar BrasilAPI: ${response.statusText}`);
        }

        const data = await response.json();
        return data as CnpjData;
    } catch (error) {
        console.error("Erro no CnpjService:", error);
        throw error;
    }
};

/**
 * Mapeia a descrição do CNAE para uma categoria amigável
 */
const mapCnaeToCategory = (descricao: string): string => {
    const desc = descricao.toLowerCase();

    const mappings = [
        { 
            category: "Mercado", 
            keywords: ["supermercado", "hipermercado", "minimercado", "mercearia", "hortifrutigranjeiros", "açougue", "peixaria", "alimentos em geral"] 
        },
        { 
            category: "Farmácia", 
            keywords: ["farmacêutica", "drogaria", "medicamento", "perfumaria", "cosméticos"] 
        },
        { 
            category: "Restaurante", 
            keywords: ["restaurante", "lanchonete", "bar", "alimentação", "refeições", "fast-food", "cafeteria", "padaria", "confeitaria"] 
        },
        { 
            category: "Posto de Combustível", 
            keywords: ["combustível", "lubrificante", "posto de gasolina", "conveniência"] 
        },
        { 
            category: "Vestuário", 
            keywords: ["vestuário", "roupas", "calçados", "acessórios", "tecidos", "moda"] 
        },
        { 
            category: "Eletrônicos", 
            keywords: ["eletrodoméstico", "informática", "telefonia", "eletrônico", "computador", "celular"] 
        },
        { 
            category: "Saúde", 
            keywords: ["médico", "dentista", "clínica", "laboratório", "hospital", "saúde"] 
        },
        { 
            category: "Transporte", 
            keywords: ["transporte", "táxi", "aplicativo", "ônibus", "viagem"] 
        }
    ];

    for (const mapping of mappings) {
        if (mapping.keywords.some(keyword => desc.includes(keyword))) {
            return mapping.category;
        }
    }

    return "Outros";
};

/**
 * Retorna uma categoria baseada no CNAE do CNPJ
 */
const getCategoryByCnpj = async (cnpj: string): Promise<string> => {
    const data = await getCnpjData(cnpj);
    
    if (!data || !data.cnae_fiscal_descricao) {
        return "Outros";
    }

    return mapCnaeToCategory(data.cnae_fiscal_descricao);
};

export default {
    getCnpjData,
    getCategoryByCnpj,
};
