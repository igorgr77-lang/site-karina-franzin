// Formulário da Lista VIP (pré-lançamento). A lista vem do atributo data-list do <form>.
// Envia nome, e-mail e WhatsApp para o backend (Render), que salva no banco e aparece na
// aba "Listas VIP" da Central de Comando. Protegido pelo CAPTCHA invisível (Turnstile).
(function () {
    const API_BASE_URL = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
        ? 'http://localhost:3000'
        : 'https://api-contas-karina.onrender.com';
    const TURNSTILE_SITE_KEY = '0x4AAAAAAFqgV18OVJpBZWz6';
    const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

    let turnstileScriptPromise = null;
    let turnstileWidgetId = null;
    let turnstileDeliver = null;

    function loadTurnstile() {
        if (window.turnstile) return Promise.resolve(window.turnstile);
        if (!turnstileScriptPromise) {
            turnstileScriptPromise = new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = TURNSTILE_SCRIPT_SRC;
                s.async = true;
                s.onload = () => window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile indisponivel'));
                s.onerror = () => { turnstileScriptPromise = null; reject(new Error('falha ao carregar turnstile')); };
                document.head.appendChild(s);
            });
        }
        return turnstileScriptPromise;
    }

    // Token novo (uso único) ou null se o CAPTCHA não carregar; nesse caso o servidor decide.
    function getTurnstileToken() {
        return loadTurnstile().then(turnstile => new Promise(resolve => {
            const timer = setTimeout(() => finish(null), 45000);
            function finish(token) { clearTimeout(timer); turnstileDeliver = null; resolve(token); }
            turnstileDeliver = finish;
            const container = document.getElementById('waitlist-turnstile');
            if (turnstileWidgetId === null) {
                turnstileWidgetId = turnstile.render(container, {
                    sitekey: TURNSTILE_SITE_KEY,
                    theme: 'dark',
                    language: 'pt-br',
                    execution: 'execute',
                    appearance: 'interaction-only',
                    callback: t => turnstileDeliver && turnstileDeliver(t),
                    'error-callback': () => turnstileDeliver && turnstileDeliver(null),
                    'timeout-callback': () => turnstileDeliver && turnstileDeliver(null)
                });
            } else {
                turnstile.reset(turnstileWidgetId);
            }
            turnstile.execute(turnstileWidgetId);
        })).catch(() => null);
    }

    function maskPhone(value) {
        const d = value.replace(/\D/g, '').slice(0, 11);
        if (d.length <= 2) return d.length ? `(${d}` : '';
        if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
        if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
        return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }

    // De onde a pessoa veio: ?utm_source=... ou ?origem=links (link do /links)
    function getSource() {
        const params = new URLSearchParams(location.search);
        const src = params.get('utm_source') || params.get('origem') || 'site';
        return src.replace(/[^\w.-]/g, '').slice(0, 60) || 'site';
    }

    function init() {
        const form = document.getElementById('waitlist-form');
        if (!form) return;
        // Lista VIP desta página (cadastrada na Central de Comando), ex.: data-list="presencial_iniciante"
        const listKey = form.dataset.list || 'portal_atleta';

        const phone = document.getElementById('wl-phone');
        const errorBox = document.getElementById('waitlist-error');
        const btn = document.getElementById('waitlist-submit');
        const btnLabel = btn.querySelector('span');
        const success = document.getElementById('waitlist-success');

        phone.addEventListener('input', () => { phone.value = maskPhone(phone.value); });
        // Pré-carrega o CAPTCHA quando a pessoa começa a preencher
        form.addEventListener('focusin', () => { loadTurnstile().catch(() => {}); }, { once: true });

        function showError(msg) {
            errorBox.textContent = msg;
            errorBox.classList.remove('hidden');
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorBox.classList.add('hidden');

            // Honeypot: robôs preenchem o campo escondido
            if (document.getElementById('wl-website').value) return;

            const name = document.getElementById('wl-name').value.trim();
            const email = document.getElementById('wl-email').value.trim();
            const phoneDigits = phone.value.replace(/\D/g, '');
            const consent = document.getElementById('wl-consent').checked;

            if (name.length < 2) return showError('Informe seu nome.');
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return showError('Informe um e-mail válido.');
            if (phoneDigits.length < 10) return showError('Informe seu WhatsApp com DDD.');
            if (!consent) return showError('Marque a caixa para receber o aviso de lançamento.');

            btn.disabled = true;
            btn.classList.add('opacity-75', 'pointer-events-none');
            const originalLabel = btnLabel.textContent;
            btnLabel.textContent = 'Enviando...';

            try {
                const captchaToken = await getTurnstileToken();
                const res = await fetch(`${API_BASE_URL}/api/waitlist`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product: listKey, name, email, phone: phoneDigits, consent, source: getSource(), captchaToken })
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || data.success === false) throw new Error(data.message || 'Não foi possível concluir sua inscrição agora.');

                form.classList.add('hidden');
                success.classList.remove('hidden');
                if (typeof gtag === 'function') gtag('event', 'generate_lead', { lead_source: `lista_vip_${listKey}` });
            } catch (err) {
                const offline = err instanceof TypeError; // falha de rede (servidor acordando, sem internet)
                showError(offline
                    ? 'Não conseguimos conectar agora. Aguarde alguns segundos e tente de novo.'
                    : err.message);
            } finally {
                btn.disabled = false;
                btn.classList.remove('opacity-75', 'pointer-events-none');
                btnLabel.textContent = originalLabel;
            }
        });
    }

    // Accordion do FAQ (antes vinha do checkout.js, que saiu desta página no pré-lançamento)
    window.toggleFaq = function (id) {
        const ans = document.getElementById(`faq-ans-${id}`);
        const icon = document.getElementById(`faq-icon-${id}`);
        const open = ans.style.maxHeight && ans.style.maxHeight !== '0px';
        ans.style.maxHeight = open ? '0px' : ans.scrollHeight + 'px';
        if (icon) icon.style.transform = open ? 'rotate(0deg)' : 'rotate(45deg)';
    };

    document.addEventListener('DOMContentLoaded', () => {
        init();
        if (window.lucide) window.lucide.createIcons();
    });
})();
