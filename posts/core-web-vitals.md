---
title: 'Understanding Core Web Vitals'
date: '2022-05-27'
---

Google started using Core Web Vitals for search rankings in 2021. If your site is slow it can hurt your rankings.

## What are Core Web Vitals

There are three metrics that measure user experience.

**LCP (Largest Contentful Paint)** measures loading. It tracks when the largest image or text appears. Should be under 2.5 seconds.

**FID (First Input Delay)** measures interactivity. The time between clicking something and the browser responding. Target under 100 milliseconds.

**CLS (Cumulative Layout Shift)** measures visual stability. How much stuff moves around while loading. You may have seen this when you try to click a button but an ad loads and shifts everything down.

## Checking your scores

Use Lighthouse in Chrome DevTools. Open DevTools, go to Lighthouse tab, run an audit.

## Common fixes

**LCP issues** usually come from large images. Compress images and use WebP format.

**FID issues** happen when JavaScript blocks the main thread. You can defer scripts that arent needed right away.

**CLS issues** usually come from images without dimensions. Set width and height on images so the browser knows how much space to reserve.

## Learning more

Check out [web.dev](https://web.dev/) for detailed guides on improving each metric.
