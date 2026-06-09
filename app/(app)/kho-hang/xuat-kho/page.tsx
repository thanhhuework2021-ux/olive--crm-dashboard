import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function XuatKhoPage() {
  return (
    <div className="space-y-6 p-6">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Xuất kho
        </h1>

        <p className="text-muted-foreground">
          Tạo phiếu xuất kho hàng hóa
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* LEFT */}

        <div className="space-y-6 lg:col-span-2">

          <Card>
            <CardHeader>
              <CardTitle>Thông tin phiếu xuất</CardTitle>
            </CardHeader>

            <CardContent>

              <div className="grid gap-4 md:grid-cols-2">

                <Input
                  defaultValue="PX-20260607-001"
                  placeholder="Mã phiếu xuất"
                />

                <Input type="date" />

                <Input placeholder="Người nhận" />

                <Input placeholder="Lý do xuất kho" />

              </div>

              <Textarea
                className="mt-4"
                placeholder="Ghi chú..."
              />

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách sản phẩm</CardTitle>
            </CardHeader>

            <CardContent>

              <div className="mb-4 flex items-center justify-between">

                <Input
                  className="max-w-sm"
                  placeholder="Tìm SKU hoặc sản phẩm..."
                />

                <Button>
                  + Thêm sản phẩm
                </Button>

              </div>

              <Table>

                <TableHeader>

                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Tồn kho</TableHead>
                    <TableHead>SL xuất</TableHead>
                    <TableHead>Giá vốn</TableHead>
                    <TableHead>Thành tiền</TableHead>
                  </TableRow>

                </TableHeader>

                <TableBody>

                  <TableRow>

                    <TableCell>SP001</TableCell>

                    <TableCell>
                      Đèn Mushroom Olive Living
                    </TableCell>

                    <TableCell>120</TableCell>

                    <TableCell>10</TableCell>

                    <TableCell>350.000đ</TableCell>

                    <TableCell>3.500.000đ</TableCell>

                  </TableRow>

                </TableBody>

              </Table>

            </CardContent>
          </Card>

        </div>

        {/* RIGHT */}

        <div>

          <Card className="sticky top-6">

            <CardHeader>
              <CardTitle>Tổng kết</CardTitle>
            </CardHeader>

            <CardContent>

              <div className="space-y-4">

                <div className="flex justify-between">
                  <span>Tổng sản phẩm</span>
                  <span>1</span>
                </div>

                <div className="flex justify-between">
                  <span>Tổng số lượng</span>
                  <span>10</span>
                </div>

                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng giá trị</span>
                  <span>3.500.000đ</span>
                </div>

              </div>

              <div className="mt-6 space-y-3">

                <Button className="w-full">
                  Xác nhận xuất kho
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                >
                  Lưu nháp
                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>
  )
}