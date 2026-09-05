// Checkout PIX à vista para combos promocionais (/combo-pix/?plano=comboKey)
// Página não divulgada: acesso apenas por link direto enviado manualmente pela Karina.

(function () {
    const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : 'https://api-contas-karina.onrender.com';

    // Dados só para exibição (nome/preço na tela). O backend revalida tudo de novo.
    const COMBOS_PIX_DISPLAY = {
        'prata_trimestral_pix': { planName: 'Plano Prata', months: 3, total: 380.00 },
        'prata_semestral_pix': { planName: 'Plano Prata', months: 6, total: 700.00 },
        'ouro_trimestral_pix': { planName: 'Plano Ouro', months: 3, total: 470.00 },
        'ouro_semestral_pix': { planName: 'Plano Ouro', months: 6, total: 880.00 }
    };

    const formatBRL = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    function showState(stateId) {
        ['combo-invalid', 'combo-checkout', 'combo-already-paid', 'combo-success'].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('hidden', id !== stateId);
        });
    }

    // Validação matemática de CPF (mesmo algoritmo usado em /planos/)
    function isValidCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cpf)) return false;

        let sum = 0;
        let remainder;

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10))) return false;

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11))) return false;

        return true;
    }

    const maskInput = (elementId, maskFn) => {
        const input = document.getElementById(elementId);
        if (!input) return;
        input.addEventListener('input', (e) => {
            const start = e.target.selectionStart;
            const prevLen = e.target.value.length;
            e.target.value = maskFn(e.target.value);
            const nextLen = e.target.value.length;
            const diff = nextLen - prevLen;
            if (diff !== 0 && start) {
                e.target.setSelectionRange(start + diff, start + diff);
            }
        });
    };

    let pollingInterval = null;

    function startPixPolling(txid) {
        if (pollingInterval) clearInterval(pollingInterval);
        pollingInterval = setInterval(() => {
            fetch(`${API_BASE_URL}/api/payments/status/${txid}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.data.status === 'PAID') {
                        clearInterval(pollingInterval);
                        showState('combo-success');
                    }
                })
                .catch((err) => console.warn('Erro de comunicação no polling do PIX:', err));
        }, 3000);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const params = new URLSearchParams(window.location.search);
        const comboKey = params.get('plano');
        const combo = comboKey ? COMBOS_PIX_DISPLAY[comboKey] : null;

        if (!combo) {
            showState('combo-invalid');
            return;
        }

        document.getElementById('combo-plan-name').textContent = `${combo.planName} - ${combo.months} Meses`;
        document.getElementById('combo-plan-price').textContent = `Total à vista de ${formatBRL(combo.total)}`;
        showState('combo-checkout');

        maskInput('combo-cpf', (val) => {
            let clean = val.replace(/\D/g, '').substring(0, 11);
            if (clean.length <= 3) return clean;
            if (clean.length <= 6) return `${clean.substring(0, 3)}.${clean.substring(3)}`;
            if (clean.length <= 9) return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6)}`;
            return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6, 9)}-${clean.substring(9)}`;
        });

        maskInput('combo-phone', (val) => {
            let clean = val.replace(/\D/g, '').substring(0, 11);
            if (clean.length === 0) return '';
            if (clean.length <= 2) return `(${clean}`;
            if (clean.length <= 6) return `(${clean.substring(0, 2)}) ${clean.substring(2)}`;
            if (clean.length <= 10) return `(${clean.substring(0, 2)}) ${clean.substring(2, 6)}-${clean.substring(6)}`;
            return `(${clean.substring(0, 2)}) ${clean.substring(2, 7)}-${clean.substring(7)}`;
        });

        const copyBtn = document.getElementById('combo-copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const input = document.getElementById('combo-pix-copia-cola');
                if (!input) return;
                input.select();
                input.setSelectionRange(0, 99999);
                navigator.clipboard.writeText(input.value)
                    .then(() => {
                        const successMsg = document.getElementById('combo-pix-copied-success');
                        if (successMsg) {
                            successMsg.classList.remove('hidden');
                            setTimeout(() => successMsg.classList.add('hidden'), 3000);
                        }
                    })
                    .catch((err) => console.error('Erro ao copiar código PIX:', err));
            });
        }

        const form = document.getElementById('combo-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const errorDiv = document.getElementById('combo-error');
            errorDiv.classList.add('hidden');
            document.getElementById('combo-email-match-error').classList.add('hidden');
            document.getElementById('combo-cpf-error').classList.add('hidden');

            const name = document.getElementById('combo-name').value.trim();
            const email = document.getElementById('combo-email').value.trim().toLowerCase();
            const emailConfirm = document.getElementById('combo-email-confirm').value.trim().toLowerCase();
            const cpf = document.getElementById('combo-cpf').value.replace(/\D/g, '');
            const phone = document.getElementById('combo-phone').value.replace(/\D/g, '');

            if (email !== emailConfirm) {
                document.getElementById('combo-email-match-error').classList.remove('hidden');
                return;
            }

            if (cpf.length !== 11 || !isValidCPF(cpf)) {
                document.getElementById('combo-cpf-error').classList.remove('hidden');
                return;
            }

            if (phone.length < 10 || phone.length > 11) {
                errorDiv.textContent = 'O número de celular deve conter o DDD com 10 ou 11 dígitos.';
                errorDiv.classList.remove('hidden');
                return;
            }

            if (!document.getElementById('combo-accept-terms').checked) {
                errorDiv.textContent = 'É necessário aceitar os Termos de Serviço e a Política de Privacidade.';
                errorDiv.classList.remove('hidden');
                return;
            }

            form.classList.add('hidden');
            document.getElementById('combo-step-pix').classList.remove('hidden');
            document.getElementById('combo-pix-qrcode-img').classList.add('hidden');
            document.getElementById('combo-pix-qrcode-loading').classList.remove('hidden');

            fetch(`${API_BASE_URL}/api/payments/efi/checkout-pix-combo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, cpf, comboKey })
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        if (data.data.status === 'PAID') {
                            showState('combo-already-paid');
                            return;
                        }

                        document.getElementById('combo-pix-qrcode-img').src = data.data.imagemQrcode;
                        document.getElementById('combo-pix-qrcode-img').classList.remove('hidden');
                        document.getElementById('combo-pix-qrcode-loading').classList.add('hidden');
                        document.getElementById('combo-pix-copia-cola').value = data.data.qrcode;

                        startPixPolling(data.data.txid);
                    } else {
                        form.classList.remove('hidden');
                        document.getElementById('combo-step-pix').classList.add('hidden');
                        errorDiv.textContent = data.message || 'Falha ao gerar cobrança PIX.';
                        errorDiv.classList.remove('hidden');
                    }
                })
                .catch((err) => {
                    console.error(err);
                    form.classList.remove('hidden');
                    document.getElementById('combo-step-pix').classList.add('hidden');
                    errorDiv.textContent = 'Erro de comunicação ao solicitar PIX. Tente novamente.';
                    errorDiv.classList.remove('hidden');
                });
        });
    });
})();
