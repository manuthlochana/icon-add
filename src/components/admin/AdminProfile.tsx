import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2 } from "lucide-react";

const AdminProfile = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProfilePicture();
  }, []);

  const loadProfilePicture = async () => {
    try {
      // List files in the profile-pictures bucket
      const { data: files, error } = await supabase.storage
        .from('profile-pictures')
        .list('', { limit: 1 });

      if (!error && files && files.length > 0) {
        // Get the public URL for the first profile picture
        const { data } = supabase.storage
          .from('profile-pictures')
          .getPublicUrl(files[0].name);
        
        setProfilePicture(data.publicUrl);
      }
    } catch (error) {
      console.error('Error loading profile picture:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Delete existing profile picture first
      const { data: existingFiles } = await supabase.storage
        .from('profile-pictures')
        .list('');

      if (existingFiles && existingFiles.length > 0) {
        await supabase.storage
          .from('profile-pictures')
          .remove(existingFiles.map(file => file.name));
      }

      // Upload new profile picture
      const fileName = `profile-${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      setProfilePicture(data.publicUrl);
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload profile picture",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePicture = async () => {
    if (!confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    try {
      // List and delete all files in the profile-pictures bucket
      const { data: files, error: listError } = await supabase.storage
        .from('profile-pictures')
        .list('');

      if (listError) throw listError;

      if (files && files.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from('profile-pictures')
          .remove(files.map(file => file.name));

        if (deleteError) throw deleteError;
      }

      setProfilePicture(null);
      
      toast({
        title: "Success",
        description: "Profile picture deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete profile picture",
        variant: "destructive"
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card className="glass-panel border-white/10 hover:border-primary/30 transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">Profile Picture Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-muted/30 border-2 border-white/10 flex items-center justify-center shadow-lg">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-sm">No picture</span>
                  </div>
                )}
              </div>
              {profilePicture && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeletePicture}
                    className="rounded-full h-8 px-3"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profilePicture" className="text-sm font-medium">
                Upload New Profile Picture
              </Label>
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="cursor-pointer file:cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                Supported: JPG, PNG, GIF • Max size: 5MB
              </p>
            </div>
            
            {isUploading && (
              <div className="flex items-center justify-center p-4 bg-muted/20 rounded-lg border border-white/5">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-muted/20 border border-white/5 p-4 rounded-lg space-y-3">
            <h4 className="font-semibold text-sm">Tips for best results:</h4>
            <ul className="text-xs space-y-1 text-muted-foreground leading-relaxed">
              <li>• Upload a square image for optimal circular display</li>
              <li>• High resolution images (at least 400x400px) work best</li>
              <li>• Changes appear immediately on your portfolio</li>
              <li>• Only one profile picture can be active at a time</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;