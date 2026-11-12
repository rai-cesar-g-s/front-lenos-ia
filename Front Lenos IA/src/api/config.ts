const configuredUrl = import.meta.env.VITE_API_URL?.trim();
if (!configuredUrl) throw new Error('Configure VITE_API_URL no arquivo .env antes de iniciar o frontend.');

const parsedUrl = new URL(configuredUrl);
const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(parsedUrl.hostname);
if (parsedUrl.protocol !== 'https:' && !(isLocal && parsedUrl.protocol === 'http:')) {
  throw new Error('VITE_API_URL deve usar HTTPS, exceto em desenvolvimento local.');
}
if (parsedUrl.username || parsedUrl.password || parsedUrl.search || parsedUrl.hash) {
  throw new Error('VITE_API_URL deve conter apenas o endereço base da API, sem credenciais ou parâmetros.');
}
export const API_BASE_URL = configuredUrl.replace(/\/+$/, '');
