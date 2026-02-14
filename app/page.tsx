'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Map, Activity, Satellite, TrendingUp, AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 px-4 lg:px-6 h-16 flex items-center border-b bg-background/80 backdrop-blur-lg">
        <Link className="flex items-center justify-center group" href="#">
          <div className="relative">
            <ShieldCheck className="h-7 w-7 mr-2 text-primary group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            CSIDC Monitor
          </span>
        </Link>
        <nav className="ml-auto flex gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#stats">
            Statistics
          </Link>
          <ThemeToggle />
          <Link href="/dashboard">
            <Button className="gap-2 shadow-lg shadow-primary/20">
              Enter Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute inset-0" 
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, oklch(0.45 0.15 250 / 0.1) 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }}
          />
          
          <div className="container relative px-4 md:px-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center space-y-8 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI-Powered Monitoring Platform</span>
              </div>
              
              <div className="space-y-4 max-w-4xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Automated <span className="bg-gradient-to-r from-primary via-primary to-blue-600 bg-clip-text text-transparent">Industrial Land</span> Monitoring
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                  Ensuring compliance and optimizing land utilization through satellite imagery, AI analysis, and real-time monitoring.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="text-base px-8 gap-2 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                    Access Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="text-base px-8 border-2">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-8 pt-12 max-w-3xl w-full">
                <div className="text-center space-y-2">
                  <p className="text-3xl md:text-4xl font-bold text-primary">1,248</p>
                  <p className="text-sm text-muted-foreground">Monitored Plots</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-3xl md:text-4xl font-bold text-primary">99.2%</p>
                  <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-3xl md:text-4xl font-bold text-primary">24/7</p>
                  <p className="text-sm text-muted-foreground">Live Monitoring</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Powerful Features
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Advanced technology for comprehensive land monitoring and compliance management
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Satellite,
                  title: 'Satellite Monitoring',
                  description: 'High-resolution satellite imagery with near real-time tracking of all land parcels.',
                  color: 'text-blue-500',
                  bgColor: 'bg-blue-500/10'
                },
                {
                  icon: Activity,
                  title: 'AI Change Detection',
                  description: 'Advanced ML algorithms detect encroachments and unauthorized constructions automatically.',
                  color: 'text-green-500',
                  bgColor: 'bg-green-500/10'
                },
                {
                  icon: ShieldCheck,
                  title: 'Compliance Reporting',
                  description: 'Generate comprehensive reports for legal and administrative actions instantly.',
                  color: 'text-purple-500',
                  bgColor: 'bg-purple-500/10'
                },
                {
                  icon: TrendingUp,
                  title: 'Analytics Dashboard',
                  description: 'Real-time analytics and insights with interactive charts and visualizations.',
                  color: 'text-orange-500',
                  bgColor: 'bg-orange-500/10'
                },
                {
                  icon: AlertCircle,
                  title: 'Instant Alerts',
                  description: 'Get immediate notifications for any violations or suspicious activities detected.',
                  color: 'text-red-500',
                  bgColor: 'bg-red-500/10'
                },
                {
                  icon: Map,
                  title: 'Interactive Maps',
                  description: 'Navigate through interactive maps with layered information and real-time updates.',
                  color: 'text-cyan-500',
                  bgColor: 'bg-cyan-500/10'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="h-full p-6 rounded-2xl border-2 border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                    <div className={`${feature.bgColor} ${feature.color} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="stats" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Why Choose CSIDC Monitor?
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our platform combines cutting-edge AI technology with comprehensive monitoring capabilities to provide unparalleled oversight of industrial land usage.
                </p>
                
                <div className="space-y-4 pt-4">
                  {[
                    'Real-time satellite imagery analysis',
                    'Automated violation detection',
                    'Comprehensive compliance reports',
                    'User-friendly dashboard interface',
                    '24/7 monitoring and alerts'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6">
                  <Link href="/dashboard">
                    <Button size="lg" className="gap-2">
                      Get Started Now
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary to-blue-500 rounded-3xl blur-2xl opacity-20" />
                <div className="relative grid grid-cols-2 gap-6">
                  {[
                    { label: 'Detection Speed', value: '<1s', icon: Activity },
                    { label: 'Accuracy', value: '99.2%', icon: TrendingUp },
                    { label: 'Coverage Area', value: '500km²', icon: Map },
                    { label: 'Active Alerts', value: '24/7', icon: AlertCircle }
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="p-6 rounded-2xl border-2 border-border bg-card hover:border-primary/50 transition-all"
                    >
                      <stat.icon className="h-8 w-8 text-primary mb-3" />
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container px-4 md:px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">CSIDC Monitor</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced AI-powered industrial land monitoring and compliance management platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2026 CSIDC Monitor. All rights reserved. Built with ❤️ for better land management.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
