import os

# FastAPI
from fastapi import FastAPI

# celery
from worker.tasks import get_prediction

#messages
message = "message"
published = "job published"
job_id = "job_id"
ready = "ready"
result = "result"

app = FastAPI()

@app.get("/")
def read_root():
    return {message: "Jobs Masters, Esta es una ruta por defecto"}

@app.get("/")
def get_publish_job():
    job = get_prediction.delay()
    return {
        message: published,
        job_id: job.id,
    }

@app.get("/job/{job_id}")
def get_job(job_id: str):
    job = get_prediction.AsyncResult(job_id)
    print(job)
    return {
        ready: job.ready(),
        result: job.result,
    }
