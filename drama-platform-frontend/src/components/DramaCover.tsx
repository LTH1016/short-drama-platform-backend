import React from 'react';

interface DramaCoverProps {
  dramaId: string;
  title: string;
  category: string;
  rating: number;
  className?: string;
}

const DramaCover: React.FC<DramaCoverProps> = ({ dramaId, title, category, rating, className = "" }) => {
  // 根据dramaId获取对应的渐变色和配置
  const getCoverConfig = (id: string) => {
    const configs: Record<string, { gradient: [string, string]; bgId: string }> = {
      '1': { gradient: ["#FF6B6B", "#FF8E8E"], bgId: "bg1" },
      '2': { gradient: ["#4ECDC4", "#44A08D"], bgId: "bg2" },
      '3': { gradient: ["#A8E6CF", "#7FCDCD"], bgId: "bg3" },
      '4': { gradient: ["#FFB6C1", "#FFA0AC"], bgId: "bg4" },
      '5': { gradient: ["#6C5CE7", "#A29BFE"], bgId: "bg5" },
      '6': { gradient: ["#FD79A8", "#E84393"], bgId: "bg6" },
      '7': { gradient: ["#00B894", "#00A085"], bgId: "bg7" },
      '8': { gradient: ["#FDCB6E", "#E17055"], bgId: "bg8" },
    };
    
    // 从poster路径中提取数字，例如 "/drama-covers/drama2.svg" -> "2"
    const match = id.match(/drama(\d+)\.svg/) || id.match(/(\d+)/);
    const num = match ? match[1] : '1';
    
    return configs[num] || configs['1'];
  };

  const config = getCoverConfig(dramaId);
  const uniqueId = `${config.bgId}-${Date.now()}`;

  return (
    <svg 
      width="300" 
      height="400" 
      viewBox="0 0 300 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: config.gradient[0], stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: config.gradient[1], stopOpacity: 1}} />
        </linearGradient>
      </defs>
      
      {/* 背景 */}
      <rect width="300" height="400" fill={`url(#${uniqueId})`}/>
      
      {/* 播放按钮背景 */}
      <circle cx="150" cy="160" r="50" fill="rgba(255,255,255,0.3)"/>
      
      {/* 播放按钮 */}
      <polygon points="130,140 130,180 170,160" fill="white"/>
      
      {/* 标题 */}
      <text 
        x="150" 
        y="250" 
        textAnchor="middle" 
        fill="white" 
        fontFamily="Arial, sans-serif" 
        fontSize="18" 
        fontWeight="bold"
      >
        {title}
      </text>
      
      {/* 分类 */}
      <text 
        x="150" 
        y="280" 
        textAnchor="middle" 
        fill="rgba(255,255,255,0.8)" 
        fontFamily="Arial, sans-serif" 
        fontSize="14"
      >
        {category}
      </text>
      
      {/* 评分 */}
      <text 
        x="150" 
        y="320" 
        textAnchor="middle" 
        fill="rgba(255,255,255,0.6)" 
        fontFamily="Arial, sans-serif" 
        fontSize="12"
      >
        ★★★★☆ {rating.toFixed(1)}
      </text>
    </svg>
  );
};

export default DramaCover;
