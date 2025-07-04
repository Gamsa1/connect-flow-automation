import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CampaignNode } from '@/types/campaign';
import { UserPlus, MessageSquare, Clock, Trash2, ChevronUp, ChevronDown, ArrowDown } from 'lucide-react';

interface OrderedFlowBuilderProps {
  nodes: CampaignNode[];
  onNodesChange: (nodes: CampaignNode[]) => void;
}

export const OrderedFlowBuilder = ({ nodes, onNodesChange }: OrderedFlowBuilderProps) => {
  const [editingData, setEditingData] = useState<{[key: string]: any}>({});

  const handleDataChange = useCallback((nodeId: string, field: string, value: any) => {
    setEditingData(prev => ({
      ...prev,
      [nodeId]: {
        ...prev[nodeId],
        [field]: value
      }
    }));

    // Update the nodes array
    const updatedNodes = nodes.map(node => 
      node.id === nodeId 
        ? { 
            ...node, 
            data: { 
              ...node.data, 
              [field]: value 
            } 
          }
        : node
    );
    onNodesChange(updatedNodes);
  }, [nodes, onNodesChange]);

  const deleteNode = useCallback((nodeId: string) => {
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    onNodesChange(updatedNodes);
    
    // Clean up editing data
    setEditingData(prev => {
      const newData = { ...prev };
      delete newData[nodeId];
      return newData;
    });
  }, [nodes, onNodesChange]);

  const moveNode = useCallback((nodeId: string, direction: 'up' | 'down') => {
    const currentIndex = nodes.findIndex(node => node.id === nodeId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= nodes.length) return;

    const updatedNodes = [...nodes];
    [updatedNodes[currentIndex], updatedNodes[newIndex]] = [updatedNodes[newIndex], updatedNodes[currentIndex]];
    
    onNodesChange(updatedNodes);
  }, [nodes, onNodesChange]);

  const getNodeValue = (nodeId: string, field: string, defaultValue: any = '') => {
    const editingValue = editingData[nodeId]?.[field];
    if (editingValue !== undefined) return editingValue;
    
    const node = nodes.find(n => n.id === nodeId);
    return node?.data?.[field] || defaultValue;
  };

  const renderConnectNode = (node: CampaignNode, index: number) => (
    <Card key={node.id} className="border-flow-connect shadow-sm">
      <CardHeader className="pb-3 bg-flow-connect text-white">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Connect
            <span className="ml-2 bg-white/20 px-2 py-1 rounded text-xs">
              Step {index + 1}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveNode(node.id, 'up')}
              disabled={index === 0}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveNode(node.id, 'down')}
              disabled={index === nodes.length - 1}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteNode(node.id)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Label htmlFor={`connect-${node.id}`} className="text-xs">Connection Message</Label>
        <Input
          id={`connect-${node.id}`}
          placeholder="Hi! I'd like to connect..."
          value={getNodeValue(node.id, 'connectMessage')}
          onChange={(e) => handleDataChange(node.id, 'connectMessage', e.target.value)}
          className="text-sm mt-1"
        />
      </CardContent>
    </Card>
  );

  const renderMessageNode = (node: CampaignNode, index: number) => (
    <Card key={node.id} className="border-flow-message shadow-sm">
      <CardHeader className="pb-3 bg-flow-message text-white">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
            <span className="ml-2 bg-white/20 px-2 py-1 rounded text-xs">
              Step {index + 1}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveNode(node.id, 'up')}
              disabled={index === 0}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveNode(node.id, 'down')}
              disabled={index === nodes.length - 1}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteNode(node.id)}
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <Label htmlFor={`message-${node.id}`} className="text-xs">Message Content</Label>
        <Textarea
          id={`message-${node.id}`}
          placeholder="Hey {firstName}, I noticed we both work in..."
          value={getNodeValue(node.id, 'message')}
          onChange={(e) => handleDataChange(node.id, 'message', e.target.value)}
          className="text-sm mt-1 min-h-[80px]"
          rows={3}
        />
      </CardContent>
    </Card>
  );

  const renderDelayNode = (node: CampaignNode, index: number) => (
    <Card key={node.id} className="border-flow-delay shadow-sm">
      <CardHeader className="pb-3 bg-flow-delay text-warning-foreground">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Delay
            <span className="ml-2 bg-black/20 px-2 py-1 rounded text-xs">
              Step {index + 1}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveNode(node.id, 'up')}
              disabled={index === 0}
              className="h-6 w-6 p-0 text-warning-foreground hover:bg-black/20"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveNode(node.id, 'down')}
              disabled={index === nodes.length - 1}
              className="h-6 w-6 p-0 text-warning-foreground hover:bg-black/20"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteNode(node.id)}
              className="h-6 w-6 p-0 text-warning-foreground hover:bg-black/20"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor={`delay-${node.id}`} className="text-xs">Duration</Label>
            <Input
              id={`delay-${node.id}`}
              type="number"
              min="1"
              value={getNodeValue(node.id, 'delay', 1)}
              onChange={(e) => handleDataChange(node.id, 'delay', parseInt(e.target.value) || 1)}
              className="text-sm mt-1"
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs">Unit</Label>
            <Select 
              value={getNodeValue(node.id, 'unit', 'days')} 
              onValueChange={(value) => handleDataChange(node.id, 'unit', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-center border-2 border-dashed border-muted rounded-lg">
        <div className="mb-4">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
            <UserPlus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No campaign steps yet</h3>
          <p className="text-muted-foreground">Add your first component to start building your automation flow.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {nodes.map((node, index) => (
        <div key={node.id} className="relative">
          {node.type === 'connect' && renderConnectNode(node, index)}
          {node.type === 'message' && renderMessageNode(node, index)}
          {node.type === 'delay' && renderDelayNode(node, index)}
          
          {index < nodes.length - 1 && (
            <div className="flex justify-center py-2">
              <ArrowDown className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};