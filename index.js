var filmsDataAccessObject = new filmsDAO();
var films = [];
filmsDataAccessObject.getFilms().then(function (res) {
  films = res.data;
  renderTable(films);
})

function addFilm(e, form) {
    e.preventDefault();

    // obtengo todos los datos del formulario
    var filmName = form.filmName.value;
    var filmYear = Number(form.filmYear.value);
    var filmGenre = form.filmGenre.value;
    var filmVoters = Number(form.filmVoters.value);
    var filmTotalVotes = Number(form.filmTotalVotes.value);

    // me fijo si la pelicula ya esta cargada
    var existingFilm = getFilm(filmName);

    // si esta cargada?
    if (existingFilm != undefined) {
        alert("La película ya está en nuestra base de datos");

        // si no esta cargada
    } else {
        var film = {
            name: filmName,
            year: filmYear,
            genre: filmGenre,
            voters: filmVoters,
            totalVotes: filmTotalVotes,
            raiting: getRaiting(filmVoters, filmTotalVotes)
        };

        // agrego la pelicula al array
        filmsDataAccessObject.addFilm(film)
          .then(function(res) {
            films.push(res.data);
            // limpio el formulario
            cleanAddFilmForm(form);

            // la agrego a la tabla
            addFilmToTable(film);
          })
          .catch(function(err) {
            console.warn(err);
            alert("No se pudo agregar la pelicula");
          });

    }
}

function getRaiting(voters, totalVotes) {
    return (totalVotes / voters).toFixed(2);
}

function getFilm(filmName) {
    // return films.find(x => x.name == filmName);
    return films.find(function (film) {
        return film.name.toLowerCase() == filmName.toLowerCase();
    });
}

function cleanAddFilmForm(form) {
    form.filmName.value = "";
    form.filmYear.value = "";
    form.filmGenre.selectedIndex = 0;
    form.filmVoters.value = "";
    form.filmTotalVotes.value = "";
}

function addFilmToTable(film) {
    var tableBody = document.getElementById('filmsTableBody');
    var newFilmRow = tableBody.insertRow();
    newFilmRow.classList.add('text-center');

    var nameCell = newFilmRow.insertCell(0);
    nameCell.innerHTML = film.name;

    var yearCell = newFilmRow.insertCell(1);
    yearCell.innerHTML = film.year;

    var genreCell = newFilmRow.insertCell(2);
    genreCell.innerHTML = film.genre;

    var averageCell = newFilmRow.insertCell(3);
    averageCell.innerHTML = film.raiting;

    var deleteAction = document.createElement('span');
    deleteAction.className = "glyphicon glyphicon-remove clickable";
    deleteAction.style.marginLeft = "10px";
    deleteAction.addEventListener("click", function () {
        deleteFilm(film);
    });

    var editAction = document.createElement('span');
    editAction.className = "glyphicon glyphicon-pencil clickable";
    editAction.addEventListener("click", function () {
        editFilm(newFilmRow, film)
    });

    var actionsCell = newFilmRow.insertCell(4);
    actionsCell.appendChild(editAction);
    actionsCell.appendChild(deleteAction);
}

function getRowByFilmName(filmName) {
    var tableBody = document.getElementById('filmsTableBody');

    for (var i = 0; i < tableBody.rows.length; i++) {
        var actualRow = tableBody.rows[i];
        if (actualRow.cells[0].innerText == filmName)
            return actualRow;
    }
}

function filterFilms(e, filterForm) {
    e.preventDefault();

    var filteredFilms = [];
    var filterName = filterForm.nameFilter.value;
    var filterYear = filterForm.yearFilter.value;
    var filterGenre = filterForm.genreFilter.value;
    var filterRaiting = filterForm.raitingFilter.value;

    films.forEach(function (film) {
        if (filterName != "" && film.name.indexOf(filterName) == -1)
            return;

        if (filterYear != "" && film.year < Number(filterYear))
            return;

        if (filterGenre != "nofilter" && film.genre != filterGenre)
            return;

        if (filterRaiting != "" && film.raiting < Number(filterRaiting))
            return;

        filteredFilms.push(film);
    });

    renderTable(filteredFilms);
}

function renderTable(films) {

    // limpio el body de la tabla
    var tableBody = document.getElementById('filmsTableBody');
    tableBody.innerHTML = "";

    // agrego el array de films a la tabla
    films.forEach(function (film) {
        addFilmToTable(film);
    });
}

function cleanFiltersAndReRender() {
    var filterForm = document.getElementById('filterFilmsForm');

    filterForm.nameFilter.value = "";
    filterForm.yearFilter.value = "";
    filterForm.genreFilter.selectedIndex = 0;
    filterForm.raitingFilter.value = "";

    renderTable(films);
}


function deleteFilm(film) {
  filmsDataAccessObject.deleteFilm(film)
    .then(function() {
      films = films.filter(function (f) {
        return f.id != film.id;
      });

      renderTable(films);
    })
    .catch (function (error) {
      console.warn(error);

      alert("Error al eliminar pelicula.");
    });
}

function editFilm(row, film) {
    var nameInput = document.createElement('input');
    nameInput.value = film.name;
    nameInput.classList.add("form-control");
    nameInput.readOnly = true
    row.cells[0].innerHTML = '';
    row.cells[0].appendChild(nameInput);
    
    var yearInput = document.createElement('input');
    yearInput.value = film.year;
    yearInput.classList.add("form-control");
    row.cells[1].innerHTML = '';
    row.cells[1].appendChild(yearInput);


    var genreInput = document.createElement('input');
    genreInput.value = film.genre;
    genreInput.classList.add("form-control");
    row.cells[2].innerHTML = '';
    row.cells[2].appendChild(genreInput);


    var raitingInput = document.createElement('input');
    raitingInput.value = film.raiting;
    raitingInput.classList.add("form-control");
    row.cells[3].innerHTML = '';
    row.cells[3].appendChild(raitingInput);


    var saveAction = document.createElement('span');
    saveAction.className = "glyphicon glyphicon-save clickable";
    saveAction.style.marginLeft = "10px";

    var cancelAction = document.createElement('span');
    cancelAction.className = "glyphicon glyphicon-remove clickable";
    cancelAction.style.marginLeft = "10px";
    cancelAction.addEventListener("click", function () {
       cleanFiltersAndReRender();
    });

    row.cells[4].innerHTML = '';
    row.cells[4].appendChild(saveAction);
    row.cells[4].appendChild(cancelAction);

}

function orderByName(){
    var iconElement = document.getElementById('orderByName');
    if (iconElement.classList.contains('glyphicon-sort-by-alphabet-alt')){

    films.sort(function (a,b){
        var nameA = a.name.toLowerCase();
        var nameB = b.name.toLowerCase();

        if(nameA<nameB) return -1;
        if(nameA>nameB) return 1;
        return 0;
    });

    iconElement.classList.remove('glyphicon-sort-by-alphabet-alt');
    iconElement.classList.add('glyphicon-sort-by-alphabet');
}
}