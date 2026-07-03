// In-memory demo backend implementing the docs/API.md contract so the entire
// app is inspectable in Expo Go with zero backend running.
import type {
  AssistantResponse,
  AuthResponse,
  Basket,
  ChatMessage,
  Country,
  Listing,
  Order,
  PaystackInit,
  Recipe,
  Review,
  SmartSearchFilters,
  User,
  Vendor,
} from '../types';
import {
  demoListings,
  demoMessages,
  demoOrders,
  demoPassport,
  demoPlans,
  demoRecipes,
  demoReviews,
  demoStories,
  demoThreads,
  demoUser,
  PHOTOS,
} from './demoData';

type Query = Record<string, string | number | boolean | null | undefined>;

// ---- mutable session state ----
const state = {
  user: { ...demoUser },
  recipes: demoRecipes.map((r) => ({ ...r })),
  listings: demoListings.map((l) => ({ ...l })),
  orders: demoOrders.map((o) => ({ ...o })),
  threads: demoThreads.map((t) => ({ ...t })),
  messages: Object.fromEntries(
    Object.entries(demoMessages).map(([k, v]) => [k, v.map((m) => ({ ...m }))])
  ) as Record<number, ChatMessage[]>,
  reviewsByRecipe: {} as Record<number, Review[]>,
  reviewsByVendor: {} as Record<number, Review[]>,
  passport: {
    ...demoPassport,
    stamps: demoPassport.stamps.map((s) => ({ ...s })),
  },
  nextId: 1000,
  myVendor: null as Vendor | null,
  myRecipes: [] as Recipe[],
  myListings: [] as Listing[],
  pendingPayment: null as { kind: 'order' | 'subscription'; orderId?: number } | null,
};

const delay = (ms = 350) => new Promise<void>((res) => setTimeout(res, ms));

class DemoError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const num = (v: Query[string]) => (v === undefined || v === null || v === '' ? null : Number(v));
const str = (v: Query[string]) => (v === undefined || v === null ? null : String(v));

function findRecipe(id: number): Recipe {
  const rec = [...state.recipes, ...state.myRecipes].find((x) => x.id === id);
  if (!rec) throw new DemoError(404, 'Recipe not found');
  return rec;
}

