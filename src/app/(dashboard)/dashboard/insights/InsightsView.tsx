"use client";

import { useEffect, useState, useMemo } from "react";
import { useSiteContext } from "@/components/dashboard/SiteContext";
import PageHeader from "@/components/dashboard/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSiteInsightsAction } from "@/app/(dashboard)/actions";
import { useStackApp } from "@stackframe/stack";
import { Button } from "@/components/ui/button";
import { LineChart as LucideLineChart, AlertCircle, RotateCw, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type GscRow = {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export default function InsightsView() {
  const { selectedSite } = useSiteContext();
  const stack = useStackApp();
  const [data, setData] = useState<GscRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!selectedSite?.id) return;
      if (!selectedSite.gscConnected) {
        setError("This site is not connected to Google Search Console.");
        setData(null);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      const res = await getSiteInsightsAction(selectedSite.id);
      if (res.status === "error") {
        setError(res.message || "Failed to load insights.");
      } else if (res.data) {
        const mappedData: GscRow[] = res.data.map(row => ({
          keys: row.keys ?? [],
          clicks: row.clicks ?? 0,
          impressions: row.impressions ?? 0,
          ctr: row.ctr ?? 0,
          position: row.position ?? 0,
        }));
        setData(mappedData);
      }
      
      setLoading(false);
    }
    
    loadData();
  }, [selectedSite]);

  const chartData = useMemo(() => {
    if (!data) return [];
    // Sort by date (keys[0] contains the date string like YYYY-MM-DD)
    return [...data]
      .sort((a, b) => a.keys[0].localeCompare(b.keys[0]))
      .map(row => ({
        date: new Date(row.keys[0]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: (row.ctr * 100).toFixed(2),
        position: parseFloat(row.position.toFixed(1))
      }));
  }, [data]);

  const totals = useMemo(() => {
    if (!data) return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    const clicks = data.reduce((sum, row) => sum + row.clicks, 0);
    const impressions = data.reduce((sum, row) => sum + row.impressions, 0);
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const position = data.reduce((sum, row) => sum + row.position, 0) / (data.length || 1);
    
    return { clicks, impressions, ctr: ctr.toFixed(2), position: position.toFixed(1) };
  }, [data]);

  if (!selectedSite) {
    return (
      <div className="space-y-6">
        <PageHeader title="Search Insights" description="GSC Performance data for your site." />
        <Card className="p-12 text-center text-muted-foreground border-dashed bg-muted/30">
          <LucideLineChart className="w-8 h-8 mx-auto mb-4 text-muted-foreground/30" />
          <p>Please select a website from the sidebar to view insights.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Search Insights"
          description={`Performance over the last 28 days for ${selectedSite.url.replace(/^https?:\/\//, '')}`}
        />
        <Badge className="w-fit h-fit bg-rose-500/10 text-rose-500 border-none px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
          Available for Premium Plan
        </Badge>
      </div>

      {error ? (
        <Alert variant="destructive" className="rounded-[24px] border-rose-500/20 bg-rose-500/5 py-6">
          <div className="flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-rose-500" />
            <div className="flex-1">
              <AlertDescription className="text-sm font-medium text-rose-600 dark:text-rose-400">
                {error}
              </AlertDescription>
            </div>
            {error.includes("re-authenticate") && (
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl border-rose-200 bg-white px-4 hover:bg-rose-50 dark:border-rose-900 dark:bg-zinc-900"
                onClick={() => window.location.href = stack.urls.accountSettings}
              >
                <ShieldCheck className="mr-2 h-4 w-4" />
                Grant Permissions
              </Button>
            )}
          </div>
        </Alert>
      ) : loading ? (
        <div className="flex justify-center p-12">
          <RotateCw className="w-6 h-6 animate-spin text-zinc-400" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="rounded-[32px] overflow-hidden border-zinc-100 shadow-sm dark:border-white/5 dark:bg-zinc-900/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-widest font-bold">Total Clicks</CardDescription>
                <CardTitle className="text-3xl tracking-tight font-light text-pink-500">{totals.clicks}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="rounded-[32px] overflow-hidden border-zinc-100 shadow-sm dark:border-white/5 dark:bg-zinc-900/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-widest font-bold">Total Impressions</CardDescription>
                <CardTitle className="text-3xl tracking-tight font-light text-purple-500">{totals.impressions}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="rounded-[32px] overflow-hidden border-zinc-100 shadow-sm dark:border-white/5 dark:bg-zinc-900/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-widest font-bold">Average CTR</CardDescription>
                <CardTitle className="text-3xl tracking-tight font-light text-pink-500">{totals.ctr}%</CardTitle>
              </CardHeader>
            </Card>
            <Card className="rounded-[32px] overflow-hidden border-zinc-100 shadow-sm dark:border-white/5 dark:bg-zinc-900/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs uppercase tracking-widest font-bold">Avg. Position</CardDescription>
                <CardTitle className="text-3xl tracking-tight font-light text-amber-500">{totals.position}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="rounded-[32px] p-6 border-zinc-100 shadow-sm dark:border-white/5 dark:bg-zinc-900/40">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-zinc-500">Clicks & Impressions</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#888' }} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10} 
                  />
                  <YAxis 
                    yAxisId="left" 
                    tick={{ fontSize: 12, fill: '#888' }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tick={{ fontSize: 12, fill: '#888' }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="clicks" 
                    name="Clicks" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={false} 
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                  />
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="impressions" 
                    name="Impressions" 
                    stroke="#a855f7" 
                    strokeWidth={3} 
                    dot={false} 
                    activeDot={{ r: 6, strokeWidth: 0 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-12 text-center text-muted-foreground border-dashed bg-muted/30">
          <p>No analytics data available for this date range.</p>
        </Card>
      )}
    </div>
  );
}
