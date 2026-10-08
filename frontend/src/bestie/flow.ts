import { api } from '../lib/api';

export interface BestieMessagePayload {
  message: string;
  history?: { role: string; content: string }[];
}

export async function processBestieQuery(message: string, alreadyShownIds: string[] = []) {
  try {
    const res = await api.agentChat(message, alreadyShownIds);
    let products: any[] = res.catalog_products_suggested || [];
    if (products.length === 0 && (res.intent === 'shopping_expansion' || /buy|shop|recommend|party|dress|shoe|blazer|outfit|wedding|formal/i.test(message))) {
      try {
        const catalog = await api.getProducts();
        const unshown = catalog.filter(p => !alreadyShownIds.includes(p.id));
        const pool = unshown.length > 0 ? unshown : catalog;
        products = pool.slice(0, 3);
      } catch (e) {
        console.warn('Failed to load catalog products for Bestie', e);
      }
    }
    return {
      text: res.reply,
      score: res.final_score,
      traces: res.traces,
      intent: res.intent,
      plan: res.plan_summary,
      products
    };
  } catch (err) {
    const chatRes = await api.sendChat(message);
    return {
      text: chatRes.reply,
      products: chatRes.catalog_products_suggested || []
    };
  }
}
