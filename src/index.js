document.addEventListener("DOMContentLoaded", function () {
    fetchMovies();
});

function fetchMovies() {
    fetch('db.json')
        .then(response => response.json())
        .then(movies => {
            displayMovieDetails(movies[0]);
            populateMovieMenu(movies);
        })
        .catch(error => console.error("Error fetching movies:", error));
}

function displayMovieDetails(movie) {
    const availableTickets = movie.theaterCapacity - movie.ticketsSold;

    document.getElementById("moviePoster").src = movie.poster;
    document.getElementById("movieTitle").textContent = movie.title;
    document.getElementById("movieRuntime").textContent = "Runtime: " + movie.runtime;
    document.getElementById("showtime").textContent = "Showtime: " + movie.showtime;
    document.getElementById("availableTickets").textContent = "Available Tickets: " + availableTickets;

    const buyTicketBtn = document.getElementById("buyTicketBtn");
    if (availableTickets === 0) {
        buyTicketBtn.textContent = "Sold Out";
        buyTicketBtn.disabled = true;
    } else {
        buyTicketBtn.textContent = "Buy Ticket";
        buyTicketBtn.disabled = false;
        buyTicketBtn.removeEventListener("click", buyTicket);
        buyTicketBtn.addEventListener("click", () => buyTicket(movie));
    }
}

function populateMovieMenu(movies) {
    const filmsList = document.getElementById("films");
    filmsList.innerHTML = '';
    movies.forEach(movie => {
        const li = document.createElement("li");
        li.textContent = movie.title;
        li.classList.add("film", "item");
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteMovie(movie.id));
        li.appendChild(deleteBtn);
        filmsList.appendChild(li);
    });
}

function buyTicket(movie) {
    const updatedMovie = { ...movie };
    updatedMovie.ticketsSold++;
    displayMovieDetails(updatedMovie);
    updateMovieOnServer(updatedMovie);
}

function updateMovieOnServer(movie) {
    fetch(`db.json/${movie.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(movie)
    })
    .then(response => response.json())
    .then(updatedMovie => console.log("Movie updated successfully:", updatedMovie))
    .catch(error => console.error("Error updating movie:", error));
}

function deleteMovie(movieId) {
    fetch(`db.json/${movieId}`, {
        method: 'DELETE',
    })
    .then(() => {
        console.log("Movie deleted successfully");
        
        
    })
    .catch(error => console.error("Error deleting movie:", error));
}
