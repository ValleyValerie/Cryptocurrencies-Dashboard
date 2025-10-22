import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.emit('stats-update', generateStats());

    const statsInterval = setInterval(() => {
      socket.emit('stats-update', generateStats());
    }, 3000);

    const chartInterval = setInterval(() => {
      socket.emit('chart-update', generateChartData());
    }, 2000);

    const tableInterval = setInterval(() => {
      socket.emit('table-update', generateTableData());
    }, 5000);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      clearInterval(statsInterval);
      clearInterval(chartInterval);
      clearInterval(tableInterval);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

// --- Helper functions ---
function generateStats() {
  return {
    totalUsers: Math.floor(Math.random() * 1000) + 5000,
    activeUsers: Math.floor(Math.random() * 500) + 1000,
    revenue: Math.floor(Math.random() * 50000) + 100000,
    growth: (Math.random() * 30 - 10).toFixed(2),
  };
}

function generateChartData() {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      timestamp: new Date(Date.now() - (9 - i) * 60000).toISOString(),
      value: Math.floor(Math.random() * 100) + 50,
    });
  }
  return data;
}

function generateTableData() {
  const statuses = ['active', 'inactive', 'pending'];
  const names = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta', 'Project Epsilon'];

  return names.map((name, i) => ({
    id: `row-${i}`,
    name,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    value: Math.floor(Math.random() * 10000),
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  }));
}
