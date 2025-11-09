import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface LowScoreNodeData {
  label: string;
  username: string;
  age: number;
  hobbies: string[];
  popularityScore: number;
}

const LowScoreNode: React.FC<NodeProps<LowScoreNodeData>> = ({ data, id }) => {
  const size = Math.max(80 + data.popularityScore * 5, 60);

  return (
    <div
      data-id={id}
      className="relative rounded-full border-2 border-gray-400 transition-all duration-300"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, rgba(156, 163, 175, 0.3), rgba(107, 114, 128, 0.5))`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'medium',
        fontSize: '12px',
        textAlign: 'center',
        padding: '8px',
        opacity: 0.8,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col items-center">
        <div className="text-xs font-medium">{data.label}</div>
        <div className="text-xs mt-1 opacity-75">
          {data.popularityScore.toFixed(1)}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default LowScoreNode;

