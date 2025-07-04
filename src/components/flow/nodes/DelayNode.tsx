import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';

export default memo(({ data, id }: NodeProps) => {
  const [delay, setDelay] = useState((data?.delay as number) || 1);
  const [unit, setUnit] = useState((data?.unit as string) || 'days');

  const handleDelayChange = (value: string) => {
    const numValue = parseInt(value) || 1;
    setDelay(numValue);
    if (data?.onDataChange && typeof data.onDataChange === 'function') {
      data.onDataChange(id, { delay: numValue, unit });
    }
  };

  const handleUnitChange = (value: string) => {
    setUnit(value);
    if (data?.onDataChange && typeof data.onDataChange === 'function') {
      data.onDataChange(id, { delay, unit: value });
    }
  };

  return (
    <Card className="w-80 border-flow-delay shadow-md">
      <CardHeader className="pb-3 bg-flow-delay text-warning-foreground">
        <CardTitle className="flex items-center text-sm">
          <Clock className="mr-2 h-4 w-4" />
          Delay
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor={`delay-${id}`} className="text-xs">Duration</Label>
            <Input
              id={`delay-${id}`}
              type="number"
              min="1"
              value={delay}
              onChange={(e) => handleDelayChange(e.target.value)}
              className="nodrag text-sm"
            />
          </div>
          <div className="flex-1">
            <Label className="text-xs">Unit</Label>
            <Select value={unit} onValueChange={handleUnitChange}>
              <SelectTrigger className="nodrag">
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
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-flow-delay"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-flow-delay"
      />
    </Card>
  );
});