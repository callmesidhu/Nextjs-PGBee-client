import { useFilters } from "@/contexts/FilterContext";
import { useState, useMemo } from "react";

const FiltersSidebar = () => {
  const { filters, updateFilter } = useFilters();
  const [amenitiesSearch, setAmenitiesSearch] = useState("");

  // Complete list of amenities
  const allAmenities = [
    'Free Wifi', 'Washing Machine', 'Open Terrace','Mess Available','Electricity Bill Included','Water Bill Included','Kitchen', 
    'Balcony', 'Walking Distance', 'Cleaning Service', 
    'Water Purifier', 'Furnished', 'AC','Parking'
  ];

  // Filter amenities based on search
  const filteredAmenities = useMemo(() => {
    if (!amenitiesSearch.trim()) return allAmenities;
    return allAmenities.filter(amenity => 
      amenity.toLowerCase().includes(amenitiesSearch.toLowerCase())
    );
  }, [amenitiesSearch]);

  return (
    <aside className="w-full p-4 bg-white border border-gray-200 rounded-lg h-fit">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Filters</h2>

      <div className="space-y-4">
        {/* Hostel Type Filter */}
        <div>
          <h3 className="font-medium mb-3 text-gray-900">Hostel Type</h3>
          <div className="flex flex-wrap gap-2">
            {['Any', 'Boys', 'Girls'].map(gender => (
              <button 
                key={gender} 
                onClick={() => updateFilter('gender', gender)}
                className={`px-3 py-1.5 text-sm border rounded-md transition-colors ${
                  filters.gender === gender 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {gender === 'Boys' ? 'Boys' : gender === 'Girls' ? 'Girls' : 'Any'}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4"></div>

        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-3 text-gray-900">Price</h3>
          <div className="mb-3">
            <input
              type="range"
              min="1000"
              max="15000"
              value={filters.maxPrice}
              onChange={(e) => updateFilter('maxPrice', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>₹{Number(filters.minPrice).toLocaleString()}</span>
              <span>₹{Number(filters.maxPrice).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4"></div>

        {/* Type of Place */}
        <div>
          <h3 className="font-medium mb-3 text-gray-900">Type of Place</h3>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => updateFilter('placeType', 'Hostel')}
              className={`p-3 text-center border rounded-md transition-colors ${
                filters.placeType === 'Hostel' 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <p className="font-medium text-sm">Hostel</p>
              <p className="text-xs text-gray-500 mt-1">₹3,000 avg.</p>
            </button>
            <button 
              onClick={() => updateFilter('placeType', 'PG')}
              className={`p-3 text-center border rounded-md transition-colors ${
                filters.placeType === 'PG' 
                  ? 'bg-blue-50 text-blue-700 border-blue-200' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <p className="font-medium text-sm">PG</p>
              <p className="text-xs text-gray-500 mt-1">₹5,000 avg.</p>
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4"></div>

        {/* Rooms & Bathrooms */}
        {['Rooms', 'Bathrooms'].map(type => {
            const filterKey = type.toLowerCase();
            const currentValue = filters[filterKey];
            return (
                <div key={type}>
                    <h3 className="font-medium mb-3 text-gray-900">{type}</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {['Any', '1', '2', '3', '4', '5+'].map(num => (
                            <button 
                                key={num} 
                                onClick={() => updateFilter(filterKey, num)}
                                className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                                  currentValue === num 
                                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 pt-4 mt-4"></div>
                </div>
            )
        })}

        {/* Amenities */}
        <div>
          <h3 className="font-medium mb-3 text-gray-900">Amenities</h3>
          
          {/* Search Bar */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search amenities..."
              value={amenitiesSearch}
              onChange={(e) => setAmenitiesSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Amenities Grid */}
          <div className="grid grid-cols-2 gap-2 mb-3 max-h-60 overflow-y-auto">
            {filteredAmenities.map(amenity => {
              const isSelected = filters.selectedAmenities.includes(amenity);
              return (
                <button 
                  key={amenity} 
                  onClick={() => {
                    const newAmenities = isSelected 
                      ? filters.selectedAmenities.filter(a => a !== amenity)
                      : [...filters.selectedAmenities, amenity];
                    updateFilter('selectedAmenities', newAmenities);
                  }}
                  className={`px-3 py-2 text-sm border rounded-md transition-colors text-left ${
                    isSelected 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {amenity}
                </button>
              );
            })}
          </div>

          {/* Show message if no amenities found */}
          {filteredAmenities.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No amenities found matching "{amenitiesSearch}"
            </p>
          )}

          {/* Selected count */}
          {filters.selectedAmenities.length > 0 && (
            <p className="text-xs text-blue-600 mt-2">
              {filters.selectedAmenities.length} amenity(ies) selected
            </p>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4"></div>

        {/* Additional Filters */}
        <div className="space-y-4">
            <div>
                <h3 className="font-medium mb-3 text-gray-900">Curfew</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['Any', 'Yes', 'No'].map(option => (
                    <button 
                      key={option} 
                      onClick={() => updateFilter('curfew', option)}
                      className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                        filters.curfew === option 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
            </div>
            
            <div>
                <h3 className="font-medium mb-3 text-gray-900">Room Type</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['Any', 'Single', 'Shared'].map(option => (
                    <button 
                      key={option} 
                      onClick={() => updateFilter('roomType', option)}
                      className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                        filters.roomType === option 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
            </div>
            
            <div>
                <h3 className="font-medium mb-3 text-gray-900">Bathroom</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Any', 'Attached', 'Shared'].map(option => (
                    <button 
                      key={option} 
                      onClick={() => updateFilter('bathroomAttachment', option === 'Shared' ? 'Not Attached' : option)}
                      className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                        (filters.bathroomAttachment === option || 
                         (option === 'Shared' && filters.bathroomAttachment === 'Not Attached')) 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
            </div>
            
            <div>
                <h3 className="font-medium mb-3 text-gray-900">Caution Deposit</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['Any', 'Yes', 'No'].map(option => (
                    <button 
                      key={option} 
                      onClick={() => updateFilter('cautionDeposit', option)}
                      className={`px-3 py-2 text-sm border rounded-md transition-colors ${
                        filters.cautionDeposit === option 
                          ? 'bg-blue-50 text-blue-700 border-blue-200' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;