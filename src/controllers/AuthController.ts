import { Request, Response } from "express";
import AuthService from "../services/AuthService.js";

const register = async (req: Request, res: Response) => {
    try {
        const user = await AuthService.registerUser(req.body);
        return res.status(201).json({
            message: "Usuário registrado com sucesso",
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error: any) {
        if (error.message === "Email já cadastrado") {
            return res.status(409).json({ error: error.message });
        }
        return res.status(400).json({ error: error.message });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const token = await AuthService.loginUser(req.body);
        return res.status(200).json({ token });
    } catch (error: any) {
        return res.status(401).json({ error: error.message });
    }
};

export default {
    register,
    login,
};
