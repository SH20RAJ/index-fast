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
          aria-label="Select website"
          aria-expanded={open}
          className="w-full justify-between rounded-xl bg-zinc-50/50 border-zinc-200/60 shadow-none hover:bg-zinc-100 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 transition-all font-semibold h-11 px-3"
        >
          <div className="flex items-center gap-2.5 truncate">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
            <span className="truncate text-sm tracking-tight">
              {selectedSite ? selectedSite.url.replace(/^https?:\/\//, '').replace(/\/$/, '') : "Select website"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-40" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl border-border bg-popover overflow-hidden z-[100]" align="start">
        <Command className="bg-transparent">
          <div className="flex items-center border-b border-border/50 px-3">
             <Search className="mr-2 h-4 w-4 shrink-0 opacity-40" aria-hidden="true" />
             <CommandInput 
               placeholder="Search sites…" 
               className="h-11 border-none bg-transparent focus:ring-0 text-sm" 
               aria-label="Search sites"             />
          </div>
          <CommandList className="max-h-[280px] overflow-y-auto p-1.5">
            <CommandEmpty className="py-8 text-center text-xs text-muted-foreground font-medium">
              No websites found.
            </CommandEmpty>
            <CommandGroup heading="Websites" className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 px-3 py-2">
              {websites.map((site) => (
                <CommandItem
                  key={site.id}
                  onSelect={() => {
                    setSelectedSite(site);
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-accent aria-selected:bg-accent transition-colors mb-0.5"
                >
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    selectedSite?.id === site.id 
                      ? "bg-primary/10 border-primary/20 text-primary" 
                      : "bg-muted border-border/50 text-muted-foreground"
                  )}>
                    <Globe className="h-3.5 w-3.5" />
                  </div>
                  <span className={cn(
                    "flex-1 truncate text-xs font-medium tracking-tight",
                    selectedSite?.id === site.id ? "text-foreground font-semibold" : "text-muted-foreground"
                  )}>
                    {site.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </span>
                  {selectedSite?.id === site.id && (
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          
          <CommandSeparator className="bg-border/50" />
          
          <div className="p-1.5">
            <Link href="/sites/new" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-primary/5 text-primary transition-colors cursor-pointer group">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <PlusCircle className="h-4 w-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Add site</span>
              </div>
            </Link>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
