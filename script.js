
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
let cart = JSON.parse(localStorage.getItem("glowlyCart") || "[]");

const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("cartOverlay");

function openCart() {
  drawer.classList.add("active");
  overlay.classList.add("active");
}

function closeCart() {
  drawer.classList.remove("active");
  overlay.classList.remove("active");
}

document.getElementById("openCart").onclick = openCart;
document.getElementById("closeCart").onclick = closeCart;
overlay.onclick = closeCart;

function saveCart() {
  localStorage.setItem("glowlyCart", JSON.stringify(cart));
  renderCart();
}

function addToCart(id, name, price) {
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

function changeQuantity(id, amount) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart();
}

function removeProduct(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const count = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartSubtitle").textContent =
    `${count} produtos selecionados`;

  document.getElementById("cartTotal").textContent =
    total.toFixed(2).replace(".", ",") + " €";

  document.getElementById("checkoutBtn").disabled = count === 0;

  container.replaceChildren();

  if (cart.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-cart";
    empty.textContent = "O teu carrinho está vazio ♡";
    container.appendChild(empty);
    return;
  }

  cart.forEach(item => {
    const product = document.createElement("div");
    product.className = "cart-product";

    const info = document.createElement("div");
    const name = document.createElement("h4");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent =
      (item.price * item.quantity).toFixed(2)
        .replace(".", ",") + " €";

    const actions = document.createElement("div");
    actions.className = "cart-actions";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.onclick = () => changeQuantity(item.id, -1);

    const quantity = document.createElement("span");
    quantity.textContent = item.quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.onclick = () => changeQuantity(item.id, 1);

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

// Botões dos produtos
document.querySelectorAll("[data-add-cart]").forEach(button => {
  button.addEventListener("click", () => {
    addToCart(
      button.dataset.id,
      button.dataset.name,
      Number(button.dataset.price)
    );
  });
});

// Checkout demonstrativo
document.getElementById("checkoutBtn").onclick = () => {
  alert("O checkout ainda precisa de ser configurado!");
};

renderCart();