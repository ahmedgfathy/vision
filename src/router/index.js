import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('../views/Login.vue'),
            meta: { guest: true }
        },
        {
            path: '/dashboard',
            component: () => import('../layouts/AppLayout.vue'),
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('../views/DashboardView.vue')
                },
                {
                    path: 'properties',
                    children: [
                        {
                            path: '',
                            name: 'properties-list',
                            component: () => import('../views/properties/List.vue')
                        },
                        {
                            path: 'create',
                            name: 'properties-create',
                            component: () => import('../views/properties/Create.vue')
                        },
                        {
                            path: 'edit/:id',
                            name: 'properties-edit',
                            component: () => import('../views/properties/Edit.vue')
                        },
                        {
                            path: 'view/:id',
                            name: 'properties-view',
                            component: () => import('../views/properties/View.vue')
                        }
                    ]
                },
                {
                    path: 'leads',
                    name: 'leads',
                    component: () => import('../views/leads/Index.vue')
                },
                {
                    path: 'agents',
                    name: 'agents',
                    component: () => import('../views/agents/Index.vue')
                },
                {
                    path: 'companies',
                    name: 'companies',
                    component: () => import('../views/companies/Index.vue')
                },
                {
                    path: 'tasks',
                    name: 'tasks',
                    component: () => import('../views/tasks/Index.vue')
                },
                {
                    path: 'admin',
                    name: 'admin',
                    component: () => import('../views/admin/Administration.vue'),
                    meta: { requiresAdmin: true }
                }
            ]
        }
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.accessToken) {
        next('/');
    } else if (to.meta.guest && authStore.accessToken) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;
