import app from "./app";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST ?? "0.0.0.0";

app.listen({port: PORT, host: HOST}, () => {
    console.log(`Server running at: http://localhost:${PORT}`);
    console.log(`API docs available at: http://localhost:${PORT}/docs`);
});