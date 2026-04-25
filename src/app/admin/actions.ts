'use server';

import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function getAdminStats() {
  try {
    // 1. Get total users
    const { count: totalUsers, error: usersError } = await getSupabaseAdmin()
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // 2. Get total quiz packs
    const { count: totalPacks, error: packsError } = await getSupabaseAdmin()
      .from('quiz_packs')
      .select('*', { count: 'exact', head: true });

    if (packsError) throw packsError;

    // 3. Get total submissions
    const { count: totalSubmissions, error: subError } = await getSupabaseAdmin()
      .from('quiz_submissions')
      .select('*', { count: 'exact', head: true });

    if (subError) throw subError;

    // 4. Get recent activity (last 5 submissions with profile info)
    const { data: recentActivity, error: activityError } = await getSupabaseAdmin()
      .from('quiz_submissions')
      .select(`
        *,
        profiles (full_name),
        quiz_packs (title)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    if (activityError) throw activityError;

    return {
      success: true,
      stats: {
        totalUsers: totalUsers || 0,
        totalPacks: totalPacks || 0,
        totalSubmissions: totalSubmissions || 0,
      },
      recentActivity: recentActivity || []
    };
  } catch (error: any) {
    console.error('Error fetching admin stats:', error);
    return { success: false, error: error.message };
  }
}

export async function getAllUsers() {
  try {
    const { data: users, error } = await getSupabaseAdmin()
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data: users };
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return { success: false, error: error.message };
  }
}

export async function registerUserAdmin(idNumber: string, password: string, fullName: string) {
  try {
    const pseudoEmail = `${idNumber.trim()}@quiz.com`;

    // 1. Check if user exists
    const { data: users, error: fetchError } = await getSupabaseAdmin().auth.admin.listUsers();
    if (fetchError) throw fetchError;

    const existingUser = users.users.find(u => u.email === pseudoEmail);
    if (existingUser) {
      return { success: false, error: "This ID Number is already registered." };
    }

    // 2. Create user
    const { data: authData, error: createError } = await getSupabaseAdmin().auth.admin.createUser({
      email: pseudoEmail,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (createError) throw createError;

    if (authData.user) {
      // 3. Create profile with only verified standard columns
      const { error: profileError } = await getSupabaseAdmin()
        .from('profiles')
        .upsert({ 
          id: authData.user.id, 
          full_name: fullName,
          created_at: new Date().toISOString()
        });
      
      // 4. Update Auth user metadata to include id_number and raw_password for retrieval
      // This avoids needing custom columns in the profiles table if they are missing
      await getSupabaseAdmin().auth.admin.updateUserById(authData.user.id, {
        user_metadata: { 
          full_name: fullName,
          id_number: idNumber,
          raw_password: password
        }
      });
      
      if (profileError) throw profileError;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Admin Registration Error:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteUserAdmin(userId: string) {
  try {
    // 1. Delete from Auth
    const { error: authError } = await getSupabaseAdmin().auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // 2. Delete from Profiles (should cascade but manually for safety)
    const { error: profileError } = await getSupabaseAdmin()
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) throw profileError;

    return { success: true };
  } catch (error: any) {
    console.error('Admin Delete Error:', error);
    return { success: false, error: error.message };
  }
}

export async function searchUserAdmin(idNumber: string) {
  try {
    const pseudoEmail = `${idNumber.trim()}@quiz.com`;
    
    // 1. Find user in Auth by email
    const { data: users, error: fetchError } = await getSupabaseAdmin().auth.admin.listUsers();
    if (fetchError) throw fetchError;

    const user = users.users.find(u => u.email?.toLowerCase() === pseudoEmail.toLowerCase());
    
    if (!user) {
      return { success: false, error: "User not found." };
    }

    // 2. Format result using metadata
    const result = {
      id: user.id,
      full_name: user.user_metadata?.full_name || 'N/A',
      id_number: user.user_metadata?.id_number || idNumber,
      raw_password: user.user_metadata?.raw_password || 'Hidden',
      created_at: user.created_at
    };

    return { success: true, data: result };
  } catch (error: any) {
    console.error('Search Error:', error);
    return { success: false, error: "Search failed." };
  }
}
