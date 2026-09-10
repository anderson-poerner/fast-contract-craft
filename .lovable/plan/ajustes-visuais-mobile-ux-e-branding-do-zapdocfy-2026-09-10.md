# Ajustes visuais, mobile, UX e branding do ZapTify

## O que será alterado
- Trocar o nome visível e os metadados do aplicativo para **ZapTify** em todas as telas.
- Reorganizar o painel para exibir, no desktop e no celular, métricas de contratos, resumo de status e uma ação principal **+ Criar Contrato Rápido**.
- Remover a opção duplicada **Novo Contrato** do menu lateral.
- Ajustar cabeçalhos em telas pequenas, especialmente o botão **Voltar ao painel**, evitando quebras e desalinhamento.
- Padronizar os status com badges: **Pendente no WhatsApp** em amarelo, **Assinado** em verde e **Rascunho** em cinza.
- Criar uma página de **Configurações** com a seção **Dados da Minha Empresa / Contratado**, incluindo nome/razão social, CPF/CNPJ, endereço, e-mail e telefone.
- Remover o cadastro da empresa do formulário do contrato e preencher automaticamente os novos contratos com os dados salvos nas configurações.
- Adicionar em Configurações um alternador persistente entre modo claro e modo escuro.

## Detalhes técnicos
- Os dados da empresa e a preferência de tema continuarão salvos no navegador, preservando o comportamento atual sem exigir novo cadastro ou autenticação.
- O modelo do contrato será ampliado para incluir endereço e contato do contratado, mantendo compatibilidade com contratos já existentes.
- A listagem e os resumos usarão os contratos já vinculados ao navegador e os status atuais do backend.
- As telas serão verificadas em largura mobile e desktop, incluindo compilação e interações principais.
