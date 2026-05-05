# 📦 FIAP Mobile Produtos (Acadêmico)

App mobile de gerenciamento de produtos com React Native, Expo e Firebase.

## ✨ Funcionalidades

- Autenticação com e-mail e senha (login, cadastro, recuperação de senha)
- CRUD de produtos (criar, listar, editar, excluir)
- Leitura de código de barras via câmera
- Validação de formulários com erros inline
- Dados persistidos no Firebase Realtime Database

## 🛠 Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Firebase](https://firebase.google.com/) (Authentication + Realtime Database)

## 🚀 Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [Expo Go](https://expo.dev/go) no celular (opcional)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/fiap-mobile-produtos.git

# Entre na pasta
cd fiap-mobile-produtos

# Instale as dependências
npm install
```

### Configuração do Firebase

Crie um arquivo `.env` na raiz do projeto com suas credenciais:

```
EXPO_PUBLIC_API_KEY=sua_api_key
EXPO_PUBLIC_AUTH_DOMAIN=seu_projeto.firebaseapp.com
EXPO_PUBLIC_PROJECT_ID=seu_projeto
EXPO_PUBLIC_STORAGE_BUCKET=seu_projeto.firebasestorage.app
EXPO_PUBLIC_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_DATABASE_URL=https://seu_projeto-default-rtdb.firebaseio.com
EXPO_PUBLIC_APP_ID=seu_app_id
EXPO_PUBLIC_MEASUREMENT_ID=seu_measurement_id
```

### Executar

```bash
npx expo start
```

- Pressione `w` para abrir no navegador
- Escaneie o QR code com o Expo Go para abrir no celular

## 📁 Estrutura

```
src/
├── components/     # Componentes reutilizáveis (botões, cards)
├── firebase/       # Configuração e serviços do Firebase
├── navigation/     # Configuração de rotas
├── screens/        # Telas do app
└── styles/         # Tema e estilos globais
```

## 🔒 Variáveis de ambiente

O arquivo `.env` não é versionado. Não subi minhas credenciais do Firebase para o repositório.
