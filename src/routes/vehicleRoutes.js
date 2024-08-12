import React, { useState, useEffect } from 'react';

const VehicleList = ({ drivers, vehicles, assignDriver, unassignDriver }) => {
  const [selectedDriver, setSelectedDriver] = useState('');
  const [vehicleState, setVehicleState] = useState(vehicles);

  const API_URL = process.env.REACT_APP_BACKEND_URL_PROD || process.env.REACT_APP_BACKEND_URL_LOCAL;

  // Handle Assign functionality
  const handleAssign = async (vehicleId, driverId) => {
    try {
      const response = await fetch(`${API_URL}/api/vehicles/${vehicleId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ driverId }),
      });

      if (response.ok) {
        const updatedVehicle = await response.json();
        setVehicleState(prevState => 
          prevState.map(vehicle =>
            vehicle._id === updatedVehicle._id ? updatedVehicle : vehicle
          )
        );
        // Update driver availability
        setDriverAvailability(driverId, false);
        setSelectedDriver('');
      } else {
        console.error('Failed to assign driver');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle Unassign functionality
  const handleUnassign = async (vehicleId) => {
    try {
      const response = await fetch(`${API_URL}/api/vehicles/${vehicleId}/unassign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const updatedVehicle = await response.json();
        setVehicleState(prevState => 
          prevState.map(vehicle =>
            vehicle._id === updatedVehicle._id ? updatedVehicle : vehicle
          )
        );
        // Update driver availability
        if (updatedVehicle.assignedDriver) {
          setDriverAvailability(updatedVehicle.assignedDriver._id, true);
        }
        setSelectedDriver('');
      } else {
        console.error('Failed to unassign driver');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Set driver availability
  const setDriverAvailability = (driverId, available) => {
    setVehicleState(prevState => 
      prevState.map(vehicle => ({
        ...vehicle,
        drivers: vehicle.drivers.map(driver =>
          driver._id === driverId ? { ...driver, available } : driver
        )
      }))
    );
  };

  useEffect(() => {
    // Initialize vehicle state on component mount
    setVehicleState(vehicles);
  }, [vehicles]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-darkPurple">Vehicle List</h2>
      <ul className="space-y-4">
        {vehicleState.map((vehicle) => (
          <li key={vehicle._id} className="border p-4 rounded-md">
            <div className="font-medium">
              {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
            </div>
            <div className="mt-2">
              {vehicle.assignedDriver ? (
                <div className="flex items-center justify-between">
                  <span>Assigned to: {vehicle.assignedDriver.name}</span>
                  <button
                    onClick={() => handleUnassign(vehicle._id)}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 disabled:bg-gray-400"
                  >
                    Unassign Driver
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <select
                    value={selectedDriver}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    className="border p-2 rounded"
                  >
                    <option value="">Select Driver</option>
                    {drivers
                      .filter((driver) => driver.available)
                      .map((driver) => (
                        <option key={driver._id} value={driver._id}>
                          {driver.name}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => handleAssign(vehicle._id, selectedDriver)}
                    disabled={!selectedDriver}
                    className={`ml-4 py-1 px-2 rounded ${
                      selectedDriver ? 'bg-darkPurple text-white hover:bg-darkPurple/80' : 'bg-lightPurple text-white'
                    }`}
                  >
                    Assign Driver
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VehicleList;
