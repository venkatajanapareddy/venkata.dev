---
title: 'Design Tokens for Data Visualization'
date: '2023-01-10'
---

Charts in applications often look inconsistent. One dashboard uses blue for primary data, another uses green. Font sizes vary. Color palettes dont match the design system. Each developer picks colors that look good to them.

Design tokens solve this by defining visualization styles as reusable variables. Charts automatically match your design system without manually coordinating colors and styles.

## What are design tokens

Design tokens are named variables that store design decisions. Instead of hardcoding `#3b82f6` everywhere you use `color.primary` or `color.data.primary`.

```javascript
const tokens = {
  color: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  fontSize: {
    small: 12,
    medium: 14,
    large: 16,
  }
};
```

When you change `color.primary` all charts using that token update automatically.

## Tokens specific to data visualization

Data viz needs additional tokens beyond standard UI colors:

```javascript
const vizTokens = {
  color: {
    // Sequential color scales for continuous data
    sequential: {
      blue: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb'],
      green: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a'],
    },
    // Categorical colors for different data series
    categorical: [
      '#3b82f6', // blue
      '#ef4444', // red
      '#10b981', // green
      '#f59e0b', // amber
      '#8b5cf6', // purple
      '#ec4899', // pink
    ],
    // Diverging scale for data around a midpoint
    diverging: ['#dc2626', '#f87171', '#fca5a5', '#f3f4f6', '#93c5fd', '#60a5fa', '#2563eb'],
  },
  chart: {
    gridColor: '#e5e7eb',
    axisColor: '#6b7280',
    backgroundColor: '#ffffff',
    tooltipBackground: '#1f2937',
    tooltipText: '#f9fafb',
  },
  typography: {
    axisLabel: {
      fontSize: 12,
      fontWeight: 400,
      color: '#6b7280',
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: 600,
      color: '#111827',
    },
    tooltipText: {
      fontSize: 14,
      fontWeight: 400,
    }
  }
};
```

These tokens cover common visualization needs.

## Color scales for data

Sequential scales work for data with a natural order (0-100, low-high):

```javascript
function getSequentialColor(value, min, max) {
  const scale = vizTokens.color.sequential.blue;
  const normalized = (value - min) / (max - min);
  const index = Math.floor(normalized * (scale.length - 1));
  return scale[index];
}

// Usage
<rect fill={getSequentialColor(75, 0, 100)} />
// Returns a shade of blue based on the value
```

Categorical scales work for distinct categories (regions, products). You cycle through the colors:

```javascript
function getCategoricalColor(index) {
  const colors = vizTokens.color.categorical;
  return colors[index % colors.length];
}

// Usage
data.forEach((item, i) => {
  const color = getCategoricalColor(i);
  // Use color for this data series
});
```

Diverging scales work for data around a midpoint (temperature, profit/loss):

```javascript
function getDivergingColor(value, min, max, midpoint) {
  const scale = vizTokens.color.diverging;
  const normalizedMid = (midpoint - min) / (max - min);
  const normalized = (value - min) / (max - min);

  let index;
  if (normalized < normalizedMid) {
    index = Math.floor((normalized / normalizedMid) * 3);
  } else {
    index = 3 + Math.floor(((normalized - normalizedMid) / (1 - normalizedMid)) * 3);
  }

  return scale[Math.min(index, scale.length - 1)];
}
```

## Applying tokens to Chart.js

Chart.js accepts colors and styles as options:

```javascript
import { vizTokens } from './tokens';

const chartConfig = {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Revenue',
      data: [12, 19, 3],
      borderColor: vizTokens.color.categorical[0],
      backgroundColor: vizTokens.color.categorical[0] + '20', // Add transparency
    }]
  },
  options: {
    plugins: {
      title: {
        display: true,
        font: {
          size: vizTokens.typography.chartTitle.fontSize,
          weight: vizTokens.typography.chartTitle.fontWeight,
        },
        color: vizTokens.typography.chartTitle.color,
      },
      tooltip: {
        backgroundColor: vizTokens.chart.tooltipBackground,
        titleColor: vizTokens.chart.tooltipText,
        bodyColor: vizTokens.chart.tooltipText,
        titleFont: {
          size: vizTokens.typography.tooltipText.fontSize,
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: vizTokens.typography.axisLabel.fontSize,
          },
          color: vizTokens.typography.axisLabel.color,
        },
        grid: {
          color: vizTokens.chart.gridColor,
        }
      },
      y: {
        ticks: {
          font: {
            size: vizTokens.typography.axisLabel.fontSize,
          },
          color: vizTokens.typography.axisLabel.color,
        },
        grid: {
          color: vizTokens.chart.gridColor,
        }
      }
    }
  }
};
```

