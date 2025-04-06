import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Testimonial } from "@/lib/types";

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center text-amber-500 mb-4">
      {[...Array(fullStars)].map((_, i) => (
        <i key={`full-${i}`} className="fas fa-star"></i>
      ))}
      {hasHalfStar && <i className="fas fa-star-half-alt"></i>}
      {[...Array(emptyStars)].map((_, i) => (
        <i key={`empty-${i}`} className="far fa-star"></i>
      ))}
    </div>
  );
};

const Testimonials: React.FC = () => {
  const { data: testimonials, isLoading, error } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-inter font-bold text-2xl md:text-3xl text-neutral-900 mb-3">What Our Students Say</h2>
            <p className="text-neutral-700 max-w-3xl mx-auto">Hear from students who have transformed their lives through our practical approach to education.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="h-4 bg-neutral-200 rounded w-1/3 mb-4"></div>
                <div className="h-20 bg-neutral-200 rounded w-full mb-4"></div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 mr-3"></div>
                  <div>
                    <div className="h-4 bg-neutral-200 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-neutral-200 rounded w-32"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="font-inter font-bold text-2xl md:text-3xl text-neutral-900 mb-4">Error Loading Testimonials</h2>
            <p className="text-red-500">Failed to load testimonials. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-inter font-bold text-2xl md:text-3xl text-neutral-900 mb-3">What Our Students Say</h2>
          <p className="text-neutral-700 max-w-3xl mx-auto">Hear from students who have transformed their lives through our practical approach to education.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials?.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              <StarRating rating={testimonial.rating} />
              <p className="text-neutral-700 italic mb-4">"{testimonial.content}"</p>
              <div className="flex items-center">
                <Avatar className="w-10 h-10 mr-3">
                  <AvatarImage src={testimonial.userAvatar} alt={testimonial.userName} />
                  <AvatarFallback>{testimonial.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-neutral-900">{testimonial.userName}</h4>
                  <p className="text-sm text-neutral-500">{testimonial.userTitle}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
