import { PlusIcon, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  marketShare?: number;
};

type LogoCloudProps = React.ComponentProps<"div">;

// Live market share data from Statcounter (March 2026)
// Source: https://gs.statcounter.com/search-engine-market-share
const MARKET_SHARE_DATA: Record<string, number> = {
  google: 89.85,
  bing: 5.13,
  yahoo: 1.48,
  duckduckgo: 0.75,
  baidu: 0.53,
  yandex: 1.3,
  naver: 0.15, // Added Naver
  ask: 0.51,
  ecosia: 0.45,
};

export function LogoCloud({ className, ...props }: LogoCloudProps) {
  return (
    <div className="space-y-4">
      <div
        className={cn(
          "relative grid grid-cols-2 border-x md:grid-cols-4",
          className
        )}
        {...props}
      >
      <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t" />

      <LogoCard
        className="relative border-r border-b bg-secondary dark:bg-secondary/30"
        logo={{
          src: "/engines/google-wordmark.svg",
          alt: "Google Logo",
          marketShare: MARKET_SHARE_DATA.google,
        }}
      >
        <PlusIcon
          className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6"
          strokeWidth={1}
        />
      </LogoCard>

      <LogoCard
        className="border-b md:border-r"
        logo={{
          src: "/engines/bing.svg",
          alt: "Bing Logo",
          marketShare: MARKET_SHARE_DATA.bing,
        }}
      />

      <LogoCard
        className="relative border-r border-b md:bg-secondary dark:md:bg-secondary/30"
        logo={{
          src: "/engines/yahoo.png",
          alt: "Yahoo Logo",
          marketShare: MARKET_SHARE_DATA.yahoo,
        }}
      >
        <PlusIcon
          className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6"
          strokeWidth={1}
        />
        <PlusIcon
          className="-bottom-[12.5px] -left-[12.5px] absolute z-10 hidden size-6 md:block"
          strokeWidth={1}
        />
      </LogoCard>

      <LogoCard
        className="relative border-b bg-secondary md:bg-background dark:bg-secondary/30 md:dark:bg-background"
        logo={{
          src: "/engines/duckduckgo.png",
          alt: "DuckDuckGo Logo",
          marketShare: MARKET_SHARE_DATA.duckduckgo,
        }}
      />

      <LogoCard
        className="relative border-r border-b bg-secondary md:border-b-0 md:bg-background dark:bg-secondary/30 md:dark:bg-background"
        logo={{
          src: "/engines/baidu.png",
          alt: "Baidu Logo",
          marketShare: MARKET_SHARE_DATA.baidu,
        }}
      >
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <Badge className="h-4 px-1 text-[7px] bg-rose-500/10 text-rose-500 border-none uppercase font-black">API</Badge>
          <Badge className="h-4 px-1 text-[7px] bg-amber-500/10 text-amber-500 border-none uppercase font-black">Beta</Badge>
        </div>
        <PlusIcon
          className="-right-[12.5px] -bottom-[12.5px] md:-left-[12.5px] absolute z-10 size-6 md:hidden"
          strokeWidth={1}
        />
      </LogoCard>

      <LogoCard
        className="relative border-b bg-background md:border-r md:border-b-0 md:bg-secondary dark:md:bg-secondary/30"
        logo={{
          src: "/engines/yandex.png",
          alt: "Yandex Logo",
          marketShare: MARKET_SHARE_DATA.yandex,
        }}
      >
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <Badge className="h-4 px-1 text-[7px] bg-rose-500/10 text-rose-500 border-none uppercase font-black">API</Badge>
          <Badge className="h-4 px-1 text-[7px] bg-amber-500/10 text-amber-500 border-none uppercase font-black">Beta</Badge>
        </div>
      </LogoCard>

      <LogoCard
        className="relative border-r md:border-r-0"
        logo={{
          src: "/engines/naver.png",
          alt: "Naver Logo",
          marketShare: MARKET_SHARE_DATA.naver,
        }}
      >
         <div className="absolute top-2 left-2 flex items-center gap-1">
          <Badge className="h-4 px-1 text-[7px] bg-rose-500/10 text-rose-500 border-none uppercase font-black">API</Badge>
          <Badge className="h-4 px-1 text-[7px] bg-amber-500/10 text-amber-500 border-none uppercase font-black">Beta</Badge>
        </div>
      </LogoCard>

      <LogoCard
        className="border-r"
        logo={{
          src: "/engines/ask.png",
          alt: "Ask Logo",
          marketShare: MARKET_SHARE_DATA.ask,
        }}
      />

      <LogoCard
        className="bg-secondary dark:bg-secondary/30"
        logo={{
          src: "/engines/ecosia.png",
          alt: "Ecosia Logo",
          marketShare: MARKET_SHARE_DATA.ecosia,
        }}
      />

      <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b" />
      </div>

      {/* Statcounter Attribution */}
      <div className="flex items-center justify-center gap-2 border-t pt-3 text-xs text-muted-foreground">
        <span>Market share data from</span>
        <a
          href="https://gs.statcounter.com/search-engine-market-share"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium hover:text-foreground transition-colors"
        >
          Statcounter
          <ExternalLink className="h-3 w-3" />
        </a>
        <span>• March 2026</span>
      </div>
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col items-center justify-center bg-background px-4 py-8 md:p-8 transition-all hover:bg-secondary/50",
        className
      )}
      {...props}
    >
      <img
        alt={logo.alt}
        className="pointer-events-none h-4 select-none object-contain md:h-5"
        height={logo.height || "auto"}
        src={logo.src}
        width={logo.width || "auto"}
      />
      {logo.marketShare && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {logo.marketShare}%
        </div>
      )}
      {children}
    </div>
  );
}
