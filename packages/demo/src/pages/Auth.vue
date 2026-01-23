<script setup>
import { AppBadge, AppButton, AppInput, useAuth } from '@paya-labs/admin-ui';
import { ref } from 'vue';

// Mock auth - simulates cookie-based auth flow
// In a real app, this would call your backend
const auth = useAuth({
    baseUrl: '', // Would be your API URL
    loginEndpoint: '/auth/login',
    logoutEndpoint: '/auth/logout',
    userEndpoint: '/auth/user',
    onLogin: () => console.log('Login successful!'),
    onLogout: () => console.log('Logged out!'),
});

// Demo credentials
const credentials = ref({
    email: 'admin@example.com',
    password: 'password',
});

// Mock login (simulates what would happen with real backend)
const mockUser = {
    id: 1,
    name: 'John Admin',
    email: 'admin@example.com',
    role: 'admin',
    roles: [
        {
            name: 'admin',
            permissions: [
                'users.read',
                'users.create',
                'users.update',
                'users.delete',
            ],
        },
    ],
    permissions: ['posts.read', 'posts.create'],
};

const handleLogin = async () => {
    // In real app: await auth.login(credentials.value)
    // For demo, we simulate by setting user directly
    auth.user.value = mockUser;
};

const handleLogout = async () => {
    // In real app: await auth.logout()
    // For demo, we simulate
    auth.user.value = null;
};

// Permission checks to demonstrate
const permissionChecks = [
    'users.read',
    'users.create',
    'users.delete',
    'posts.read',
    'posts.delete',
    'admin.access',
];

const roleChecks = ['admin', 'editor', 'viewer'];
</script>

<template>
    <div class="space-y-8">
        <div>
            <h1 class="text-text text-2xl font-bold">Authentication</h1>
            <p class="text-muted mt-1">
                The
                <code class="bg-surface-hover rounded px-1">useAuth</code>
                composable for cookie-based authentication.
            </p>
        </div>

        <!-- Auth State -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Current State</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex flex-wrap items-center gap-3">
                    <AppBadge
                        :variant="
                            auth.isAuthenticated.value ? 'success' : 'secondary'
                        "
                    >
                        {{
                            auth.isAuthenticated.value
                                ? 'Authenticated'
                                : 'Not authenticated'
                        }}
                    </AppBadge>
                    <AppBadge v-if="auth.loading.value" variant="warning">
                        Loading...
                    </AppBadge>
                    <AppBadge v-if="auth.error.value" variant="danger">
                        {{ auth.error.value.message }}
                    </AppBadge>
                </div>

                <div v-if="auth.user.value" class="mt-4">
                    <p class="text-text text-sm font-medium">Current User:</p>
                    <pre
                        class="bg-surface-hover text-muted mt-2 overflow-auto rounded-md p-4 text-xs"
                    ><code>{{ JSON.stringify(auth.user.value, null, 2) }}</code></pre>
                </div>
            </div>
        </section>

        <!-- Login Form -->
        <section v-if="!auth.isAuthenticated.value" class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Login</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="max-w-sm space-y-4">
                    <AppInput
                        v-model="credentials.email"
                        label="Email"
                        type="email"
                        placeholder="admin@example.com"
                    />
                    <AppInput
                        v-model="credentials.password"
                        label="Password"
                        type="password"
                        placeholder="password"
                    />
                    <AppButton
                        variant="primary"
                        :loading="auth.loading.value"
                        @click="handleLogin"
                    >
                        Sign In
                    </AppButton>
                </div>

                <div class="text-muted mt-4 text-sm">
                    <p>Demo credentials: admin@example.com / password</p>
                </div>
            </div>
        </section>

        <!-- Logged In Actions -->
        <section v-if="auth.isAuthenticated.value" class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Session</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="flex items-center gap-4">
                    <div>
                        <p class="text-text font-medium">
                            {{ auth.user.value.name }}
                        </p>
                        <p class="text-muted text-sm">
                            {{ auth.user.value.email }}
                        </p>
                    </div>
                    <AppButton variant="outline" @click="handleLogout">
                        Sign Out
                    </AppButton>
                </div>
            </div>
        </section>

        <!-- Role Checks -->
        <section v-if="auth.isAuthenticated.value" class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Role Checks</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <p class="text-muted mb-4 text-sm">
                    <code class="bg-surface-hover rounded px-1"
                        >auth.hasRole('admin')</code
                    >
                </p>
                <div class="flex flex-wrap gap-2">
                    <div
                        v-for="role in roleChecks"
                        :key="role"
                        class="flex items-center gap-2"
                    >
                        <AppBadge
                            :variant="
                                auth.hasRole(role) ? 'success' : 'secondary'
                            "
                        >
                            {{ role }}
                        </AppBadge>
                        <span class="text-muted text-xs">
                            {{ auth.hasRole(role) ? '✓' : '✗' }}
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Permission Checks -->
        <section v-if="auth.isAuthenticated.value" class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Permission Checks</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <p class="text-muted mb-4 text-sm">
                    <code class="bg-surface-hover rounded px-1"
                        >auth.hasPermission('users.create')</code
                    >
                </p>
                <div class="flex flex-wrap gap-2">
                    <div
                        v-for="perm in permissionChecks"
                        :key="perm"
                        class="flex items-center gap-2"
                    >
                        <AppBadge
                            :variant="
                                auth.hasPermission(perm)
                                    ? 'success'
                                    : 'secondary'
                            "
                        >
                            {{ perm }}
                        </AppBadge>
                        <span class="text-muted text-xs">
                            {{ auth.hasPermission(perm) ? '✓' : '✗' }}
                        </span>
                    </div>
                </div>
            </div>
        </section>

        <!-- Usage Code -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Usage</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <pre
                    class="bg-surface-hover text-muted overflow-x-auto rounded-md p-4 text-xs"
                ><code>import { useAuth } from '@paya-labs/admin-ui';

