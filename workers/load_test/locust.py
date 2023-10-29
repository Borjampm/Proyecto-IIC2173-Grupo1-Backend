from locust import HttpUser, task
from random import randint,seed
seed(1)
class SumLoadTest(HttpUser):
    @task
    def sum_load_test(self):
        self.client.post("http://nginx/producer/api/sum", json={"number": randint(1000000, 50000000)})
