export type SupportedLanguage = 'python' | 'javascript' | 'java';

export interface ExecuteRequest {
  language: SupportedLanguage;
  code: string;
}

export interface ExecuteResponse {
  jobId: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
  timestamp: string;
  mocked?: boolean;
}

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error';

export interface BackendHealth {
  online: boolean;
  status: 'healthy' | 'degraded' | 'offline' | 'checking';
  message: string;
  service?: string;
  dockerAvailable?: boolean;
  supportedLanguages?: string[];
  url?: string;
  latencyMs?: number;
  lastChecked?: Date;
}
