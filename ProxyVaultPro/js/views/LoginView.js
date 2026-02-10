/**
 * ProxyVaultPro - Login View
 */

import { Auth } from '../core/auth.js';
import { Toast } from '../components/Toast.js';

export class LoginView {
    constructor() {
        this.view = document.getElementById('login-view');
        this.form = document.getElementById('login-form');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.querySelector('.password-toggle');
    }

    init(onSuccess) {
        this.onSuccess = onSuccess;

        // Form submission
        this.form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });

        // Password visibility toggle
        this.passwordToggle?.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });
    }

    async handleLogin() {
        const username = document.getElementById('username')?.value;
        const password = this.passwordInput?.value;
        const remember = document.getElementById('remember-me')?.checked;

        const btn = this.form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-ring" style="width:16px;height:16px;border-width:2px"></span>';

        const result = await Auth.login(username, password, remember);

        btn.disabled = false;
        btn.innerHTML = '<span>Sign In</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';

        if (result.success) {
            this.onSuccess?.(result.user);
        } else {
            Toast.error(result.message);
            this.form?.classList.add('animate-shake');
            setTimeout(() => this.form?.classList.remove('animate-shake'), 500);
        }
    }

    togglePasswordVisibility() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        this.passwordToggle.querySelector('.eye-open')?.classList.toggle('hidden', type === 'text');
        this.passwordToggle.querySelector('.eye-closed')?.classList.toggle('hidden', type === 'password');
    }

    show() {
        this.view?.classList.remove('hidden');
    }

    hide() {
        this.view?.classList.add('hidden');
    }
}

export default LoginView;
