'use client'

type InvoicePaperSize = 'A4' | 'A5'

export default function InvoicePrint({
  order,
  paperSize = 'A5',
}: {
  order: any
  paperSize?: InvoicePaperSize
}) {
  const isA4 = paperSize === 'A4'

  const formatMoney = (value: any) => {
    return Number(value || 0).toLocaleString('vi-VN') + ' đ'
  }

  const formatDate = (value: any) => {
    if (!value) return '-'

    try {
      return new Date(value).toLocaleDateString('vi-VN')
    } catch {
      return '-'
    }
  }

  const formatAddress = (value: any) => {
    if (!value) return ''

    if (typeof value === 'string') {
      return value.trim()
    }

    if (typeof value === 'object') {
      const parts = [
        value.address,
        value.full_address,
        value.fullAddress,
        value.street,
        value.street_address,
        value.streetAddress,
        value.ward,
        value.ward_name,
        value.wardName,
        value.district,
        value.district_name,
        value.districtName,
        value.province,
        value.province_name,
        value.provinceName,
        value.city,
        value.city_name,
        value.cityName,
      ]
        .filter(Boolean)
        .map((item) => String(item).trim())
        .filter(Boolean)

      return [...new Set(parts)].join(', ')
    }

    return String(value)
  }

  const customer = order?.customer || order?.customers || {}

  const shippingAddress =
    order?.shipping_address ||
    order?.shippingAddress ||
    order?.delivery_address ||
    order?.deliveryAddress ||
    customer?.shipping_address ||
    customer?.shippingAddress ||
    null

  const customerName =
    order?.customer_name ||
    order?.customerName ||
    customer?.name ||
    customer?.full_name ||
    customer?.fullName ||
    customer?.customer_name ||
    'Khách lẻ'

  const customerCode =
    order?.customer_code ||
    order?.customerCode ||
    customer?.customer_code ||
    customer?.customerCode ||
    customer?.code ||
    customer?.customer_id ||
    customer?.id ||
    '-'

  const customerPhone =
    order?.customer_phone ||
    order?.customerPhone ||
    order?.phone ||
    customer?.phone ||
    customer?.phone_number ||
    customer?.phoneNumber ||
    '-'

  const customerAddress =
    formatAddress(order?.customer_address) ||
    formatAddress(order?.customerAddress) ||
    formatAddress(order?.address) ||
    formatAddress(shippingAddress) ||
    formatAddress(customer?.address) ||
    formatAddress(customer?.shipping_address) ||
    '-'

  const customerEmail =
    order?.customer_email ||
    order?.customerEmail ||
    order?.email ||
    customer?.email ||
    ''

  const orderCode =
    order?.order_code ||
    order?.orderCode ||
    order?.code ||
    order?.order_number ||
    order?.orderNumber ||
    order?.id ||
    '-'

  const orderDate =
    order?.order_date ||
    order?.orderDate ||
    order?.created_at ||
    order?.createdAt

  const paymentMethod =
    order?.payment_method ||
    order?.paymentMethod ||
    'COD'

  const note =
    order?.note ||
    order?.customer_note ||
    order?.customerNote ||
    order?.shipping_note ||
    order?.shippingNote ||
    ''

  const paidAmount = Number(
    order?.paid_amount ||
      order?.paidAmount ||
      0
  )

  const totalAmount = Number(
    order?.total_amount ||
      order?.totalAmount ||
      order?.grand_total ||
      order?.grandTotal ||
      order?.total ||
      0
  )

  const remainingAmount = Math.max(
    totalAmount - paidAmount,
    0
  )

  const items =
    order?.items ||
    order?.order_items ||
    order?.orderItems ||
    order?.products ||
    []

  const pagePadding = isA4 ? '12mm' : '9mm'

  const mainMinHeight = isA4
    ? '175mm'
    : '115mm'

  const sizes = {
    brand: isA4 ? '27px' : '24px',
    salesInvoice: isA4 ? '9px' : '8px',
    title: isA4 ? '34px' : '29px',
    orderCode: isA4 ? '12px' : '10px',

    sectionTitle: isA4 ? '12px' : '10px',
    customer: isA4 ? '11px' : '10px',

    tableHeader: isA4 ? '10.5px' : '9.5px',
    tableBody: isA4 ? '10.5px' : '9.5px',

    sku: isA4 ? '9.5px' : '8.5px',

    policyTitle: isA4 ? '10px' : '8.5px',
    policyBody: isA4 ? '8.5px' : '7.5px',

    total: isA4 ? '10.5px' : '9.5px',
    grandTotal: isA4 ? '15px' : '13px',

    footerTitle: isA4 ? '15px' : '13px',
    footerBody: isA4 ? '9.5px' : '8.5px',
    footerSmall: isA4 ? '8.5px' : '8px',
  }

  const mainFont =
    'Arial, "Helvetica Neue", Helvetica, sans-serif'

  const pixelFont =
    '"Pixel Operator", "Pixeloid Sans", "Silkscreen", "Press Start 2P", "Courier New", monospace'

  return (
    <div
      id="invoice-print"
      style={{
        width: '100%',
        minHeight: mainMinHeight,
        boxSizing: 'border-box',
        padding: pagePadding,
        background: '#fff',
        color: '#111',
        fontFamily: mainFont,
        fontSize: sizes.tableBody,
        lineHeight: 1.4,
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      {/* =========================================================
          HEADER
      ========================================================= */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '10mm',
          alignItems: 'start',
          paddingBottom: isA4 ? '6mm' : '5mm',
          borderBottom: '1.2px solid #111',
        }}
      >
        {/* LEFT */}
        <div>
          <div
            style={{
              fontFamily: mainFont,
              fontSize: sizes.brand,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.4px',
            }}
          >
            OLIVE LIVING
          </div>

          <div
            style={{
              marginTop: '6px',
              fontSize: isA4 ? '9px' : '8px',
              lineHeight: 1.5,
              color: '#555',
            }}
          >
            Furniture · Lighting · Living
          </div>

          <div
            style={{
              marginTop: '5px',
              fontSize: isA4 ? '9px' : '8px',
              lineHeight: 1.5,
              color: '#333',
            }}
          >
            Website: olivelivingvn.com
          </div>

          <div
            style={{
              fontSize: isA4 ? '9px' : '8px',
              lineHeight: 1.5,
              color: '#333',
            }}
          >
            Email: hello@olivelivingvn.com
          </div>
        </div>

        {/* RIGHT */}
        <div
          style={{
            textAlign: 'right',
            minWidth: isA4 ? '48mm' : '42mm',
          }}
        >
          <div
            style={{
              fontFamily: mainFont,
              fontSize: sizes.salesInvoice,
              fontWeight: 700,
              letterSpacing: '1px',
              color: '#666',
              marginBottom: '3px',
            }}
          >
            SALES INVOICE
          </div>

          <div
            style={{
              fontFamily: mainFont,
              fontSize: sizes.title,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '0px',
              whiteSpace: 'nowrap',
              WebkitFontSmoothing: 'antialiased',
              textRendering: 'geometricPrecision',
            }}
          >
            HÓA ĐƠN
          </div>

          <div
            style={{
              marginTop: '8px',
              fontFamily: pixelFont,
              fontSize: sizes.orderCode,
              fontWeight: 700,
              letterSpacing: '0.3px',
            }}
          >
            #{orderCode}
          </div>

          <div
            style={{
              marginTop: '3px',
              fontSize: isA4 ? '9px' : '8px',
              color: '#555',
            }}
          >
            Ngày: {formatDate(orderDate)}
          </div>
        </div>
      </div>

      {/* =========================================================
          CUSTOMER
      ========================================================= */}

      <div
        style={{
          marginTop: isA4 ? '6mm' : '5mm',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4mm 8mm',
            fontSize: sizes.customer,
          }}
        >
          {/* CUSTOMER NAME */}
          <div>
            <div
              style={{
                color: '#666',
                fontSize: isA4 ? '8.5px' : '7.5px',
                textTransform: 'uppercase',
                marginBottom: '2px',
              }}
            >
              Khách hàng
            </div>

            <div
              style={{
                fontWeight: 700,
              }}
            >
              {customerName}
            </div>
          </div>

          {/* CUSTOMER CODE */}
          <div>
            <div
              style={{
                color: '#666',
                fontSize: isA4 ? '8.5px' : '7.5px',
                textTransform: 'uppercase',
                marginBottom: '2px',
              }}
            >
              Mã KH
            </div>

            <div
              style={{
                fontFamily: pixelFont,
                fontWeight: 700,
              }}
            >
              {customerCode}
            </div>
          </div>

          {/* PHONE */}
          <div>
            <div
              style={{
                color: '#666',
                fontSize: isA4 ? '8.5px' : '7.5px',
                textTransform: 'uppercase',
                marginBottom: '2px',
              }}
            >
              SĐT
            </div>

            <div>{customerPhone}</div>
          </div>

          {/* EMAIL */}
          <div>
            <div
              style={{
                color: '#666',
                fontSize: isA4 ? '8.5px' : '7.5px',
                textTransform: 'uppercase',
                marginBottom: '2px',
              }}
            >
              Email
            </div>

            <div
              style={{
                wordBreak: 'break-word',
              }}
            >
              {customerEmail || '-'}
            </div>
          </div>

          {/* ADDRESS */}
          <div
            style={{
              gridColumn: '1 / -1',
            }}
          >
            <div
              style={{
                color: '#666',
                fontSize: isA4 ? '8.5px' : '7.5px',
                textTransform: 'uppercase',
                marginBottom: '2px',
              }}
            >
              Địa chỉ
            </div>

            <div
              style={{
                lineHeight: 1.45,
                wordBreak: 'break-word',
              }}
            >
              {customerAddress}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          PRODUCTS TABLE
      ========================================================= */}

      <div
        style={{
          marginTop: isA4 ? '7mm' : '6mm',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            fontFamily: mainFont,
          }}
        >
          <colgroup>
            <col style={{ width: '7%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '27%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>

          <thead>
            <tr>
              {[
                'STT',
                'SKU',
                'SẢN PHẨM',
                'MÀU',
                'SL',
                'ĐƠN GIÁ',
                'THÀNH TIỀN',
              ].map((header, index) => (
                <th
                  key={header}
                  style={{
                    padding: '7px 4px',
                    borderTop: '1.2px solid #111',
                    borderBottom: '1.2px solid #111',
                    fontSize: sizes.tableHeader,
                    fontWeight: 700,
                    textAlign:
                      index === 0 || index === 4
                        ? 'center'
                        : index >= 5
                          ? 'right'
                          : 'left',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {items.length > 0 ? (
              items.map((item: any, index: number) => {
                const sku =
                  item?.sku ||
                  item?.product_sku ||
                  item?.productSku ||
                  item?.sku_master ||
                  item?.product?.sku ||
                  '-'

                const productName =
                  item?.product_name ||
                  item?.productName ||
                  item?.name ||
                  item?.product?.name ||
                  'Sản phẩm'

                const color =
                  item?.color ||
                  item?.variant_color ||
                  item?.variantColor ||
                  item?.product?.color ||
                  '-'

                const quantity = Number(
                  item?.quantity ||
                    item?.qty ||
                    item?.amount ||
                    1
                )

                const unitPrice = Number(
                  item?.unit_price ||
                    item?.unitPrice ||
                    item?.price ||
                    item?.sale_price ||
                    item?.salePrice ||
                    item?.product?.sale_price ||
                    0
                )

                const lineTotal =
                  Number(
                    item?.total_price ||
                      item?.totalPrice ||
                      item?.subtotal ||
                      item?.line_total ||
                      0
                  ) ||
                  quantity * unitPrice

                return (
                  <tr key={item?.id || index}>
                    <td
                      style={{
                        padding: '7px 4px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'center',
                        verticalAlign: 'top',
                        fontSize: sizes.tableBody,
                      }}
                    >
                      {index + 1}
                    </td>

                    <td
                      style={{
                        padding: '7px 4px',
                        borderBottom: '1px solid #ddd',
                        verticalAlign: 'top',
                        fontFamily: pixelFont,
                        fontSize: sizes.sku,
                        fontWeight: 700,
                        wordBreak: 'break-word',
                        lineHeight: 1.35,
                      }}
                    >
                      {sku}
                    </td>

                    <td
                      style={{
                        padding: '7px 4px',
                        borderBottom: '1px solid #ddd',
                        verticalAlign: 'top',
                        fontSize: sizes.tableBody,
                        fontWeight: 600,
                        lineHeight: 1.35,
                        wordBreak: 'break-word',
                      }}
                    >
                      {productName}
                    </td>

                    <td
                      style={{
                        padding: '7px 4px',
                        borderBottom: '1px solid #ddd',
                        verticalAlign: 'top',
                        fontSize: sizes.tableBody,
                        wordBreak: 'break-word',
                      }}
                    >
                      {color}
                    </td>

                    <td
                      style={{
                        padding: '7px 4px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'center',
                        verticalAlign: 'top',
                        fontSize: sizes.tableBody,
                      }}
                    >
                      {quantity}
                    </td>

                    <td
                      style={{
                        padding: '7px 4px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'right',
                        verticalAlign: 'top',
                        fontSize: sizes.tableBody,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatMoney(unitPrice)}
                    </td>

                    <td
                      style={{
                        padding: '7px 4px',
                        borderBottom: '1px solid #ddd',
                        textAlign: 'right',
                        verticalAlign: 'top',
                        fontSize: sizes.tableBody,
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatMoney(lineTotal)}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: '14px 6px',
                    textAlign: 'center',
                    color: '#777',
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  Không có sản phẩm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================
          TOTALS
      ========================================================= */}

      <div
        style={{
          marginTop: isA4 ? '5mm' : '4mm',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <div
          style={{
            width: isA4 ? '82mm' : '76mm',
            maxWidth: '100%',
          }}
        >
          {/* SUBTOTAL */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '10px',
              padding: '3px 0',
              fontSize: sizes.total,
            }}
          >
            <span>Tạm tính</span>

            <strong>
              {formatMoney(
                order?.subtotal ||
                  order?.sub_total ||
                  order?.subtotal_amount ||
                  totalAmount
              )}
            </strong>
          </div>

          {/* DISCOUNT */}
          {Number(
            order?.discount_amount ||
              order?.discountAmount ||
              order?.discount ||
              0
          ) > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '10px',
                padding: '3px 0',
                fontSize: sizes.total,
              }}
            >
              <span>Giảm giá</span>

              <strong>
                -{' '}
                {formatMoney(
                  order?.discount_amount ||
                    order?.discountAmount ||
                    order?.discount
                )}
              </strong>
            </div>
          )}

          {/* SHIPPING */}
          {Number(
            order?.shipping_fee ||
              order?.shippingFee ||
              order?.delivery_fee ||
              0
          ) > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '10px',
                padding: '3px 0',
                fontSize: sizes.total,
              }}
            >
              <span>Phí vận chuyển</span>

              <strong>
                {formatMoney(
                  order?.shipping_fee ||
                    order?.shippingFee ||
                    order?.delivery_fee
                )}
              </strong>
            </div>
          )}

          {/* PAYMENT METHOD */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '10px',
              paddingTop: '3px',
              fontSize: sizes.total,
              color: '#555',
            }}
          >
            <span>Thanh toán</span>

            <strong
              style={{
                textTransform: 'uppercase',
              }}
            >
              {paymentMethod}
            </strong>
          </div>

          {/* GRAND TOTAL */}
          <div
            style={{
              marginTop: '4px',
              paddingTop: '7px',
              borderTop: '1.2px solid #111',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '10px',
            }}
          >
            <span
              style={{
                fontSize: sizes.total,
                fontWeight: 700,
              }}
            >
              TỔNG CỘNG
            </span>

            <span
              style={{
                fontSize: sizes.grandTotal,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {formatMoney(totalAmount)}
            </span>
          </div>

          {/* PAID */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '10px',
              padding: '3px 0',
              marginTop: '3px',
              fontSize: sizes.total,
            }}
          >
            <span>Đã thanh toán</span>

            <strong>
              {formatMoney(paidAmount)}
            </strong>
          </div>

          {/* REMAINING */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              gap: '10px',
              padding: '3px 0',
              fontSize: sizes.total,
              fontWeight: 700,
            }}
          >
            <span>CÒN THANH TOÁN</span>

            <span
              style={{
                whiteSpace: 'nowrap',
              }}
            >
              {formatMoney(remainingAmount)}
            </span>
          </div>

          {/* PAYMENT METHOD */}
          
        </div>
      </div>

      {/* =========================================================
          RETURN POLICY
      ========================================================= */}

      <div
        style={{
          marginTop: isA4 ? '7mm' : '5mm',
          fontFamily: mainFont,
          color: '#333',
        }}
      >
        <div
          style={{
            fontFamily: mainFont,
            fontSize: sizes.policyTitle,
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '3px',
          }}
        >
          CHÍNH SÁCH ĐỔI TRẢ
        </div>

        <div
          style={{
            fontFamily: mainFont,
            fontSize: sizes.policyBody,
            lineHeight: isA4 ? '13px' : '11.5px',
          }}
        >
          {/* THỜI GIAN ĐỔI TRẢ */}
          <div
            style={{
              marginBottom: '3px',
            }}
          >
            <strong>Thời gian đổi trả:</strong>{' '}
            Trong vòng <strong>15 ngày</strong> kể từ ngày{' '}
            <strong>
              ĐVVC xác nhận đơn hàng giao thành công
            </strong>
            .
          </div>

          {/* HỖ TRỢ ĐỔI */}
          <div
            style={{
              marginBottom: '2px',
            }}
          >
            <strong>Hỗ trợ đổi:</strong>
          </div>

          <div>
            • Lỗi sản xuất, lỗi kỹ thuật hoặc bể vỡ do vận chuyển.
          </div>

          <div>
            • Sản phẩm chưa qua sử dụng, còn đầy đủ hộp, bao bì và phụ kiện.
          </div>

          <div>
            • Khách hàng cung cấp hình ảnh/video khi phát hiện vấn đề.
          </div>

          {/* KHÔNG HỖ TRỢ ĐỔI */}
          <div
            style={{
              marginTop: '3px',
              marginBottom: '2px',
            }}
          >
            <strong>Không hỗ trợ đổi:</strong>
          </div>

          <div>
            • Hư hỏng do sử dụng, lắp đặt hoặc bảo quản không đúng hướng dẫn.
          </div>

          <div>
            • Bể, nứt, móp hoặc hao mòn do khách hàng.
          </div>

          <div>
            • Thiếu hộp, bao bì hoặc phụ kiện làm ảnh hưởng việc kiểm tra và đổi hàng.
          </div>

          {/* NOTE */}
          {note && (
            <div
              style={{
                marginTop: '3px',
              }}
            >
              <strong>Ghi chú:</strong> {note}
            </div>
          )}

          {/* POLICY LINK */}
          <div
            style={{
              marginTop: isA4 ? '4px' : '3px',
              fontFamily: mainFont,
              fontSize: sizes.policyBody,
              lineHeight: 1.3,
            }}
          >
            <span
              style={{
                fontWeight: 700,
              }}
            >
              Xem chi tiết chính sách:
            </span>{' '}

            <a
              href="https://olivelivingvn.com/chinh-sach-doi-hang"
              style={{
                color: '#333',
                textDecoration: 'none',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              Olivelivingvn.com/chinh-sach-doi-hang
            </a>
          </div>
        </div>
      </div>

      {/* =========================================================
          THANK YOU
      ========================================================= */}

      <div
        style={{
          marginTop: isA4 ? '7mm' : '5mm',
          paddingTop: isA4 ? '5mm' : '4mm',
          paddingBottom: isA4 ? '5mm' : '4mm',
          textAlign: 'center',
          borderTop: '1.2px solid #111',
          borderBottom: '1px solid #d2d2d2',
          fontFamily: mainFont,
        }}
      >
        <div
          style={{
            fontFamily: mainFont,
            fontSize: sizes.footerTitle,
            fontWeight: 700,
            fontStyle: 'normal',
            fontStretch: 'normal',
            lineHeight: '1.2',
            letterSpacing: '0px',
            whiteSpace: 'nowrap',
            WebkitFontSmoothing: 'antialiased',
            textRendering: 'geometricPrecision',
            marginBottom: '4px',
          }}
        >
          CẢM ƠN QUÝ KHÁCH!
        </div>

        <div
          style={{
            fontFamily: mainFont,
            fontSize: sizes.footerBody,
            lineHeight: 1.4,
            color: '#444',
          }}
        >
          Cảm ơn Quý khách đã mua sắm tại Olive Living.
        </div>

        <div
          style={{
            marginTop: '2px',
            fontFamily: mainFont,
            fontSize: sizes.footerSmall,
            lineHeight: 1.4,
            color: '#777',
          }}
        >
          OLIVE LIVING · Furniture · Lighting · Living
        </div>
      </div>
    </div>
  )
}