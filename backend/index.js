const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

console.log("🚀 Server starting...");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/train/:trainId', async (req, res) => {
  const trainId = req.params.trainId;
  console.log(`🔍 Request received for train ID: ${trainId}`);

  try {
    const url = `https://railrat.net/trains/${trainId}/`;
    console.log(`🌐 Attempting to fetch: ${url}`);

    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
          'AppleWebKit/537.36 (KHTML, like Gecko) ' +
          'Chrome/103.0.0.0 Safari/537.36',
      },
      timeout: 10000,
    });

    console.log('✅ HTML successfully retrieved');

    const $ = cheerio.load(html);

    const trainName = $('h1').first().text().trim();
    const status = $('p').first().text().trim();

    console.log(`🚆 Train Name: ${trainName}`);
    console.log(`📢 Status: ${status}`);

    const progress = [];

    $('#train_progress li').each((i, el) => {
      const text = $(el).text().trim();
      console.log(`🛤️ Stop ${i + 1}: ${text}`);

      const codeMatch = text.match(/^([A-Z]{3})/);
      const stationCode = codeMatch ? codeMatch[1] : null;

      const stationNameMatch = text.match(/\(([^)]+)\)/);
      const stationName = stationNameMatch ? stationNameMatch[1] : null;

      const status = {};

      const arrivalMatch = text.match(/arrived\s+(\d{1,2}:\d{2})/);
      if (arrivalMatch) status.arrival = arrivalMatch[1] + ' ET';

      const departureMatch = text.match(/departed\s+(\d{1,2}:\d{2})/);
      if (departureMatch) status.departure = departureMatch[1] + ' ET';

      const estArrivalMatch = text.match(/est\. arrival\s+(\d{1,2}:\d{2})/);
      if (estArrivalMatch) status.estArrival = estArrivalMatch[1] + ' ET';

      const estDepartureMatch = text.match(/est\. departure\s+(\d{1,2}:\d{2})/);
      if (estDepartureMatch) status.estDeparture = estDepartureMatch[1] + ' ET';

       const completedMatch = text.match(/completed,\s*(\d{1,2}:\d{2})/);
       if (completedMatch) status.completed = completedMatch[1] + ' ET';

      const delayMatch = text.match(/(\d+\s+min\.\s+(late|early)|on time)/);
      const delay = delayMatch ? delayMatch[1] : null;

      progress.push({
        code: stationCode,
        stationName,
        ...status,
        delay,
        raw: text,
      });
    });

    const positions = [];
    $('div.position-updates p').each((i, el) => {
      const update = $(el).text().trim();
      console.log(`📍 Position update ${i + 1}: ${update}`);
      positions.push(update);
    });

    console.log('✅ All data scraped successfully');
    res.json({ trainId, trainName, status, progress, positions });

  } catch (error) {
    console.error('❌ Error scraping train data:', error.message);
    res.status(500).json({ error: 'Failed to fetch train data' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
