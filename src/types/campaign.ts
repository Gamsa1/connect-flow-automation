export interface CampaignNode {
  id: string;
  type: 'connect' | 'message' | 'delay';
  position: { x: number; y: number };
  data: {
    label?: string;
    message?: string;
    delay?: number;
    unit?: string;
    connectMessage?: string;
    order?: number;
    onDataChange?: (nodeId: string, newData: any) => void;
    onDelete?: (nodeId: string) => void;
  };
}

export interface CampaignEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface Campaign {
  id: string;
  name: string;
  account: string;
  status: 'draft' | 'running' | 'stopped' | 'completed';
  nodes: CampaignNode[];
  edges: CampaignEdge[];
  createdAt: string;
  updatedAt: string;
}

export const ACCOUNT_OPTIONS = [
  'LinkedIn Account 1',
  'LinkedIn Account 2', 
  'LinkedIn Account 3',
  'LinkedIn Account 4'
] as const;

export type AccountOption = typeof ACCOUNT_OPTIONS[number];