const auth = useAuth({
    baseUrl: 'https://api.example.com',
    loginEndpoint: '/auth/login',
    logoutEndpoint: '/auth/logout',
    userEndpoint: '/auth/user',
    csrfEndpoint: '/csrf-cookie',  // Optional
    onLogin: () => router.push('/dashboard'),
    onLogout: () => router.push('/login'),
});

// Initialize on app mount (checks existing session)
onMounted(() => auth.initialize());

// Login
await auth.login({ email, password });

// Logout
await auth.logout();

// Check auth state
auth.isAuthenticated.value  // boolean
auth.user.value             // User object or null
auth.loading.value          // Loading state

// Role & permission checks
auth.hasRole('admin')
auth.hasPermission('users.create')</code></pre>
            </div>
        </section>

        <!-- API Reference -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">API Reference</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="space-y-6">
                    <div>
                        <h3 class="text-text mb-2 font-medium">Options</h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >baseUrl</code
                                >
                                - API base URL
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >loginEndpoint</code
                                >
                                - Login endpoint (default: /auth/login)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >logoutEndpoint</code
                                >
                                - Logout endpoint (default: /auth/logout)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >userEndpoint</code
                                >
                                - Get user endpoint (default: /auth/user)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >csrfEndpoint</code
                                >
                                - CSRF cookie endpoint (optional)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >onLogin</code
                                >
                                /
                                <code class="bg-surface-hover rounded px-1"
                                    >onLogout</code
                                >
                                - Callbacks
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-text mb-2 font-medium">State</h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >user</code
                                >
                                - Current user (Ref)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >isAuthenticated</code
                                >
                                - Auth status (ComputedRef)
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >loading</code
                                >
                                - Operation loading
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >initializing</code
                                >
                                - Initial auth check
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >error</code
                                >
                                - Last error
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-text mb-2 font-medium">Methods</h3>
                        <div class="text-muted space-y-1 text-sm">
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >login(credentials)</code
                                >
                                - Login with email/password
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >logout()</code
                                >
                                - End session
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >fetchUser()</code
                                >
                                - Refresh user data
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >initialize()</code
                                >
                                - Check existing session
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >hasRole(role)</code
                                >
                                - Check user role
                            </p>
                            <p>
                                <code class="bg-surface-hover rounded px-1"
                                    >hasPermission(perm)</code
                                >
                                - Check permission
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Security Note -->
        <section class="space-y-4">
            <h2 class="text-text text-lg font-semibold">Security</h2>
            <div class="border-border bg-surface rounded-lg border p-6">
                <div class="text-muted space-y-2 text-sm">
                    <p>
                        This composable uses
                        <strong class="text-text"
                            >cookie-based authentication</strong
                        >
                        where tokens are stored in HTTP-only cookies by the
                        server.
                    </p>
                    <p>
                        All requests use
                        <code class="bg-surface-hover rounded px-1"
                            >credentials: 'include'</code
                        >
                        to send cookies automatically.
                    </p>
                    <p>
                        The frontend
                        <strong class="text-text"
                            >never handles or stores tokens</strong
                        >
                        - this protects against XSS attacks.
                    </p>
                </div>
            </div>
        </section>
    </div>
</template>
