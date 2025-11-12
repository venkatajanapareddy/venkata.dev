import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Cryptocurrency } from '@/types/crypto';

interface PerformanceHeatmapProps {
  cryptos: Cryptocurrency[];
  colors?: any;
}

export default function PerformanceHeatmap({ cryptos, colors }: PerformanceHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  // containerRef for measuring actual rendered width (responsive to viewport)
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || cryptos.length === 0) return;

    const containerWidth = containerRef.current.clientWidth;

    // Adaptive cell display: fewer cells on mobile to prevent overflow
    // 4 cells (<400px), 6 cells (<600px), 8 cells (≥600px)
    const maxCells = containerWidth < 400 ? 4 : containerWidth < 600 ? 6 : 8;
    const displayCryptos = cryptos.slice(0, maxCells);
    const numCells = displayCryptos.length;

    // Reduced margins for mobile screens
    const margin = { top: 40, right: 10, bottom: 60, left: 10 };
    const availableWidth = containerWidth - margin.left - margin.right;

    // Dynamic cell size: min 70px for text readability, max 90px for consistency
    // Ensures cells fit container while maintaining legible content
    const cellSize = Math.max(70, Math.min(90, Math.floor(availableWidth / numCells)));
    const width = numCells * cellSize;
    const height = cellSize;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const maxAbsChange = d3.max(displayCryptos, c => Math.abs(c.priceChangePercentage24h)) || 5;

    // Better font sizing relative to cell size
    const fontSize = Math.max(10, Math.min(14, cellSize / 5));
    const percentFontSize = Math.max(9, Math.min(12, cellSize / 6));

    const colorScale = d3.scaleLinear<string>()
      .domain([-maxAbsChange, 0, maxAbsChange])
      .range(['#ffe7e7', '#f5f5f5', '#e6f7e6']);

    displayCryptos.forEach((crypto, i) => {
      const cell = svg.append('g')
        .attr('transform', `translate(${i * cellSize}, 0)`);

      cell.append('rect')
        .attr('width', cellSize - 2)
        .attr('height', cellSize - 2)
        .attr('fill', colorScale(crypto.priceChangePercentage24h))
        .attr('stroke', '#d9d9d9')
        .attr('stroke-width', 1)
        .attr('rx', 4);

      cell.append('text')
        .attr('x', cellSize / 2)
        .attr('y', cellSize / 2 - (cellSize > 40 ? 10 : 6))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', `${fontSize}px`)
        .style('font-weight', 'bold')
        .text(crypto.symbol);

      cell.append('text')
        .attr('x', cellSize / 2)
        .attr('y', cellSize / 2 + (cellSize > 40 ? 10 : 6))
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', `${percentFontSize}px`)
        .style('font-weight', 'bold')
        .attr('fill', crypto.priceChangePercentage24h >= 0 ? (colors?.colorSuccess || '#52c41a') : (colors?.colorError || '#ff4d4f'))
        .text(`${crypto.priceChangePercentage24h >= 0 ? '+' : ''}${crypto.priceChangePercentage24h.toFixed(2)}%`);
    });

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', containerWidth < 400 ? '12px' : '14px')
      .style('font-weight', 'bold')
      .text('24h Performance Heatmap');

    // Responsive legend: max 200px or 80% of chart width for narrow screens
    const legendWidth = Math.min(200, width * 0.8);
    const legendHeight = 20;
    const legendX = width / 2 - legendWidth / 2;

    const legendGradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'legend-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%');

    legendGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ffe7e7');

    legendGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#f5f5f5');

    legendGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#e6f7e6');

    svg.append('rect')
      .attr('x', legendX)
      .attr('y', height + 10)
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)')
      .attr('stroke', '#d9d9d9');

    const legendFontSize = containerWidth < 400 ? '9px' : '11px';

    svg.append('text')
      .attr('x', legendX)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', legendFontSize)
      .text('Loss');

    svg.append('text')
      .attr('x', legendX + legendWidth / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', legendFontSize)
      .text('Neutral');

    svg.append('text')
      .attr('x', legendX + legendWidth)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .style('font-size', legendFontSize)
      .text('Gain');

  }, [cryptos, colors]);

  return (
    <div ref={containerRef} style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden' }}>
      <svg ref={svgRef} style={{ display: 'block', margin: '0 auto' }}></svg>
    </div>
  );
}
