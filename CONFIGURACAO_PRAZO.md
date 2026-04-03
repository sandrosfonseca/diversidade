# Funcionalidade de Configuração de Prazo de Inscrições

## Visão Geral

Foi implementada uma funcionalidade que permite configurar a data e hora de término das inscrições no horário de Brasília, através de uma interface intuitiva e de fácil navegação.

## Como Usar

### 1. Acessar o Painel de Configuração

- No canto superior direito da página, clique no botão **"⚙️ Configurar Prazo"**
- Um painel modal será aberto com os campos para configuração

### 2. Configurar Data e Hora

No painel de configuração:

1. **Data de término**: Selecione a data desejada usando o seletor de datas
2. **Hora de término**: Informe o horário no formato HH:MM (horário de Brasília)
3. Clique em **"Salvar Configuração"** para aplicar as mudanças

### 3. Opções Adicionais

- **Restaurar Padrão**: Retorna o prazo para a configuração original (03/04/2026 às 00:25)
- **Fechar Painel**: Clique no "×" ou fora do painel para cancelar sem salvar

## Funcionalidades Implementadas

### Armazenamento Local
- As configurações são salvas no `localStorage` do navegador
- O prazo configurado persiste mesmo após fechar o navegador
- Cada navegador/dispositivo pode ter sua própria configuração

### Fuso Horário de Brasília
- Todos os horários são tratados no fuso horário America/Sao_Paulo (UTC-3)
- A exibição do prazo no banner sempre mostra o horário de Brasília
- A contagem regressiva é calculada corretamente independente do fuso do usuário

### Interface Responsiva
- Painel centralizado e responsivo
- Overlay escuro ao abrir o painel de configuração
- Animações suaves de entrada/saída
- Compatível com dispositivos móveis

### Validações
- Verifica se data e hora foram preenchidas
- Valida se a data/hora informada é válida
- Mensagens de erro e sucesso claras para o usuário

## Comportamento do Sistema

### Quando o Prazo Está Aberto
- Banner laranja mostra: "⏰ Inscrições abertas até [DATA] às [HORA]"
- Contagem regressiva é atualizada a cada segundo
- Formulário disponível para preenchimento

### Quando o Prazo Expira
- Banner vermelho mostra: "⏰ Inscrições encerradas desde [DATA] às [HORA]"
- Formulário é ocultado automaticamente
- Mensagem de encerramento é exibida
- Contador mostra tempo decorrido desde o encerramento

## Arquivos Modificados

### `/workspace/index.html`
- Adicionado botão de configuração no cabeçalho
- Adicionado painel modal para configuração de prazo
- Estrutura HTML para inputs de data e hora

### `/workspace/css/styles.css`
- Estilos para o botão de configuração (`.btn-config`)
- Estilos para o painel modal (`.config-panel`, `.config-header`, `.config-content`)
- Estilos para overlay (`.config-overlay`)
- Estilos para mensagens de feedback (`.config-message.success`, `.config-message.error`)
- Animações de entrada (`@keyframes slideIn`)

### `/workspace/js/script.js`
- `loadDeadline()`: Carrega prazo do localStorage ou usa padrão
- `saveDeadline()`: Salva nova configuração no localStorage
- `resetDeadline()`: Restaura prazo padrão
- `toggleConfigPanel()`: Mostra/oculta painel de configuração
- `checkDeadline()`: Atualizado para usar deadline dinâmico com fuso de Brasília

## Testes

Para testar a funcionalidade:

1. Abra o arquivo `index.html` em um navegador
2. Clique em "⚙️ Configurar Prazo"
3. Selecione uma data futura e horário
4. Clique em "Salvar Configuração"
5. A página recarregará mostrando o novo prazo no banner
6. Para resetar, use "Restaurar Padrão"

## Notas Importantes

⚠️ **Importante**: Como as configurações são salvas no localStorage:
- As configurações são específicas por navegador/dispositivo
- Limpar o cache do navegador remove as configurações salvas
- Em produção, considere implementar um backend para configurações centralizadas

## Melhorias Futuras Sugeridas

1. Autenticação para restringir acesso à configuração
2. Backend para sincronização entre dispositivos
3. Histórico de alterações de prazo
4. Notificações antes do vencimento
5. Exportar/importar configurações
