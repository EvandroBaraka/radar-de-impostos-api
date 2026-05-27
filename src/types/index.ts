export interface AuthRequest {
    email: string;
    password: string;
}

export interface RegisterRequest extends AuthRequest {
    name?: string;
}

export interface User extends RegisterRequest {
    id: string;
}

export interface Receipt {
    id: string;
    storeName?: string;
    cnpj?: string;
    category?: string;
    totalValue: number;
    tributes: number;
    purchaseDate: Date;
    nfeKey?: string;
}