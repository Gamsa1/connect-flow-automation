import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { storageService } from "@/lib/storage";
import { Campaign } from "@/types/campaign";
import { useToast } from "@/hooks/use-toast";
import { Play, Square, Trash2, Edit, Plus } from "lucide-react";

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = () => {
    const stored = storageService.getCampaigns();
    setCampaigns(stored);
  };

  const toggleCampaignStatus = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    const newStatus = campaign.status === 'running' ? 'stopped' : 'running';
    const updatedCampaign = {
      ...campaign,
      status: newStatus as Campaign['status'],
      updatedAt: new Date().toISOString()
    };

    storageService.saveCampaign(updatedCampaign);
    loadCampaigns();
    
    toast({
      title: `Campaign ${newStatus}`,
      description: `${campaign.name} has been ${newStatus}.`,
    });
  };

  const deleteCampaign = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (!campaign) return;

    storageService.deleteCampaign(campaignId);
    loadCampaigns();
    
    toast({
      title: "Campaign deleted",
      description: `${campaign.name} has been removed.`,
    });
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'running':
        return 'bg-success text-success-foreground';
      case 'stopped':
        return 'bg-destructive text-destructive-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaign Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your LinkedIn automation campaigns</p>
        </div>
        <Link to="/builder">
          <Button size="lg" className="shadow-lg">
            <Plus className="mr-2 h-5 w-5" />
            New Campaign
          </Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mb-6">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground">Create your first LinkedIn automation campaign to get started.</p>
            </div>
            <Link to="/builder">
              <Button>Create Campaign</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg truncate">{campaign.name}</CardTitle>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{campaign.account}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <p>Created: {new Date(campaign.createdAt).toLocaleDateString()}</p>
                    <p>Nodes: {campaign.nodes.length}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={campaign.status === 'running' ? 'destructive' : 'default'}
                      onClick={() => toggleCampaignStatus(campaign.id)}
                      className="flex-1"
                    >
                      {campaign.status === 'running' ? (
                        <>
                          <Square className="mr-1 h-3 w-3" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="mr-1 h-3 w-3" />
                          Launch
                        </>
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/editor?id=${campaign.id}`)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteCampaign(campaign.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}