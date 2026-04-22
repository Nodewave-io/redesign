import { redirect } from 'next/navigation'

// Redesign is single-purpose: the editor is the whole app. Land straight
// on /admin/media instead of showing a placeholder home.
export default function Home(): never {
  redirect('/admin/media')
}
