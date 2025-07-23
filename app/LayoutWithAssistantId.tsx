"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Warnings from "./components/warnings";
import { useAssistantId } from "@/app/hooks/useAssistantId"; 

type Props = {
  children: React.ReactNode;
  topic?: string; 
};

export default function LayoutWithAssistantId({ children, topic }: Props) {
  const { user, isLoading } = useUser();
  const assistantId = useAssistantId(topic); 

  if (isLoading) return null; 

  return (
    <>
      {assistantId && <Warnings assistantId={assistantId} />}
      {children}
    </>
  );
}
