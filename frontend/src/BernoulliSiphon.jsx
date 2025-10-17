import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import { useAuth } from './contexts/AuthContext';

export default function BernoulliSiphon() {
  const navigate = useNavigate();
  const { username, jwt, logout } = useAuth();
  const canvasRef = useRef(null);
  
  // State management
  const [showDemo, setShowDemo] = useState(false);
  const [height, setHeight] = useState(2.0); // Height difference in meters
  
  // Physics constants
  const g = 9.81; // gravitational acceleration
  const fluidDensity = 750; // gasoline density kg/m³ (lighter than water)
  
  // Calculate exit velocity using Torricelli's law (derived from Bernoulli)
  const exitVelocity = Math.sqrt(2 * g * height);

  // Canvas drawing function
  const drawSiphon = useCallback((ctx, canvas) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set up coordinate system (origin at bottom left)
    ctx.save();
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    
    // Drawing parameters
    const tankHeight = 100;
    const tankWidth = 90;
    const canHeight = 50;
    const canWidth = 70;
    const tubeWidth = 8;
    
    // Calculate positions based on height difference - with constraints to keep in frame
    const scaleFactor = 35; // Adjusted scale factor for larger canvas
    const heightDiff = Math.min(height * scaleFactor, 240); // Increased limit for larger canvas
    const tankY = heightDiff + canHeight + 50; // Tank elevated
    const canY = 50; // Can on ground level
    
    // Draw ground/base
    ctx.fillStyle = '#374151';
    ctx.fillRect(0, 0, canvas.width, 50);
    
    // Draw elevated tank (like gas tank in car)
    const tankX = 90;
    ctx.fillStyle = '#4B5563';
    ctx.fillRect(tankX, tankY, tankWidth, tankHeight);
    
    // Draw gasoline in tank
    const gasLevel = 0.8; // 80% full
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(tankX + 3, tankY + 3, tankWidth - 6, (tankHeight - 6) * gasLevel);
    
    // Draw gas can on ground
    const canX = 320;
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(canX, canY, canWidth, canHeight);
    
    // Draw can spout
    ctx.fillStyle = '#DC2626';
    ctx.fillRect(canX, canY + canHeight, 15, 8);
    
    // Calculate tube path points - ensuring inlet/outlet positioning
    // Inlet: starts right at the gasoline surface
    const startX = tankX + tankWidth/2; // Center of tank
    const startY = tankY + (tankHeight * gasLevel); // Right at gasoline surface
    
    // Peak of the tube (highest point - critical for siphon) - constrained height
    const peakX = 220;
    const maxPeakHeight = Math.min(tankY + tankHeight + 50, canvas.height - 80); // More room for peak in larger canvas
    const peakY = maxPeakHeight;
    
    // Outlet: ends just at the entrance of the can
    const endX = canX + canWidth/2; // Center of can
    const endY = canY + canHeight; // Just at the top edge of the can
    
    // Draw siphon tube with realistic curve
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = tubeWidth;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    // First curve: tank to peak
    ctx.quadraticCurveTo(peakX - 30, peakY, peakX, peakY);
    // Second curve: peak to can
    ctx.quadraticCurveTo(peakX + 30, peakY - 15, endX, endY);
    ctx.stroke();
    
    // Draw tube inlet starting right at gasoline surface
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = tubeWidth - 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY - 8); // Short extension at surface level
    ctx.stroke();
    
    // Draw tube outlet ending just at can entrance
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = tubeWidth - 2;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX, endY - 8); // Short extension pointing down at entrance
    ctx.stroke();
    
    // Reset coordinate system for text and labels
    ctx.restore();
    
    // Draw height measurement line - from fluid level to outlet
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const fluidLevelY = canvas.height - (tankY + (tankHeight * gasLevel));
    const outletY = canvas.height - endY;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 60, outletY);
    ctx.lineTo(canvas.width - 60, fluidLevelY);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Height label
    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    const midY = (outletY + fluidLevelY) / 2;
    ctx.fillText(`h = ${height.toFixed(1)}m`, canvas.width - 25, midY);
    
    // Component labels
    ctx.fillStyle = '#E5E7EB';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    
    // Tank label
    ctx.fillText('Gas Tank', tankX + tankWidth/2, canvas.height - tankY - tankHeight - 10);
    
    // Can label
    ctx.fillText('Gas Can', canX + canWidth/2, canvas.height - canY - canHeight - 10);
    
    // Tube peak label (only if peak is visible)
    if (peakY < canvas.height - 50) {
      ctx.fillText('Tube Peak', peakX, canvas.height - peakY - 10);
    }
    
    // Atmospheric pressure indicators
    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 10px Arial';
    
    // At tank surface (atmospheric pressure)
    ctx.fillText('1 atm', tankX + tankWidth/2, canvas.height - tankY - tankHeight - 25);
    
    // At tube peak (below atmospheric pressure - this creates the siphon effect!)
    if (peakY < canvas.height - 70) {
      ctx.fillStyle = '#FF6B6B'; // Red color to show lower pressure
      ctx.fillText('< 1 atm', peakX, canvas.height - peakY + 25);
      ctx.fillStyle = '#FBBF24'; // Reset color
    }
    
    // At outlet (atmospheric pressure again)
    ctx.fillText('1 atm', endX, canvas.height - canY - canHeight - 25);
    
    // Physics information
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Exit Velocity: ${exitVelocity.toFixed(2)} m/s`, 15, 30);
    
    // Driving pressure (from fluid surface to tube peak)
    const tubeHeight = (peakY - (tankY + (tankHeight * gasLevel))) / scaleFactor; // Height from fluid to peak in meters
    const drivingPressure = fluidDensity * g * Math.abs(tubeHeight) / 1000; // kPa
    ctx.fillText(`Driving Pressure: ${drivingPressure.toFixed(1)} kPa`, 15, 50);
    
    // Flow rate (theoretical)
    const tubeArea = Math.PI * Math.pow(tubeWidth/2000, 2); // Convert to m²
    const flowRate = exitVelocity * tubeArea * 1000; // L/s
    ctx.fillText(`Flow Rate: ${flowRate.toFixed(3)} L/s`, 15, 70);
  }, [height, exitVelocity, g, fluidDensity]);
  
  // Animation loop - now just draws static diagram
  useEffect(() => {
    if (showDemo && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      drawSiphon(ctx, canvas);
    }
  }, [showDemo, drawSiphon]);
  
  // Handle height change
  const handleHeightChange = (e) => {
    setHeight(parseFloat(e.target.value));
  };

  // Navigation function for header - same pattern as MessagingApp
  const scrollToSection = (sectionId) => {
    // Navigate to landing page with section to scroll to
    navigate('/', { state: { scrollTo: sectionId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-gray-900 text-white font-sans">
      <Header 
        username={username}
        jwt={jwt}
        onLogout={logout}
        onNavigate={scrollToSection}
        onGoHome={() => navigate('/')}
        onLogin={() => navigate('/login')}
      />
      
      <div className="pt-20 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-cyan-300">
            Bernoulli's Principle & Siphon Physics
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Interactive demonstration of fluid mechanics in action
          </p>
        </div>
        
        {!showDemo ? (
          /* Theory Section */
          <div className="space-y-4">
            {/* Bernoulli's Equation */}
            <div className="bg-white/10 rounded-xl p-8 border border-cyan-700">
              <h2 className="text-3xl font-bold mb-6 text-cyan-300">Bernoulli's Equation</h2>
              <div className="text-center mb-6">
                <div className="text-2xl font-mono bg-gray-800 p-4 rounded-lg inline-block">
                  P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-300">Pressure Energy</h3>
                  <p className="text-gray-300">P - Static pressure in the fluid</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-green-300">Kinetic Energy</h3>
                  <p className="text-gray-300">½ρv² - Energy due to fluid motion</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-purple-300">Potential Energy</h3>
                  <p className="text-gray-300">ρgh - Energy due to elevation</p>
                </div>
              </div>
            </div>
            
            {/* How Siphons Work */}
            <div className="bg-white/10 rounded-xl p-8 border border-cyan-700">
              <h2 className="text-3xl font-bold mb-6 text-cyan-300">How Siphons Work</h2>
              <div className="space-y-4 text-lg text-gray-200">
                <p>
                  <strong className="text-cyan-300">1. Atmospheric Pressure:</strong> Air pressure pushes down on the water surface in the upper tank.
                </p>
                <p>
                  <strong className="text-cyan-300">2. Pressure Difference:</strong> The vertical height difference creates a pressure gradient.
                </p>
                <p>
                  <strong className="text-cyan-300">3. Continuous Flow:</strong> Once started, the flow continues due to the pressure difference.
                </p>
                <p>
                  <strong className="text-cyan-300">4. Exit Velocity:</strong> Torricelli's Law gives us: <span className="font-mono bg-gray-800 px-2 py-1 rounded">v = √(2gh)</span>
                </p>
              </div>
            </div>
            
            {/* Continuity Equation */}
            <div className="bg-white/10 rounded-xl p-8 border border-cyan-700">
              <h2 className="text-3xl font-bold mb-6 text-cyan-300">Continuity Equation</h2>
              <div className="text-center mb-4">
                <div className="text-2xl font-mono bg-gray-800 p-4 rounded-lg inline-block">
                  A₁v₁ = A₂v₂
                </div>
              </div>
              <p className="text-lg text-gray-200 text-center">
                For incompressible flow, the mass flow rate remains constant throughout the tube.
              </p>
            </div>
            
            {/* Demo Button */}
            <div className="text-center">
              <button
                onClick={() => setShowDemo(true)}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-xl font-bold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105"
              >
                🌊 Demo Principle
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Demo Section */
          <div className="space-y-6">
            {/* Controls */}
            <div className="bg-white/10 rounded-xl p-6 border border-cyan-700">
              <h2 className="text-2xl font-bold mb-4 text-cyan-300">Interactive Controls</h2>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-3">
                  <label className="text-lg font-semibold">Height (m):</label>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={height}
                    onChange={handleHeightChange}
                    className="w-32"
                  />
                  <span className="text-cyan-300 font-mono">{height.toFixed(1)}m</span>
                </div>
                
                <button
                  onClick={() => setShowDemo(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300"
                >
                  📚 Back to Theory
                </button>
              </div>
            </div>
            
            {/* Canvas Simulation */}
            <div className="bg-white/5 rounded-xl p-6 border border-cyan-700">
              <div className="grid lg:grid-cols-2 gap-6 items-start">
                {/* Reference Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-300">Real-World Siphon Problem</h3>
                  <div className="bg-white p-4 rounded-lg">
                    <img 
                      src="/siphon.jpg" 
                      alt="Gasoline Siphon Reference" 
                      className="w-full h-auto rounded"
                    />
                  </div>
                  <p className="text-sm text-gray-300">
                    <strong>Key Physics:</strong> The tube must go above the gas tank level to create the pressure difference. 
                    Atmospheric pressure at point (1) pushes fluid up, while gravity pulls it down from the peak to point (2).
                  </p>
                </div>
                
                {/* Interactive Simulation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-300">Simplified Diagram</h3>
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={500}
                    className="w-full border border-gray-600 rounded-lg bg-gray-900"
                  />
                  <p className="text-sm text-gray-300">
                    <strong>Adjust height:</strong> See how exit velocity changes with the height difference between tank and can.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}