# Declaração de Escopo do Projeto (Project Scope Statement)

**Projeto:** Sistema Integrado de Gestão Empresarial e Plataforma Digital (ERP & CRM Omnichannel)  
**Código do Projeto:** PRJ-2026-ERP-089  
**Versão:** 1.0  
**Data de Criação:** 01 de Setembro de 2026  
**Gerente do Projeto:** Carlos Eduardo Silva  
**Patrocinador (Sponsor):** Direitoria Executiva de Tecnologia e Operações  

---

## 1. Justificativa do Projeto e Objetivos Negociais

### 1.1 Contexto e Justificativa
A empresa busca modernizar sua infraestrutura de software operacional e de atendimento ao cliente para sustentar o crescimento previsto de 35% nos próximos 2 anos. Atualmente, os processos encontram-se fragmentados em sistemas legados não integrados, gerando retrabalho, inconsistência de dados, atrasos na consolidação financeira e tempo elevado de resposta às demandas de clientes.

A implantação da nova plataforma integrada visará centralizar a gestão de suprimentos, finanças, faturamento, gestão de relacionamento com o cliente (CRM) e inteligência de negócios em uma arquitetura em nuvem segura e escalável.

### 1.2 Objetivos Estratégicos (Metas SMART)
* **Redução do Tempo de Fechamento Financeiro:** Reduzir o tempo de fechamento contábil/financeiro mensal de 12 dias para até 3 dias úteis até o final do Q3/2027.
* **Aumento da Eficiência no Atendimento (SLA):** Diminuir o tempo médio de atendimento (TMA) ao cliente no CRM em 40% dentro de 6 meses pós-implantação.
* **Integridade e Visibilidade dos Dados:** Eliminar a redundância de dados operacionais, atingindo 99,5% de acurácia nos estoques física x sistêmica.
* **Conformidade Legal:** Garantir 100% de conformidade com a LGPD (Lei Geral de Proteção de Dados) e legislações fiscais federais/estaduais vigentes no Brasil.

---

## 2. Descrição Geral do Escopo

O projeto compreende o mapeamento, parametrização, customização, integração, migração de dados, treinamento e implantação dos módulos do novo ERP e módulo CRM Cloud, integrados à infraestrutura de Data Lake corporativo e emissão fiscal automatizada.

### 2.1 Visão Geral da Solução Técnica
* **ERP Cloud Core:** Finanças, Contabilidade, Compras, Estoque, Faturamento e RH.
* **CRM Sales & Services:** Gestão de pipeline de vendas, automação de marketing, suporte ao cliente e portal self-service.
* **Barramento de Integração (API Gateway):** Camada middleware para comunicação segura via REST/gRPC entre sistemas legados de logística e os novos módulos.
* **Módulo Analytics / BI:** Dashboards executivos em tempo real para tomada de decisão.

---

## 3. Entregáveis do Projeto (Deliverables)

| Fase | Entregável Principal | Descrição Detalhada | Critério de Aceite |
| :--- | :--- | :--- | :--- |
| **1. Iniciação** | *Project Charter* & Kick-off | Termo de Abertura aprovado, alinhamento de stakeholders e atas da reunião inicial. | Assinatura formal pelo Sponsor do projeto. |
| **2. Planejamento** | Plano de Gerenciamento do Projeto | Documento consolidado (Cronograma detalhado, Plano de Riscos, Comunicação, Qualidade, RACI). | Validação pelos líderes funcionais de TI e Negócios. |
| **2. Planejamento** | Especificação Funcional e Técnica (*Blueprint*) | Mapeamento de processos *As-Is* / *To-Be*, arquitetura de integração e especificação de APIs. | Aprovação formal da Equipe de Arquitetura e Negócios. |
| **3. Execução** | Ambiente ERP & CRM Parametrizado | Instâncias de Desenvolvimento, Homologação e Produção configuradas na nuvem. | Checklists de configuração cumpridos sem pendências críticas. |
| **3. Execução** | Carga e Migração de Dados | Extração, transformação e carga (ETL) dos dados históricos (clientes, produtos, saldos financeiros). | Validação da acurácia de 99.8% dos dados migrados por amostragem. |
| **3. Execução** | Desenvolvimentos Customizados (RICEFW) | Relatórios customizados, interfaces de integração e melhorias específicas do negócio. | Testes unitários e de integração concluídos com 100% de cobertura. |
| **4. Validação** | Testes de Aceitação do Usuário (UAT) | Execução de cenários de teste ponta a ponta pelos usuários chave (*Key Users*). | 100% dos casos de teste críticos aprovados sem defeitos impeditivos. |
| **4. Validação** | Capacitação e Treinamento | Material didático, manuais do usuário e treinamentos executados para as equipes operacionais. | 90%+ de presença e nota média de avaliação > 8/10. |
| **5. Implantação** | Operação Assistida e *Go-Live* | Migração final de saldos, corte (*Cutover*), entrada em produção e suporte *Go-Live* de 30 dias. | Estabilidade do sistema mantida por 30 dias consecutivos sem *downtime* não planejado. |

