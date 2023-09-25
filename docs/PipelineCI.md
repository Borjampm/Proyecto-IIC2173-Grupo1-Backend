# Documentación de Continous Implementation

A continuación se detallan los workflows implementados para prevenir errores al trabajar de esta manera

## GitGuardian

Se creó un workflow de GitGuardian, el cual revisa si existen variables de entorno hardcodeadas o expuestas, lo cual puede comprometer la seguridad de la aplicación. Para esto se conectó con la API externa de GitGuardian y se generó un token, el cual está guardado en los secretos del repositorio del back. Se configuró este workflow para que cada vez que se haga un pull request se revise los archivos.

## Linter (por implementar)

El segundo workflow consiste en un linter check que revisa el codigo y detecta errores de notación siguiendo la guía *Airbnb*. En caso de detectar uno, levanta un error al hacer una pull requests.
