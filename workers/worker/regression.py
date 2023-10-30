import numpy as np
import requests
import os
from sklearn.linear_model import LinearRegression
from dotenv import load_dotenv
from datetime import date, timedelta

load_dotenv()
api_url = os.getenv("API_URL")


def get_day(rest):
    actual_day = date.today()

    if rest == 0:
        return actual_day.isoformat()
    else:
        previus_day = (actual_day - timedelta(days=rest))
        return previus_day.isoformat()


def get_stocks_history(days_back, symbol):
    prices = []
    dates = []

    print(f"[Worker] >>> Obteniendo historial de {symbol} para los últimos {days_back} días.")

    for x in range(days_back):
        day = get_day(x)

        print(f"[Worker] > Obteniendo historial de la API para el día {day}.")

        response = requests.get(f"{api_url}/stocks/{symbol}/prediction_history?day={day}")

        if response.status_code == 200:
            history = response.json()
            allPrices = history["prices"]
            allDates = history["dates"]
            prices.extend(allPrices)
            dates.extend(allDates)

            print(f"[Worker] > Se obtuvieron {len(allPrices)}|{len(allDates)} registros para el día {day}.")
        else:
            print("[Worker] >>> Error al obtener historial de la API.")
            print(response)

    return prices, dates

def get_linear_regression(days_back, symbol):
    prices, dates = get_stocks_history(days_back, symbol)

    print(f"[Worker] > Obtenido: | Precios: {prices} | Fechas: {dates}")

    Y = np.array(prices).reshape(-1, 1)
    X = np.array(dates).reshape(-1, 1)

    model = LinearRegression()
    model.fit(Y, X)

    new_date = get_day(0).isoformat()
    value = np.array([[new_date]])

    predicted = model.predict(value)

    print(f"[Worker] > Predicción de {symbol} para los últimos {days_back} días. El modelo predice {predicted}")
    
    return predicted

def temporal_regression(days_back, symbol):
    prices, dates = get_stocks_history(days_back, symbol)

    total = sum(prices)
    quantity = len(prices)

    return total / quantity    

