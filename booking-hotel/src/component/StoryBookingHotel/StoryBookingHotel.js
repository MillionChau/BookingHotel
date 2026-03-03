import React from "react";

export default function StoryBookingHotel() {
  return (
    <section className="bg-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* LEFT: TEXT CONTENT */}
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6">
            NGUỒN GỐC
          </h2>
          <h3 className="text-lg font-semibold text-gray-700 mb-6">
            CÂU CHUYỆN NÀY LÀ CỦA CHÚNG TÔI
          </h3>

          <p className="text-gray-700 leading-relaxed mb-4">
            Booking Hotel được thành lập với sứ mệnh mang đến trải nghiệm đặt
            phòng khách sạn dễ dàng, nhanh chóng và minh bạch cho tất cả mọi
            người. Bắt nguồn từ tình yêu du lịch và mong muốn kết nối mọi hành
            trình, chúng tôi không ngừng nỗ lực để giúp du khách tìm được nơi
            dừng chân lý tưởng ở bất cứ đâu.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Ngay từ những ngày đầu tiên, mục tiêu của Booking Hotel là tạo nên
            một nền tảng trực tuyến hiện đại, nơi bạn có thể tìm kiếm, so sánh
            và đặt phòng chỉ trong vài phút. Chúng tôi tin rằng mỗi chuyến đi
            đều đáng nhớ, và mỗi nơi lưu trú đều góp phần tạo nên trải nghiệm
            đặc biệt cho bạn.
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            Trong tương lai, Booking Hotel sẽ tiếp tục mở rộng mạng lưới đối tác
            và ứng dụng công nghệ tiên tiến để mang đến cho khách hàng sự hài
            lòng tối đa. Chúng tôi tin rằng hành trình tuyệt vời bắt đầu từ sự
            tin tưởng – và Booking Hotel luôn ở đây để đồng hành cùng bạn.
          </p>

          <p className="font-semibold text-gray-800">
            Booking Hotel – Nơi khởi đầu của những hành trình đáng nhớ.
          </p>
        </div>

        {/* RIGHT: IMAGES */}
        <div className="flex flex-col gap-8">
          {/* IMAGE 1 */}
          <div className="relative group overflow-hidden rounded-lg shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
              alt="Dịch vụ"
              className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h4 className="text-white text-2xl font-bold tracking-wide">
                DỊCH VỤ
              </h4>
            </div>
          </div>

          {/* IMAGE 2 */}
          <div className="relative group overflow-hidden rounded-lg shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1600047506606-28d9f1e8a0aa"
              alt="Nghề nghiệp"
              className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h4 className="text-white text-2xl font-bold tracking-wide">
                NGHỀ NGHIỆP
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
