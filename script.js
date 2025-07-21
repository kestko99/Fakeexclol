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
    'BTC': '<svg class="crypto-icon" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#f7931a"/><path fill="white" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/></svg>',
    'ETH': '<svg class="crypto-icon" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#627EEA"/><path fill="white" fill-opacity="0.602" d="M16.498 4v8.87l7.497 3.35z"/><path fill="white" d="M16.498 4L9 16.22l7.498-3.35z"/><path fill="white" fill-opacity="0.602" d="M16.498 21.968v6.027L24 17.616z"/><path fill="white" d="M16.498 27.995v-6.028L9 17.616z"/><path fill="white" fill-opacity="0.2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/><path fill="white" fill-opacity="0.602" d="M9 16.22l7.498 4.353v-7.701z"/></svg>',
    'USDT': '<svg class="crypto-icon" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path fill="white" d="M17.9 17.4v-.002c0-.11-.08-.2-.21-.22-1.3-.13-2.61-.13-3.92 0-.13.02-.21.11-.21.22v.002c0 .11.08.2.21.22 1.3.13 2.61.13 3.92 0 .13-.02.21-.11.21-.22m5.84-4.44v4.53c0 .37-.03.74-.09 1.1l-3.88-.82v3.96c0 .27-.22.49-.49.49H12.7c-.27 0-.49-.22-.49-.49v-3.96l-3.88.82c-.06-.36-.09-.73-.09-1.1v-4.53c0-4.36 3.13-8 7.27-8.78v5.42H11.3v2.9h9.4v-2.9h-4.21V8.22c4.14.78 7.27 4.42 7.27 8.78"/></svg>',
    'USDC': '<svg class="crypto-icon" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#2775CA"/><path fill="white" d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4zm5.7 8.5c0 1.17-.47 2.13-1.4 2.57-.47.22-.98.34-1.53.34-1.08 0-1.9-.46-2.46-1.37-.25-.41-.4-.86-.46-1.35h1.65c.04.26.13.48.27.66.26.33.63.5 1.1.5.36 0 .65-.1.86-.29.21-.19.32-.44.32-.74 0-.3-.11-.53-.32-.69-.21-.16-.57-.31-1.07-.46l-.82-.24c-.7-.21-1.2-.48-1.52-.82-.31-.34-.47-.78-.47-1.32 0-.68.24-1.23.73-1.65.48-.42 1.13-.63 1.94-.63.8 0 1.43.2 1.89.61.46.41.71.97.75 1.68h-1.59c-.05-.48-.34-.79-.85-.93-.17-.05-.36-.07-.58-.07-.38 0-.67.09-.87.28-.2.18-.3.41-.3.69 0 .28.11.5.34.65.13.09.36.18.67.28l1.04.31c.52.16.93.37 1.22.64.5.46.75 1.07.75 1.84zm-5.7 5v-1.5c-1.66 0-3-1.34-3-3h1.5c0 .83.67 1.5 1.5 1.5v-3c-1.66 0-3-1.34-3-3s1.34-3 3-3v-1.5h1v1.5c1.66 0 3 1.34 3 3h-1.5c0-.83-.67-1.5-1.5-1.5v3c1.66 0 3 1.34 3 3s-1.34 3-3 3v1.5h-1z"/></svg>',
    'SOL': '<svg class="crypto-icon" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#000"/><path fill="url(#solana-gradient)" d="M9.5 20.5c.2-.2.4-.3.7-.3h12.6c.4 0 .6.5.3.8l-2.6 2.5c-.2.2-.4.3-.7.3H7.2c-.4 0-.6-.5-.3-.8l2.6-2.5zm0-9c.2-.2.4-.3.7-.3h12.6c.4 0 .6.5.3.8l-2.6 2.5c-.2.2-.4.3-.7.3H7.2c-.4 0-.6-.5-.3-.8l2.6-2.5zm13 4.3c-.2.2-.4.3-.7.3H9.2c-.4 0-.6-.5-.3-.8l2.6-2.5c.2-.2.4-.3.7-.3h12.6c.4 0 .6.5.3.8l-2.6 2.5z"/><defs><linearGradient id="solana-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#00FFA3"/><stop offset="100%" style="stop-color:#DC1FFF"/></linearGradient></defs></svg>',
    'BNB': '<svg class="crypto-icon" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#F3BA2F"/><path fill="white" d="M16 10.13l3.94 3.94 2.29-2.28L16 5.54 9.77 11.79l2.29 2.28L16 10.13zm-6.23 3.94l-2.29 2.28L9.77 18.64l2.29-2.29-2.29-2.28zM16 21.87l-3.94-3.94-2.29 2.28L16 26.46l6.23-6.25-2.29-2.28L16 21.87zm6.23-7.8l2.29-2.28-2.29-2.29-2.29 2.29 2.29 2.28z"/><path fill="white" d="M18.29 16.01l-2.3-2.3-2.28 2.3 2.28 2.28 2.3-2.28z"/></svg>'
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
        const currentIcon = selector.querySelector('.crypto-icon');
        currentIcon.outerHTML = currencyIcons[currency];
        
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

