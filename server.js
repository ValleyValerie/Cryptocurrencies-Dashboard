import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';
import axios from 'axios';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// CoinGecko API Configuration
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const FETCH_INTERVAL = 10000; // 10 seconds
const MIN_API_INTERVAL = 6000; // 6 seconds minimum between API calls

// Cache for API data
let cachedCryptoData = null;
let lastAPICallTime = 0;
let chartDataHistory = [];
const MAX_CHART_POINTS = 10;

// Fetch live cryptocurrency data from CoinGecko
async function fetchCryptoData() {
  try {
    // Rate limit protection
    const now = Date.now();
    if (now - lastAPICallTime < MIN_API_INTERVAL) {
      console.log('⏳ Rate limit: using cached data');
      return cachedCryptoData;
    }

    console.log('🔄 Fetching fresh data from CoinGecko...');
    lastAPICallTime = now;

    // Fetch top 5 cryptocurrencies
    const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 5,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      },
      timeout: 5000
    });

    const coins = response.data;
    
    // Cache the response
    cachedCryptoData = coins;
    console.log('✅ Successfully fetched crypto data');
    
    return coins;
  } catch (error) {
    console.error('❌ Error fetching crypto data:', error.message);
    
    if (error.response) {
      console.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
      if (error.response.status === 429) {
        console.error('⚠️  Rate limit exceeded!');
      }
    } else if (error.code === 'ECONNABORTED') {
      console.error('⚠️  Request timeout');
    }
    
    // Return cached data if available
    return cachedCryptoData;
  }
}

// Transform crypto data to stats format
function generateStatsFromCrypto(coins) {
  if (!coins || coins.length === 0) {
    return generateFallbackStats();
  }

  const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);
  const totalVolume = coins.reduce((sum, coin) => sum + coin.total_volume, 0);
  const avgPriceChange = coins.reduce((sum, coin) => sum + coin.price_change_percentage_24h, 0) / coins.length;

  return {
    totalUsers: Math.floor(totalMarketCap / 1e9), // Market cap in billions
    activeUsers: Math.floor(totalVolume / 1e6), // Volume in millions
    revenue: Math.floor(totalMarketCap / 1000), // Market cap in thousands
    growth: avgPriceChange.toFixed(2), // Average 24h change
  };
}

// Generate chart data from Bitcoin price
function generateChartDataFromCrypto(coins) {
  if (!coins || coins.length === 0) {
    return generateFallbackChartData();
  }

  // Add Bitcoin (first coin) price to history
  const bitcoinPrice = coins[0].current_price;
  
  chartDataHistory.push({
    timestamp: new Date().toISOString(),
    value: bitcoinPrice,
  });

  // Keep only last 10 points
  if (chartDataHistory.length > MAX_CHART_POINTS) {
    chartDataHistory = chartDataHistory.slice(-MAX_CHART_POINTS);
  }

  return chartDataHistory;
}

// Transform crypto data to table format
function generateTableDataFromCrypto(coins) {
  if (!coins || coins.length === 0) {
    return generateFallbackTableData();
  }

  return coins.map((coin, i) => ({
    id: `crypto-${coin.id}`,
    name: `${coin.name} (${coin.symbol.toUpperCase()})`,
    status: coin.price_change_percentage_24h >= 0 ? 'active' : 'inactive',
    value: Math.floor(coin.current_price),
    date: new Date().toISOString().split('T')[0],
    // Extra crypto-specific data
    priceFormatted: `$${coin.current_price.toLocaleString()}`,
    change24h: coin.price_change_percentage_24h.toFixed(2),
  }));
}

// Fallback functions (in case API fails)
function generateFallbackStats() {
  console.log('⚠️  Using fallback stats data');
  return {
    totalUsers: Math.floor(Math.random() * 1000) + 5000,
    activeUsers: Math.floor(Math.random() * 500) + 1000,
    revenue: Math.floor(Math.random() * 50000) + 100000,
    growth: (Math.random() * 30 - 10).toFixed(2),
  };
}

function generateFallbackChartData() {
  console.log('⚠️  Using fallback chart data');
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      timestamp: new Date(Date.now() - (9 - i) * 60000).toISOString(),
      value: Math.floor(Math.random() * 100) + 50,
    });
  }
  return data;
}

function generateFallbackTableData() {
  console.log('⚠️  Using fallback table data');
  const statuses = ['active', 'inactive', 'pending'];
  const names = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta', 'Project Epsilon'];

  return names.map((name, i) => ({
    id: `row-${i}`,
    name,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    value: Math.floor(Math.random() * 10000),
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  }));
}

// Initial fetch on startup
console.log('🚀 Initializing CoinGecko data...');
fetchCryptoData().then(data => {
  if (data) {
    console.log('✅ Initial crypto data loaded successfully');
  }
});

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', async (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Fetch initial data and send to client
    const initialCoins = await fetchCryptoData();
    socket.emit('stats-update', generateStatsFromCrypto(initialCoins));
    socket.emit('chart-update', generateChartDataFromCrypto(initialCoins));
    socket.emit('table-update', generateTableDataFromCrypto(initialCoins));

    // Set up intervals for real-time updates
    const dataInterval = setInterval(async () => {
      const coins = await fetchCryptoData();
      
      // Send stats update
      socket.emit('stats-update', generateStatsFromCrypto(coins));
      
      // Send chart update
      socket.emit('chart-update', generateChartDataFromCrypto(coins));
      
      // Send table update
      socket.emit('table-update', generateTableDataFromCrypto(coins));
    }, FETCH_INTERVAL);

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
      clearInterval(dataInterval);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`✅ Ready on http://${hostname}:${port}`);
      console.log(`📊 Live cryptocurrency data powered by CoinGecko`);
      console.log(`🔄 Updates every ${FETCH_INTERVAL / 1000} seconds`);
    });
});