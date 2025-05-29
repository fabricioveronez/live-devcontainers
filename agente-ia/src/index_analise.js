import { config } from 'dotenv';
import { readFile } from 'fs/promises';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { getChatModel } from './model/chat.js';

// Carrega as variáveis de ambiente do arquivo .env
config();

/**
 * Carrega o conteúdo de um arquivo de log
 * @param {string} filePath - Caminho para o arquivo de log
 * @returns {Promise<string>} Conteúdo do arquivo
 */
const loadLogFile = async (filePath) => {
    try {
        const content = await readFile(filePath, 'utf-8');
        return content;
    } catch (error) {
        throw new Error(`Erro ao ler o arquivo ${filePath}: ${error.message}`);
    }
};

/**
 * Função principal que analisa logs usando o modelo de linguagem
 */
const main = async () => {
    try {
        console.log('🔍 Iniciando análise de logs com IA...\n');

        // Carrega o arquivo de log
        const logFilePath = './logs/nginx.log';
        console.log(`📂 Carregando arquivo: ${logFilePath}`);
        
        const logContent = await loadLogFile(logFilePath);
        console.log(`✅ Arquivo carregado com sucesso! (${logContent.length} caracteres)\n`);

        // Obtém o modelo configurado
        const model = getChatModel();

        // Define o template do prompt para análise de logs
        const promptTemplate = PromptTemplate.fromTemplate(`
        Você é um assistente de IA que analisa logs de um sistema de monitoramento em ambiente Kubernetes.
        Analise os logs e responda a pergunta do usuário com base nas informações contidas neles.

        Os logs são os seguintes:
        {logs}

        Pergunta: {pergunta}
        `);

        // Cria a cadeia de processamento (chain)
        const outputParser = new StringOutputParser();
        const chain = promptTemplate.pipe(model).pipe(outputParser);

        console.log('🤖 Analisando logs...\n');

        // Gera a resposta
        const response = await chain.invoke({
            logs: logContent,
            // pergunta: 'Quais são os principais erros encontrados nos logs?',
            pergunta: 'Analisando os logs, como está a execução da aplicação?',
        });

        console.log('📋 Análise dos Logs:');
        console.log('=' .repeat(60));
        console.log(response);
        console.log('=' .repeat(60));

    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.message.includes('connect')) {
            console.error('❌ Erro de conexão: Não foi possível conectar ao servidor do modelo.');
            console.error('🔧 Verifique se o serviço está rodando em localhost:11434 ou model-runner.docker.internal');
            console.error(`📋 Detalhes do erro: ${error.message}`);
        } else if (error.code === 'ENOENT') {
            console.error('❌ Erro de arquivo: Arquivo de log não encontrado.');
            console.error('🔧 Verifique se o arquivo ./logs/nginx.log existe.');
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