import CustomerDetailsPage from "@/components/Customer/CustomerDetail"

interface CustomerDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  return <CustomerDetailsPage customerId={id} />
}
