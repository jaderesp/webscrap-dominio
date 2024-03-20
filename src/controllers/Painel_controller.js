

const selectMenu = async (page, target_) => {

    return new Promise(async (resolve, reject) => {

        await new Promise(_func => setTimeout(_func, 1000));

        await page.evaluate((target_) => {
            switch (target_) {
                //folha de pagamento
                case 'Folhas de Pagamento':

                    const folhasDePagamentoOption = document.querySelector('.menu-items__title'); // Seletor do elemento "Folhas de Pagamento"
                    folhasDePagamentoOption.click();
                    break;
                case 'Comprovantes de Férias':
                    const comprovantesFeriasOption = document.querySelector('.menu-items__item:nth-child(2) .menu-items__title'); // Seletor do elemento "Comprovantes de Férias"
                    comprovantesFeriasOption.click();

                    break;
                case 'Comprovantes de Rendimento':
                    const comprovantesRendimentoOption = document.querySelector('.menu-items__item:nth-child(3) .menu-items__title'); // Seletor do elemento "Comprovantes de Rendimento"
                    comprovantesRendimentoOption.click();
                    break;
                case 'outros':


                    break;
                default:

                    break;


            }
        }, target_);

        resolve(page)

    })
}


async function objFolhaPagto(page, opcaoClique, referencia) {

    return new Promise(async (resolve, reject) => {

        await new Promise(_func => setTimeout(_func, 3000));

        // Função para extrair os dados da tabela
        const dados = await page.evaluate(async (opcaoClique, referencia) => {

            return new Promise(async (resolve, reject) => {

                const tabela = document.getElementById('datatable'); // Selecionar a tabela pelo ID

                const linhas = tabela.querySelectorAll('tbody tr'); // Selecionar todas as linhas da tabela
                const resultados = [];

                // Iterar sobre as linhas da tabela
                linhas.forEach(linha => {
                    const colunas = linha.querySelectorAll('.table__data'); // Selecionar todas as colunas da linha

                    // Extrair os dados das colunas
                    const mesReferencia = colunas[0].textContent.trim();
                    const tipoFolha = colunas[1].textContent.trim();
                    const empresa = colunas[2].textContent.trim();
                    const dataPublicacao = colunas[3].textContent.trim();

                    // Capturar os manipuladores de evento de clique dos links na coluna "Ações"
                    const visualizarLink = linha.querySelector('.table__action.bento-icon-eye');
                    const downloadLink = linha.querySelector('.table__action.bento-icon-download');

                    // Adicionar os dados e as funções de clique ao objeto e adicionar ao array de resultados
                    const objetoDados = {
                        mesReferencia,
                        tipoFolha,
                        empresa,
                        dataPublicacao
                    };

                    // Se a opção de clique imediato estiver definida para 'visualizar' ou 'download', clique imediatamente
                    if (opcaoClique === 'visualizar' && referencia == mesReferencia) {
                        visualizarLink.click()

                    } else if (opcaoClique === 'download' && referencia == mesReferencia) {
                        downloadLink.click()
                    }

                    resultados.push(objetoDados);
                });

                resolve(resultados); // Retornar o array de resultados

            })

        }, opcaoClique, referencia);


        resolve(dados);

    })
}

module.exports = { selectMenu, objFolhaPagto }