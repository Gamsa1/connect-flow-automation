import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderedFlowBuilder } from "@/components/flow/OrderedFlowBuilder";
import { storageService } from "@/lib/storage";
import { Campaign, CampaignNode, CampaignEdge, ACCOUNT_OPTIONS } from "@/types/campaign";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, MessageSquare, Clock, Save, ArrowLeft, Play, Square, Users } from "lucide-react";

export default function CampaignEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const campaignId = searchParams.get('id');
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaignName, setCampaignName] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [nodes, setNodes] = useState<CampaignNode[]>([]);
  const [edges, setEdges] = useState<CampaignEdge[]>([]);

  useEffect(() => {
    if (campaignId) {
      const loadedCampaign = storageService.getCampaignById(campaignId);
      if (loadedCampaign) {
        setCampaign(loadedCampaign);
        setCampaignName(loadedCampaign.name);
        setSelectedAccount(loadedCampaign.account);
        setNodes(loadedCampaign.nodes);
        setEdges(loadedCampaign.edges);
      } else {
        toast({
          title: "Campaign not found",
          description: "The requested campaign could not be found.",
          variant: "destructive",
        });
        navigate('/');
      }
    }
  }, [campaignId, navigate, toast]);

  const addNode = (type: 'connect' | 'message' | 'delay') => {
    const id = `${type}-${Date.now()}`;
    const newNode: CampaignNode = {
      id,
      type,
      position: { x: 0, y: 0 }, // Not used in ordered layout
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSaveCampaign = () => {
    if (!campaign) return;

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

    const updatedCampaign: Campaign = {
      ...campaign,
      name: campaignName,
      account: selectedAccount,
      nodes,
      edges,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveCampaign(updatedCampaign);
    setCampaign(updatedCampaign);
    
    toast({
      title: "Campaign updated",
      description: `${campaignName} has been saved successfully.`,
    });
  };

  const toggleCampaignStatus = () => {
    if (!campaign) return;

    const newStatus = campaign.status === 'running' ? 'stopped' : 'running';
    const updatedCampaign: Campaign = {
      ...campaign,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    storageService.saveCampaign(updatedCampaign);
    setCampaign(updatedCampaign);
    
    toast({
      title: `Campaign ${newStatus}`,
      description: `${campaign.name} has been ${newStatus}.`,
    });
  };

  const handleCollectLeads = () => {
    toast({
      title: "Lead collection started",
      description: "Collecting leads from your campaign...",
    });
  };

  if (!campaign) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Loading campaign...</h2>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-foreground">Campaign Editor</h1>
          <p className="text-muted-foreground mt-2">Edit your LinkedIn automation campaign</p>
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
              <Label className="text-sm font-medium">Campaign Controls</Label>
              <div className="grid gap-2 mt-2">
                <Button
                  variant={campaign.status === 'running' ? 'destructive' : 'default'}
                  size="sm"
                  onClick={toggleCampaignStatus}
                  className="justify-start"
                >
                  {campaign.status === 'running' ? (
                    <>
                      <Square className="mr-2 h-4 w-4" />
                      Stop Campaign
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Launch Campaign
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCollectLeads}
                  className="justify-start"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Collect Leads
                </Button>
              </div>
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
                Save Changes
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
            <OrderedFlowBuilder
              nodes={nodes}
              onNodesChange={setNodes}
            />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}