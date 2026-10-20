// =========================================================
// js/ui/shop.js — Sistema Multi-Tienda RPG (Dario, Boros, Elena, Corvus)
// =========================================================

const shopModal = document.getElementById('shop-modal');
const shopItemsList = document.getElementById('shop-items-list');
const shopPlayerEssence = document.getElementById('shop-player-essence');
const shopFeedbackMsg = document.getElementById('shop-feedback-msg');
const btnCloseShop = document.getElementById('btn-close-shop');

let shopInventoryState = {};
let currentActiveMerchant = 'dario';

function isShopOpen() {
  return shopModal && !shopModal.classList.contains('hidden');
}

function openShop(merchantKey = 'dario') {
  currentActiveMerchant = merchantKey;
  const config = MERCHANTS_CONFIG[merchantKey] || MERCHANTS_CONFIG.dario;

  const titleEl = document.querySelector('.shop-header h3');
  const subEl = document.querySelector('.shop-subtitle');
  const portraitEl = document.querySelector('.shop-portrait');

  if (titleEl) titleEl.textContent = config.name;
  if (subEl) subEl.textContent = config.subtitle;
  if (portraitEl) portraitEl.style.backgroundImage = config.portrait;

  shopModal.classList.remove('hidden');
  isPaused = true;
  updateShopUI();
}

function closeShop() {
  if (!shopModal) return;
  shopModal.classList.add('hidden');
  isPaused = false;
  if (typeof keys !== 'undefined') {
    keys['e'] = false;
    keys['escape'] = false;
  }
  if (typeof clearJustPressed === 'function') {
    clearJustPressed();
  }
}

function showShopFeedback(msg, isError = false) {
  if (!shopFeedbackMsg) return;
  shopFeedbackMsg.textContent = msg;
  shopFeedbackMsg.className = 'shop-alert-msg' + (isError ? '' : ' success');
  if (shopPlayerEssence) shopPlayerEssence.classList.add('shake');
  setTimeout(() => {
    shopFeedbackMsg.classList.add('hidden');
    if (shopPlayerEssence) shopPlayerEssence.classList.remove('shake');
  }, 1800);
}

function updateShopUI() {
  if (!shopItemsList) return;
  const config = MERCHANTS_CONFIG[currentActiveMerchant] || MERCHANTS_CONFIG.dario;
  if (shopPlayerEssence) shopPlayerEssence.textContent = `♦ Tu Esencia: ${player.essence}`;
  shopItemsList.innerHTML = '';

  config.items.forEach(item => {
    const isSoldOut = !!shopInventoryState[item.id];
    const row = document.createElement('div');
    row.className = 'shop-item-row';
    row.innerHTML = `
      <div class="shop-item-info">
        <div class="shop-item-icon">${item.icon}</div>
        <div class="shop-item-text">
          <h4>${item.name}</h4>
          <p>${item.desc}</p>
        </div>
      </div>
      <button class="shop-buy-btn ${isSoldOut ? 'bought' : ''}" ${isSoldOut ? 'disabled' : ''}>
        ${isSoldOut ? 'AGOTADO' : `${item.cost} ♦`}
      </button>
    `;

    const buyBtn = row.querySelector('.shop-buy-btn');
    if (!isSoldOut) {
      buyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (player.essence >= item.cost) {
          player.essence -= item.cost;
          const isUnique = item.buy();
          if (isUnique) shopInventoryState[item.id] = true;
          updateShopUI();
          saveProgress();
          showShopFeedback('¡Adquirido con éxito!', false);
        } else {
          showShopFeedback(`Requiere ${item.cost} ♦ de Esencia`, true);
          sfx('hit');
        }
      });
    }
    shopItemsList.appendChild(row);
  });
}

// Cierre mediante botón
if (btnCloseShop) {
  btnCloseShop.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeShop();
  });
}

// Cierre haciendo clic en el fondo exterior (backdrop)
if (shopModal) {
  shopModal.addEventListener('click', (e) => {
    if (e.target === shopModal) {
      closeShop();
    }
  });
}

// Interceptor directo en fase de captura para ESC y E
window.addEventListener('keydown', (e) => {
  if (!isShopOpen()) return;
  const k = e.key.toLowerCase();
  if (k === 'escape' || k === 'e') {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    closeShop();
  }
}, true);
