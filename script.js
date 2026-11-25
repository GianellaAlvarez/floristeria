(() => {
  // Teléfono de la florería en formato internacional SIN '+' ni espacios
  const WHATSAPP_PHONE = "34684608226";
  const SHIPPING_COST = 4.5;
  const STORAGE_KEY = "brisa_botanica_cart_v1";

  const CATEGORY_LABELS = {
    ramos: "Ramos frescos",
    preservados: "Flor preservada",
    plantas: "Plantas y macetas"
  };

  // Catálogo enriquecido con detalles botánicos y cuidados para Vista Rápida
  const PRODUCTS = [
    {
      id: "silvestre-primavera",
      name: "Ramo Silvestre Brisa",
      category: "ramos",
      badge: "Más pedido",
      description: "Eucalipto cinerea, rosas de jardín, paniculata y flor silvestre fresca del día.",
      stems: "Rosas ramificadas crema, eucalipto fresco, astrantia y flor de cera.",
      care: "Corta 2 cm los tallos en diagonal y cambia el agua fresca cada 48 horas lejos del sol directo.",
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=800&q=80",
      sizes: [
        { label: "S · 12 tallos", price: 34.0 },
        { label: "M · 20 tallos", price: 46.0 },
        { label: "L · 30 tallos", price: 62.0 }
      ]
    },
    {
      id: "peonias-lino",
      name: "Peonías y Lino Blanco",
      category: "ramos",
      badge: "Temporada",
      description: "Composición delicada en tonos crema y empolvados envuelta en papel de algodón.",
      stems: "Peonías Sarah Bernhardt, lisianthus blanco, ruscus y espigas de lino natural.",
      care: "Usa un jarrón limpio con agua templada; los capullos abrirán por completo en 24 horas.",
      image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80",
      sizes: [
        { label: "S · 10 tallos", price: 38.0 },
        { label: "M · 16 tallos", price: 52.0 },
        { label: "L · 24 tallos", price: 68.0 }
      ]
    },
    {
      id: "sol-terracota",
      name: "Sol de Terracota",
      category: "ramos",
      badge: "Nuevo",
      description: "Tonos cálidos con gerberas, craspedias, clavel antiguo y verde aromático.",
      stems: "Clavel color teja, craspedia amarilla, margarita silvestre y hoja de olivo.",
      care: "Llena el jarrón solo hasta un tercio de su altura y retira las hojas que toquen el agua.",
      image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80",
      sizes: [
        { label: "S · 12 tallos", price: 32.0 },
        { label: "M · 20 tallos", price: 44.0 },
        { label: "L · 28 tallos", price: 58.0 }
      ]
    },
    {
      id: "centro-preservado",
      name: "Centro Eterno de Lavanda",
      category: "preservados",
      badge: "Dura años",
      description: "Flor natural preservada que no necesita agua: hortensia, lavanda y espigas.",
      stems: "Hortensia preservada, lavanda aromática, phalaris y jarrón de cerámica incluido.",
      care: "No requiere agua ni luz solar directa. Limpia el polvo suavemente con aire frío.",
      image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=800&q=80",
      sizes: [
        { label: "Con jarrón S", price: 42.0 },
        { label: "Con jarrón M", price: 56.0 }
      ]
    },
    {
      id: "corona-seca",
      name: "Corona Botánica de Pared",
      category: "preservados",
      badge: "Hecho a mano",
      description: "Aro de mimbre trenzado a mano con eucalipto preservado y flores secas.",
      stems: "Base natural de mimbre, eucalipto populus, gypsophila preservada y cinta de lino.",
      care: "Ideal para puertas interiores o paredes luminosas sin humedad excesiva.",
      image: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=800&q=80",
      sizes: [
        { label: "30 cm", price: 39.0 },
        { label: "45 cm", price: 54.0 }
      ]
    },
    {
      id: "monstera-ceramica",
      name: "Monstera en Cerámica",
      category: "plantas",
      badge: "Interior",
      description: "Planta purificadora de fácil cuidado entregada en maceta artesanal mate.",
      stems: "Monstera deliciosa seleccionada en vivero + cubre-maceta de gres con drenaje.",
      care: "Luz indirecta abundante y riego moderado cuando los primeros 3 cm de tierra estén secos.",
      image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
      sizes: [
        { label: "Mediana 45 cm", price: 36.0 },
        { label: "Grande 75 cm", price: 59.0 }
      ]
    }
  ];

  // Estado
  let cart = loadCart();
  let selectedCategory = "todos";
  let deliveryMethod = "Envío a domicilio";
  let activeQuickViewId = null;
  const selectedSizes = {};
  PRODUCTS.forEach((p) => {
    selectedSizes[p.id] = 0;
  });

  // Elementos DOM
  const productsGrid = document.getElementById("products-grid");
  const cartDrawer = document.getElementById("cart-drawer");
  const drawerBackdrop = document.getElementById("drawer-backdrop");
  const cartItemsEl = document.getElementById("cart-items");
  const cartCountEl = document.getElementById("cart-count");
  const cartSubtotalEl = document.getElementById("cart-subtotal");
  const cartShippingEl = document.getElementById("cart-shipping");
  const cartTotalEl = document.getElementById("cart-total");
  const floatingCartBtn = document.getElementById("floating-cart-btn");
  const floatingTotalEl = document.getElementById("floating-total");
  const toastEl = document.getElementById("toast");
  const openCartBtn = document.getElementById("open-cart");

  // Modal Quick View
  const qvModal = document.getElementById("qv-modal");
  const qvBackdrop = document.getElementById("qv-backdrop");
  const qvSizesEl = document.getElementById("qv-sizes");
  const qvPriceEl = document.getElementById("qv-price");
  const qvAddBtn = document.getElementById("qv-add-btn");

  function formatEuro(amount) {
    return amount.toFixed(2).replace(".", ",") + " €";
  }

  function loadCart() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignora si el almacenamiento está bloqueado
    }
  }

  function showToast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2200);
  }

  // =========================================================
  // EFECTOS ATMOSFÉRICOS Y ANIMACIONES
  // =========================================================

  function initScrollAndAmbientEffects() {
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    document.body.appendChild(progressBar);

    const heroImg = document.querySelector(".showcase-frame img");
    const sealEl = document.getElementById("botanical-seal");
    const heroSection = document.querySelector(".hero");
    const orbSage = document.querySelector(".orb-sage");
    const orbTerra = document.querySelector(".orb-terracotta");

    window.addEventListener(
      "scroll",
      () => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;

        if (heroImg && scrollTop < 750) {
          heroImg.style.transform = `scale(1.06) translateY(${scrollTop * 0.05}px)`;
        }

        if (sealEl && scrollTop < 800) {
          sealEl.style.transform = `rotate(${scrollTop * 0.14}deg)`;
        }
      },
      { passive: true }
    );

    // Movimiento orgánico de los halos difuminados con el puntero
    heroSection?.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      if (orbSage) {
        orbSage.style.transform = `translate(${nx * 36}px, ${ny * 28}px)`;
      }
      if (orbTerra) {
        orbTerra.style.transform = `translate(${nx * -32}px, ${ny * -24}px)`;
      }
    });
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => {
          entry.target.classList.add("is-visible");
        }, index * 70);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  function observeRevealElements(root = document) {
    const targets = root.querySelectorAll(
      ".hero-copy, .hero-showcase, .catalog-header, .step-card, .studio-image, .studio-info, .product-card"
    );
    targets.forEach((el) => {
      if (!el.classList.contains("reveal-up")) {
        el.classList.add("reveal-up");
        revealObserver.observe(el);
      }
    });
  }

  function attachInteractiveMotion(elements) {
    elements.forEach((card) => {
      if (card.dataset.motionBound === "true") return;
      card.dataset.motionBound = "true";

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

        const rotateX = ((y / rect.height) - 0.5) * -5;
        const rotateY = ((x / rect.width) - 0.5) * 5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  function animateFlyToCart(sourceBtn) {
    if (!sourceBtn || !openCartBtn) return;

    const startRect = sourceBtn.getBoundingClientRect();
    const endRect = openCartBtn.getBoundingClientRect();

    const dot = document.createElement("span");
    dot.className = "fly-dot";

    const startX = startRect.left + startRect.width / 2 - 7;
    const startY = startRect.top + startRect.height / 2 - 7;
    dot.style.left = `${startX}px`;
    dot.style.top = `${startY}px`;
    document.body.appendChild(dot);

    const deltaX = endRect.left + endRect.width / 2 - startX;
    const deltaY = endRect.top + endRect.height / 2 - startY;

    requestAnimationFrame(() => {
      dot.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.35)`;
      dot.style.opacity = "0.2";
    });

    setTimeout(() => {
      dot.remove();
      if (cartCountEl) {
        cartCountEl.classList.remove("bump");
        void cartCountEl.offsetWidth;
        cartCountEl.classList.add("bump");
      }
    }, 620);
  }

  function initHeroCounter() {
    const metricStrong = document.querySelector(".hero-metrics div:nth-child(2) strong");
    if (!metricStrong) return;

    const duration = 1100;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      metricStrong.textContent = `${Math.round(eased * 100)} %`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  // =========================================================
  // VISTA RÁPIDA (QUICK VIEW)
  // =========================================================

  function openQuickView(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product || !qvModal) return;

    activeQuickViewId = productId;
    const sizeIdx = selectedSizes[productId] || 0;
    const currentSize = product.sizes[sizeIdx];

    document.getElementById("qv-img").src = product.image;
    document.getElementById("qv-img").alt = product.name;
    document.getElementById("qv-badge").textContent = product.badge;
    document.getElementById("qv-cat").textContent = CATEGORY_LABELS[product.category] || "";
    document.getElementById("qv-title").textContent = product.name;
    document.getElementById("qv-desc").textContent = product.description;
    document.getElementById("qv-stems").textContent = product.stems;
    document.getElementById("qv-care").textContent = product.care;
    if (qvPriceEl) qvPriceEl.textContent = formatEuro(currentSize.price);

    renderQuickViewSizes(product);

    qvModal.classList.add("open");
    qvBackdrop?.classList.add("open");
    qvModal.setAttribute("aria-hidden", "false");
  }

  function renderQuickViewSizes(product) {
    if (!qvSizesEl) return;
    const sizeIdx = selectedSizes[product.id] || 0;
    qvSizesEl.innerHTML = product.sizes
      .map(
        (s, idx) => `
        <button
          type="button"
          class="size-option ${idx === sizeIdx ? "active" : ""}"
          data-qv-size-idx="${idx}"
        >
          ${s.label}
        </button>
      `
      )
      .join("");
  }

  function closeQuickView() {
    qvModal?.classList.remove("open");
    qvBackdrop?.classList.remove("open");
    qvModal?.setAttribute("aria-hidden", "true");
    activeQuickViewId = null;
  }

  qvSizesEl?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-qv-size-idx]");
    if (!btn || !activeQuickViewId) return;

    const idx = Number(btn.getAttribute("data-qv-size-idx"));
    selectedSizes[activeQuickViewId] = idx;

    const product = PRODUCTS.find((p) => p.id === activeQuickViewId);
    if (product && qvPriceEl) {
      qvPriceEl.textContent = formatEuro(product.sizes[idx].price);
      renderQuickViewSizes(product);
      renderProducts(false);
    }
  });

  qvAddBtn?.addEventListener("click", () => {
    if (!activeQuickViewId) return;
    addToCart(activeQuickViewId, qvAddBtn);
    closeQuickView();
  });

  document.getElementById("qv-close")?.addEventListener("click", closeQuickView);
  qvBackdrop?.addEventListener("click", closeQuickView);

  // =========================================================
  // CATÁLOGO Y CARRITO
  // =========================================================

  function renderProducts(animateFilter = false) {
    if (!productsGrid) return;

    const filtered =
      selectedCategory === "todos"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === selectedCategory);

    productsGrid.innerHTML = filtered
      .map((product, index) => {
        const sizeIdx = selectedSizes[product.id] || 0;
        const currentSize = product.sizes[sizeIdx];

        const sizeButtons = product.sizes
          .map(
            (s, idx) => `
            <button
              type="button"
              class="size-option ${idx === sizeIdx ? "active" : ""}"
              data-product-id="${product.id}"
              data-size-idx="${idx}"
            >
              ${s.label}
            </button>
          `
          )
          .join("");

        return `
          <article
            class="product-card ${animateFilter ? "filter-enter" : ""}"
            style="${animateFilter ? `animation-delay: ${index * 55}ms` : ""}"
          >
            <div class="product-media" data-qv-id="${product.id}" title="Ver ficha y cuidados">
              <img src="${product.image}" alt="${product.name}" loading="lazy" />
              <span class="product-badge">${product.badge}</span>
              <span class="quick-view-hint">Ver detalle</span>
            </div>
            <div class="product-body">
              <div class="product-head">
                <h3>${product.name}</h3>
                <span class="product-price">${formatEuro(currentSize.price)}</span>
              </div>
              <p class="product-desc">${product.description}</p>
              <div class="size-selector">${sizeButtons}</div>
              <button type="button" class="add-to-cart-btn" data-add-id="${product.id}">
                Añadir a la cesta
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    const cards = productsGrid.querySelectorAll(".product-card");
    attachInteractiveMotion(cards);
    if (!animateFilter) {
      observeRevealElements(productsGrid);
    }
  }

  function addToCart(productId, triggerBtn = null) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const sizeIdx = selectedSizes[productId] || 0;
    const sizeObj = product.sizes[sizeIdx];
    const key = `${product.id}__${sizeObj.label}`;

    const existing = cart.find((item) => item.key === key);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        key,
        id: product.id,
        name: product.name,
        size: sizeObj.label,
        price: sizeObj.price,
        image: product.image,
        qty: 1
      });
    }

    saveCart();
    renderCart();
    animateFlyToCart(triggerBtn);
    showToast(`Añadido: ${product.name} (${sizeObj.label})`);
  }

  function renderCart() {
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping =
      totalItems === 0 || deliveryMethod === "Recogida en taller" ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    if (cartCountEl) cartCountEl.textContent = String(totalItems);
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatEuro(subtotal);
    if (cartShippingEl) {
      cartShippingEl.textContent =
        deliveryMethod === "Recogida en taller" ? "Gratis (Taller)" : formatEuro(shipping);
    }
    if (cartTotalEl) cartTotalEl.textContent = formatEuro(total);

    if (floatingCartBtn && floatingTotalEl) {
      floatingTotalEl.textContent = `${totalItems} · ${formatEuro(total)}`;
      floatingCartBtn.classList.toggle("visible", totalItems > 0);
    }

    if (!cartItemsEl) return;

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `
        <div class="empty-cart-box">
          <p>Tu cesta está vacía. Elige un ramo o planta del catálogo para empezar tu pedido.</p>
        </div>
      `;
      return;
    }

    cartItemsEl.innerHTML = cart
      .map(
        (item) => `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <span class="cart-item-meta">${item.size} · ${formatEuro(item.price)} ud.</span>
            <div class="qty-controls">
              <button type="button" class="qty-btn" data-qty-key="${item.key}" data-delta="-1" aria-label="Restar">−</button>
              <span>${item.qty}</span>
              <button type="button" class="qty-btn" data-qty-key="${item.key}" data-delta="1" aria-label="Sumar">+</button>
            </div>
          </div>
          <div class="cart-item-right">
            <strong>${formatEuro(item.price * item.qty)}</strong>
            <button type="button" class="remove-item-btn" data-remove-key="${item.key}">Quitar</button>
          </div>
        </div>
      `
      )
      .join("");
  }

  function openDrawer() {
    cartDrawer?.classList.add("open");
    drawerBackdrop?.classList.add("open");
    cartDrawer?.setAttribute("aria-hidden", "false");
  }

  function closeDrawer() {
    cartDrawer?.classList.remove("open");
    drawerBackdrop?.classList.remove("open");
    cartDrawer?.setAttribute("aria-hidden", "true");
  }

  productsGrid?.addEventListener("click", (e) => {
    const mediaBox = e.target.closest("[data-qv-id]");
    if (mediaBox) {
      openQuickView(mediaBox.getAttribute("data-qv-id"));
      return;
    }

    const sizeBtn = e.target.closest(".size-option");
    if (sizeBtn) {
      const pId = sizeBtn.getAttribute("data-product-id");
      const sIdx = Number(sizeBtn.getAttribute("data-size-idx"));
      selectedSizes[pId] = sIdx;
      renderProducts(false);
      return;
    }

    const addBtn = e.target.closest(".add-to-cart-btn");
    if (addBtn) {
      addToCart(addBtn.getAttribute("data-add-id"), addBtn);
    }
  });

  document.querySelectorAll(".cat-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCategory = btn.getAttribute("data-category") || "todos";
      renderProducts(true);
    });
  });

  cartItemsEl?.addEventListener("click", (e) => {
    const qtyBtn = e.target.closest(".qty-btn");
    if (qtyBtn) {
      const key = qtyBtn.getAttribute("data-qty-key");
      const delta = Number(qtyBtn.getAttribute("data-delta"));
      const item = cart.find((i) => i.key === key);
      if (!item) return;

      item.qty += delta;
      if (item.qty <= 0) {
        cart = cart.filter((i) => i.key !== key);
      }
      saveCart();
      renderCart();
      return;
    }

    const removeBtn = e.target.closest(".remove-item-btn");
    if (removeBtn) {
      const key = removeBtn.getAttribute("data-remove-key");
      cart = cart.filter((i) => i.key !== key);
      saveCart();
      renderCart();
    }
  });

  const addressField = document.getElementById("address-field");
  document.querySelectorAll(".del-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".del-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      deliveryMethod = btn.getAttribute("data-delivery") || "Envío a domicilio";
      if (addressField) {
        addressField.style.display =
          deliveryMethod === "Recogida en taller" ? "none" : "flex";
      }
      renderCart();
    });
  });

  const checkoutForm = document.getElementById("checkout-form");
  const checkoutError = document.getElementById("checkout-error");

  checkoutForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (checkoutError) checkoutError.textContent = "";

    if (cart.length === 0) {
      if (checkoutError) {
        checkoutError.textContent = "Añade al menos un ramo o planta antes de enviar el pedido.";
      }
      return;
    }

    const name = document.getElementById("cust-name")?.value.trim() || "";
    const address = document.getElementById("cust-address")?.value.trim() || "";
    const date = document.getElementById("cust-date")?.value || "";
    const payment = document.getElementById("cust-payment")?.value || "";
    const cardMsg = document.getElementById("cust-card")?.value.trim() || "Sin tarjeta";

    if (!name || !date) {
      if (checkoutError) {
        checkoutError.textContent = "Por favor, indica tu nombre y la fecha de entrega.";
      }
      return;
    }

    if (deliveryMethod === "Envío a domicilio" && !address) {
      if (checkoutError) {
        checkoutError.textContent = "Indica la dirección para el envío a domicilio.";
      }
      return;
    }

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = deliveryMethod === "Recogida en taller" ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    const productLines = cart.map(
      (item) =>
        `- ${item.qty}x ${item.name} (${item.size}) = ${formatEuro(item.price * item.qty)}`
    );

    const messageLines = [
      "*NUEVO PEDIDO WEB - TALLER BOTANICO BRISA*",
      "----------------------------------------",
      `*Cliente:* ${name}`,
      `*Modalidad:* ${deliveryMethod}`,
      deliveryMethod === "Envío a domicilio" ? `*Direccion:* ${address}` : null,
      `*Fecha:* ${date}`,
      `*Pago:* ${payment}`,
      `*Dedicatoria:* ${cardMsg}`,
      "----------------------------------------",
      "*Productos:*",
      ...productLines,
      "----------------------------------------",
      `*Subtotal:* ${formatEuro(subtotal)}`,
      `*Entrega:* ${shipping === 0 ? "Gratis (Taller)" : formatEuro(shipping)}`,
      `*TOTAL ESTIMADO:* ${formatEuro(total)}`
    ].filter(Boolean);

    const fullMessage = messageLines.join("\n");
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(fullMessage)}`;

    const win = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!win) {
      window.location.assign(whatsappUrl);
    }
  });

  openCartBtn?.addEventListener("click", openDrawer);
  floatingCartBtn?.addEventListener("click", openDrawer);
  document.getElementById("close-cart")?.addEventListener("click", closeDrawer);
  drawerBackdrop?.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeQuickView();
      closeDrawer();
    }
  });

  const mobileToggle = document.getElementById("mobile-toggle");
  const navLinks = document.getElementById("nav-links");
  mobileToggle?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  const dateInput = document.getElementById("cust-date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  // Inicializar vista y efectos
  initScrollAndAmbientEffects();
  initHeroCounter();
  renderProducts(false);
  renderCart();
  observeRevealElements(document);
  attachInteractiveMotion(document.querySelectorAll(".step-card, .showcase-frame"));
})();   