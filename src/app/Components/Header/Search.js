import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaSearch, FaTimes } from 'react-icons/fa';
import API_URL from '../../config';

const Search = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  // Fetch AI-powered suggestions
  const fetchSuggestions = useCallback(async (query) => {
    try {
      if (query.trim() === '') {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      setShowSuggestions(true);
      const response = await axios.get(`${API_URL}/api/english/suggestions?query=${query}`);

      if (response.data.success && response.data.suggestions) {
        setSuggestions(response.data.suggestions);
        setError(null);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() !== '') {
        fetchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, fetchSuggestions]);

  // Navigate to article by headline
  const handleSuggestionClick = async (headline) => {
    try {
      // Search for the article with the selected headline
      const response = await axios.get(`${API_URL}/api/english/all?search=${headline}`);
      
      if (response.data.success && response.data.data.length > 0) {
        const article = response.data.data.find(
          (a) => a.headline.toLowerCase() === headline.toLowerCase()
        ) || response.data.data[0];

        if (article._id) {
          // Close search and navigate
          if (onClose) {
            onClose();
          }
          router.push(`/article/${article._id}`);
        }
      }
    } catch (error) {
      console.error('Error navigating to article:', error);
      setError('Could not find article');
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const closeSuggestions = () => {
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center w-full">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search articles by headline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-l py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#7BB761] text-gray-800"
            autoFocus
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              title="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <button 
          onClick={() => fetchSuggestions(searchTerm)} 
          className="bg-[#7BB761] text-white px-6 py-3 rounded-r hover:bg-[#68a04e] transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#7BB761] flex items-center gap-2"
        >
          <FaSearch />
          <span>Search</span>
        </button>
      </div>

      {/* AI Suggestions Dropdown */}
      {showSuggestions && searchTerm && (
        <div className="absolute z-20 mt-2 bg-white border border-gray-300 rounded-lg w-full shadow-xl">
          <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">
              Suggestions {suggestions.length > 0 && `(${suggestions.length})`}:
            </h2>
            <button
              onClick={closeSuggestions}
              className="text-gray-500 hover:text-gray-700 transition duration-150"
              title="Close suggestions"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="overflow-y-auto max-h-80">
            {isSearching ? (
              <div className="p-4 text-center text-gray-500">
                Fetching suggestions...
              </div>
            ) : (
              <>
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="p-3 border-b border-gray-100 hover:bg-blue-50 transition duration-150 cursor-pointer"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <p className="text-[#25609A] hover:text-[#7BB761] font-medium">
                      {suggestion}
                    </p>
                  </div>
                ))}
                
                {suggestions.length === 0 && searchTerm.trim() !== '' && !isSearching && (
                  <div className="p-4 text-center text-gray-500">
                    No suggestions found for "{searchTerm}"
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Search;