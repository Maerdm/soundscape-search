// GraphVisualization.js
import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector} from 'react-redux';

import * as d3 from 'd3';

const GraphVisualization = () => { // Default to 15 seconds if not provided
  
  var current = useSelector((state) => state.currentSoundcape);
  var audioLengthSeconds = current.duration_s
  
  const containerRef = useRef(null);
  const svgRefs = useRef([]);
  const graphData = useRef([]);

  // Function to format time values (MM:SS format when over 60 seconds)
  const formatTime = (seconds) => {
    if (seconds < 60) {
      return Math.round(seconds);
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      // Only show seconds if they're not zero
      return remainingSeconds === 0 
        ? `${minutes}:00`
        : `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
    }
  };

  // Generate X-axis ticks based on audio length - always 15 ticks
  const generateXAxisTicks = (audioLength) => {
    
    var tickCount = 15;
    if (audioLength < 15) {
      tickCount = Math.ceil(audioLength)
    }

    const interval = audioLength / (tickCount - 1); // Distribute evenly

    const ticks = [];
    for (let i = 0; i < tickCount; i++) {
      const tickValue = i * interval;
      ticks.push(tickValue);
    }
    
    // Ensure the final tick is the audio length
    if (ticks[ticks.length - 1] !== audioLength) {
      ticks[ticks.length - 1] = audioLength;
    }
    
    return ticks;
  };

  // Initialize demo data for the graphs
  const initializeGraphData = useCallback(() => {
    // Create 5 different graph data sets
    return Array(5).fill().map((_, index) => {
      // Generate data points distributed across the entire audio length
      const pointCount = 100; // We'll keep 100 data points for smooth curves
      return Array(pointCount).fill().map((_, i) => {
        // Map i (0-99) to the appropriate time in seconds
        const x = (i / (pointCount - 1)) * audioLengthSeconds;
        const frequency = 0.05 + (index * 0.01);
        const amplitude = 50 + (index * 10);
        const phase = index * Math.PI / 5;
        // Use normalized x value for calculating the wave pattern
        const normalizedX = i;
        const y = Math.sin(normalizedX * frequency + phase) * amplitude + 
                 (Math.random() * 20 - 10) + 
                 (index === 2 ? Math.cos(normalizedX * 0.02) * 30 : 0);
        return { x, y };
      });
    });
  }, [audioLengthSeconds]);

  const createGraphs = useCallback(() => {
    if (!containerRef.current) return;
    
    // Clear any existing SVGs
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    
    svgRefs.current = [];

    // Initialize graph data if not already done
    if (graphData.current.length === 0) {
      graphData.current = initializeGraphData();
    }

    // Get container dimensions
    const margin = { top: 20, right: 86, bottom: 40, left: 71 }; // Sufficient margin for horizontal labels
    const containerWidth = containerRef.current.clientWidth;
    const graphHeight = 210; // Fixed height for each graph
    
    const width = containerWidth - margin.left - margin.right;
    const height = graphHeight - margin.top - margin.bottom;

    // Create a scrollable inner container for all graphs
    const graphsContainer = document.createElement('div');
    graphsContainer.style.overflowY = 'auto';
    graphsContainer.style.height = '100%';
    graphsContainer.style.padding = '10px';
    graphsContainer.style.paddingBottom = '80px'; // Extra padding at bottom
    graphsContainer.style.boxSizing = 'border-box';
    containerRef.current.appendChild(graphsContainer);

    // Get X-axis ticks based on audio length
    const xAxisTicks = generateXAxisTicks(audioLengthSeconds);

    // Create 5 graphs
    for (let i = 0; i < 5; i++) {
      // Create an individual container for each graph
      const graphContainer = document.createElement('div');
      graphContainer.style.marginBottom = '20px';
      graphContainer.style.borderRadius = '8px';
      graphContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      graphContainer.style.backgroundColor = '#fff';
      graphContainer.style.display = 'flex';
      graphContainer.style.flexDirection = 'column';
      
      // Add to the main container
      graphsContainer.appendChild(graphContainer);
      
      // Create SVG element
      const svg = d3.select(graphContainer)
        .append('svg')
        .attr('width', containerWidth)
        .attr('height', graphHeight)
        .style('display', 'block');
      
      svgRefs.current.push(svg);

      // Create a group for margins
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
      
      // Add background
      g.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#f8f1fa')
        .attr('rx', 5)
        .attr('ry', 5);

      // X scale - use the actual time values in seconds
      const x = d3.scaleLinear()
        .domain([0, audioLengthSeconds])
        .range([0, width]);
      
      // Find min and max Y values for this dataset
      const yExtent = d3.extent(graphData.current[i], d => d.y);
      const padding = (yExtent[1] - yExtent[0]) * 0.1; // Add 10% padding
      
      // Y scale
      const y = d3.scaleLinear()
        .domain([yExtent[0] - padding, yExtent[1] + padding])
        .range([height, 0]);

      // Add X axis with custom ticks and time formatting
      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x)
          .tickValues(xAxisTicks)
          .tickFormat(d => formatTime(d))
        )
        .call(g => g.select('.domain').attr('stroke', '#adb5bd'))
        .call(g => g.selectAll('.tick line').attr('stroke', '#adb5bd'))
        .call(g => g.selectAll('.tick text')
          .attr('fill', '#495057')
          .style('text-anchor', 'middle') // Center text for horizontal alignment
        );

      // Add X-axis label - determine label based on audio length
      const xAxisLabel = audioLengthSeconds >= 60 ? 'Time (min:sec)' : 'Time (seconds)';
      g.append('text')
        .attr('transform', `translate(${width / 2}, ${height + 35})`) // Increased vertical offset
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#495057')
        .text(xAxisLabel);

      // Add Y axis
      g.append('g')
        .call(d3.axisLeft(y).ticks(5))
        .call(g => g.select('.domain').attr('stroke', '#adb5bd'))
        .call(g => g.selectAll('.tick line').attr('stroke', '#adb5bd'))
        .call(g => g.selectAll('.tick text').attr('fill', '#495057'));
      
      // Add grid lines
      g.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .call(d3.axisLeft(y)
          .tickSize(-width)
          .tickFormat('')
        );
      
      // Add the line
      const line = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y))
        .curve(d3.curveMonotoneX); // Smooth the line
      
      g.append('path')
        .datum(graphData.current[i])
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('stroke-width', 1)
        .attr('d', line);
      
      // Graph titles
      const graphTitles = ["Amplitude", "Roughness", "Sharpness", "Toonality", "Test"];
      const graphTitle = document.createElement('div');
      graphTitle.textContent = graphTitles[i];
      graphTitle.style.fontSize = '15px';
      graphTitle.style.padding = '1px 12px';
      graphTitle.style.backgroundColor = 'white';
      graphTitle.style.borderTopLeftRadius = '8px';
      graphTitle.style.borderTopRightRadius = '8px';
      graphTitle.style.textAlign = 'left';
      graphTitle.style.width = 'fit-content';
      graphContainer.insertBefore(graphTitle, graphContainer.firstChild);
        
      // Add Y-axis label
      const yAxisLabels = ["dB", "Roughness Index", "Sharpness Level", "Frequency (Hz)", "Intensity"];
      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 12)
        .attr('x', -height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#495057')
        .text(yAxisLabels[i]); 
    }
  }, [initializeGraphData, audioLengthSeconds]);

  useEffect(() => {
    createGraphs();
    const handleResize = () => {
      createGraphs();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [createGraphs]); // Added createGraphs as a dependency

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'rgb(223, 223, 223)',
      }}
    />
  );
};

export default GraphVisualization;