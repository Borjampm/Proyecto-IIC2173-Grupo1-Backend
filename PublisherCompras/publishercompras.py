import json
import requests
from dotenv import load_dotenv
import os
from fastapi import FastAPI, HTTPException
import paho.mqtt.publish as publish

app = FastAPI()

MQTT_HOST = "broker.legit.capital"
MQTT_PORT = 9000
MQTT_USER = "students"
MQTT_PASSWORD = "iic2173-2023-2-students"

@app.post("/publish-mqtt-message/")
async def publish_mqtt_message(message):
    try:
        message = {
            "request_id": "be0e538d-c983-43e8-957b-391746eb4236",
            "group_id": "1",
            "symbol": "AAPL",
            "datetime": "hola",
            "deposit_token": "",
            "quantity": 10,
            "seller": 0
        }
        topic = "stocks/validation"
        print("hello")
        publish.single(topic, message, HOST="broker.legit.capital", PORT=9000)
        print("goodbye")
        return {"message": "MQTT message published successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

