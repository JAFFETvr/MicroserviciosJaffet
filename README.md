# Proyecto de Microservicios (React, Node.js, MySQL) con Docker Compose

Este proyecto implementa una arquitectura de microservicios de 3 niveles desplegada en un servidor en la nube de AWS. El objetivo es demostrar cómo Docker Compose puede orquestar un frontend, un backend y una base de datos persistente como un sistema unificado.

## Arquitectura del Proyecto

El sistema sigue una arquitectura de 3 niveles clásica, pero cada nivel está contenido en su propio servicio Docker:

* **Capa de Presentación (Frontend):** Un contenedor `vicente-frontend` que sirve una aplicación de React (Vite).
* **Capa de Lógica (Backend):** Un contenedor `vicente-api` que ejecuta una API REST en Node.js (Express).
* **Capa de Datos (Base de Datos):** Un contenedor `vicente-mysql` que corre una instancia de MySQL 8.0.

Los archivos clave que definen esta infraestructura son:
* `docker-compose.yml`: El "director de orquesta" que define los servicios, redes y volúmenes.
* `MicroserveFront/Dockerfile`: Las instrucciones para construir la imagen de producción del frontend.
* `mircroserverbackend/Dockerfile`: Las instrucciones para construir la imagen de producción del backend.
* `.dockerignore`: Archivos en cada servicio para evitar que `node_modules` locales se copien en la imagen, forzando una instalación limpia dentro del contenedor.

---

## Servicios Incluidos

El `docker-compose.yml` define tres servicios:

### 1. `vicente-frontend` (El Frontend)
* **Qué es:** Sirve la interfaz de usuario con la que interactúa el cliente.
* **Tecnología:** Es una aplicación de React construida con Vite. No usamos Nginx; en su lugar, el `Dockerfile` utiliza `serve` (un servidor estático de Node.js) para servir los archivos de build.
* **Puerto:** `3000:3000` (El puerto 3000 del contenedor se mapea al puerto 3000 de la instancia EC2).

### 2. `vicente-api` (El Backend)
* **Qué es:** La API REST que maneja la lógica de negocio y las operaciones CRUD.
* **Tecnología:** Una API de Node.js (Express) que se conecta a MySQL.
* **Puerto:** `5000:5000` (El puerto 5000 del contenedor se mapea al puerto 5000 de la instancia EC2).

### 3. `vicente-mysql` (La Base de Datos)
* **Qué es:** La base de datos SQL que almacena los datos de la aplicación.
* **Tecnología:** Imagen oficial de `mysql:8.0`.
* **Puerto:** `3306:3306` (Se mapea al host para permitir la conexión directa con herramientas como MySQL Workbench).
* **Persistencia:** Los datos se guardan en un **volumen nombrado** (`mysql-data`). Esto es crucial, ya que permite que los datos sobrevivan incluso si el contenedor es destruido y recreado.

---

## ¿Cómo se Comunican?

Este es el concepto más importante del proyecto. La comunicación ocurre de dos maneras:

### 1. Comunicación Externa (Cliente $\rightarrow$ Servidor)
Este es el tráfico que viene de Internet y usa la **IP pública** de la instancia EC2.

1.  **Frontend:** El usuario abre `http://54.205.37.182:3000` en su navegador. El servidor EC2 dirige esta petición al contenedor `vicente-frontend`.
2.  **API:** La aplicación React (que ya está en el navegador del usuario) necesita datos. Realiza una petición `fetch` a la API usando la URL completa: `http://54.205.37.182:5000/items`. El servidor EC2 dirige esto al contenedor `vicente-api`.

Esta URL de la API se "hornea" en el código de React durante el *build* gracias al archivo `MicroserveFront/.env`.

### 2. Comunicación Interna (Servidor $\rightarrow$ Servidor)
Este es el tráfico *dentro* de la instancia EC2, entre contenedores. **Nunca usa la IP pública.**

* **API $\rightarrow$ Base de Datos:** Cuando el `vicente-api` necesita hablar con la base de datos, no usa `localhost` ni la IP pública. Docker Compose crea una red privada (`microservice-network`) donde los servicios pueden encontrarse usando sus **nombres de servicio** como si fueran DNS.
* En el `docker-compose.yml`, la API tiene una variable de entorno `DB_HOST: vicente-mysql`. Esto le dice a la API que el host de la base de datos se llama `vicente-mysql`, y Docker se encarga de resolver esa conexión.

---

## Cómo Levantar el Entorno (En la Instancia EC2)

Sigue estos pasos para desplegar la aplicación en el servidor.

### Configuración de Primera Vez
Solo necesitas hacer esto una vez (o si cambias la IP).

1.  Clona el repositorio: `git clone https://github.com/JAFFETvr/MicroserviciosJaffet.git`
2.  Navega a la carpeta del proyecto: `cd MicroserviciosJaffet`
3.  Crea el archivo `.env` del frontend: `nano MicroserveFront/.env`
4.  Pega el siguiente contenido (esta es la URL pública que usará el navegador):
    ```
    VITE_API_URL=[http://54.205.37.182:5000](http://54.205.37.182:5000)
    VITE_MI_NOMBRE=Carlos Jaffet
    ```
5.  Crea el `.dockerignore` del backend para evitar conflictos con `node_modules`:
    ```bash
    nano mircroserverbackend/.dockerignore
    ```
6.  Pega el siguiente contenido:
    ```
    node_modules
    .env
    ```

### Comandos de Despliegue (Cada vez que inicies)

1.  Asegúrate de estar en la raíz del proyecto (`MicroserviciosJaffet`).
2.  **Define la variable de entorno** que tu `docker-compose.yml` usará para las contraseñas de la base de datos:
    ```bash
    export PASS="Charly1982"
    ```
3.  **Construye las imágenes y levanta los contenedores** en modo "detached" (segundo plano):
    ```bash
    docker compose up --build -d
    ```
    * `--build`: Fuerza a Docker a reconstruir las imágenes (necesario si cambiaste el `.env` del frontend o cualquier `Dockerfile`).
    * `-d`: Corre los contenedores en segundo plano.

### Endpoints de Acceso

* **Aplicación Web (Frontend):** `http://54.205.37.182:3000`
* **API (Endpoint de Nombre):** `http://54.205.37.182:5000/VicenteRincon/nombre-completo`
* **Base de Datos (Workbench):** `Host: 54.205.37.182`, `Puerto: 3306`

### Comandos Útiles

* **Ver los contenedores en ejecución:** `docker compose ps`
* **Ver los logs de un servicio (ej. la API):** `docker compose logs vicente-api`
* **Detener y eliminar los contenedores:** `docker compose down`
* **Detener y eliminar contenedores Y el volumen de la DB:** `docker compose down -v`

---

## Repositorio del Proyecto

[https://github.com/JAFFETvr/MicroserviciosJaffet.git](https://github.com/JAFFETvr/MicroserviciosJaffet.git)