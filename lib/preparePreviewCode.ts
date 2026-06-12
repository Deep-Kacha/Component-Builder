export function preparePreviewCode(code: string): string {
  return code
    .split("\n")
    .filter((line) => !/^\s*import\s+/.test(line))
    .join("\n")
    .replace(/export\s+default\s+function\s+(\w+)/g, "function $1")
    .replace(/export\s+default\s+(\w+)\s*;?/g, "")
    .trim();
}

export function buildIframePreviewHtml(code: string): string {
  const componentCode = preparePreviewCode(code);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
      html, body, #root { margin: 0; min-height: 100%; width: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel" data-presets="react,typescript">
      const {
        useState,
        useEffect,
        useCallback,
        useMemo,
        useRef,
        useReducer,
        useId,
      } = React;

      ${componentCode}

      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(
        <div className="flex min-h-full w-full items-start justify-center bg-zinc-50 p-6">
          <Component />
        </div>
      );
    </script>
  </body>
</html>`;
}
