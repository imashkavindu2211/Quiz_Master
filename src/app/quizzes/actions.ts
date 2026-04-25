'use server';

import { supabase } from '@/lib/supabase';

export async function getPublishedPacks(category?: string) {
  try {
    let query = supabase
      .from('quiz_packs')
      .select(`
        *,
        questions (count)
      `)
      .eq('status', 'published')
      .order('publish_date', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    // Filter out packs that have no questions
    const validPacks = (data || []).filter(pack => (pack.questions?.[0]?.count || 0) > 0);

    return { success: true, data: validPacks };
  } catch (error: any) {
    console.error('Error fetching published packs:', error);
    return { success: false, data: [], error: error.message };
  }
}

export async function getQuizForPlayer(id: string) {
  try {
    const { data: pack, error: packError } = await supabase
      .from('quiz_packs')
      .select(`
        *,
        questions (
          *,
          answer_options (*)
        )
      `)
      .eq('id', id)
      .single();

    if (packError) throw packError;

    return { success: true, data: pack };
  } catch (error: any) {
    console.error('Error fetching quiz for player:', error);
    return { success: false, error: error.message };
  }
}

export async function recordSubmission(packId: string, score: number) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Authentication required to save progress.");

    // 1. Double-check if already submitted (Server-side security)
    const { data: existing } = await supabase
      .from('quiz_submissions')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('quiz_pack_id', packId)
      .maybeSingle();
    
    if (existing) {
      return { success: false, error: "Challenge already completed." };
    }

    const { error } = await supabase
      .from('quiz_submissions')
      .insert({
        user_id: session.user.id,
        quiz_pack_id: packId,
        score: score
      });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error recording submission:', error);
    return { success: false, error: error.message };
  }
}

export async function getUserCompletions() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { success: true, data: [] as string[] };

    const { data, error } = await supabase
      .from('quiz_submissions')
      .select('quiz_pack_id')
      .eq('user_id', session.user.id);

    if (error) throw error;
    return { success: true, data: (data?.map(d => d.quiz_pack_id) || []) as string[] };
  } catch (error: any) {
    console.error('Error fetching user completions:', error);
    return { success: false, data: [] as string[], error: error.message };
  }
}
