import { Metadata } from "next";
import ChatClient from "./ChatClient";

export const metadata: Metadata = {
  title: "Chat with IndexFast Assistant",
  description: "Ask questions about SEO, indexing, and IndexFast features.",
  alternates: {
    canonical: "/chat",
  },
};

export default function ChatPage() {
  return <ChatClient />;
}
