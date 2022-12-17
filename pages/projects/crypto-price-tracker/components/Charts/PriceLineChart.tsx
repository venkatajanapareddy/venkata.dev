import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Cryptocurrency } from '../../../../../types/crypto';
import { generateHistoricalData } from '../../../../../utils/cryptoCalculations';

interface PriceLineChartProps {
  cryptos: Cryptocurrency[];
  selectedSymbols?: string[];
  colors?: any;
  viewMode?: 'percentage' | 'absolute';
}

export default function PriceLineChart({ cryptos, selectedSymbols = ['BTC', 'ETH'], colors, viewMode = 'percentage' }: PriceLineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || cryptos.length === 0) return;

    const margin = { top: 20, right: 80, bottom: 30, left: 60 };
    const width = 700 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const selectedCryptos = cryptos.filter(c => selectedSymbols.includes(c.symbol));
    const historicalData = selectedCryptos.map(crypto => ({
      symbol: crypto.symbol,
      name: crypto.name,
      data: generateHistoricalData(crypto.currentPrice, 30),
    }));

    const allDates = historicalData[0]?.data.map(d => new Date(d.date)) || [];

    // Transform data based on view mode
    let transformedData;
    let yDomain;

    if (viewMode === 'percentage') {
      // Normalize to percentage change from first day
      transformedData = historicalData.map(crypto => ({
        ...crypto,
        data: crypto.data.map((point, index) => ({
          date: point.date,
          value: ((point.price - crypto.data[0].price) / crypto.data[0].price) * 100,
        })),
      }));

      const allPercentages = transformedData.flatMap(crypto => crypto.data.map(d => d.value));
      const maxAbs = Math.max(Math.abs(d3.min(allPercentages) || 0), Math.abs(d3.max(allPercentages) || 0));
      yDomain = [-maxAbs * 1.1, maxAbs * 1.1];
    } else {
      // Absolute price mode
      transformedData = historicalData.map(crypto => ({
        ...crypto,
        data: crypto.data.map(point => ({
          date: point.date,
          value: point.price,
        })),
      }));

      const allPrices = transformedData.flatMap(crypto => crypto.data.map(d => d.value));
      yDomain = [d3.min(allPrices) as number * 0.95, d3.max(allPrices) as number * 1.05];
    }

    const x = d3.scaleTime()
      .domain(d3.extent(allDates) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain(yDomain)
      .range([height, 0]);

    const modernColors = [
      colors?.colorPrimary || '#1677ff',
      colors?.colorSuccess || '#52c41a',
      colors?.colorWarning || '#faad14',
      colors?.colorError || '#ff4d4f',
      colors?.colorInfo || '#13c2c2',
      '#722ed1',
      '#eb2f96',
      '#fa541c',
    ];
    const colorScale = d3.scaleOrdinal(modernColors);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    // Add Y-axis with appropriate formatting
    const yAxis = viewMode === 'percentage'
      ? d3.axisLeft(y).ticks(6).tickFormat(d => `${d3.format('+.0f')(d as number)}%`)
      : d3.axisLeft(y).ticks(6).tickFormat(d => `$${d3.format('.0f')(d as number)}`);

    svg.append('g')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '12px');

    // Add horizontal zero line for percentage view
    if (viewMode === 'percentage') {
      svg.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', y(0))
        .attr('y2', y(0))
        .attr('stroke', '#d9d9d9')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');
    }

    const line = d3.line<{ date: string; value: number }>()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    transformedData.forEach((crypto, index) => {
      svg.append('path')
        .datum(crypto.data)
        .attr('fill', 'none')
        .attr('stroke', colorScale(index.toString()))
        .attr('stroke-width', 2)
        .attr('d', line);

      const lastDataPoint = crypto.data[crypto.data.length - 1];
      svg.append('text')
        .attr('x', width + 5)
        .attr('y', y(lastDataPoint.value))
        .attr('dy', '0.35em')
        .attr('fill', colorScale(index.toString()))
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(crypto.symbol);
    });

    const title = viewMode === 'percentage' ? '30-Day Performance (%)' : '30-Day Price Trends';
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .text(title);

  }, [cryptos, selectedSymbols, colors, viewMode]);

  return <svg ref={svgRef}></svg>;
}
