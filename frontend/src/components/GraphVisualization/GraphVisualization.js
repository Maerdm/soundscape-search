// GraphVisualization.js
import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';

const GraphVisualization = () => {
  var soundscape_Playlist = useSelector((state) => state.soundscape_Playlist);
  var current = useSelector((state) => state.currentSoundcape);
  var audioLengthSeconds = current?.duration_s || 0;
  
  const containerRef = useRef(null);
  const svgRefs = useRef([]);
  const [showAlert, setShowAlert] = useState(false);
  const [minMaxValues, setMinMaxValues] = useState({
    loudness: { min: 0, max: 0 },
    sharpness: { min: 0, max: 0 },
    roughness: { min: 0, max: 0 }
  });

  // Calculate the min/max values for all features
  useEffect(() => {
    const calculateMinMaxValues = () => {
      if (!current || !current.file_name) {
        return;
      }
      
      // Get the file name of the soundscape you're looking for
      const targetFileName = current.file_name;
      var index;
      
      // Loop through the playlist to find the matching soundscape
      for (let i = 0; i < Object.keys(soundscape_Playlist).length; i++) {
        if (soundscape_Playlist[i].file_name === targetFileName) {
          index = i;
        }
      }
      
      if (index === undefined) {
        index = 0;
      }

      const nearby = getNearbySoundscapes(index, Object.keys(soundscape_Playlist).length);
      const allIndices = [...nearby, index];
      
      if (allIndices.length === 0 || !soundscape_Playlist[index]?.temporal_audio_features) {
        return;
      }

      var firstSoundscape = soundscape_Playlist[index].temporal_audio_features;

      let minLoudness = Math.min(...firstSoundscape.loudness);
      let maxLoudness = Math.max(...firstSoundscape.loudness);
      let minSharpness = Math.min(...firstSoundscape.sharpness);
      let maxSharpness = Math.max(...firstSoundscape.sharpness);
      let minRoughness = Math.min(...firstSoundscape.roughness);
      let maxRoughness = Math.max(...firstSoundscape.roughness);
      
      for (let i = 0; i < allIndices.length; i++) {
        if (!soundscape_Playlist[allIndices[i]]?.temporal_audio_features) continue;
        
        const features = soundscape_Playlist[allIndices[i]].temporal_audio_features;
              
        minLoudness = Math.min(minLoudness, Math.min(...features.loudness));
        maxLoudness = Math.max(maxLoudness, Math.max(...features.loudness));
        
        minSharpness = Math.min(minSharpness, Math.min(...features.sharpness));
        maxSharpness = Math.max(maxSharpness, Math.max(...features.sharpness));
        
        minRoughness = Math.min(minRoughness, Math.min(...features.roughness));
        maxRoughness = Math.max(maxRoughness, Math.max(...features.roughness));
      }
      
      const newMinMaxValues = {
        loudness: { min: minLoudness, max: Math.ceil(maxLoudness) },
        sharpness: { min: minSharpness, max: Math.ceil(maxSharpness) },
        roughness: { min: minRoughness, max: Math.ceil(maxRoughness) }
      };

      setMinMaxValues(newMinMaxValues);
    };

    calculateMinMaxValues();
  }, [current, soundscape_Playlist]);

  function getNearbySoundscapes(currentIndex, playlistLength) {
    let result = [];
    
    if (currentIndex < 4) {
      for (let i = 0; i <= 8; i++) {
        if (i !== currentIndex && i < playlistLength) {
          result.push(i);
        }
      }
    }
    else if (currentIndex >= playlistLength - 4) {
      for (let i = playlistLength - 9; i < playlistLength; i++) {
        if (i !== currentIndex && i >= 0) {
          result.push(i);
        }
      }
    }
    else {
      for (let i = currentIndex - 4; i <= currentIndex + 4; i++) {
        if (i !== currentIndex && i >= 0 && i < playlistLength) {
          result.push(i);
        }
      }
    }    
    return result.slice(0, 8);
  }

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
    let tickCount = 15;
    if (audioLength < 15) {
      tickCount = Math.ceil(audioLength) + 1; // +1 to include 0
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

  // Function to prepare actual data for visualization
  const prepareGraphData = useCallback(() => {
    if (!current || !current.temporal_audio_features) {
      setShowAlert(true);
      return [[], [], []];
    } else {
      setShowAlert(false);
    }

    const { loudness, sharpness, roughness } = current.temporal_audio_features;
    
    // If any of the data arrays is missing, return empty arrays
    if (!loudness || !sharpness || !roughness) {
      setShowAlert(true);
      return [[], [], []];
    }
    
    console.log("Data points count:", loudness.length);
    
    // Map the data points to time positions based on audio length
    // This ensures that no matter how many points we have, they span exactly from 0 to audioLengthSeconds
    const loudnessData = loudness.map((value, index, array) => ({
      x: (index / (array.length - 1)) * audioLengthSeconds,
      y: value
    }));
    
    const sharpnessData = sharpness.map((value, index, array) => ({
      x: (index / (array.length - 1)) * audioLengthSeconds,
      y: value
    }));
    
    const roughnessData = roughness.map((value, index, array) => ({
      x: (index / (array.length - 1)) * audioLengthSeconds,
      y: value
    }));
    
    return [loudnessData, sharpnessData, roughnessData];
  }, [current, audioLengthSeconds]);

  const createGraphs = useCallback(() => {
    if (!containerRef.current) return;
    
    // Clear any existing SVGs
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }
    
    svgRefs.current = [];

    // Get the actual data
    const graphDataArrays = prepareGraphData();
    
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

    // Create 3 graphs for loudness, sharpness, and roughness
    const graphTitles = ["Loudness", "Sharpness", "Roughness"];
    const yAxisLabels = ["Loudness", "Sharpness Level", "Roughness Index"];
    const featureNames = ["loudness", "sharpness", "roughness"];
    
    for (let i = 0; i < 3; i++) {
      // Skip if no data available
      if (graphDataArrays[i].length === 0) continue;
      
      const currentData = graphDataArrays[i];
      const featureName = featureNames[i];
      
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

      // X scale - based on audio length in seconds
      const x = d3.scaleLinear()
        .domain([0, audioLengthSeconds])
        .range([0, width]);
      
      // Get min and max Y values from minMaxValues
      let yMin = minMaxValues[featureName].min;
      let yMax = minMaxValues[featureName].max;
      
      // Always include zero in the domain to align y=0 with x=0
      yMin = Math.min(0, yMin);
      
      // Use exact max value without adding extra padding
      // Y scale using the precalculated min/max values with zero included
      const y = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([height, 0]);

      // Add X axis with ticks representing the time in seconds
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
          .style('text-anchor', 'middle')); // Center text for horizontal alignment

      // Add X-axis label - determine label based on audio length
      const xAxisLabel = audioLengthSeconds >= 60 ? 'Time (min:sec)' : 'Time (seconds)';
      g.append('text')
        .attr('transform', `translate(${width / 2}, ${height + 35})`) // Increased vertical offset
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#495057')
        .text(xAxisLabel);

      // Calculate appropriate tick values to ensure nice, evenly spaced ticks that include max value
      const tickValues = calculateYAxisTicks(yMin, yMax);

      // Add Y axis with custom ticks
      g.append('g')
        .call(d3.axisLeft(y)
          .tickValues(tickValues)
          .tickFormat(d => Number.isInteger(d) ? d3.format('d')(d) : d3.format('.1f')(d)))
        .call(g => g.select('.domain').attr('stroke', '#adb5bd'))
        .call(g => g.selectAll('.tick line').attr('stroke', '#adb5bd'))
        .call(g => g.selectAll('.tick text').attr('fill', '#495057'));
      
      // Add grid lines
      g.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.1)
        .call(d3.axisLeft(y)
          .tickValues(tickValues)
          .tickSize(-width)
          .tickFormat('')
        );
      
      // Create a line generator with no curve interpolation for completely straight lines
      const line = d3.line()
        .x(d => x(d.x))
        .y(d => y(d.y));
      
      // Define line colors for each graph
      const colors = ["#000", "#000", "#000"];
      
      g.append('path')
        .datum(currentData)
        .attr('fill', 'none')
        .attr('stroke', colors[i])
        .attr('stroke-width', 1)
        .attr('d', line);
      
      // Graph titles
      const graphTitle = document.createElement('div');
      graphTitle.textContent = graphTitles[i];
      graphTitle.style.fontSize = '15px';
      graphTitle.style.padding = '10px 12px';
      graphTitle.style.backgroundColor = 'white';
      graphTitle.style.borderTopLeftRadius = '8px';
      graphTitle.style.borderTopRightRadius = '8px';
      graphTitle.style.textAlign = 'left';
      graphTitle.style.width = 'fit-content';
      graphTitle.style.fontWeight = 'bold';
      graphContainer.insertBefore(graphTitle, graphContainer.firstChild);
        
      // Add Y-axis label
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
  }, [prepareGraphData, audioLengthSeconds, minMaxValues]);

  // Helper function to calculate appropriate y-axis tick values
  function calculateYAxisTicks(min, max) {
    // Always include 0, max, and intermediate values
    const tickCount = 6; // Desired number of ticks
    
    // Create nice round numbers for ticks
    const range = max - min;
    const rawStep = range / (tickCount - 1);
    
    // Round step to a nice number
    let magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    let normalizedStep = rawStep / magnitude;
    
    // Choose a nice step value
    let step;
    if (normalizedStep < 1.5) step = 1 * magnitude;
    else if (normalizedStep < 3) step = 2 * magnitude;
    else if (normalizedStep < 7) step = 5 * magnitude;
    else step = 10 * magnitude;
    
    // Calculate ticks between min and max
    let ticks = [];
    
    // Start from a multiple of step less than or equal to min
    let firstTick = Math.floor(min / step) * step;
    
    // Generate all ticks up to and including max
    for (let tickValue = firstTick; tickValue <= max + step/10; tickValue += step) {
      ticks.push(tickValue);
    }
    
    // Always include max if it's not already in the list
    if (!ticks.includes(max) && max > 0) {
      ticks.push(max);
    }
    
    // Always include 0 if min <= 0 <= max and 0 is not already in the list
    if (min <= 0 && 0 <= max && !ticks.includes(0)) {
      ticks.push(0);
    }
    
    // Sort the ticks numerically
    ticks.sort((a, b) => a - b);
    
    return ticks;
  }

  useEffect(() => {
    createGraphs();
    
    const handleResize = () => {
      createGraphs();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [createGraphs]);

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'rgb(223, 223, 223)',
        position: 'relative'
      }}
    >
      {showAlert && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '1rem',
            borderRadius: '4px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            textAlign: 'center',
            maxWidth: '80%'
          }}
        >
          No audio features data available for this soundscape. Maybe switch dataset?
        </div>
      )}
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      />
    </div>
  );
};

export default GraphVisualization;