# celery
from celery.schedules import crontab

# https://docs.celeryq.dev/en/3.1/configuration.html
accept_content = ['application/json']
CELERY_SERIALIZER = 'json'
result_serializer = 'json'
# Configure Celery to use a custom time zone.
timezone = 'America/Santiago'
# A sequence of modules to import when the worker starts
imports = ('worker.tasks', )
# beat scheduler
CELERY_BEAT_SCHEDULE = {
    'call-5-times-add': {
        'task': 'worker.tasks.add',
        'schedule': crontab(minute='*/1'),  # every 1 minute
        'args': (16, 16),
        'options': {'expires': 5}  # Set the number of executions to 5
    },
}

