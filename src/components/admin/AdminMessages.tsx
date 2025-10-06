import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail } from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive"
      });
    } else {
      setMessages(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (!error) {
        toast({ title: "Success", description: "Message deleted successfully" });
        fetchMessages();
      }
    }
  };

  const handleReply = (email: string, name: string) => {
    const mailtoUrl = `mailto:${email}?subject=Re: Your message&body=Hi ${name},%0D%0A%0D%0AThank you for reaching out...`;
    window.open(mailtoUrl);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl md:text-2xl font-bold">Contact Messages</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </span>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card className="glass-panel border-white/10">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-3">
              <Mail className="w-12 h-12 text-muted-foreground/50" />
              <p className="text-lg font-medium text-muted-foreground">No messages yet.</p>
              <p className="text-sm text-muted-foreground">
                Messages from your contact form will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="glass-panel border-white/10 hover:border-primary/30 hover:glow-effect transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <h3 className="text-base md:text-lg font-semibold">{message.name}</h3>
                    <p className="text-sm text-muted-foreground break-all">{message.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReply(message.email, message.name)}
                      className="w-full sm:w-auto"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(message.id)}
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 border border-white/5 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;