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

            <h1 className="text-[42px] font-black tracking-[8px]">
              OLIVE LIVING
            </h1>

            <div className="mt-3 space-y-1 text-[13px] text-gray-600">

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
      <div className="mt-7 rounded-xl border border-black p-4">

        <h3 className="mb-3 text-[15px] font-bold uppercase"> font-bold uppercase tracking-widest">
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
    Mã KH:
  </span>{' '}
  {order.customers?.customer_code}
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

  <table className="w-full table-fixed border-collapse">

    <thead>

      <tr className="h-11 border-y-2 border-black bg-gray-100">

        <th className="pb-3 text-left text-[11px] font-bold uppercase tracking-widest">
          STT
        </th>

        <th className="pb-3 text-left text-[11px] font-bold uppercase tracking-widest">
          SKU
        </th>

        <th className="pb-3 text-left text-[11px] font-bold uppercase tracking-widest">
          Sản phẩm
        </th>

        <th className="pb-3 text-center text-[11px] font-bold uppercase tracking-widest">
          Màu
        </th>

        <th className="pb-3 text-center text-[11px] font-bold uppercase tracking-widest">
          SL
        </th>

        <th className="pb-3 text-right text-[11px] font-bold uppercase tracking-widest">
          Đơn giá
        </th>

        <th className="pb-3 text-right text-[11px] font-bold uppercase tracking-widest">
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

            <td className="py-4 text-sm">
              {index + 1}
            </td>

            <td className="py-4 text-sm text-gray-600">
              {item.sku || '-'}
            </td>

            <td className="py-4 text-sm font-semibold">
              {item.product_name}
            </td>

            <td className="py-4 text-center text-sm text-gray-700">
              {item.color || '-'}
            </td>

            <td className="py-4 text-center text-sm">
              {item.quantity}
            </td>

            <td className="py-4 text-right text-sm">
              {Number(
                item.sale_price || 0
              ).toLocaleString('vi-VN')} đ
            </td>

            <td className="py-4 text-right text-sm font-bold">
              {Number(
                item.subtotal || 0
              ).toLocaleString('vi-VN')} đ
            </td>

          </tr>

        )
      )}

    </tbody>

  </table>

</div>

      {/* TOTAL */}
<div className="mt-10 flex justify-end">

  <div className="w-[320px] space-y-2">

    <div className="flex justify-between">
      <span>Thành tiền</span>
      <span>
        {Number(
          order.subtotal || 0
        ).toLocaleString('vi-VN')} đ
      </span>
    </div>

    <div className="flex justify-between">
      <span>Phí ship</span>
      <span>
        {Number(
          order.shipping_fee || 0
        ).toLocaleString('vi-VN')} đ
      </span>
    </div>

    <div className="flex justify-between">
      <span>Giảm giá</span>
      <span>
        -{Number(
          order.discount || 0
        ).toLocaleString('vi-VN')} đ
      </span>
    </div>

    <div className="flex justify-between text-green-600">
      <span>Đã thanh toán</span>
      <span className="font-semibold">
        {Number(
          order.paid_amount || 0
        ).toLocaleString('vi-VN')} đ
      </span>
    </div>

    <div className="mt-3 border-t-2 border-black pt-3 flex justify-between">

      <span className="text-xl font-bold">
        CÒN LẠI
      </span>

      <span className="text-2xl font-black text-green-700">
        {Math.max(
          Number(order.total_amount || 0) -
          Number(order.paid_amount || 0),
          0
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
            • Hỗ trợ đổi trả trong 15 ngày nếu lỗi sản xuất.
          </li>

          <li>
            • Không áp dụng với sản phẩm đã qua sử dụng.
          </li>

        </ul>

      </div>

        </div>

          
  
  )
}