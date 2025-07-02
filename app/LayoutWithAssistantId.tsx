"use client";

import { getStaticAssistantId } from "@/app/hooks/useAssistantId";
import Warnings from "./components/warnings";

export default function LayoutWithAssistantId({
  children,
}: {
  children: React.ReactNode;
}) {
  const assistantId = getStaticAssistantId();

  return (
    <>
      {assistantId && <Warnings assistantId={assistantId} />}
      {children}
    </>
  );
}
