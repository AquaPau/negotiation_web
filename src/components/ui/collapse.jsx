"use client"

import { useState } from "react"

const Collapse = ({ open, children }) => {
  const [isOpen, setIsOpen] = useState(open)

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)} className="text-left">
        {isOpen ? "Hide" : "Show"}
      </button>
      {isOpen && children}
    </div>
  )
}

export default Collapse

