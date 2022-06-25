import pino from 'pino';
import createApp from 'app';

const isDev = process.env.NODE_ENV === 'development';

const server = createApp({
  logger: pino({ transport: { target: 'pino-pretty' }, enabled: isDev }),
});

const ADDRESS = isDev ? 'localhost' : '0.0.0.0';
const PORT = parseInt(process.env.PORT || '3000', 10);

server.listen({ port: PORT, host: ADDRESS });

process.on('exit', () => {
  server.close();
});
