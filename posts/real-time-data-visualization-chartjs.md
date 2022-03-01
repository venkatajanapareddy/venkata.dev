---
title: 'Getting Started with Chart.js'
date: '2022-02-28'
---

Adding charts to web applications helps users understand data quickly. Instead of looking at tables of numbers they can see trends and patterns visually.

Chart.js is a JavaScript library that makes it simple to create charts in the browser. It handles the rendering and provides a straightforward API for different chart types.

## Why Chart.js

There are many charting libraries available but Chart.js is popular because its easy to get started with. The documentation is clear and you can have a working chart in just a few lines of code.

It works with plain JavaScript and also integrates well with frameworks like React or Vue. The charts are responsive by default which means they adapt to different screen sizes.

## Setting up Chart.js

First install Chart.js in your project:

```bash
npm install chart.js
```

You need a canvas element in your HTML and some JavaScript to create the chart.

```html
<!-- index.html -->
<canvas id="myChart"></canvas>
```

```javascript
// chart.js
import { Chart } from 'chart.js/auto';

const ctx = document.getElementById('myChart');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Monthly Sales',
      data: [12, 19, 3, 5, 2],
      backgroundColor: 'rgb(75, 192, 192)'
    }]
  },
  options: {
    responsive: true
  }
});
```

This creates a simple bar chart. The `labels` array defines the x-axis values and the `data` array contains the actual numbers to display.

## Different chart types

Chart.js supports several chart types. You can change the type by setting the `type` property.

Line charts work well for showing trends over time:

```javascript
const lineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Revenue',
      data: [30, 45, 38, 52, 49],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }
});
```

Pie charts are useful for showing proportions:

```javascript
const pieChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
      data: [55, 35, 10],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ]
    }]
  }
});
```

## Customizing appearance

You can customize colors, borders, and other styling options:

```javascript
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Sales',
      data: [120, 150, 180, 200],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgb(75, 192, 192)',
      borderWidth: 2
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
```

The `options` object lets you configure scales, legends, tooltips and other chart features.

## Multiple datasets

You can display multiple datasets on the same chart to compare different values:

```javascript
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Product A',
        data: [30, 45, 38, 52, 49],
        borderColor: 'rgb(75, 192, 192)'
      },
      {
        label: 'Product B',
        data: [20, 35, 42, 38, 45],
        borderColor: 'rgb(255, 99, 132)'
      }
    ]
  }
});
```

Each dataset can have its own color and styling. This is useful for comparing trends or showing related data together.

## Updating data

If you need to update chart data after creating it, Chart.js provides methods to modify the data:

```javascript
// Update existing data
chart.data.datasets[0].data[2] = 50;
chart.update();

// Add new data point
chart.data.labels.push('Jun');
chart.data.datasets[0].data.push(55);
chart.update();
```

Call `update()` after changing the data to redraw the chart.

## Using with React

Chart.js works with React but you need to manage the chart instance properly. Create the chart in useEffect and clean it up when the component unmounts:

```javascript
import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function ChartComponent({ data }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current;
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: data
    });

    return () => {
      chartRef.current.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
```

## Things to know

Chart.js uses the canvas element which doesnt scale the same way as regular HTML. You might need to adjust sizing in your CSS or use the responsive options.

The library is fairly large. If bundle size is a concern you can import only the chart types you need instead of using the auto bundle.

Accessibility can be tricky with canvas-based charts. Consider providing alternative text or data tables for screen readers.

## Summary

Chart.js is a good choice when you need to add charts to a web application. The setup is straightforward and the API is easy to understand.

This guide covers basic usage. The Chart.js documentation has more information about advanced features like plugins, custom scales, and different configuration options.
