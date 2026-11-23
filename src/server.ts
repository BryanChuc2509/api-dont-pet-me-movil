import { networkInterfaces } from 'node:os';

import { createApp } from './app.js';
import { env } from './config/env.js';

/** IPs de la red local: la app móvil en un teléfono físico debe usar una de estas, no localhost. */
function lanAddresses() {
  return Object.values(networkInterfaces())
    .flat()
    .filter((n) => n && n.family === 'IPv4' && !n.internal)
    .map((n) => n!.address);
}

const server = createApp().listen(env.PORT, '0.0.0.0', () => {
  console.log(`\n🐹 Don't Pet Me API escuchando en el puerto ${env.PORT}`);
  console.log(`   Local:      http://localhost:${env.PORT}/api/v1`);
  for (const ip of lanAddresses()) console.log(`   Red local:  http://${ip}:${env.PORT}/api/v1`);
  console.log('');
});

function shutdown(signal: string) {
  console.log(`\n${signal} recibido, cerrando servidor...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
