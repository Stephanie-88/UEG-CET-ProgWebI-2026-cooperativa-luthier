# Testes Unitários — Cooperativa Luthier

Este documento explica como executar e entender os testes unitários da aplicação.

---

## Como executar os testes

Abra o terminal na pasta raiz do projeto (`cooperativa-luthier`) e use um dos comandos abaixo:

### Executar todos os testes

```bash
npx jest
```

### Executar com detalhes (mostra o nome de cada teste)

```bash
npx jest --verbose
```

### Executar com relatório de cobertura de código

```bash
npx jest --coverage
```

### Executar em modo "watch" (reexecuta automaticamente a cada mudança)

```bash
npx jest --watch
```

### Executar apenas um arquivo de teste específico

```bash
npx jest src/services/luthier.service.spec.ts
npx jest src/services/instrumento-reparo.service.spec.ts
npx jest src/controllers/luthier.controller.spec.ts
npx jest src/controllers/instrumento-reparo.controller.spec.ts
```

---

## Estrutura dos arquivos de teste

Os arquivos de teste ficam ao lado dos arquivos que testam, seguindo a convenção `*.spec.ts`:

```
src/
├── controllers/
│   ├── luthier.controller.ts                    ← Código do controller
│   ├── luthier.controller.spec.ts               ← Testes do controller
│   ├── instrumento-reparo.controller.ts         ← Código do controller
│   └── instrumento-reparo.controller.spec.ts    ← Testes do controller
├── services/
│   ├── luthier.service.ts                       ← Código do service
│   ├── luthier.service.spec.ts                  ← Testes do service
│   ├── instrumento-reparo.service.ts            ← Código do service
│   └── instrumento-reparo.service.spec.ts       ← Testes do service
```

---

## O que cada arquivo de teste cobre

### `luthier.controller.spec.ts`

Testa se o controlador de Luthier repassa corretamente os dados para o Service:

| Rota                    | O que verifica                                          |
|-------------------------|---------------------------------------------------------|
| `POST /luthiers`        | Chama `service.create()` com o DTO correto              |
| `GET /luthiers`         | Chama `service.findAll()` e retorna a lista             |
| `GET /luthiers/:id`     | Repassa o ID para `service.findOne()`                   |
| `PATCH /luthiers/:id`   | Repassa ID e DTO para `service.update()`                |
| `DELETE /luthiers/:id`  | Repassa o ID para `service.remove()`                    |

### `instrumento-reparo.controller.spec.ts`

Testa se o controlador de Instrumento em Reparo repassa corretamente os dados para o Service:

| Rota                                             | O que verifica                                   |
|--------------------------------------------------|--------------------------------------------------|
| `POST /instrumentos-reparo`                      | Chama `service.create()` com o DTO correto       |
| `GET /instrumentos-reparo`                       | Chama `service.findAll()` e retorna a lista      |
| `GET /instrumentos-reparo/:id`                   | Repassa o ID para `service.findOne()`            |
| `GET /instrumentos-reparo/luthier/:luthierId`    | Repassa luthierId para `service.findByLuthier()` |
| `PATCH /instrumentos-reparo/:id`                 | Repassa ID e DTO para `service.update()`         |
| `DELETE /instrumentos-reparo/:id`                | Repassa o ID para `service.remove()`             |

### `luthier.service.spec.ts`

Testa toda a lógica de negócio do LuthierService:

