class filmsDAO {

  getFilms() {
    return axios.get('http://localhost:3000/films')
  }

  addFilm(film) {
    return axios.post('http://localhost:3000/films', film);
  }

  updateFilm(film) {

  }

  deleteFilm(film) {
    return axios.delete('http://localhost:3000/films/' + film.id)
  }
}
