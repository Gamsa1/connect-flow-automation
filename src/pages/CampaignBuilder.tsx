import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlowBuilder } from "@/components/flow/FlowBuilder";
import { storageService } from "@/lib/storage";
import { Campaign, CampaignNode, CampaignEdge, ACCOUNT_OPTIONS } from "@/types/campaign";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, MessageSquare, Clock, Save, ArrowLeft } from "lucide-react";

export default function CampaignBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [campaignName, setCampaignName] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [nodes, setNodes] = useState<CampaignNode[]>([]);
  const [edges, setEdges] = useState<CampaignEdge[]>([]);

  const addNode = (type: 'connect' | 'message' | 'delay') => {
    const id = `${type}-${Date.now()}`;
    const newNode: CampaignNode = {
      id,
      type,
      position: { 
        x: Math.random() * 500 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSaveCampaign = () => {
    if (!campaignName.trim()) {
      toast({
        title: "Campaign name required",
        description: "Please enter a name for your campaign.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedAccount) {
      toast({
        title: "Account required",
        description: "Please select a LinkedIn account.",
        variant: "destructive",
      });
      return;
    }

    if (nodes.length === 0) {
      toast({
        title: "No campaign flow",
        description: "Please add at least one node to your campaign.",
        variant: "destructive",
      });
      return;
    }

    const campaign: Campaign = {
      id: uuidv4(),
      name: campaignName,
      account: selectedAccount,
      status: 'draft',
      nodes,
      edges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageService.saveCampaign(campaign);
    
    toast({
      title: "Campaign saved",
      description: `${campaignName} has been created successfully.`,
    });

    navigate('/');
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaign Builder</h1>
          <p className="text-muted-foreground mt-2">Create a new LinkedIn automation campaign</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Settings Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Campaign Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                placeholder="Enter campaign name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            
            <div>
              <Label>LinkedIn Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_OPTIONS.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Label className="text-sm font-medium">Add Components</Label>
              <div className="grid gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNode('connect')}
                  className="justify-start"
                >
                  <UserPlus className="mr-2 h-4 w-4 text-flow-connect" />
                  Connect
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNode('message')}
                  className="justify-start"
                >
                  <MessageSquare className="mr-2 h-4 w-4 text-flow-message" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addNode('delay')}
                  className="justify-start"
                >
                  <Clock className="mr-2 h-4 w-4 text-flow-delay" />
                  Delay
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSaveCampaign}
                className="w-full"
                size="lg"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Campaign
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Flow Builder */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Flow</CardTitle>
              <p className="text-sm text-muted-foreground">
                Drag and connect components to build your automation flow
              </p>
            </CardHeader>
            <CardContent>
              <FlowBuilder
                nodes={nodes}
                edges={edges}
                onNodesChange={setNodes}
                onEdgesChange={setEdges}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}