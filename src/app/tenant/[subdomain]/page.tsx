import React from "react";

interface PageProps {
  params: Promise<{ subdomain: string }>;
}

export default async function TenantDashboardPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <h1 className="text-4xl font-bold text-blue-600">Tenant: {resolvedParams.subdomain}</h1>
      <p className="mt-4 text-gray-600">Ini adalah halaman utama untuk tenant yang diakses melalui subdomain.</p>
    </div>
  );
}
