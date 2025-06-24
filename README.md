Katherine Tse Project A4 Readme
===

Do the following to complete this assignment:

1. Implement your project with the above requirements.
3. Test your project to make sure that when someone goes to your main page on Glitch/Heroku/etc., it displays correctly.
4. Ensure that your project has the proper naming scheme `a4-firstname-lastname` so we can find it.
5. Fork this repository and modify the README to the specifications below. Be sure to add *all* project files.
6. Create and submit a Pull Request to the original repo. Name the pull request using the following template: `a4-firstname-lastname`.

Sample Readme (delete the above when you're ready to submit, and modify the below so with your links and descriptions)
---

## Gymnastics Competition Personal Score Tracker

Hosting Link: 

**Project Summary**: This project is an application that allows gymnasts to store their scores all in one place. TO start, users can log into their account to see their data. They can also input their event scores by competition and the application will calculate the total (also known as All-Around) score. Users can delete and edit entries as well. The data is persistent using MongoDB. 

**Changes**: While the UI and user experince did not change, I took the entirety of the data manipulation, management, and display and rewrote it using React. I also added Vite to the server. 

**Improve or Hinder?**: React really does improve functionality in my opinion. It made it a lot easier to share variables between different functions, smplify a lot of functions and reduce redundancy. However, I had an incredibly difficult time deploying the applicaiton. I used Babel to build my JSX files and the deployment could not find the build output JS file. 
