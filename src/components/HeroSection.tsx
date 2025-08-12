

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="text-center space-y-8 z-10">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Speedy Sell Flow
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Discover amazing products at lightning speed. Shop smarter, not harder.
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-20 h-20 rounded-full bg-primary-glow/20 blur-xl" />
      </div>
      <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-32 h-32 rounded-full bg-primary/20 blur-xl" />
      </div>
    </section>
  );
};

export default HeroSection;