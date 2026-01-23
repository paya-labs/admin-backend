import { onMounted, onUnmounted, ref, type Ref } from 'vue';

export interface UseSidebarReturn {
    isOpen: Ref<boolean>;
    isCollapsed: Ref<boolean>;
    isMobile: Ref<boolean>;
    toggle: () => void;
    toggleCollapse: () => void;
    close: () => void;
    open: () => void;
}

const COLLAPSE_STORAGE_KEY = 'admin-sidebar-collapsed';
const MOBILE_BREAKPOINT = 1024;

const isOpen = ref(false);
const isCollapsed = ref(false);
const isMobile = ref(false);

let initialized = false;

export function useSidebar(): UseSidebarReturn {
    const checkMobile = (): void => {
        isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
        if (!isMobile.value && isOpen.value) {
            isOpen.value = false;
        }
    };

    const toggle = (): void => {
        isOpen.value = !isOpen.value;
    };

    const toggleCollapse = (): void => {
        isCollapsed.value = !isCollapsed.value;
        localStorage.setItem(COLLAPSE_STORAGE_KEY, String(isCollapsed.value));
    };

    const close = (): void => {
        isOpen.value = false;
    };

    const open = (): void => {
        isOpen.value = true;
    };

    onMounted(() => {
        if (!initialized) {
            const saved = localStorage.getItem(COLLAPSE_STORAGE_KEY);
            if (saved === 'true') {
                isCollapsed.value = true;
            }

            initialized = true;
        }

        checkMobile();
        window.addEventListener('resize', checkMobile);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', checkMobile);
    });

    return {
        isOpen,
        isCollapsed,
        isMobile,
        toggle,
        toggleCollapse,
        close,
        open,
    };
}
