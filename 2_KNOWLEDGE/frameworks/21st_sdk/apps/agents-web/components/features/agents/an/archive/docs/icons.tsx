import { cn } from "@/lib/utils"

interface IconProps extends React.SVGProps<SVGSVGElement> {}

/**
 * Animated crossfade between CopyIcon ↔ CheckIcon.
 * Uses scale + opacity CSS transitions (like agents active chat).
 */
export function AnimatedCopyIcon({
  copied,
  size = "h-4 w-4",
}: {
  copied: boolean
  size?: string
}) {
  return copied ? (
    <CheckIcon className={cn(size, "text-green-500")} />
  ) : (
    <CopyIcon className={size} />
  )
}

export function BookIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M9 3.5H7.5C5.84315 3.5 4.5 4.84315 4.5 6.5V17.5C4.5 19.1569 5.84315 20.5 7.5 20.5H9M9 3.5H16.5C18.1569 3.5 19.5 4.84315 19.5 6.5V17.5C19.5 19.1569 18.1569 20.5 16.5 20.5H9M9 3.5V20.5M13 8H15.5M13 12H15.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CodeIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <g transform="scale(1.15) translate(-1.8, -1.8)">
        <path d="M10 20L14 4M18 8.00004L19.9775 9.75781C21.32 10.9512 21.32 13.0489 19.9775 14.2423L18 16M6 16L4.02251 14.2423C2.67996 13.0489 2.67996 10.9512 4.02251 9.75781L6 8.00004" />
      </g>
    </svg>
  )
}

export function SearchIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g transform="scale(1.15) translate(-1.8, -1.8)">
        <path
          d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 20L16.05 16.05"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export function IconMoon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" {...props}>
      <g transform="scale(1.05)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.06207 1.68681C8.19154 1.90981 8.18081 2.18749 8.03446 2.39981C7.59054 3.04388 7.33074 3.82385 7.33074 4.66651C7.33074 6.87566 9.12159 8.66651 11.3307 8.66651C12.1734 8.66651 12.9535 8.40668 13.5975 7.96274C13.8099 7.81641 14.0875 7.80559 14.3105 7.93506C14.5336 8.06454 14.6619 8.31093 14.6401 8.56793C14.3509 11.9830 11.4883 14.6640 7.99874 14.6640C4.31755 14.6640 1.33333 11.6798 1.33333 7.99861C1.33333 4.50915 4.01427 1.64657 7.42919 1.35721C7.68619 1.33543 7.93259 1.46379 8.06207 1.68681ZM6.28002 2.94944C4.17867 3.66452 2.66667 5.65523 2.66667 7.99861C2.66667 10.9434 5.05421 13.3307 7.99874 13.3307C10.3422 13.3307 12.3329 11.8186 13.0479 9.71713C12.5088 9.90041 11.9311 9.99984 11.3307 9.99984C8.38516 9.99984 5.99741 7.61209 5.99741 4.66651C5.99741 4.06621 6.09679 3.48853 6.28002 2.94944Z"
          fill="currentColor"
        />
        <path
          d="M10.8249 3.34491L11.3660 2.26279C11.4888 2.01711 11.8394 2.01711 11.9623 2.26279L12.5033 3.34491C12.5356 3.40942 12.5879 3.46173 12.6524 3.49398L13.7346 4.03503C13.9802 4.15788 13.9802 4.50848 13.7346 4.63132L12.6524 5.17237C12.5879 5.20461 12.5356 5.25692 12.5033 5.32143L11.9623 6.40356C11.8394 6.64924 11.4888 6.64924 11.3660 6.40356L10.8249 5.32143C10.7927 5.25692 10.7404 5.20461 10.6759 5.17237L9.59375 4.63132C9.34807 4.50848 9.34807 4.15788 9.59375 4.03503L10.6759 3.49398C10.7404 3.46173 10.7927 3.40942 10.8249 3.34491Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

export function IconSun(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" {...props}>
      <g transform="scale(1.15) translate(-1, -1)">
        <circle
          cx="8"
          cy="8"
          r="3.33"
          stroke="currentColor"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 1.33V2.67M8 13.33V14.67M14.67 8H13.33M2.67 8H1.33M12.72 3.28L11.78 4.22M4.22 11.78L3.28 12.72M12.72 12.72L11.78 11.78M4.22 4.22L3.28 3.28"
          stroke="currentColor"
          strokeWidth="1.33"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export function CaretRightIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M10 16L12.9393 13.0607C13.5251 12.4749 13.5251 11.5251 12.9393 10.9393L10 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <path
        d="M8 10L10.9393 12.9393C11.5251 13.5251 12.4749 13.5251 13.0607 12.9393L16 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function CopyIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g transform="scale(1.15) translate(-1.8, -1.8)">
        <path
          d="M15 9V5.25C15 4.00736 13.9926 3 12.75 3H5.25C4.00736 3 3 4.00736 3 5.25V12.75C3 13.9926 4.00736 15 5.25 15H9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.75 9H11.25C10.0074 9 9 10.0074 9 11.25V18.75C9 19.9926 10.0074 21 11.25 21H18.75C19.9926 21 21 19.9926 21 18.75V11.25C21 10.0074 19.9926 9 18.75 9Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export function CheckIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g transform="scale(1.15) translate(-1.8, -1.8)">
        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}
