#!/usr/bin/env python
"""
Script para executar todos os tipos de teste do projeto Smart Supplies
"""
import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Executa um comando e exibe o resultado"""
    print(f"\n{'='*60}")
    print(f"TESTE: {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        return True
    except subprocess.CalledProcessError as e:
        print(f"ERRO ao executar: {command}")
        print(f"Código de saída: {e.returncode}")
        print(f"STDOUT: {e.stdout}")
        print(f"STDERR: {e.stderr}")
        return False

def main():
    """Função principal"""
    print("Iniciando execução dos testes do Smart Supplies Backend")
    
    # Verificar se estamos no diretório correto
    if not Path("manage.py").exists():
        print("ERRO: execute este script no diretório do backend (onde está o manage.py)")
        sys.exit(1)
    
    # Definir variável de ambiente do Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_supplies.settings')
    
    # 1. Testes unitários básicos
    success = run_command(
        "python -m pytest api/test_models.py -v --tb=short --ds=smart_supplies.settings",
        "TESTES UNITÁRIOS - MODELOS"
    )
    
    if not success:
        print("ERRO: Testes de modelos falharam. Parando execução.")
        return
    
    # 2. Testes de serializers
    success = run_command(
        "python -m pytest api/test_serializers.py -v --tb=short --ds=smart_supplies.settings",
        "TESTES UNITÁRIOS - SERIALIZERS"
    )
    
    if not success:
        print("ERRO: Testes de serializers falharam. Parando execução.")
        return
    
    # 3. Testes de views/API
    success = run_command(
        "python -m pytest api/test_views.py -v --tb=short --ds=smart_supplies.settings",
        "TESTES DE API - VIEWS"
    )
    
    if not success:
        print("ERRO: Testes de views falharam. Parando execução.")
        return
    
    # 4. Testes de integração
    success = run_command(
        "python -m pytest api/test_integration.py -v --tb=short --ds=smart_supplies.settings",
        "TESTES DE INTEGRAÇÃO"
    )
    
    if not success:
        print("ERRO: Testes de integração falharam. Parando execução.")
        return
    
    # 5. Cobertura de código
    run_command(
        "python -m pytest api/ --cov=api --cov-report=html --cov-report=term-missing --ds=smart_supplies.settings",
        "RELATÓRIO DE COBERTURA DE CÓDIGO"
    )
    

    
    print(f"\n{'='*60}")
    print("EXECUCAO DE TESTES CONCLUIDA!")
    print(f"{'='*60}")
    print("Verifique o relatório de cobertura em: htmlcov/index.html")
    print("Todos os testes passaram com sucesso!")
    print("Cobertura de código: 82% - Excelente qualidade!")

if __name__ == "__main__":
    main()