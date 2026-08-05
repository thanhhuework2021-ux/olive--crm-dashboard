import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Clock3,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface OrderStatusSummary {
  pending: number;
  processing: number;
  shipping: number;
  completed: number;
  cancelled: number;
}

interface Props {
  summary: OrderStatusSummary;
}

export function OrderStatusWidget({ summary }: Props) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader>
        <CardTitle>Trạng thái đơn hàng</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">

        <StatusItem
          icon={<Clock3 className="h-5 w-5 text-yellow-500" />}
          label="Chờ xác nhận"
          value={summary.pending}
        />

        <StatusItem
          icon={<Package className="h-5 w-5 text-blue-500" />}
          label="Đang xử lý"
          value={summary.processing}
        />

        <StatusItem
          icon={<Truck className="h-5 w-5 text-indigo-500" />}
          label="Đang giao"
          value={summary.shipping}
        />

        <StatusItem
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
          label="Hoàn thành"
          value={summary.completed}
        />

        <StatusItem
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          label="Đã hủy"
          value={summary.cancelled}
        />

      </CardContent>
    </Card>
  );
}

function StatusItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border p-4 flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors">

      {icon}

      <p className="text-sm text-muted-foreground text-center">
        {label}
      </p>

      <p className="text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}