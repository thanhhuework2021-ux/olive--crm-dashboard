'use client'

export default function InvoicePrint({
  order,
}: {
  order: any
}) {
  return (
    <div
      id="invoice-print"
      className="mx-auto max-w-[185mm] bg-white px-10 py-8 text-black"
    >

      {/* HEADER */}
      <div className="border-b border-gray-300 pb-6">

        <div className="flex items-start justify-between">

          <div>

            <h1 className="text-4xl font-black tracking-[10px]">
              OLIVE LIVING
            </h1>

            <div className="mt-4 space-y-1 text-xs text-gray-500">

              <p>
                KDC Trung Sơn, Bình Hưng
              </p>

              <p>
                Hotline: +84 79 937 9179
              </p>

              <p>
                olivelivingvn@gmail.com
              </p>

            </div>

          </div>

          <div className="text-right">

            <p className="text-xs uppercase tracking-[4px] text-gray-400">
              Sales Invoice
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              HÓA ĐƠN
            </h2>

            <div className="mt-3 inline-flex rounded-full border border-black px-4 py-1 text-sm font-semibold">
              {order.order_code}
            </div>

            <p className="mt-3 text-sm text-gray-500">
              {new Date(
                order.created_at
              ).toLocaleDateString('vi-VN')}
            </p>

          </div>

        </div>

      </div>

      {/* CUSTOMER */}
      <div className="mt-8 rounded-2xl border border-gray-300 p-5">

        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest">
          Thông tin khách hàng
        </h3>

        <div className="grid grid-cols-1 gap-2 text-sm">

          <p>
            <span className="font-semibold">
              Họ tên:
            </span>{' '}
            {order.customers?.full_name}
          </p>

          <p>
            <span className="font-semibold">
              SĐT:
            </span>{' '}
            {order.customers?.phone}
          </p>

          <p>
            <span className="font-semibold">
              Địa chỉ:
            </span>{' '}
            {order.customers?.address}
          </p>

        </div>

      </div>

      {/* PRODUCTS */}
      <div className="mt-8">

        <table className="w-full">

          <thead>

            <tr className="border-b-2 border-black">

              <th className="pb-3 text-left text-xs uppercase tracking-wider">
                STT
              </th>

              <th className="pb-3 text-left text-xs uppercase tracking-wider">
                SKU
              </th>

              <th className="pb-3 text-left text-xs uppercase tracking-wider">
                Sản phẩm
              </th>

              <th className="pb-3 text-center text-xs uppercase tracking-wider">
                SL
              </th>

              <th className="pb-3 text-right text-xs uppercase tracking-wider">
                Đơn giá
              </th>

              <th className="pb-3 text-right text-xs uppercase tracking-wider">
                Thành tiền
              </th>

            </tr>

          </thead>

          <tbody>

            {(order.order_items || []).map(
              (
                item: any,
                index: number
              ) => (

                <tr
                  key={item.id}
                  className="border-b border-gray-200"
                >

                  <td className="py-4">
                    {index + 1}
                  </td>

                  <td className="py-4 text-gray-500">
                    {item.sku}
                  </td>

                  <td className="py-4 font-medium">
                    {item.product_name}
                  </td>

                  <td className="py-4 text-center">
                    {item.quantity}
                  </td>

                  <td className="py-4 text-right">
                    {Number(
                      item.sale_price
                    ).toLocaleString('vi-VN')} đ
                  </td>

                  <td className="py-4 text-right font-semibold">
                    {Number(
                      item.subtotal
                    ).toLocaleString('vi-VN')} đ
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      {/* TOTAL */}
      <div className="mt-8 flex justify-end">

        <div className="w-[320px]">

          <div className="flex justify-between py-2">
            <span>Tạm tính</span>

            <span>
              {Number(
                order.subtotal
              ).toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span>Giảm giá</span>

            <span>
              {Number(
                order.discount
              ).toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span>Vận chuyển</span>

            <span>
              {Number(
                order.shipping_fee
              ).toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="mt-3 flex justify-between border-t-2 border-black pt-4">

            <span className="text-xl font-bold">
              TỔNG CỘNG
            </span>

            <span className="text-2xl font-black text-green-600">
              {Number(
                order.total_amount
              ).toLocaleString('vi-VN')} đ
            </span>

          </div>

        </div>

      </div>

      {/* POLICY */}
      <div className="mt-10 rounded-2xl bg-gray-50 p-5">

        <h3 className="mb-3 text-center font-bold">
          CHÍNH SÁCH KIỂM TRA & ĐỔI TRẢ
        </h3>

        <ul className="space-y-2 text-sm text-gray-600">

          <li>
            • Kiểm tra hàng trước khi thanh toán.
          </li>

          <li>
            • Hỗ trợ đổi trả trong 07 ngày nếu lỗi sản xuất.
          </li>

          <li>
            • Không áp dụng với sản phẩm đã qua sử dụng.
          </li>

        </ul>

      </div>

      {/* SIGNATURE */}
      <div className="mt-12 grid grid-cols-2 gap-24">

        <div className="text-center">

          <p className="font-bold uppercase">
            Khách hàng
          </p>

          <div className="h-16" />

          <div className="border-t border-gray-400 pt-2 text-sm text-gray-500">
            Ký và ghi rõ họ tên
          </div>

        </div>

        <div className="text-center">

          <p className="font-bold uppercase">
            Olive Living
          </p>

          <div className="h-16" />

          <div className="border-t border-gray-400 pt-2 text-sm text-gray-500">
            Ký và đóng dấu
          </div>

        </div>

      </div>

    </div>
  )
}