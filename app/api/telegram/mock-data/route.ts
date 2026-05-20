import { NextResponse } from 'next/server';
import { mockNews, mockMarketTrends } from '@/lib/mock-data';

export async function GET() {
  try {
    const news = mockNews.map(n => ({
      headline: n.headline,
      body: n.body,
      tickers: n.tickers || []
    }));
    
    const trends = mockMarketTrends.map(t => ({
      symbol: t.symbol,
      name: t.name,
      sentiment: t.sentiment,
      impactLevel: t.impactLevel,
      score: t.score
    }));

    return NextResponse.json({
      success: true,
      mockNews: news,
      mockMarketTrends: trends
    });
  } catch (error) {
    console.error('Error fetching mock data:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
