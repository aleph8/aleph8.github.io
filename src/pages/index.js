import React from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";
import { FaGithub, FaLinkedin, FaTwitter, FaBookOpen } from "react-icons/fa";
import styles from "./index.module.css";

export default function Home() {
  return (
    <Layout
      title="From Curiosity to Creation"
      description="Alejandro García Peláez - A restless mind from Málaga building tomorrow's solutions">
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.content}>
            <h1 className={styles.title}>
              From <span className={styles.highlight}>CURIOSITY</span> to Creation
            </h1>

            <div className={styles.description}>
              <p>
                Hi, I'm <span className={styles.highlight}>Alejandro García Peláez</span> — a restless mind from Málaga building tomorrow's solutions.
              </p>
              <p>
                Fascinated by <span className={styles.highlight}>how things works</span> since childhood. I craft products
                and systems that bridge complex technology with <span className={styles.highlight}>people</span> needs.
              </p>
              <p>
              Always learning — <span className={styles.highlight}>knowledge</span> takes no space.
              </p>
            </div>

            <div className={styles.cta}>
              <Link to="/about" className={styles.ctaLink}>
                About me →
              </Link>
            </div>

            {/* Social Links */}
            <div className={styles.socialLinks}>
              <a href="https://github.com/aleph8" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaGithub size={20} />
              </a>
              <a href="https://linkedin.com/in/alegpwk" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaLinkedin size={20} />
              </a>
              <a href="https://x.com/alegpmbt" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaTwitter size={20} />
              </a>
              <Link to="/blog" className={styles.socialLink}>
                <FaBookOpen size={20} />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
