# 🧮 Calculadora Científica PWA

Este é um projeto desenvolvido em **HTML + CSS + TypeScript**, hospedado na **Vercel**, que oferece uma calculadora científica completa e funcional.  
Além de realizar operações matemáticas básicas e avançadas, a calculadora conta com **funcionalidades científicas**, **histórico persistente**, **PWA** e um **design responsivo e moderno** para todas as telas.

---

## 📌 Funcionalidades

### Operações Básicas
- ✅ Quatro operações básicas (adição, subtração, multiplicação e divisão)
- ✅ Operações com números decimais
- ✅ Porcentagem e mudança de sinal (±)
- ✅ Botões **C** (limpar entrada) e **CL** (limpar tudo)
- ✅ Botão de correção (⌫) para apagar último caractere

### Funções Científicas
- ✅ Funções trigonométricas (sin, cos, tan)
- ✅ Logaritmos (log base 10 e ln natural)
- ✅ Potenciação (x²) e raiz quadrada (√)
- ✅ Constantes matemáticas (π e e)
- ✅ Fatorial (n!) e inverso (1/x)

### Recursos Avançados
- ✅ **PWA** - Funciona offline e pode ser instalada no dispositivo
- ✅ **Histórico persistente** - Salva até 50 cálculos no localStorage
- ✅ **Modal interativo** para visualização do histórico
- ✅ **Service Worker** com cache inteligente
- ✅ **TypeScript** com tipagem forte e interfaces
- ✅ **Layout responsivo** adaptável (Mobile, Tablet e Desktop)
- ✅ **Validação de erros** (divisão por zero, logaritmo de negativos, etc.)

---

## 🧪 Tecnologias Utilizadas

| Ferramenta | Descrição |
|------------|-----------|
| [HTML5](https://developer.mozilla.org/pt-BR/docs/Web/HTML) | Estruturação semântica e PWA manifest |
| [CSS3](https://developer.mozilla.org/pt-BR/docs/Web/CSS) | Estilização responsiva com SCSS |
| [TypeScript](https://www.typescriptlang.org/) | Lógica tipada com interfaces e classes |
| [Service Worker](https://developer.mozilla.org/pt-BR/docs/Web/API/Service_Worker_API) | Cache offline e PWA |
| [LocalStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage) | Persistência do histórico |
| [Vercel](https://vercel.com/) | Plataforma de deploy automatizado |

---

## 🖼️ Layout

> 💻 Desktop | 📱 Mobile

| Desktop             | Mobile              |
|---------------------|---------------------|
<div align="center">
  <img src="assets/calc-desktop.png" width="400" alt="Versão Desktop" />
  <img src="assets/calc-mobile.jpg" width="200" alt="Versão Mobile" />
</div>

---

## 📦 Instalação e Desenvolvimento

### Clonagem do Repositório
```bash
git clone https://github.com/Anathyon/Calculadora.git
cd calculadora
```

### Desenvolvimento Local
```bash
# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Compilar TypeScript (se necessário)
tsc
```

### Execução Simples
```bash
# Abrir diretamente no navegador
open index.html

# Ou usar servidor local
python -m http.server 3000
# ou
live-server --port=3000
```

## 🔒 Validação e Usabilidade

- **Validação robusta** com tratamento de erros matemáticos
- **Histórico persistente** com até 50 cálculos salvos localmente
- **PWA completa** - funciona offline e pode ser instalada
- **Interface intuitiva** com feedback visual para todas as operações
- **Responsividade total** - adaptável para qualquer dispositivo
- **Acessibilidade** com suporte a navegação por teclado

---

## 🌐 Deploy e PWA

### Acesso Online
[![Deploy na Vercel](https://vercel.com/button)](https://calculadora-six-rosy.vercel.app/)

### Instalação como PWA
- 📱 **Mobile**: Toque em "Adicionar à tela inicial" no menu do navegador
- 💻 **Desktop**: Clique no ícone de instalação na barra de endereços
- 🔄 **Offline**: Funciona completamente sem conexão após a primeira visita

---

## 🤝 Contribuições

Contribuições são sempre bem-vindas!  
Se você tiver ideias para melhorar o projeto ou identificar bugs, sinta-se à vontade para abrir uma issue ou pull request.

---

## 👨‍💻 Autor

Desenvolvido por: **Anathyon Erysson**  
📫 anathyonerysson@protonmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/anathyonerysson/)
