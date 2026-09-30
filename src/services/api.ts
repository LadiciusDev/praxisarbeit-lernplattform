import type { ExecuteRequest, ExecuteResponse, BackendHealth } from '../types/execution';
import { runLocalPython, runLocalJava, runLocalJavaScript } from './localInterpreter';

/**
 * Ermittelt die Basis-URL für den Code Execution Service.
 * Priorität:
 * 1. Explizit konfigurierte VITE_API_BASE_URL (z. B. http://localhost:8081)
 * 2. Wenn nicht gesetzt: Relativer Pfad '/api' (für Nginx Proxy auf der Hetzner Plattform-VM)
 */
export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/$/, '');
  }
  return '/api';
}

/**
 * Simuliert die Codeausführung im Browser, wenn kein Hetzner-Backend erreichbar ist.
 * Verwendet den internen Interpreter für Python, Java und JavaScript.
 */
async function simulateLocalExecution(req: ExecuteRequest): Promise<ExecuteResponse> {
  const startTime = performance.now();

  // Kleine Latenz für realistische Benutzererfahrung (Container-Start)
  await new Promise((resolve) => setTimeout(resolve, 350));

  const durationMs = Math.round(performance.now() - startTime);
  const jobId = 'mock-' + Math.random().toString(36).substring(2, 10);
  const now = new Date().toISOString();

  let runResult;

  if (req.language === 'python') {
    runResult = runLocalPython(req.code);
  } else if (req.language === 'java') {
    runResult = runLocalJava(req.code);
  } else {
    runResult = runLocalJavaScript(req.code);
  }

  return {
    jobId,
    stdout: runResult.stdout,
    stderr: runResult.stderr,
    exitCode: runResult.exitCode,
    executionTimeMs: durationMs,
    timestamp: now,
    mocked: true,
  };
}

/**
 * Sendet einen Codeausführungsauftrag an das Backend oder nutzt den Mock-Runner als Fallback.
 */
export async function executeCode(request: ExecuteRequest): Promise<ExecuteResponse> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/execute`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: AbortSignal.timeout(12000), // 12s Timeout für Netzwerk/Container
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        jobId: 'err-http',
        stdout: '',
        stderr: `Server-Fehler (${response.status}): ${errorText || response.statusText}`,
        exitCode: response.status,
        executionTimeMs: 0,
        timestamp: new Date().toISOString(),
      };
    }

    const data: ExecuteResponse = await response.json();
    return data;
  } catch (error: unknown) {
    console.warn('Backend nicht erreichbar, schalte auf lokalen Interpreter um:', error);
    // Automatischer Fallback auf internen Interpreter
    return simulateLocalExecution(request);
  }
}

/**
 * Überprüft die Erreichbarkeit und den Gesundheitszustand des Backends über /health.
 * Erst wenn /health mit status: "healthy" und dockerAvailable: true antwortet,
 * gilt der Dienst als voll verbunden (online: true).
 */
export async function checkBackendHealth(): Promise<BackendHealth> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/health`;
  const startTime = performance.now();

  try {
    const res = await fetch(endpoint, {
      signal: AbortSignal.timeout(3000),
      headers: { Accept: 'application/json' },
    });

    const latencyMs = Math.round(performance.now() - startTime);

    if (res.ok) {
      const data = await res.json();
      const isHealthy = data.status === 'healthy' && data.dockerAvailable === true;

      return {
        online: isHealthy,
        status: isHealthy ? 'healthy' : (data.status === 'degraded' ? 'degraded' : 'offline'),
        message: data.message || (isHealthy ? 'Dienst und Docker-Sandbox sind einsatzbereit.' : 'Dienst antwortet, aber Docker ist nicht bereit.'),
        service: data.service || 'execution-runner',
        dockerAvailable: Boolean(data.dockerAvailable),
        supportedLanguages: Array.isArray(data.supportedLanguages) ? data.supportedLanguages : ['python', 'javascript', 'java'],
        url: endpoint,
        latencyMs,
        lastChecked: new Date(),
      };
    }

    return {
      online: false,
      status: 'offline',
      message: `HTTP ${res.status}: Backend antwortet nicht ordnungsgemäß`,
      url: endpoint,
      latencyMs,
      lastChecked: new Date(),
    };
  } catch {
    return {
      online: false,
      status: 'offline',
      message: 'Backend offline (In-Browser Interpreter Fallback aktiv)',
      url: endpoint,
      lastChecked: new Date(),
    };
  }
}
