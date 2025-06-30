"use client";

import { useState } from "react";
import MyTable from "@/app/components/ui/mytable";


export default function TaxonomyTable({ initialData }: { initialData: TaxonomyData[] }) {
    const [data, setData] = useState<TaxonomyData[]>(initialData);

    return (
        <>
            <div className="border bg-white">
                <MyTable initialData={data} type="taxonomy" />
            </div>
        </>
    );
}
