"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export interface ShopDetailDTO {
  shopId: number
  shopName: string
  manageName: string
  businessAddress: string
  createdAt: string
  status: string
  invoiceEmail?: string
  phone?: string
  businessType?: string

  description: string
  imageShop?: string
  taxCode: string
  mainCategory: string
  customerEmail: string
  gender: string
  dob: string
  address: string
  idNumber: string
  frontIdImage?: string
  backIdImage?: string
}

interface Props {
  shop: ShopDetailDTO | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Chuyển path hoặc base64 thành src hợp lệ cho next/image
 */
function makeUrl(path?: string) {
  if (!path) return ""
  if (path.startsWith("data:")) return path
  if (/^[A-Za-z0-9+/=]+$/.test(path)) {
    return `data:image/png;base64,${path}`
  }
  if (path.startsWith("http")) return path
  const base = (process.env.NEXT_PUBLIC_API_BACKEND || "").replace(/\/$/, "")
  const p = path.replace(/^\//, "")
  return `${base}/${p}`
}

export function ShopDetailModal({ shop, open, onOpenChange }: Props) {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  if (!shop) return null

  return (
    <>
      {/* Modal Chi tiết Shop */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Chi tiết Shop #{shop.shopId}</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <p><strong>Tên shop:</strong> {shop.shopName}</p>
            <p><strong>Quản lý:</strong> {shop.manageName}</p>
            <p><strong>Địa chỉ kinh doanh:</strong> {shop.businessAddress}</p>
            <p><strong>Ngày tạo:</strong> {shop.createdAt}</p>
            <p><strong>Trạng thái:</strong> {shop.status}</p>
            <p><strong>Loại hình:</strong> {shop.businessType}</p>
            <p><strong>Mô tả:</strong> {shop.description}</p>
            <p><strong>Danh mục chính:</strong> {shop.mainCategory}</p>
            <p><strong>Email khách hàng:</strong> {shop.customerEmail}</p>
            <p><strong>Giới tính:</strong> {shop.gender}</p>
            <p><strong>Ngày sinh:</strong> {shop.dob}</p>
            <p><strong>Địa chỉ KH:</strong> {shop.address}</p>
            <p><strong>CCCD:</strong> {shop.idNumber}</p>
            <p><strong>Mã số thuế:</strong> {shop.taxCode}</p>
            <p><strong>Email hóa đơn:</strong> {shop.invoiceEmail}</p>
            <p><strong>Điện thoại shop:</strong> {shop.phone}</p>

            {shop.imageShop && (
              <div>
                <p className="mb-1 text-sm font-medium">Ảnh Shop</p>
                <Image
                  src={makeUrl(shop.imageShop)}
                  alt="Shop Image"
                  width={400}
                  height={200}
                  className="rounded object-cover cursor-pointer mb-4"
                  onClick={() => setPreviewSrc(makeUrl(shop.imageShop))}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {shop.frontIdImage && (
                <div>
                  <p className="mb-1 text-sm font-medium">Ảnh CCCD (trước)</p>
                  <Image
                    src={makeUrl(shop.frontIdImage)}
                    alt="CCCD phía trước"
                    width={256}
                    height={160}
                    className="rounded object-cover cursor-pointer"
                    onClick={() => setPreviewSrc(makeUrl(shop.frontIdImage))}
                  />
                </div>
              )}
              {shop.backIdImage && (
                <div>
                  <p className="mb-1 text-sm font-medium">Ảnh CCCD (sau)</p>
                  <Image
                    src={makeUrl(shop.backIdImage)}
                    alt="CCCD phía sau"
                    width={256}
                    height={160}
                    className="rounded object-cover cursor-pointer"
                    onClick={() => setPreviewSrc(makeUrl(shop.backIdImage))}
                  />
                </div>
              )}
            </div>
          </div>

          <DialogClose asChild>
            <Button className="mt-6">Đóng</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Modal Lightbox */}
      <Dialog open={!!previewSrc} onOpenChange={() => setPreviewSrc(null)}>
        <DialogContent className="max-w-3xl p-0 bg-transparent shadow-none">
          {/* Thêm Header & Title để Radix không báo lỗi */}
          <DialogHeader>
            <DialogTitle className="sr-only">Image Preview</DialogTitle>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute right-2 top-2 z-10 bg-white rounded-full"
              >
                ✕
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="relative">
            {previewSrc && (
              <Image
                src={previewSrc}
                alt="Preview"
                width={800}
                height={600}
                className="object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
