const DEFAULT_DEADLINE = new Date('2026-04-03T00:25:00-03:00');
let deadline = DEFAULT_DEADLINE;

// Variáveis globais
let currentSection = 1;
let isFormClosed = false;

// Configuração do Google Apps Script (substitua pela URL do seu web app)
const scriptURL = 'https://script.google.com/macros/s/AKfycbyTwLQ0NvNPuffO3Bd-aeYIdeHMyH65eFhJmL1jYaTyoPIHg5NyZxgvM1DU2twu7aF1Jw/exec';

// Função para carregar o prazo salvo do localStorage
function loadDeadline() {
    const savedDeadline = localStorage.getItem('deadlineInscricoes');
    if (savedDeadline) {
        deadline = new Date(savedDeadline);
    } else {
        deadline = DEFAULT_DEADLINE;
    }
}

// Função para salvar o prazo no localStorage
function saveDeadline() {
    const dataInput = document.getElementById('configData').value;
    const horaInput = document.getElementById('configHora').value;
    const messageEl = document.getElementById('configMessage');
    
    if (!dataInput || !horaInput) {
        messageEl.className = 'config-message error';
        messageEl.textContent = 'Por favor, preencha a data e a hora de término.';
        return;
    }
    
    // Criar data no fuso horário de Brasília (UTC-3)
    const [year, month, day] = dataInput.split('-').map(Number);
    const [hours, minutes] = horaInput.split(':').map(Number);
    
    // Criar data considerando o fuso de Brasília
    const newDeadline = new Date(Date.UTC(year, month - 1, day, hours + 3, minutes, 0));
    
    // Validar se a data é válida
    if (isNaN(newDeadline.getTime())) {
        messageEl.className = 'config-message error';
        messageEl.textContent = 'Data ou hora inválida. Por favor, verifique os valores informados.';
        return;
    }
    
    // Salvar no localStorage
    localStorage.setItem('deadlineInscricoes', newDeadline.toISOString());
    deadline = newDeadline;
    
    // Mostrar mensagem de sucesso
    messageEl.className = 'config-message success';
    messageEl.textContent = 'Prazo configurado com sucesso! A página será recarregada.';
    
    // Recarregar a página após 1.5 segundos para aplicar as mudanças
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// Função para restaurar o prazo padrão
function resetDeadline() {
    localStorage.removeItem('deadlineInscricoes');
    deadline = DEFAULT_DEADLINE;
    
    const messageEl = document.getElementById('configMessage');
    messageEl.className = 'config-message success';
    messageEl.textContent = 'Prazo restaurado para o valor padrão. A página será recarregada.';
    
    setTimeout(() => {
        location.reload();
    }, 1500);
}

// Função para mostrar/ocultar o painel de configuração
function toggleConfigPanel() {
    const panel = document.getElementById('configPanel');
    const overlay = document.getElementById('configOverlay');
    
    if (panel.style.display === 'block') {
        panel.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        // Preencher os campos com o valor atual do prazo
        const currentDeadline = deadline;
        const year = currentDeadline.getUTCFullYear();
        const month = String(currentDeadline.getUTCMonth() + 1).padStart(2, '0');
        const day = String(currentDeadline.getUTCDate()).padStart(2, '0');
        const hours = String(currentDeadline.getUTCHours() - 3).padStart(2, '0'); // Ajustar para Brasília
        const minutes = String(currentDeadline.getUTCMinutes()).padStart(2, '0');
        
        document.getElementById('configData').value = `${year}-${month}-${day}`;
        document.getElementById('configHora').value = `${hours}:${minutes}`;
        
        panel.style.display = 'block';
        
        // Criar overlay se não existir
        if (!overlay) {
            const newOverlay = document.createElement('div');
            newOverlay.id = 'configOverlay';
            newOverlay.className = 'config-overlay';
            newOverlay.onclick = toggleConfigPanel;
            document.body.appendChild(newOverlay);
        }
        document.getElementById('configOverlay').style.display = 'block';
        
        // Limpar mensagens anteriores
        document.getElementById('configMessage').className = 'config-message';
        document.getElementById('configMessage').textContent = '';
    }
}

// Função para verificar se o prazo expirou
function checkDeadline() {
    const now = new Date();
    
    // Formatar data do deadline para exibição (horário de Brasília)
    const deadlineDate = deadline.toLocaleDateString('pt-BR', {timeZone: 'America/Sao_Paulo'});
    const deadlineTime = deadline.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'});
    
    if (now > deadline) {
        // Formulário encerrado
        isFormClosed = true;
        document.getElementById('formContent').style.display = 'none';
        document.getElementById('closedMessage').style.display = 'block';
        document.getElementById('deadlineBanner').textContent = `⏰ Inscrições encerradas desde ${deadlineDate} às ${deadlineTime}`;
        document.getElementById('deadlineBanner').classList.add('closed');
        
        // Calcular quanto tempo passou desde o encerramento
        updateElapsedTime();
        // Atualizar a cada minuto
        setInterval(updateElapsedTime, 60000);
        
        return true;
    } else {
        // Formulário ainda aberto
        // Atualizar banner com a data de término
        document.getElementById('deadlineBanner').textContent = `⏰ Inscrições abertas até ${deadlineDate} às ${deadlineTime}`;
        
        // Calcular contagem regressiva
        updateCountdown();
        // Atualizar a cada segundo
        setInterval(updateCountdown, 1000);
        
        return false;
    }
}

// Função para atualizar o tempo decorrido desde o encerramento
function updateElapsedTime() {
    const now = new Date();
    const elapsed = now - deadline; // diferença em milissegundos
    
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    
    document.getElementById('elapsedTime').innerHTML = `
        <div class="countdown-item">
            <div class="countdown-value">${days}</div>
            <div class="countdown-label">Dias</div>
        </div>
        <div class="countdown-item">
            <div class="countdown-value">${hours}</div>
            <div class="countdown-label">Horas</div>
        </div>
        <div class="countdown-item">
            <div class="countdown-value">${minutes}</div>
            <div class="countdown-label">Minutos</div>
        </div>
        <div class="countdown-item">
            <div class="countdown-value">${seconds}</div>
            <div class="countdown-label">Segundos</div>
        </div>
    `;
}

// Função para atualizar contagem regressiva
function updateCountdown() {
    const now = new Date();
    const timeLeft = deadline - now;
    
    if (timeLeft < 0) {
        // Prazo expirado, recarregar a página para mostrar mensagem de encerramento
        location.reload();
        return;
    }
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    // Atualizar banner com contagem regressiva
    const banner = document.getElementById('deadlineBanner');
    if (days > 0) {
        banner.innerHTML = `⏰ Inscrições abertas por mais ${days} dia(s), ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
        banner.innerHTML = `⏰ Inscrições abertas por mais ${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        banner.innerHTML = `⏰ Inscrições abertas por mais ${minutes}m ${seconds}s`;
    } else {
        banner.innerHTML = `⏰ Últimos ${seconds} segundos para inscrições!`;
    }
}

// Verificar prazo ao carregar a página
window.onload = function() {
    // Carregar o prazo salvo (ou usar o padrão)
    loadDeadline();
    
    const isClosed = checkDeadline();
    
    if (!isClosed) {
        // Inicializar data mínima como hoje
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('dataAtividade').min = today;
        
        // Inicializar o formulário normalmente
        initializeForm();
    }
};

// Inicializar funcionalidades do formulário
function initializeForm() {
    // Mostrar/ocultar campos condicionais
    document.getElementById('cnpjSim').addEventListener('change', function() {
        document.getElementById('cnpjGroup').style.display = this.checked ? 'block' : 'none';
    });
    
    document.getElementById('cnpjNao').addEventListener('change', function() {
        document.getElementById('cnpjGroup').style.display = this.checked ? 'none' : 'block';
    });
    
    document.getElementById('publicoOutro').addEventListener('change', function() {
        document.getElementById('publicoOutroEspecificar').style.display = this.checked ? 'block' : 'none';
        if (this.checked) {
            document.getElementById('publicoOutroEspecificar').required = true;
        } else {
            document.getElementById('publicoOutroEspecificar').required = false;
        }
    });
    
    document.getElementById('recursoOutro').addEventListener('change', function() {
        document.getElementById('recursoOutroEspecificar').style.display = this.checked ? 'block' : 'none';
        if (this.checked) {
            document.getElementById('recursoOutroEspecificar').required = true;
        } else {
            document.getElementById('recursoOutroEspecificar').required = false;
        }
    });
    
    // Configurar evento de envio
    document.getElementById('inscricaoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Verificar se o formulário ainda está aberto
        if (isFormClosed) {
            alert('O período de inscrições já foi encerrado.');
            return;
        }
        
        // Validar a última seção
        if (!validateSection(6)) {
            alert('Por favor, preencha todos os campos obrigatórios antes de enviar o formulário.');
            return;
        }
        
        // Desabilitar o botão de envio
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        // Coletar todos os dados do formulário
        const formData = new FormData(this);
        
        // Processar campos de múltipla escolha
        const publicoPrincipal = [];
        document.querySelectorAll('input[name="publicoPrincipal"]:checked').forEach(checkbox => {
            let value = checkbox.value;
            if (checkbox.id === 'publicoOutro' && checkbox.checked) {
                value += ': ' + document.getElementById('publicoOutroEspecificar').value;
            }
            publicoPrincipal.push(value);
        });
        
        const recursosAcessibilidade = [];
        document.querySelectorAll('input[name="recursosAcessibilidade"]:checked').forEach(checkbox => {
            let value = checkbox.value;
            if (checkbox.id === 'recursoOutro' && checkbox.checked) {
                value += ': ' + document.getElementById('recursoOutroEspecificar').value;
            }
            recursosAcessibilidade.push(value);
        });
        
        // Criar objeto com todos os dados
        const data = {
            timestamp: new Date().toLocaleString('pt-BR'),
            nomeEntidade: formData.get('nomeEntidade'),
            possuiCNPJ: formData.get('possuiCNPJ'),
            cnpj: formData.get('cnpj') || '',
            tituloAtividade: formData.get('tituloAtividade'),
            descricaoAtividade: formData.get('descricaoAtividade'),
            alinhadaTema: formData.get('alinhadaTema'),
            dataAtividade: formData.get('dataAtividade'),
            horarioInicio: formData.get('horarioInicio'),
            horarioTermino: formData.get('horarioTermino'),
            localAtividade: formData.get('localAtividade'),
            publicoEstimado: formData.get('publicoEstimado'),
            abertaPublico: formData.get('abertaPublico'),
            publicoPrincipal: publicoPrincipal.join(', '),
            localAcessivel: formData.get('localAcessivel'),
            recursosAcessibilidade: recursosAcessibilidade.join(', '),
            necessidadeLibras: formData.get('necessidadeLibras'),
            nomeResponsavel: formData.get('nomeResponsavel'),
            emailResponsavel: formData.get('emailResponsavel'),
            telefoneResponsavel: formData.get('telefoneResponsavel'),
            declaracao: 'Concordou com todas as declarações'
        };
        
        // Enviar dados para a planilha Google Sheets
        fetch('https://docs.google.com/forms/d/e/1FAIpQLSeXgKpVPMtRzCTUxKbQkT8yNqFzPqGj9Wv2XyZ3AbCdEfGhIw/formResponse', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data).toString()
        })
        .then(() => {
            // Mostrar mensagem de sucesso
            document.getElementById('inscricaoForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Ocorreu um erro ao enviar o formulário. Tente novamente.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Inscrição';
        });
    });
}

