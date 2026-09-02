import { createServer } from 'node:http';
import { createReadStream, promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteRoot = path.resolve(process.env.SITE_ROOT || path.join(projectRoot, 'out'));
const dataFile = path.resolve(process.env.EVENTS_DATA_FILE || path.join(siteRoot, 'data', 'events.json'));
const adminHtml = path.join(projectRoot, 'server', 'admin.html');
const adminUser = process.env.ADMIN_USER || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD;
const adminPath = process.env.ADMIN_PATH || '/backstage-events-drevo-7f3b9a';
const port = Number(process.env.PORT || 3011);

if (!adminPassword) {
  console.error('Set ADMIN_PASSWORD before starting the admin server.');
  process.exit(1);
}

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.mp4', 'video/mp4'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

const send = (response, status, body, contentType = 'text/plain; charset=utf-8') => {
  response.writeHead(status, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });
  response.end(body);
};

const isAuthorized = (request) => {
  const header = request.headers.authorization || '';
  if (!header.startsWith('Basic ')) return false;
  const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
  const separator = decoded.indexOf(':');
  if (separator === -1) return false;
  return decoded.slice(0, separator) === adminUser && decoded.slice(separator + 1) === adminPassword;
};

const requireAuth = (request, response) => {
  if (isAuthorized(request)) return true;
  response.writeHead(401, {
    'WWW-Authenticate': 'Basic realm="Drevo events admin"',
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end('Authorization required');
  return false;
};

const readBody = async (request) => {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
};

const cleanEvents = (input) => {
  if (!Array.isArray(input)) throw new Error('Events data must be an array.');

  return input.map((item) => ({
    date: String(item?.date || '').trim(),
    event: String(item?.event || '').trim(),
    venue: String(item?.venue || '').trim(),
    url: String(item?.url || '').trim(),
  })).filter((item) => item.date || item.event || item.venue || item.url);
};

const saveEvents = async (events) => {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  const temporaryFile = `${dataFile}.tmp`;
  await fs.writeFile(temporaryFile, `${JSON.stringify(events, null, 2)}\n`, 'utf8');
  await fs.rename(temporaryFile, dataFile);
};

const serveFile = async (requestPath, response) => {
  const normalizedPath = requestPath === '/' ? '/index.html' : requestPath;
  const decodedPath = decodeURIComponent(normalizedPath);
  const filePath = path.resolve(siteRoot, `.${decodedPath}`);

  if (!filePath.startsWith(siteRoot)) {
    send(response, 403, 'Forbidden');
    return;
  }

  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'Content-Type': mimeTypes.get(path.extname(filePath)) || 'application/octet-stream',
    });
    createReadStream(filePath).pipe(response);
  } catch {
    send(response, 404, 'Not found');
  }
};

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

  try {
    if (url.pathname === adminPath || url.pathname === `${adminPath}/`) {
      if (!requireAuth(request, response)) return;
      const html = await fs.readFile(adminHtml, 'utf8');
      send(response, 200, html, 'text/html; charset=utf-8');
      return;
    }

    if (url.pathname === '/api/events') {
      if (!requireAuth(request, response)) return;

      if (request.method === 'GET') {
        const data = await fs.readFile(dataFile, 'utf8').catch(() => '[]');
        send(response, 200, data, 'application/json; charset=utf-8');
        return;
      }

      if (request.method === 'PUT') {
        const events = cleanEvents(JSON.parse(await readBody(request)));
        await saveEvents(events);
        send(response, 200, JSON.stringify({ ok: true, events }), 'application/json; charset=utf-8');
        return;
      }

      send(response, 405, 'Method not allowed');
      return;
    }

    await serveFile(url.pathname, response);
  } catch (error) {
    send(response, 500, error instanceof Error ? error.message : 'Server error');
  }
});

server.listen(port, () => {
  console.log(`Drevo admin server is running on http://127.0.0.1:${port}`);
});
