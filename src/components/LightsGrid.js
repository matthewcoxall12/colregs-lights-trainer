import React, { useState, useEffect } from 'react';
// Firebase imports temporarily removed
// import { savePresetToFirebase, getPresetById, getPublicPresets } from '../services/firebaseService';

// Presets stored in local storage only

const LightsGrid = () => {
  // Grid state
  const [gridLights, setGridLights] = useState([]);
  const [selectedColor, setSelectedColor] = useState('red');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showPreset, setShowPreset] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePresetTab, setActivePresetTab] = useState('teacher');
  const [isDayMode, setIsDayMode] = useState(false);
  const [customPresets, setCustomPresets] = useState({});
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  // Temporarily removed Firebase-related state
  // const [publicPresets, setPublicPresets] = useState({});
  // const [isLoading, setIsLoading] = useState(false);
  // const [shareableLink, setShareableLink] = useState('');
  // const [isShared, setIsShared] = useState(false);
  
  // Local storage key for custom presets
  const CUSTOM_PRESETS_STORAGE_KEY = 'colregs-custom-presets';
  
  // Load custom presets from local storage and check for shared preset
  useEffect(() => {
    const savedPresets = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    if (savedPresets) {
      setCustomPresets(JSON.parse(savedPresets));
    }
    
    // Check URL for shared preset ID
    const params = new URLSearchParams(window.location.search);
    const sharedPresetId = params.get('preset');
    
    if (sharedPresetId) {
      loadSharedPreset(sharedPresetId);
    }
    
    // Load public presets if in student mode
    if (activePresetTab === 'student') {
      loadPublicPresets();
    }
  }, []);
  
  // Load public presets when switching to student mode
  useEffect(() => {
    if (activePresetTab === 'student') {
      loadPublicPresets();
    }
  }, [activePresetTab]);
  
  // Initialize grid lights
  useEffect(() => {
    const initialGridLights = [];
    // Create a 12x8 grid (0-11 x 0-7)
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 12; x++) {
        const id = y * 12 + x;
        initialGridLights.push({
          id,
          active: false,
          color: 'white',
          x,
          y
        });
      }
    }
    setGridLights(initialGridLights);
  }, []);

  // Handle light click
  const handleLightClick = (lightId) => {
    setGridLights(prevLights =>
      prevLights.map(light => {
        if (light.id === lightId) {
          // Toggle active state or change color if already active
          return {
            ...light,
            active: !light.active || light.color !== selectedColor,
            color: selectedColor
          };
        }
        return light;
      })
    );
  };

  // Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Reset grid
  const handleReset = () => {
    setGridLights(prevLights =>
      prevLights.map(light => ({
        ...light,
        active: false
      }))
    );
  };

  // Save current pattern as a custom preset (local storage only)
  const saveCustomPreset = () => {
    if (!presetName.trim()) {
      alert('Please enter a name for your preset');
      return;
    }

    // Gather active lights from the current grid
    const activeLights = gridLights.filter(light => light.active);
    
    if (activeLights.length === 0) {
      alert('Please add at least one light to your pattern before saving');
      return;
    }

    // Create a new preset object
    const presetId = `custom_${Date.now()}`;
    const newPreset = {
      id: presetId,
      name: presetName,
      description: presetDescription || 'Custom pattern',
      category: 'custom',
      lights: activeLights.map(light => ({
        id: light.id,
        color: light.color
      }))
    };

    // Add to custom presets
    const updatedPresets = {
      ...customPresets,
      [presetId]: newPreset
    };

    // Update state and save to local storage
    setCustomPresets(updatedPresets);
    localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
    
    // Show confirmation for local saving only
    alert('Preset saved successfully!');

    // Reset form fields
    setPresetName('');
    setPresetDescription('');
  };

  // Delete a custom preset
  const deleteCustomPreset = (presetId, e) => {
    // Prevent click from propagating to parent elements
    if (e) e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this preset?')) {
      const updatedPresets = { ...customPresets };
      delete updatedPresets[presetId];

      // Update state and save to local storage
      setCustomPresets(updatedPresets);
      localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));

      // If the deleted preset was selected, clear selection
      if (selectedPreset && selectedPreset.id === presetId) {
        setSelectedPreset(null);
        setShowPreset(false);
      }
    }
  };

  // Select a preset for comparison (local storage only)
  const selectPresetForComparison = (presetId) => {
    // Check if preset is in local storage
    if (customPresets[presetId]) {
      setSelectedPreset(customPresets[presetId]);
      setShowPreset(true);
      return;
    }
  };

  // Apply a preset pattern to the grid
  const applyPreset = (presetId) => {
    const preset = customPresets[presetId];
    if (!preset) return;
    
    // Reset all lights first
    const resetLights = gridLights.map(light => ({
      ...light,
      active: false
    }));
    
    // Apply the preset lights
    const updatedLights = resetLights.map(light => {
      const presetLight = preset.lights.find(pl => pl.id === light.id);
      if (presetLight) {
        return {
          ...light,
          active: true,
          color: presetLight.color
        };
      }
      return light;
    });
    
    setGridLights(updatedLights);
  };

  // Toggle the reveal of the preset pattern
  const toggleRevealPreset = () => {
    if (!selectedPreset) return;
    setShowPreset(!showPreset);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Toggle day/night mode
  const toggleDayNightMode = () => {
    setIsDayMode(!isDayMode);
  };

  return (
    <div className={`lights-grid-container ${isDayMode ? 'day-mode' : 'night-mode'}`}>
      
      <div className="main-container">
        {/* Top controls section - Teacher/Student mode tabs */}
        <div className="controls-bar">
          <div className="controls-header">
            <h3>Pattern Controls</h3>
          </div>
          
          <div className="preset-tabs">
            <button 
              className={`preset-tab ${activePresetTab === 'teacher' ? 'active' : ''}`}
              onClick={() => setActivePresetTab('teacher')}
            >
              Teacher Mode
            </button>
            <button 
              className={`preset-tab ${activePresetTab === 'student' ? 'active' : ''}`}
              onClick={() => setActivePresetTab('student')}
            >
              Student Mode
            </button>
          </div>
          
          {/* Create form only shown in teacher mode */}
          {activePresetTab === 'teacher' && (
            <div className="preset-form">
              <div className="form-group">
                <label>Preset Name:</label>
                <input 
                  type="text" 
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Enter preset name"
                  className="preset-input"
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea 
                  value={presetDescription}
                  onChange={(e) => setPresetDescription(e.target.value)}
                  placeholder="Enter description (optional)"
                  className="preset-textarea"
                />
              </div>
              
              <button 
                className="save-preset-button"
                onClick={saveCustomPreset}
              >
                Save Current Pattern
              </button>
            </div>
          )}
        </div>
        
        {/* Main content area with grids */}
        <div className="grids-container">
          <div className="grids-wrapper">
            {/* Left side - User's Pattern Grid */}
            <div className="grid-side">
              <h3>Your Pattern</h3>
              <div className="lights-grid-wrapper">
                <div className="grid-container">
                  {Array.from({ length: 8 }, (_, row) => (
                    <div key={`row-${row}`} className="lights-grid-row">
                      {Array.from({ length: 12 }, (_, col) => {
                        const lightId = row * 12 + col;
                        const light = gridLights.find(l => l.id === lightId);
                        return (
                          <div
                            key={lightId}
                            className={`grid-light identical-size ${light && light.active ? 'active ' + light.color : ''}`}
                            onClick={() => handleLightClick(lightId)}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Light Color Controls */}
              <div className="grid-controls">
                <div className="color-controls">
                  <div 
                    className={`color-button red ${selectedColor === 'red' ? 'selected' : ''}`}
                    onClick={() => handleColorSelect('red')}
                    title="Red Light"
                  />
                  <div 
                    className={`color-button green ${selectedColor === 'green' ? 'selected' : ''}`}
                    onClick={() => handleColorSelect('green')}
                    title="Green Light"
                  />
                  <div 
                    className={`color-button white ${selectedColor === 'white' ? 'selected' : ''}`}
                    onClick={() => handleColorSelect('white')}
                    title="White Light"
                  />
                  <div 
                    className={`color-button yellow ${selectedColor === 'yellow' ? 'selected' : ''}`}
                    onClick={() => handleColorSelect('yellow')}
                    title="Yellow Light"
                  />
                  <div 
                    className={`color-button flashing-yellow ${selectedColor === 'flashing-yellow' ? 'selected' : ''}`}
                    onClick={() => handleColorSelect('flashing-yellow')}
                    title="Flashing Yellow Light"
                  />
                  <div 
                    className={`color-button blue ${selectedColor === 'blue' ? 'selected' : ''}`}
                    onClick={() => handleColorSelect('blue')}
                    title="Blue Light"
                  />
                </div>
                
                <div className="grid-action-controls">
                  <button 
                    className="grid-action-button"
                    onClick={handleReset}
                  >
                    Reset Grid
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right side - Preset Pattern Grid */}
            <div className="grid-side">
              <h3>Preset Pattern</h3>
              <div className="lights-grid-wrapper">
                <div className="grid-container">
                  {Array.from({ length: 8 }, (_, row) => (
                    <div key={`preset-row-${row}`} className="lights-grid-row">
                      {Array.from({ length: 12 }, (_, col) => {
                        const lightId = row * 12 + col;
                        const isActive = selectedPreset && showPreset && 
                                        selectedPreset.lights.some(l => l.id === lightId);
                        const color = isActive 
                          ? selectedPreset.lights.find(l => l.id === lightId).color 
                          : '';
                        return (
                          <div
                            key={`preset-${lightId}`}
                            className={`grid-light identical-size ${isActive ? 'active ' + color : ''}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedPreset && (
                <div className="preset-info">
                  <h4>{selectedPreset.name}</h4>
                  <p className="preset-description">{selectedPreset.description}</p>
                </div>
              )}
              
              <div className="preset-controls">
                <button 
                  className="reveal-button"
                  onClick={toggleRevealPreset}
                  disabled={!selectedPreset}
                >
                  {showPreset ? 'Hide Pattern' : 'Reveal Pattern'}
                </button>
                <button 
                  className="apply-button"
                  onClick={() => selectedPreset && applyPreset(selectedPreset.id)}
                  disabled={!selectedPreset}
                >
                  Apply to Your Grid
                </button>
                <button 
                  className="clear-preset-button"
                  onClick={() => {
                    setSelectedPreset(null);
                    setShowPreset(false);
                  }}
                  disabled={!selectedPreset}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Horizontal Preset Carousel at the bottom */}
        <div className="preset-carousel-container">
          <h3 className="carousel-title">{activePresetTab === 'teacher' ? 'Manage Saved Presets' : 'Available Presets'}</h3>
          
          <div className="preset-carousel">
            {Object.keys(customPresets).length === 0 ? (
              <p className="no-presets">
                {activePresetTab === 'teacher' 
                  ? 'No presets saved yet. Create your first preset!' 
                  : 'No presets available. Ask your teacher to create some presets.'}
              </p>
            ) : (
              <div className="preset-items-scroll">
                {Object.keys(customPresets).map(presetId => (
                  <div 
                    key={presetId} 
                    className={`preset-carousel-item ${selectedPreset && selectedPreset.id === presetId ? 'selected' : ''}`}
                    onClick={() => selectPresetForComparison(presetId)}
                  >
                    <div className="preset-info">
                      <h5>{customPresets[presetId].name}</h5>
                      <p>{customPresets[presetId].description}</p>
                    </div>
                    <div className="preset-actions">
                      {activePresetTab === 'teacher' && (
                        <button 
                          onClick={(e) => deleteCustomPreset(presetId, e)}
                          className="delete-preset-button"
                          title="Delete preset"
                        >
                          Delete
                        </button>
                      )}
                      {activePresetTab === 'student' && (
                        <button 
                          className="select-preset-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectPresetForComparison(presetId);
                          }}
                          title={customPresets[presetId].description}
                        >
                          Select
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightsGrid;
