import type { SVGProps } from "react";

export function LogoMark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 56 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <defs>
        <filter id="lm-dot-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Página esquerda */}
      <rect x="3" y="16" width="22" height="30" rx="2" stroke="#b78937" strokeWidth="1.4" />

      {/* Página direita */}
      <rect x="31" y="16" width="22" height="30" rx="2" stroke="#b78937" strokeWidth="1.4" />

      {/* Dobra da lombada — linha tênue entre as páginas */}
      <line
        x1="28"
        y1="16"
        x2="28"
        y2="46"
        stroke="#b78937"
        strokeWidth="0.8"
        strokeOpacity="0.45"
      />

      {/* Linhas de texto — página esquerda */}
      <line x1="8"  y1="25" x2="21" y2="25" stroke="#b78937" strokeWidth="0.7" strokeOpacity="0.35" />
      <line x1="8"  y1="30" x2="21" y2="30" stroke="#b78937" strokeWidth="0.7" strokeOpacity="0.35" />
      <line x1="8"  y1="35" x2="21" y2="35" stroke="#b78937" strokeWidth="0.7" strokeOpacity="0.35" />
      <line x1="8"  y1="40" x2="17" y2="40" stroke="#b78937" strokeWidth="0.7" strokeOpacity="0.35" />

      {/* Linhas de texto — página direita */}
      <line x1="35" y1="25" x2="48" y2="25" stroke="#b78937" strokeWidth="0.7" strokeOpacity="0.35" />
      <line x1="35" y1="30" x2="48" y2="30" stroke="#b78937" strokeWidth="0.7" strokeOpacity="0.35" />
      <line x1="35" y1="35" x2="48" y2="35" stroke="#b78937" strokeWidth="0.7" strokeOpacity="0.35" />
      <line x1="35" y1="40" x2="44" y2="40" stroke="#b78937" strokeWidth="0.7" strokeOpacity="0.35" />

      {/* Ponto dourado luminoso acima da lombada */}
      <circle cx="28" cy="8.5" r="4" fill="#b78937" filter="url(#lm-dot-glow)" />
    </svg>
  );
}
