'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AddCategoryButton() {
  const [showModal, setShowModal] =
    useState(false)

  const [name, setName] =
    useState('')

  const generateCode = (
    categoryName: string
  ) => {
    return categoryName
      .trim()
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  }

  return (
    <>
      <button
  onClick={() =>
    setShowModal(true)
  }
  className="
    group
    relative
    overflow-hidden
    rounded-lg
    bg-cyan-500
    px-4
    py-2
    text-sm
    font-semibold
    text-black
    shadow-lg
    shadow-cyan-500/30
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-cyan-400/70
  "
>
  <span
    className="
      absolute
      inset-0
      -translate-x-full
      bg-gradient-to-r
      from-transparent
      via-white/40
      to-transparent
      transition-transform
      duration-700
      group-hover:translate-x-full
    "
  />

  <span className="relative z-10">
    + Thêm danh mục
  </span>
</button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

          <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6">

            <h2 className="mb-4 text-xl font-bold text-white">
              Thêm danh mục
            </h2>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Tên danh mục"
              className="
                w-full
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                p-3
                text-white
              "
            />

            <div className="mt-4 flex gap-3">

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  flex-1
                  rounded-xl
                  border
                  border-slate-700
                  py-3
                  text-white
                "
              >
                Hủy
              </button>

              <button
                onClick={async () => {
                  if (!name.trim()) {
                    alert(
                      'Nhập tên danh mục'
                    )
                    return
                  }

                  const { error } =
                    await supabase
                      .from('categories')
                      .insert({
                        name:
                          name.toUpperCase(),
                        code:
                          generateCode(
                            name
                          ),
                        status:
                          'active',
                      })

                  if (error) {
                    alert(
                      error.message
                    )
                    return
                  }

                  window.location.reload()
                }}
                className="
                  flex-1
                  rounded-xl
                  bg-cyan-500
                  py-3
                  font-semibold
                  text-black
                "
              >
                Lưu
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  )
}