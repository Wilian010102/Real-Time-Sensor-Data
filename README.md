1. First step, set your env.file based on your influxb configuration
2. Then, go to your_path\producer and run **python main.py** //"This application acts as a producer that sends temperature and humidity data every five minutes to influxdb."
3. Next, go to your_path\backend and run **node server.js** //"This section has the role of retrieving data from influxDB and sending it to frontend."
4. Last, go to your_path\frontend and run **npm run dev** //"This section has the role of displaying data received from backend and has time filter."
