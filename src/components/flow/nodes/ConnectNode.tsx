import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';

export default memo(({ data, id }: NodeProps) => {
  const [connectMessage, setConnectMessage] = useState((data?.connectMessage as string) || '');

  const handleMessageChange = (value: string) => {
    setConnectMessage(value);
    // Update the data in the flow
    if (data?.onDataChange && typeof data.onDataChange === 'function') {
      data.onDataChange(id, { connectMessage: value });
    }
  };

  return (
    <Card className="w-80 border-flow-connect shadow-md">
      <CardHeader className="pb-3 bg-flow-connect text-white">
        <CardTitle className="flex items-center text-sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Connect
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