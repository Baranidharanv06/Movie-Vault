 🎬 MovieVault

A modern, responsive web application for discovering the latest trending movies and TV shows. Users can search for content, view details and trailers, and bookmark their favorites for later.

**Live Demo:** [https://movie-vault-your-url.vercel.app](https://movie-vault-ruddy.vercel.app/) 



---

## ✨ Features

- **Trending Content:** View the latest trending movies and TV shows at a glance.
- **Detailed Search:** Search for any movie or show by name with instant results.
- **Movie Details Modal:** Click on any movie to see its rating, summary, genres, and watch the official trailer directly on the page.
- **Bookmarking:** Save your favorite movies to a personal bookmark list that is persisted in your browser's local storage.
- **Responsive Design:** A clean, modern "Prestige" theme that works beautifully on all devices, from mobile phones to desktops.
- **Secure API Key Handling:** Uses environment variables to securely manage API keys on the server, a best practice for production applications.

---

## 🛠️ Tech Stack

- **React:** A JavaScript library for building user interfaces.
- **Vite:** A modern, fast front-end build tool.
- **JavaScript (ES6+):** For all application logic.
- **CSS3:** Custom styling with a premium "Prestige" theme for a professional look.
- **TMDb API:** Used to fetch all movie and TV show data.
- **Vercel:** For seamless deployment and hosting.

---

## 🚀 How to Run Locally

To get a local copy up and running, follow these simple steps.

### Prerequisites

You need to have Node.js and npm installed on your machine.

- [Node.js](https://nodejs.org/)

### Installation

1.  Clone the repository:
    ```bash
    git clone [https://github.com/your-username/movie-vault-project.git](https://github.com/your-username/movie-vault-project.git)
    ```
2.  Navigate to the project directory:
    ```bash
    cd movie-vault-project
    ```
3.  Install NPM packages:
    ```bash
    npm install
    ```
4.  Create a `.env.local` file in the root of the project and add your TMDb API key:
    ```
    VITE_TMDB_API_KEY=your_api_key_goes_here
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 🌟 Future Enhancements

Here are some ideas for future improvements:

- **Pagination / Infinite Scroll:** Add a "Load More" button or automatically load more movies as the user scrolls.
- **Genre Filtering:** Add a dropdown menu to filter movies by genre.
- **Loading Skeletons:** Implement placeholder loading skeletons for a better user experience while data is being fetched.
