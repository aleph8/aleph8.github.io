---
slug: using-computer-use-to-trigger-interactive-samples
title: Using computer use to trigger interactive samples
authors: [alejandro]
tags: [ai, cybersecurity, malware]
---

Traditional sandboxes face significant limitations when analyzing samples that require human interaction to fully activate. Sample detonation in isolated environments sometimes becomes complicated due to the need to interact with graphical elements for proper deployment and to show their full potential.

Some products offer solutions to control the remote machine where the sample is running; others rely on the existence of certain screen elements, including automating key presses (like repeatedly pressing "Enter" hoping it will work).

<!-- truncate -->

## _Computer Use_

_Computer Use_ is a new capability of LLMs (_Large Language Models_) that allows them to interact directly with user interfaces as a human would. In the context of LLMs, [_Computer Use_](https://www.anthropic.com/news/3-5-models-and-computer-use) refers to the ability of a system based on a model as a "brain" to interact with computers; that is, being able to "see" the screen and interact with the environment by clicking, typing, running applications...

## Real-world practical cases

Let's look at application examples by setting up a small system that allows an LLM to take control of a sandbox (hereafter referred to as **Pandora**).

### 1. Application installers

When installing an application, we usually see a graphical interface with a guided installation and configuration process; below you can observe **Pandora**'s interaction process in an isolated environment with a benign sample: a Firefox MSI installer on Windows 10:

<iframe src="/blog/using-computer-user-to-trigger-interactive-samples/pandora-analysis-firefox-setup.html" width="100%" height="500px"></iframe>

In this case, the system follows basic instructions to install the application, but it could be a custom or specific configuration. With this, in a matter of seconds we would have the application installed in our sandbox to collect information.

### 2. Social engineering

Certain deceptive documents require clicking on specific parts to launch (as in the case of macros) or trick you into downloading another file from dubious sources. This case involves an image that emulates a Colombian judicial entity, urging the user to download another file that is probably malicious:

<iframe src="/blog/using-computer-user-to-trigger-interactive-samples/pandora-analysis-phishing-svg.html" width="100%" height="500px"></iframe>

Unfortunately, the link is no longer available. In a case like this simulated in testing, the agent was able to download the document and enter the password.

### 3. Automated system evasion

In this case, we will see two PDFs designed to prevent file downloads by automated processes:

#### 3.1 Fake Captcha

<iframe src="/blog/using-computer-user-to-trigger-interactive-samples/pandora-analysis-captcha.html" width="100%" height="500px"></iframe>

#### 3.2 I am human

<iframe src="/blog/using-computer-user-to-trigger-interactive-samples/pandora-analysis-custom-image.html" width="100%" height="500px"></iframe>

## Looking towards the future

These cases are really just a small subset of all the samples that platforms like [VirusTotal](https://www.virustotal.com/gui/home/upload) receive daily; however, **Pandora** shows us an application of Artificial Intelligence to address a deficiency in most current sandboxes.

Although this technology presents great potential, it also poses new challenges such as the computational cost of running LLMs in real-time, and the possible evolution of malware to evade even these advanced automated analysis techniques.
