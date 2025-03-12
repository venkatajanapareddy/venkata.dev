import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Cryptocurrency } from '@/types/crypto';

interface MarketCapBarChartProps {
  cryptos: Cryptocurrency[];
  colors?: any;
}

export default function MarketCapBarChart({ cryptos, colors }: MarketCapBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || cryptos.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 60, left: 80 };
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const sortedCryptos = [...cryptos].sort((a, b) => b.marketCap - a.marketCap).slice(0, 8);

    const x = d3.scaleBand()
      .domain(sortedCryptos.map(c => c.symbol))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedCryptos, c => c.marketCap) as number])
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
        if (value >= 1e9) return `$${(value / 1e9).toFixed(0)}B`;
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
      .attr('y', d => y(d.marketCap))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.marketCap))
      .attr('fill', colors?.colorPrimary || '#1677ff')
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
      .text('Market Cap Comparison');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left + 20)
      .attr('x', 0 - height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Market Cap (USD)');

  }, [cryptos, colors]);

  return <svg ref={svgRef}></svg>;
}
