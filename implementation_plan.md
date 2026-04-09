# Plano de Implementação: Testes Unitários

Este documento descreve o plano para implementar testes unitários abrangentes para a aplicação Cooperativa Luthier, cobrindo endpoints (controllers), funções de negócio, validações e exceções (services).

## User Review Required

> [!IMPORTANT]
> Por favor, revise o plano de testes abaixo e me informe se há algum cenário adicional que você gostaria de incluir ou se está de acordo para prosseguirmos com a implementação.

## Proposed Changes

Os testes unitários serão adicionados utilizando a estrutura de testes padrão do NestJS (Jest). Vamos criar os arquivos `.spec.ts` correspondentes para cada Controller e Service, realizando o mock dos repositórios (ports) para isolar as unidades sob teste.

---
### Controllers

Testes para garantir que os controllers recebem as requisições, repassam os parâmetros corretamente para os services e retornam as respostas esperadas.

#### [NEW] src/controllers/luthier.controller.spec.ts
- Testar a criação de um luthier (`create`), verificando a chamada ao `LuthierService`.
- Testar a listagem (`findAll`) e busca por ID (`findOne`), simulando o retorno dos dados.
- Testar atualização (`update`) e exclusão (`remove`).

#### [NEW] src/controllers/instrumento-reparo.controller.spec.ts
- Testar a criação de um instrumento (`create`).
- Testar a listagem (`findAll`), busca por ID (`findOne`), e busca por luthier (`findByLuthier`).
- Testar atualização (`update`) e exclusão (`remove`).

---
### Services

Testes abrangentes para validar toda a lógica de negócio, garantir que as exceções personalizadas sejam lançadas adequadamente com as mensagens corretas em português, e testar validações complexas.

#### [NEW] src/services/luthier.service.spec.ts
- **create**: Sucesso ao criar luthier com dados válidos.
- **Validações de campos obrigatórios**: Deve lançar `CamposObrigatoriosException` para `nomeMestre` vazio/ausente, `dataAbertura` ausente, `certificada` ausente, ou `bancadasNum` ausente.
- **Validações de regra de negócio**: Deve lançar `DataFuturaException` se `dataAbertura` for no futuro.
- **Validações de regra de negócio**: Deve lançar `BancadasInsuficientesException` se `bancadasNum` for menor que 2.
- **findOne**: Deve buscar com sucesso ou lançar erro padrão se não encontrar.
- **update / remove**: Garantir fluxo correto.

#### [NEW] src/services/instrumento-reparo.service.spec.ts
- **create**: Sucesso ao criar com dados válidos.
- **Validações de campos obrigatórios**: Lançar `CamposObrigatoriosException` adequadamente.
- **Validação de relação**: Lançar `LuthierNaoEncontradoParaInstrumentoException` se o Luthier fornecido não existir.
- **Validação de datas**: Lançar `DataFuturaException` se `dataEntrada` for no futuro e `DataInconsistenteException` se a data de entrada do instrumento for anterior à data de abertura do Luthier.
- **Validação de custo**: Lançar `CustoReparoInvalidoException` se o custo for menor ou igual a 0 ou maior que 50.000.
- **Validação de reparo**: Lançar `ReparoConcluidoSemCustoException` em inconsistências entre status de conclusão e custo.
- **Validação de duplicidade**: Lançar `InstrumentoDuplicadoException` se tentar registrar um mesmo modelo para o mesmo luthier que ainda não tenha o reparo concluído.
- **update / find / remove**: Garantir fluxos core e validações na atualização.

## Open Questions

- Os repositórios ainda não possuem implementação física concreta acessível nos arquivos visualizados (provavelmente estão na pasta `adapters`), então os mocks serão baseados nas interfaces de porta. Você está de acordo com o uso estrito de mocks nos testes?

## Verification Plan

### Automated Tests
- Executar e validar todos os testes utilizando a CLI do NestJS e Jest:
  `npm run test`
- Garantir que não existam falhas na suíte de testes.
- Executar testes de cobertura para confirmar percentual de testes:
  `npm run test:cov`
