/**
 * UTILITÁRIOS GERAIS DO SITE
 * Funções reutilizáveis para todo o site
 */

/**
 * Calcula o tempo estimado de leitura de um texto
 * @param {string} htmlContent - Conteúdo HTML do artigo
 * @returns {number} - Tempo de leitura em minutos
 */
function calcularTempoLeitura(htmlContent) {
    if (!htmlContent) return 0;
    
    // Remover tags HTML e obter apenas o texto
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textoLimpo = tempDiv.textContent || tempDiv.innerText || '';
    
    // Contar palavras (separadas por espaços)
    const palavras = textoLimpo.trim().split(/\s+/).filter(p => p.length > 0);
    const totalPalavras = palavras.length;
    
    // Média de leitura: 200 palavras por minuto (padrão brasileiro)
    const palavrasPorMinuto = 200;
    const minutos = Math.ceil(totalPalavras / palavrasPorMinuto);
    
    // Mínimo de 1 minuto
    return Math.max(1, minutos);
}

/**
 * Formata o tempo de leitura para exibição
 * @param {number} minutos - Tempo em minutos
 * @returns {string} - Texto formatado (ex: "5 min de leitura")
 */
function formatarTempoLeitura(minutos) {
    if (minutos === 1) {
        return '1 min de leitura';
    }
    return `${minutos} min de leitura`;
}

/**
 * Atualiza o tempo de leitura em tempo real enquanto escreve
 * @param {string} conteudoHtml - Conteúdo HTML do artigo
 * @param {HTMLElement} elementoExibicao - Elemento onde exibir o tempo
 */
function atualizarTempoLeituraAoVivo(conteudoHtml, elementoExibicao) {
    const minutos = calcularTempoLeitura(conteudoHtml);
    if (elementoExibicao) {
        elementoExibicao.textContent = formatarTempoLeitura(minutos);
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.calcularTempoLeitura = calcularTempoLeitura;
    window.formatarTempoLeitura = formatarTempoLeitura;
    window.atualizarTempoLeituraAoVivo = atualizarTempoLeituraAoVivo;
}
