import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "MyCart. - Admin",
    description: "MyCart. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
