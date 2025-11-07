import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin, hasSupabaseServiceRole } from '@/utils/supabase/admin';
import {
  normalizeSpeciesRecord,
  slugify,
  speciesUpdateSchema,
} from '@/lib/api/species-route-helpers';
import type { SpeciesWithDetails } from '@/types/species';

interface RouteParams {
  params: { identifier: string };
}

const isUuid = (value: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
    value
  );

const resolveIdentifierColumn = (identifier: string) =>
  isUuid(identifier) ? 'id' : 'slug';

const enrichSpeciesRecord = async (speciesId: string) => {
  const [{ data: taxonomy }, { data: conservation }, { data: images }] = await Promise.all([
    supabaseAdmin
      .from('taxonomy_hierarchy')
      .select('*')
      .eq('species_id', speciesId)
      .maybeSingle(),
    supabaseAdmin
      .from('conservation_data')
      .select('*')
      .eq('species_id', speciesId)
      .maybeSingle(),
    supabaseAdmin
      .from('species_images')
      .select('*')
      .eq('species_id', speciesId)
      .order('sort_order', { ascending: true }),
  ]);

  return { taxonomy, conservation, images: images ?? [] };
};

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const identifier = params.identifier;
  const column = resolveIdentifierColumn(identifier);

  const { data: species, error } = await supabaseAdmin
    .from('species')
    .select('*')
    .eq(column, identifier)
    .single();

  if (error || !species) {
    return NextResponse.json({ error: 'Species not found' }, { status: 404 });
  }

  const extras = await enrichSpeciesRecord(species.id);
  const normalized = normalizeSpeciesRecord(species);

  return NextResponse.json({
    data: {
      ...(normalized as SpeciesWithDetails),
      ...extras,
    },
  });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  if (!hasSupabaseServiceRole) {
    return NextResponse.json(
      {
        error:
          'Species updates require SUPABASE_SERVICE_ROLE_KEY. Add it to your environment to enable this endpoint.',
      },
      { status: 503 }
    );
  }

  const identifier = params.identifier;
  const column = resolveIdentifierColumn(identifier);

  const body = await request.json();
  const parsed = speciesUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updates = parsed.data;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
  }

  if (updates.scientific_name && !updates.slug) {
    updates.slug = slugify(updates.scientific_name);
  }

  const { data, error } = await supabaseAdmin
    .from('species')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq(column, identifier)
    .select('*')
    .single();

  if (error || !data) {
    console.error('Error updating species:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Species not found' },
      { status: error ? 500 : 404 }
    );
  }

  const extras = await enrichSpeciesRecord(data.id);

  return NextResponse.json({
    data: {
      ...(normalizeSpeciesRecord(data) as SpeciesWithDetails),
      ...extras,
    },
  });
}
