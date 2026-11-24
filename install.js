module.exports = {
  requires: {
    bundle: "ai"
  },
  run: [
    {
      method: "log",
      params: {
        message: "=== Hunyuan3D-2-LowVRAM: установка начата ==="
      }
    },
    {
      "when": "{{!exists('app')}}",
      "method": "log",
      "params": {
        message: "[1/6] Клонируем репозиторий приложения..."
      }
    },
    {
      "when": "{{!exists('app')}}",
      "method": "shell.run",
      "params": {
        message: [
          "echo \"=== [1/6] Клонирование репозитория приложения ===\"",
          "git clone {{platform === 'darwin' ? 'https://github.com/Tencent/Hunyuan3D-2' : 'https://github.com/SkyDev-Devision/Hunyuan3D-2GP.git'}} app && echo \"=== [1/6] ✅ УСПЕШНО: репозиторий склонирован ===\" || echo \"=== [1/6] ❌ ОШИБКА: не удалось склонировать репозиторий ===\""
        ]
      },
      on: [
        {
          event: "/(error|fatal|failed)/i",
          done: true
        }
      ]
    },
    {
      "when": "{{!exists('app')}}",
      "method": "log",
      "params": {
        message: "[1/6] ✅ Репозиторий приложения склонирован"
      }
    },
    {
      "when": "{{exists('app')}}",
      "method": "log",
      "params": {
        message: "[1/6] Репозиторий приложения уже существует, обновляем..."
      }
    },
    {
      "when": "{{exists('app')}}",
      "method": "shell.run",
      "params": {
        message: [
          "echo \"=== [1/6] Обновление репозитория приложения ===\"",
          "cd app && git pull || true && echo \"=== [1/6] ✅ УСПЕШНО: репозиторий обновлён ===\" || echo \"=== [1/6] ⚠️ ПРЕДУПРЕЖДЕНИЕ: git pull не удался, продолжаем ===\""
        ],
        path: "app"
      }
    },
    {
      "when": "{{exists('app')}}",
      "method": "log",
      "params": {
        message: "[1/6] ✅ Репозиторий приложения обновлён"
      }
    },
    {
      method: "log",
      "params": {
        message: "[2/6] Устанавливаем PyTorch и зависимости через torch.js..."
      }
    },
    {
      method: "script.start",
      params: {
        uri: "torch.js",
        params: {
          venv: "env",
          path: "app",
          // xformers: true
        }
      }
    },
    {
      method: "log",
      "params": {
        message: "[2/6] ✅ PyTorch установлен"
      }
    },
    {
      when: "{{platform === 'win32' && gpu === 'nvidia'}}",
      method: "log",
      "params": {
        message: "[3/6] Устанавливаем пакеты для Windows + NVIDIA (diso, mesh_processor)..."
      }
    },
    {
      when: "{{platform === 'win32' && gpu === 'nvidia'}}",
      method: "shell.run",
      "params": {
        build: true,
        env: {
          USE_NINJA: 0,
          DISTUTILS_USE_SDK: 1,
          TORCH_CUDA_ARCH_LIST: "6.1;7.5;8.6;8.9;12.0"
        },
        venv: "env",
        path: "app",
        message: [
          "echo \"=== [3/6] Установка пакетов Windows + NVIDIA ===\"",
          "uv pip install -r requirements.txt && echo \"   ✅ requirements.txt установлен\" || echo \"   ❌ ОШИБКА: requirements.txt\"",
          "uv pip install sentencepiece diffusers==0.33.0 gradio==5.50 huggingface_hub[hf-xet]==0.36.2 && echo \"   ✅ sentencepiece/diffusers/gradio/huggingface_hub установлены\" || echo \"   ❌ ОШИБКА: sentencepiece/diffusers/gradio/huggingface_hub\"",
          "uv pip install --no-build-isolation diso==0.1.4 && echo \"   ✅ diso==0.1.4 установлен\" || echo \"   ❌ ОШИБКА: diso==0.1.4\"",
          "uv pip install ../wheels/mesh_processor-0.0.0-cp310-cp310-win_amd64.whl && echo \"   ✅ mesh_processor установлен\" || echo \"   ❌ ОШИБКА: mesh_processor\"",
          "echo \"=== [3/6] ✅ УСПЕШНО: пакеты Windows + NVIDIA установлены ===\" || echo \"=== [3/6] ❌ ОШИБКА: пакеты Windows + NVIDIA ===\""
        ]
      },
      on: [
        {
          event: "/(error|fatal|failed|ModuleNotFoundError)/i",
          done: true
        }
      ]
    },
    {
      when: "{{platform === 'win32' && gpu === 'nvidia'}}",
      method: "log",
      "params": {
        message: "[3/6] ✅ Пакеты Windows + NVIDIA установлены"
      }
    },
    {
      when: "{{platform === 'win32' && gpu === 'nvidia'}}",
      method: "log",
      "params": {
        message: "[4/6] Собираем custom_rasterizer из исходников (для архитектуры 6.1 / P106)..."
      }
    },
    {
      when: "{{platform === 'win32' && gpu === 'nvidia'}}",
      method: "shell.run",
      "params": {
        build: true,
        env: {
          USE_NINJA: 0,
          DISTUTILS_USE_SDK: 1,
          TORCH_CUDA_ARCH_LIST: "6.1;7.5;8.6;8.9;12.0"
        },
        venv: "../../../env",
        path: "app/hy3dgen/texgen/custom_rasterizer",
        message: [
          "echo \"=== [4/6] Сборка custom_rasterizer из исходников ===\"",
          "python setup.py install && echo \"=== [4/6] ✅ УСПЕШНО: custom_rasterizer собран и установлен ===\" || echo \"=== [4/6] ❌ ОШИБКА: не удалось собрать custom_rasterizer ===\""
        ]
      },
      on: [
        {
          event: "/(error|fatal|failed)/i",
          done: true
        }
      ]
    },
    {
      when: "{{platform === 'win32' && gpu === 'nvidia'}}",
      method: "log",
      "params": {
        message: "[4/6] ✅ custom_rasterizer собран и установлен"
      }
    },
    {
      when: "{{!(platform === 'win32' && gpu === 'nvidia')}}",
      method: "log",
      "params": {
        message: "[3/6] Устанавливаем общие Python-зависимости (не Windows+NVIDIA)..."
      }
    },
    {
      when: "{{!(platform === 'win32' && gpu === 'nvidia')}}",
      method: "shell.run",
      "params": {
        build: true,
        env: {
          USE_NINJA: 0,
          DISTUTILS_USE_SDK: 1,
          TORCH_CUDA_ARCH_LIST: "6.1;7.5;8.6;8.9;12.0"
        },
        venv: "env",
        path: "app",
        message: [
          "echo \"=== [3/6] Установка общих Python-зависимостей ===\"",
          "uv pip install setuptools==65.5.0 wheel && echo \"   ✅ setuptools/wheel установлены\" || echo \"   ❌ ОШИБКА: setuptools/wheel\"",
          "{{gpu === 'nvidia' ? 'uv pip install --no-build-isolation diso==0.1.4 && echo \"   ✅ diso==0.1.4 установлен\" || echo \"   ❌ ОШИБКА: diso==0.1.4\"' : 'echo \"   ⏭️ дисо пропущен (не NVIDIA GPU)\"'}}",
          "{{platform === 'darwin' ? 'uv pip install numba>0.60.0 && echo \"   ✅ numba установлен\" || echo \"   ❌ ОШИБКА: numba\"' : 'echo \"   ⏭️ numba пропущен (не macOS)\"'}}",
          "uv pip install -r requirements.txt && echo \"   ✅ requirements.txt установлен\" || echo \"   ❌ ОШИБКА: requirements.txt\"",
          "uv pip install sentencepiece diffusers==0.33.0 gradio==5.50 huggingface_hub[hf-xet]==0.36.2 && echo \"   ✅ sentencepiece/diffusers/gradio/huggingface_hub установлены\" || echo \"   ❌ ОШИБКА: sentencepiece/diffusers/gradio/huggingface_hub\"",
          "echo \"=== [3/6] ✅ УСПЕШНО: общие Python-зависимости установлены ===\" || echo \"=== [3/6] ❌ ОШИБКА: общие Python-зависимости ===\""
        ]
      },
      on: [
        {
          event: "/(error|fatal|failed)/i",
          done: true
        }
      ]
    },
    {
      when: "{{!(platform === 'win32' && gpu === 'nvidia')}}",
      method: "log",
      "params": {
        message: "[3/6] ✅ Общие Python-зависимости установлены"
      }
    },
    {
      when: "{{platform === 'linux'}}",
      "method": "log",
      "params": {
        message: "[5/6] Устанавливаем g++ <12 для Linux..."
      }
    },
    {
      when: "{{platform === 'linux'}}",
      method: "shell.run",
      "params": {
        message: [
          "echo \"=== [5/6] Установка g++ <12 для Linux ===\"",
          "conda install -y -c conda-forge 'gxx<12' && echo \"   ✅ g++ <12 установлен\" || echo \"   ❌ ОШИБКА: g++ <12\"",
          "which g++ && echo \"   ✅ g++ найден в PATH\" || echo \"   ❌ ОШИБКА: g++ не найден\"",
          "echo \"=== [5/6] ✅ УСПЕШНО: g++ установлен ===\" || echo \"=== [5/6] ❌ ОШИБКА: g++ ===\""
        ]
      },
      on: [
        {
          event: "/(error|fatal|failed)/i",
          done: true
        }
      ]
    },
    {
      when: "{{platform === 'linux'}}",
      method: "log",
      "params": {
        message: "[5/6] ✅ g++ установлен"
      }
    },
    {
      when: "{{platform === 'linux'}}",
      method: "log",
      "params": {
        message: "[6/6] Собираем custom_rasterizer и differentiable_renderer для Linux..."
      }
    },
    {
      when: "{{platform === 'linux'}}",
      method: "shell.run",
      "params": {
        build: true,
        venv: "../../../env",
        env: {
          USE_NINJA: 0,
          DISTUTILS_USE_SDK: 1,
          NVCC_PREPEND_FLAGS: "-ccbin {{which('g++')}}",
          TORCH_CUDA_ARCH_LIST: "6.1;7.5;8.6;8.9;12.0"
        },
        path: "app/hy3dgen/texgen/custom_rasterizer",
        message: [
          "echo \"=== [6/6] Сборка custom_rasterizer для Linux ===\"",
          "python setup.py install && echo \"   ✅ custom_rasterizer собран\" || echo \"   ❌ ОШИБКА: custom_rasterizer\""
        ]
      },
      on: [
        {
          event: "/(error|fatal|failed)/i",
          done: true
        }
      ]
    },
    {
      when: "{{platform === 'linux'}}",
      "method": "shell.run",
      "params": {
        build: true,
        venv: "../../../env",
        env: {
          USE_NINJA: 0,
          DISTUTILS_USE_SDK: 1,
          NVCC_PREPEND_FLAGS: "-ccbin {{which('g++')}}",
          TORCH_CUDA_ARCH_LIST: "6.1;7.5;8.6;8.9;12.0"
        },
        path: "app/hy3dgen/texgen/differentiable_renderer",
        message: [
          "echo \"=== [6/6] Сборка differentiable_renderer для Linux ===\"",
          "python setup.py install && echo \"   ✅ differentiable_renderer собран\" || echo \"   ❌ ОШИБКА: differentiable_renderer\"",
          "echo \"=== [6/6] ✅ УСПЕШНО: custom_rasterizer и differentiable_renderer собраны ===\" || echo \"=== [6/6] ❌ ОШИБКА: сборка компонентов Linux ===\""
        ]
      },
      on: [
        {
          event: "/(error|fatal|failed)/i",
          done: true
        }
      ]
    },
    {
      when: "{{platform === 'linux'}}",
      method: "log",
      "params": {
        message: "[6/6] ✅ custom_rasterizer и differentiable_renderer собраны"
      }
    },
    {
      method: "log",
      "params": {
        message: "=== Hunyuan3D-2-LowVRAM: установка завершена успешно ==="
      }
    }
  ]
}
