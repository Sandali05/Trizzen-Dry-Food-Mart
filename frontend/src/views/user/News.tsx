import React, { useEffect, useState } from 'react';

interface NewsfeedItem {
  _id: string;
  description: string;
  discount: number;
  itemId: string;
  createdAt: string;
  updatedAt: string;
  image: string;
}

const News: React.FC = () => {
  const [newsfeeds, setNewsfeeds] = useState<NewsfeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string[]>([]);

  // Set target dates for countdown (excluding the first post)
  const targetDates = [
    null, // No countdown for the first post
    new Date('2024-10-12T00:00:00'), // Second post countdown (48-hour)
    new Date('2024-10-09T16:00:00'), // Third post countdown (2-hour)
  ];

  useEffect(() => {
    const fetchNewsfeeds = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/newsfeeds');
        const data = await response.json();
        setNewsfeeds(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching newsfeeds');
        setLoading(false);
      }
    };
    fetchNewsfeeds();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTimes = targetDates.map((targetDate) => {
        if (!targetDate) return ''; // No countdown for the first post

        const now = new Date().getTime();
        const timeDiff = targetDate.getTime() - now;

        if (timeDiff <= 0) return '00:00:00';

        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      });

      setTimeRemaining(updatedTimes);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRedirect = (index: number) => {
    const paths = [
      'http://localhost:5173/', // 1st post
      '', // 2nd post
      'http://localhost:5173/', // 3rd post
      'http://localhost:5173/item/67042cf9994810fbc9611170', // 4th post
      'http://localhost:5173/item/67042dbd994810fbc9611184', // 5th post
      'http://localhost:5173/item/67042eac994810fbc9611192', // 6th post
    ];
    
    if (paths[index]) {
      window.location.href = paths[index];
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 max-w-screen-xl mx-auto my-20">
      {newsfeeds.length > 0 ? (
        newsfeeds.map((newsfeed, index) => (
          <div 
            key={newsfeed._id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 duration-300 flex flex-col items-center justify-center cursor-pointer"
            style={{ padding: '24px', minHeight: '420px', minWidth: '350px' }}
            onClick={() => handleRedirect(index)} // Handle click for redirect
          >
            <div className="w-full flex justify-center">
              <img 
                src={`/images/${newsfeed.image}`} 
                alt={newsfeed.description} 
                className="w-full h-auto object-contain"
                style={{ maxHeight: '250px' }} 
              />
            </div>
            
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{newsfeed.description}</h3>
              
              {/* Only display discount for posts other than the second post */}
              {index !== 1 && (
                <p className="text-black text-3xl font-bold mb-4">
                  Discount: <span className="font-bold text-green-600">{newsfeed.discount}%</span>
                </p>
              )}
              
              {/* Display the start date for the first newsfeed item */}
              {index === 0 && (
                <p className="mt-4 text-2xl font-bold text-black">
                  Start Date: <span className="font-bold">{new Date('2024-10-10').toLocaleDateString()}</span>
                </p>
              )}

              {/* Display countdown for the second newsfeed item */}
              {index === 1 && timeRemaining[index] && (
                <p className="mt-4 text-2xl font-bold text-black">
                  Up coming: {timeRemaining[index]}
                </p>
              )}

              {/* Display countdown for the third newsfeed item with red color */}
              {index === 2 && timeRemaining[index] && (
                <p className="mt-4 text-2xl font-bold text-red-500">
                  End in: {timeRemaining[index]}
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500 col-span-full">No newsfeeds available</div>
      )}
    </div>
  );
};

export default News;
