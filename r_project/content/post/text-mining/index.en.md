---
aliases:
author: Alejandro García Peláez
categories:
- Data Science
date: "2023-02-08"
description:
image: landing.svg 
series:
tags:
- text-mining
title: Text Mining
---

Text mining is the process by which information of value or interest is obtained through the analysis of different textual sources: blogs, books, social networks... 

As you can think this has great potential and allows us to obtain patterns and trends (thanks to various statistical methods) that we can apply to multiple fields.

In my case I will work with R (for more information see [R and RStudio](/en/p/2023/r-and-rstudio)) and the various packages it offers to work with text mining and data analysis in general; besides this R seems to me very powerful and versatile, with a large background community.

To explain the process in more detail I will start from an example with the creation of a '**wordcloud**' (visual representation of text in 'cloud form') with the most frequent words in one of [Friedrich Nietzsche's](https://en.wikipedia.org/wiki/Friedrich_Nietzsche) books. 

We mainly start from a **disordered data set**. This is common when we work with data extracted from articles, books or multiple sources, since there is information that is not relevant to our analysis and is not even ordered. 

For ease of understanding I will define the following key concepts:

* **Token**: fundamental part of our analysis. It is an atomic unit that has great meaning value for us; it is commonly a word.

* **Tokenization**: division of the text into tokens.

* **Tidy Text**: general principles to obtain better results from data analysis. It consists of a series of fundamental principles: each variable is a column, each observation is a row and each observation unit is a table.

** **Tibble**: modern data frame in R that adapts to our needs when working with the Tidy Text format and allows us to visualize the data frame efficiently.


The first thing to do is to convert our unordered data set to **Tidy Text** format, then **Tokenize** it and remove irrelevant information. Once this is done, we can group the words according to their frequency in the text and generate the '**wordcloud**'.

Para finalizar muestro el resultado con la versión en inglés de ['Beyond the good and evil' de Friedrich Nietzsche]():

<div style="text-align: center;">
  <img src="nwordcloud.png" alt="Image" width="600">
</div>

**R Code**

```r
library(tidytext)
library(dplyr)
library(stringr)
library(wordcloud)
library(gutenbergr)

### Worldcloud of a Nietzsche book

stwd <- bind_rows(tibble(word = c("german","hitherto"),lexicon = c("CUSTOM")),stop_words)

Nbook <- gutenberg_download(c(4363)) %>%
  unnest_tokens(word,text) %>%
  anti_join(stwd) %>%
  count(word,sort=TRUE)

Nbook %>%  
  with(wordcloud(word,n,max.words = 100,scale=c(2,.1),colors = c("red","black","blue")))
```