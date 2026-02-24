import { supabase } from './supabase';

export const uploadFile = async (bucket: string, path: string, file: File) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600',
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error: any) {
    console.error(`Error uploading to ${bucket}:`, error.message);
    throw error;
  }
};

export const uploadAvatar = (userId: string, file: File) => {
  const extension = file.name.split('.').pop();
  return uploadFile('avatars', `${userId}/avatar.${extension}`, file);
};

export const uploadResume = (userId: string, file: File) => {
  return uploadFile('resumes', `${userId}/resume.pdf`, file);
};

export const uploadPostMedia = (userId: string, file: File) => {
  const timestamp = Date.now();
  const extension = file.name.split('.').pop();
  return uploadFile('posts', `${userId}/${timestamp}.${extension}`, file);
};
