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
    'BTC': '<svg class="crypto-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#f7931a"/><path fill="white" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/></svg>',
    'ETH': '<svg class="crypto-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#627EEA"/><path fill="white" fill-opacity="0.602" d="M16.498 4v8.87l7.497 3.35z"/><path fill="white" d="M16.498 4L9 16.22l7.498-3.35z"/><path fill="white" fill-opacity="0.602" d="M16.498 21.968v6.027L24 17.616z"/><path fill="white" d="M16.498 27.995v-6.028L9 17.616z"/><path fill="white" fill-opacity="0.2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/><path fill="white" fill-opacity="0.602" d="M9 16.22l7.498 4.353v-7.701z"/></svg>',
    'USDT': '<svg class="crypto-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path fill="white" d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.118 0 1.044 3.309 1.915 7.709 2.118v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.116 0-1.043-3.301-1.914-7.694-2.117"/></svg>',
    'USDC': '<svg class="crypto-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#2775CA"/><path fill="white" d="M15.75 27.5C9.26 27.5 4 22.24 4 15.75S9.26 4 15.75 4a11.75 11.75 0 017.796 20.996l-.546-.396A11.25 11.25 0 1015.75 5C9.813 5 5 9.813 5 15.75S9.813 26.5 15.75 26.5c5.151 0 9.63-3.577 10.837-8.444l.484.11A11.753 11.753 0 0115.75 27.5z"/><path fill="white" d="M20.975 15.75c0 .413-.059.82-.175 1.208a3.28 3.28 0 01-.496.999 2.277 2.277 0 01-.787.66c-.31.16-.658.24-1.044.24-.373 0-.72-.08-1.042-.24a2.185 2.185 0 01-.788-.673 3.082 3.082 0 01-.496-1.019 4.2 4.2 0 01-.172-1.218c0-.413.057-.822.172-1.225.115-.403.284-.762.508-1.077a2.39 2.39 0 01.82-.736c.325-.183.692-.274 1.1-.274.72 0 1.306.224 1.76.673l-.798.854a1.4 1.4 0 00-.413-.356.964.964 0 00-.502-.127c-.23 0-.428.057-.593.172a1.303 1.303 0 00-.413.444 2.15 2.15 0 00-.242.622 3.04 3.04 0 00-.079.711c0 .254.026.495.079.723.052.229.133.432.242.61.11.18.248.321.413.426.165.105.363.158.593.158.214 0 .404-.051.57-.153.165-.101.31-.235.435-.4l.753.879c-.238.279-.52.492-.845.64a2.431 2.431 0 01-1.068.222c-.397 0-.76-.086-1.09-.26a2.456 2.456 0 01-.826-.71 3.389 3.389 0 01-.527-1.044 3.976 3.976 0 01-.184-1.225c0-.436.061-.852.184-1.249.123-.396.303-.743.54-1.04a2.56 2.56 0 01.85-.71c.333-.177.71-.265 1.131-.265.198 0 .399.025.603.076.204.05.398.125.58.223.183.099.348.22.496.363.147.143.265.308.355.495l-.82.811a1.452 1.452 0 00-.375-.418.976.976 0 00-.56-.158.968.968 0 00-.502.127c-.147.085-.273.197-.378.337a1.618 1.618 0 00-.23.476 1.84 1.84 0 00-.079.533h2.421v.902h-2.421zM13.295 16.285c0 .651-.177 1.156-.53 1.515-.354.36-.868.54-1.541.54-.673 0-1.186-.18-1.54-.54-.354-.359-.53-.864-.53-1.515V11.66h1.24v4.413c0 .365.063.633.19.805.127.172.333.258.618.258.286 0 .492-.086.619-.258.127-.172.19-.44.19-.805V11.66h1.284v4.625z"/></svg>',
    'SOL': '<svg class="crypto-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#000000"/><g><path d="M10.44 21.56a.74.74 0 01.52-.22h11.55c.31 0 .47.38.25.62l-2.23 2.21a.74.74 0 01-.52.22H8.46c-.31 0-.47-.38-.25-.62z" fill="#00FFA3"/><path d="M10.44 7.82a.73.73 0 01.52-.21h11.55c.31 0 .47.37.25.61l-2.23 2.21a.73.73 0 01-.52.22H8.46c-.31 0-.47-.38-.25-.62z" fill="#00FFA3"/><path d="M21.56 14.47a.73.73 0 01-.52.22H9.49c-.31 0-.47-.38-.25-.62l2.23-2.21a.74.74 0 01.52-.22h11.55c.31 0 .47.38.25.62z" fill="#DC1FFF"/></g></svg>',
    'BNB': '<svg class="crypto-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#F3BA2F"/><path fill="white" d="M16 10.125l3.875 3.875 2.25-2.25L16 5.625 9.875 11.75 12.125 14 16 10.125zm-6.125 3.875l-2.25 2.25 2.25 2.25 2.25-2.25-2.25-2.25zM16 21.875L12.125 18l-2.25 2.25L16 26.375l6.125-6.125L19.875 18 16 21.875zm6.125-7.875l-2.25-2.25-2.25 2.25 2.25 2.25 2.25-2.25z"/><path fill="white" d="M17.875 16l-1.875-1.875L14.125 16 16 17.875 17.875 16z"/></svg>'
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

