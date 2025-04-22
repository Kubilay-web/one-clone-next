import React from "react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface FeaturePoint {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureSectionProps {
  icon?: React.ReactNode;
  title: string;
  titleHighlight?: string;
  description: string;
  features: FeaturePoint[];
  imageSrc: string;
  imageAlt: string;
  imagePosition?: "left" | "right";
  theme?: "light" | "dark";
  className?: string;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  icon,
  title,
  titleHighlight,
  description,
  features,
  imageSrc,
  imageAlt,
  imagePosition = "left",
  theme = "light",
  className = "",
}) => {
  const themeStyles = {
    light: {
      background: "bg-white",
      text: {
        primary: "text-gray-900",
        secondary: "text-gray-600",
      },
      highlight: "text-purple-600",
      iconBackground: "bg-purple-100",
      iconColor: "text-purple-600",
      featureIcon: {
        background: "bg-purple-100",
        color: "text-purple-600",
      },
    },
    dark: {
      background: "bg-gray-900",
      text: {
        primary: "text-white",
        secondary: "text-gray-400",
      },
      highlight: "text-purple-400",
      iconBackground: "bg-purple-900/20",
      iconColor: "text-purple-400",
      featureIcon: {
        background: "bg-purple-900/20",
        color: "text-purple-400",
      },
    },
  };

  const style = themeStyles[theme];

  return (
    <div className="">
      <div className={`${style.background} ${className}`}>
        <div className="mx-auto my-8 max-w-6xl rounded-md px-4 py-12 shadow sm:px-6 lg:px-8 lg:py-16">
          <div
            className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${imagePosition === "right" ? "" : "lg:grid-flow-col-dense"}`}
          >
            {/* Content Section */}
            <div
              className={`${
                imagePosition === "right" ? "lg:order-1" : "lg:order-2"
              }`}
            >
              <div className="space-y-6">
                {/* Title Section */}
                <div className="flex items-center space-x-3">
                  {icon && (
                    <div
                      className={`inline-flex rounded-lg p-3 ${style.iconBackground} ${style.iconColor}`}
                    >
                      {icon}
                    </div>
                  )}
                  <div className="">
                    <h2 className={`text-3xl font-bold ${style.text.primary}`}>
                      {title}
                      {titleHighlight && (
                        <span className={`${style.highlight}`}>
                          {" "}
                          {titleHighlight}
                        </span>
                      )}
                    </h2>
                    <p className={`text-sm ${style.text.secondary}`}>
                      {description}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <div key={index} className="flex gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`shrink-0 rounded-lg p-2 ${style.featureIcon.background} `}
                            >
                              <Icon
                                className={`h-5 w-5 ${style.featureIcon.color}`}
                              />
                            </div>
                            <h3
                              className={`text-lg font-medium ${style.text.primary}`}
                            >
                              {feature.title}
                            </h3>
                          </div>

                          <p className={`${style.text.secondary}`}>
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Image Section */}
            <div
              className={`relative mx-auto w-full max-w-xl lg:max-w-none ${imagePosition === "right" ? "lg:order-2" : "lg:order-1"} `}
            >
              <div className="relative w-full">
                {/* Background Gradient */}
                <div className="absolute -inset-4">
                  <div className="mx-auto h-full w-full opacity-30 blur-lg filter">
                    <div
                      className={`h-full w-full rounded-full ${theme === "light" ? "bg-purple-200" : "bg-purple-900"} `}
                    />
                  </div>
                </div>

                {/* Image */}
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  className="relative w-full rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
