import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import router from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { apiReference } from "@scalar/express-api-reference";

const app = express();
const PORT = parseInt(process.env.PORT ?? "3000");

app.use(cors({ origin: "*", credentials: true }));
app.use(
    helmet({
        contentSecurityPolicy: false,
    }),
);
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Meu Imposto API",
            description: "API para o app Meu Imposto",
            version: "1.0.0",
        },
        servers: [],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};

const specs = swaggerJSDoc(swaggerOptions);

// Documentação
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(
    "/docs",
    apiReference({
        theme: "dark",
        spec: {
            content: specs,
        },
    }),
);

app.get("/", async (req, res) => {
    res.send({
        message: "Meu Imposto API",
        version: "1.0.0",
        status: "running",
    });
});

app.get("/health", async (req, res) => {
    res.send({
        status: "ok",
        timeStamp: new Date().toISOString(),
    });
});

app.use("/api", router);

app.use(errorHandler);

export default app;
