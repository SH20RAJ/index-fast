import PageHeader from "@/components/dashboard/PageHeader";
import { ChatInterface } from "@/components/dashboard/ChatInterface";

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <PageHeader 
        title="AI Assistant" 
        description="Talk to your SEO agent about indexing, performance, and technical SEO."
      />
      
      <div className="h-[70vh] rounded-[2.5rem] border border-border/60 bg-card/50 backdrop-blur-xl overflow-hidden shadow-2xl">
        <ChatInterface />
      </div>
    </div>
  );
}
