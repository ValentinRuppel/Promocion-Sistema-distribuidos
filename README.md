# Inventario Distribuido con CRDTs (Y.js)

Trabajo de promoción para la asignatura **Sistemas Distribuidos**.
Este proyecto implementa un sistema de inventario compartido utilizando **CRDTs (Conflict-free Replicated Data Types)** para garantizar la consistencia eventual de datos entre múltiples nodos, incluso tras desconexiones de red.

## 📋 Descripción Técnica

* **Librería Core:** [Y.js](https://docs.yjs.dev/) (CRDT optimizado).
* **Protocolo:** WebSockets para la sincronización de estados.
* **Arquitectura:**
    * **Servidor de Señalización (Docker):** Un contenedor aislado que retransmite los cambios (deltas) entre clientes. No persiste la verdad absoluta, solo facilita el "gossip".
    * **Clientes (Node.js):** Procesos independientes que mantienen su propia copia local del estado (`Y.Doc`) y convergen automáticamente al conectarse.

## 🚀 Instrucciones de Ejecución (Docker)

Para evitar conflictos de versiones de Node.js y rutas de sistema, se ha dockerizado el servidor de señalización.

### Prerrequisitos
* Docker y Docker Compose instalados.
* Node.js instalado (para correr los clientes).

### 1. Iniciar el Servidor
Ejecutar el siguiente comando en la raíz del proyecto para construir y levantar el servidor de sincronización:

```bash
docker-compose up -d --build