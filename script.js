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
const sendAmountInput = document.querySelector('.amount-input:not(.receive-amount)');
const receiveAmountInput = document.querySelector('.receive-amount');
const exchangeRateText = document.querySelector('.exchange-rate span');
const refreshBtn = document.querySelector('.refresh-btn');
const exploreBtn = document.querySelector('.explore-btn');
const acceptBtn = document.querySelector('.accept-btn');
const cookieNotice = document.querySelector('.cookie-notice');
const tabs = document.querySelectorAll('.tab');

// Current currencies
let sendCurrency = 'BTC';
let receiveCurrency = 'ETH';

// Store previous rate for comparison
let previousRate = null;

// Calculate exchange
function calculateExchange() {
    const sendAmount = parseFloat(sendAmountInput.value) || 0;
    const rate = exchangeRates[sendCurrency][receiveCurrency];
    const receiveAmount = sendAmount * rate;
    
    receiveAmountInput.value = receiveAmount.toFixed(7);
    
    // Update rate display with trend indicator
    const rateDisplay = document.querySelector('.exchange-rate span');
    let trendIndicator = '';
    let trendClass = '';
    
    if (previousRate !== null) {
        if (rate > previousRate) {
            trendIndicator = ' ↑';
            trendClass = 'rate-up';
        } else if (rate < previousRate) {
            trendIndicator = ' ↓';
            trendClass = 'rate-down';
        }
    }
    
    rateDisplay.innerHTML = `Estimated rate: 1 ${sendCurrency} ≈ ${rate.toFixed(5)} ${receiveCurrency}<span class="${trendClass}">${trendIndicator}</span>`;
    previousRate = rate;
}

// Update exchange rate with animation
function refreshRate() {
    refreshBtn.style.transform = 'rotate(360deg)';
    
    // Simulate rate update (in real app, this would fetch new rates)
    setTimeout(() => {
        // Update all exchange rates with realistic variations
        updateAllRates();
        calculateExchange();
        
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 100);
    }, 400);
}

// Update all exchange rates with realistic market movements
function updateAllRates() {
    const currencies = ['BTC', 'ETH', 'USDT', 'USDC', 'SOL', 'BNB'];
    
    currencies.forEach(fromCurrency => {
        currencies.forEach(toCurrency => {
            if (fromCurrency !== toCurrency) {
                // Different volatility for different pairs
                let volatility = 0.001; // 0.1% default
                
                // Stablecoins have minimal volatility against each other
                if ((fromCurrency === 'USDT' || fromCurrency === 'USDC') && 
                    (toCurrency === 'USDT' || toCurrency === 'USDC')) {
                    volatility = 0.0001; // 0.01%
                }
                // Higher volatility for crypto pairs
                else if (fromCurrency === 'BTC' || fromCurrency === 'ETH' || fromCurrency === 'SOL') {
                    volatility = 0.005; // 0.5%
                }
                
                const variation = (Math.random() - 0.5) * 2 * volatility;
                const currentRate = exchangeRates[fromCurrency][toCurrency];
                exchangeRates[fromCurrency][toCurrency] = currentRate * (1 + variation);
            }
        });
    });
}

