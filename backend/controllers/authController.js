const authService = require('../services/authService');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) return res.status(401).json({ message: 'Refresh Token Required' });

            const decoded = authService.verifyRefreshToken(refreshToken);
            const tokens = authService.generateTokens({ id: decoded.id }, { name: decoded.role });

            res.json(tokens);
        } catch (error) {
            res.status(403).json({ message: 'Invalid Refresh Token' });
        }
    }
}

module.exports = new AuthController();
