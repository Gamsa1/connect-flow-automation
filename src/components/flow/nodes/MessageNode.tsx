import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare } from 'lucide-react';

export default memo(({ data, id }: NodeProps) => {
  const [message, setMessage] = useState((data?.message as string) || '');

  const handleMessageChange = (value: string) => {
    setMessage(value);
    if (data?.onDataChange && typeof data.onDataChange === 'function') {
      data.onDataChange(id, { message: value });
    }
  };

  return (
    <Card className="w-80 border-flow-message shadow-md">
      <CardHeader className="pb-3 bg-flow-message text-white">
        <CardTitle className="flex items-center text-sm">
          <MessageSquare className="mr-2 h-4 w-4" />
          Message
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div>
          <Label htmlFor={`message-${id}`} className="text-xs">Message Content</Label>
          <Textarea
            id={`message-${id}`}
            placeholder="Hey {firstName}, I noticed we both work in..."
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            className="nodrag text-sm min-h-[80px]"
            rows={3}
          />
        </div>
      </CardContent>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-flow-message"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-flow-message"
      />
    </Card>
  );
});