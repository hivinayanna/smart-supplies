// Regex para validação de campos de cadastro
export const validacaoRegex = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  senha: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  nomeCompleto: /^[a-zA-ZÀ-ÿ\s]{2,50}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  nomeProduto: /^[a-zA-ZÀ-ÿ0-9\s\-\.]{2,100}$/,
  preco: /^R\$\s\d+([,.\.]\d{1,2})?$/,
  estoque: /^\d+$/,
  url: /^https?:\/\/.+\..+/
};

// Funções de validação
export const validarCampo = (campo, valor) => {
  if (!validacaoRegex[campo]) return true;
  return validacaoRegex[campo].test(valor);
};

// Mensagens de erro
export const mensagensErro = {
  email: 'Email deve ter formato válido (exemplo@email.com)',
  telefone: 'Telefone deve ter formato (XX) XXXXX-XXXX',
  senha: 'Senha deve ter 8+ caracteres, 1 maiúscula, 1 minúscula e 1 número',
  nomeCompleto: 'Nome deve ter 2-50 caracteres, apenas letras',
  username: 'Usuário deve ter 3-20 caracteres, apenas letras, números e _',
  nomeProduto: 'Nome do produto deve ter 2-100 caracteres',
  preco: 'Preço deve ser um valor válido (ex: 10,50)',
  estoque: 'Estoque deve ser um número inteiro',
  url: 'URL deve ter formato válido (https://exemplo.com)'
};

// Máscaras de formatação
export const aplicarMascara = (tipo, valor) => {
  switch (tipo) {
    case 'telefone':
      return valor
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
        .slice(0, 15);
    
    case 'nomeCompleto':
      return valor.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').slice(0, 50);
    
    case 'username':
      return valor.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20);
    
    case 'nomeProduto':
      return valor.replace(/[^a-zA-ZÀ-ÿ0-9\s\-\.]/g, '').slice(0, 100);
    
    case 'preco':
      const numeros = valor.replace(/[^\d,.]/g, '');
      const formatado = numeros.replace(/,/g, '.').replace(/(\d+\.\d{2})\d+/, '$1');
      return formatado ? `R$ ${formatado}` : '';
    
    case 'estoque':
      return valor.replace(/\D/g, '').slice(0, 6);
    
    default:
      return valor;
  }
};