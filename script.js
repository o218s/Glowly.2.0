
let carrinho = [];
let total = 0;

function toggleMenu() {
    document.getElementById('menu').classList.toggle('active');
}

function selecionarFoto(event) {
    const ficheiro = event.target.files[0];

    if (!ficheiro) return;

    document.getElementById('resultado-foto').textContent =
        "✓ Fotografia selecionada: " + ficheiro.name +
        ". A análise automática ainda não está ligada.";
}

function addCart(nome, preco) {
    carrinho.push({nome, preco});
    total += preco;

    document.getElementById('cart-info').textContent =
        "Carrinho: " + carrinho.length +
        " produtos | Total: " + total.toFixed(2) + " €";
}

function responder(pergunta) {
    const respostas = {
        "Tenho pele oleosa, o que devo usar?":
        "Para pele oleosa, procura produtos suaves, não comedogénicos e hidratantes leves. Usa protetor solar diariamente.",

        "Posso combinar vários produtos?":
        "Depende dos ingredientes. Introduz novos produtos gradualmente e evita combinar ativos potencialmente irritantes sem orientação.",

        "Como faço a minha rotina de manhã?":
        "Uma rotina simples inclui limpeza suave, hidratante e protetor solar FPS 30 ou superior.",

        "Que produtos usar para pele sensível?":
        "Escolhe produtos sem perfume, com fórmulas suaves. Testa primeiro numa pequena área."
    };

    document.getElementById('resposta').textContent =
        "✦ Glowly: " + (respostas[pergunta] ||
        "Obrigada pela tua pergunta! Para uma recomendação mais adequada, conta-nos um pouco mais sobre a tua rotina e necessidades.");
}

function enviar() {
    const campo = document.getElementById('pergunta');
    const pergunta = campo.value.trim();

    if (!pergunta) return;

    responder(pergunta);
    campo.value = "";
}
