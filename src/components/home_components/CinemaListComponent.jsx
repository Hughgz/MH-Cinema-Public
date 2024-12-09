import MovieCardItem from '../common_components/comom_item/MovieCardItem.jsx';
import { useSelector } from 'react-redux';

const CinemaListComponent = () => {
  const tabValue = useSelector((state) => state.home.tabValue);
  const recentMovieList = useSelector((state) => state.home.recentMovieList);
  const upcommingMovieList = useSelector((state) => state.home.upcommingMovieList);

  // Lọc danh sách phim tùy thuộc vào tab
  const selectedList = tabValue === 1 ? upcommingMovieList : recentMovieList;

  return (
    <div className="pt-5 flex justify-center items-center">
      {selectedList.length === 0 ? (
        <p>No movies available.</p>  // Hiển thị thông báo nếu không có phim
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-x-10 gap-y-6 mb-10">
          {selectedList.map(({ id, name, trailerURL, smallImgMovie, movieUrl, rated }) => {
            return (
              <MovieCardItem
                key={id}
                title={name}
                imageUrl={smallImgMovie}
                href={movieUrl}
                trailer={trailerURL}
                rated={rated}
                widthCard="250px"
                heightCard="400px"
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CinemaListComponent;
