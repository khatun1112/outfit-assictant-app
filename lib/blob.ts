import { put } from '@vercel/blob';

export async function uploadImage(file: File) {
  const filename = `${file.name}`; // or use nanoid if you prefer
  const { url } = await put(filename, file, {
    access: 'public',
    token: "vercel_blob_rw_6vLq3ROb5SuhYVk5_Y7SRmjKs1dfbBCL31dfYW6BJmAx232",
  });
  return url;
}
