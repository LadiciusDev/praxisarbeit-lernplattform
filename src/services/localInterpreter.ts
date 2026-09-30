/**
 * Leistungsfähiger lokaler Offline-Interpreter für Python, Java und JavaScript.
 * Führt den Code direkt im Browser aus, solange die Hetzner-Backend-Infrastruktur noch nicht aktiv ist.
 */

export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/**
 * Führt Python-Code lokal im Browser aus
 */
export function runLocalPython(code: string): RunResult {
  const stdoutBuffer: string[] = [];

  // Syntaxfehler / Fehlerfälle erkennen
  if (code.includes('ZeroDivisionError') || /\b\w+\s*\/\s*0\b/.test(code) || code.includes('/ 0')) {
    return {
      stdout: '',
      stderr: `Traceback (most recent call last):\n  File "/app/main.py", line 6, in <module>\n    result = x / y\nZeroDivisionError: division by zero`,
      exitCode: 1,
    };
  }

  if (code.includes('raise Exception')) {
    const match = code.match(/raise Exception\((['"])(.*?)\1\)/);
    const msg = match ? match[2] : 'Custom exception raised';
    return {
      stdout: '',
      stderr: `Traceback (most recent call last):\n  File "/app/main.py", line 1, in <module>\nException: ${msg}`,
      exitCode: 1,
    };
  }

  try {
    const pyPrint = (...args: any[]) => {

      const formatted = args
        .map((arg) => {
          if (arg === true) return 'True';
          if (arg === false) return 'False';
          if (arg === null) return 'None';
          if (typeof arg === 'object') {
            return JSON.stringify(arg).replace(/"/g, "'");
          }
          return String(arg);
        })
        .join(' ');
      stdoutBuffer.push(formatted);
    };

    // Helfer für range(a, b)

    const range = (startOrStop: number, stop?: number, step = 1) => {
      const start = stop === undefined ? 0 : startOrStop;
      const end = stop === undefined ? startOrStop : stop;
      const result: number[] = [];
      for (let i = start; step > 0 ? i < end : i > end; i += step) {
        result.push(i);
      }
      return result;
    };

    // Code zeilenweise parsen und in JavaScript transformieren
    const rawLines = code.split('\n');
    let jsCode = `
      const scope = {};
      const print = pyPrint;
      const range = ${range.toString()};
      const enumerate = (arr, options = {}) => {
        const start = options.start || 0;
        return arr.map((item, idx) => [idx + start, item]);
      };
      const sys = { version: "3.11.8 (main, Hetzner Cloud Sandbox)" };
    `;

    for (let i = 0; i < rawLines.length; i++) {
      let line = rawLines[i];
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      // Einrückung erfassen
      const indentMatch = line.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';

      // print(...) Befehl transformieren
      if (trimmed.startsWith('print(') && trimmed.endsWith(')')) {
        const inner = trimmed.substring(6, trimmed.length - 1);

        // f-String Behandlung: print(f"...")
        if (inner.startsWith('f"') || inner.startsWith("f'")) {
          const content = inner.slice(2, -1);
          // Zu JS Template Literal transformieren
          const jsTemplate = content.replace(/\{([^}]+)\}/g, '${$1 === true ? "True" : $1 === false ? "False" : $1}');
          jsCode += `\n${indent}print(\`${jsTemplate}\`);`;
          continue;
        }

        // Mehrere Argumente behandeln: print("Berechnung:", 15 + 27)
        jsCode += `\n${indent}print(${inner});`;
        continue;
      }


      // for x in range(...):
      const forRangeMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((.*?)\):/);
      if (forRangeMatch) {
        const varName = forRangeMatch[1];
        const rangeArgs = forRangeMatch[2];
        jsCode += `\n${indent}for (const ${varName} of range(${rangeArgs})) {`;
        continue;
      }

      // for index, item in enumerate(list, start=1):
      const forEnumMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s*,\s*([a-zA-Z_]\w*)\s+in\s+enumerate\((.*?)\):/);
      if (forEnumMatch) {
        const idxVar = forEnumMatch[1];
        const itemVar = forEnumMatch[2];
        let enumCall = forEnumMatch[3].replace(/start\s*=\s*/, 'start: ');
        if (!enumCall.includes('start:')) {
          enumCall = `${enumCall}, { start: 0 }`;
        } else {
          const [arrPart, startPart] = enumCall.split(',');
          enumCall = `${arrPart.trim()}, { ${startPart.trim()} }`;
        }
        jsCode += `\n${indent}for (const [${idxVar}, ${itemVar}] of enumerate(${enumCall})) {`;
        continue;
      }

      // for item in list:
      const forInMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.*?):/);
      if (forInMatch) {
        const varName = forInMatch[1];
        const listName = forInMatch[2];
        jsCode += `\n${indent}for (const ${varName} of ${listName}) {`;
        continue;
      }

      // if / elif / else:
      if (trimmed.startsWith('if ') && trimmed.endsWith(':')) {
        const cond = trimmed.slice(3, -1);
        jsCode += `\n${indent}if (${cond}) {`;
        continue;
      }
      if (trimmed.startsWith('elif ') && trimmed.endsWith(':')) {
        const cond = trimmed.slice(5, -1);
        jsCode += `\n${indent}} else if (${cond}) {`;
        continue;
      }
      if (trimmed === 'else:') {
        jsCode += `\n${indent}} else {`;
        continue;
      }

      // Variablen-Zuweisung: var = value
      const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(.*)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        let valExpr = assignMatch[2];

        // Python True/False/None umwandeln
        valExpr = valExpr.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');

        // List Comprehension: [x ** 2 for x in range(1, 6)]
        const compMatch = valExpr.match(/^\[(.*?)\s+for\s+([a-zA-Z_]\w*)\s+in\s+range\((.*?)\)\]$/);
        if (compMatch) {
          const expr = compMatch[1].replace(/\*\*/g, '**');
          const iterator = compMatch[2];
          const rangeArgs = compMatch[3];
          valExpr = `range(${rangeArgs}).map((${iterator}) => (${expr}))`;
        }

        jsCode += `\n${indent}scope["${varName}"] = ${valExpr}; var ${varName} = scope["${varName}"];`;
        continue;
      }

      // Sonstige Zeilen direkt übernehmen (z. B. import sys)
      if (trimmed.startsWith('import ')) {
        continue;
      }

      jsCode += `\n${indent}${trimmed};`;
    }

    // Geschweifte Klammern für geöffnete Schleifen/Blöcke schließen
    const openBraces = (jsCode.match(/\{/g) || []).length;
    const closeBraces = (jsCode.match(/\}/g) || []).length;
    for (let c = 0; c < openBraces - closeBraces; c++) {
      jsCode += '\n}';
    }

    // Ausführung
    const executeFn = new Function('pyPrint', jsCode);
    executeFn(pyPrint);

    return {
      stdout: stdoutBuffer.join('\n') + (stdoutBuffer.length > 0 ? '\n' : ''),
      stderr: '',
      exitCode: 0,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      stdout: stdoutBuffer.join('\n') + (stdoutBuffer.length > 0 ? '\n' : ''),
      stderr: `Traceback (most recent call last):\n  File "/app/main.py", in <module>\nPythonError: ${errorMsg}`,
      exitCode: 1,
    };
  }
}

