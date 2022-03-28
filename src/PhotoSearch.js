import axios from 'axios';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react';

async function getPhotos(q = '') {
  const res = await axios.get('https://pixabay.com/api',
    {
      params: {
        q,
        min_width: 200,
        min_height: 200,
        safesearch: true,
        image_type: 'photo',
        key: process.env.REACT_APP_PIXABAY_KEY,
    }
  });
  return res.data.hits;
}

function PhotoSearch() {
  const [search, setSearch] = useState('');
  const [photos, setPhotos] = useState([]);
  const debounceSetSearch = useCallback(debounce(setSearch, 300), []);

  useEffect(async () => {
    try {
      const _photos = await getPhotos(search);
      setPhotos(_photos);
    } catch (err) {
      console.error(err);
    }
  }, [search]);

  return (
    <div className="p-4 flex-col justify-center">
      <input
        type="text"
        placeholder="Search ..."
        onChange={(e) => debounceSetSearch(e.target.value)}
        className="mb-4 form-control relative flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-200 focus:outline-none"
      />
      <div className="grid cursor-pointer grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center items-center">
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.webformatURL}
            onClick={() => window.open(photo.largeImageURL, '_blank')}
            className="rounded-md object-cover shadow transition ease-in-out hover:scale-105 duration-200"
          />
        ))}
      </div>
    </div>
  );
}

export default PhotoSearch;
