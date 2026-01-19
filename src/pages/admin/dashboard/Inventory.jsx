import PageTitle from "@/componants/layouts/PageTitle";
import PageContainer from "@/componants/layouts/PageContainer";
import SectionCard from "@/componants/layouts/SectionCard";
import AdminTabs from "@/componants/ui/AdminTabs";

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