| Cenário testado                       | Exceção esperada                    | Mensagem em português                                     |
|---------------------------------------|-------------------------------------|------------------------------------------------------------|
| Criar com dados válidos               | —                                   | Sucesso                                                    |
| `nomeMestre` vazio                    | `CamposObrigatoriosException`       | "O campo nomeMestre é obrigatório"                         |
| `dataAbertura` ausente               | `CamposObrigatoriosException`       | "O campo dataAbertura é obrigatório"                       |
| `certificada` ausente                | `CamposObrigatoriosException`       | "O campo certificada é obrigatório"                        |
| `bancadasNum` ausente                | `CamposObrigatoriosException`       | "O campo bancadasNum é obrigatório"                        |
| Data de abertura no futuro            | `DataFuturaException`               | "A dataAbertura não pode ser uma data futura"              |
| Bancadas < 2                          | `BancadasInsuficientesException`    | "O número de bancadas deve ser maior ou igual a 2"         |
| Buscar ID inexistente                 | `Error`                             | "Luthier não encontrado"                                   |
| Atualizar data para o futuro          | `DataFuturaException`               | "A dataAbertura não pode ser uma data futura"              |
| Atualizar bancadas < 2                | `BancadasInsuficientesException`    | "O número de bancadas deve ser maior ou igual a 2"         |

### `instrumento-reparo.service.spec.ts`

Testa toda a lógica de negócio do InstrumentoReparoService:

| Cenário testado                              | Exceção esperada                                   | Mensagem em português                                                          |
|----------------------------------------------|-----------------------------------------------------|--------------------------------------------------------------------------------|
| Criar com dados válidos                      | —                                                   | Sucesso                                                                        |
| `modeloMadeira` vazio                        | `CamposObrigatoriosException`                       | "O campo modeloMadeira é obrigatório"                                          |
| `dataEntrada` ausente                        | `CamposObrigatoriosException`                       | "O campo dataEntrada é obrigatório"                                            |
| `reparoConcluido` ausente                    | `CamposObrigatoriosException`                       | "O campo reparoConcluido é obrigatório"                                        |
| `custoReparo` ausente                        | `CamposObrigatoriosException`                       | "O campo custoReparo é obrigatório"                                            |
| `luthierId` ausente                          | `CamposObrigatoriosException`                       | "O campo luthierId é obrigatório"                                              |
| Luthier não existe                           | `LuthierNaoEncontradoParaInstrumentoException`      | "Luthier com ID X não encontrado para associar ao instrumento"                 |
| Data de entrada no futuro                    | `DataFuturaException`                               | "A dataEntrada não pode ser uma data futura"                                   |
| Data de entrada < data de abertura           | `DataInconsistenteException`                        | "A data de entrada não pode ser anterior à data de abertura da oficina"         |
| Custo = 0                                    | `CustoReparoInvalidoException`                      | "O custo do reparo deve ser maior que 0 e menor ou igual a 50000"              |
| Custo > 50.000                               | `CustoReparoInvalidoException`                      | "O custo do reparo deve ser maior que 0 e menor ou igual a 50000"              |
| Reparo concluído com custo 0                 | `ReparoConcluidoSemCustoException`                  | "Um reparo concluído não pode ter custo zero"                                  |
| Instrumento duplicado pendente               | `InstrumentoDuplicadoException`                     | "Já existe um instrumento em reparo com o modelo X"                            |
| Buscar ID inexistente                        | `Error`                                             | "Instrumento não encontrado"                                                   |
| Atualizar ID inexistente                     | `Error`                                             | "Instrumento não encontrado"                                                   |

---

## O que são mocks e por que usamos

**Mocks** são simulações de objetos reais. Nos testes, substituímos os repositórios (que acessam o banco de dados) por mocks para:

1. **Isolar** a lógica de negócio — testamos apenas o Service ou Controller, sem depender do banco
2. **Controlar** os retornos — definimos exatamente o que cada método do repositório retorna
3. **Verificar** chamadas — confirmamos que os métodos foram chamados com os argumentos corretos
4. **Velocidade** — os testes rodam em milissegundos, sem precisar de conexão com banco de dados

---

## Resultado esperado

Ao executar `npx jest --verbose`, o resultado deve ser semelhante a:

```
PASS src/services/luthier.service.spec.ts
PASS src/services/instrumento-reparo.service.spec.ts
PASS src/controllers/luthier.controller.spec.ts
PASS src/controllers/instrumento-reparo.controller.spec.ts
PASS src/app.controller.spec.ts

Test Suites: 5 passed, 5 total
Tests:       50 passed, 50 total
```
