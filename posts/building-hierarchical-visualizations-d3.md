---
title: 'Building Hierarchical Visualizations with D3.js'
date: '2022-06-10'
---

Hierarchical data is common in software. Organization charts, file systems, category trees, DOM structures. Tables and lists dont work well for showing parent-child relationships and multiple levels of nesting.

D3.js provides tools for creating tree diagrams and other hierarchical visualizations that make these relationships clear.

## What is hierarchical data

Hierarchical data has a tree structure where each item can have child items. An organization chart is a good example. The CEO is at the top, executives report to the CEO, managers report to executives, and employees report to managers.

```javascript
const data = {
  name: "CEO",
  children: [
    {
      name: "VP Engineering",
      children: [
        { name: "Frontend Team Lead" },
        { name: "Backend Team Lead" }
      ]
    },
    {
      name: "VP Sales",
      children: [
        { name: "Sales Manager" }
      ]
    }
  ]
};
```

This structure captures the hierarchy but its hard to understand at a glance. A visual tree makes it obvious.

## Setting up D3

Install D3 in your project:

```bash
npm install d3
```

You'll need an SVG element to render the tree:

```html
<svg id="tree" width="800" height="600"></svg>
```

D3 works by manipulating SVG elements based on your data. Its powerful but has a learning curve compared to simpler charting libraries.

## Creating a basic tree

D3 provides a tree layout that calculates positions for nodes:

```javascript
import * as d3 from 'd3';

// Create tree layout
const treeLayout = d3.tree()
  .size([600, 400]);

// Convert data to hierarchy
const root = d3.hierarchy(data);

// Calculate positions
treeLayout(root);

// Select SVG
const svg = d3.select('#tree');

// Draw links
svg.selectAll('.link')
  .data(root.links())
  .enter()
  .append('line')
  .attr('class', 'link')
  .attr('x1', d => d.source.x)
  .attr('y1', d => d.source.y)
  .attr('x2', d => d.target.x)
  .attr('y2', d => d.target.y)
  .attr('stroke', '#999');

// Draw nodes
svg.selectAll('.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .attr('class', 'node')
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', 5)
  .attr('fill', '#69b3a2');

// Add labels
svg.selectAll('.label')
  .data(root.descendants())
  .enter()
  .append('text')
  .attr('class', 'label')
  .attr('x', d => d.x)
  .attr('y', d => d.y - 10)
  .attr('text-anchor', 'middle')
  .text(d => d.data.name)
  .attr('font-size', '12px');
```

This creates a basic tree with circles for nodes and lines connecting them. The tree layout handles the positioning automatically.

## Horizontal vs vertical trees

The default tree layout is vertical. For horizontal trees swap the x and y coordinates:

```javascript
const treeLayout = d3.tree()
  .size([400, 600]);

// When drawing, swap x and y
.attr('x1', d => d.source.y)
.attr('y1', d => d.source.x)
.attr('x2', d => d.target.y)
.attr('y2', d => d.target.x)
```

Horizontal trees work better when node labels are long because you have more horizontal space.

## Collapsible trees

Interactive trees let users collapse and expand branches. This requires tracking which nodes are collapsed and updating the visualization:

```javascript
function update(source) {
  const nodes = root.descendants();
  const links = root.links();

  // Filter out children of collapsed nodes
  const visibleNodes = nodes.filter(d => {
    let current = d;
    while (current.parent) {
      if (current.parent._collapsed) return false;
      current = current.parent;
    }
    return true;
  });

  // Redraw with visible nodes only
  // (similar to basic example but with filtered data)
}

// Toggle collapse on click
svg.selectAll('.node')
  .on('click', function(event, d) {
    if (d.children) {
      d._collapsed = !d._collapsed;
      update(d);
    }
  });
```

This pattern is common in file browsers and navigation menus.

## Styling nodes differently

You might want different colors or sizes for different node types:

```javascript
svg.selectAll('.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .attr('r', d => d.children ? 7 : 5)  // Larger if has children
  .attr('fill', d => {
    if (d.depth === 0) return '#ff6b6b';  // Root
    if (d.children) return '#4ecdc4';     // Branch
    return '#95e1d3';                     // Leaf
  });
```

This makes it easier to distinguish between different levels and types of nodes.

## Performance with large trees

Large hierarchies with thousands of nodes can be slow to render. A few optimizations help:

Limit the depth displayed. You dont need to show all 10 levels at once. Start with 2-3 levels and let users expand deeper.

Use virtual rendering for very large trees. Only render nodes that are visible in the viewport.

Simplify the visualization. Maybe you dont need labels on every node or fancy styling.

## Radial trees

For some hierarchies a radial layout works better than linear:

```javascript
const treeLayout = d3.tree()
  .size([2 * Math.PI, 200])
  .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

// Convert polar to cartesian coordinates
function project(x, y) {
  const angle = x;
  const radius = y;
  return [
    radius * Math.cos(angle - Math.PI / 2),
    radius * Math.sin(angle - Math.PI / 2)
  ];
}
```

Radial trees use space more efficiently when you have many branches at the same level.

## When to use tree visualizations

Trees work well for organization charts, category hierarchies, and decision trees. They dont work as well when relationships are more complex than parent-child or when there are cycles in the data.

If nodes have multiple parents consider using a graph visualization instead of a tree. If the hierarchy is very deep a tree diagram might be too large to display effectively.

## Summary

D3.js provides flexible tools for building tree visualizations. The learning curve is steeper than Chart.js but you get more control over the final result.

Start with the basic tree layout and add interactivity as needed. The D3 documentation has more examples and advanced techniques for customizing trees.
