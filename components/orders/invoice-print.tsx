'use client'

export default function InvoicePrint({
  order,
}: {
  order: any
}) {

  const itemCount =
  order.order_items?.length || 0

  return (
  <div
  id="invoice-print"
  className="mx-auto bg-white text-black print:shadow-none"
  style={{
    width: "190mm",
    minHeight: "277mm",
    margin: "0 auto",
    padding: "10mm",
    background: "#fff",
    boxSizing: "border-box",
    fontFamily: "Arial, Helvetica, sans-serif",
  }}
>

  
      {/* HEADER */}

<div className="flex items-start justify-between border-b border-gray-300 pb-2">

  <div>

    <h1
  className="text-[22px] font-bold tracking-[4px]"
  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
>
  OLIVE LIVING
</h1>

    <div className="mt-2 space-y-0.5 text-[10px] text-gray-600">

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
  className="mt-1 text-[28px] font-bold tracking-wide"
  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
>
  HÓA ĐƠN
</h2>

    <div className="mt-4 inline-flex rounded-full border border-black px-4 py-2 text-[12px] font-bold">
      {order.order_code}
    </div>

    <div className="mt-3 text-[12px]">
      {new Date(order.created_at).toLocaleDateString('vi-VN')}
    </div>

  </div>

</div>

      {/* CUSTOMER */}
      {/* CUSTOMER */}

<div className="mt-3 rounded-lg border border-gray-300 p-2.5">

  <h3 className="mb-3 border-b border-gray-200 pb-2 text-[14px] font-bold uppercase tracking-wide">
    Thông tin khách hàng
  </h3>

  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[12px]">

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

  <div className="mt-3 text-[12px]">

    <span className="font-semibold">
      Địa chỉ:
    </span>{' '}

    {order.customers?.address}

  </div>

</div>

      {/* PRODUCTS */}
<div className="mt-4">

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
  className="border-b border-gray-200 text-[11px]"
>
<td className="py-2 text-center">
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

   <div className="mt-3 grid grid-cols-[1fr_220px] gap-4 items-stretch">

  {/* ================= POLICY ================= */}

  <div className="flex h-full flex-col rounded-lg border border-gray-300 p-2">

    <div className="mb-2 text-[12px] font-bold uppercase">
      Chính sách kiểm tra & đổi trả
    </div>

    <ul className="ml-4 list-disc space-y-1 text-[10px] leading-4">

      <li>Đổi trong 15 ngày nếu giao sai hoặc lỗi từ nhà sản xuất.</li>

      <li>Không áp dụng với sản phẩm đã qua sử dụng.</li>

      <li>Hư hỏng do người dùng không được hỗ trợ đổi trả.</li>

    </ul>

    <div className="mt-2 rounded border bg-gray-50 p-2 text-[10px]">

      Hotline hỗ trợ:
      <strong> 0799 379 179</strong>

    </div>

  </div>

  {/* ================= TOTAL ================= */}

 <div className="flex h-full flex-col rounded-lg border border-gray-300 p-2">

    <div className="flex justify-between py-1 text-[11px]">
      <span>Tạm tính</span>
      <span>{Number(order.subtotal || 0).toLocaleString("vi-VN")} đ</span>
    </div>

    <div className="flex justify-between py-1 text-[11px]">
      <span>Giảm giá</span>
      <span>-{Number(order.discount || 0).toLocaleString("vi-VN")} đ</span>
    </div>

    <div className="flex justify-between py-1 text-[11px]">
      <span>Vận chuyển</span>
      <span>{Number(order.shipping_fee || 0).toLocaleString("vi-VN")} đ</span>
    </div>

    <div className="flex justify-between py-1 text-[11px] text-green-700">
      <span>Đã thanh toán</span>
      <span>{Number(order.paid_amount || 0).toLocaleString("vi-VN")} đ</span>
    </div>

    <div className="my-2 border-t"></div>

     <div className="flex justify-between text-[13px] font-bold">

      <span>Còn thanh toán</span>

      <span className="text-green-700">

        {Math.max(
          Number(order.total_amount || 0) -
          Number(order.paid_amount || 0),
          0
        ).toLocaleString("vi-VN")} đ

      </span>

    </div>

  </div>

</div>

{/* THANK YOU */}

<div className="mt-4 border-t border-gray-300 pt-3 text-center">

  <p className="text-[14px] font-semibold tracking-wide">
    CẢM ƠN QUÝ KHÁCH!
  </p>

  <p className="mt-1 text-[11px] text-gray-600">
    Olive Living chân thành cảm ơn Quý khách đã tin tưởng và lựa chọn sản phẩm của chúng tôi.
  </p>

  <p className="mt-1 text-[10px] text-gray-500">
    Chúc Quý khách có những trải nghiệm tuyệt vời cùng Olive Living.
  </p>

</div>

    </div>      

    
  
  )

  
}

