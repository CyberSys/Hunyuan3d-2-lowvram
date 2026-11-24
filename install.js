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
        message: "echo \"=== [1/6] Клонирование репозитория приложения ===\" & git clone {{platform === 'darwin' ? 'https://github.com/Tencent/Hunyuan3D-2' : 'https://github.com/SkyDev-Devision/Hunyuan3D-2GP.git'}} app & echo \"=== [1/6] ✅ Репозиторий приложения склонирован ===\" || echo \"=== [1/6] ❌ ОШИБКА: не удалось склонировать репозиторий ===\""
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
        message: "echo \"=== [1/6] Обновление репозитория приложения ===\" & git pull && echo \"=== [1/6] ✅ Репозиторий приложения обновлён ===\" || echo \"=== [1/6] ⚠️ ПРЕДУПРЕЖДЕНИЕ: git pull не удался, продолжаем ===\"",
        path: "app"
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
        message: "[3/6] Устанавливаем пакеты для Windows + NVIDIA..."
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
        message: "echo \"=== [3/6] Установка requirements.txt ===\" & uv pip install -r requirements.txt && echo \"   ✅ requirements.txt установлен\" || echo \"   ❌ ОШИБКА: requirements.txt\""
      }
    },
    {
      when: "{{platform === 'win32' && gpu === 'nvidia'}}",
      method: "shell.run",
      "params": {
        message: "echo \"=== [3/6] Установка sentencepiece/diffusers/gradio/huggingface_hub ===\" & uv pip install sentencepiece diffusers==0.33.0 gradio==5.50 huggingface_hub[hf-xet]==0.36.2 && echo \"   ✅ sentencepiece/diffusers/gradio/huggingface_hub установлены\" || echo \"   ❌ ОШИБКА: sentencepiece/diffusers/gradio/huggingface_hub\""
      }
    },
    {
      when: "{{platform === 'win32' && gpu === 'nvidia'}}",
      method: "shell.run",
      "params": {
        message: "echo \"=== [3/6] Установка diso==0.1.4 ===\" & uv pip install --no-build-isolation diso==0.1.4 && echo \"   ✅ diso==0.1.4 установлен\" || echo \"   ❌ ОШИБКА: diso==0.1.4\""
      }
    },
    {
      when: "{{platform === 'win32' && gpu === 'nvidia'}}",
      method: "shell.run",
      "params": {
        message: "echo \"=== [3/6] Установка mesh_processor ===\" & uv pip install ../wheels/mesh_processor-0.0.0-cp310-cp310-win_amd64.whl && echo \"   ✅ mesh_processor установлен\" || echo \"   ❌ ОШИБКА: mesh_processor\""
      }
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
        message: "echo \"=== [4/6] Сборка custom_rasterizer из исходников ===\" & python setup.py install && echo \"=== [4/6] ✅ custom_rasterizer собран и установлен ===\" || echo \"=== [4/6] ❌ ОШИБКА: не удалось собрать custom_rasterizer ===\""
      }
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
        message: "[3/6] Устанавливаем общие Python-зависимости..."
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
        message: "echo \"=== [3/6] Установка setuptools/wheel ===\" & uv pip install setuptools==65.5.0 wheel && echo \"   ✅ setuptools/wheel установлены\" || echo \"   ❌ ОШИБКА: setuptools/wheel\""
      }
    },
    {
      when: "{{!(platform === 'win32' && gpu === 'nvidia')}}",
      method: "shell.run",
      "params": {
        message: "echo \"=== [3/6] Установка diso==0.1.4 (если NVIDIA) ===\" & {{gpu === 'nvidia' ? 'uv pip install --no-build-isolation diso==0.1.4' : 'echo \"   ⏭️ дисо пропущен (не NVIDIA GPU)\"'}} & echo \"=== [3/6] diso выполнено ===\""
      }
    },
    {
      when: "{{!(platform === 'win32' && gpu === 'nvidia')}}",
      method: "shell.run",
      "params": {
        message: "echo \"=== [3/6] Установка numba (если macOS) ===\" & {{platform === 'darwin' ? 'uv pip install numba>0.60.0' : 'echo \"   ⏭️ numba пропущен (не macOS)\"'}} & echo \"=== [3/6] numba выполнено ===\""
      }
    },
    {
      when: "{{!(platform === 'win32' && gpu === 'nvidia')}}",
      method: "shell.run",
      "params": {
        message: "echo \"=== [3/6] Установка requirements.txt ===\" & uv pip install -r requirements.txt && echo \"   ✅ requirements.txt установлен\" || echo \"   ❌ ОШИБКА: requirements.txt\""
      }
    },
    {
      when: "{{!(platform === 'win32' && gpu === 'nvidia')}}",
      method: "shell.run",
      "params": {
        message: "echo \"=== [3/6] Установка sentencepiece/diffusers/gradio/huggingface_hub ===\" & uv pip install sentencepiece diffusers==0.33.0 gradio==5.50 huggingface_hub[hf-xet]==0.36.2 && echo \"   ✅ sentencepiece/diffusers/gradio/huggingface_hub установлены\" || echo \"   ❌ ОШИБКА: sentencepiece/diffusers/gradio/huggingface_hub\""
      }
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
      method: "log",
      "params": {
        message: "[5/6] Устанавливаем g++ <12 для Linux..."
      }
    },
    {
      when: "{{platform === 'linux'}}",
      method: "shell.run",
      "params": {
        message: "echo \"=== [5/6] Установка g++ <12 для Linux ===\" & conda install -y -c conda-forge 'gxx<12' && echo \"   ✅ g++ <12 установлен\" || echo \"   ❌ ОШИБКА: g++ <12\" & which g++ && echo \"   ✅ g++ найден в PATH\" || echo \"   ❌ ОШИБКА: g++ не найден\""
      }
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
        message: "echo \"=== [6/6] Сборка custom_rasterizer для Linux ===\" & python setup.py install && echo \"   ✅ custom_rasterizer собран\" || echo \"   ❌ ОШИБКА: custom_rasterizer\""
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
        path: "app/hy3dgen/texgen/differentiable_renderer",
        message: "echo \"=== [6/6] Сборка differentiable_renderer для Linux ===\" & python setup.py install && echo \"   ✅ differentiable_renderer собран\" || echo \"   ❌ ОШИБКА: differentiable_renderer\""
      }
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
