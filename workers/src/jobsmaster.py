import os

# FastAPI
from fastapi import FastAPI

# celery
from celery_config.tasks import wait_and_return, sum_to_n_job
from models import Number

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

@app.get("/wait_and_return")
def get_publish_job():
    job = wait_and_return.delay()
    return {
        message: published,
        job_id: job.id,
    }

@app.get("/job/{job_id}")
def get_job(job_id: str):
    job = wait_and_return.AsyncResult(job_id)
    print(job)
    return {
        ready: job.ready(),
        result: job.result,
    }

@app.post("/sum")
def post_publish_job(number: Number):
    job = sum_to_n_job.delay(number.number)
    return {
        message: published,
        job_id: job.id,
    }

@app.get("/sum/{job_id}")
def get_job(job_id: str):
    job = sum_to_n_job.AsyncResult(job_id)
    print(job)
    return {
        ready: job.ready(),
        result: job.result,
    }
