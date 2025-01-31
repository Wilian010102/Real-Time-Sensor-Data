import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { InfluxDBClient, Point } from '@influxdata/influxdb3-client';
import dotenv from 'dotenv';

dotenv.config({ path: "D:/Catatan BE/Python/TimeSeries/.env" });

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const INFLUXDB_TOKEN = process.env.INFLUXDB_TOKEN;
const INFLUXDB_HOST = process.env.INFLUXDB_HOST;
const INFLUXDB_BUCKET = process.env.INFLUXDB_BUCKET;


const client = new InfluxDBClient({
  host: INFLUXDB_HOST, // host
  token: INFLUXDB_TOKEN, // Token
});

async function fetchData() {
  const query = `
    SELECT *
    FROM "environment"
    WHERE
    time >= now() - interval '1 hour'
    AND
    ("humidity" IS NOT NULL OR "temperature" IS NOT NULL)
    AND
    "location" IN ('Office','Warehouse')
  `;

  const results = [];
  for await (const row of client.query(query, INFLUXDB_BUCKET)) {  
    results.push({
      time: row.time,
      location: row.location,
      temperature: row.temperature,
      humidity: row.humidity
    });
  }
  return results;  
}



io.on('connection', (socket) => {
  console.log('Client connected');
  
  setInterval(async () => {
    const data = await fetchData();
    socket.emit('update', data);
    // console.log("Data dikirim ke frontend:", data);
  }, 1000); //one second

  socket.on('disconnect', () => console.log('Client disconnected'));
});

app.get('/data', async (req, res) => {
  const data = await fetchData();
  res.json(data);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
