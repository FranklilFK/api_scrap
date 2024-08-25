const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.get('/scrape', async (req, res) => {
    try {
        const { data } = await axios.get('https://www.app-sales.net/nowfree/'); 

        const $ = cheerio.load(data);
        
        let scrapedData = [];

        $('.sale-list-item').each((index, element) => {
            const title = $(element).find('.app-name').text().trim();
            const oldprice = $(element).find('.price-old').text().trim();
            const newprice = $(element).find('.price-new').text().trim();
            const discount = $(element).find('.price-disco').text().trim();
            const icon = $(element).find('.app-icon img').attr('src');
            const downloads = $(element).find('.downloads').text().trim();
            const rating = $(element).find('.rating').text().trim();
            const url = $(element).find('.sale-list-action a').attr('href');

            scrapedData.push({
                discount,
                downloads,
                icon,
                newprice,
                oldprice,
                rating,
                title,
                url
            });
        });

        res.json(scrapedData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while scraping the data');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
