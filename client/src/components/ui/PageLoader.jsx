import React from 'react'
import { Loader } from "lucide-react";

export default function PageLoader() {
  return (
    <section className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </section>
  )
}
