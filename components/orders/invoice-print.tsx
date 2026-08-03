'use client'

export default function InvoicePrint({
  order,
}: {
  order: any
}) {
  return (
   <div
  id="invoice-print"
  className="mx-auto w-[185mm] bg-white px-[8mm] py-[8mm] text-black"
  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
>

      {/* HEADER */}
      {/* HEADER */}

<div className="flex items-start justify-between border-b border-gray-300 pb-6">

  <div>

    <h1
  className="text-[30px] font-bold tracking-[6px]"
  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
>
  OLIVE LIVING
</h1>

    <div className="mt-2 space-y-0.5 text-[12px] text-gray-600">

      <div>KDC Trung Sơn, Bình Hưng, TP.HCM</div>

      <div>Hotline: 0799 379 179</div>

      <div>Email: olivelivingvn@gmail.com</div>

    </div>

  </div>

  <div className="text-right">

    <div className="text-[10px] tracking-[4px] text-gray-400 uppercase">
      Sales Invoice
    </div>

    <h2
  className="mt-1 text-[30px] font-bold tracking-wide"
  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
>
  HÓA ĐƠN
</h2>

    <div className="mt-4 inline-flex rounded-full border border-black px-4 py-2 text-[13px] font-bold">
      {order.order_code}
    </div>

    <div className="mt-3 text-[13px]">
      {new Date(order.created_at).toLocaleDateString('vi-VN')}
    </div>

  </div>

</div>

      {/* CUSTOMER */}
      {/* CUSTOMER */}

<div className="mt-5 rounded-lg border border-gray-300 p-4">

  <h3 className="mb-3 border-b border-gray-200 pb-2 text-[14px] font-bold uppercase tracking-wide">
    Thông tin khách hàng
  </h3>

  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[13px]">

    <div>
      <span className="font-semibold">Họ tên:</span>{' '}
      {order.customers?.full_name}
    </div>

    <div>
      <span className="font-semibold">Mã KH:</span>{' '}
      {order.customers?.customer_code}
    </div>

    <div>
      <span className="font-semibold">SĐT:</span>{' '}
      {order.customers?.phone}
    </div>

    <div>
      <span className="font-semibold">Ngày:</span>{' '}
      {new Date(order.created_at).toLocaleDateString('vi-VN')}
    </div>

  </div>

  <div className="mt-3 text-[13px]">

    <span className="font-semibold">
      Địa chỉ:
    </span>{' '}

    {order.customers?.address}

  </div>

</div>

      {/* PRODUCTS */}
<div className="mt-8">

  <table className="w-full border-collapse">

    <thead>

<tr className="border-y-2 border-black bg-gray-100 text-[12px]">

<th className="w-[35px] py-2 text-center">
STT
</th>

<th className="w-[75px] py-2 text-left">
SKU
</th>

<th className="py-2 text-left">
SẢN PHẨM
</th>

<th className="w-[60px] py-2 text-center">
MÀU
</th>

<th className="w-[45px] py-2 text-center">
SL
</th>

<th className="w-[90px] py-2 text-right">
ĐƠN GIÁ
</th>

<th className="w-[100px] py-2 text-right">
THÀNH TIỀN
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
  className="border-b border-gray-300 text-[13px]"
>

<td className="py-3 text-center">
  {index + 1}
</td>

<td className="text-gray-500">
  {item.sku || '-'}
</td>

<td>

  <div className="font-semibold leading-5">
    {item.product_name}
  </div>

</td>

<td className="text-center">
  {item.color || '-'}
</td>

<td className="text-center">
  {item.quantity}
</td>

<td className="text-right">
  {Number(item.sale_price || 0).toLocaleString('vi-VN')} đ
</td>

<td className="text-right font-bold">
  {Number(item.subtotal || 0).toLocaleString('vi-VN')} đ
</td>

</tr>

        )
      )}

    </tbody>

  </table>

</div>

      {/* TOTAL */}

<div className="mt-8 flex justify-end">

  <div className="w-[290px] rounded-lg border border-gray-300 p-4">

    <div className="flex justify-between py-1 text-[13px] font-semibold">

      <span>Tạm tính</span>

      <span>
        {Number(order.subtotal || 0).toLocaleString('vi-VN')} đ
      </span>

    </div>

    <div className="flex justify-between py-1 text-[13px]">

      <span>Giảm giá</span>

      <span>
        -{Number(order.discount || 0).toLocaleString('vi-VN')} đ
      </span>

    </div>

    <div className="flex justify-between py-1 text-[13px]">

      <span>Phí vận chuyển</span>

      <span>
        {Number(order.shipping_fee || 0).toLocaleString('vi-VN')} đ
      </span>

    </div>

    <div className="flex justify-between py-1 text-[13px] text-green-700">

      <span>Đã thanh toán</span>

      <span className="font-semibold">
        {Number(order.paid_amount || 0).toLocaleString('vi-VN')} đ
      </span>

    </div>

    <div className="my-3 border-t border-black" />

    <div className="flex justify-between py-1 text-[13px] font-semibold">

      <span>Tổng cần thanh toán</span>

      <span className="text-[15px] text-green-700">

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
  

{/* POLICY */}

<div className="mt-8 rounded-lg border border-gray-400 p-4">

  <h3 className="mb-3 text-center text-[15px] font-bold uppercase">
    CHÍNH SÁCH KIỂM TRA & ĐỔI TRẢ
  </h3>

  <div className="text-[13px] leading-6">

    <p className="font-semibold">
      Hỗ trợ đổi trả trong vòng 15 ngày nếu:
    </p>

    <ul className="mt-1 ml-5 list-disc">

      <li>Sản phẩm giao sai mẫu, sai màu.</li>

      <li>Sản phẩm bị lỗi do nhà sản xuất.</li>

      <li>Sản phẩm hư hỏng trong quá trình vận chuyển.</li>

    </ul>

    <p className="mt-3 font-semibold text-red-600">
      Không áp dụng đổi trả:
    </p>

    <ul className="mt-1 ml-5 list-disc">

      <li>Sản phẩm sử dụng sai cách.</li>

      <li>Khách đổi ý sau khi nhận đúng sản phẩm.</li>

      <li>Sản phẩm đã qua sử dụng hoặc bị tác động.</li>

    </ul>

  </div>

  <div className="mt-4 rounded border border-gray-400 bg-gray-50 px-3 py-2 text-[12px] text-gray-700">

    Liên hệ <strong>0799 379 179</strong> để được hỗ trợ về vận đơn và thông tin đơn hàng.

  </div>

</div>

    </div>      
  
  )
}