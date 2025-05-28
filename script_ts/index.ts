const display = document.querySelector("#inpu_display") as HTMLInputElement
const btns = document.querySelectorAll("button")
const listaHistorico = document.querySelector("#lista_historico") as HTMLUListElement
const bt_limpa_histo = document.querySelector("#bt_limpa_histo") as HTMLButtonElement

let guarda_num_atual: string = ""
let recebe_operador: string | null = null
let guarda_primeiro_num: string | null = null

function alt_display(val: string) {
    display.value = val
}

function recebe_num(num: string) {
    if (num === "." && guarda_num_atual.includes(".")) return

    guarda_num_atual += num
    alt_display(guarda_num_atual)
}

function altera_sinal() {
    if (guarda_num_atual !== "") {
        guarda_num_atual  = (parseFloat(guarda_num_atual.replace(",","."))* -1).toString()
        alt_display(guarda_num_atual.replace(",","."))
    }
}

function opera(ope: string) {
    if (guarda_primeiro_num === null) {
        guarda_primeiro_num = guarda_num_atual
        guarda_num_atual = ""
    }
    recebe_operador = ope
}

function limpa_historico() {
    listaHistorico.innerHTML = ""
}

function calcular() {
    if (guarda_primeiro_num && recebe_operador) {
        const primeiro = parseFloat(guarda_primeiro_num.replace(",", "."))
        const segundo = parseFloat(guarda_num_atual.replace(",", "."))

        let result: number = 0
        let expressao = `${guarda_primeiro_num} ${recebe_operador} ${guarda_num_atual}`
        
        switch (recebe_operador) {
            case "+":
                result = primeiro + segundo
                break
            case "-":
                result = primeiro - segundo
                break
            case "X":
                result = primeiro * segundo
                break
            case "/":
                result = primeiro / segundo
                break
            case "%":
                result = (primeiro * segundo) / 100
                break
            case "X²":
                result = primeiro ** 2
                expressao = `${primeiro}²`
                break
            default:
                return
        }

        guarda_num_atual = result.toString()
        alt_display(guarda_num_atual.replace(".", ","))

        const itemHistorico = document.createElement("li")
        itemHistorico.textContent = `${expressao} = ${guarda_num_atual.replace(".", ",")}`
        listaHistorico.appendChild(itemHistorico)

        guarda_primeiro_num = null
        recebe_operador = null
    }
}

function limpa_tudo() {
    guarda_num_atual = ""
    guarda_primeiro_num = null
    recebe_operador = null
    alt_display("0")
}

function limpa_ultimo_caractere() {
    if (guarda_num_atual.length > 0){
        guarda_num_atual = guarda_num_atual.slice(0,-1)
        alt_display(guarda_num_atual || "0")
    }
    
}

btns.forEach((b) => {
    b.addEventListener("click", () => {
        const val = b.textContent || ""

        if (!isNaN(Number(val))) {
            recebe_num(val)
        } else if (val === "C") {
            limpa_ultimo_caractere()
        } else if (val === "CL") {
            limpa_tudo() 
        } else if (val === "=") {
            calcular()
        } else if (val === ".") {
            recebe_num(".")
        } else if (val === "±"){
            altera_sinal()
        }
          else if (val === "Limpar Histórico"){
            if (listaHistorico.children.length === 0) {
                 alert("Nenhum cálculo foi realizado ainda!")
            }else{
                limpa_historico()
            }
            
          }
        else {
            opera(val)
        }
    })
})
