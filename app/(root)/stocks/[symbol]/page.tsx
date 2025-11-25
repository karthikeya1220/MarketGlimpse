import TradingViewWidget from "@/components/TradingViewWidget";
import StockHeader from "@/components/StockHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Activity,
  Building2,
  DollarSign 
} from "lucide-react";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Stock Header */}
      <StockHeader 
        symbol={symbol.toUpperCase()} 
        company={symbol.toUpperCase()}
        isInWatchlist={false}
      />

      {/* Symbol Info Widget */}
      <Card className="border-gray-600 bg-gray-800/50">
        <CardContent className="p-0">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}symbol-info.js`}
            config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
            height={170}
          />
        </CardContent>
      </Card>

      {/* Main Content - Charts and Analysis */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="financials" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Financials
          </TabsTrigger>
        </TabsList>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-gray-600 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                  Candlestick Chart
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TradingViewWidget
                  scriptUrl={`${scriptUrl}advanced-chart.js`}
                  config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                  className="custom-chart"
                  height={600}
                />
              </CardContent>
            </Card>

            <Card className="border-gray-600 bg-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-yellow-500" />
                  Baseline Chart
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <TradingViewWidget
                  scriptUrl={`${scriptUrl}advanced-chart.js`}
                  config={BASELINE_WIDGET_CONFIG(symbol)}
                  className="custom-chart"
                  height={600}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis">
          <Card className="border-gray-600 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-yellow-500" />
                Technical Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingViewWidget
                scriptUrl={`${scriptUrl}technical-analysis.js`}
                config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                height={400}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company">
          <Card className="border-gray-600 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-yellow-500" />
                Company Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingViewWidget
                scriptUrl={`${scriptUrl}company-profile.js`}
                config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
                height={440}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financials Tab */}
        <TabsContent value="financials">
          <Card className="border-gray-600 bg-gray-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-yellow-500" />
                Financial Statements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TradingViewWidget
                scriptUrl={`${scriptUrl}financials.js`}
                config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
                height={464}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pro Tips */}
      <Card className="border-gray-600 bg-gradient-to-r from-gray-800/50 to-gray-800/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="bg-yellow-500/10 rounded-lg p-2 flex-shrink-0">
              <FileText className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Analysis Tips</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Use the tabs above to switch between different views and analysis tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Candlestick charts show price movements with open, high, low, and close values</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Technical analysis provides insights on buy/sell signals and market sentiment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Check company financials for detailed earnings, revenue, and balance sheet data</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}