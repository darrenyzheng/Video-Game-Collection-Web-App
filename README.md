<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/darrenyzheng/Video-Game-Collection-Web-App">
  </a>

  <h3 align="center">Video Game Collection Web App</h3>

</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#lessons-learned">Lessons Learned</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

I've always loved video games. As a kid, I played them and collected them. Unfortunately, with limited funds, I ended up selling most of my games so that I could buy new games. I ended up buying most of them again at higher prices. I wanted a way to digitally record what I have in my collection so that I can stop using pen and paper and Excel spreadsheets. The Internet Game Database API was a great asset to use so that I can display data about each game like its summary, screenshots, genres, and rating.  


<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![MongoDB][MongoDB]][MongoDB-url]
* [![Express][Express.js]][Express-url]
* [![React][React.js]][React-url]
* [![Node.js][Node.js]][Node-url]
* [![Playwright][Playwright]][Playwright-url]
  
<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Prerequisites

* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation


1. Get a free API Key at https://api-docs.igdb.com/#getting-started
2. Get a MongoDB Atlas Cluster connect String at https://www.mongodb.com/
3. Clone the repo
   ```sh
   git clone https://github.com/your_username/Video_Game_Collection_Web_App.git
   ```
4. Install NPM packages
   ```sh
   npm install
   ```
5. Enter your keys in a `.env` file
   ```js
   const Client_ID = 'ENTER YOUR API';
   const Authorization = 'Bearer ENTER YOUR OAUTH FROM API";
   const MONGODB_CONNECT_STRING = 'ENTER YOUR KEY'
   ```
6.  Start the application    
   ```sh
    cd game
    npm start 
     
    cd game
    node server.mjs
    ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<figure>
  <img src='https://github.com/user-attachments/assets/6b1bda40-cecb-4cdc-997c-75bd772e30dc' alt="Register for an account"/>
  <figcaption><strong>Register for an account</strong></figcaption>
</figure>
<br/>
<br/>

<figure>
  <img src='https://github.com/user-attachments/assets/81278713-8546-43e7-9865-c7635f5aa025' alt="Login"/>
  <figcaption><strong>Login</strong></figcaption>
</figure>
<br/>
<br/>

<figure>
  <img src='https://github.com/user-attachments/assets/66b39a0d-be75-4103-8f04-3143119cb4b0' alt="Searching for games fetches the results from IGDB API"/>
  <figcaption><strong>Searching for games fetches the results from IGDB API</strong></figcaption>
</figure>
<br/>
<br/>

<figure>
  <img src='https://github.com/user-attachments/assets/0bc82aa0-2c31-487c-8864-ec0ffb60e8ba' alt="Clicking on a game shows data and a way to add it to collection"/>
  <figcaption><strong>Clicking on a game shows data and a way to add it to collection</strong></figcaption>
</figure>
<br/>
<br/>

<figure>
  <img src='https://github.com/user-attachments/assets/d275bd65-be57-4a00-8bd7-b990091edca9' alt="Clicking on the filter button allows you to filter results down to genre and platform"/>
  <figcaption><strong>Clicking on the filter button allows you to filter results down to genre and platform</strong></figcaption>
</figure>
<br/>
<br/>

<figure>
  <img src='https://github.com/user-attachments/assets/6d8e475e-adb8-4b34-af95-2cb52f397703' alt="Results after filter"/>
  <figcaption><strong>Results after filter</strong></figcaption>
</figure>
<br/>
<br/>

<figure>
  <img src='https://github.com/user-attachments/assets/575b3bac-432d-4093-adeb-f81569f70c44' alt="Results after using filter bar next to search bar"/>
  <figcaption><strong>Results after using filter bar next to search bar</strong></figcaption>
</figure>
<br/>
<br/>

<figure>
  <img src='https://github.com/user-attachments/assets/3d0df63b-052e-405a-84e3-97cca4849f9b' alt="Showing user's collection while hovering over a game"/>
  <figcaption><strong>Showing user's collection while hovering over a game</strong></figcaption>
</figure>
<br/>
<br/>

<figure>
  <img src='https://github.com/user-attachments/assets/6a31d7d6-7922-49a6-b339-99ee5f277453' alt="Statistics dynamically generates based off of user's collection"/>
  <figcaption><strong>Statistics dynamically generates based off of user's collection</strong></figcaption>
</figure>
<br/>
<br/>

<figure>
  <img src='https://github.com/user-attachments/assets/a7fce6cb-8be8-43bc-91ff-bc812b159414' alt="User's personalized settings"/>
  <figcaption><strong>User's personalized settings</strong></figcaption>
</figure>
<br/>
<br/>


<!-- CONTACT -->
## Contact

Project Link: (https://github.com/darrenyzheng/Video-Game-Collection-Web-App)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LESSONS LEARNED -->

## Lessons Learned 

<p> This is the first time that I was able to consume data from a public API rather than using static data. I had some trouble getting started because I was not sure of the format, so I had initially tested it with Postman and configuring with the headers. Once I was able to get data from the API, I switched to using my server and using a route handler for the endpoint. Otherwise, passing down a global variable using useContext so that I can have a state variable be available for my sidebar when I'm logged in / out was a big revalation.   </p>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments


* [React Icons](https://react-icons.github.io/react-icons/search)
* [IGDB API](https://api-docs.igdb.com/#getting-started)
<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->


[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge
[Express-url]: https://expressjs.com/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node-dot-js&logoColor=white
[Node-url]: https://nodejs.org/
[Playwright]: https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white
[Playwright-url]: https://playwright.dev/