Now all Chart.js charts use consistent styling.

## Applying tokens to Recharts

Recharts uses component props for styling:

```jsx
import { vizTokens } from './tokens';

function RevenueChart({ data }) {
  return (
    <LineChart data={data}>
      <CartesianGrid stroke={vizTokens.chart.gridColor} />
      <XAxis
        tick={{
          fontSize: vizTokens.typography.axisLabel.fontSize,
          fill: vizTokens.typography.axisLabel.color,
        }}
      />
      <YAxis
        tick={{
          fontSize: vizTokens.typography.axisLabel.fontSize,
          fill: vizTokens.typography.axisLabel.color,
        }}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: vizTokens.chart.tooltipBackground,
          color: vizTokens.chart.tooltipText,
          fontSize: vizTokens.typography.tooltipText.fontSize,
        }}
      />
      <Line
        type="monotone"
        dataKey="value"
        stroke={vizTokens.color.categorical[0]}
        strokeWidth={2}
      />
    </LineChart>
  );
}
```

You can create a wrapper component that applies tokens automatically:

```jsx
function ThemedLineChart({ data, dataKey }) {
  return (
    <LineChart data={data}>
      <CartesianGrid stroke={vizTokens.chart.gridColor} />
      <XAxis tick={{ fontSize: vizTokens.typography.axisLabel.fontSize }} />
      <YAxis tick={{ fontSize: vizTokens.typography.axisLabel.fontSize }} />
      <Tooltip contentStyle={{ backgroundColor: vizTokens.chart.tooltipBackground }} />
      <Line
        dataKey={dataKey}
        stroke={vizTokens.color.categorical[0]}
      />
    </LineChart>
  );
}
```

Now developers use `<ThemedLineChart>` instead of configuring everything manually.

## Dark mode support

Define separate tokens for dark theme:

```javascript
const darkVizTokens = {
  color: {
    sequential: {
      blue: ['#1e3a8a', '#1e40af', '#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'],
    },
    categorical: [
      '#60a5fa', // lighter blue
      '#f87171', // lighter red
      '#4ade80', // lighter green
      '#fbbf24', // lighter amber
      '#a78bfa', // lighter purple
      '#f472b6', // lighter pink
    ],
  },
  chart: {
    gridColor: '#374151',
    axisColor: '#9ca3af',
    backgroundColor: '#111827',
    tooltipBackground: '#1f2937',
    tooltipText: '#f9fafb',
  },
  typography: {
    axisLabel: {
      color: '#9ca3af',
    },
    chartTitle: {
      color: '#f9fafb',
    }
  }
};
```

Switch between token sets based on theme:

```javascript
const tokens = isDarkMode ? darkVizTokens : vizTokens;
```

Charts automatically adapt to the current theme.

## Accessibility considerations

Color alone shouldnt convey information. Use patterns or labels too:

```javascript
const accessibleTokens = {
  patterns: {
    dots: 'url(#dots)',
    stripes: 'url(#stripes)',
    crosshatch: 'url(#crosshatch)',
  }
};

// Apply both color and pattern
<rect
  fill={vizTokens.color.categorical[0]}
  style={{ mask: accessibleTokens.patterns.dots }}
/>
```

Ensure sufficient contrast between colors:

```javascript
function hasGoodContrast(color1, color2) {
  // Calculate contrast ratio
  // Return true if ratio >= 4.5:1
}
```

Test color scales with colorblind simulators to ensure distinguishability.

## Managing tokens

Store tokens in a JSON or JavaScript file:

```javascript
// tokens/visualization.js
export const vizTokens = { /* ... */ };
```

For large projects use a tool like Style Dictionary to generate tokens for different platforms (web, mobile, design tools).

Version control your tokens. Changes to tokens affect all visualizations so review carefully before updating.

## Summary

Design tokens create consistency across data visualizations. Define color scales, typography, and spacing once then reference them in all charts.

Tokens make theming easier and ensure visualizations match your design system. They also make it simple to support dark mode or rebrand without touching individual chart code.

Start with basic color and typography tokens then expand as needed. The patterns here work with any charting library.
