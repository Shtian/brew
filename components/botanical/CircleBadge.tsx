import { SVGProps } from "react";

export function CircleBadge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" {...props}>
      <path
        fill="currentColor"
        d="M229,252.6c10-2.2,16.3-12.3,13.8-21.9c-2.7-10.5-13.5-15.6-21.5-13.1c6.7,5.2,8.5,10.7,5.8,16.6c-1.3,2.9-3.4,5-6.2,6.5c-4,2.1-8.1,1.8-12.3,0C209.7,247.2,218.5,254.9,229,252.6z"
      />
    </svg>
  );
}
