import os
import time
import random
from influxdb_client_3 import InfluxDBClient3, Point
import schedule
from dotenv import load_dotenv

# Load .env
load_dotenv(r"yourpathto.envfile\.env")

# InfluxDB Configuration
token = os.environ.get("INFLUXDB_TOKEN")
org = os.environ.get("INFLUXDB_ORG") 
host = os.environ.get("INFLUXDB_HOST")
database = os.environ.get("INFLUXDB_BUCKET")   

# Initialitation InfluxDB Clinet
client = InfluxDBClient3(host=host, token=token, org=org)

def generate_data():
    data = {
        "Office": {
            "temperature": random.uniform(20.0, 30.0),
            "humidity": random.uniform(40.0, 60.0)
        },
        "Warehouse": {
            "temperature": random.uniform(18.0, 28.0),
            "humidity": random.uniform(35.0, 55.0)
        }
    }

    for location, metrics in data.items():
        point = (
            Point("environment")
            .tag("location", location)  # location tag
            .field("temperature", metrics["temperature"])  # Field temperature
            .field("humidity", metrics["humidity"])  # Field humidity
        )

        client.write(database=database, record=point)
        print(f"Data terkirim: {location} - temperature = {metrics['temperature']:.2f}, humidity = {metrics['humidity']:.2f}")
        time.sleep(1)  # delay 1 second

# 5 minutes/1
schedule.every(5).minutes.do(generate_data)

print("Aplikasi berjalan, menunggu pengiriman data setiap 5 menit...")

try:
    while True:
        schedule.run_pending()
        time.sleep(1)
except KeyboardInterrupt:
    print("\nAplikasi dihentikan.")
finally:
    client.close()
