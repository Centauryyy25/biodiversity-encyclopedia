import type { Metadata } from 'next';
import SpeciesCatalogClient from '@/components/species/species-catalog-client';
import { FadeIn } from '@/components/ui/fade-in';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getSpeciesCatalogSnapshot } from '@/lib/supabase/species';

const PAGE_SIZE = 24;
export const revalidate = 0;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const metadata: Metadata = {
  title: 'Species Encyclopedia | FloraFauna',
  description:
    'Browse the FloraFauna encyclopedia to study detailed species profiles, taxonomy, and conservation data across kingdoms.',
};

export default async function SpeciesPage(
  { searchParams }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const sp = await searchParams;
  const rawSearch = (sp as Record<string, unknown>).search;
  const rawKingdom = (sp as Record<string, unknown>).kingdom;
  const rawStatus = (sp as Record<string, unknown>).iucn_status;

  const search =
    typeof rawSearch === 'string'
      ? rawSearch
      : Array.isArray(rawSearch) && typeof rawSearch[0] === 'string'
      ? rawSearch[0]
      : undefined;

  const kingdom =
    typeof rawKingdom === 'string'
      ? rawKingdom
      : Array.isArray(rawKingdom) && typeof rawKingdom[0] === 'string'
      ? rawKingdom[0]
      : undefined;

  const status =
    typeof rawStatus === 'string'
      ? rawStatus
      : Array.isArray(rawStatus) && typeof rawStatus[0] === 'string'
      ? rawStatus[0]
      : undefined;

  const initialPayload = await getSpeciesCatalogSnapshot({
    search,
    kingdom,
    iucnStatus: status,
    limit: PAGE_SIZE,
  });
  const initialSpecies = initialPayload.data;
  const initialCount = initialPayload.count;

  if (initialPayload.error) {
    console.warn('[SpeciesPage Warning]', initialPayload.error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#051F20] to-[#235347] py-16">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8 lg:px-12 space-y-10">
        <FadeIn className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-[#8EB69B]">Discover Life</p>
          <h1 className="text-4xl lg:text-5xl font-serif text-[#DAF1DE]">Species Encyclopedia</h1>
          <p className="text-[#8EB69B] max-w-3xl mx-auto leading-relaxed text-lg">
            Explore curated records spanning flora and fauna. Filter by taxonomy or conservation
            status to surface the species most relevant to your research.
          </p>
          <p className="text-sm text-[#8EB69B]/80">
            Currently tracking <span className="font-semibold text-[#DAF1DE]">{initialCount}</span>{' '}
            species
          </p>
        </FadeIn>

        {initialPayload.error && (
          <Alert className="bg-[#401414]/60 border border-[#F87171]/40 text-[#FECACA]">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to load the latest catalog data. {initialPayload.error}. Showing cached results
              where available.
            </AlertDescription>
          </Alert>
        )}

        <FadeIn>
        <SpeciesCatalogClient
          initialSpecies={initialSpecies}
          initialCount={initialCount}
          pageSize={PAGE_SIZE}
          initialSearch={search ?? ''}
          initialKingdom={kingdom ?? 'all'}
          initialStatus={status ?? 'all'}
        />
        </FadeIn>
      </div>
    </div>
  );
}
