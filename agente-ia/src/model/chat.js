import { ChatOpenAI } from '@langchain/openai';
import { config } from 'dotenv';

// Carrega as variáveis de ambiente
config();

// Define a chave da API (compatível com a versão Python)
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "proj";

/**
 * Cria e retorna uma instância configurada do modelo de chat
 * @returns {ChatOpenAI} Instância do modelo configurada
 */
export const getChatModel = () => {
    return new ChatOpenAI({
        configuration: {
            //baseURL: "http://model-runner.docker.internal/engines/v1",
            baseURL: "http://localhost:12434/engines/v1", // URL alternativa para desenvolvimento local
        },
        modelName: "ai/gemma3:latest",
        temperature: 1,
        timeout: 30000, // 30 segundos de timeout
        maxRetries: 2,
    });
};

export default getChatModel;