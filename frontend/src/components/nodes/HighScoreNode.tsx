import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface HighScoreNodeData {
  label: string;
  username: string;
  age: number;
  hobbies: string[];
  popularityScore: number;
}

const HighScoreNode: React.FC<NodeProps<HighScoreNodeData>> = ({ data, id }) => {
  const size = Math.min(150 + data.popularityScore * 10, 250);
  const glowIntensity = Math.min(data.popularityScore * 0.2, 1);

  return (
    <div
      data-id={id}
      className="relative rounded-full border-4 border-blue-500 shadow-lg transition-all duration-300"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, rgba(59, 130, 246, ${0.3 + glowIntensity * 0.3}), rgba(37, 99, 235, ${0.5 + glowIntensity * 0.3}))`,
        boxShadow: `0 0 ${20 + glowIntensity * 30}px rgba(59, 130, 246, ${0.6 + glowIntensity * 0.4})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px',
        textAlign: 'center',
        padding: '10px',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col items-center">
        <div className="text-sm font-semibold">{data.label}</div>
        <div className="text-xs mt-1 opacity-90">
          Score: {data.popularityScore.toFixed(1)}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default HighScoreNode;

