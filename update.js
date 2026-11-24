module.exports = {
  run: [
    {
      method: "log",
      params: {
        message: "=== Hunyuan3D-2-LowVRAM: обновление ==="
      }
    },
    {
      method: "log",
      params: {
        message: "[1/3] Обновляем репозиторий лаунчера (git pull)..."
      }
    },
    {
      method: "shell.run",
      "params": {
        message: "echo \"=== [1/3] git pull (launcher) ===\" & git pull && echo \"   ✅ Лаунчер обновлён\" || echo \"   ⚠️ git pull не удался, продолжаем ===\""
      }
    },
    {
      method: "log",
      params: {
        message: "[2/3] Обновляем репозиторий приложения app/ (git pull)..."
      }
    },
    {
      method: "shell.run",
      "params": {
        message: "echo \"=== [2/3] git pull (app) ===\" & git pull && echo \"   ✅ Приложение обновлено\" || echo \"   ⚠️ git pull в app/ не удался, продолжаем ===\"",
        path: "app"
      }
    },
    {
      method: "log",
      params: {
        message: "[3/3] Переустанавливаем окружение (удаляем app/env)..."
      }
    },
    {
      method: "shell.run",
      "params": {
        message: "echo \"=== [3/3] Удаление app/env ===\" & {{platform === 'win32' ? 'rd /s /q app\\env 2>nul' : 'rm -rf app/env'}} & echo \"=== [3/3] app/env удалён, готово к переустановке через Install ===\""
      }
    },
    {
      method: "log",
      params: {
        message: "=== Hunyuan3D-2-LowVRAM: обновление завершено. Запустите Install для переустановки зависимостей. ==="
      }
    }
  ]
}
