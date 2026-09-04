import AdminNav from './AdminNav'

export const metadata = {
  title: "bySafirah - Admin",
  description: "Painel Administrativo",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <div className="py-8">
        {children}
      </div>
    </div>
  )
}