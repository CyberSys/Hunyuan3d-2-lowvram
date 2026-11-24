module.exports = {
  run: [
    {
      method: "log",
      params: {
        message: "=== Hunyuan3D-2-LowVRAM: сброс ==="
      }
    },
    {
      method: "log",
      params: {
        message: "Выберите тип сброса:"
      }
    },
    {
      method: "input",
      params: {
        message: "Какой тип сброса выполнить?",
        options: [
          {
            label: "Полный сброс (удалить всё: приложение, окружение, модели, кэш)",
            value: "full"
          },
          {
            label: "Только окружение (удалить app/env, оставить модели и кэш)",
            value: "env_only"
          }
        ]
      }
    },
    {
      when: "{{input === 'full'}}",
      method: "log",
      "params": {
        message: "[1/4] Полный сброс: удаляем приложение app/..."
      }
    },
    {
      when: "{{input === 'full'}}",
      method: "shell.run",
      "params": {
        message: "echo \"=== [1/4] Удаление app/ ===\" & {{platform === 'win32' ? 'rd /s /q app 2>nul' : 'rm -rf app'}} & echo \"=== [1/4] app/ удалён ===\" || echo \"=== [1/4] ❌ ОШИБКА при удалении app/ ===\""
      }
    },
    {
      when: "{{input === 'full'}}",
      method: "log",
      "params": {
        message: "[2/4] Удаляем кэш cache/ (модели, торч, гридио)..."
      }
    },
    {
      when: "{{input === 'full'}}",
      method: "shell.run",
      "params": {
        message: "echo \"=== [2/4] Удаление cache/ ===\" & {{platform === 'win32' ? 'rd /s /q cache 2>nul' : 'rm -rf cache'}} & echo \"=== [2/4] cache/ удалён ===\" || echo \"=== [2/4] ❌ ОШИБКА при удалении cache/ ===\""
      }
    },
    {
      when: "{{input === 'full'}}",
      method: "log",
      "params": {
        message: "[3/4] Очищаем временные файлы..."
      }
    },
    {
      when: "{{input === 'full'}}",
      method: "shell.run",
      "params": {
        message: "echo \"=== [3/4] Очистка временных файлов ===\" & {{platform === 'win32' ? 'del /q /s *.log *.tmp 2>nul' : 'find . -name \"*.log\" -o -name \"*.tmp\" -delete 2>/dev/null'}} & echo \"=== [3/4] Временные файлы очищены ===\""
      }
    },
    {
      when: "{{input === 'full'}}",
      method: "log",
      "params": {
        message: "[4/4] ✅ Полный сброс завершён — всё удалено"
      }
    },
    {
      when: "{{input === 'env_only'}}",
      method: "log",
      "params": {
        message: "[1/2] Сброс окружения: удаляем только app/env (модели остаются)..."
      }
    },
    {
      when: "{{input === 'env_only'}}",
      method: "shell.run",
      "params": {
        message: "echo \"=== [1/2] Удаление app/env ===\" & {{platform === 'win32' ? 'rd /s /q app\\env 2>nul' : 'rm -rf app/env'}} & echo \"=== [1/2] app/env удалён ===\" || echo \"=== [1/2] ❌ ОШИБКА при удалении app/env ===\""
      }
    },
    {
      when: "{{input === 'env_only'}}",
      method: "log",
      "params": {
        message: "[2/2] ✅ Окружение сброшено, модели и кэш сохранены"
      }
    },
    {
      method: "log",
      params: {
        message: "=== Hunyuan3D-2-LowVRAM: сброс завершён ==="
      }
    }
  ]
}
