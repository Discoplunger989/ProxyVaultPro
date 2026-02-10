/**
 * ProxyVaultPro - User Model
 * User session data model
 */

export class User {
    constructor(data = {}) {
        this.username = data.username || '';
        this.role = data.role || 'user';
        this.loginAt = data.loginAt || Date.now();
        this.remember = data.remember || false;
    }

    isAdmin() {
        return this.role === 'admin';
    }

    toJSON() {
        return {
            username: this.username,
            role: this.role,
            loginAt: this.loginAt,
            remember: this.remember
        };
    }

    static fromJSON(json) {
        return new User(json);
    }
}

export default User;
