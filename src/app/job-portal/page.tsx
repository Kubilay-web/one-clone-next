import HeroSection from "@/components/jobportal/home/HeroSection";
import PopularJobsSection from "@/components/jobportal/home/PopularJob";
import FeaturedJob from "@/components/jobportal/home/FeaturedJob";
import WhyChooseUs from "@/components/jobportal/home/WhyChooseUs";
import LearnMore from "@/components/jobportal/home/LearnMore";
import CounterSection from "@/components/jobportal/home/CounterSection";
import TopRecruiters from "@/components/jobportal/home/TopRecruiters";
import PricingPlan from "@/components/jobportal/home/PricingPlan";
import JobLoc from "@/components/jobportal/home/JobLoc";
import ClientSaid from "@/components/jobportal/home/ClientSaid";
import NewsItem from "@/components/jobportal/home/NewsItem";
import TopNav from "@/components/jobportal/home/TopNav";

export default function page() {
  return (
    <div>
      <TopNav />
      <HeroSection />
      <PopularJobsSection />
      <FeaturedJob />
      <WhyChooseUs />
      <LearnMore />
      <CounterSection />
      <TopRecruiters />
      <PricingPlan />
      <JobLoc />
      <ClientSaid />
      <NewsItem />
    </div>
  );
}
