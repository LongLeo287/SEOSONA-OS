"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { api } from "@/trpc/client"
import { format } from "date-fns"
import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { motion } from "motion/react"

export default function CouponsPage() {
  const utils = api.useUtils()
  const { data: coupons, isLoading } =
    api.anBilling.coupons.listCoupons.useQuery()

  const [code, setCode] = useState("")
  const [amountDollars, setAmountDollars] = useState("")
  const [maxRedemptions, setMaxRedemptions] = useState("")
  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { data: redemptions } =
    api.anBilling.coupons.listRedemptions.useQuery(
      { couponId: selectedCouponId! },
      { enabled: !!selectedCouponId },
    )

  const createMutation = api.anBilling.coupons.createCoupon.useMutation({
    onSuccess: () => {
      toast.success("Coupon created")
      setCode("")
      setAmountDollars("")
      setMaxRedemptions("")
      utils.anBilling.coupons.listCoupons.invalidate()
    },
    onError: (err) => { toast.error(err.message) },
  })

  const toggleMutation =
    api.anBilling.coupons.toggleCoupon.useMutation({
      onSuccess: (data) => {
        toast.success(data.is_active ? "Coupon activated" : "Coupon deactivated")
        utils.anBilling.coupons.listCoupons.invalidate()
      },
      onError: (err) => { toast.error(err.message) },
    })

  const handleCreate = () => {
    const cents = Math.round(Number(amountDollars) * 100)
    if (cents < 1) {
      toast.error("Amount is required")
      return
    }
    createMutation.mutate({
      code: code.trim() || undefined,
      amountCents: cents,
      maxRedemptions: maxRedemptions ? Number(maxRedemptions) : undefined,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4 p-4"
    >
      {/* Create Form */}
      <div className="rounded-lg border-[0.5px] border-border p-4 space-y-3">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
          Create Coupon
        </div>
        <div className="flex gap-3 items-center">
          <Input
            placeholder="CODE (optional, auto-generated)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-[13px] w-52 uppercase"
          />
          <Input
            placeholder="Amount ($)"
            type="number"
            step="0.01"
            min="0.01"
            value={amountDollars}
            onChange={(e) => setAmountDollars(e.target.value)}
            className="text-[13px] w-28"
          />
          <Input
            placeholder="Max redemptions"
            type="number"
            min="1"
            value={maxRedemptions}
            onChange={(e) => setMaxRedemptions(e.target.value)}
            className="text-[13px] w-36"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleCreate}
            disabled={createMutation.isPending}
            className="text-[13px] flex-shrink-0"
          >
            {createMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </div>
        <p className="text-[12px] text-muted-foreground">
          Coupon codes are case-insensitive and will be stored in uppercase.
        </p>
      </div>

      {/* Coupons List */}
      <div className="rounded-lg border-[0.5px] border-border overflow-hidden">
        {/* Header */}
        <div
          className="grid grid-cols-[1fr_80px_100px_100px_90px] gap-2 px-4 py-2 bg-muted/30 border-b-[0.5px] border-border"
        >
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Code</span>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Amount</span>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Redeemed</span>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Created</span>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium text-right">Status</span>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="px-4 py-8 text-center text-[13px] text-muted-foreground">
            Loading...
          </div>
        ) : !coupons?.length ? (
          <div className="px-4 py-8 text-center text-[13px] text-muted-foreground">
            No coupons yet
          </div>
        ) : (
          coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="grid grid-cols-[1fr_80px_100px_100px_90px] gap-2 px-4 items-center h-12 border-b-[0.5px] border-border cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() =>
                setSelectedCouponId(
                  selectedCouponId === coupon.id ? null : coupon.id,
                )
              }
            >
              <span className="font-mono text-[13px] truncate flex items-center gap-1.5">
                {coupon.code}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigator.clipboard.writeText(coupon.code)
                    setCopiedId(coupon.id)
                    setTimeout(() => setCopiedId(null), 1500)
                  }}
                  className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                >
                  {copiedId === coupon.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </span>
              <span className="text-[13px] tabular-nums">
                ${(coupon.amount_cents / 100).toFixed(2)}
              </span>
              <span className="text-[13px] tabular-nums">
                {coupon._count.redemptions}
                {coupon.max_redemptions !== null
                  ? ` / ${coupon.max_redemptions}`
                  : ""}
              </span>
              <span className="text-[12px] text-muted-foreground">
                {format(new Date(coupon.created_at), "MMM dd, yyyy")}
              </span>
              <span className="flex justify-end">
                <Switch
                  checked={coupon.is_active}
                  onCheckedChange={() => {
                    toggleMutation.mutate({ couponId: coupon.id })
                  }}
                  disabled={toggleMutation.isPending}
                  onClick={(e) => e.stopPropagation()}
                />
              </span>
            </div>
          ))
        )}
      </div>

      {/* Redemptions Panel */}
      {selectedCouponId && redemptions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="rounded-lg border-[0.5px] border-border overflow-hidden"
        >
          <div className="px-4 py-2.5 bg-muted/30 border-b-[0.5px] border-border">
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">
              Redemptions for{" "}
            </span>
            <span className="font-mono text-[12px] text-foreground">
              {coupons?.find((c) => c.id === selectedCouponId)?.code}
            </span>
          </div>

          {redemptions.length === 0 ? (
            <div className="px-4 py-8 text-center text-[13px] text-muted-foreground">
              No redemptions yet
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1fr_140px_1fr] gap-2 px-4 py-2 bg-muted/30 border-b-[0.5px] border-border">
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Team</span>
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Redeemed At</span>
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">Metronome Credit ID</span>
              </div>
              {redemptions.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[1fr_140px_1fr] gap-2 px-4 items-center h-12 border-b-[0.5px] border-border"
                >
                  <span className="text-[13px] truncate">
                    {r.team.name}{" "}
                    <span className="text-muted-foreground text-[11px]">
                      ({r.team.id})
                    </span>
                  </span>
                  <span className="text-[12px] text-muted-foreground">
                    {format(
                      new Date(r.redeemed_at),
                      "MMM dd, yyyy HH:mm",
                    )}
                  </span>
                  <span className="font-mono text-[12px] text-muted-foreground truncate">
                    {r.metronome_credit_id ?? "—"}
                  </span>
                </div>
              ))}
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
