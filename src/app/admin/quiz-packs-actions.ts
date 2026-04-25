'use server';

import { supabase } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function getAllQuizPacks() {
  try {
    const { data, error } = await supabase
      .from('quiz_packs')
      .select(`
        *,
        questions (count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error: any) {
    console.error('Error fetching quiz packs:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteQuizPack(id: string) {
  try {
    // cascades will handle questions and options deletion
    const { error } = await getSupabaseAdmin()
      .from('quiz_packs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    revalidatePath('/admin/quiz-packs');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting quiz pack:', error);
    return { success: false, error: error.message };
  }
}
