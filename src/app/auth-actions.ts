'use server'

import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function resetUserPassword(idNumber: string, newPassword: string) {
  try {
    const pseudoEmail = `${idNumber.trim()}@quiz.com`;

    // 1. Get the user by email
    const { data: users, error: fetchError } = await getSupabaseAdmin().auth.admin.listUsers();
    
    if (fetchError) throw fetchError;

    const targetUser = users.users.find(u => u.email === pseudoEmail);

    if (!targetUser) {
      return { success: false, error: "No user found with this ID Number." };
    }

    // 2. Update the password
    const { error: updateError } = await getSupabaseAdmin().auth.admin.updateUserById(
      targetUser.id,
      { password: newPassword }
    );

    if (updateError) throw updateError;

    return { success: true };
  } catch (error: any) {
    console.error('Reset Password Error:', error);
    return { success: false, error: error.message || "Failed to reset password." };
  }
}

export async function registerUser(idNumber: string, password: string, fullName: string) {
  try {
    const pseudoEmail = `${idNumber.trim()}@quiz.com`;

    // 1. Check if user exists
    const { data: users, error: fetchError } = await getSupabaseAdmin().auth.admin.listUsers();
    if (fetchError) throw fetchError;

    const existingUser = users.users.find(u => u.email === pseudoEmail);
    if (existingUser) {
      return { success: false, error: "This ID Number is already registered. Please use a different ID number." };
    }

    // 2. Create user with admin privileges (bypasses email confirmation)
    const { data: authData, error: createError } = await getSupabaseAdmin().auth.admin.createUser({
      email: pseudoEmail,
      password: password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });

    if (createError) throw createError;

    if (authData.user) {
      // 3. Create profile in public.profiles using upsert to handle potential race conditions
      const { error: profileError } = await getSupabaseAdmin()
        .from('profiles')
        .upsert({ 
          id: authData.user.id, 
          full_name: fullName,
          created_at: new Date().toISOString()
        });
      
      if (profileError) {
        console.error('Profile Creation Error:', profileError);
        throw new Error(`User created but profile failed: ${profileError.message}`);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Registration Action Error:', error);
    return { success: false, error: error.message || "An unexpected error occurred during registration." };
  }
}


