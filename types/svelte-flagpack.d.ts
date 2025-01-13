declare module 'svelte-flagpack' {
    import { SvelteComponent } from 'svelte';

    export interface FlagProps {
        /**
         * The code for the flag (ISO 3166-1 alpha-2, alpha-3, or numeric code).
         * Examples: "NL", "NLD", "528".
         * @required
         */
        code: string;

        /**
         * The size of the flag. Options: "S", "M", "L".
         * Default: "L".
         */
        size?: 'S' | 'M' | 'L';

        /**
         * Custom CSS class name for styling.
         */
        className?: string;

        /**
         * Whether the flag has a drop shadow.
         * Default: false.
         */
        hasDropShadow?: boolean;

        /**
         * Whether the flag has a 1px border.
         * Default: true.
         */
        hasBorder?: boolean;

        /**
         * Whether the flag has a border radius.
         * Default: true.
         */
        hasBorderRadius?: boolean;

        /**
         * The gradient applied to the flag. Options: "top-down", "real-linear", "real-circular".
         * Default: "" (no gradient).
         */
        gradient?: 'top-down' | 'real-linear' | 'real-circular';
    }


    export default class Flag extends SvelteComponent<FlagProps> {}
}