---

## 4. Limites do Projeto (Dentro vs. Fora do Escopo)

### 4.1 Dentro do Escopo (In-Scope)
* Licenciamento, configuração e implantação das suítes ERP e CRM no ambiente Cloud.
* Migração de cadastro de clientes, fornecedores, catálogo de produtos e saldos contábeis dos últimos 3 anos.
* Integração nativa e automatizada com a Secretaria da Fazenda (SEFAZ) para emissão de NFe/NFCe/NFSe.
* Treinamento para até 150 usuários internos e desenvolvimento da documentação operacional.
* Suporte pós *Go-Live* (Operação Assistida) durante o período de 30 dias corridos após a virada de chave.

### 4.2 Fora do Escopo (Out-of-Scope)
* Aquisição ou substituição de hardwares físicos locais (desktops, notebooks, coletores de dados de código de barras).
* Desenvolvimento de aplicativo mobile exclusivo para consumidor final (B2C) nesta fase.
* Migração de dados de transações históricas arquivadas com mais de 3 anos de antiguidade.
* Customizações adicionais de software que não constem no documento de *Blueprint* aprovado na Fase 2.
* Manutenção predial ou infraestrutura de rede de telecomunicações nas filiais.

---

## 5. Estrutura de Decomposição do Trabalho (EDT / WBS)

```
1. Projeto Sistema ERP & CRM Integrado
   ├── 1.1 Iniciação e Governança
   │   ├── 1.1.1 Elaboração do Termo de Abertura (Project Charter)
   │   └── 1.1.2 Realização da Reunião de Kick-off
   ├── 1.2 Mapeamento e Desenho de Processos (Blueprint)
   │   ├── 1.2.1 Mapeamento As-Is e Levantamento de Requisitos
   │   ├── 1.2.2 Desenho de Processos To-Be
   │   └── 1.2.3 Arquitetura de Integrações e APIs
   ├── 1.3 Construção e Configuração
   │   ├── 1.3.1 Parametria Financeira, Contábil e Fiscal
   │   ├── 1.3.2 Configuração do Funil de Vendas e CRM
   │   ├── 1.3.3 Desenvolvimento de Interfaces RICEFW
   │   └── 1.3.4 Script e Rotinas de Carga (ETL)
   ├── 1.4 Validação e Homologação
   │   ├── 1.4.1 Testes Unitários e Integrados
   │   ├── 1.4.2 Homologação com Usuários Chave (UAT)
   │   └── 1.4.3 Capacitação e Treinamento de Usuários
   └── 1.5 Implantação e Encerramento
       ├── 1.5.1 Plano e Execução de Cutover
       ├── 1.5.2 Entrada em Produção (Go-Live)
       ├── 1.5.3 Operação Assistida (30 dias)
       └── 1.5.4 Aceite Definitivo e Encerramento do Projeto
```

---

## 6. Restrições e Premissas do Projeto

### 6.1 Premissas (Assumptions)
1. **Disponibilidade da Equipe Interna:** Os *Key Users* das áreas de negócio dedicarão pelo menos 20% de suas horas semanais para validações, testes e treinamentos.
2. **Qualidade dos Dados de Origem:** Os dados extraídos do sistema legado passarão por limpeza e higienização prévia a cargo da equipe interna da empresa antes da carga no ERP.
3. **Decisões Tempestivas:** Decisões de arquitetura e aprovação de entregáveis serão avaliadas pelo Comitê Steering em no máximo 5 dias úteis após submissão.

