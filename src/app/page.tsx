import { ArrowRight, ArrowDown, Building2, Coffee, MapPin, Monitor, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { EnquiryForm } from "@/components/enquiry-form";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { HeroBackground } from "@/components/hero-background";
import { ScrollTop } from "@/components/scroll-top";

const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME || "Corner CoWorks";
const location = process.env.NEXT_PUBLIC_PROJECT_LOCATION || "Bhopal, Madhya Pradesh";
const tagline = process.env.NEXT_PUBLIC_PROJECT_TAGLINE || "Real estate as a solution, built for professionals. Subscribe, rather than Lease";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: projectName,
  description: `Flexible, subscription-based coworking and commercial office spaces in ${location}.`,
  image: `${siteUrl}/images/logo-color.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bhopal",
    addressRegion: "Madhya Pradesh",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 23.2321438, longitude: 77.433168 },
  hasMap: "https://www.google.com/maps?q=23.2321438,77.433168",
  openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "09:00", closes: "19:00" },
};

export default function Home() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <SiteHeader projectName={projectName} />
      <section className="hero" id="home">
        <HeroBackground />
        {/* <div className="hero-ambient" aria-hidden="true" /> */}
        <div className="hero-content hero-waitlist">
          <Image className="hero-logo" src="/images/logo-white-color.png" alt="Corner Coworks" width={150} height={49} priority unoptimized />
          <div className="eyebrow hero-label"><span className="live-dot" /> A MINI TECHPARK</div>
          <h1>Coming <em>soon!</em></h1>
          <p className="hero-description">{tagline}.</p>
          {/* <Countdown /> */}
          <div className="">
            {/* <div className="hero-waitlist-tag"><Sparkles size={14} /> EARLY ACCESS</div> */}
            <h2>Enjoy Early Access!</h2>
            {/* <p>and be among the first to explore more about what&apos;s next.</p> */}
            <a className="button button-primary hero-enquire-button" href="#enquire"> Join our waitlist <ArrowRight size={16} /></a>
          </div>
        </div>
        <div className="hero-wordmark" aria-hidden="true">WAITLIST</div>
        <a className="scroll-down-btn" href="#vision" aria-label="Scroll down"><ArrowDown size={20} /></a>
      </section>

      <div className="section-container">
      <Reveal>
        <section className="intro-section section-pad" id="vision">
        <div className="section-kicker">01 / THE VISION</div>
        <div className="intro-grid">
          <h2>Not another<br />coworking space.<br /><em>A Mini Tech Park.</em></h2>
          <div className="intro-copy">
            <p className="lead">A thoughtfully envisioned business destination built around the way the world is headed tomorrow.</p>
            <p>From growing enterprises to individual business heroes, the vision is to create an environment where ambition and opportunity meets the flexibility of modern office spaces.</p>
            <a className="underlined-link" href="#enquire">Be among the first to know <ArrowRight size={16} /></a>
          </div>
        </div>
        <div className="vision-statement"><Sparkles size={18} /><span>DESIGNED FOR AMBITION. CURATED FOR PRODUCTIVITY. BUILT FOR TOMORROW.</span><span className="vision-line" /></div>
        </section>
      </Reveal>

      <Reveal>
        <section className="highlights-section section-pad" id="highlights">
        <div className="section-kicker">02 / THE OPPORTUNITY</div>
        <div className="section-heading-row">
          <h2>Flexibility is the<br /><em>new flex.</em></h2>
          <div className="intro-copy">
          <p className="lead">Great Work Deserves Greater Visibility.</p>
          <p>Every &apos;office hour&apos; invested is an opportunity to grow and collaborate.<br/>A place to enhance business ROI, along with &apos;Return on Impression&apos;. </p>
          </div>
        </div>
        <div className="feature-grid">
          <article className="feature-card feature-large">
            <div className="feature-card-inner">
              <div className="card-front">
                <div className="feature-number">01</div><Building2 size={25} />
                <h3>Workspaces<br />with purpose</h3>
                <p>Planned commercial environments designed to support the needs of modern businesses.</p>
                <span className="feature-foot">COMMERCIAL WORKSPACES</span>
              </div>
              <div className="card-back"><Image src="/images/WWAP.png" alt="Modern commercial workspace with purposeful layout" width={400} height={300} /></div>
            </div>
          </article>
          <article className="feature-card">
            <div className="feature-card-inner">
              <div className="card-front">
                <div className="feature-number">02</div><Sparkles size={25} />
                <h3>Flexibility<br />enhanced</h3>
                <p>For businesses with flexible needs, choose to subscribe, than lease.</p>
                <span className="feature-foot">BUILT FOR CONNECTION</span>
              </div>
              <div className="card-back"><Image src="/images/FE.png" alt="Flexible coworking space with collaborative seating" width={400} height={300} /></div>
            </div>
          </article>
          <article className="feature-card">
            <div className="feature-card-inner">
              <div className="card-front">
                <div className="feature-number">03</div><ShieldCheck size={25} />
                <h3>Infrastructure<br />for tomorrow</h3>
                <p>Planned for businnesses striving in changing business landscape.</p>
                <span className="feature-foot">FUTURE FOCUSED</span>
              </div>
              <div className="card-back"><Image src="/images/IFT.png" alt="Future-ready office infrastructure and meeting rooms" width={400} height={300} /></div>
            </div>
          </article>
        </div>
        <div className="amenity-strip">
          <span><Monitor size={17} /> Work-ready setup</span>
          <span><Coffee size={17} /> Coffee & conversations</span>
          <span><ShieldCheck size={17} /> Thoughtful environment</span>
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="gallery-section section-pad" aria-labelledby="gallery-title">
        <div className="gallery-heading"><div className="section-kicker">03 / A SNEAK PEEK</div><h2 id="gallery-title">A little room<br /><em>for big ideas.</em></h2><p>A glimpse of the kind of inspiring, comfortable workspace we are working towards.</p></div>
        <div className="cowork-gallery">
          <div className="gallery-photo gallery-photo-one" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=800)" }}><span>SPACE TO FOCUS</span></div>
          <div className="gallery-photo gallery-photo-two" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800)" }}><span>ROOM TO COLLABORATE</span></div>
          <div className="gallery-photo gallery-photo-three" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800)" }}><span>TAKE A BREATHER</span></div>
        </div>
        <p className="gallery-disclaimer">Visuals are indicative references. Final interiors, facilities and workspace offerings may vary.</p>
        </section>
      </Reveal>

      <Reveal>
        <section className="location-section section-pad" id="location">
        <div className="location-art">
          <iframe
            className="location-map-frame"
            src="https://www.google.com/maps?q=23.2321438%2C77.433168&z=17&output=embed"
            title="Map showing the Naturals Ice Cream location in Bhopal"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="map-label"><span>PROJECT LOCATION</span><strong>Naturals Ice Cream, Bhopal</strong></div>
          <a className="map-coordinate map-open-link" href="https://www.google.com/maps/place/Naturals+Ice+Cream/@23.2321438,77.433168,17z/data=!3m1!4b1!4m6!3m5!1s0x397c4267810ae22b:0x54ebbee033e4dd23!8m2!3d23.2321438!4d77.433168!16s%2Fg%2F11bv19dl8f?entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">OPEN IN GOOGLE MAPS ↗</a>
        </div>
        <div className="location-copy">
          <div className="section-kicker">03 / THE ADDRESS</div>
          <h2>Rooted here.<br /><em>Ready for everywhere.</em></h2>
          <p>Location is central to opportunity. Discover a business destination planned for the next chapter of growth in {location}.</p>
        </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="enquiry-section section-pad" id="enquire">
        <div className="enquiry-copy">
          <div className="section-kicker">04 / FIRST ACCESS</div>
          <h2>Don&apos;t join <span>Corner CoWorks</span><br /> <em>just for a place to work.</em></h2>
          <p>You join to become part of something bigger.</p>
          <div className="enquiry-note"><span className="live-dot" /> REGISTER YOUR INTEREST</div>
        </div>
        <div className="form-panel">
          <EnquiryForm />
        </div>
        </section>
      </Reveal>
      </div>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home" aria-label={`${projectName} home`}>
          <Image className="brand-logo" src="/images/logo-color.png" alt="Corner Coworks" width={180} height={58} /></a>
        <span>© {new Date().getFullYear()} {projectName}. All rights reserved.</span>
        <ScrollTop />
      </footer>
    </main>
  );
}
