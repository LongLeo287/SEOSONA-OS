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

export function RocketIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}

export function WrenchIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z" />
    </svg>
  )
}

export function FileTextIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.5" />
      <path d="M4.5 11h7" />
      <path d="M4.5 15h4" />
      <path d="M4.5 19h2" />
    </svg>
  )
}

export function DollarSignIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

export function PaperclipIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

export function MessageSquareIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}

export function PaletteIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z" />
    </svg>
  )
}

export function MarkdownIcon(props: IconProps) {
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
        d="M16 10V14M16 14L17.5 12.75M16 14L14.5 12.75M7 14V10L9.25 12L11.5 10V14M6 5H18C19.6569 5 21 6.34315 21 8V16C21 17.6569 19.6569 19 18 19H6C4.34315 19 3 17.6569 3 16V8C3 6.34315 4.34315 5 6 5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ExternalLinkIcon(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <g transform="scale(1.1)">
        <path
          d="M8 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14.2C3 15.8802 3 16.7202 3.32698 17.362C3.6146 17.9265 4.07354 18.3854 4.63803 18.673C5.27976 19 6.11984 19 7.8 19H14.2C15.8802 19 16.7202 19 17.362 18.673C17.9265 18.3854 18.3854 17.9265 18.673 17.362C19 16.7202 19 15.8802 19 14.2V14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 3H19M19 3V9M19 3L10 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export function TimelineIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" {...props}>
      <path d="M14.5 6.5H8.81314C7.00339 6.5 6.38405 8.91123 7.96978 9.78338L16.0302 14.2166C17.616 15.0888 16.9966 17.5 15.1869 17.5H9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.75 7.25V5.75C14.75 4.64543 15.6454 3.75 16.75 3.75H18.25C19.3546 3.75 20.25 4.64543 20.25 5.75V7.25C20.25 8.35457 19.3546 9.25 18.25 9.25H16.75C15.6454 9.25 14.75 8.35457 14.75 7.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.75 18.25V16.75C3.75 15.6454 4.64543 14.75 5.75 14.75H7.25C8.35457 14.75 9.25 15.6454 9.25 16.75V18.25C9.25 19.3546 8.35457 20.25 7.25 20.25H5.75C4.64543 20.25 3.75 19.3546 3.75 18.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TraceIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" {...props}>
      <path d="M9.25 16.25C9.25 15.6977 8.80228 15.25 8.25 15.25H4.75C4.19772 15.25 3.75 15.6977 3.75 16.25V16.4375C3.75 17.9908 4.98122 19.25 6.5 19.25C8.01878 19.25 9.25 17.9908 9.25 16.4375V16.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9.52637 12.2422C9.38081 12.5656 9.04762 12.75 8.69296 12.75H4.30709C3.95242 12.75 3.61921 12.5656 3.47366 12.2421C2.02779 9.02924 2.60768 2.75 6.49986 2.75C10.392 2.75 10.9723 9.02927 9.52637 12.2422Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20.25 18.25C20.25 17.6977 19.8023 17.25 19.25 17.25H15.75C15.1977 17.25 14.75 17.6977 14.75 18.25V18.4375C14.75 19.9908 15.9812 21.25 17.5 21.25C19.0188 21.25 20.25 19.9908 20.25 18.4375V18.25Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M20.5264 14.2422C20.3808 14.5656 20.0476 14.75 19.693 14.75H15.3071C14.9524 14.75 14.6192 14.5656 14.4737 14.2421C13.0278 11.0292 13.6077 4.75 17.4999 4.75C21.392 4.75 21.9723 11.0293 20.5264 14.2422Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function CoinsIcon(props: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" {...props}>
      <path d="M14.6766 7.38126C13.686 5.23749 11.5167 3.75 9 3.75C5.54822 3.75 2.75 6.54822 2.75 10C2.75 13.3961 5.45873 16.1596 8.83359 16.2478M21.25 14C21.25 17.4518 18.4518 20.25 15 20.25C12.3406 20.25 10.0691 18.589 9.16641 16.2478C8.89745 15.5503 8.75 14.7924 8.75 14C8.75 10.6039 11.4587 7.84038 14.8336 7.75217C14.8889 7.75073 14.9444 7.75 15 7.75C18.4518 7.75 21.25 10.5482 21.25 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  )
}
