

// =====================================
// GLOWLY - JAVASCRIPT
// =====================================

// CARRINHO DE COMPRAS
let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("glowlyCart") || "[]");

    if (!Array.isArray(cart)) {
        cart = [];
    }
} catch (error) {
    cart = [];
}

// =====================================
// MENU
// =====================================

function toggleMenu() {
    const menu = document.getElementById("menu");

    if (menu) {
        menu.classList.toggle("active");
    }
}

// =====================================
// SELEÇÃO DE FOTOGRAFIA
// =====================================

function selecionarFoto(event) {
    const ficheiro = event.target.files[0];
    const resultado = document.getElementById("resultado-foto");

    if (!ficheiro || !resultado) return;

    if (!ficheiro.type.startsWith("image/")) {
        resultado.textContent = "Por favor, seleciona uma imagem válida.";
        return;
    }

    resultado.textContent =
        "✓ Fotografia selecionada: " + ficheiro.name +
        ". A análise automática ainda não está ligada.";
}

// =====================================
// ASSISTENTE GLOWLY
// =====================================

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

    const elemento = document.getElementById("resposta");

    if (!elemento) return;

    elemento.textContent =
        "✦ Glowly: " +
        (respostas[pergunta] ||
        "Obrigada pela tua pergunta! Para uma recomendação mais adequada, conta-nos um pouco mais sobre a tua rotina e necessidades.");
}

function enviar() {

    const campo = document.getElementById("pergunta");

    if (!campo) return;

    const pergunta = campo.value.trim();

    if (!pergunta) return;

    responder(pergunta);

    campo.value = "";
}

// =====================================
// ELEMENTOS DO CARRINHO
// =====================================

const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("cartOverlay");

function openCart() {

    if (drawer) drawer.classList.add("active");

    if (overlay) overlay.classList.add("active");
}

function closeCart() {

    if (drawer) drawer.classList.remove("active");

    if (overlay) overlay.classList.remove("active");
}

// Eventos do carrinho

document.getElementById("openCart")?.addEventListener("click", openCart);

document.getElementById("closeCart")?.addEventListener("click", closeCart);

overlay?.addEventListener("click", closeCart);

// =====================================
// GUARDAR CARRINHO
// =====================================

function saveCart() {

    localStorage.setItem("glowlyCart", JSON.stringify(cart));

    renderCart();
}

// =====================================
// ADICIONAR PRODUTOS
// =====================================

function addToCart(id, name, price) {

    if (!id || !name || !Number.isFinite(price) || price < 0) {
        console.error("Dados do produto inválidos.");
        return;
    }

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            id,
            name,
            price,
            quantity: 1
        });
    }

    saveCart();

    openCart();
}

// =====================================
// ALTERAR QUANTIDADE
// =====================================

function changeQuantity(id, amount) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        cart = cart.filter(item => item.id !== id);

    }

    saveCart();
}

// =====================================
// REMOVER PRODUTO
// =====================================

function removeProduct(id) {

    cart = cart.filter(item => item.id !== id);

    saveCart();
}

// =====================================
// ATUALIZAR CARRINHO
// =====================================

function renderCart() {

    const container = document.getElementById("cartItems");
    const countElement = document.getElementById("cartCount");
    const subtitle = document.getElementById("cartSubtitle");
    const totalElement = document.getElementById("cartTotal");
    const checkout = document.getElementById("checkoutBtn");

    if (!container) return;

    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    if (countElement) countElement.textContent = count;

    if (subtitle) {
        subtitle.textContent = `${count} produtos selecionados`;
    }

    if (totalElement) {
        totalElement.textContent =
            total.toFixed(2).replace(".", ",") + " €";
    }

    if (checkout) {
        checkout.disabled = count === 0;
    }

    container.replaceChildren();

    // Carrinho vazio

    if (cart.length === 0) {

        const empty = document.createElement("p");

        empty.className = "empty-cart";

        empty.textContent = "O teu carrinho está vazio ♡";

        container.appendChild(empty);

        return;
    }

    // Mostrar produtos

    cart.forEach(item => {

        const product = document.createElement("div");

        product.className = "cart-product";

        const info = document.createElement("div");

        const name = document.createElement("h4");

        name.textContent = item.name;

        const price = document.createElement("p");

        price.textContent =
            (item.price * item.quantity)
            .toFixed(2)
            .replace(".", ",") + " €";

        const actions = document.createElement("div");

        actions.className = "cart-actions";

        // Diminuir quantidade

        const minus = document.createElement("button");

        minus.textContent = "−";

        minus.onclick = () => changeQuantity(item.id, -1);

        // Quantidade

        const quantity = document.createElement("span");

        quantity.textContent = item.quantity;

        // Aumentar quantidade

        const plus = document.createElement("button");

        plus.textContent = "+";

        plus.onclick = () => changeQuantity(item.id, 1);

        // Remover produto

        const remove = document.createElement("button");

        remove.textContent = "Remover";

        remove.className = "remove-product";

        remove.onclick = () => removeProduct(item.id);

        actions.append(minus, quantity, plus, remove);

        info.append(name, price, actions);

        product.appendChild(info);

        container.appendChild(product);

    });
}

// =====================================
// BOTÕES DOS PRODUTOS
// =====================================

document.querySelectorAll("[data-add-cart]").forEach(button => {

    button.addEventListener("click", () => {

        addToCart(
            button.dataset.id,
            button.dataset.name,
            Number(button.dataset.price)
        );

    });

});

// =====================================
// FINALIZAR COMPRA
// =====================================

document.getElementById("checkoutBtn")?.addEventListener("click", () => {

    if (cart.length === 0) return;

    alert("O checkout ainda precisa de ser configurado!");

});

// =====================================
// INICIALIZAR CARRINHO
// =====================================

renderCart();
