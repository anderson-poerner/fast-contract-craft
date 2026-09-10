# Contrato Rápido

ZapTify é um aplicativo SaaS focado em ajudar profissionais autônomos e microempresas a gerarem contratos de prestação de serviços de forma ultra-rápida.

O aplicativo deve ter um design moderno, limpo e profissional (use tons de azul escuro, cinza espacial e branco, com estilo minimalista de SaaS de alta tecnologia).

O sistema deve conter as seguintes telas e funcionalidades:

1. TELA DE LOGIN / CADASTRO:

- Uma tela inicial simples para simular o login do usuário (com campos de e-mail e senha) e um botão de "Entrar" que redirecione diretamente para o Painel Principal.

2. PAINEL PRINCIPAL (DASHBOARD):

- Um menu lateral com o nome do sistema e o perfil do usuário logado.

- A área principal deve ser dividida em duas colunas:

  * COLUNA DA ESQUERDA (Formulário de Dados):

    - Um campo de seleção (Dropdown) para escolher o "Tipo de Contrato" (com as opções: "Prestação de Serviços Gerais", "Social Media / Marketing", "Termo de Visita Imobiliária", "Contrato de Mentoria/Consultoria").

    - Campos de texto organizados para preenchimento:

      - Nome Completo/Razão Social do Contratante (Cliente) e CPF/CNPJ.

      - Nome Completo/Razão Social do Contratado (Prestador) e CPF/CNPJ.

      - Descrição detalhada do serviço que será prestado (área de texto grande).

      - Valor do Serviço (R$) e Forma de Pagamento (ex: Pix, Cartão, Parcelado).

      - Prazo de entrega ou vigência do contrato.

      - Foro (Cidade onde o contrato será assinado).

  

  * COLUNA DA DIREITA (Visualização em Tempo Real & Download):

    - Uma área que simule uma folha A4 em branco com bordas cinzas elegantes.

    - Conforme o usuário digita no formulário da esquerda, o texto na folha A4 deve ser atualizado em tempo real com as informações preenchidas, formatado como um contrato jurídico profissional padrão.

    - Se o usuário não selecionar nenhum tipo, mostre um texto amigável pedindo para preencher os dados ao lado.

    - No topo desta coluna, coloque um botão bem destacado: "Gerar e Baixar PDF".

3. FUNÇÃO DE DOWNLOAD:

- Configure um botão para baixar o texto formatado da folha A4 diretamente como um arquivo PDF limpo e pronto para impressão ou assinatura digital.

Gere este layout completo e funcional utilizando componentes modernos.

This project was built with [Lovable](https://lovable.dev).

**Aplicativo:** ZapTify

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/691bda3f-4aeb-4402-b063-4aa22a8908a9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
