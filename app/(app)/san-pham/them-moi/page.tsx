import CreateProductForm from './create-product-form'

export default function CreateProductPage() {
  return (
    <div className="p-6 text-white">
      <h1 className="mb-6 text-3xl font-bold">
        Thêm sản phẩm mới
      </h1>

      <CreateProductForm />
    </div>
  )
}