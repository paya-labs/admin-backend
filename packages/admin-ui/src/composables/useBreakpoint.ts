import { onMounted, onUnmounted, readonly, ref, type Ref } from 'vue';

export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export interface UseBreakpointReturn {
    /** Current window width */
    width: Readonly<Ref<number>>;
    /** True when width < md (768px) */
    isMobile: Readonly<Ref<boolean>>;
    /** True when width < lg (1024px) */
    isTablet: Readonly<Ref<boolean>>;
    /** True when width >= lg (1024px) */
    isDesktop: Readonly<Ref<boolean>>;
    /** Check if current width is smaller than a breakpoint */
    smallerThan: (breakpoint: BreakpointKey) => boolean;
    /** Check if current width is larger than or equal to a breakpoint */
    largerThan: (breakpoint: BreakpointKey) => boolean;
}

/**
 * Composable for reactive screen size detection.
 * Automatically updates on window resize.
 *
 * @example
 * ```typescript
 * const { isMobile, isDesktop, width } = useBreakpoint();
 *
 * // Use in template
 * <div v-if="isMobile">Mobile view</div>
 *
 * // Use in script
 * if (isMobile.value) {
 *   // do something for mobile
 * }
 * ```
 */
export function useBreakpoint(): UseBreakpointReturn {
    const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);
    const isMobile = ref(width.value < BREAKPOINTS.md);
    const isTablet = ref(width.value < BREAKPOINTS.lg);
    const isDesktop = ref(width.value >= BREAKPOINTS.lg);

    const updateBreakpoints = () => {
        width.value = window.innerWidth;
        isMobile.value = width.value < BREAKPOINTS.md;
        isTablet.value = width.value < BREAKPOINTS.lg;
        isDesktop.value = width.value >= BREAKPOINTS.lg;
    };

    onMounted(() => {
        updateBreakpoints();
        window.addEventListener('resize', updateBreakpoints);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', updateBreakpoints);
    });

    const smallerThan = (breakpoint: BreakpointKey): boolean => {
        return width.value < BREAKPOINTS[breakpoint];
    };

    const largerThan = (breakpoint: BreakpointKey): boolean => {
        return width.value >= BREAKPOINTS[breakpoint];
    };

    return {
        width: readonly(width),
        isMobile: readonly(isMobile),
        isTablet: readonly(isTablet),
        isDesktop: readonly(isDesktop),
        smallerThan,
        largerThan,
    };
}
