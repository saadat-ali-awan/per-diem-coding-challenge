"use client";
import { useEffect } from "react"

export function C() {
  useEffect(() => {
    void (async () => {
      const response = await fetch("http://localhost:4000", {
        method: "GET",
        headers: {
          "Content-Type": "html/text",
        },
      });
      const d = await response.text();
      console.log('Res', d);
    })()
  }, []);
  return <div>COMPONENT</div>
}