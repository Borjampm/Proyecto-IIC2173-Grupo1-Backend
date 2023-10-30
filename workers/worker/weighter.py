import requests
from dotenv import load_dotenv
import os
from datetime import date, timedelta

load_dotenv()
api_url = os.getenv("API_URL")

def get_requests(symbol):
    actual_date = date.today()
    total = 0

    for x in range(7):
        day = actual_date - timedelta(days=x)
        day = day.isoformat()

        response = requests.get(f"{api_url}/stocks/weighted?day={day}")
        
        if response.status_code == 200:
            data = response.json()
            total += int(data["transactions"])
            print(f"[Worker] > Se han añadido {data['transactions']} transacciones, total {total}")

        else:
            print(f"[Worker] >>> Error al obtener historial {x+1}/7 de la API. ")

    return total

def get_weighted(symbol):
    transactions = get_requests(symbol)

    numerator = 5 + transactions - 50
    pond = 1 + (numerator / 50)

    return pond