function filterRecipes(params: Query): Recipe[] {
  const q = str(params.q)?.toLowerCase();
  const category = str(params.category);
  const cuisine = str(params.cuisine)?.toLowerCase();
  const mealType = str(params.mealType);
  const maxCalories = num(params.maxCalories);
  const maxMinutes = num(params.maxMinutes);
  return state.recipes.filter((rec) => {
    if (q) {
      const hay = `${rec.title} ${rec.description} ${rec.cuisine} ${rec.ingredients
        .map((i) => i.name)
        .join(' ')}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (category && rec.category !== category) return false;
    if (cuisine && !rec.cuisine.toLowerCase().includes(cuisine)) return false;
    if (mealType && rec.mealType !== mealType) return false;
    if (maxCalories !== null && rec.calories > maxCalories) return false;
    if (maxMinutes !== null && rec.prepMinutes + rec.cookMinutes > maxMinutes) return false;
    return true;
  });
}

function parseSmart(q: string): SmartSearchFilters {
  const lower = q.toLowerCase();
  const filters: SmartSearchFilters = {
    q: null,
    category: null,
    maxCalories: null,
    maxMinutes: null,
    cuisine: null,
  };
  const minMatch = lower.match(/under\s+(\d+)\s*(min|minutes)/) ?? lower.match(/(\d+)\s*(min|minutes)\s+or less/);
  if (minMatch) filters.maxMinutes = Number(minMatch[1]);
  if (/\bfast|quick\b/.test(lower) && !filters.maxMinutes) filters.maxMinutes = 30;
  const calMatch = lower.match(/under\s+(\d+)\s*(kcal|calories|cal)/);
  if (calMatch) filters.maxCalories = Number(calMatch[1]);
  if (/low[- ]calorie|light|healthy/.test(lower) && !filters.maxCalories) filters.maxCalories = 450;
  if (/ghana|ghanaian/.test(lower)) filters.cuisine = 'Ghanaian';
  if (/nigeria|nigerian|naija/.test(lower)) filters.cuisine = 'Nigerian';
  if (/\bdrink|juice|cocktail|mocktail\b/.test(lower)) filters.category = 'DRINK';
  const keywords = ['plantain', 'rice', 'bean', 'yam', 'fish', 'chicken', 'beef', 'soup', 'stew', 'pepper', 'egusi', 'jollof', 'waakye', 'suya', 'banku'];
  const found = keywords.find((k) => lower.includes(k));
  if (found) filters.q = found;
  return filters;
}

function smartRecipes(filters: SmartSearchFilters): Recipe[] {
  return filterRecipes({
    q: filters.q ?? undefined,
    category: filters.category ?? undefined,
    maxCalories: filters.maxCalories ?? undefined,
    maxMinutes: filters.maxMinutes ?? undefined,
    cuisine: filters.cuisine ?? undefined,
  });
}

function recipeReviews(id: number): Review[] {
  if (!state.reviewsByRecipe[id]) {
    state.reviewsByRecipe[id] = demoReviews.map((rv, i) => ({ ...rv, id: id * 100 + i }));
  }
  return state.reviewsByRecipe[id];
}

function vendorReviews(id: number): Review[] {
  if (!state.reviewsByVendor[id]) {
    state.reviewsByVendor[id] = demoReviews
      .slice(0, 3)
      .map((rv, i) => ({ ...rv, id: id * 1000 + i }));
  }
  return state.reviewsByVendor[id];
}

function makeOrder(items: { listingId: number; qty: number }[]): { order: Order; payment: PaystackInit } {
  const listings = items.map((it) => {
    const l = state.listings.find((x) => x.id === it.listingId);
    if (!l) throw new DemoError(404, 'Listing not found');
    return { l, qty: it.qty };
  });
  const vendorIds = new Set(listings.map((x) => x.l.vendorId));
  if (vendorIds.size > 1) throw new DemoError(400, 'One order per vendor — items span multiple vendors.');
  const subtotal = listings.reduce((n, x) => n + x.l.amountMinor * x.qty, 0);
  const fee = Math.round(subtotal * 0.07);
  const delivery = 300;
  const first = listings[0].l;
  const order: Order = {
    id: ++state.nextId,
    reference: `DSP-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
    status: 'PENDING_PAYMENT',
    items: listings.map((x) => ({
      listingId: x.l.id,
      title: x.l.title,
      imageUrl: x.l.imageUrl,
      qty: x.qty,
      amountMinor: x.l.amountMinor,
    })),
    subtotalMinor: subtotal,
    feeMinor: fee,
    deliveryMinor: delivery,
    totalMinor: subtotal + fee + delivery,
    currency: first.currency,
    vendorId: first.vendorId,
    vendorName: first.vendorName,
    createdAt: new Date().toISOString(),
  };
  state.orders.unshift(order);
  const payment: PaystackInit = {
    authorizationUrl: `https://demo.dishaspora.local/pay/${order.reference}`,
    reference: order.reference,
    publicKey: 'pk_test_demo',
    amountMinor: order.totalMinor,
    currency: order.currency,
  };
  return { order, payment };
}

function assistantReply(message: string): AssistantResponse {
  const filters = parseSmart(message);
  let recipes = smartRecipes(filters).slice(0, 3);
  if (recipes.length === 0) recipes = state.recipes.slice(0, 3);
  const lower = message.toLowerCase();
  let reply: string;
  if (/plantain/.test(lower)) {
    reply =
      'Plantain is a gift! With ripe plantains you can make Kelewele (spicy ginger-fried cubes) or Red Red, where fried plantain sweetens a smoky bean stew. Here are dishes from our kitchen that use it:';
  } else if (filters.maxMinutes) {
    reply = `Short on time? These dishes come together in about ${filters.maxMinutes} minutes or less — full flavour, no shortcuts on taste:`;
  } else if (filters.maxCalories) {
    reply = `Eating light today — I like it. These come in under ${filters.maxCalories} kcal per serving while still tasting like home:`;
  } else if (filters.cuisine) {
    reply = `Ah, ${filters.cuisine} food — excellent choice. From our recipe shelf, these are the ones the community keeps coming back to:`;
  } else {
    reply =
      'Akwaaba! I looked through the Dishaspora recipe shelf and picked these for you. Tap any card for the full story, ingredients and cook-along:';
  }
  return { reply, recipes };
}

/** Resolve an API call against the demo backend. Throws {status,message} like ApiError. */
export async function demoResolve<T>(
  method: string,
  path: string,
  body?: any,
  params?: Query
): Promise<T> {
  await delay();
  const p = path.split('?')[0];
  const m = method.toUpperCase();
  const R = (v: unknown) => v as T;

  // ---- auth ----
  if (m === 'POST' && p === '/auth/login') {
    const user = { ...state.user, email: body?.email ?? state.user.email };
    state.user = user;
    return R({ token: 'demo-token', user } satisfies AuthResponse);
  }
  if (m === 'POST' && p === '/auth/register') {
    const user: User = {
      ...state.user,
      name: body?.name ?? 'New Cook',
      email: body?.email ?? 'new@demo.com',
      country: (body?.country as Country) ?? 'GH',
      premium: true,
    };
    state.user = user;
    return R({ token: 'demo-token', user } satisfies AuthResponse);
  }
  if (p === '/users/me' && m === 'GET') return R(state.user);
  if (p === '/users/me' && m === 'PUT') {
    state.user = { ...state.user, ...body };
    return R(state.user);
  }

  // ---- recipes ----
  if (m === 'GET' && p === '/recipes') {
    const list = filterRecipes(params ?? {});
    return R({ content: list, totalElements: list.length, totalPages: 1 });
  }
  if (m === 'GET' && p === '/recipes/trending') {
    return R([...state.recipes].sort((a, b) => b.rating - a.rating).slice(0, 10));
  }
  const recipeMatch = p.match(/^\/recipes\/(\d+)$/);
  if (recipeMatch && m === 'GET') return R(findRecipe(Number(recipeMatch[1])));
  if (m === 'POST' && p === '/recipes') {
    const rec: Recipe = {
      savedByMe: false,
      cookedByMe: false,
      rating: 0,
      reviewCount: 0,
      hasVideo: !!body?.videoUrl,
      hasAudio: !!body?.audioUrl,
      videoUrl: body?.videoUrl ?? null,
      audioUrl: body?.audioUrl ?? null,
      story: null,
      storyImageUrl: null,
      vendorId: state.myVendor?.id ?? null,
      vendorName: state.myVendor?.name ?? null,
      imageUrl: PHOTOS.recipe[0],
      ...body,
      id: ++state.nextId,
      status: 'PENDING',
    };
    state.myRecipes.unshift(rec);
    return R(rec);
  }
  const saveMatch = p.match(/^\/recipes\/(\d+)\/save$/);
  if (saveMatch) {
    const rec = findRecipe(Number(saveMatch[1]));
    rec.savedByMe = m === 'POST';
    return R({ saved: rec.savedByMe });
  }
  if (m === 'GET' && p === '/users/me/saved') {
    return R(state.recipes.filter((rec) => rec.savedByMe));
  }
  const cookedMatch = p.match(/^\/recipes\/(\d+)\/cooked$/);
  if (cookedMatch && m === 'POST') {
    const rec = findRecipe(Number(cookedMatch[1]));
    const firstCook = !rec.cookedByMe;
    rec.cookedByMe = true;
    const country = rec.countryOfOrigin === 'NG' ? 'NG' : rec.countryOfOrigin === 'GH' ? 'GH' : 'GH';
    const stamp = state.passport.stamps.find((s) => s.country === country) ?? state.passport.stamps[0];
    if (firstCook) {
      state.passport.totalCooked += 1;
      stamp.recipesCooked += 1;
    }
    const newStamp = firstCook && stamp.recipesCooked === 1;
    if (newStamp) {
      stamp.stamped = true;
      stamp.firstCookedAt = new Date().toISOString();
      state.passport.countriesStamped += 1;
    }
    return R({ stamp, newStamp });
  }
  const revMatch = p.match(/^\/recipes\/(\d+)\/reviews$/);
  if (revMatch && m === 'GET') return R(recipeReviews(Number(revMatch[1])));
  if (revMatch && m === 'POST') {
    const review: Review = {
      id: ++state.nextId,
      rating: body?.rating ?? 5,
      comment: body?.comment ?? '',
      userName: state.user.name,
      userAvatarUrl: state.user.avatarUrl,
      createdAt: new Date().toISOString(),
    };
    recipeReviews(Number(revMatch[1])).unshift(review);
    return R(review);
  }
  if (m === 'GET' && p === '/passport') return R(state.passport);
  if (m === 'GET' && p === '/stories') {
    return R({ content: demoStories, totalElements: demoStories.length, totalPages: 1 });
  }
  const basketMatch = p.match(/^\/recipes\/(\d+)\/basket$/);
  if (basketMatch && m === 'GET') {
    const rec = findRecipe(Number(basketMatch[1]));
    const country = state.user.country;
    const ingListings = state.listings.filter(
      (l) => l.type === 'INGREDIENT' && l.country === country
    );
    // vendor matching the most ingredients
    const byVendor = new Map<number, typeof ingListings>();
    for (const l of ingListings) {
      byVendor.set(l.vendorId, [...(byVendor.get(l.vendorId) ?? []), l]);
    }
    let best: { vendorId: number; matches: { ingredient: (typeof rec.ingredients)[number]; listing: Listing }[] } | null = null;
    for (const [vendorId, lists] of byVendor) {
      const matches = rec.ingredients.flatMap((ingredient) => {
        const listing = lists.find(
          (l) =>
            l.title.toLowerCase().includes(ingredient.name.toLowerCase().split(' ')[0]) ||
            ingredient.name.toLowerCase().includes(l.title.toLowerCase().split(' ')[0])
        );
        return listing ? [{ ingredient, listing }] : [];
      });
      if (!best || matches.length > best.matches.length) best = { vendorId, matches };
    }
    const vendor =
      best && best.matches.length > 0
        ? ((await demoResolve<Vendor>('GET', `/vendors/${best.vendorId}`)) as Vendor)
        : null;
    const items = (best?.matches ?? []).map((mt) => ({ ingredient: mt.ingredient, listing: mt.listing, qty: 1 }));
    const matchedNames = new Set(items.map((it) => it.ingredient.name));
    const basket: Basket = {
      vendor,
      items,
      totalMinor: items.reduce((n, it) => n + it.listing.amountMinor * it.qty, 0),
      currency: country === 'GH' ? 'GHS' : 'NGN',
      unmatched: rec.ingredients.filter((i) => !matchedNames.has(i.name)),
    };
    return R(basket);
  }

  // ---- marketplace ----
  if (m === 'GET' && p === '/vendors') {
    const type = str(params?.type);
    const country = str(params?.country);
    return R(
      (await import('./demoData')).demoVendors.filter(
        (v) => (!type || v.type === type || v.type === 'BOTH') && (!country || v.country === country)
      )
    );
  }
  const vendorMatch = p.match(/^\/vendors\/(\d+)$/);
  if (vendorMatch && m === 'GET') {
    const v = (await import('./demoData')).demoVendors.find((x) => x.id === Number(vendorMatch[1]));
    if (!v) throw new DemoError(404, 'Vendor not found');
    return R(v);
  }
  const vendorListMatch = p.match(/^\/vendors\/(\d+)\/listings$/);
  if (vendorListMatch && m === 'GET') {
    return R(state.listings.filter((l) => l.vendorId === Number(vendorListMatch[1])));
  }
  const vendorRevMatch = p.match(/^\/vendors\/(\d+)\/reviews$/);
  if (vendorRevMatch && m === 'GET') return R(vendorReviews(Number(vendorRevMatch[1])));
  if (vendorRevMatch && m === 'POST') {
    const review: Review = {
      id: ++state.nextId,
      rating: body?.rating ?? 5,
      comment: body?.comment ?? '',
      userName: state.user.name,
      userAvatarUrl: state.user.avatarUrl,
      createdAt: new Date().toISOString(),
    };
    vendorReviews(Number(vendorRevMatch[1])).unshift(review);
    return R(review);
  }
  if (m === 'POST' && p === '/vendors/apply') {
    state.myVendor = {
      id: 99,
      name: body?.name ?? 'My Kitchen',
      bio: body?.bio ?? '',
      country: state.user.country,
      logoUrl: body?.logoUrl ?? null,
      coverUrl: body?.coverUrl ?? null,
      type: body?.type ?? 'FOOD',
      status: 'PENDING',
      rejectionFeedback: null,
      rating: 0,
      reviewCount: 0,
      specialty: body?.specialty ?? '',
      location: body?.location ?? '',
      phone: body?.phone ?? '',
    };
    state.user = { ...state.user, vendorId: 99, role: 'VENDOR' };
    return R(state.myVendor);
  }
  if (m === 'GET' && p === '/vendors/me') {
    if (!state.myVendor) {
      // demo vendor dashboard is inspectable: pretend the user owns vendor 1
      const demoVendorsList = (await import('./demoData')).demoVendors;
      state.myVendor = { ...demoVendorsList[0], status: 'APPROVED' };
    }
    return R(state.myVendor);
  }
  if (m === 'GET' && p === '/listings') {
    const type = str(params?.type);
    const q = str(params?.q)?.toLowerCase();
    const country = str(params?.country) ?? state.user.country;
    const list = [...state.listings, ...state.myListings].filter(
      (l) =>
        (!type || l.type === type) &&
        (!q || l.title.toLowerCase().includes(q)) &&
        l.country === country
    );
    return R({ content: list, totalElements: list.length, totalPages: 1 });
  }
  if (m === 'POST' && p === '/listings') {
    const vendor = state.myVendor;
    const listing: Listing = {
      compareAtMinor: null,
      available: true,
      stockQty: 20,
      quantity: '1',
      unit: 'pack',
      prepMinutes: null,
      linkedRecipeId: null,
      description: '',
      imageUrl: PHOTOS.listing[0],
      currency: state.user.country === 'GH' ? 'GHS' : 'NGN',
      country: state.user.country,
      vendorId: vendor?.id ?? 99,
      vendorName: vendor?.name ?? 'My Kitchen',
      vendorLogoUrl: vendor?.logoUrl ?? null,
      ...body,
      id: ++state.nextId,
      status: 'PENDING',
    };
    state.myListings.unshift(listing);
    return R(listing);
  }

  // ---- orders ----
  if (m === 'POST' && p === '/orders') {
    const result = makeOrder(body?.items ?? []);
    state.pendingPayment = { kind: 'order', orderId: result.order.id };
    return R(result);
  }
  const verifyMatch = p.match(/^\/orders\/(\d+)\/verify$/);
  if (verifyMatch && m === 'POST') {
    const order = state.orders.find((o) => o.id === Number(verifyMatch[1]));
    if (!order) throw new DemoError(404, 'Order not found');
    order.status = 'PAID';
    return R(order);
  }
  if (m === 'GET' && p === '/orders') return R(state.orders);
  const orderMatch = p.match(/^\/orders\/(\d+)$/);
  if (orderMatch && m === 'GET') {
    const order = state.orders.find((o) => o.id === Number(orderMatch[1]));
    if (!order) throw new DemoError(404, 'Order not found');
    return R(order);
  }
  if (m === 'GET' && p === '/vendor/orders') return R(state.orders);
  const vOrderStatus = p.match(/^\/vendor\/orders\/(\d+)\/status$/);
  if (vOrderStatus && m === 'PUT') {
    const order = state.orders.find((o) => o.id === Number(vOrderStatus[1]));
    if (!order) throw new DemoError(404, 'Order not found');
    order.status = body?.status ?? order.status;
    return R(order);
  }

  // ---- subscription ----
  if (m === 'GET' && p === '/subscription/plans') return R(demoPlans.filter((pl) => pl.code !== 'FREE'));
  if (m === 'POST' && p === '/subscription/subscribe') {
    state.pendingPayment = { kind: 'subscription' };
    const payment: PaystackInit = {
      authorizationUrl: 'https://demo.dishaspora.local/pay/SUB',
      reference: `SUB-${Date.now()}`,
      publicKey: 'pk_test_demo',
      amountMinor: state.user.country === 'GH' ? 3000 : 150000,
      currency: state.user.country === 'GH' ? 'GHS' : 'NGN',
    };
    return R(payment);
  }
  if (m === 'POST' && p === '/subscription/verify') {
    state.user = {
      ...state.user,
      premium: true,
      premiumUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    };
    return R(state.user);
  }
  if (m === 'GET' && p === '/subscription/me') {
    return R({
      premium: state.user.premium,
      premiumUntil: state.user.premiumUntil,
      planCode: state.user.premium ? 'PREMIUM_MONTHLY' : null,
    });
  }

  // ---- assistant & search ----
  if (m === 'POST' && p === '/assistant/chat') {
    await delay(600);
    return R(assistantReply(body?.message ?? ''));
  }
  if (m === 'GET' && p === '/search/smart') {
    const filters = parseSmart(str(params?.q) ?? '');
    return R({ filters, recipes: smartRecipes(filters) });
  }

  // ---- chat ----
  if (m === 'GET' && p === '/chat/threads') return R(state.threads);
  if (m === 'POST' && p === '/chat/threads') {
    const vendorId = Number(body?.vendorId);
    let thread = state.threads.find((t) => t.vendorId === vendorId);
    if (!thread) {
      const vendor = (await import('./demoData')).demoVendors.find((v) => v.id === vendorId);
      thread = {
        id: ++state.nextId,
        vendorId,
        vendorName: vendor?.name ?? 'Vendor',
        vendorLogoUrl: vendor?.logoUrl ?? null,
        lastMessage: null,
        lastAt: null,
        unread: 0,
      };
      state.threads.unshift(thread);
      state.messages[thread.id] = [];
    }
    return R(thread);
  }
  const msgsMatch = p.match(/^\/chat\/threads\/(\d+)\/messages$/);
  if (msgsMatch && m === 'GET') {
    const all = state.messages[Number(msgsMatch[1])] ?? [];
    const after = num(params?.after);
    return R(after !== null ? all.filter((msg) => msg.id > after) : all);
  }
  if (msgsMatch && m === 'POST') {
    const threadId = Number(msgsMatch[1]);
    const msg: ChatMessage = {
      id: ++state.nextId,
      threadId,
      senderId: state.user.id,
      senderName: state.user.name,
      mine: true,
      body: body?.body ?? '',
      createdAt: new Date().toISOString(),
    };
    state.messages[threadId] = [...(state.messages[threadId] ?? []), msg];
    const thread = state.threads.find((t) => t.id === threadId);
    if (thread) {
      thread.lastMessage = msg.body;
      thread.lastAt = msg.createdAt;
    }
    // canned vendor reply a moment later
    setTimeout(() => {
      const reply: ChatMessage = {
        id: ++state.nextId,
        threadId,
        senderId: 900 + threadId,
        senderName: thread?.vendorName ?? 'Vendor',
        mine: false,
        body: 'Thanks for your message! We will get back to you right away.',
        createdAt: new Date().toISOString(),
      };
      state.messages[threadId] = [...(state.messages[threadId] ?? []), reply];
      if (thread) {
        thread.lastMessage = reply.body;
        thread.lastAt = reply.createdAt;
      }
    }, 2500);
    return R(msg);
  }

  // ---- media ----
  if (m === 'POST' && p === '/media') {
    return R({ url: PHOTOS.listing[Math.floor(Math.random() * PHOTOS.listing.length)] });
  }

  throw new DemoError(404, `Demo mode: no handler for ${m} ${p}`);
}

/** Demo upload keeps the locally-picked file uri so previews look right. */
export async function demoUpload(file: { uri: string }): Promise<{ url: string }> {
  await delay(500);
  return { url: file.uri };
}
