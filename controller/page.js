const https = require('https');
const cheerio = require('cheerio');
const { UserInfo } = require("../models/user");

async function fetchStockData(symbol) {
    return new Promise((resolve, reject) => {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

        https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(data));
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

exports.getStockData = async (req, res) => {
    try {
        const { symbol } = req.params;
        const exchange = "NS";
        const formattedSymbol = `${symbol}.${exchange}`;
        const data = await fetchStockData(formattedSymbol);
        res.json(data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching stock data' });
    }
};

const symbols = [
    "ABB.NS", "ADANIENSOL.NS", "ADANIENT.NS", "ADANIGREEN.NS", "ADANIPORTS.NS",
    "ADANIPOWER.NS", "ATGL.NS", "AMBUJACEM.NS", "APOLLOHOSP.NS", "ASIANPAINT.NS",
    "DMART.NS", "AXISBANK.NS", "BAJAJ-AUTO.NS", "BAJFINANCE.NS", "BAJAJFINSV.NS",
    "BAJAJHLDNG.NS", "BANKBARODA.NS", "BERGEPAINT.NS", "BEL.NS", "BPCL.NS",
    "BHARTIARTL.NS", "BOSCHLTD.NS", "BRITANNIA.NS", "CANBK.NS", "CHOLAFIN.NS",
    "CIPLA.NS", "COALINDIA.NS", "COLPAL.NS", "DLF.NS", "DABUR.NS", "DIVISLAB.NS",
    "DRREDDY.NS", "EICHERMOT.NS", "GAIL.NS", "GODREJCP.NS", "GRASIM.NS", "HCLTECH.NS",
    "HDFCBANK.NS", "HDFCLIFE.NS", "HAVELLS.NS", "HEROMOTOCO.NS", "HINDALCO.NS",
    "HAL.NS", "HINDUNILVR.NS", "ICICIBANK.NS", "ICICIGI.NS", "ICICIPRULI.NS", "ITC.NS",
    "IOC.NS", "IRCTC.NS", "IRFC.NS", "INDUSINDBK.NS", "NAUKRI.NS", "INFY.NS", "INDIGO.NS",
    "JSWSTEEL.NS", "JINDALSTEL.NS", "JIOFIN.NS", "KOTAKBANK.NS", "LTIM.NS", "LT.NS",
    "LICI.NS", "M&M.NS", "MARICO.NS", "MARUTI.NS", "NTPC.NS", "NESTLEIND.NS", "ONGC.NS", "PIDILITIND.NS", "PFC.NS", "POWERGRID.NS", "PNB.NS", "RECLTD.NS", "RELIANCE.NS", "SBICARD.NS", "SBILIFE.NS", "SRF.NS", "MOTHERSON.NS", "SHREECEM.NS", "SHRIRAMFIN.NS", "SIEMENS.NS", "SBIN.NS", "SUNPHARMA.NS", "TVSMOTOR.NS", "TCS.NS", "TATACONSUM.NS", "TATAMTRDVR.NS", "TATAMOTORS.NS", "TATAPOWER.NS", "TATASTEEL.NS", "TECHM.NS", "TITAN.NS", "TORNTPHARM.NS", "TRENT.NS", "ULTRACEMCO.NS", "MCDOWELL-N.NS", "VBL.NS", "VEDL.NS", "WIPRO.NS", "ZOMATO.NS", "ZYDUSLIFE.NS"
];

exports.fetchallstocks = async (req, res) => {
    try {
        const symbolsWithoutNS = symbols.map(symbol => symbol.replace('.NS', ''));
        res.json({ symbolsWithoutNS });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching stock data' });
    }
};

async function fetchStockPrices(symbols) {
    const prices = {};
    async function fetchPrice(symbol) {
        return new Promise((resolve, reject) => {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;

            https.get(url, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    try {
                        const jsonData = JSON.parse(data);
                        const regularMarketPrice = jsonData.chart.result[0].meta.regularMarketPrice;
                        resolve(regularMarketPrice);
                    } catch (error) {
                        reject(error);
                    }
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
    }
    await Promise.all(symbols.map(async (symbol) => {
        try {
            const price = await fetchPrice(symbol);
            prices[symbol] = price;
        } catch (error) {
            console.error(`Error fetching price for ${symbol}: ${error.message}`);
        }
    }));

    return prices;
}

exports.gettop = async(req, res) => {
    try {
        fetchStockPrices(symbols)
        .then((prices) => {
            const pricesArray = Object.entries(prices).map(([symbol, price]) => ({ symbol, price }));
            pricesArray.sort((a, b) => b.price - a.price);
            const top10Prices = pricesArray.slice(0, 10);
            const top10Symbols = top10Prices.map(entry => entry.symbol);
            const symbolsWithoutNS = top10Symbols.map(symbol => symbol.replace('.NS', ''));
            res.json({ symbolsWithoutNS });
        })
        .catch((error) => {
            console.error('Error:', error.message);
        });
        
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
}

exports.getbottom = async (req, res) => {
    try {
        fetchStockPrices(symbols)
            .then((prices) => {
                const pricesArray = Object.entries(prices).map(([symbol, price]) => ({ symbol, price }));
                pricesArray.sort((a, b) => a.price - b.price); 
                const bottom10Prices = pricesArray.slice(0, 10); 
                const bottom10Symbols = bottom10Prices.map(entry => entry.symbol);
                const symbolsWithoutNS = bottom10Symbols.map(symbol => symbol.replace('.NS', ''));
                res.json({ symbolsWithoutNS });
            })
            .catch((error) => {
                console.error('Error:', error.message);
                res.status(500).json({ error: 'An error occurred while fetching stock prices' });
            });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};

function getRandomSymbols(symbols, count) {
    const randomSymbols = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * symbols.length);
        randomSymbols.push(symbols[randomIndex]);
    }
    return randomSymbols;
}

exports.recommend = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserInfo.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const portfolioSymbols = user.portfolio.map(entry => entry.symbol);
        const watchListSymbols = user.watchList;
        const followingSymbols = user.following;
        const combinedSymbols = [...watchListSymbols, ...followingSymbols];
        const intersection = combinedSymbols.filter(symbol => portfolioSymbols.includes(symbol));
        const recommendationSymbols = combinedSymbols.filter(symbol => !intersection.includes(symbol));
        const recommendationCount = recommendationSymbols.length;
        if (recommendationCount > 20) {
            const symbolsWithoutNS = recommendationSymbols.map(symbol => symbol.replace('.NS', ''));
            return res.json({ symbolsWithoutNS });
        } else {
            const remainingCount = 20 - recommendationCount;
            const remainingSymbols = symbols.filter(symbol => !recommendationSymbols.includes(symbol));
            const randomSymbols = getRandomSymbols(remainingSymbols, remainingCount);
            recommendationSymbols.push(...randomSymbols);
            const symbolsWithoutNS = recommendationSymbols.map(symbol => symbol.replace('.NS', ''));
            return res.json({ symbolsWithoutNS });
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
};