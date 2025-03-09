"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { Button } from "./Button";
import toast from "react-hot-toast";

interface AuctionItemCardProps {
  title: string;
  highestBid: number;
  startPrice: number;
  minIncrease: number;
  description: string;
  image: string;
  auctionId: string;
}

export default function AuctionItemCard({
  title,
  highestBid,
  startPrice,
  minIncrease,
  description,
  image,
  auctionId,
}: AuctionItemCardProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({ amount: "", nameOfBidder: "" });
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(formData.amount) < highestBid + minIncrease) {
      toast.error("Budet må være minst " + (highestBid + minIncrease) + "kr");
      return;
    }

    if (formData.nameOfBidder === "") {
      toast.error("Du må fylle inn navnet ditt.");
      return;
    }

    try {
      const response = await fetch("/api/add-bid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number.parseFloat(formData.amount),
          nameOfBidder: formData.nameOfBidder,
          auctionId: auctionId,
        }),
      });

      if (response.ok) {
        setOpen(false);
        window.location.reload();
        toast.success("Bud sendt inn!");
      } else {
        toast.error("Kunne ikke sende inn bud.");
      }
    } catch (error) {
      toast.error("Feil ved innsending av bud: " + error);
      toast.error("En feil oppstod ved innsending av budet ditt.");
    }
  };

  const minBid = highestBid === 0 ? startPrice : highestBid + minIncrease;

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full">
      <div className="space-y-2">
        <Label htmlFor="nameOfBidder" className="text-slate-300">
          Navnet ditt:
        </Label>
        <Input
          id="nameOfBidder"
          type="text"
          placeholder="Ola Nordmann"
          value={formData.nameOfBidder}
          onChange={(e) =>
            setFormData({ ...formData, nameOfBidder: e.target.value })
          }
          required
          className="bg-slate-700 border-slate-600 text-white focus:border-teal-500 focus:ring-teal-500/20"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount" className="text-slate-300">
          Beløp: (minst {minBid}kr)
        </Label>
        <Input
          id="amount"
          placeholder="1000"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
          className="bg-slate-700 border-slate-600 text-white focus:border-teal-500 focus:ring-teal-500/20"
          min={minBid}
        />
      </div>
      <div className="flex justify-between pt-4 gap-4 sm:gap-8 mt-auto">
        <Button type="button" onClick={() => setOpen(false)} color="red">
          Avbryt
        </Button>
        <Button type="submit" color="green">
          Send bud
        </Button>
      </div>
    </form>
  );

  return (
    <div className="h-full">
      <div
        className="bg-gradient-to-br border border-gray-700 from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,200,200,0.15)] m-2 sm:m-4 text-left cursor-pointer transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,200,200,0.3)] hover:translate-y-[-5px] h-full flex flex-col"
        onClick={() => setOpen(true)}
      >
        <div className="relative">
          <img
            src={image || "/placeholder.svg?height=208&width=384"}
            alt={title}
            className="w-full h-40 sm:h-52 object-cover brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
          <div className="absolute bottom-2 sm:bottom-3 left-3 sm:left-4 right-3 sm:right-4">
            <div className="text-white font-bold text-xl sm:text-2xl drop-shadow-md line-clamp-2">
              {title}
            </div>
          </div>
        </div>
        <div className="px-3 sm:px-6 py-3 sm:py-4 flex flex-col flex-grow">
          <div className="flex flex-col justify-between rounded-md px-3 sm:px-4 py-2 sm:py-3 bg-slate-700/50 backdrop-blur-sm border border-teal-500/20">
            <div className="flex text-base sm:text-lg text-slate-300">
              {highestBid === 0 ? (
                <span className="flex-1">Minimum bud:</span>
              ) : (
                <span className="flex-1">Høyeste bud:</span>
              )}
              <span className="flex-1">Minimum økning:</span>
            </div>
            <div className="flex text-xl sm:text-3xl text-white">
              <span className="flex-1 font-bold text-teal-400">
                {highestBid === 0 ? minBid : highestBid},-
              </span>
              <span className="flex-1">{minIncrease},-</span>
            </div>
          </div>

          <p className="text-slate-300 mt-3 sm:mt-4 mb-3 sm:mb-4 text-base sm:text-lg leading-relaxed line-clamp-4 sm:line-clamp-6 flex-grow">
            {description}
          </p>

          <div className="mt-auto pt-2">
            <Button color="green">Gi bud</Button>
          </div>
        </div>
      </div>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-slate-800 border border-teal-500/30 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-teal-400">
                By på {title}
              </DialogTitle>
            </DialogHeader>
            {formContent}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="bg-slate-800 text-white border-t border-teal-500/30">
            <DrawerHeader className="border-b border-slate-700">
              <DrawerTitle className="text-xl font-bold text-teal-400">
                By på {title}
              </DrawerTitle>
            </DrawerHeader>
            <div className="px-4 py-4">{formContent}</div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
