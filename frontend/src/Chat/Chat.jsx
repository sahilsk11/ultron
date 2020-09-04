import React, { useState } from "react";

export default function Chat() {
  const [input, updateInput] = useState("");
  return (
    <div>
      <input value={input} onChange={e => updateInput(e.target.value)} />
      <button>send</button>
    </div>
  )
}