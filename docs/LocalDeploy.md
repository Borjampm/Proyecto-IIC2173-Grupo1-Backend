# Documentación para levantar localmente la app

A continuación se presentan los pasos para levantar localmente la aplicación

## Paso 1: Clonar Repositorios

Primero clonar el repositorio https://github.com/Borjampm/Proyecto-IIC2173-Grupo1-Backend que contiene el back y luego clonar el repositorio https://github.com/Borjampm/Proyecto-IIC2173-Grupo1-Frontend que contiene el front

## Paso 2: Configurar Entorno del Back

En el directorio base del repositorio se incluye un archivo `.env.template`, el cual tiene el siguiente contenido:

        PORT_API=
        PORT_LISTENER=
        DB_USER=
        DB_PASSWORD=
        DB_NAME=
        DB_HOST=
        DB_PORT=
        API_URL=
        PORT_COMPRAS=
        FRONT_URL=

En ese directorio se debe crear un archivo `.env` y pegar el contenido del archivo anterior. Luego, dentro del nuevo archivo, se debe elegir valores para cada una de estas variables, por ejemplo:

        PORT_API=8000
        PORT_LISTENER=1883
        DB_USER=postgres
        DB_PASSWORD=postgres
        DB_NAME=database
        DB_HOST=db
        DB_PORT=5432
        API_URL=http://api:8000
        PORT_COMPRAS=1884
        FRONT_URL=http://localhost:5173

Notar que `API_URL` debe ser en formato *http*.

## Paso 3: Levantar el Back

Para levantar el back se debe correr el comando `docker compose up` en el directorio base del repositorio. Esto levantará todos los contenedores para que el back de la aplicación funcione. Alternativamente se puede correr `docker compose up -d` para correr la app en el background.

## Paso 4: Configurar Entorno Front

En el directorio base del repositorio del Front se encuentra un archivo `config.js` que contiene el siguiente codigo:

        //const FRONT_PROXY = import.meta.env.PROXY;
        const FRONT_PROXY = "https://borjampm.me/";
        const API_URL = "http://iic2173-cristobalcuneo.me";

        //Auth0 Config Params
        const DOMAIN = "dev-ju2sb7gpzdrwv31f.us.auth0.com";
        const CLIENT_ID = "Ss50jxHUP31QbXzYJHn2NHOiDP5CFrOP";
        const REDIRECT_URI = ${FRONT_PROXY}/my-profile/;
        const SCOPE = "openid profile email logins_count";

        export { FRONT_PROXY, API_URL, DOMAIN, CLIENT_ID, REDIRECT_URI, SCOPE };

Se debe cambiar la constante `FRONT_PROXY` y la constante `APi_URL` a lo mismo que se eligió en la configuración del entorno del Back. Siguiendo el ejemplo anterior, este archivo se vería de la siguiente forma:

        //const FRONT_PROXY = import.meta.env.PROXY;
        const FRONT_PROXY = "http://localhost:5173";
        const API_URL = "http://api:8000";

        //Auth0 Config Params
        const DOMAIN = "dev-ju2sb7gpzdrwv31f.us.auth0.com";
        const CLIENT_ID = "Ss50jxHUP31QbXzYJHn2NHOiDP5CFrOP";
        const REDIRECT_URI = ${FRONT_PROXY}/my-profile/;
        const SCOPE = "openid profile email logins_count";

        export { FRONT_PROXY, API_URL, DOMAIN, CLIENT_ID, REDIRECT_URI, SCOPE };

## Paso 5: Levantar el Front

Para levantar el Front se utliza `yarn` y se deben ejecutar los siguientes comandos en un terminal en el directorio `legit-proyect`:

    yarn
    yarn dev

## Paso 6: Accediendo a la App

Para acceder a la app se debe, en un navegador, ir a la URL especificada en la variable `FRONT_URL`, en el caso del ejemplo, la siguiente URL `http://localhost:5173`
