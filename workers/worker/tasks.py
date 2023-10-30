# celery
from celery import shared_task
from worker.regression import get_linear_regression, temporal_regression
from worker.weighter import get_weighted

# standard
import time

# The "shared_task" decorator allows creation
# of Celery tasks for reusable apps as it doesn't
# need the instance of the Celery app.
# @celery_app.task()
@shared_task()
def get_prediction(days_back, symbol, quantity):
    print(f"[Worker] >>> Iniciando predicción para {symbol}.")
    regression = get_linear_regression(days_back, symbol)
    regression = regression[quantity]
    print(f"[Worker] >>> Resultado regresión lineal: {regression}")

    weighter = get_weighted(symbol)

    prediction = regression * weighter

    print(f"[Worker] >>> Predicción para {symbol} es {prediction}.")

    return prediction

@shared_task()
def temporal_prediction(days_back, symbol, quantity):
    print(f"[Worker] >>> Iniciando predicción temporal para {symbol}.")

    regression = temporal_regression(days_back, symbol)
    weighter = get_weighted(symbol)

    prediction = regression * weighter

    print(f"[Worker] >>> Predicción para {symbol} es {prediction}.")

    return prediction