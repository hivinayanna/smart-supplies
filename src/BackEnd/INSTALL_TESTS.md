# 🚀 Instalação e Execução dos Testes - Smart Supplies

## 📦 Instalação das Dependências

### 1. Instalar dependências de teste
```bash
pip install -r requirements-test.txt
```

### 2. Verificar instalação
```bash
python -m pytest --version
python -c "import coverage; print('Coverage OK')"
python -c "import mutmut; print('Mutmut OK')"
```

## ⚡ Execução Rápida

### Executar todos os testes automaticamente
```bash
python run_tests.py
```

## 🎯 Execução Detalhada

### 1. Testes Unitários
```bash
# Todos os testes unitários
pytest api/test_models.py api/test_serializers.py api/test_views.py -v

# Por categoria
pytest api/test_models.py -v          # Modelos
pytest api/test_serializers.py -v     # Serializers  
pytest api/test_views.py -v           # Views/API
```

### 2. Testes de Integração
```bash
pytest api/test_integration.py -v
```

### 3. Testes de Casos Extremos
```bash
pytest api/test_edge_cases.py -v
```

### 4. Todos os Testes
```bash
pytest api/ -v
```

## 📊 Relatórios de Cobertura

### Gerar relatório de cobertura
```bash
pytest api/ --cov=api --cov-report=html --cov-report=term-missing
```

### Visualizar relatório
- Abrir `htmlcov/index.html` no navegador
- Ou ver no terminal após execução

## 🧬 Testes de Mutação

### Executar testes de mutação
```bash
# Executar mutações (pode demorar)
mutmut run

# Ver resultados
mutmut results

# Ver detalhes de uma mutação específica
mutmut show 1

# Resetar mutações
mutmut reset
```

### Executar mutação em arquivo específico
```bash
mutmut run --paths-to-mutate api/models.py
```

## 🔧 Opções Úteis

### Executar testes específicos
```bash
# Por nome
pytest -k "test_criar_usuario"

# Por marcador
pytest -m "unit"
pytest -m "integration"

# Parar no primeiro erro
pytest -x

# Executar em paralelo (se instalado pytest-xdist)
pytest -n auto
```

### Debug de testes
```bash
# Mais verboso
pytest -vv

# Mostrar prints
pytest -s

# Mostrar traceback completo
pytest --tb=long
```

## 📈 Interpretando Resultados

### Cobertura de Código
- **Verde**: Linhas cobertas por testes
- **Vermelho**: Linhas não cobertas
- **Meta**: > 90% de cobertura geral

### Testes de Mutação
- **Killed**: Mutação detectada pelos testes ✅
- **Survived**: Mutação não detectada ❌
- **Timeout**: Mutação causou loop infinito ⏱️
- **Incompetent**: Mutação causou erro de sintaxe 🚫

### Score de Mutação
```
Score = Killed / (Killed + Survived) * 100%
```
- **Excelente**: > 90%
- **Bom**: 80-90%
- **Aceitável**: 70-80%
- **Precisa melhorar**: < 70%

## 🚨 Solução de Problemas

### Erro: "No module named 'api'"
```bash
export DJANGO_SETTINGS_MODULE=smart_supplies.settings
# ou no Windows:
set DJANGO_SETTINGS_MODULE=smart_supplies.settings
```

### Erro: "Database is locked"
```bash
# Deletar banco de teste
rm db.sqlite3
python manage.py migrate
```

### Testes muito lentos
```bash
# Executar apenas testes rápidos
pytest -m "not slow"

# Usar banco em memória (já configurado)
# Pular testes de mutação
```

### Erro de permissão no Windows
```bash
# Executar como administrador ou
# Usar ambiente virtual
python -m venv venv
venv\Scripts\activate
pip install -r requirements-test.txt
```

## 📋 Checklist de Qualidade

Antes de fazer commit, verifique:

- [ ] ✅ Todos os testes passando
- [ ] 📊 Cobertura > 90%
- [ ] 🧬 Score de mutação > 80%
- [ ] ⚡ Testes executam em < 2 minutos
- [ ] 📝 Novos testes para novas funcionalidades
- [ ] 🔍 Casos de erro testados

## 🎯 Metas de Qualidade

| Métrica | Meta | Atual |
|---------|------|-------|
| Cobertura Geral | > 90% | - |
| Cobertura Modelos | > 95% | - |
| Score Mutação | > 80% | - |
| Tempo Execução | < 2min | - |
| Testes Passando | 100% | - |

## 📚 Recursos Adicionais

- [Documentação pytest](https://docs.pytest.org/)
- [Coverage.py](https://coverage.readthedocs.io/)
- [Mutmut](https://mutmut.readthedocs.io/)
- [Django Testing](https://docs.djangoproject.com/en/stable/topics/testing/)
- [DRF Testing](https://www.django-rest-framework.org/api-guide/testing/)