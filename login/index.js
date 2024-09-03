async function proxy(uri) {
    fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(uri)}`)
                    .then(response => {
                      if (response.ok) return response.json()
                      throw new Error('Network response was not ok.')
                    })
                    .then(data => returneddata = data.contents);
    return returneddata;
}

class discordapi {
    constructor() {
        this.baseUrl = 'https://discord.com/api/v9';
    }

    async proxy(uri) {
        return await proxy(uri);
    }

    async authentication(auth_type, auth_data) {
        switch (auth_type) {
            case 'token': {
                return await this.authWithToken(auth_data.token);
            }
            case 'credentials': {
                return await this.authWithCredentials(auth_data.username, auth_data.password, auth_data.mfa_code);
            }
            case 'qr': {
                return await this.authWithQRCode();
            }
            default: {
                throw new Error('Unsupported authentication type');
            }
        }
    }

    async authWithToken(token) {
        const response = await fetch(`${this.baseUrl}/users/@me`, {
            headers: {
                'Authorization': `Bot ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Invalid token or authentication failed.');
        }
        const userData = await response.json();
        return userData;
    }

    async authWithCredentials(username, password, mfa_code = null) {
        const body = {
            login: username,
            password: password
        };
        if (mfa_code) {
            body.code = mfa_code;
        }

        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Authentication with credentials failed.');
        }

        const loginData = await response.json();
        return loginData;
    }

    async authWithQRCode() {
        const response = await fetch(`${this.baseUrl}/auth/qr_code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('QR Code generation failed.');
        }

        const qrData = await response.json();
        return qrData;
    }
}

const dapi = new discordapi();

