        // Tradutor de Erros do Gateway (Efí / Cartão de Crédito)
        function translateCheckoutError(error) {
            if (!error) return 'Houve um problema ao processar seu pagamento. Verifique seus dados.';
            
            const msg = String(error.message || error.error_description || error).toLowerCase();
            
            if (msg.includes('insufficient_funds') || msg.includes('saldo insuficiente') || msg.includes('funds')) {
                return 'Saldo insuficiente no cartão. Tente usar outro cartão.';
            }
            if (msg.includes('expired_card') || msg.includes('cartão expirado') || msg.includes('expired')) {
                return 'Este cartão está expirado. Verifique os dados inseridos ou use outro cartão.';
            }
            if (msg.includes('blocked_card') || msg.includes('cartão bloqueado') || msg.includes('blocked')) {
                return 'Cartão bloqueado pelo banco emissor. Por favor, entre em contato com seu banco ou use outro cartão.';
            }
            if (msg.includes('refused') || msg.includes('recusad') || msg.includes('decline') || msg.includes('cancelada')) {
                return 'Transação recusada pela operadora do cartão. Entre em contato com seu banco ou tente outro cartão.';
            }
            if (msg.includes('cvv') || msg.includes('security_code') || msg.includes('código de segurança')) {
                return 'Código de segurança (CVV) inválido. Verifique a digitação.';
            }
            if (msg.includes('validade') || msg.includes('expiry') || msg.includes('expiration')) {
                return 'Data de validade do cartão inválida ou no passado.';
            }
            if (msg.includes('cpf') || msg.includes('document') || msg.includes('documento')) {
                return 'CPF do titular do cartão inválido ou incompatível.';
            }
            if (msg.includes('timeout') || msg.includes('tempo limite')) {
                return 'Tempo de resposta da operadora esgotado. Tente novamente mais tarde.';
            }
            if (msg.includes('inativo') || msg.includes('inactive')) {
                return 'Erro interno do gateway de pagamentos. Entre em contato com o suporte.';
            }

            return error.message || error.error_description || error;
        }

        // Controla o estado de carregamento (loading) inline no próprio botão de enviar
        function setSubmitButtonLoading(isLoading) {
            const btn = document.getElementById('submit-btn');
            if (!btn) return;

            if (isLoading) {
                btn.disabled = true;
                btn.classList.add('opacity-75', 'pointer-events-none');
                btn.innerHTML = `
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>PROCESSANDO PAGAMENTO SEGURO...</span>
                `;
            } else {
                btn.disabled = false;
                btn.classList.remove('opacity-75', 'pointer-events-none');
                btn.innerHTML = `
                    <i data-lucide="lock" class="w-4 h-4"></i>
                    <span>FINALIZAR MATRÍCULA</span>
                `;
                if (window.lucide) lucide.createIcons();
            }
        }

        // Validador dinâmico de validade de cartão (MM/AA)
        function isValidExpiry(expiry) {
            const clean = expiry.replace(/\D/g, '');
            if (clean.length !== 4) return false;
            const month = parseInt(clean.substring(0, 2), 10);
            const year = parseInt("20" + clean.substring(2), 10);

            if (month < 1 || month > 12) return false;

            const now = new Date();
            const currentMonth = now.getMonth() + 1; // 1-12
            const currentYear = now.getFullYear(); // YYYY

            if (year < currentYear) return false;
            if (year === currentYear && month < currentMonth) return false;

            return true;
        }

        // Validador dinâmico de idade mínima (16 anos)
        function isValidBirthDate(birthString) {
            if (!birthString) return false;
            
            let isoString = birthString;
            if (birthString.includes('/')) {
                const parts = birthString.split('/');
                if (parts.length === 3) {
                    isoString = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }

            const birthDate = new Date(isoString);
            if (isNaN(birthDate.getTime())) return false;

            const today = new Date();
            if (birthDate.getFullYear() < 1900 || birthDate > today) return false;

            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            return age >= 16;
        }

        // Detecta a bandeira de cartão localmente (fallback para Elo e outros)
        function detectCardBrand(number) {
            const clean = number.replace(/\D/g, '');
            
            // Elo comprehensive patterns (including newer 6363, 6362, 5067, 4576, etc. prefixes)
            const elo = /^(4011(78|79)|43(1274|8935)|45(1416|7393|763(1|2))|50(4175|6699|67[0-7][0-9]|9000)|50(9[0-9]{3})|627780|63(6297|6368)|650(03([1-3]|[5-9])|04[0-9]|05(0|1|[7-9])|06[0-9]|07[0-9]|08[0-9]|4([0-3][0-9]|8[5-9]|9[0-9])|5([0-9]{2}|3[0-8])|9([0-6][0-9]|7[0-8])|7([0-2][0-9])|541|700|720|727|901)|65165[2-9]|6516[6-7][0-9]|65500[0-9]|6550[0-5][0-9]|655021|65505[6-7]|6516[8-9][0-9]|65170[0-4]|5067|4576|4011|6363|6362|6550|6504|6505|6500|6516|6552)/;
            
            // Visa
            const visa = /^4/;
            
            // Mastercard
            const mastercard = /^(5[1-5][0-9]{4}|2221[0-9]{2}|222[2-9][0-9]|22[3-9][0-9]{2}|2[3-6][0-9]{3}|27[0-1][0-9]{2}|2720[0-9])/;
            
            // Amex
            const amex = /^3[47]/;
            
            // Hipercard
            const hipercard = /^(606282|^3841)/;
            
            if (elo.test(clean)) return 'elo';
            if (visa.test(clean)) return 'visa';
            if (mastercard.test(clean)) return 'mastercard';
            if (amex.test(clean)) return 'amex';
            if (hipercard.test(clean)) return 'hipercard';
            
            return null;
        }

        // Destaca a bandeira correspondente nos logotipos de cartão
        function highlightBrandLogo(brandName) {
            const logos = {
                'visa': document.getElementById('brand-logo-visa'),
                'mastercard': document.getElementById('brand-logo-mastercard'),
                'elo': document.getElementById('brand-logo-elo'),
                'amex': document.getElementById('brand-logo-amex'),
                'american-express': document.getElementById('brand-logo-amex'),
                'hipercard': document.getElementById('brand-logo-hipercard')
            };

            // Reseta todas
            Object.values(logos).forEach(img => {
                if (img) {
                    img.classList.add('grayscale');
                    img.classList.remove('grayscale-0', 'scale-110');
                    img.style.opacity = '0.3';
                }
            });

            if (!brandName) {
                // Se nenhuma identificada, volta todas para opacidade de standby
                Object.values(logos).forEach(img => {
                    if (img) img.style.opacity = '0.6';
                });
                return;
            }

            // Destaca a correspondente
            const activeImg = logos[brandName.toLowerCase()];
            if (activeImg) {
                activeImg.classList.remove('grayscale');
                activeImg.classList.add('grayscale-0', 'scale-110');
                activeImg.style.opacity = '1';
            }
        }

        let pollingInterval = null;

        // Configurações e Preços dos Combos
        const PLANS_DATA = {
            'bronze_mensal': { name: 'Plano Bronze Mensal', total: 114.00, monthly: 114.00, months: 1, type: 'mensal' },
            'prata_mensal': { name: 'Plano Prata Mensal', total: 142.50, monthly: 142.50, months: 1, type: 'mensal' },
            'ouro_mensal': { name: 'Plano Ouro Mensal', total: 180.00, monthly: 180.00, months: 1, type: 'mensal' },
            'bronze_trimestral': { name: 'Bronze Trimestral (3 Meses)', total: 315.00, monthly: 105.00, months: 3 },
            'bronze_semestral': { name: 'Bronze Semestral (6 Meses)', total: 600.00, monthly: 100.00, months: 6 },
            'prata_trimestral': { name: 'Prata Trimestral (3 Meses)', total: 405.00, monthly: 135.00, months: 3 },
            'prata_semestral': { name: 'Prata Semestral (6 Meses)', total: 750.00, monthly: 125.00, months: 6 },
            'ouro_trimestral': { name: 'Ouro Trimestral (3 Meses)', total: 510.00, monthly: 170.00, months: 3 },
            'ouro_semestral': { name: 'Ouro Semestral (6 Meses)', total: 960.00, monthly: 160.00, months: 6 }
        };

        // Verifica se é modo de teste e injeta o banner
        const urlParams = new URLSearchParams(window.location.search);

        // Abre o modal de checkout automaticamente se o parâmetro ?checkout=KEY for fornecido
        window.addEventListener('DOMContentLoaded', () => {
            const checkoutKey = urlParams.get('checkout');
            if (checkoutKey && PLANS_DATA[checkoutKey]) {
                setTimeout(() => {
                    openCheckout(checkoutKey);
                }, 300);
            }
        });

        // Alternador de Aba de Preços
        function switchPricing(mode) {
            document.querySelectorAll('.pricing-toggle-btn').forEach(btn => btn.classList.remove('active'));
            if (mode === 'mensal') {
                document.getElementById('toggle-mensal').classList.add('active');
                document.getElementById('grid-mensal').classList.remove('hidden');
                document.getElementById('grid-combo').classList.add('hidden');
            } else {
                document.getElementById('toggle-combo').classList.add('active');
                document.getElementById('grid-mensal').classList.add('hidden');
                document.getElementById('grid-combo').classList.remove('hidden');
            }
        }

        // Configurações do Backend
        const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:3000'
            : 'https://api-contas-karina.onrender.com';

        let efiConfig = null;
        let submitAttempts = [];
        fetch(`${API_BASE_URL}/api/payments/efi/config`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    efiConfig = data.config;
                    console.log('Efí config carregada (sandbox:', efiConfig.sandbox, ')');
                }
            })
            .catch(err => console.error('Erro ao ler configurações da Efí no backend:', err));

        // Evento de input do cartão para atualizar bandeira dinamicamente e aplicar máscara
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '').substring(0, 16);
                let matches = val.match(/\d{1,4}/g);
                e.target.value = matches ? matches.join(' ') : val;

                const num = val;
                if (num.length >= 4 && typeof EfiPay !== 'undefined') {
                    EfiPay.CreditCard
                        .setCardNumber(num)
                        .verifyCardBrand()
                        .then(brand => {
                            const badge = document.getElementById('card-brand-badge');
                            const resolvedBrand = (brand && brand !== 'undefined' && brand !== 'unsupported') ? brand : detectCardBrand(num);
                            if (resolvedBrand) {
                                badge.textContent = String(resolvedBrand).toUpperCase();
                                highlightBrandLogo(resolvedBrand);
                            } else {
                                badge.textContent = '';
                                highlightBrandLogo(null);
                            }
                        })
                        .catch(err => {
                            console.warn('Erro ao identificar bandeira (EfiPay), tentando fallback local:', err);
                            const resolvedBrand = detectCardBrand(num);
                            if (resolvedBrand) {
                                document.getElementById('card-brand-badge').textContent = String(resolvedBrand).toUpperCase();
                                highlightBrandLogo(resolvedBrand);
                            } else {
                                document.getElementById('card-brand-badge').textContent = '';
                                highlightBrandLogo(null);
                            }
                        });
                } else {
                    document.getElementById('card-brand-badge').textContent = '';
                    highlightBrandLogo(null);
                }
            });
        }

        // Helper para formatar/mascarar inputs
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

        // Máscara do CPF: 000.000.000-00
        maskInput('cust-cpf', (val) => {
            let clean = val.replace(/\D/g, '').substring(0, 11);
            if (clean.length <= 3) return clean;
            if (clean.length <= 6) return `${clean.substring(0, 3)}.${clean.substring(3)}`;
            if (clean.length <= 9) return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6)}`;
            return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6, 9)}-${clean.substring(9)}`;
        });

        // Máscara da Data de Nascimento: 00/00/0000
        maskInput('cust-birth', (val) => {
            let clean = val.replace(/\D/g, '').substring(0, 8);
            if (clean.length <= 2) return clean;
            if (clean.length <= 4) return `${clean.substring(0, 2)}/${clean.substring(2)}`;
            return `${clean.substring(0, 2)}/${clean.substring(2, 4)}/${clean.substring(4)}`;
        });

        // Validação Matemática de CPF
        function isValidCPF(cpf) {
            cpf = cpf.replace(/\D/g, '');
            if (cpf.length !== 11) return false;
            if (/^(\d)\1{10}$/.test(cpf)) return false; // Evita CPFs com todos os dígitos iguais (ex: 111.111.111-11)

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

        const cpfInput = document.getElementById('cust-cpf');
        const cpfErrorSpan = document.getElementById('cpf-validation-error');
        
        // Função unificada para sincronizar o estado (desativar/ativar) do botão submit
        function updateSubmitButtonState() {
            const submitBtn = document.getElementById('submit-btn');
            if (!submitBtn) return;

            const isCpfOk = isFormCpfStateValid();

            const birthInput = document.getElementById('cust-birth');
            const birthVal = birthInput ? birthInput.value : '';
            const isBirthOk = isValidBirthDate(birthVal);

            const expiryInput = document.getElementById('card-expiry');
            const expiryVal = expiryInput ? expiryInput.value : '';
            const isExpiryOk = expiryVal.length === 0 || isValidExpiry(expiryVal);

            if (isCpfOk && isBirthOk && isExpiryOk) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'pointer-events-none');
            } else {
                submitBtn.disabled = true;
                submitBtn.classList.add('opacity-50', 'pointer-events-none');
            }
        }

        function handleCpfValidation() {
            const val = cpfInput.value.replace(/\D/g, '');

            if (val.length === 0) {
                cpfInput.classList.remove('border-red-400');
                cpfErrorSpan.classList.add('hidden');
                updateSubmitButtonState();
                return true;
            }
            
            if (isValidCPF(val)) {
                cpfInput.classList.remove('border-red-400');
                cpfInput.classList.add('focus:border-karina-orange');
                cpfErrorSpan.classList.add('hidden');
                updateSubmitButtonState();
                return true;
            } else {
                cpfInput.classList.add('border-red-400');
                cpfInput.classList.remove('focus:border-karina-orange');
                cpfErrorSpan.classList.remove('hidden');
                updateSubmitButtonState();
                return false;
            }
        }

        if (cpfInput && cpfErrorSpan) {
            cpfInput.addEventListener('input', (e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length === 11) {
                    handleCpfValidation();
                } else {
                    // Limpa o estado de erro enquanto o usuário digita (não completou 11)
                    cpfInput.classList.remove('border-red-400');
                    cpfErrorSpan.classList.add('hidden');
                    updateSubmitButtonState();
                }
            });

            cpfInput.addEventListener('blur', () => {
                handleCpfValidation();
            });
        }

        // Máscara e Validação de Validade do Cartão (MM/AA)
        maskInput('card-expiry', (val) => {
            let clean = val.replace(/\D/g, '').substring(0, 4);
            if (clean.length <= 2) return clean;
            return `${clean.substring(0, 2)}/${clean.substring(2)}`;
        });

        const expiryInput = document.getElementById('card-expiry');
        const expiryErrorSpan = document.getElementById('card-expiry-error');

        function handleExpiryValidation() {
            if (!expiryInput) return true;
            const val = expiryInput.value.replace(/\D/g, '');
            if (val.length === 0) {
                expiryInput.classList.remove('border-red-400');
                if (expiryErrorSpan) expiryErrorSpan.classList.add('hidden');
                updateSubmitButtonState();
                return true;
            }

            if (isValidExpiry(expiryInput.value)) {
                expiryInput.classList.remove('border-red-400');
                expiryInput.classList.add('focus:border-karina-orange');
                if (expiryErrorSpan) expiryErrorSpan.classList.add('hidden');
                updateSubmitButtonState();
                return true;
            } else {
                expiryInput.classList.add('border-red-400');
                expiryInput.classList.remove('focus:border-karina-orange');
                if (expiryErrorSpan) expiryErrorSpan.classList.remove('hidden');
                updateSubmitButtonState();
                return false;
            }
        }

        if (expiryInput && expiryErrorSpan) {
            expiryInput.addEventListener('input', (e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length === 6) {
                    handleExpiryValidation();
                } else {
                    expiryInput.classList.remove('border-red-400');
                    expiryErrorSpan.classList.add('hidden');
                    updateSubmitButtonState();
                }
            });

            expiryInput.addEventListener('blur', () => {
                handleExpiryValidation();
            });
        }

        // Validação de Data de Nascimento e Idade Mínima
        const birthInput = document.getElementById('cust-birth');
        const birthErrorSpan = document.getElementById('birth-validation-error');

        function handleBirthValidation() {
            if (!birthInput) return true;
            const val = birthInput.value;
            if (!val) {
                birthInput.classList.remove('border-red-400');
                if (birthErrorSpan) birthErrorSpan.classList.add('hidden');
                updateSubmitButtonState();
                return true;
            }

            if (isValidBirthDate(val)) {
                birthInput.classList.remove('border-red-400');
                birthInput.classList.add('focus:border-karina-orange');
                if (birthErrorSpan) birthErrorSpan.classList.add('hidden');
                updateSubmitButtonState();
                return true;
            } else {
                birthInput.classList.add('border-red-400');
                birthInput.classList.remove('focus:border-karina-orange');
                if (birthErrorSpan) birthErrorSpan.classList.remove('hidden');
                updateSubmitButtonState();
                return false;
            }
        }

        if (birthInput && birthErrorSpan) {
            // Ao focar ou digitar, remove a borda de erro e esconde a mensagem
            birthInput.addEventListener('focus', () => {
                birthInput.classList.remove('border-red-400');
                birthErrorSpan.classList.add('hidden');
            });
            
            birthInput.addEventListener('input', () => {
                birthInput.classList.remove('border-red-400');
                birthErrorSpan.classList.add('hidden');
            });

            // Valida apenas ao perder o foco (blur)
            birthInput.addEventListener('blur', () => {
                handleBirthValidation();
            });
        }

        // Toggle de CPF do Titular do Cartão diferente do Aluno
        const diffHolderCheckbox = document.getElementById('different-holder-cpf');
        const holderCpfWrapper = document.getElementById('holder-cpf-wrapper');
        const holderCpfInput = document.getElementById('card-holder-cpf');
        const holderCpfErrorSpan = document.getElementById('holder-cpf-validation-error');

        function isFormCpfStateValid() {
            const studentCpf = cpfInput.value.replace(/\D/g, '');
            if (studentCpf.length > 0 && !isValidCPF(studentCpf)) return false;

            if (diffHolderCheckbox && diffHolderCheckbox.checked && holderCpfInput) {
                const holderCpf = holderCpfInput.value.replace(/\D/g, '');
                if (holderCpf.length > 0 && !isValidCPF(holderCpf)) return false;
            }
            return true;
        }

        if (diffHolderCheckbox && holderCpfWrapper && holderCpfInput) {
            diffHolderCheckbox.addEventListener('change', () => {
                if (diffHolderCheckbox.checked) {
                    holderCpfWrapper.classList.remove('hidden');
                    holderCpfInput.required = true;
                    handleHolderCpfValidation();
                } else {
                    holderCpfWrapper.classList.add('hidden');
                    holderCpfInput.required = false;
                    holderCpfInput.value = '';
                    holderCpfInput.classList.remove('border-red-400');
                    if (holderCpfErrorSpan) holderCpfErrorSpan.classList.add('hidden');
                    handleCpfValidation();
                }
            });
        }

        // Máscara do CPF do Titular do Cartão
        maskInput('card-holder-cpf', (val) => {
            let clean = val.replace(/\D/g, '').substring(0, 11);
            if (clean.length <= 3) return clean;
            if (clean.length <= 6) return `${clean.substring(0, 3)}.${clean.substring(3)}`;
            if (clean.length <= 9) return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6)}`;
            return `${clean.substring(0, 3)}.${clean.substring(3, 6)}.${clean.substring(6, 9)}-${clean.substring(9)}`;
        });

        function handleHolderCpfValidation() {
            if (!diffHolderCheckbox || !diffHolderCheckbox.checked) return true;
            const val = holderCpfInput.value.replace(/\D/g, '');

            let isHolderCpfOk = true;
            if (val.length > 0) {
                if (isValidCPF(val)) {
                    holderCpfInput.classList.remove('border-red-400');
                    holderCpfInput.classList.add('focus:border-karina-orange');
                    if (holderCpfErrorSpan) holderCpfErrorSpan.classList.add('hidden');
                } else {
                    holderCpfInput.classList.add('border-red-400');
                    holderCpfInput.classList.remove('focus:border-karina-orange');
                    if (holderCpfErrorSpan) holderCpfErrorSpan.classList.remove('hidden');
                    isHolderCpfOk = false;
                }
            } else {
                holderCpfInput.classList.remove('border-red-400');
                if (holderCpfErrorSpan) holderCpfErrorSpan.classList.add('hidden');
            }

            updateSubmitButtonState();
            return isHolderCpfOk;
        }

        if (holderCpfInput && holderCpfErrorSpan) {
            holderCpfInput.addEventListener('input', (e) => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length === 11) {
                    handleHolderCpfValidation();
                } else {
                    holderCpfInput.classList.remove('border-red-400');
                    holderCpfErrorSpan.classList.add('hidden');
                    updateSubmitButtonState();
                }
            });

            holderCpfInput.addEventListener('blur', () => {
                handleHolderCpfValidation();
            });
        }

        // Máscara do WhatsApp/Celular: (00) 00000-0000
        maskInput('cust-phone', (val) => {
            let clean = val.replace(/\D/g, '').substring(0, 11);
            if (clean.length === 0) return '';
            if (clean.length <= 2) return `(${clean}`;
            if (clean.length <= 6) return `(${clean.substring(0, 2)}) ${clean.substring(2)}`;
            if (clean.length <= 10) return `(${clean.substring(0, 2)}) ${clean.substring(2, 6)}-${clean.substring(6)}`;
            return `(${clean.substring(0, 2)}) ${clean.substring(2, 7)}-${clean.substring(7)}`;
        });

        // Máscara do CEP: 00000-000
        maskInput('addr-zipcode', (val) => {
            let clean = val.replace(/\D/g, '').substring(0, 8);
            if (clean.length <= 5) return clean;
            return `${clean.substring(0, 5)}-${clean.substring(5)}`;
        });

        // Máscara de validade do cartão: MM/AA
        maskInput('card-expiry', (val) => {
            let clean = val.replace(/\D/g, '').substring(0, 4);
            if (clean.length <= 2) return clean;
            return `${clean.substring(0, 2)}/${clean.substring(2)}`;
        });

        // Máscara do CVV (máx 4 dígitos numéricos)
        maskInput('card-cvv', (val) => {
            return val.replace(/\D/g, '').substring(0, 4);
        });

        // Nome do Titular do Cartão: Apenas letras maiúsculas, sem números ou múltiplos espaços consecutivos
        maskInput('card-name', (val) => {
            return val.toUpperCase().replace(/[^A-Z\s]/g, '').replace(/\s{2,}/g, ' ');
        });

        // Validação de correspondência de e-mail em tempo real
        const emailInput = document.getElementById('cust-email');
        const emailConfirmInput = document.getElementById('cust-email-confirm');
        const emailMatchError = document.getElementById('email-match-error');

        function checkEmailMatch() {
            if (!emailConfirmInput.value) {
                emailMatchError.classList.add('hidden');
                emailConfirmInput.classList.remove('border-red-500/50');
                return;
            }
            if (emailInput.value !== emailConfirmInput.value) {
                emailMatchError.classList.remove('hidden');
                emailConfirmInput.classList.add('border-red-500/50');
                emailConfirmInput.classList.remove('focus:border-karina-orange');
            } else {
                emailMatchError.classList.add('hidden');
                emailConfirmInput.classList.remove('border-red-500/50');
                emailConfirmInput.classList.add('focus:border-karina-orange');
            }
        }
        if (emailInput && emailConfirmInput) {
            emailInput.addEventListener('input', checkEmailMatch);
            emailConfirmInput.addEventListener('input', checkEmailMatch);
        }

        // Abrir Modal de Checkout
        function openCheckout(comboKey) {
            if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
            }

            const plan = PLANS_DATA[comboKey];
            if (!plan) return;

            // Evento begin_checkout do Google Analytics
            if (typeof gtag === 'function') {
                gtag('event', 'begin_checkout', {
                    currency: 'BRL',
                    value: plan.total,
                    items: [{
                        item_id: comboKey,
                        item_name: plan.name,
                        price: plan.total,
                        quantity: 1
                    }]
                });
            }

            // Limpa dados e erros anteriores
            const form = document.getElementById('checkout-form');
            if (form) form.reset();

            const badge = document.getElementById('card-brand-badge');
            if (badge) badge.textContent = '';

            const cpfInput = document.getElementById('cust-cpf');
            const cpfErrorSpan = document.getElementById('cpf-validation-error');
            if (cpfInput) {
                cpfInput.classList.remove('border-red-400');
                cpfInput.classList.add('focus:border-karina-orange');
            }
            if (cpfErrorSpan) cpfErrorSpan.classList.add('hidden');

            const diffHolderCheckbox = document.getElementById('different-holder-cpf');
            const holderCpfWrapper = document.getElementById('holder-cpf-wrapper');
            const holderCpfInput = document.getElementById('card-holder-cpf');
            const holderCpfErrorSpan = document.getElementById('holder-cpf-validation-error');
            if (diffHolderCheckbox) diffHolderCheckbox.checked = false;
            if (holderCpfWrapper) holderCpfWrapper.classList.add('hidden');
            if (holderCpfInput) {
                holderCpfInput.required = false;
                holderCpfInput.value = '';
                holderCpfInput.classList.remove('border-red-400');
            }
            if (holderCpfErrorSpan) holderCpfErrorSpan.classList.add('hidden');

            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-50', 'pointer-events-none');
            }

            const termsContainer = document.getElementById('checkout-terms-container');
            if (termsContainer) {
                termsContainer.classList.remove('hidden');
            }

            const expiryInput = document.getElementById('card-expiry');
            const expiryErrorSpan = document.getElementById('card-expiry-error');
            if (expiryInput) {
                expiryInput.classList.remove('border-red-400');
                expiryInput.classList.add('focus:border-karina-orange');
            }
            if (expiryErrorSpan) expiryErrorSpan.classList.add('hidden');

            const birthInput = document.getElementById('cust-birth');
            const birthErrorSpan = document.getElementById('birth-validation-error');
            if (birthInput) {
                birthInput.classList.remove('border-red-400');
                birthInput.classList.add('focus:border-karina-orange');
            }
            if (birthErrorSpan) birthErrorSpan.classList.add('hidden');

            highlightBrandLogo(null);

            document.getElementById('form-combo-key').value = comboKey;
            document.getElementById('checkout-plan-name').textContent = plan.name;
            
            // Lógica condicional de Exibição dependendo se é mensal (PIX) ou combo (Cartão)
            if (plan.type === 'mensal') {
                document.getElementById('checkout-plan-price').textContent = `Mensalidade com Desconto: R$ ${plan.total.toFixed(2)} via PIX`;
                
                // Oculta cartão, endereço e logos de cartão
                document.getElementById('step-2').classList.add('hidden');
                document.getElementById('step-3').classList.add('hidden');
                document.getElementById('brand-logos-container').classList.add('hidden');
                document.getElementById('step-pix').classList.add('hidden'); // Oculta até gerar
                
                // Exibe passo 1 se ocultado
                document.getElementById('step-1').classList.remove('hidden');
                
                // Remove required de endereço e cartão
                setRequiredFields(false);
                
                if (submitBtn) {
                    submitBtn.classList.remove('hidden');
                    submitBtn.innerHTML = '<i data-lucide="qr-code" class="w-4 h-4"></i> GERAR QR CODE PIX';
                }
            } else {
                document.getElementById('checkout-plan-price').textContent = `Total: R$ ${plan.total.toFixed(2)} (${plan.months}x de R$ ${plan.monthly.toFixed(2)})`;
                
                // Exibe cartão, endereço e logos de cartão
                document.getElementById('step-2').classList.remove('hidden');
                document.getElementById('step-3').classList.remove('hidden');
                document.getElementById('brand-logos-container').classList.remove('hidden');
                document.getElementById('step-pix').classList.add('hidden');
                
                // Exibe passo 1
                document.getElementById('step-1').classList.remove('hidden');
                
                // Adiciona required de endereço e cartão
                setRequiredFields(true);
                
                if (submitBtn) {
                    submitBtn.classList.remove('hidden');
                    submitBtn.innerHTML = '<i data-lucide="lock" class="w-4 h-4"></i> FINALIZAR MATRÍCULA';
                }
                
                // Gerar opções de parcelas
                const installmentsSelect = document.getElementById('card-installments');
                installmentsSelect.innerHTML = '';
                for (let i = 1; i <= plan.months; i++) {
                    const value = plan.total / i;
                    const opt = document.createElement('option');
                    opt.value = i;
                    opt.textContent = `${i}x de R$ ${value.toFixed(2)} sem juros`;
                    if (i === plan.months) opt.selected = true;
                    installmentsSelect.appendChild(opt);
                }

                // Atualizar Resumo de Compra Inicial
                document.getElementById('summary-plan-name').textContent = plan.name;
                document.getElementById('summary-plan-total').textContent = `R$ ${plan.total.toFixed(2)}`;
                document.getElementById('summary-payment-installment').textContent = `${plan.months}x de R$ ${plan.monthly.toFixed(2)} sem juros`;

                // Listener para atualizar o resumo dinamicamente quando a parcela mudar
                installmentsSelect.addEventListener('change', () => {
                    const selectedInstallment = Number(installmentsSelect.value);
                    const valInstallment = plan.total / selectedInstallment;
                    document.getElementById('summary-payment-installment').textContent = `${selectedInstallment}x de R$ ${valInstallment.toFixed(2)} sem juros`;
                });
            }

            // Recria ícones Lucide
            if (window.lucide) lucide.createIcons();

            document.getElementById('checkout-error').classList.add('hidden');
            document.getElementById('checkout-error').textContent = '';
            document.getElementById('checkout-modal').classList.remove('hidden');
        }

        // Função auxiliar para gerenciar required dinamicamente
        function setRequiredFields(required) {
            // Campos de endereço
            document.getElementById('addr-zipcode').required = required;
            document.getElementById('addr-number').required = required;
            document.getElementById('addr-street').required = required;
            document.getElementById('addr-neighborhood').required = required;
            document.getElementById('addr-city').required = required;
            document.getElementById('addr-state').required = required;
            
            // Campos de cartão
            document.getElementById('card-name').required = required;
            document.getElementById('card-number').required = required;
            document.getElementById('card-expiry').required = required;
            document.getElementById('card-cvv').required = required;
            document.getElementById('card-installments').required = required;
        }

        // Fechar Modal
        function closeCheckout() {
            if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
            }
            document.getElementById('checkout-modal').classList.add('hidden');
        }

        // Buscar CEP
        function buscarCEP() {
            const zipcode = document.getElementById('addr-zipcode').value.replace(/\D/g, '');
            if (zipcode.length !== 8) return;

            fetch(`https://viacep.com.br/ws/${zipcode}/json/`)
                .then(res => res.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('addr-street').value = data.logradouro;
                        document.getElementById('addr-neighborhood').value = data.bairro;
                        document.getElementById('addr-city').value = data.localidade;
                        document.getElementById('addr-state').value = data.uf;
                    }
                })
                .catch(err => console.warn('Falha ao buscar CEP via API:', err));
        }

        // Accordion FAQ
        function toggleFaq(id) {
            const ans = document.getElementById(`faq-ans-${id}`);
            const icon = document.getElementById(`faq-icon-${id}`);
            
            if (ans.style.maxHeight && ans.style.maxHeight !== '0px') {
                ans.style.maxHeight = '0px';
                icon.style.transform = 'rotate(0deg)';
            } else {
                ans.style.maxHeight = ans.scrollHeight + 'px';
                icon.style.transform = 'rotate(45deg)';
            }
        }



        // Algoritmo de Luhn para validação matemática de número de cartão de crédito (Mod 10)
        function validateLuhn(cardNumber) {
            let sum = 0;
            let shouldDouble = false;
            for (let i = cardNumber.length - 1; i >= 0; i--) {
                let digit = parseInt(cardNumber.charAt(i), 10);
                if (shouldDouble) {
                    digit *= 2;
                    if (digit > 9) digit -= 9;
                }
                sum += digit;
                shouldDouble = !shouldDouble;
            }
            return (sum % 10) === 0;
        }

        // Submit do Form
        function handleFormSubmit(event) {
            event.preventDefault();
            const errorDiv = document.getElementById('checkout-error');
            errorDiv.classList.add('hidden');

            // Validar Termos de Serviço e Política de Privacidade
            const acceptTerms = document.getElementById('accept-terms');
            if (acceptTerms && !acceptTerms.checked) {
                errorDiv.textContent = 'Você precisa ler e aceitar os Termos de Serviço e a Política de Privacidade para prosseguir.';
                errorDiv.classList.remove('hidden');
                return;
            }

            const selectedComboKey = document.getElementById('form-combo-key').value;
            const plan = PLANS_DATA[selectedComboKey];

            // Fluxo PIX para Planos Mensais
            if (plan.type === 'mensal') {
                const email = document.getElementById('cust-email').value.trim();
                const emailConfirm = document.getElementById('cust-email-confirm').value.trim();
                if (email !== emailConfirm) {
                    errorDiv.textContent = 'Os e-mails informados não são idênticos. Verifique a digitação.';
                    errorDiv.classList.remove('hidden');
                    return;
                }

                const birthVal = document.getElementById('cust-birth').value;
                if (!isValidBirthDate(birthVal)) {
                    errorDiv.textContent = 'A idade mínima do aluno para assinar a assessoria é de 16 anos.';
                    errorDiv.classList.remove('hidden');
                    return;
                }

                const cpf = document.getElementById('cust-cpf').value.replace(/\D/g, '');
                if (cpf.length !== 11 || !isValidCPF(cpf)) {
                    errorDiv.textContent = 'O CPF informado é inválido. Verifique os números digitados.';
                    errorDiv.classList.remove('hidden');
                    return;
                }

                const phone = document.getElementById('cust-phone').value.replace(/\D/g, '');
                if (phone.length < 10 || phone.length > 11) {
                    errorDiv.textContent = 'O número de celular deve conter o DDD com 10 ou 11 dígitos.';
                    errorDiv.classList.remove('hidden');
                    return;
                }

                // Oculta formulário e exibe tela do PIX com loading
                document.getElementById('step-1').classList.add('hidden');
                document.getElementById('submit-btn').classList.add('hidden');
                document.getElementById('checkout-terms-container').classList.add('hidden');
                document.getElementById('step-pix').classList.remove('hidden');
                document.getElementById('pix-qrcode-img').classList.add('hidden');
                document.getElementById('pix-qrcode-loading').classList.remove('hidden');

                const payload = {
                    name: document.getElementById('cust-name').value.trim(),
                    email: email,
                    phone: phone,
                    cpf: cpf,
                    planKey: selectedComboKey
                };

                fetch(`${API_BASE_URL}/api/payments/efi/checkout-pix`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        if (data.data.status === 'PAID') {
                            window.location.href = '/planos/sucesso.html?type=pix';
                            return;
                        }

                        document.getElementById('pix-qrcode-img').src = data.data.imagemQrcode;
                        document.getElementById('pix-qrcode-img').classList.remove('hidden');
                        document.getElementById('pix-qrcode-loading').classList.add('hidden');
                        
                        document.getElementById('pix-copia-cola').value = data.data.qrcode;

                        try {
                            sessionStorage.setItem('last_purchase', JSON.stringify({
                                comboKey: selectedComboKey,
                                name: plan.name,
                                total: plan.total
                            }));
                        } catch (e) {
                            console.error('Erro ao salvar metadados da compra:', e);
                        }

                        startPixPolling(data.data.txid);
                    } else {
                        // Retorna ao passo 1 se falhar
                        document.getElementById('step-1').classList.remove('hidden');
                        document.getElementById('submit-btn').classList.remove('hidden');
                        document.getElementById('checkout-terms-container').classList.remove('hidden');
                        document.getElementById('step-pix').classList.add('hidden');
                        errorDiv.textContent = data.message || 'Falha ao gerar cobrança PIX.';
                        errorDiv.classList.remove('hidden');
                    }
                })
                .catch(err => {
                    console.error(err);
                    document.getElementById('step-1').classList.remove('hidden');
                    document.getElementById('submit-btn').classList.remove('hidden');
                    document.getElementById('checkout-terms-container').classList.remove('hidden');
                    document.getElementById('step-pix').classList.add('hidden');
                    errorDiv.textContent = 'Erro de comunicação ao solicitar PIX. Tente novamente.';
                    errorDiv.classList.remove('hidden');
                });

                return;
            }

            // 0. Anti-Brute-Force (Limite Local de Requisições)
            const now = Date.now();
            submitAttempts = submitAttempts.filter(time => now - time < 60000);
            if (submitAttempts.length >= 3) {
                errorDiv.textContent = 'Muitas tentativas de matrícula seguidas. Aguarde 1 minuto para tentar novamente.';
                errorDiv.classList.remove('hidden');
                return;
            }
            submitAttempts.push(now);

            // 0.1 Honeypot (Bloqueio de Bots)
            const honeyName = document.getElementById('honey_field_name').value;
            const honeyEmail = document.getElementById('honey_field_email').value;
            if (honeyName || honeyEmail) {
                console.warn('Bot detectado via honeypot.');
                // Simular carregamento interno para despistar o bot
                setSubmitButtonLoading(true);
                setTimeout(() => {
                    setSubmitButtonLoading(false);
                    errorDiv.textContent = 'Erro de comunicação temporário. Tente novamente mais tarde.';
                    errorDiv.classList.remove('hidden');
                }, 4000);
                return;
            }

            if (!efiConfig || typeof EfiPay === 'undefined') {
                errorDiv.textContent = 'Erro de inicialização do gateway de pagamento. Recarregue a página.';
                errorDiv.classList.remove('hidden');
                return;
            }

            // 1. Validar e-mails idênticos
            const email = document.getElementById('cust-email').value.trim();
            const emailConfirm = document.getElementById('cust-email-confirm').value.trim();
            if (email !== emailConfirm) {
                errorDiv.textContent = 'Os e-mails informados não são idênticos. Verifique a digitação.';
                errorDiv.classList.remove('hidden');
                return;
            }

            // Validar Data de Nascimento e Idade Mínima (15 anos)
            const birthVal = document.getElementById('cust-birth').value;
            if (!isValidBirthDate(birthVal)) {
                errorDiv.textContent = 'A idade mínima do aluno para assinar a assessoria é de 16 anos.';
                errorDiv.classList.remove('hidden');
                handleBirthValidation();
                return;
            }

            // 2. Validar CPF completo (11 dígitos) e matemático
            const cpf = document.getElementById('cust-cpf').value.replace(/\D/g, '');
            if (cpf.length !== 11 || !isValidCPF(cpf)) {
                errorDiv.textContent = 'O CPF informado é inválido. Verifique os números digitados.';
                errorDiv.classList.remove('hidden');
                handleCpfValidation();
                return;
            }

            // Validar CPF do Titular se for diferente
            if (document.getElementById('different-holder-cpf').checked) {
                const holderCpf = document.getElementById('card-holder-cpf').value.replace(/\D/g, '');
                if (holderCpf.length !== 11 || !isValidCPF(holderCpf)) {
                    errorDiv.textContent = 'O CPF do titular do cartão informado é inválido.';
                    errorDiv.classList.remove('hidden');
                    handleHolderCpfValidation();
                    return;
                }
            }

            // 3. Validar WhatsApp completo (10 ou 11 dígitos)
            const phone = document.getElementById('cust-phone').value.replace(/\D/g, '');
            if (phone.length < 10 || phone.length > 11) {
                errorDiv.textContent = 'O número de celular deve conter o DDD com 10 ou 11 dígitos.';
                errorDiv.classList.remove('hidden');
                return;
            }

            // 4. Validar CEP (8 dígitos)
            const zipcode = document.getElementById('addr-zipcode').value.replace(/\D/g, '');
            if (zipcode.length !== 8) {
                errorDiv.textContent = 'O CEP informado está incompleto.';
                errorDiv.classList.remove('hidden');
                return;
            }

            // 5. Validar número do cartão via algoritmo de Luhn (Mod 10)
            const cardNumber = document.getElementById('card-number').value.replace(/\D/g, '');
            if (cardNumber.length < 13 || cardNumber.length > 19 || !validateLuhn(cardNumber)) {
                errorDiv.textContent = 'O número do cartão de crédito digitado é inválido. Verifique a digitação.';
                errorDiv.classList.remove('hidden');
                return;
            }

            // Exibir Loading inline no botão
            setSubmitButtonLoading(true);

            const cardName = document.getElementById('card-name').value.trim();
            const cardCvv = document.getElementById('card-cvv').value.trim();
            const expiry = document.getElementById('card-expiry').value.replace(/\D/g, '');
            
            // 5. Validar Validade do Cartão (matemático e futuro)
            const cardExpiryVal = document.getElementById('card-expiry').value;
            if (!isValidExpiry(cardExpiryVal)) {
                setSubmitButtonLoading(false);
                errorDiv.textContent = 'A data de validade do cartão inserida é inválida ou expirou.';
                errorDiv.classList.remove('hidden');
                handleExpiryValidation();
                return;
            }

            const expMonth = expiry.substring(0, 2);
            const expYear = "20" + expiry.substring(2);

            // 6. Validar CVV
            if (cardCvv.length < 3 || cardCvv.length > 4) {
                setSubmitButtonLoading(false);
                errorDiv.textContent = 'O código de segurança (CVV) do cartão deve conter 3 ou 4 dígitos.';
                errorDiv.classList.remove('hidden');
                return;
            }

            // Gerar Token do Cartão com o SDK da Efí (builder pattern)
            try {
                EfiPay.CreditCard
                    .setCardNumber(cardNumber)
                    .verifyCardBrand()
                .then(brand => {
                    const resolvedBrand = (brand && brand !== 'undefined' && brand !== 'unsupported') ? brand : detectCardBrand(cardNumber);
                    if (!resolvedBrand) {
                        setSubmitButtonLoading(false);
                        errorDiv.textContent = 'Bandeira do cartão não identificada ou não suportada.';
                        errorDiv.classList.remove('hidden');
                        return null;
                    }

                    return EfiPay.CreditCard
                        .setAccount(efiConfig.accountId)
                        .setEnvironment(efiConfig.sandbox ? 'sandbox' : 'production')
                        .setCreditCardData({
                            brand: resolvedBrand,
                            number: cardNumber,
                            cvv: cardCvv,
                            expirationMonth: expMonth,
                            expirationYear: expYear,
                            holderName: cardName,
                            holderDocument: document.getElementById('different-holder-cpf').checked
                                ? document.getElementById('card-holder-cpf').value.replace(/\D/g, '')
                                : document.getElementById('cust-cpf').value.replace(/\D/g, ''),
                            reuse: false
                        })
                        .getPaymentToken();
                })
                .then(tokenResponse => {
                    if (!tokenResponse) return; // Se a verificação de bandeira falhou e retornou null

                    const paymentToken = tokenResponse.payment_token;
                    
                    // Enviar para o backend
                    const payload = {
                        paymentToken: paymentToken,
                        installments: document.getElementById('card-installments').value,
                        comboKey: document.getElementById('form-combo-key').value,
                        customer: {
                            name: document.getElementById('cust-name').value.trim(),
                            email: document.getElementById('cust-email').value.trim(),
                            cpf: document.getElementById('cust-cpf').value.replace(/\D/g, ''),
                            birth: (() => {
                                const rawBirth = document.getElementById('cust-birth').value;
                                if (rawBirth.includes('/')) {
                                    const parts = rawBirth.split('/');
                                    if (parts.length === 3) {
                                        return `${parts[2]}-${parts[1]}-${parts[0]}`;
                                    }
                                }
                                return rawBirth;
                            })(),
                            phone: document.getElementById('cust-phone').value.replace(/\D/g, '')
                        },
                        billingAddress: {
                            street: document.getElementById('addr-street').value.trim(),
                            number: document.getElementById('addr-number').value.trim(),
                            neighborhood: document.getElementById('addr-neighborhood').value.trim(),
                            zipcode: document.getElementById('addr-zipcode').value.replace(/\D/g, ''),
                            city: document.getElementById('addr-city').value.trim(),
                            state: document.getElementById('addr-state').value.trim().toUpperCase()
                        }
                    };

                    return fetch(`${API_BASE_URL}/api/payments/efi/checkout`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                })
                .then(res => {
                    if (!res) return null;
                    return res.json();
                })
                .then(data => {
                    if (!data) return;
                    setSubmitButtonLoading(false);
                    if (data.success) {
                        // Salva dados da compra para disparar a conversão na página de sucesso
                        try {
                            const selectedComboKey = document.getElementById('form-combo-key').value;
                            const plan = PLANS_DATA[selectedComboKey];
                            if (plan) {
                                sessionStorage.setItem('last_purchase', JSON.stringify({
                                    comboKey: selectedComboKey,
                                    name: plan.name,
                                    total: plan.total
                                }));
                            }
                        } catch (e) {
                            console.error('Erro ao salvar metadados da compra:', e);
                        }

                        // Sucesso! Redireciona
                        window.location.href = '/planos/sucesso.html';
                    } else {
                        // Erro retornado pelo controller
                        errorDiv.textContent = translateCheckoutError(data.message);
                        errorDiv.classList.remove('hidden');
                    }
                })
                .catch(err => {
                    console.error(err);
                    setSubmitButtonLoading(false);
                    errorDiv.textContent = translateCheckoutError(err);
                    errorDiv.classList.remove('hidden');
                });
            } catch (e) {
                console.error(e);
                setSubmitButtonLoading(false);
                errorDiv.textContent = translateCheckoutError(e);
                errorDiv.classList.remove('hidden');
            }
        }

        // Polling de pagamento PIX
        function startPixPolling(txid) {
            if (pollingInterval) clearInterval(pollingInterval);

            pollingInterval = setInterval(() => {
                fetch(`${API_BASE_URL}/api/payments/status/${txid}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.data.status === 'PAID') {
                            clearInterval(pollingInterval);
                            window.location.href = '/planos/sucesso.html?type=pix';
                        }
                    })
                    .catch(err => console.warn('Erro de comunicação no polling do PIX:', err));
            }, 3000);
        }

        // Copiar Código Pix Copia/Cola
        function copyPixCode() {
            const input = document.getElementById('pix-copia-cola');
            if (!input) return;
            input.select();
            input.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(input.value)
                .then(() => {
                    const successMsg = document.getElementById('pix-copied-success');
                    if (successMsg) {
                        successMsg.classList.remove('hidden');
                        setTimeout(() => {
                            successMsg.classList.add('hidden');
                        }, 3000);
                    }
                })
                .catch(err => console.error('Erro ao copiar código PIX:', err));
        }

        // Inicializa scripts ao carregar
        window.addEventListener('DOMContentLoaded', () => {
            lucide.createIcons();
        });