// Simulate real-time price updates
function startLivePriceUpdates() {
    setInterval(() => {
        // Random chance of price update (30% chance every second)
        if (Math.random() < 0.3) {
            updateAllRates();
            calculateExchange();
            
            // Add flash effect to show update
            const rateDisplay = document.querySelector('.exchange-rate');
            rateDisplay.classList.add('rate-flash');
            setTimeout(() => {
                rateDisplay.classList.remove('rate-flash');
            }, 300);
        }
    }, 1000);
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

// Currency selector functionality
const currencyIcons = {
    'BTC': '<svg class="crypto-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#f7931a"/><path fill="white" d="M21.2 14.3c.3-1.9-1.2-3-3.2-3.7l.7-2.6-1.6-.4-.6 2.6c-.4-.1-.9-.2-1.3-.3l.6-2.6-1.6-.4-.7 2.7c-.4-.1-.7-.2-1-.2l-2.2-.6-.4 1.7s1.2.3 1.2.3c.6.2.8.6.7.9l-.7 3c.1 0 .1 0 .2.1l-1.1 4.2c-.1.2-.3.5-.7.4l-1.2-.3-.8 1.8 2.1.5c.4.1.8.2 1.1.3l-.7 2.7 1.6.4.7-2.6c.4.1.9.2 1.3.3l-.7 2.6 1.6.4.7-2.7c2.7.5 4.8.3 5.6-2.2.7-2-.1-3.1-1.5-3.9 1.1-.2 1.8-.9 2-2.3zm-3.6 5.1c-.5 2-3.8.9-4.9.6l.9-3.5c1.1.3 4.5.8 4 2.9zm.5-5.1c-.4 1.8-3.2.9-4.1.7l.8-3.2c.9.2 3.8.6 3.3 2.5z"/></svg>',
    'ETH': '<svg class="crypto-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#627EEA"/><path fill="white" d="M16 4v8.9l7.5 3.3L16 4z"/><path fill="white" opacity="0.6" d="M16 4l-7.5 12.2L16 12.9V4z"/><path fill="white" d="M16 21.97v6.03l7.5-10.38L16 21.97z"/><path fill="white" opacity="0.6" d="M16 28v-6.03l-7.5-4.35L16 28z"/><path fill="white" opacity="0.2" d="M16 20.57l7.5-4.35L16 12.87v7.7z"/><path fill="white" opacity="0.6" d="M8.5 16.22L16 20.57v-7.7l-7.5 3.35z"/></svg>',
    'USDT': '<svg class="crypto-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path fill="white" d="M17.9 17.4v-.002c0-.11-.08-.2-.21-.22-1.3-.13-2.61-.13-3.92 0-.13.02-.21.11-.21.22v.002c0 .11.08.2.21.22 1.3.13 2.61.13 3.92 0 .13-.02.21-.11.21-.22m5.84-4.44v4.53c0 .37-.03.74-.09 1.1l-3.88-.82v3.96c0 .27-.22.49-.49.49H12.7c-.27 0-.49-.22-.49-.49v-3.96l-3.88.82c-.06-.36-.09-.73-.09-1.1v-4.53c0-4.36 3.13-8 7.27-8.78v5.42H11.3v2.9h9.4v-2.9h-4.21V8.22c4.14.78 7.27 4.42 7.27 8.78"/></svg>',
    'USDC': '<svg class="crypto-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#2775CA"/><path fill="white" d="M12.3 16.25c0 2.07 1.46 3.43 3.7 3.43s3.7-1.36 3.7-3.43-1.46-3.43-3.7-3.43-3.7 1.36-3.7 3.43zm5.54 0c0 1.1-.69 1.82-1.84 1.82s-1.84-.73-1.84-1.82.69-1.82 1.84-1.82 1.84.73 1.84 1.82zm4.03 1.13c0-.38-.21-.58-.7-.58h-.3v1.84h.3c.49 0 .7-.2.7-.58v-.68zm1.49.56c0 .9-.54 1.51-1.73 1.51h-1.92v-4.58h1.03v1.52h.89c1.2 0 1.73.61 1.73 1.51v.04zm-7.26 0c0-.38-.21-.58-.7-.58h-.3v1.84h.3c.49 0 .7-.2.7-.58v-.68zm1.49.56c0 .9-.54 1.51-1.73 1.51h-1.92v-4.58h1.03v1.52h.89c1.2 0 1.73.61 1.73 1.51v.04zm4.84-3.83c0 .45-.29.78-.74.78s-.74-.33-.74-.78.29-.78.74-.78.74.33.74.78zM8.28 18.31c0-.45.29-.78.74-.78s.74.33.74.78-.29.78-.74.78-.74-.33-.74-.78z"/></svg>',
    'SOL': '<svg class="crypto-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#14F195"/><path d="M9.82 21.32a.5.5 0 01.36-.15h11.64c.34 0 .51.41.27.66l-2.36 2.36a.5.5 0 01-.36.15H7.73c-.34 0-.51-.41-.27-.66l2.36-2.36zm0-9.65a.5.5 0 01.36-.15h11.64c.34 0 .51.41.27.66l-2.36 2.36a.5.5 0 01-.36.15H7.73c-.34 0-.51-.41-.27-.66l2.36-2.36zm12.36 5.43a.5.5 0 01-.36.15H10.18c-.34 0-.51-.41-.27-.66l2.36-2.36a.5.5 0 01.36-.15h11.64c.34 0 .51.41.27.66l-2.36 2.36z" fill="#2D2D2D"/></svg>',
    'BNB': '<svg class="crypto-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#F3BA2F"/><path fill="white" d="M16 10l4 4 2.3-2.3L16 5.4l-6.3 6.3L12 14l4-4zm-6.3 4l-2.3 2.3 2.3 2.3 2.3-2.3-2.3-2.3zM16 22l-4-4-2.3 2.3L16 26.6l6.3-6.3L20 18l-4 4zm6.3-8l2.3-2.3-2.3-2.3-2.3 2.3 2.3 2.3z"/><path fill="white" d="M18 16l-2-2-2 2 2 2 2-2z"/></svg>'
};

// Currency selector dropdown functionality
document.querySelectorAll('.currency-selector').forEach(selector => {
    const type = selector.dataset.type;
    const dropdown = document.getElementById(`${type}-dropdown`);
    
    selector.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Close all other dropdowns
        document.querySelectorAll('.currency-dropdown').forEach(dd => {
            if (dd !== dropdown) dd.classList.remove('active');
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
    });
});

// Currency option selection
document.querySelectorAll('.currency-option').forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        const currency = option.dataset.currency;
        const dropdown = option.closest('.currency-dropdown');
        const type = dropdown.id.replace('-dropdown', '');
        const selector = document.querySelector(`.currency-selector[data-type="${type}"]`);
        
        // Update currency display
        const currencyCode = selector.querySelector('.currency-code');
        const iconContainer = selector.querySelector('.crypto-icon').parentElement;
        
        currencyCode.textContent = currency;
        
        // Update the icon
        const currentIcon = selector.querySelector('.crypto-icon:not(.lock-icon)');
        if (currentIcon) {
            currentIcon.outerHTML = currencyIcons[currency];
        }
        
        // Update the currency variable
        if (type === 'send') {
            sendCurrency = currency;
        } else {
            receiveCurrency = currency;
        }
        
        // Recalculate exchange
        calculateExchange();
        
        // Close dropdown
        dropdown.classList.remove('active');
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.currency-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
});

// Initialize
calculateExchange();
startLivePriceUpdates();

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

