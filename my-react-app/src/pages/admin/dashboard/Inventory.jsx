import PageTitle from "@/components/admin/layout/PageTitle";
import PageContainer from "@/components/admin/layout/PageContainer";
import SectionCard from "@/components/admin/layout/SectionCard";
import AdminTabs from "@/components/admin/navigation/AdminTabs";

export default function StockInventory() {
    return (
        <PageContainer>
            <PageTitle>Tồn kho</PageTitle>
            <AdminTabs active="inventory" />

            <SectionCard title="Tồn kho theo danh mục">
                ...
            </SectionCard>

            <SectionCard title="Tồn kho theo kệ sách">
                ...
            </SectionCard>
        </PageContainer>
    );
}
