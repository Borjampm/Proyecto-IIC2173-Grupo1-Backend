# Flujo de IaaC

Se utilizó terraform para levantar tanto las estructuras del _frontend_ como _backend_.

## Ejecutar el código
1. Descargar Terraform segñun el respectivo sistema operativo. Puedes encontrar las instrucciones [aquí](https://developer.hashicorp.com/terraform/install?product_intent=terraform).

2. Moverse a la carpeta `deploy`
> ```
> cd deploy
>```

4. Ejecutar los siguientes comandos en la terminal:
> ```
>terraform init
>terraform validate
>terraform plan
>```

## Flujo del levantamiento de estructuras
1. Se crea un puerto para la API.
2. Se selecciona un proveedor donde se deben subir los elementos, en este caso se utiliza AWS.
3. Se comienzan a crear los recursos.
4. Se crea la instancia de EC2, para esto es necesario utilizar una llave `.pem` y un grupod e seguridad.
5. Se crea una IP elástica para poder asociarla a la instancia.
6. Se crea el grupo de seguridad para poder abrir los puertos.
7. Se crea un `.zip` que contendrá los archivos para subir a la función Lambda.
8. Crear la función Lambda.
9. Se crea un rol IAM para poder subir la función Lambda.
10. Crear una API Gateway.
11. Se crean las integraciones, métodos y respuestas respectivas de la API Gateway para un método HTTP.
12. Se crean las integraciones, métodos y respuestas respectivas de la API Gateway para un método con la función Lambda.
13. Crear un S3 Bucket para subir los archivos del _frontend_.
14. Administrar los permisos de ACL para la s3 Bucket.
15. Crear una distribución de Cloudfront para subir la S3 Bucket.
16. 