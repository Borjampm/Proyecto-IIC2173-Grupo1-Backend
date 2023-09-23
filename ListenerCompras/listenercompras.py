import paho.mqtt.client as mqtt
import json
import requests
from dotenv import load_dotenv
import os


load_dotenv()
API_URL = os.getenv("API_URL")
print(API_URL)

# Configuración de las credenciales MQTT
MQTT_HOST = "broker.legit.capital"
MQTT_PORT = 9000
MQTT_USER = "students"
MQTT_PASSWORD = "iic2173-2023-2-students"

# Callback que se ejecuta cuando se conecta al broker MQTT
def on_connect(client, userdata, flags, rc):
    print(f"[Listener-Compras] Conectado al broker con código: {rc}")
    client.subscribe("stocks/validation")  # Suscripción a un tópico

# Callback que se ejecuta cuando se recibe un mensaje MQTT
def on_message(client, userdata, msg):
    message_dict = json.loads(msg.payload.decode())
    print(message_dict, "msg")
    # validation = json.loads(message_dict)
    if message_dict['group_id'] == 1:
        print("hola")
        api_request(message_dict)
    # print(message_dict)



def api_request(data):
    print(data, "data")

    print('[Listener-Compras] requesting to api')
    api_url = API_URL + "/transactions/validate"
    print(api_url)
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
mqtt_client.username_pw_set(username=MQTT_USER, password=MQTT_PASSWORD)
mqtt_client.connect(MQTT_HOST, MQTT_PORT, keepalive=60)

# Iniciar el loop de MQTT en un hilo separado
mqtt_client.loop_forever()
