"use client";
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Play, Pause, RefreshCw, BarChart2 } from 'lucide-react';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

export default function BNNDropoutLab() {
  const [dropoutRate, setDropoutRate] = useState(0.2);
  const [numPasses, setNumPasses] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animatedPasses, setAnimatedPasses] = useState(1);
  const animationRef = useRef<number>();

  // Underlying function: sin(x) + x/2
  const trueFunction = (x: number) => Math.sin(x * 1.5) + x * 0.5;

  // Generate synthetic training data with a gap to show epistemic uncertainty
  const trainingData = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    let seed = 123;
    const random = () => {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // Cluster 1
    for (let x = -3; x < -1; x += 0.25) {
      points.push({ x, y: trueFunction(x) + (random() - 0.5) * 0.8 });
    }
    // Deep gap in the middle [-1, 1.5]
    // Cluster 2
    for (let x = 1.5; x <= 3; x += 0.25) {
      points.push({ x, y: trueFunction(x) + (random() - 0.5) * 0.8 });
    }
    return points;
  }, []);

  // Generate a basis of functions (simulating a wide neural network layer)
  const bases = useMemo(() => {
    const b = [];
    for (let i = 0; i < 20; i++) {
      b.push({
        weight: (Math.random() - 0.5) * 3,
        bias: (Math.random() - 0.5) * 3,
        phase: Math.random() * Math.PI * 2
      });
    }
    return b;
  }, []);

  // Fit the continuous line range
  const xDomain = Array.from({ length: 150 }, (_, i) => -3.5 + (i * 7) / 149);

  // Generate Monte Carlo forward passes based on dropout rate
  const mcPredictions = useMemo(() => {
    const passes = [];
    for (let m = 0; m < 50; m++) { // Generate up to 50 max for performance
      // For each pass, decide which basis functions survive dropout
      const activeMask = bases.map(() => Math.random() >= dropoutRate);

      const yValues = xDomain.map(x => {
        // Base prediction is trying to mimic true function to some degree
        let pred = trueFunction(x) * 0.8;

        // Add variations from the "network" surviving nodes
        let noiseOffset = 0;
        bases.forEach((basis, idx) => {
          if (activeMask[idx]) {
            // If active, it contributes some structured non-linear noise
            noiseOffset += (Math.sin(x * basis.weight + basis.phase) + basis.bias) * 0.08;
          } else {
            // If dropped, we scale up others by 1/(1-p) practically, but simplified here
            // It creates the variance. Higher dropout = more variance.
            noiseOffset += (Math.cos(x * 1.5) * basis.weight) * 0.15; // Penalty/chaos when missing
          }
        });

        // Scale variance drastically in the "gap" [-1, 1.5] where no data anchors it
        const distToData = Math.min(Math.abs(x - -1), Math.abs(x - 1.5));
        let epistemicMultiplier = 1;
        if (x > -1 && x < 1.5) {
          epistemicMultiplier = 1 + Math.pow(Math.min(distToData * 2, 1.5), 2);
        }
        if (x < -3 || x > 3) {
          epistemicMultiplier = 1 + Math.abs(x - (x < -3 ? -3 : 3)); // out of bounds uncertainty
        }

        return pred + noiseOffset * epistemicMultiplier;
      });
      passes.push(yValues);
    }
    return passes;
  }, [dropoutRate, bases, xDomain]);


  // Calculate Mean and Variance of the active passes
  const stats = useMemo(() => {
    const active = mcPredictions.slice(0, numPasses);
    const mean = [];
    const stdDev = [];

    for (let xi = 0; xi < xDomain.length; xi++) {
      let sum = 0;
      for (let m = 0; m < active.length; m++) {
        sum += active[m][xi];
      }
      const mu = sum / active.length;
      mean.push(mu);

      let varianceSum = 0;
      for (let m = 0; m < active.length; m++) {
        varianceSum += Math.pow(active[m][xi] - mu, 2);
      }
      stdDev.push(Math.sqrt(varianceSum / active.length));
    }
    return { mean, stdDev };
  }, [mcPredictions, numPasses, xDomain]);


  // Animation loop for sequential passes
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setAnimatedPasses(prev => {
          if (prev >= numPasses) {
            setIsPlaying(false);
            return numPasses;
          }
          return prev + 1;
        });
        animationRef.current = setTimeout(animate, 100);
      };
      animate();
    } else {
      clearTimeout(animationRef.current);
    }
    return () => clearTimeout(animationRef.current);
  }, [isPlaying, numPasses]);


  // SVG Coordinate mapping
  const width = 600;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const getX = (val: number) => margin.left + ((val + 3.5) / 7) * innerWidth;
  const getY = (val: number) => margin.top + innerHeight - ((val + 4) / 8) * innerHeight;

  // Generate SVG path strings
  const createPath = (yVals: number[]) => {
    return xDomain.map((x, i) => `${i === 0 ? 'M' : 'L'} ${getX(x)} ${getY(yVals[i])}`).join(' ');
  };

  const truePathStr = createPath(xDomain.map(trueFunction));
  const meanPathStr = createPath(stats.mean);

  // Create upper and lower bounds for 2 StdDev
  const upperPathVals = stats.mean.map((m, i) => m + 2 * stats.stdDev[i]);
  const lowerPathVals = stats.mean.map((m, i) => m - 2 * stats.stdDev[i]);

  const upperPathStr = createPath(upperPathVals);
  const lowerPathStr = createPath(lowerPathVals).replace(/M/g, 'L'); // reverse line for fill
  // Join them to make a continuous polygon
  const confidencePathStr = `${upperPathStr} ${lowerPathStr.split(' ').reverse().join(' ')} Z`;

  // Determine which passes to show based on animation state
  const visiblePasses = isPlaying ? animatedPasses : numPasses;


  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col h-full shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
          <BarChart2 className="text-blue-400" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Monte Carlo Dropout</h2>
          <p className="text-slate-400 text-sm">Visualizing <Latex>{"$p(y^* | x^*, \\mathcal{D})$"}</Latex> Epistemic Uncertainty</p>
        </div>
      </div>

      <div className="flex-1 bg-black rounded-xl border border-slate-800 relative overflow-hidden flex flex-col mb-6">

        {/* Graph Legend */}
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur border border-slate-700 p-3 rounded-lg z-10 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            <span className="text-slate-300">Observed Data <Latex>{"$\\mathcal{D}$"}</Latex></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-emerald-400/30"></div>
            <span className="text-slate-300">MC Pass <Latex>{"$\\theta_i$"}</Latex></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-emerald-400"></div>
            <span className="text-slate-300">Predictive Mean <Latex>{"$\\mu$"}</Latex></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-400/20 border-t border-b border-emerald-400/40"></div>
            <span className="text-slate-300">Uncertainty (±2<Latex>{"$\\sigma$"}</Latex>)</span>
          </div>
        </div>

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
          {/* Grid lines */}
          {[...Array(9)].map((_, i) => (
            <line key={`h-${i}`} x1={margin.left} y1={margin.top + (i * innerHeight) / 8} x2={width - margin.right} y2={margin.top + (i * innerHeight) / 8} className="stroke-slate-800" strokeWidth={1} />
          ))}
          {[...Array(8)].map((_, i) => (
            <line key={`v-${i}`} x1={margin.left + (i * innerWidth) / 7} y1={margin.top} x2={margin.left + (i * innerWidth) / 7} y2={height - margin.bottom} className="stroke-slate-800" strokeWidth={1} />
          ))}

          {/* Epicenter / Data Gap indicator */}
          <rect x={getX(-1)} y={margin.top} width={getX(1.5) - getX(-1)} height={innerHeight} className="fill-blue-900/10" />
          <text x={getX(0.25)} y={margin.top + 20} className="fill-blue-400/50 text-[10px]" textAnchor="middle">Missing Data Region</text>

          {/* Confidence Interval Fill */}
          <path d={confidencePathStr} className="fill-emerald-500/15 transition-all duration-300 ease-out" />

          {/* Individual MC Passes (Faint Lines) */}
          {mcPredictions.slice(0, visiblePasses).map((passVals, idx) => (
            <path key={idx} d={createPath(passVals)} fill="none" className="stroke-emerald-400/20 transition-all duration-300 ease-out" strokeWidth={1} />
          ))}

          {/* True Underlying Function (Hidden/Reference) */}
          <path d={truePathStr} fill="none" className="stroke-white/10 stroke-dasharray-4" strokeWidth={1} />

          {/* Mean Prediction Line */}
          <path d={meanPathStr} fill="none" className="stroke-emerald-400 transition-all duration-300 ease-out" strokeWidth={2} />

          {/* Training Data Scatter Points */}
          {trainingData.map((pt, i) => (
            <circle key={i} cx={getX(pt.x)} cy={getY(pt.y)} r={3} className="fill-slate-300 stroke-slate-900 stroke-[2px]" />
          ))}

          {/* Axes Base */}
          <line x1={margin.left} y1={getY(0)} x2={width - margin.right} y2={getY(0)} className="stroke-slate-600" strokeWidth={1.5} />
          <line x1={getX(0)} y1={margin.top} x2={getX(0)} y2={height - margin.bottom} className="stroke-slate-600" strokeWidth={1.5} />

          <text x={width - 15} y={getY(0) + 15} className="fill-slate-500 text-[10px]">x</text>
          <text x={getX(0) - 15} y={15} className="fill-slate-500 text-[10px]">y</text>
        </svg>
      </div>

      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <div className="grid grid-cols-2 gap-8">

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                Dropout Rate (<Latex>{"$p$"}</Latex>)
              </label>
              <span className="text-blue-400 text-sm font-mono">{dropoutRate.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0" max="0.8" step="0.05"
              value={dropoutRate}
              onChange={(e) => setDropoutRate(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
            <p className="text-xs text-slate-500 leading-tight">
              Higher dropout drops more weights per pass, increasing the variance and overall uncertainty width.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                MC Forward Passes (<Latex>{"$M$"}</Latex>)
              </label>
              <span className="text-emerald-400 text-sm font-mono">{numPasses}</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range" min="1" max="50" step="1"
                value={numPasses}
                onChange={(e) => {
                  setNumPasses(parseInt(e.target.value));
                  if (!isPlaying) setAnimatedPasses(parseInt(e.target.value));
                }}
                className="flex-1 accent-emerald-500"
              />
              <button
                className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors text-white"
                onClick={() => {
                  if (isPlaying) {
                    setIsPlaying(false);
                    setAnimatedPasses(numPasses);
                  } else {
                    setAnimatedPasses(0);
                    setIsPlaying(true);
                  }
                }}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 leading-tight">
              Averaging more passes <Latex>{"$M \\to \\infty$"}</Latex> smooths out the mean <Latex>{"$\\mu$"}</Latex> and stabilizes the true variance estimate.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
