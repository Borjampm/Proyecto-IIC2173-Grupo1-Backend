# celery
from celery import shared_task
from workers.regression import get_linear_regression

# standard
import time

# The "shared_task" decorator allows creation
# of Celery tasks for reusable apps as it doesn't
# need the instance of the Celery app.
# @celery_app.task()
@shared_task()
def get_prediction(days_back, symbol):
    regression = get_linear_regression(days_back, symbol)
