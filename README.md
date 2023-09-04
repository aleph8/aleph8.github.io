## My Universe

Project of my framework "My Universe", as a personal website.

### Features

----

- The project consists of an initial website with a small search engine implemented, in order to find any information pertaining to the web in a short time.

- It also contains the last five publications, which are automatically updated every time the web is generated.

- On the other hand we have the access to the constellations, according to the specialty. These constellations are automatically generated with the publication files and their metadata.

- The unified format for publications is 'Markdown' as it can be easily handled with Pandoc.

- In the metadata we must include, among other things, the id of the "star" which is the date, since I don't upload two publications in the same day. For example, if I make a publication on February 5, 2025 the associated id will be "05022025".

- In addition, the relationship between the stars that form the constellation must be established.

- When the web is generated:
  
    - Files containing the nodes of each constellation and their relationships are generated.

    - The index of the whole page that feeds the search engine and is used in the generation of the latest publications is generated.

    - All posts are converted from Markdown to HTML with a template (available at the source).

    - It generates all the necessary files for the web to work and look correctly.

    - All this is built in the "dist" directory which contains the generated project in a structured way.
 
- The page hides some secrets ... more and more!
