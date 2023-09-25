import paho.mqtt.client as mqtt
import json
import requests
from dotenv import load_dotenv
import os
from credentials import Credentials

load_dotenv()
API_URL = os.getenv("API_URL")
data = Credentials()

# Callback que se ejecuta cuando se conecta al broker MQTT
def on_connect(client, userdata, flags, rc):
    print(f"[Listener-Compras] Conectado al broker con código: {rc}")
    topic = data.get_topic()
    client.subscribe(topic)  # Suscripción a un tópico

# Callback que se ejecuta cuando se recibe un mensaje MQTT
def on_message(client, userdata, msg):
    message_dict = json.loads(msg.payload.decode())
    print(message_dict, "msg")
    # validation = json.loads(message_dict)
    if message_dict['group_id'] == data.get_group():
        api_request(message_dict)
    # print(message_dict)



def api_request(data):
    print(data, "data")

    print('[Listener-Compras] requesting to api')
    api_url = f"{API_URL}/transactions/validate"
    
    response = requests.post(api_url, json=data)
    if response.status_code == 200:
        print("POST request successful!")
        print("Response:", response.text)
    else:
        print("POST request failed!")
        print("Status Code:", response.status_code)
        print("Response listener:", response)

# Configuración y conexión del cliente MQTT
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

user = data.get_user()
passw = data.get_password()

mqtt_client.username_pw_set(username=user, password=passw)

host = data.get_host()
port = data.get_port()

mqtt_client.connect(host, port, keepalive=60)

# Iniciar el loop de MQTT en un hilo separado
mqtt_client.loop_forever()
