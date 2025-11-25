const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('./userService');

class AuthService {
    async login(email, password) {
        const user = await userService.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const role = await userService.getUserRole(user.id);
        const tokens = this.generateTokens(user, role);

        return { user: { id: user.id, username: user.username, email: user.email, role: role.name }, ...tokens };
    }

    generateTokens(user, role) {
        const payload = { id: user.id, role: role.name };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });
        return { accessToken, refreshToken };
    }

    verifyRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}

module.exports = new AuthService();
