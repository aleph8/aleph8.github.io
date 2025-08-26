import React from "react";
import Layout from "@theme/Layout";
import styles from "./about.module.css";

export default function About() {
    return (
        <Layout
            title="About Alejandro García Peláez"
            description="Learn more about Alejandro García Peláez - Software engineer, AI researcher, and technical writer from Málaga">
            <div className={styles.aboutPage}>
                <div className={styles.container}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>
                            About <span className={styles.highlight}>Me</span>
                        </h1>
                    </header>

                    <main className={styles.content}>
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Current Role</h2>
                            <p className={styles.text}>
                                I work as <span className={styles.highlight}>Google's VirusTotal Researcher in AI and Cybersecurity R&D</span>,
                                where I focus on advancing threat intelligence and malware analysis through artificial intelligence.
                                Based in <span className={styles.highlight}>Málaga</span>, Spain, I'm passionate about
                                cybersecurity, malware research, and threat intelligence.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>Current Projects</h2>
                            <p className={styles.text}>
                                Two projects I'm particularly passionate about right now represent different sides of my interests:
                            </p>
                            <p className={styles.text}>
                                <span className={styles.highlight}>Panoruma</span> is my way of preserving Málaga's historical memory.
                                It's a digital archive explorer that lets people discover thousands of historical images of our city
                                using AI-powered search, create personal collections, and explore our shared heritage in an intuitive way.
                            </p>
                            <p className={styles.text}>
                                <span className={styles.highlight}>VT4AI</span> bridges my cybersecurity work with AI applications.
                                It's a Python wrapper around VirusTotal's API that transforms overwhelming security data into
                                AI-friendly formats, making threat intelligence accessible to LLM agents and AI-powered security tools
                                through multiple interfaces (CLI, MCP server, REST API).
                            </p>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>What Drives Me</h2>
                            <p className={styles.text}>
                                I'm someone who can't sit still when it comes to learning. One day I'm diving deep into
                                malware analysis and threat intelligence, the next I'm building spider robots or exploring
                                steganography algorithms. I've even spent time in Denmark researching quantum computing
                                connections to functional programming.
                            </p>
                            <p className={styles.text}>
                                This restless curiosity has led me to work on everything from preserving Málaga's historical
                                memory through digital archives, to creating open-source tools for cybersecurity analysis.
                                Each project teaches me something new and often leads to unexpected connections between seemingly
                                unrelated fields.
                            </p>
                            <p className={styles.text}>
                                True to the Spanish saying "<span className={styles.highlight}>el saber no ocupa lugar</span>"
                                (knowledge takes no space), I believe that exploring diverse domains and combining different
                                perspectives is how incredible things happen.
                            </p>
                        </section>


                    </main>
                </div>
            </div>
        </Layout>
    );
}