### 6.2 Restrições (Constraints)
1. **Orçamento Máximo:** O orçamento total aprovado para o projeto é de R$ 1.850.000,00, não podendo ser excedido sem prévia submissão ao Comitê Executivo.
2. **Prazo de Implantação:** O *Go-Live* final deve ocorrer imperativamente até **15 de Junho de 2027**, a fim de evitar sobreposição com a janela de pico de vendas do segundo semestre.
3. **Conformidade Regulatória:** O sistema deve estar 100% adequado à LGPD e à legislação tributária brasileira desde a data do lançamento.

---

## 7. Cronograma Macro e Principais Marcos (Milestones)

| Marco | Descrição | Data Prevista |
| :--- | :--- | :--- |
| **M1** | Aprovação do *Project Charter* e Início do Projeto | 15/09/2026 |
| **M2** | Conclusão do *Blueprint* de Processos e Arquitetura | 15/11/2026 |
| **M3** | Finalização do Desenvolvimento e Parametrizações | 28/02/2027 |
| **M4** | Carga Inicial de Dados e Início do UAT | 15/03/2027 |
| **M5** | Conclusão do UAT e Aprovação de Homologação | 30/04/2027 |
| **M6** | Finalização dos Treinamentos dos Usuários | 31/05/2027 |
| **M7** | Execução do Cutover e **Go-Live** | 15/06/2027 |
| **M8** | Fim da Operação Assistida e Encerramento do Projeto | 15/07/2027 |

---

## 8. Matriz de Responsabilidades (RACI Sintética)

* **R (Responsible):** Quem executa a tarefa.
* **A (Accountable):** Quem responde pelo resultado (aprovador final).
* **C (Consulted):** Quem deve ser consultado.
* **I (Informed):** Quem deve ser informado.

| Atividade / Entregável | GP Projeto | Time Técnico/Dev | Key Users | Sponsor / Comitê |
| :--- | :---: | :---: | :---: | :---: |
| Definição dos Requisitos (*Blueprint*) | C | R | A | I |
| Desenvolvimento e Configuracões | I | R | C | I |
| Testes de Aceitação do Usuário (UAT) | C | C | R / A | I |
| Aprovação do Go-Live | C | C | C | A |
| Treinamento dos Usuários | C | R | A | I |

---

## 9. Gestão de Mudanças de Escopo (Change Management Procedure)

Quaisquer alterações nos objetivos, entregáveis, prazos ou custos estipulados nesta Declaração de Escopo deverão seguir o procedimento formal de solicitação de mudança (CR - *Change Request*):

1. **Submissão:** Identificação da necessidade de mudança e preenchimento do formulário formal de CR pelo solicitante.
2. **Análise de Impacto:** O Gerente do Projeto e a equipe técnica avaliarão os impactos em custo, cronograma, riscos e qualidade em até 3 dias úteis.
3. **Avaliação do Comitê:** A solicitação e a análise de impacto serão encaminhadas para o Comitê Gestor do Projeto (*Steering Committee*).
4. **Decisão:** A mudança será **Aprovada**, **Rejeitada** ou **Postergada**. Nenhuma alteração de escopo será implementada sem a assinatura de aprovação do Sponsor.

---

## 10. Termo de Aceite e Aprovação

Ao assinar este documento, as partes interessadas concordam com a definição do escopo aqui apresentada, reconhecendo seus limites, entregáveis, premissas e restrições para a execução do projeto.

| Papel | Nome | Assinatura | Data |
| :--- | :--- | :--- | :--- |
| **Patrocinador do Projeto** | Roberto Machado | _______________________ | ____/____/2026 |
| **Gerente do Projeto** | Carlos Eduardo Silva | _______________________ | ____/____/2026 |
| **Líder Técnico de Arquitetura** | Fernanda Rocha | _______________________ | ____/____/2026 |
| **Diretor Operacional** | Marcelo Mendes | _______________________ | ____/____/2026 |