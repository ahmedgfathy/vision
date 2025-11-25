import { defineStore } from 'pinia';
import api from '@/api/axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePermissionStore } from './permissions';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const accessToken = ref(localStorage.getItem('accessToken') || null);
    const refreshToken = ref(localStorage.getItem('refreshToken') || null);
    const router = useRouter();

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            setAuth(response.data);
            
            // Load permissions after login
            const permissionStore = usePermissionStore();
            await permissionStore.loadPermissions();
            
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const refresh = async () => {
        try {
            const response = await api.post('/auth/refresh', { refreshToken: refreshToken.value });
            accessToken.value = response.data.accessToken;
            localStorage.setItem('accessToken', accessToken.value);
            if (response.data.refreshToken) {
                refreshToken.value = response.data.refreshToken;
                localStorage.setItem('refreshToken', refreshToken.value);
            }
        } catch (error) {
            logout();
            throw error;
        }
    };

    const logout = () => {
        user.value = null;
        accessToken.value = null;
        refreshToken.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Clear permissions on logout
        const permissionStore = usePermissionStore();
        permissionStore.clearPermissions();
        
        if (router) router.push('/');
    };

    const setAuth = (data) => {
        user.value = data.user;
        accessToken.value = data.accessToken;
        refreshToken.value = data.refreshToken;
        localStorage.setItem('user', JSON.stringify(user.value));
        localStorage.setItem('accessToken', accessToken.value);
        localStorage.setItem('refreshToken', refreshToken.value);
    };

    return { user, accessToken, refreshToken, login, logout, refresh };
});
