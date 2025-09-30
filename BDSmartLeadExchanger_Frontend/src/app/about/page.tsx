import { Footer } from "@/components/share/Footer";
import { Navbar } from "@/components/share/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase,
  Globe,
  Share2,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
        {/* Hero Section */}
        <section className=" max-w-7xl mx-auto py-20 px-4">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold  mb-4 bg-gradient-to-r from-blue-600 to-green-600  bg-clip-text text-transparent">
              About Us
            </h1>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
              BDSmartLeadExchanger
            </h2>
          </div>
        </section>

        {/* Our Identity Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h3 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
              Our Identity
              <span className="text-muted-foreground">→</span>
              <span className="bg-gradient-to-r from-blue-600 to-green-600  bg-clip-text text-transparent">
                Driven by Digital Trust
              </span>
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At{" "}
              <span className="font-semibold text-foreground">
                BDSmartLeadExchanger
              </span>
              , we believe digital growth should be simple, secure, and
              accessible to everyone. That's why we built a next-generation
              online marketplace where users can confidently exchange services,
              grow their audience, and unlock new earning opportunities.
            </p>
          </div>
        </section>

        {/* Our Services Section */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2 flex-wrap">
                Our Services
                <span className="text-muted-foreground">→</span>
                <span className="bg-gradient-to-r from-blue-600 to-green-600  bg-clip-text text-transparent">
                  Smart Solutions for Growth
                </span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We're more than just a platform — we're your growth partner. Our
                services include:
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border bg-card hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    Website Visits
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Traffic exchange solutions
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">Ad Visits</h4>
                  <p className="text-sm text-muted-foreground">
                    CPA lead exchange services
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    Social Media
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Traffic exchange solutions
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-lg transition-all hover:scale-105">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    Custom Solutions
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Digital service solutions
                  </p>
                </CardContent>
              </Card>
            </div>

            <p className="text-center text-muted-foreground">
              With a minimal server fee, you gain access to a safe, transparent,
              and results-driven ecosystem.
            </p>
          </div>
        </section>

        {/* Business Tools Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2 flex-wrap">
                Business Tools
                <span className="text-muted-foreground">→</span>
                <span className="bg-gradient-to-r from-blue-600 to-green-600  bg-clip-text text-transparent">
                  Power Tools for Entrepreneurs
                </span>
              </h3>
            </div>

            <Card className="border-border bg-card">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-600 to-green-600  flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-muted-foreground leading-relaxed">
                      Our{" "}
                      <span className="font-semibold text-foreground">
                        premium business tools
                      </span>{" "}
                      give you the edge to manage, track, and scale your digital
                      presence. From smarter project management to seamless
                      marketing support — we provide the resources you need to
                      stay ahead.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Commitment Section */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-foreground flex items-center justify-center gap-2 flex-wrap">
                Our Commitment
                <span className="text-muted-foreground">→</span>
                <span className="bg-gradient-to-r from-blue-600 to-green-600  bg-clip-text text-transparent">
                  Promises You Can Count On
                </span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We're committed to building trust, delivering value, and
                creating success stories. That means:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="border-border bg-card hover:shadow-lg transition-all">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    Top-Level Security
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Security you can rely on
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-lg transition-all">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    Fast Transactions
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Fast and transparent
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card hover:shadow-lg transition-all">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    Real Opportunities
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Earning opportunities for all
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                <span className="bg-gradient-to-r from-blue-600 to-green-600  bg-clip-text text-transparent">
                  BDSmartLeadExchanger
                </span>
              </h3>
              <p className="text-xl text-muted-foreground">
                Powering your success in the digital marketplace 🚀
              </p>
            </div>
            <Link href="/login">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600  "
              >
                Get Started
              </Button>
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
