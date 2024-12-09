const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="container px-6 pb-6 pt-6 mx-auto">
        <hr className="mb-6 mt-3 border-gray-200 md:my-10 dark:border-gray-700" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Liên kết nhanh</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="/" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Trang chủ</a>
              <a href="/phim-dang-chieu" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Phim đang chiếu</a>
              <a href="/tai-khoan" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Tài khoản</a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Blogs</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="/blog/binh-luan-phim" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Bình luận phim</a>
              <a href="/blog/tin-moi" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Tin mới</a>
              <a href="/blog/uu-dai" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Ưu đãi</a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Dịch vụ</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="/the-le" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Thể lệ</a>
              <a href="/chinh-sach" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">Chính sách</a>
            </div>
          </div>

          <div>
            <p className="font-semibold text-gray-800 dark:text-white">Liên hệ chúng tôi</p>

            <div className="flex flex-col items-start mt-5 space-y-2">
              <a href="#" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">+84 378822352</a>
              <a href="#" className="text-gray-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:underline hover:text-blue-500">minhhieu.swe@gmail.com</a>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 md:my-5 dark:border-gray-700" />

        <div className="flex flex-col items-center justify-between sm:flex-row">
          <a href="#">
            <img alt="MH - Cinema" loading="lazy" width="2" height="60" decoding="async" data-nimg="1" className="max-w-min w-[77px] h-[40px] lg:w-[150px] lg:h-[100px] object-cover duration-500 ease-in-out group-hover:opacity-100&quot;
      scale-100 blur-0 grayscale-0)" style={{ color: 'transparent' }} src="https://res.cloudinary.com/dahzoj4fy/image/upload/v1733076499/ssvailkpy49nc4ba9ewu.svg"></img>
          </a>

          <p className="mt-4 text-sm text-gray-500 sm:mt-0 dark:text-gray-300">2024 © MH Cinema - Hệ thống rạp chiếu phim hiện đại</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;