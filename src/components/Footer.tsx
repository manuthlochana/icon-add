const Footer = () => {
  return (
    <footer className="py-12 glass-panel border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <div className="text-2xl font-bold text-primary mb-2">Manuth Lochana</div>
            <p className="text-muted-foreground">Developer • Innovator • Creator</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Manuth Lochana. All rights reserved.
            </p>
            <p className="text-muted-foreground text-xs mt-1">
              Built with passion and cutting-edge technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;