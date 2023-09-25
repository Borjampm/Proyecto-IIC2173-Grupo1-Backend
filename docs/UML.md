# Diagrama UML y Explicación

A continuación, se presenta el diagrama UML desarrollado para nuestra app:

![UML](UML_Diagram.png)

El diagrama tiene diversos componentes y bloques. Primero comenzaremos con EC2, que contiene la API que controla la lógica de la aplicación. Esta se conecta al exterior a traves del componente nginx. Por dentro, la API esta conectada a la base de datos y a dos brokers MQTT. Uno escucha el estado de los stocks mientras que el otro las validaciones de las compras. Ambos listeners están conectados al componente externo Broker. EC2 se conecta a una API gateway, la cual además se conecta a CloudFront, un CDN que permite que la aplicación sea más rápida. Además, hay un custom Authorizer que se conecta a la API Gateway y que permite separar la lógica de authentificación de la API. A CloudFront se conecta un componente S3 con el front de la aplicación. Finamente, se usa un componente externo Auth0 para manejar la authentificación de los usuarios.
