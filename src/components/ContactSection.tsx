import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import * as Icons from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const { toast } = useToast();

  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const renderIcon = (iconName?: string) => {
    if (!iconName) return <Mail className="w-6 h-6" />;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <Mail className="w-6 h-6" />;
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      const formattedLinks = data.map((contact: any) => {
        // Use username field for display, or fallback to value
        const displayText = contact.username || contact.value;
        
        // Determine the full URL
        let fullUrl = contact.value;
        if (contact.platform === 'Email' && !contact.value.startsWith('mailto:')) {
          fullUrl = `mailto:${contact.value}`;
        }

        return {
          name: contact.platform,
          displayText,
          url: fullUrl,
          icon: renderIcon(contact.icon)
        };
      });
      setSocialLinks(formattedLinks);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('messages')
      .insert([{
        name: formData.name,
        email: formData.email,
        message: formData.message
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon!",
      });
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-16 animate-fadeInUp">
          Let's <span className="text-primary">Connect</span>
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-panel p-8 rounded-2xl animate-slideInLeft">
              <h3 className="text-2xl font-bold text-foreground mb-6">Send me a message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="glass-panel border-white/20 focus:border-primary/50"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="glass-panel border-white/20 focus:border-primary/50"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="glass-panel border-white/20 focus:border-primary/50 resize-none"
                    placeholder="Tell me about your project or just say hello!"
                  />
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info & Social Links */}
            <div className="space-y-8 animate-slideInRight">
              <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-foreground mb-6">Get in touch</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  I'm always interested in discussing new opportunities, creative projects, 
                  or just having a chat about technology and innovation. Feel free to reach out!
                </p>

                  <div className="space-y-4">
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="w-5 h-5 mr-3 text-primary" />
                      <span>manuthlochana01@gmail.com</span>
                    </div>
                  <div className="flex items-center text-muted-foreground">
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                    </div>
                    <span>Available for new opportunities</span>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-8 rounded-2xl">
                <h3 className="text-xl font-bold text-foreground mb-6">Connect with me</h3>
                <div className="grid grid-cols-1 gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 glass-panel rounded-lg hover:glow-effect smooth-transition group"
                    >
                      <div className="text-muted-foreground group-hover:text-primary smooth-transition mr-4">
                        {link.icon}
                      </div>
                      <div>
                        <div className="font-medium text-foreground group-hover:text-primary smooth-transition">
                          {link.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {link.displayText}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;