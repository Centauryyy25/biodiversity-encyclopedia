import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin, hasSupabaseServiceRole } from '@/utils/supabase/admin';
import {
  normalizeSpeciesRecord,
  sanitizeSearchTerm,
  slugify,
  speciesPayloadSchema,
} from '@/lib/api/species-route-helpers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 24, 1), 100);
  const offset = Math.max(Number(searchParams.get('offset')) || 0, 0);
  const featured = searchParams.get('featured') === 'true';
  const kingdom = searchParams.get('kingdom');
  const iucnStatus = searchParams.get('iucn_status');
  const search = searchParams.get('search');

  let query = supabaseAdmin
    .from('species')
    .select('*', { count: 'exact' })
    .order('featured', { ascending: false })
    .order('scientific_name', { ascending: true })
    .range(offset, offset + limit - 1);

  if (featured) {
    query = query.eq('featured', true);
  }

  if (kingdom) {
    query = query.ilike('kingdom', kingdom);
  }

  if (iucnStatus) {
    query = query.eq('iucn_status', iucnStatus);
  }

  if (search) {
    const term = sanitizeSearchTerm(search);
    if (term) {
      query = query.or(`scientific_name.ilike.%${term}%,common_name.ilike.%${term}%`);
    }
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching species list:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const normalized = (data ?? []).map(normalizeSpeciesRecord);

  return NextResponse.json({
    data: normalized,
    metadata: {
      count: count ?? normalized.length,
      limit,
      offset,
      filters: {
        featured,
        kingdom,
        iucnStatus,
        search: search ?? null,
      },
    },
  });
}

export async function POST(request: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  if (!hasSupabaseServiceRole) {
    return NextResponse.json(
      {
        error:
          'Species creation requires SUPABASE_SERVICE_ROLE_KEY. Add it to your environment to enable this endpoint.',
      },
      { status: 503 }
    );
  }

  const body = await request.json();

  const parsed = speciesPayloadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const payload = parsed.data;
  const slug = payload.slug ?? slugify(payload.scientific_name);

  const { data, error } = await supabaseAdmin
    .from('species')
    .insert([{ ...payload, slug }])
    .select('*')
    .single();

  if (error) {
    console.error('Error creating species:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: normalizeSpeciesRecord(data) }, { status: 201 });
}
