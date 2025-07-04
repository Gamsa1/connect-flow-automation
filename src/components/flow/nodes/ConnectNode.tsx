import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserPlus, Trash2 } from 'lucide-react';

export default memo(({ data, id }: NodeProps) => {
  const [connectMessage, setConnectMessage] = useState((data?.connectMessage as string) || '');

  const handleMessageChange = (value: string) => {
    setConnectMessage(value);
    // Update the data in the flow
    if (data?.onDataChange && typeof data.onDataChange === 'function') {
      data.onDataChange(id, { connectMessage: value });
    }
  };

  const handleDelete = () => {
    if (data?.onDelete && typeof data.onDelete === 'function') {
      data.onDelete(id);
    }
  };

  return (
    <Card className="w-80 border-flow-connect shadow-md">
      <CardHeader className="pb-3 bg-flow-connect text-white">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <UserPlus className="mr-2 h-4 w-4" />
            Connect
            {data?.order && (
              <span className="ml-2 bg-white/20 px-2 py-1 rounded text-xs">
                Step {data.order as number}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div>
          <Label htmlFor={`connect-${id}`} className="text-xs">Connection Message</Label>
          <Input
            id={`connect-${id}`}
            placeholder="Hi! I'd like to connect..."
            value={connectMessage}
            onChange={(e) => handleMessageChange(e.target.value)}
            className="nodrag text-sm"
          />
        </div>
      </CardContent>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-flow-connect"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-flow-connect"
      />
    </Card>
  );
});