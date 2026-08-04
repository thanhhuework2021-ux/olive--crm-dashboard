import { CreateOrderClient } from '@/components/orders/create-order-client'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    mode?: string
    id?: string
  }>
}) {
  const params = await searchParams

  return (
    <CreateOrderClient
      mode={params.mode}
      orderId={params.id}
    />
  )
}