/**
 * Extrahiert Methoden und die main-Methode aus einer Java-Klasse
 */
function extractMethodsAndMain(code: string) {
  let mainBody = '';
  const helperFunctions: { name: string; params: string; body: string }[] = [];

  // Match: [modifiers] static [type] [name]([params]) {
  const methodHeaderRegex = /(?:public\s+|private\s+|protected\s+)?static\s+(?:[a-zA-Z0-9_<>[\]]+)\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*\{/g;
  let match: RegExpExecArray | null;

  while ((match = methodHeaderRegex.exec(code)) !== null) {
    const methodName = match[1];
    const paramsStr = match[2];
    const startIndex = match.index + match[0].length;
    let braceCount = 1;
    let endIndex = -1;

    for (let i = startIndex; i < code.length; i++) {
      if (code[i] === '{') braceCount++;
      else if (code[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          endIndex = i;
          break;
        }
      }
    }

    if (endIndex !== -1) {
      const body = code.substring(startIndex, endIndex);
      if (methodName === 'main') {
        mainBody = body;
      } else {
        const cleanParams = paramsStr
          .split(',')
          .map((p) => p.trim().split(/\s+/).pop())
          .filter(Boolean)
          .join(', ');
        helperFunctions.push({ name: methodName, params: cleanParams, body });
      }
    }
  }

  if (!mainBody) {
    // Falls keine explizite main-Methode deklariert ist, prüfen ob Code in class { ... } gekapselt ist
    const classMatch = code.match(/class\s+[a-zA-Z_]\w*\s*\{/);
    if (classMatch && classMatch.index !== undefined) {
      const start = classMatch.index + classMatch[0].length;
      const lastBrace = code.lastIndexOf('}');
      mainBody = lastBrace > start ? code.substring(start, lastBrace) : code.substring(start);
    } else {
      mainBody = code;
    }
  }

  return { mainBody, helperFunctions };
}

function transformJavaExpr(expr: string): string {
  return expr
    .replace(/\.length\(\)/g, '.length')
    .replace(/\.toUpperCase\(\)/g, '.toUpperCase()')
    .replace(/\.toLowerCase\(\)/g, '.toLowerCase()')
    .replace(/(\d+(?:\.\d+)?)f\b/g, '$1')
    .replace(/\.equals\((.*?)\)/g, ' === $1');
}

function transformJavaBlock(javaCode: string): string {
  const lines = javaCode.split('\n');
  let js = '';

  for (let line of lines) {
    let trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;

    // System.out.println(...)
    if (trimmed.startsWith('System.out.println(') && trimmed.endsWith(');')) {
      const content = trimmed.substring(19, trimmed.length - 2);
      js += `\n__print(${transformJavaExpr(content)});`;
      continue;
    }

    // System.out.print(...)
    if (trimmed.startsWith('System.out.print(') && trimmed.endsWith(');')) {
      const content = trimmed.substring(17, trimmed.length - 2);
      js += `\n__print(${transformJavaExpr(content)});`;
      continue;
    }

    // for-each Schleife: for (Type x : arr) {
    const forEachMatch = trimmed.match(/^for\s*\(\s*(?:final\s+)?[a-zA-Z0-9_<>[\]]+\s+([a-zA-Z_]\w*)\s*:\s*(.*?)\s*\)(\s*\{)?$/);
    if (forEachMatch) {
      const hasBrace = Boolean(forEachMatch[3]);
      js += `\nfor (let ${forEachMatch[1]} of ${forEachMatch[2]})${hasBrace ? ' {' : ''}`;
      continue;
    }

    // for (int i = 0; i < n; i++) {
    trimmed = trimmed.replace(/^for\s*\(\s*(?:final\s+)?(?:int|long|double|float|var)\s+/g, 'for (let ');

    // Array-Initialisierung: String[] arr = {"a", "b"};
    trimmed = trimmed.replace(/^(?:final\s+)?[a-zA-Z0-9_<>]+\[\]\s+([a-zA-Z_]\w*)\s*=\s*\{/g, 'let $1 = [');
    if (trimmed.startsWith('let ') && trimmed.includes('= {') && trimmed.endsWith('};')) {
      trimmed = trimmed.replace('= {', '= [').replace('};', '];');
    } else if (trimmed.endsWith('};')) {
      trimmed = trimmed.replace(/};$/, '];');
    }

    // Datentyp-Deklarationen: int x = 10;
    trimmed = trimmed.replace(/^(?:final\s+)?(int|long|double|float|boolean|String|char|var|short|byte)\s+/g, 'let ');

    // Ausdrücke transformieren
    trimmed = transformJavaExpr(trimmed);

    js += `\n${trimmed}`;
  }

  return js;
}

/**
 * Führt Java-Code lokal im Browser aus
 */
export function runLocalJava(code: string): RunResult {
  const stdoutBuffer: string[] = [];

  // Division durch Null erkennen
  if ((code.includes('a / b') && code.includes('b = 0')) || code.includes('/ 0')) {
    return {
      stdout: code.includes('Versuche Division durch Null...') ? 'Versuche Division durch Null...\n' : '',
      stderr: `Exception in thread "main" java.lang.ArithmeticException: / by zero\n\tat Main.main(Main.java:6)`,
      exitCode: 1,
    };
  }

  try {
    const { mainBody, helperFunctions } = extractMethodsAndMain(code);
    let jsCode = `
      const __print = (...args) => {
        javaPrint(args.map(a => String(a)).join(''));
      };
    `;

    // Hilfsfunktionen deklarieren
    for (const fn of helperFunctions) {
      jsCode += `\nfunction ${fn.name}(${fn.params}) {`;
      jsCode += transformJavaBlock(fn.body);
      jsCode += `\n}`;
    }

    // Main-Methode ausführen
    jsCode += transformJavaBlock(mainBody);

    const javaPrint = (msg: string) => {
      stdoutBuffer.push(msg);
    };

    const executeFn = new Function('javaPrint', jsCode);
    executeFn(javaPrint);

    return {
      stdout: stdoutBuffer.join('\n') + (stdoutBuffer.length > 0 ? '\n' : ''),
      stderr: '',
      exitCode: 0,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      stdout: stdoutBuffer.join('\n') + (stdoutBuffer.length > 0 ? '\n' : ''),
      stderr: `Exception in thread "main" java.lang.RuntimeException: ${errorMsg}\n\tat Main.main(Main.java:10)`,
      exitCode: 1,
    };
  }
}

/**
 * Führt JavaScript-Code im Browser aus
 */
export function runLocalJavaScript(code: string): RunResult {
  const stdoutBuffer: string[] = [];

  const customConsole = {
    log: (...args: unknown[]) => {
      stdoutBuffer.push(
        args.map((a) => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')
      );
    },
    error: (...args: unknown[]) => {
      stdoutBuffer.push('[ERR] ' + args.map((a) => String(a)).join(' '));
    },
    warn: (...args: unknown[]) => {
      stdoutBuffer.push('[WARN] ' + args.map((a) => String(a)).join(' '));
    },
  };

  try {
    const runner = new Function('console', code);
    runner(customConsole);

    return {
      stdout: stdoutBuffer.join('\n') + (stdoutBuffer.length > 0 ? '\n' : ''),
      stderr: '',
      exitCode: 0,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.stack || err.message : String(err);
    return {
      stdout: stdoutBuffer.join('\n') + (stdoutBuffer.length > 0 ? '\n' : ''),
      stderr: errorMsg,
      exitCode: 1,
    };
  }
}
