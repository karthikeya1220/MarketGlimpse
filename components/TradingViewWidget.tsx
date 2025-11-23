'use client';

import React, { memo } from 'react';
import useTradingViewWidget from '@/hooks/usetradingviewWidget';
import { cn } from '@/lib/utils';

interface TradingViewWidgetProps {
  title?: string;
  scriptUrl: string;
  config: Record<string, unknown>;
  height?: number;
  className?: string;
}

const TradingViewWidget = ({
  title,
  scriptUrl,
  config,
  height = 600,
  className,
}: TradingViewWidgetProps) => {
  const containerRef = useTradingViewWidget(scriptUrl, config, height);

  return (
    <div className="w-full">
      {title && (
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-2xl text-gray-100">{title}</h3>
          {title.includes('Heatmap') && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-sm"></span>
              <span>Gainers</span>
              <span className="inline-block w-3 h-3 bg-red-500 rounded-sm ml-2"></span>
              <span>Losers</span>
            </div>
          )}
        </div>
      )}
      <div className={cn('tradingview-widget-container', className)} ref={containerRef}>
        <div className="tradingview-widget-container__widget" style={{ height, width: '100%' }} />
      </div>
    </div>
  );
};

export default memo(TradingViewWidget);
