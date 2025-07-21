// Exchange rates (mock data - in real app, these would come from an API)
const exchangeRates = {
    'BTC': {
        'ETH': 30.78897,
        'BTC': 1,
        'USDT': 65432.50,
        'USDC': 65432.50,
        'SOL': 652.45,
        'BNB': 142.35
    },
    'ETH': {
        'BTC': 0.0325,
        'ETH': 1,
        'USDT': 2125.50,
        'USDC': 2125.50,
        'SOL': 21.18,
        'BNB': 4.62
    },
    'USDT': {
        'BTC': 0.0000153,
        'ETH': 0.000471,
        'USDT': 1,
        'USDC': 1,
        'SOL': 0.00997,
        'BNB': 0.00217
    },
    'USDC': {
        'BTC': 0.0000153,
        'ETH': 0.000471,
        'USDT': 1,
        'USDC': 1,
        'SOL': 0.00997,
        'BNB': 0.00217
    },
    'SOL': {
        'BTC': 0.00153,
        'ETH': 0.0472,
        'USDT': 100.25,
        'USDC': 100.25,
        'SOL': 1,
        'BNB': 0.218
    },
    'BNB': {
        'BTC': 0.00703,
        'ETH': 0.217,
        'USDT': 460.25,
        'USDC': 460.25,
        'SOL': 4.59,
        'BNB': 1
    }
};

// DOM Elements
const sendAmountInput = document.querySelector('.input-group:first-child .amount-input');
const receiveAmountInput = document.querySelector('.input-group:last-child .amount-input');
const exchangeRateText = document.querySelector('.exchange-rate span');
const refreshBtn = document.querySelector('.refresh-btn');
const exploreBtn = document.querySelector('.explore-btn');
const acceptBtn = document.querySelector('.accept-btn');
const cookieNotice = document.querySelector('.cookie-notice');
const tabs = document.querySelectorAll('.tab');

// Current currencies
let sendCurrency = 'BTC';
let receiveCurrency = 'ETH';

// Calculate exchange
function calculateExchange() {
    const sendAmount = parseFloat(sendAmountInput.value) || 0;
    const rate = exchangeRates[sendCurrency][receiveCurrency];
    const receiveAmount = sendAmount * rate;
    
    receiveAmountInput.value = receiveAmount.toFixed(7);
    exchangeRateText.textContent = `Estimated rate: 1 ${sendCurrency} ≈ ${rate} ${receiveCurrency}`;
}

// Update exchange rate with animation
function refreshRate() {
    refreshBtn.style.transform = 'rotate(360deg)';
    
    // Simulate rate update (in real app, this would fetch new rates)
    setTimeout(() => {
        // Add slight variation to rates
        const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
        const currentRate = exchangeRates[sendCurrency][receiveCurrency];
        exchangeRates[sendCurrency][receiveCurrency] = currentRate * (1 + variation);
        
        calculateExchange();
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 100);
    }, 400);
}

// Tab switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Accept cookies
acceptBtn.addEventListener('click', () => {
    cookieNotice.style.display = 'none';
    localStorage.setItem('cookiesAccepted', 'true');
});

// Check if cookies already accepted
if (localStorage.getItem('cookiesAccepted') === 'true') {
    cookieNotice.style.display = 'none';
}

// Explore button click
exploreBtn.addEventListener('click', () => {
    // Animate button press
    exploreBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        exploreBtn.style.transform = 'scale(1)';
        // In real app, this would proceed to next step
        alert(`Exchange ${sendAmountInput.value} ${sendCurrency} to ${receiveAmountInput.value} ${receiveCurrency}`);
    }, 100);
});

// Input handling
sendAmountInput.addEventListener('input', calculateExchange);

// Refresh button
refreshBtn.addEventListener('click', refreshRate);

// Currency selector clicks (in real app, these would open dropdown menus)
document.querySelectorAll('.currency-selector').forEach(selector => {
    selector.addEventListener('click', () => {
        // Add visual feedback
        selector.style.backgroundColor = '#5a5a65';
        setTimeout(() => {
            selector.style.backgroundColor = '';
        }, 200);
    });
});

// Initialize
calculateExchange();

// Auto-refresh rates every 30 seconds
setInterval(refreshRate, 30000);

// Add number formatting for better UX
sendAmountInput.addEventListener('blur', function() {
    if (this.value && !isNaN(this.value)) {
        const num = parseFloat(this.value);
        if (num >= 1) {
            this.value = num.toFixed(2);
        } else {
            this.value = num.toFixed(6);
        }
        calculateExchange();
    }
});

// Prevent negative numbers
sendAmountInput.addEventListener('keydown', function(e) {
    if (e.key === '-' || e.key === '+') {
        e.preventDefault();
    }
});

// Add visual loading state
function showLoading() {
    exploreBtn.textContent = 'Processing...';
    exploreBtn.disabled = true;
}

function hideLoading() {
    exploreBtn.textContent = 'Explore';
    exploreBtn.disabled = false;
}

