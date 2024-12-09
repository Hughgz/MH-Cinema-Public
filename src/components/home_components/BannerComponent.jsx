import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export function CarouselDefault({ page }) {
  let carouselImages = [];

  // Set các ảnh cho carousel tùy thuộc vào trang
  if (page === 'home') {
    carouselImages = [
      'https://th.bing.com/th/id/R.373661b6e77f18e8ea825df3d40041c6?rik=7qnWnkN3mKl8pA&pid=ImgRaw&r=0',
      'https://th.bing.com/th/id/R.e617f3ede1132689fac808dbd5211243?rik=NYd6%2bO%2fnGlM4ZQ&riu=http%3a%2f%2fimages6.fanpop.com%2fimage%2fphotos%2f44300000%2fDoctor-Strange-in-the-Multiverse-of-Madness-banner-doctor-strange-2016-44369986-2048-948.jpg&ehk=57D2xaT4A9v3UZ9qRfJ3e1ehdWQiG%2bT3Jaltwtwt0VU%3d&risl=&pid=ImgRaw&r=0',
      'https://wallpapers.com/images/hd/winter-soldier-movie-captain-america-laptop-4jo2jdp2tuw74shw.jpg',
      'https://sportshub.cbsistatic.com/i/2022/08/22/466e5e6b-1600-4b7a-a687-6b18e07bed1b/spider-man-no-way-home-rerelease.jpg?width=1200'
    ];
  }

  if (page === 'theater') {
    carouselImages = [
      'https://cdn.galaxycine.vn/media/2024/8/8/lam-giau-voi-ma-2048_1723108931285.jpg',
      'https://cdn.galaxycine.vn/media/2024/8/16/ma-da-2048_1723799769236.jpg',
      'https://cdn.galaxycine.vn/media/2024/8/12/harold-2048_1723454887262.jpg',
      'https://cdn.galaxycine.vn/media/2024/7/31/shopee-x-glx-thang-8-1_1722438044809.jpg'
    ];
  }
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 mx-2"
          >
            <img
              src={image}
              alt={`carousel image ${index + 1}`}
              className="w-full h-[400px] object-contain rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

CarouselDefault.propTypes = {
  page: PropTypes.string.isRequired,
};
