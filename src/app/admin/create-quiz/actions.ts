'use server';

import { supabase } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

export async function saveQuizPack(formData: any) {
  try {
    const { id, title, category_id, publish_date, questions } = formData;
    
    // 1. RESOLVE CATEGORY ID (Ensure it's a UUID)
    // The frontend may send 'IQ' as a label, but the DB expects a UUID foreign key.
    let finalCategoryId = category_id;
    if (category_id === 'IQ' || !category_id || (typeof category_id === 'string' && category_id.length < 36)) {
      const { data: cat } = await getSupabaseAdmin()
        .from('categories')
        .select('id')
        .or(`name.ilike.IQ,slug.ilike.iq`)
        .maybeSingle();
      
      if (cat) {
        finalCategoryId = cat.id;
      } else {
        const { data: firstCat } = await getSupabaseAdmin().from('categories').select('id').limit(1).maybeSingle();
        finalCategoryId = firstCat?.id || null;
      }
    }

    let packId = id;

    if (id) {
      // Update existing pack
      const { data: pack, error: packError } = await getSupabaseAdmin()
        .from('quiz_packs')
        .update({
          title,
          category_id: finalCategoryId,
          publish_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (packError) {
        console.error('Pack Update Error:', packError);
        throw new Error(`Failed to update pack: ${packError.message}`);
      }

      // Delete existing questions (options will cascade delete)
      const { error: delError } = await getSupabaseAdmin()
        .from('questions')
        .delete()
        .eq('quiz_pack_id', id);

      if (delError) {
        throw new Error(`Failed to clear old questions: ${delError.message}`);
      }
    } else {
      // Insert new pack
      const { data: pack, error: packError } = await getSupabaseAdmin()
        .from('quiz_packs')
        .insert({
          title,
          category_id: finalCategoryId,
          publish_date,
          status: 'published'
        })
        .select()
        .single();

      if (packError) {
        console.error('Pack Insert Error:', packError);
        throw new Error(`Database Error: ${packError.message}`);
      }
      packId = pack.id;
    }

    // Insert Questions and Answer Options
    for (const q of questions) {
      const { data: question, error: qError } = await getSupabaseAdmin()
        .from('questions')
        .insert({
          quiz_pack_id: packId,
          question_text: q.text,
          time_limit: q.timeLimit,
          explanation: q.explanation,
          image_url: q.imageUrl,
          explanation_image_url: q.explanationImageUrl
        })
        .select()
        .single();

      if (qError) throw qError;

      const optionsToInsert = q.options.map((opt: any) => ({
        question_id: question.id,
        option_text: opt.text,
        is_correct: opt.isCorrect
      }));

      const { error: optError } = await getSupabaseAdmin()
        .from('answer_options')
        .insert(optionsToInsert);

      if (optError) throw optError;
    }

    revalidatePath('/admin/quiz-packs');
    return { success: true, packId };
  } catch (error: any) {
    console.error('Error saving quiz pack:', error);
    return { success: false, error: error.message };
  }
}

export async function fetchQuizPack(id: string) {
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

    // Transform to match form structure
    const transformedPack = {
      id: pack.id,
      title: pack.title,
      category_id: pack.category_id,
      publish_date: pack.publish_date,
      questions: pack.questions.map((q: any) => ({
        id: q.id,
        text: q.question_text,
        timeLimit: q.time_limit,
        explanation: q.explanation,
        imageUrl: q.image_url,
        explanationImageUrl: q.explanation_image_url,
        options: q.answer_options.map((opt: any) => ({
          text: opt.option_text,
          isCorrect: opt.is_correct
        }))
      }))
    };

    return { success: true, data: transformedPack };
  } catch (error: any) {
    console.error('Error fetching quiz pack:', error);
    return { success: false, error: error.message };
  }
}
