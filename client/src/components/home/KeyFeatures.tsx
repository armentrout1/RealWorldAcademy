import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Feature } from "@/lib/types";

const KeyFeatures: React.FC = () => {
  const { data: features, isLoading, error } = useQuery<Feature[]>({
    queryKey: ['/api/features'],
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-inter font-bold text-2xl md:text-3xl text-neutral-900 mb-3">Why Choose Real World Academy</h2>
            <p className="text-neutral-700 max-w-3xl mx-auto">Our approach to education focuses on practical skills and real-world applications that prepare you for success in today's rapidly changing world.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="w-12 h-12 bg-neutral-200 rounded-full mb-4"></div>
                <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-full"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-inter font-bold text-2xl md:text-3xl text-neutral-900 mb-4">Error Loading Features</h2>
            <p className="text-red-500">Failed to load key features. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-inter font-bold text-2xl md:text-3xl text-neutral-900 mb-3">Why Choose Real World Academy</h2>
          <p className="text-neutral-700 max-w-3xl mx-auto">Our approach to education focuses on practical skills and real-world applications that prepare you for success in today's rapidly changing world.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features?.map((feature) => (
            <Card key={feature.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className={`w-12 h-12 ${feature.colorClass} rounded-full flex items-center justify-center mb-4`}>
                <i className={`fas fa-${feature.icon} text-xl`}></i>
              </div>
              <h3 className="font-inter font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;
