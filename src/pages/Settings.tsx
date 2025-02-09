import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAgent } from "@/hooks/useAgent";

export default function Settings() {
  const { name, profileImage, setUserProfile } = useUserProfile();
  const { agent, setAgent } = useAgent();

  // Local states to edit fields
  const [userName, setUserName] = useState(name);
  const [userImage, setUserImage] = useState(profileImage);
  const [agentName, setAgentName] = useState(agent.name);
  const [agentImage, setAgentImage] = useState(agent.profileImage);
  const [agentVoiceId, setAgentVoiceId] = useState(agent.voiceId);

  // Update User Settings
  const handleSaveUserSettings = () => {
    setUserProfile({ name: userName, profileImage: userImage });
  };

  // Update Agent Settings
  const handleSaveAgentSettings = () => {
    setAgent({
      name: agentName,
      profileImage: agentImage,
      voiceId: agentVoiceId,
    });
  };

  return (
    <PageLayout title="Settings">
      <div className="flex flex-col space-y-6">
        {/* User Profile Section */}
        <Card
          className="bg-surface-primary border-none shadow-none"
          data-aos="fade-in"
        >
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-3">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userImage} alt="User Profile" />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-sm text-left text-text-secondary w-full font-semibold">
              Your name
            </p>

            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
            />
            <p className="text-sm text-left text-text-secondary w-full font-semibold">
              Profile image
            </p>

            <Input
              value={userImage}
              onChange={(e) => setUserImage(e.target.value)}
              placeholder="Profile image URL"
            />
            <Button onClick={handleSaveUserSettings}>Save User Settings</Button>
          </CardContent>
        </Card>

        {/* Agent Settings Section */}
        <Card
          className="bg-surface-primary border-none shadow-none"
          data-aos="fade-in"
        >
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">
              Agent Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-3">
            <Avatar className="w-24 h-24">
              <AvatarImage src={agentImage} alt="Agent Profile" />
              <AvatarFallback className="text-xl font-extrabold bg-surface-secondary rounded-full">
                {agentName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-left text-text-secondary w-full font-semibold">
              Agent name
            </p>
            <Input
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Agent Name"
            />
            <p className="text-sm text-left text-text-secondary w-full font-semibold">
              Agent image
            </p>
            <Input
              value={agentImage}
              onChange={(e) => setAgentImage(e.target.value)}
              placeholder="Agent Profile Image URL"
            />
            <p className="text-sm text-left text-text-secondary w-full font-semibold">
              Agent voice
            </p>

            <Input
              value={agentVoiceId}
              onChange={(e) => setAgentVoiceId(e.target.value)}
              placeholder="Agent Voice ID"
            />
            <Button onClick={handleSaveAgentSettings}>
              Save Agent Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
