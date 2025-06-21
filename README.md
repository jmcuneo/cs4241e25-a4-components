## Magnolia
https://a4.greenbueller.com

This is a continuation of my A2/A3 assignment. In this version, I implemented Svelte. Svelte enabled me to modularize a lot of common aspects of the website into separate components, and it made a lot of the final page development a lot easier. The most complicated portion was just the initial setup, as it took me a while to get Vite actually working. From there, it was simply just convert my JS/HTML into Svelte components.

What I changed in this version is the header and footer are now components that are called across every page, with unique attributes in the header for every page using booleans. Additionally, the OTP system was made into a component and shared across /login and /register. And finally, I added a theme system, where the user can select from one of four themes on any page, and it will stay consistent across their entire session (even if they log in or get logged out).

In the end, I think this helped me with development, I just wish I was able to understand it quicker.

One side note I would like to mention is that I tried to add a gradient-based theme, but I could not get it to work with my current system. If there are any resources that could help me get it to work, I would really appreciate seeing them.