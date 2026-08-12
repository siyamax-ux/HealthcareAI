import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import { Quote, Star, MapPin, Award, Heart } from 'lucide-react';
import { mockData } from '../data/mockData';

export const SuccessStories = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-bold text-cyan-400 mb-4">
            <Award className="w-4 h-4" />
            <span>Community Voice</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Village Impact & Testimonials
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Real stories from village heads, ASHA health workers, and rural families empowered by GramSwasthya AI.
          </p>
        </div>

        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Autoplay, Pagination]}
          className="mySwiper max-w-4xl mx-auto pb-14"
        >
          {mockData.successStories.map((story, idx) => (
            <SwiperSlide key={idx}>
              <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-slate-800 relative text-center space-y-6">
                <Quote className="w-12 h-12 text-cyan-500/20 mx-auto" />
                <p className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed italic">
                  "{story.quote}"
                </p>
                <div className="pt-4 border-t border-slate-800/80">
                  <h4 className="font-extrabold text-white text-base">{story.author}</h4>
                  <p className="text-xs text-cyan-400 font-semibold">{story.role} • {story.location}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-mono font-bold">
                    Impact: {story.impact}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};
