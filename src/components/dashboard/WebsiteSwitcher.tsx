"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle, Search, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSiteContext } from "@/components/dashboard/SiteContext";
import Link from "next/link";

export default function WebsiteSwitcher() {
  const { websites, selectedSite, setSelectedSite } = useSiteContext();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-xl bg-zinc-50 border-zinc-200 shadow-none hover:bg-zinc-100 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 transition-all font-bold h-11"
        >
          <div className="flex items-center gap-2 truncate">
            <Globe className="h-4 w-4 text-rose-500 shrink-0" />
            <span className="truncate">
              {selectedSite ? selectedSite.url.replace(/^https?:\/\//, '') : "Select site..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl border-zinc-100 dark:border-white/10 overflow-hidden z-[100]">
        <Command className="bg-white dark:bg-zinc-950">
          <div className="flex items-center border-b border-zinc-100 dark:border-white/5 px-3">
             <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
             <CommandInput 
               placeholder="Search websites..." 
               className="h-11 border-none bg-transparent focus:ring-0 text-sm" 
             />
          </div>
          <CommandList className="max-h-[300px] overflow-y-auto p-1">
            <CommandEmpty className="py-6 text-center text-xs text-zinc-500 font-medium">
              No websites found.
            </CommandEmpty>
            <CommandGroup heading="Your Ecosystem" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-2 py-2">
              {websites.map((site) => (
                <CommandItem
                  key={site.id}
                  onSelect={() => {
                    setSelectedSite(site);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 aria-selected:bg-zinc-100 dark:aria-selected:bg-white/10 transition-colors"
                >
                  <Globe className={cn(
                    "h-4 w-4 shrink-0",
                    selectedSite?.id === site.id ? "text-rose-500" : "text-zinc-400"
                  )} />
                  <span className="flex-1 truncate text-xs font-semibold">
                    {site.url.replace(/^https?:\/\//, '')}
                  </span>
                  {selectedSite?.id === site.id && (
                    <Check className="h-4 w-4 text-rose-500" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          
          <CommandSeparator className="bg-zinc-100 dark:bg-white/5" />
          
          <div className="p-1">
            <Link href="/sites" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-rose-500/5 text-rose-500 transition-colors cursor-pointer">
                <PlusCircle className="h-4 w-4 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-widest">Add New Site</span>
              </div>
            </Link>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
