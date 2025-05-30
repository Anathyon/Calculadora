"use strict";
const display = document.querySelector("#inpu_display");
const btns = document.querySelectorAll("button");
const listaHistorico = document.querySelector("#lista_historico");
const bt_limpa_histo = document.querySelector("#bt_limpa_histo");
let guarda_num_atual = "";
let recebe_operador = null;
let guarda_primeiro_num = null;
const alt_display = (val) => {
    display.value = val;
};
const recebe_num = (num) => {
    if (num === "." && guarda_num_atual.includes("."))
        return;
    guarda_num_atual += num;
    alt_display(guarda_num_atual);
};
const potencia = () => {
    if (guarda_num_atual !== "") {
        const base = parseFloat(guarda_num_atual.replace(",", "."));
        const expoenteStr = prompt(`Digite o expoente para ${base}:`);
        if (expoenteStr !== null) {
            const expoente = parseFloat(expoenteStr.replace(",", "."));
            if (isNaN(expoente)) {
                alert("Expoente inválido!");
                return;
            }
            const result = base ** expoente;
            const expressao = `${base}^${expoente}`;
            guarda_num_atual = result.toString();
            alt_display(guarda_num_atual.replace(".", ","));
            const itemHistorico = document.createElement("li");
            itemHistorico.textContent = `${expressao} = ${guarda_num_atual.replace(".", ",")}`;
            listaHistorico.appendChild(itemHistorico);
        }
    }
};
const fatorial = () => {
    if (guarda_num_atual !== "") {
        const num = parseInt(guarda_num_atual.replace(",", "."));
        if (isNaN(num)) {
            alert("Número inválido! Para realizar o cálculo, utilize números inteiros não negativos.");
            return;
        }
        let result = 1;
        for (let i = 1; i <= num; i++) {
            result *= i;
        }
        const expressao = `${num}!`;
        guarda_num_atual = result.toString();
        alt_display(guarda_num_atual);
        const itemHistorico = document.createElement("li");
        itemHistorico.textContent = `${expressao} = ${guarda_num_atual}`;
        listaHistorico.appendChild(itemHistorico);
    }
};
const altera_sinal = () => {
    if (guarda_num_atual !== "") {
        guarda_num_atual = (parseFloat(guarda_num_atual.replace(",", ".")) * -1).toString();
        alt_display(guarda_num_atual.replace(",", "."));
    }
};
const raiz = () => {
    if (guarda_num_atual !== "") {
        const num = parseFloat(guarda_num_atual.replace(",", "."));
        if (isNaN(num)) {
            alert("Valor inválido");
            return;
        }
        if (num < 0) {
            alert("Não é possível calcular raíz de números negativos!");
            return;
        }
        const result = Math.sqrt(num);
        const expressao = `√(${guarda_num_atual})`;
        guarda_num_atual = result.toString();
        alt_display(guarda_num_atual.replace(",", "."));
        const ne_historico = document.createElement("li");
        ne_historico.textContent = `${expressao} = ${guarda_num_atual.replace(",", ".")}`;
        listaHistorico.appendChild(ne_historico);
    }
};
const opera = (ope) => {
    if (guarda_primeiro_num === null) {
        guarda_primeiro_num = guarda_num_atual;
        guarda_num_atual = "";
    }
    recebe_operador = ope;
};
const limpa_historico = () => {
    listaHistorico.innerHTML = "";
};
const calcular = () => {
    if (guarda_primeiro_num && recebe_operador) {
        const primeiro = parseFloat(guarda_primeiro_num.replace(",", "."));
        const segundo = parseFloat(guarda_num_atual.replace(",", "."));
        let result = 0;
        let expressao = `${guarda_primeiro_num} ${recebe_operador} ${guarda_num_atual}`;
        switch (recebe_operador) {
            case "+":
                result = primeiro + segundo;
                break;
            case "-":
                result = primeiro - segundo;
                break;
            case "X":
                result = primeiro * segundo;
                break;
            case "/":
                result = primeiro / segundo;
                break;
            case "%":
                result = (primeiro * segundo) / 100;
                break;
            case "X²":
                result = primeiro ** 2;
                expressao = `${primeiro}²`;
                break;
            default:
                return;
        }
        guarda_num_atual = result.toString();
        alt_display(guarda_num_atual.replace(".", ","));
        const itemHistorico = document.createElement("li");
        itemHistorico.textContent = `${expressao} = ${guarda_num_atual.replace(".", ",")}`;
        listaHistorico.appendChild(itemHistorico);
        guarda_primeiro_num = null;
        recebe_operador = null;
    }
};
const limpa_tudo = () => {
    guarda_num_atual = "";
    guarda_primeiro_num = null;
    recebe_operador = null;
    alt_display("0");
};
const limpa_ultimo_caractere = () => {
    if (guarda_num_atual.length > 0) {
        guarda_num_atual = guarda_num_atual.slice(0, -1);
        alt_display(guarda_num_atual || "0");
    }
};
btns.forEach((b) => {
    b.addEventListener("click", () => {
        const val = b.textContent || "";
        if (!isNaN(Number(val))) {
            recebe_num(val);
        }
        else if (val === "C") {
            limpa_ultimo_caractere();
        }
        else if (val === "CL") {
            limpa_tudo();
        }
        else if (val === "=") {
            calcular();
        }
        else if (val === ".") {
            recebe_num(".");
        }
        else if (val === "±") {
            altera_sinal();
        }
        else if (val === "√") {
            raiz();
        }
        else if (val === "xʸ") {
            potencia();
        }
        else if (val === "n!") {
            fatorial();
        }
        else if (val === "Limpar Histórico") {
            if (listaHistorico.children.length === 0) {
                alert("Nenhum cálculo foi realizado ainda!");
            }
            else {
                limpa_historico();
            }
        }
        else {
            opera(val);
        }
    });
});
