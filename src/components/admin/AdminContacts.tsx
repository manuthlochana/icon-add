import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit, ExternalLink } from "lucide-react";
import * as Icons from "lucide-react";

interface Contact {
  id: string;
  platform: string;
  value: string;
  username?: string;
  icon?: string;
}

const AdminContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    platform: "",
    value: "",
    username: "",
    icon: ""
  });
  const { toast } = useToast();

  // Common contact platform icons
  const contactIcons = [
    "Mail", "Phone", "MessageCircle", "Send", "Globe", "Linkedin", "Github",
    "Twitter", "Facebook", "Instagram", "Youtube", "Twitch", "Discord",
    "Slack", "Telegram", "WhatsApp", "MapPin", "Building", "User", "Users",
    "Calendar", "Clock", "Link", "ExternalLink", "Share", "AtSign", "Hash"
  ];

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Contacts fetch error:', error);
        toast({
          title: "Error",
          description: `Failed to fetch contacts: ${error.message}`,
          variant: "destructive"
        });
      } else {
        setContacts(data || []);
      }
    } catch (err) {
      console.error('Contacts fetch exception:', err);
      toast({
        title: "Error",
        description: "Unexpected error while fetching contacts",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert "none" back to empty string for database
      const submitData = {
        ...formData,
        icon: formData.icon === "none" ? "" : formData.icon
      };

      if (editingContact) {
        const { error } = await supabase
          .from('contacts')
          .update(submitData)
          .eq('id', editingContact.id);

        if (error) {
          console.error('Contact update error:', error);
          toast({
            title: "Error",
            description: `Failed to update contact: ${error.message}`,
            variant: "destructive"
          });
        } else {
          toast({ title: "Success", description: "Contact updated successfully" });
          setEditingContact(null);
          fetchContacts();
          resetForm();
        }
      } else {
        const { error } = await supabase
          .from('contacts')
          .insert([submitData]);

        if (error) {
          console.error('Contact create error:', error);
          toast({
            title: "Error",
            description: `Failed to create contact: ${error.message}`,
            variant: "destructive"
          });
        } else {
          toast({ title: "Success", description: "Contact created successfully" });
          fetchContacts();
          resetForm();
        }
      }
    } catch (err) {
      console.error('Contact submit exception:', err);
      toast({
        title: "Error",
        description: "Unexpected error while saving contact",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      platform: contact.platform,
      value: contact.value,
      username: contact.username || "",
      icon: contact.icon || ""
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        const { error } = await supabase
          .from('contacts')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Contact delete error:', error);
          toast({
            title: "Error",
            description: `Failed to delete contact: ${error.message}`,
            variant: "destructive"
          });
        } else {
          toast({ title: "Success", description: "Contact deleted successfully" });
          fetchContacts();
        }
      } catch (err) {
        console.error('Contact delete exception:', err);
        toast({
          title: "Error",
          description: "Unexpected error while deleting contact",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      platform: "",
      value: "",
      username: "",
      icon: ""
    });
  };

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-white/10 hover:border-primary/30 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">
            {editingContact ? 'Edit Contact' : 'Add New Contact'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="platform" className="text-sm font-medium">Platform/Type</Label>
                <Input
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({...formData, platform: e.target.value})}
                  required
                  placeholder="e.g., LinkedIn, GitHub, Email, Twitter"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="username" className="text-sm font-medium">Username/Handle</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="e.g., @yourhandle or yourhandle"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="value" className="text-sm font-medium">Full URL</Label>
                <Input
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  required
                  placeholder="e.g., https://twitter.com/yourhandle or email@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact-icon" className="text-sm font-medium">Icon</Label>
                <Select
                  value={formData.icon}
                  onValueChange={(value) => setFormData({...formData, icon: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="none">No Icon</SelectItem>
                    {contactIcons.map((iconName) => (
                      <SelectItem key={iconName} value={iconName}>
                        <div className="flex items-center gap-2">
                          {renderIcon(iconName)}
                          {iconName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button type="submit" className="flex-1 sm:flex-none">
                {editingContact ? 'Update Contact' : 'Add Contact'}
              </Button>
              {editingContact && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditingContact(null);
                    resetForm();
                  }}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="glass-panel border-white/10 hover:border-primary/30 hover:glow-effect transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {renderIcon(contact.icon)}
                  <span className="text-base font-semibold truncate">{contact.platform}</span>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(contact)}
                    className="h-8 w-8 p-0 hover:bg-primary/10"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(contact.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contact.username && (
                <div className="text-sm text-muted-foreground">
                  Display: {contact.username}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground truncate mr-2 flex-1">
                  URL: {contact.value}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(
                    contact.value.startsWith('http') ? contact.value : 
                    contact.value.includes('@') ? `mailto:${contact.value}` : contact.value
                  )}
                  className="h-8 w-8 p-0 hover:bg-primary/10 flex-shrink-0"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminContacts;