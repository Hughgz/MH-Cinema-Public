

const MovieContent = ({ movieModel }) => {
    return (
        <div className="movie__content mt-3 lg:mt-0">
            <span className="border-l-4 border-solid border-blue-10 mr-2"></span>
            <h1 className="mb-4 text-base inline-block capitalize font-bold">
                Nội dung phim
            </h1>
            <div className="block__wysiwyg text-black-10 text-sm font-normal not-italic content-text content__data__full">
                <p>
                    <span className="text-base">{movieModel.longDescription}</span>
                </p>
                <br></br>
                <p>
                    <span className="text-base">
                        <a href="https://www.galaxycine.vn/phim-dang-chieu">
                            Phim mới
                        </a>
                        <strong> {movieModel.name}</strong> dự kiến ra mắt tại các{" "}
                        <em>
                            <a href="https://www.galaxycine.vn/">rạp chiếu phim</a>
                        </em>{" "}
                        toàn quốc từ {`${movieModel.releaseDate[0]} - ${String(movieModel.releaseDate[1]).padStart(2, '0')} - ${String(movieModel.releaseDate[2]).padStart(2, '0')}`}
                        .
                    </span>
                </p>
                <p>&nbsp;</p>
            </div>
        </div>
    );
};


export default MovieContent;