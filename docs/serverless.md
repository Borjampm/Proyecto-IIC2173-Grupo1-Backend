# Implementación de Serverless

Se utilizó Serverless para poder generar los pdf que muestran la confirmación de la transacción exitosa.

Se utilizó [Serverless Framework](https://www.serverless.com/framework/docs/getting-started/) para subirlo a AWS.

## Crear la aplicación

El código se encuentra en el siguiente [link](https://github.com/Borjampm/Proyecto-IIC2173-Grupo1-Serverless)

1. Confirgurar las credenciales de AWS en el terminal para crear el servicio.

2. Se creó el servicio Serverless
 ```
 sls create -n pdf-serverless-2 -t aws-python3
 ```

3. Luego se creó todo el código con el fin de que se crearan boletas como PDF y que sean subidas a la bucket con la que tenemos asociado el frontend de la aplicación.

4. Al utilizar librerías externas, fue necesario instalarlas en un _virtual enviroment_ de la forma que al subir el código a Lambda, este tenga acceso a los módulos. Se hace de la siguiente forma para instalar las dependencias:
> Se crea el ambiente virtual en la raíz del repositorio:
> ```
>python3 -m venv test_venv
>```
> Se activa el ambiente virtual:
> ```
> source test_venv/bin/activate
>```
> Asegurarse de estar en la versión de Python 3.10.x
> Crear un directorio para instalar boto3
> ```
> mkdir python 
>```
> Instalar boto3
> ```
> pip install boto3 -t boto3
>```
> Crear un directorio para instalar fpdf
> ```
> mkdir fpdf 
>```
> Instalar fpdf
> ```
> pip install fpdf -t fpdf
>```

Ya teniendo esto listo, se puede proceder a subirlo a AWS.

## Subir la aplicación
1. Asegurarse de que las credenciales de AWS estén confirguradas, se puede realizar con el siguiente comando:
```
aws configure
```

2. Para subirlo a Lambda se debe ejecutar el siguiente comando:
```
sls deploy --stage demo
```

## Configurar la aplicación
1. Se utiliza de trigger el Api-gateway que está asociada a nuestra api del proyecto.
2. Se accede a la función generadora de pdf mediante un método `POST` con el siguiente endpoint:
```
api.borjampm.me/pdf-serverless-2-demo-lambda_handler
```