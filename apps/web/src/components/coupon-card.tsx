"use client";

import { useState } from "react";
import { Copy, Check, ShieldCheck, Clock, Users, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: "percent" | "fixed" | "shipping" | "bogo";
  discount: string;
  savingsAmount: number;
  retailer: string;
  verified: boolean;
  lastVerified: string;
  successRate: number;
  usedCount: number;
  expiresAt: string | null;
  isBest: boolean;
  isExpired: boolean;
}

export function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(coupon.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 transition-all",
        coupon.isExpired
          ? "border-slate-100 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900/30"
          : coupon.isBest
          ? "border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm dark:border-emerald-800 dark:from-emerald-950/30 dark:to-slate-900"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
      )}
    >
      {/* Best badge ribbon */}
      {coupon.isBest && !coupon.isExpired && (
        <div className="absolute right-0 top-0">
          <div className="rounded-bl-lg bg-emerald-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            Best code
          </div>
        </div>
      )}

      {/* Top row: type pill + expiry */}
      <div className="mb-3 flex items-center justify-between">
        <span className={cn(
          "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          coupon.type === "percent" && "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50",
          coupon.type === "fixed" && "bg-blue-50 text-blue-600 dark:bg-blue-950/50",
          coupon.type === "shipping" && "bg-purple-50 text-purple-600 dark:bg-purple-950/50",
          coupon.type === "bogo" && "bg-amber-50 text-amber-600 dark:bg-amber-950/50",
        )}>
          <Tag className="h-3 w-3" />
          {coupon.type === "percent" && "% Off"}
          {coupon.type === "fixed" && "$ Off"}
          {coupon.type === "shipping" && "Free Shipping"}
          {coupon.type === "bogo" && "BOGO"}
        </span>
        {coupon.expiresAt && (
          <span className={cn(
            "flex items-center gap-1 text-xs",
            coupon.isExpired ? "text-red-500" : "text-slate-400"
          )}>
            <Clock className="h-3 w-3" />
            {coupon.isExpired ? "Expired" : `Expires ${coupon.expiresAt}`}
          </span>
        )}
      </div>

      {/* Code + Copy button */}
      <div className="mb-3 flex items-center gap-2">
        <div className={cn(
          "flex-1 rounded-lg border-2 border-dashed px-4 py-2.5 text-center",
          coupon.isExpired
            ? "border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
            : "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
        )}>
          <span className={cn(
            "font-mono text-lg font-bold tracking-widest",
            coupon.isExpired
              ? "text-slate-400 line-through"
              : "text-slate-900 dark:text-slate-100"
          )}>
            {coupon.code}
          </span>
        </div>
        <Button
          size="sm"
          variant={copied ? "default" : coupon.isBest ? "default" : "secondary"}
          className={cn(
            "shrink-0 gap-1.5 transition-all",
            copied && "bg-emerald-500 hover:bg-emerald-500"
          )}
          onClick={handleCopy}
          disabled={coupon.isExpired}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Discount description */}
      <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
        {coupon.description}
        {!coupon.isExpired && coupon.savingsAmount > 0 && (
          <span className="ml-1.5 font-bold text-emerald-600">
            · Save ${coupon.savingsAmount.toFixed(2)}
          </span>
        )}
      </p>

      {/* Verification + stats row */}
      {!coupon.isExpired && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {coupon.verified && (
            <span className="flex items-center gap-1 font-medium text-emerald-600">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified {coupon.lastVerified}
            </span>
          )}
          <span className="flex items-center gap-1">
            <div className={cn(
              "h-1.5 w-1.5 rounded-full",
              coupon.successRate >= 80 ? "bg-emerald-400" :
              coupon.successRate >= 60 ? "bg-amber-400" : "bg-red-400"
            )} />
            {coupon.successRate}% success rate
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {coupon.usedCount.toLocaleString()} uses
          </span>
          <span>{coupon.retailer}</span>
        </div>
      )}
    </div>
  );
}
