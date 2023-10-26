# Implementación de Webpay Services

En el siguiente documento se detallan los pasos que se siguieron para implementar pagos con `Webpay`.

## Paso 1: Solicitud de compra

Cuando el usuario presiona el botón para hacer una compra, el `FRONT` se comunica con la `API`, la cual crea una transacción y la envía por el canal `stocks/requests` del broker. Además, se comunica con `Webpay` para darle un URL de regreso y pedirle un token y el url de compra, los cuales devuelve al `FRONT`.

## Paso 2: Pago con Webpay

Cuando el `FRONT` recibe la URL de `Webpay`, este redirige a esta utilizando el token también proporcionado. Durante la compra, existen tres posibilidades, que la compra sea aprobada, rechazada o anulada por el usuario. Al terminar la compra, `Webpay` redirige a la URL proporcionada por la `API` anteriormente. Sin embargo, en los dos primeros casos devuelve el token de la transacción y en el tercero no.

## Paso 3: Proceso de compra

El `Front` maneja los tres casos. Para el caso que el usuario anula la compra, se muestra en la pantalla. Sin embargo, para los otros dos hace una llamada a la `API` proporcionandole el token de la compra. La `API` llama a `Webpay` para conocer el resultado de la transacción y lo publica al canal `stocks/validation`, además de actualizar el estado de la transacción en la base de datos según este resultado.
