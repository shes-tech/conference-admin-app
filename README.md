# She'sTech Conference **Admin** App

[![Netlify Status](https://api.netlify.com/api/v1/badges/70f3c96d-ef19-4bd1-b835-14581ffc6329/deploy-status)](https://app.netlify.com/sites/shestech-admin/deploys)

Este projeto tem como objetivo criar uma aplicação web para o controle dos eventos da She'sTech Conference. O repositório [`shes-tech/conference-app`](https://github.com/shes-tech/conference-app) contém a aplicação de visualização dos eventos.

![Celular mostrando duas telas da aplicação](../assets/app-sample.png?raw=true)

**DEMO**: [https://shestech.netlify.com](https://shestech.netlify.com)


## Sobre o projeto

Esta aplicação consiste de um SPA desenvolvido utilizando Vue + Firebase Firestore.

Você pode conferir [**neste post**](https://italolelis.com/posts/shestech-app-pt/), de forma detalhada, o processo de desenvolvimento da aplicação.

| O que foi utilizado                                                       | Descrição                                                       |
|---------------------------------------------------------------------------|-----------------------------------------------------------------|
| [Vue.js](https://vuejs.org/)                                              | Framework para desenvolvimento de SPA (Single-Page Application) |
| [Vuex](https://vuex.vuejs.org/)                                           | Gerenciador de estados recomendado para o Vue                   |
| [Firebase Firestore](https://firebase.google.com/docs/firestore?hl=pt-br) | Banco de Dados NoSQL (Serverless)                               |
| [Netlify](https://www.netlify.com/)                                       | Hospedagem e deploy automático                                  |
| [Buefy](https://buefy.org/)                                               | Biblioteca de componentes do Bulma                              |
| [date-fns](https://date-fns.org/)                                         | Biblioteca para gerenciamento de datas (no lugar do Moment.js)  |


## Como executar

Para rodar a aplicação, você irá precisar da versão mais recente do [Node.js](https://nodejs.org/) na sua máquina.

```
# Instalar dependências
npm install

# Executar servidor local com hot-reload
npm run serve

# Compilar arquivos para produção
npm run build
```