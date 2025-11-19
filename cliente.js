import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import WebSocket from 'ws';
import readline from 'readline';

// 1. Configuración
const clientName = process.argv[2] || 'Cliente_Generico';
const doc = new Y.Doc();

const wsProvider = new WebsocketProvider(
  'ws://localhost:1234',
  'inventario-demo', 
  doc, 
  { WebSocketPolyfill: WebSocket }
);

wsProvider.on('status', event => {
  console.log(`[Red] Estado: ${event.status}`);
});

// 2. Datos Compartidos
const inventario = doc.getMap('inventario');

// 3. Observabilidad (Lo que pide la consigna)
inventario.observe(() => {
  console.log('\n--- ESTADO ACTUALIZADO ---');
  console.log(inventario.toJSON());
  console.log('---------------------------\n');
});

// 4. Interfaz de Consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
Iniciando proceso para: ${clientName}
----------------------------------------
Instrucciones:
- Escribe "set <producto> <cantidad>" (ej: set manzanas 50)
- Escribe "delete <producto>"
- Escribe "desconectar" (Simula modo Offline)
- Escribe "conectar" (Vuelve Online)
`);

rl.on('line', (line) => {
  const args = line.trim().split(' ');
  const cmd = args[0];

  if (cmd === 'set') {
    const producto = args[1];
    const cantidad = parseInt(args[2]);
    if (!producto || isNaN(cantidad)) {
        console.log("Formato incorrecto. Usa: set <nombre> <numero>");
        return;
    }
    doc.transact(() => {
      inventario.set(producto, cantidad);
    }, clientName);
    console.log(`[Local] ${producto} actualizado a ${cantidad}`);
  
  } else if (cmd === 'delete') {
    const producto = args[1];
    inventario.delete(producto);
    console.log(`[Local] ${producto} eliminado`);

  } else if (cmd === 'desconectar') {
    wsProvider.disconnect();
    console.log('[Red] Desconectado (Modo Offline)...');

  } else if (cmd === 'conectar') {
    wsProvider.connect();
    console.log('[Red] Reconectando...');
  }
});