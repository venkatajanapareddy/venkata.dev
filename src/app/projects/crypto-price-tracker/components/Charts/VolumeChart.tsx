import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Cryptocurrency } from '@/types/crypto';

interface VolumeChartProps {
  cryptos: Cryptocurrency[];
  colors?: any;
}

export default function VolumeChart({ cryptos, colors }: VolumeChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || cryptos.length === 0) return;

    // Responsive chart sizing based on container width
    const containerWidth = containerRef.current.clientWidth;
    // Dynamic left margin: max 80px or 15% of width for Y-axis labels on mobile
    const margin = { top: 20, right: 20, bottom: 60, left: Math.min(80, containerWidth * 0.15) };
    const width = Math.max(300, containerWidth - margin.left - margin.right);
    const height = 300 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const sortedCryptos = [...cryptos].sort((a, b) => b.volume24h - a.volume24h).slice(0, 8);

    const x = d3.scaleBand()
      .domain(sortedCryptos.map(c => c.symbol))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedCryptos, c => c.volume24h) as number])
      .range([height, 0]);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', 'bold');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => {
        const value = d as number;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(0)}M`;
        return `$${value}`;
      }))
      .selectAll('text')
      .style('font-size', '12px');

    svg.selectAll('.bar')
      .data(sortedCryptos)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.symbol) as number)
      .attr('y', d => y(d.volume24h))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.volume24h))
      .attr('fill', colors?.colorSuccess || '#52c41a')
      .attr('opacity', 0.8)
      .on('mouseenter', function() {
        d3.select(this).attr('opacity', 1);
      })
      .on('mouseleave', function() {
        d3.select(this).attr('opacity', 0.8);
      });

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text('24h Trading Volume');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 20)
      .attr('x', 0 - height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Volume (USD)');

  }, [cryptos, colors]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <svg ref={svgRef}></svg>
    </div>
  );
}
