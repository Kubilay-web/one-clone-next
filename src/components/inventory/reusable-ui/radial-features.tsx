import React from "react";
import {
  Rocket,
  PenTool,
  Layout,
  Lock,
  CreditCard,
  BarChart,
  FileText,
  Clock,
  DollarSign,
  Users,
  Zap,
  Workflow,
  Shield,
} from "lucide-react";
import ConnectingLines from "./connecting-lines";

interface Feature {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  highlight?: string;
}

interface RadialFeatureProps {
  theme?: "light" | "dark";
}

const RadialFeature: React.FC<RadialFeatureProps> = ({ theme = "light" }) => {
  const styles = {
    light: {
      bg: "bg-white",
      text: "text-gray-600",
      title: "text-gray-800",
      card: "bg-white/50 hover:bg-white/80",
      border: "border-gray-100",
      highlight: "text-purple-600",
      line: "stroke-gray-200",
      center: "bg-gradient-to-b from-purple-50 to-purple-100",
    },
    dark: {
      bg: "bg-gray-900",
      text: "text-gray-300",
      title: "text-white",
      card: "bg-gray-800/50 hover:bg-gray-800",
      border: "border-gray-700",
      highlight: "text-purple-400",
      line: "stroke-gray-700",
      center: "bg-gradient-to-b from-purple-900/50 to-purple-800/50",
    },
  };

  const style = styles[theme];

  const timeHighlights: Feature[] = [
    {
      icon: <PenTool className="h-5 w-5" />,
      title: "Crafting web app & landing page",
      highlight: "50h+",
      subtitle: "",
    },
    {
      icon: <Layout className="h-5 w-5" />,
      title: "Building web app from ground up",
      highlight: "150h+",
      subtitle: "",
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Integrating Auth, Payment & Emails",
      highlight: "40h+",
      subtitle: "",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Taming Payment Gateway Webhooks",
      highlight: "8h+",
      subtitle: "",
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      title: "Admin & Customer Panels with ACL",
      highlight: "80h+",
      subtitle: "",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Adding essential SEO details & tags",
      highlight: "4h+",
      subtitle: "",
    },
  ];

  const benefits: Feature[] = [
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Faster Time to Market",
      subtitle: "",
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Reduced Development Costs",
      subtitle: "",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Reduced Resource Requirements",
      subtitle: "",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Improved Efficiency",
      subtitle: "",
    },
    {
      icon: <Workflow className="h-5 w-5" />,
      title: "Focus on Customization",
      subtitle: "",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Enhanced Security",
      subtitle: "",
    },
  ];

  const FeatureCard: React.FC<{ feature: Feature; className?: string }> = ({
    feature,
    className = "",
  }) => (
    <div
      className={`group relative rounded-xl border p-4 ${style.border} ${style.card} backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${className} `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`rounded-lg p-2 ${style.center} transition-transform duration-300 group-hover:scale-110`}
        >
          {feature.icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            {feature.highlight && (
              <span className={`text-sm font-semibold ${style.highlight}`}>
                {feature.highlight}
              </span>
            )}
            <h3 className={`text-sm font-medium ${style.title}`}>
              {feature.title}
            </h3>
          </div>
          {feature.subtitle && (
            <p className={`mt-1 text-sm ${style.text}`}>{feature.subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`relative mx-auto w-full max-w-7xl p-8 ${style.bg}`}>
      <div className="mb-16 text-center">
        <h1 className={`mb-4 text-4xl font-bold ${style.title}`}>
          Maximize ROI with Our Development Efficiency Engine
        </h1>
        <p className={`text-xl ${style.text}`}>
          Accelerate Your Launch with JetShip Laravel Boilerplates
          Lightning-Fast, Ready-Made Components.
        </p>
      </div>

      <div className="relative">
        {/* SVG Lines - Using a separate SVG layer for the connecting lines */}
        <div className="absolute inset-0 -z-10">
          <ConnectingLines theme={theme} />
        </div>

        <div className="grid grid-cols-1 items-center gap-32 md:grid-cols-2">
          {/* Left Column - Time Highlights */}
          <div className="space-y-4">
            <h2 className={`mb-6 text-2xl font-semibold ${style.title}`}>
              Time-saving Highlights
            </h2>
            <div className="space-y-4">
              {timeHighlights.map((feature, index) => (
                <FeatureCard key={index} feature={feature} />
              ))}
            </div>
          </div>

          {/* Center Icon */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div
              className={`rounded-full p-8 ${style.center} shadow-lg shadow-purple-500/20`}
            >
              <Rocket className="h-12 w-12 text-purple-600" />
            </div>
          </div>

          {/* Right Column - Benefits */}
          <div className="space-y-4">
            <h2 className={`mb-6 text-2xl font-semibold ${style.title}`}>
              User Benefits
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <FeatureCard key={index} feature={benefit} />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 text-center">
          <p className="text-xl">
            <span className={`font-bold ${style.highlight}`}>332+</span>
            <span className={`${style.text}`}>
              {" "}
              saved hours from the beginning with the help of{" "}
            </span>
            <span className={`font-semibold ${style.highlight}`}>
              JetShip Laravel Starter kit
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RadialFeature;
