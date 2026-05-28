import type { AuthRequest, RegisterRequest } from "../types/index.js";
import { prisma } from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (data: RegisterRequest) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (existingUser) {
        throw new Error("Email já cadastrado");
    }

    if (data.password.length < 6) {
        throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
        data: {
            email: data.email,
            name: data.name || null,
            password: hashedPassword,
        },
    });
    return newUser;
};

const loginUser = async (data: AuthRequest) => {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    if (!user.password) {
        throw new Error("Senha não encontrada");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
        throw new Error("Senha incorreta");
    }

    const token = jwt.sign(
        { id: user.id, email: data.email },
        process.env.JWT_SECRET || "secret",
        {
            expiresIn: "7d",
        },
    );

    const userName = user.name || "";
    const userEmail = user.email;

    return { token, userName, userEmail };
};

export default {
    registerUser,
    loginUser,
};
