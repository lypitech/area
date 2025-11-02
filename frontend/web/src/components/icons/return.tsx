import type { SVGProps } from "react";

export default function Return(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="Arrow / Arrow_Undo_Down_Left">
        <path
          id="Vector"
          d="M7 11L3 15M3 15L7 19M3 15H16C18.7614 15 21 12.7614 21 10C21 7.23858 18.7614 5 16 5H11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
