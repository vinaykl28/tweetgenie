import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Twitter, 
  Copy,
  Check,
  PenTool,
  ChevronDown,
  Zap,
  Shield,
  MessageSquare,
  HelpCircle,
  Star,
  ArrowRight,
  Sparkles,
  MousePointer2,
  Share2
} from 'lucide-react';
import { generateBrandTweets, BrandAnalysis } from './services/aiService';

// --- Types ---

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

// --- Components ---

const TweetCard = ({ tweet, index }: { tweet: any, index: number, key?: React.Key }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tweet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-white border border-zinc-200 p-6 rounded-2xl hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-default"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{tweet.style}</span>
        <button 
          onClick={handleCopy}
          className="p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-emerald-600 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-lg leading-relaxed text-zinc-800 mb-4">{tweet.content}</p>
      <div className="flex items-center gap-2 text-zinc-400 text-xs">
        <Twitter className="w-3 h-3" />
        <span>Ready to post</span>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [formData, setFormData] = React.useState({
    brandName: '',
    industry: '',
    objective: 'Engagement',
    description: '',
    targetAudience: '',
    tone: 'Professional'
  });
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<BrandAnalysis | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleTrySample = (brand: 'Nike' | 'Zomato' | 'Apple') => {
    const samples = {
      Nike: {
        brandName: 'Nike',
        industry: 'Sports & Lifestyle',
        objective: 'Inspirational',
        description: 'World leader in athletic footwear and apparel. Famous for the "Just Do It" slogan. Focuses on innovation, performance, and empowering athletes of all levels.',
        targetAudience: 'Athletes, fitness enthusiasts, and dreamers.',
        tone: 'Inspirational'
      },
      Zomato: {
        brandName: 'Zomato',
        industry: 'Food Tech & Delivery',
        objective: 'Engagement',
        description: 'A leading food delivery and restaurant discovery platform. Known for witty, relatable, and trend-jacking social media presence. Focuses on the joy of food and convenience.',
        targetAudience: 'Foodies, urban youth, and busy professionals.',
        tone: 'Witty & Playful'
      },
      Apple: {
        brandName: 'Apple',
        industry: 'Consumer Electronics',
        objective: 'Awareness',
        description: 'Global tech giant known for premium design, user-friendly interfaces, and a closed ecosystem. Focuses on privacy, creativity, and "Think Different" philosophy.',
        targetAudience: 'Creative professionals, tech enthusiasts, and premium consumers.',
        tone: 'Minimalist'
      }
    };
    setFormData(samples[brand]);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) {
      setError("Please describe your brand.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await generateBrandTweets(formData);
      setResults(data);
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error("Generation Error:", err);
      setError(err.message || "Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-emerald-500/10 selection:text-emerald-700">
      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="mb-24 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
          </div>
          
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-xs font-bold mb-8"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Strategy Engine (Llama 3)</span>
            </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white border border-zinc-200 shadow-xl shadow-emerald-500/10 rounded-3xl mb-8 cursor-pointer relative group"
          >
            <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl group-hover:bg-emerald-500/10 transition-colors" />
            <Twitter className="w-10 h-10 text-emerald-600 relative z-10" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 text-zinc-900 leading-[0.9]">
            Tweetify <span className="text-emerald-600">AI</span>
          </h1>
          <p className="text-zinc-500 text-xl max-w-2xl mx-auto leading-relaxed">
            The ultimate brand strategy and tweet generation engine. <br className="hidden md:block" />
            Crafted for brands that demand high-impact social presence.
          </p>
        </header>

        {/* Generator Form */}
        <section className="bg-white border border-zinc-200 p-8 rounded-3xl mb-20 shadow-sm">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sample Buttons at Top */}
            <div className="md:col-span-2 flex flex-col gap-3 pb-4 border-b border-zinc-100">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Quick Start: Try a Sample Brand</label>
              <div className="flex flex-wrap gap-2">
                {(['Nike', 'Zomato', 'Apple'] as const).map(brand => (
                  <motion.button 
                    key={brand}
                    type="button"
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTrySample(brand)}
                    className="px-5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-bold text-zinc-600 hover:text-emerald-600 hover:border-emerald-500/30 hover:bg-emerald-50/50 transition-all shadow-sm"
                  >
                    {brand}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Brand Name</label>
              <input 
                type="text" 
                placeholder="e.g. Acme Corp"
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-zinc-300"
                value={formData.brandName}
                onChange={e => setFormData({...formData, brandName: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Industry</label>
              <input 
                type="text" 
                placeholder="e.g. Sustainable Tech"
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-zinc-300"
                value={formData.industry}
                onChange={e => setFormData({...formData, industry: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Objective</label>
              <div className="relative">
                <select 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.objective}
                  onChange={e => setFormData({...formData, objective: e.target.value})}
                >
                  <option>Engagement</option>
                  <option>Promotion</option>
                  <option>Awareness</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Target Audience</label>
              <input 
                type="text" 
                placeholder="e.g. Gen Z Creators"
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-zinc-300"
                value={formData.targetAudience}
                onChange={e => setFormData({...formData, targetAudience: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tone</label>
              <div className="relative">
                <select 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all appearance-none cursor-pointer"
                  value={formData.tone}
                  onChange={e => setFormData({...formData, tone: e.target.value})}
                >
                  <option>Professional</option>
                  <option>Witty & Playful</option>
                  <option>Inspirational</option>
                  <option>Minimalist</option>
                  <option>Aggressive & Bold</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col gap-3 md:col-span-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Brand Description</label>
              <textarea 
                rows={4}
                placeholder="Describe what makes your brand stand out..."
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-zinc-300 resize-none"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div className="md:col-span-2 flex items-center justify-between pt-4">
              <div className="flex flex-col gap-1">
                {error && <span className="text-red-500 text-sm font-medium">{error}</span>}
              </div>
              <motion.button 
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-300 text-white font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-3 shadow-lg shadow-emerald-600/20"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Generate Strategy</span>
                    <PenTool className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </section>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div 
              id="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-16"
            >
              {/* Detailed Analysis Section */}
              <div className="bg-white border border-zinc-200 p-10 rounded-[2.5rem] shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">Brand Strategy</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Brand Voice</h3>
                      <div className="flex flex-wrap gap-2">
                        {results.brandVoiceSummary.map((point, i) => (
                          <span key={i} className="bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-xl text-sm text-zinc-600">
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Content Pillars</h3>
                      <div className="space-y-3">
                        {results.contentPillars.map((pillar, i) => (
                          <div key={i} className="flex items-center gap-3 text-zinc-700">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            <span className="font-medium">{pillar}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Key Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {results.keyKeywords.map((word, i) => (
                          <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-xs font-bold">
                            #{word.replace(/\s+/g, '')}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Audience Resonance</h3>
                      <p className="text-zinc-600 leading-relaxed italic border-l-2 border-emerald-500 pl-6">
                        {results.audienceResonance}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-3xl font-bold tracking-tight px-2">Generated Tweets</h2>
                <div className="grid grid-cols-1 gap-6">
                  {results.tweets.map((tweet, i) => (
                    <TweetCard key={i} tweet={tweet} index={i} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features Section */}
        <section className="py-24 border-t border-zinc-100">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why choose Tweetify AI?</h2>
            <p className="text-zinc-500">The most advanced tweet generator for modern brands.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Instant Generation", desc: "Get high-quality tweets in seconds, not hours." },
              { icon: Sparkles, title: "Tone Matching", desc: "Our AI adapts to your brand's unique personality perfectly." },
              { icon: Share2, title: "Engagement Focused", desc: "Designed to trigger likes, retweets, and conversations." }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                whileHover={{ 
                  y: -12,
                  scale: 1.02,
                  boxShadow: "0 20px 40px -12px rgba(16, 185, 129, 0.15)",
                  borderColor: "rgba(16, 185, 129, 0.4)"
                }}
                className="p-8 bg-white border border-zinc-200 rounded-3xl transition-all group cursor-default relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-colors" />
                <feature.icon className="w-12 h-12 text-emerald-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform" />
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-24 border-t border-zinc-100">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-8 tracking-tight">How it works in <span className="text-emerald-600">3 simple steps</span></h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Input Brand Details", desc: "Tell us about your brand, industry, and target audience." },
                  { step: "02", title: "AI Magic", desc: "Our advanced AI models analyze your brand voice and craft tailored tweets." },
                  { step: "03", title: "Copy & Post", desc: "Review the generated options, copy your favorite, and watch the engagement grow." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ x: 10 }}
                    className="flex gap-6 group cursor-default"
                  >
                    <span className="text-emerald-600 font-mono font-bold text-xl group-hover:scale-125 transition-transform">{item.step}</span>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-zinc-500">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-white border border-zinc-200 p-10 rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-emerald-500/5 group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-emerald-500/10 transition-colors" />
              
              <div className="relative space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                    <Twitter className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3 w-24 bg-zinc-200 rounded-full" />
                    <div className="h-2 w-16 bg-zinc-100 rounded-full" />
                  </div>
                </div>

                <div className="space-y-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-3 bg-zinc-100 rounded-full" 
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "85%" }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-3 bg-zinc-100 rounded-full" 
                  />
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "60%" }}
                    transition={{ duration: 1, delay: 0.9 }}
                    className="h-3 bg-zinc-100 rounded-full" 
                  />
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl mt-8 relative"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-emerald-800 font-medium text-sm leading-relaxed">
                    "Just launched our new product! 🚀 The response has been incredible. Can't wait to see where this journey takes us. #Innovation #Tech"
                  </p>
                  <div className="flex gap-4 mt-4 opacity-40">
                    <div className="h-2 w-8 bg-emerald-200 rounded-full" />
                    <div className="h-2 w-8 bg-emerald-200 rounded-full" />
                    <div className="h-2 w-8 bg-emerald-200 rounded-full" />
                  </div>
                </motion.div>

                <div className="flex justify-end pt-4">
                  <div className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-full opacity-20">
                    Post Tweet
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 border-t border-zinc-100">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Trusted by Social Media Managers</h2>
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />)}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Jenkins", role: "Head of Social, TechFlow", quote: "Tweetify AI has cut our content creation time by 70%. The tone matching is scarily accurate." },
              { name: "Marcus Chen", role: "Founder, Bloom Agency", quote: "Finally, an AI tool that doesn't sound like a robot. Our clients are seeing record engagement." },
              { name: "David Walnut", role: "Marketing Director, Walnut Company", quote: "The brand strategy output is a game-changer for our assessment process. It's precise, creative, and incredibly fast." }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-8 bg-white border border-zinc-200 rounded-3xl italic text-zinc-600 relative shadow-sm hover:border-emerald-500/30 transition-all"
              >
                <MessageSquare className="absolute top-6 right-6 w-8 h-8 text-zinc-100" />
                <p className="mb-6 leading-relaxed relative z-10">"{t.quote}"</p>
                <div className="not-italic relative z-10">
                  <p className="font-bold text-zinc-900">{t.name}</p>
                  <p className="text-zinc-400 text-sm">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 border-t border-zinc-100">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Is it really free?", a: "Yes! You can generate as many tweets as you need for your brand." },
                { q: "How accurate is the tone matching?", a: "We use state-of-the-art AI models (Groq and Llama 3) which are trained on millions of high-engagement social media posts to ensure perfect brand alignment." },
                { q: "Can I use it for multiple brands?", a: "Absolutely. Just change the brand details in the form and hit generate." }
              ].map((faq, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 5 }}
                  className="p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm cursor-default"
                >
                  <div className="flex gap-4">
                    <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-2">{faq.q}</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-400 text-sm">
          <p>© {new Date().getFullYear()} Tweetify AI. Crafted with precision for the modern web.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contact Us</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
