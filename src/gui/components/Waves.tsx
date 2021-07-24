import * as React from "react"

function Waves(props: any): any {
  return (
    <svg
      width={84}
      height={900}
      viewBox="0 0 84 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M54.816 926l7.36-22.667C69.534 880 84 834.667 84 788.667 84 743.333 69.535 697.333 69.535 652c0-46 14.465-92 12.689-137.333-1.777-46-20.049-91.334-30.961-137.334C40.097 332 36.543 286 30.96 240c-5.33-45.333-12.69-91.333-9.136-136.667C25.63 57.333 40.097 12 47.456-11.333L54.816-34H0V926h54.816z"
        fill="#5C0F8B"
      />
    </svg>
  )
}

export default Waves
