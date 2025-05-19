const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItensContainer = document.getElementById("cart-itens")
const checkOutBtn = document.getElementById("checkout-btn")
const cartTotal = document.getElementById("cart-total")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const spanIten = document.getElementById("date-span")

let cart = []
//Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal()
  cartModal.style.display = "flex"
})

//Fechar o modal do cariinho
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none"
  }
})

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-cart-btn")

  if (parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    const alert =  Toastify({
      text: "PRODUTO ADICIONADO NO CARRINHO 😀",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#1DA824",
      },
    }).showToast();


    addToCart(name, price, alert)
  }
})

//função a para adicionar no carrinho
function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name)

  if (existingItem) {
    existingItem.quantity += 1;
  } else {

    cart.push({
      name,
      price,
      quantity: 1,
    })
  }

  updateCartModal()

}

function updateCartModal() {
  cartItensContainer.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const cartItensElements = document.createElement("div");
    cartItensElements.classList.add("flex", "judstify-between", "mb-4", "flex-col")

    cartItensElements.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium ">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2 ">R$ ${item.price.toFixed(2)}</p>
        </div>

        <button class="remove-btn" data-name="${item.name}">
          Remover
        </button>
        
      </div>
    `
    total += item.price * item.quantity

    cartItensContainer.appendChild(cartItensElements)

  })

  cartTotal.textContent = total.toLocaleString("pt-Br", {
    style: "currency",
    currency: "BRL"
  });

  cartCounter.innerHTML = cart.length;

}

cartItensContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    const name = event.target.getAttribute("data-name")

    removeItemCart(name);
  }

})

function removeItemCart(name) {
  const index = cart.findIndex(item => item.name === name);

  if (index !== -1) {
    const item = cart[index];

    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }

})

checkOutBtn.addEventListener("click", function () {

  const isOpen = checkRestaurantIsOpen();
  if (!isOpen) {

    Toastify({
      text: "O GORDIN BURGER NÃO ESTA FUNCIONDO NO MONENTO! 😪",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      },
    }).showToast();

    return;
  }

  if (cart.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }

  const cartItems = cart.map((item) => {
    return (
      ` ${item.name}
        Qtd: (${item.quantity})
        Preço:  R$ ${item.price} |`
    )
  }).join("")

  const messege = encodeURIComponent(cartItems)
  const phone = "21999780979"

  window.open(`https://wa.me/${phone}?text=${messege} Endereço: ${addressInput.value}`, "_blank")

  cart = [];
  updateCartModal();



})

function checkRestaurantIsOpen() {
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 24;
}

const isOpen = checkRestaurantIsOpen();

if (isOpen) {
  spanIten.classList.remove("bg-red-500");
  spanIten.classList.add("bg-green-600")
} else {
  spanIten.classList.remove("bg-green-600");
  spanIten.classList.add("bg-red-500")
}

