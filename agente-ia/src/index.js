import { config } from 'dotenv';
import { HumanMessage } from '@langchain/core/messages';
import { getChatModel } from './model/chat.js';

// Carrega as variáveis de ambiente do arquivo .env
config();

/**
 * Função principal que demonstra interação básica com o modelo de linguagem
 */
const main = async () => {
    try {
        console.log('🚀 Iniciando interação com o modelo de linguagem...\n');

        // Obtém o modelo configurado
        const model = getChatModel();

        // Define a mensagem do usuário
        const message = [
            new HumanMessage("O que é Kubernetes?")
        ];

        console.log('💬 Pergunta: O que é Kubernetes?\n');
        console.log('🤖 Processando resposta...\n');

        // Gera a resposta
        const response = await model.invoke(message);
        
        console.log('📝 Resposta do modelo:');
        console.log('=' .repeat(50));
        console.log(response.content);
        console.log('=' .repeat(50));

    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
            console.error('❌ Erro de conexão: Não foi possível conectar ao servidor do modelo.');
            console.error('🔧 Verifique se o serviço está rodando em localhost:11434 ou model-runner.docker.internal');
            console.error(`📋 Detalhes do erro: ${error.message}`);
        } else {
            console.error('💥 Erro inesperado:');
            console.error(error.message);
            console.error('\n🔍 Stack trace:');
            console.error(error.stack);
        }
        process.exit(1);
    }
};

// Executa a função principal
main().catch(console.error);