// Funções de navegação entre seções
function showSection(sectionNumber) {
    // Esconder todas as seções
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar a seção atual
    document.getElementById(`section${sectionNumber}`).classList.add('active');
    
    // Atualizar a barra de progresso
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active');
    });
    
    for (let i = 1; i <= sectionNumber; i++) {
        document.getElementById(`step${i}`).classList.add('active');
    }
    
    currentSection = sectionNumber;
}

function nextSection(next) {
    // Validar a seção atual antes de prosseguir
    if (validateSection(currentSection)) {
        showSection(next);
    }
}

function prevSection(prev) {
    showSection(prev);
}

// Validação de seção
function validateSection(sectionNumber) {
    const section = document.getElementById(`section${sectionNumber}`);
    const requiredInputs = section.querySelectorAll('[required]');
    let isValid = true;
    
    for (let input of requiredInputs) {
        if (input.type === 'checkbox' || input.type === 'radio') {
            // Para checkboxes e radios, verificar se pelo menos um está selecionado
            const name = input.name;
            const checked = section.querySelectorAll(`input[name="${name}"]:checked`).length > 0;
            
            if (!checked) {
                isValid = false;
                highlightError(input);
            } else {
                removeHighlight(input);
            }
        } else {
            if (!input.value.trim()) {
                isValid = false;
                highlightError(input);
            } else {
                removeHighlight(input);
            }
        }
    }
    
    if (!isValid) {
        alert('Por favor, preencha todos os campos obrigatórios antes de prosseguir.');
    }
    
    return isValid;
}

function highlightError(input) {
    if (input.type === 'checkbox' || input.type === 'radio') {
        const labels = document.querySelectorAll(`label[for="${input.id}"]`);
        labels.forEach(label => {
            label.style.color = '#e63946';
        });
    } else {
        input.style.borderColor = '#e63946';
        input.style.boxShadow = '0 0 0 3px rgba(230, 57, 70, 0.1)';
    }
}

function removeHighlight(input) {
    if (input.type === 'checkbox' || input.type === 'radio') {
        const labels = document.querySelectorAll(`label[for="${input.id}"]`);
        labels.forEach(label => {
            label.style.color = '';
        });
    } else {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }
}
